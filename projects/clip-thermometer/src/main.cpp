#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "max6675.h"

// ── Pinout (avoids C3 strapping pins GPIO2/8/9) ─────────
#if defined(ARDUINO_ESP32C3_DEV)
  #define TC_SCK     4
  #define TC_CS      6
  #define TC_SO      5
  #define OLED_SDA   10
  #define OLED_SCL   7
  #define BUZZER_PIN 1
  #define BUTTON_PIN 3
#else
  #define TC_SCK     4
  #define TC_CS      5
  #define TC_SO      6
  #define OLED_SDA  21
  #define OLED_SCL  22
  #define BUZZER_PIN 2
  #define BUTTON_PIN 3
#endif

// ── Display ─────────────────────────────────────────────
#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
#define OLED_ADDR     0x3C

// ── WiFi AP ─────────────────────────────────────────────
#define AP_SSID      "ClipThermo"
#define AP_PASS      "12345678"

// ── Targets ─────────────────────────────────────────────
#define TARGET_COUNT  4
float targets[TARGET_COUNT] = { 200, 250, 300, 350 };
int   currentTarget = 2;  // default 300°C
float maxSafeTemp   = 400;

// ── Globals ─────────────────────────────────────────────
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
MAX6675 thermocouple(TC_SCK, TC_CS, TC_SO);
WebServer server(80);
DNSServer dnsServer;

float currentTemp   = NAN;
float maxTemp       = 0;
float minTemp       = 9999;
float lastTemp      = 0;
float heatRate      = 0;
bool  targetReached = false;
bool  overheated    = false;

// ── Button state ────────────────────────────────────────
bool  btnPressed     = false;
unsigned long btnDownTime  = 0;
unsigned long lastRelease  = 0;
bool  graphMode      = false;
bool  useFahrenheit  = false;   // toggle °C/°F

// ── Conversion helper ───────────────────────────────────
float toDisplay(float celsius) {
  return useFahrenheit ? celsius * 9.0 / 5.0 + 32.0 : celsius;
}
const char* unitStr() { return useFahrenheit ? "F" : "C"; }

// ── Graph buffer ────────────────────────────────────────
#define GRAPH_H  40
int graphY[128];
int graphIdx   = 0;
int graphCount = 0;

// ── Timing ──────────────────────────────────────────────
unsigned long lastRead    = 0;
unsigned long lastRate    = 0;
unsigned long lastDisplay = 0;
unsigned long lastGraph   = 0;

// ── Forward declarations ───────────────────────────────
void drawScreen();
void drawGraph();
void splashScreen();
void beep(int ms);
void longBeep();
void doubleBeep();
String jsonData();

// ── Setup ───────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);

  // OLED
  Wire.begin(OLED_SDA, OLED_SCL);
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("OLED init failed!");
    for (;;) delay(100);
  }
  display.clearDisplay();
  display.display();

  // Button + buzzer
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Graph buffer
  for (int i = 0; i < 128; i++) graphY[i] = -1;

  // WiFi AP
  WiFi.softAP(AP_SSID, AP_PASS);
  dnsServer.start(53, "*", WiFi.softAPIP());
  Serial.printf("WiFi AP: %s / %s\n", AP_SSID, AP_PASS);
  Serial.print("IP: ");
  Serial.println(WiFi.softAPIP());

  // Web routes
  server.on("/", []() {
    server.send(200, "text/html", R"raw(<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Clip Thermometer</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#0a0a0a;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.temp{font-size:120px;font-weight:300;line-height:1}
.unit{font-size:40px;opacity:0.5}
.status{padding:6px 16px;border-radius:20px;font-size:14px;margin:10px 0;font-weight:600}
.status.heating{background:#ff6b35;color:#000}
.status.ready{background:#00d26a;color:#000}
.status.overheat{background:#ff1a1a;color:#fff;animation:pulse 1s infinite}
.status.noprobe{background:#555;color:#999}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
.info{display:flex;gap:30px;margin-top:20px;font-size:16px;opacity:0.7}
.info span{text-align:center}
.info .val{font-size:24px;font-weight:600;opacity:1}
.tick{font-size:12px;opacity:0.3;margin-top:20px}
</style></head><body>
<div id="status" class="status">--</div>
<div><span class="temp" id="t">--</span><span class="unit" id="unit">°C</span></div>
<div class="info">
<span>Target<br><span class="val" id="tg">--</span>°C</span>
<span>Rate<br><span class="val" id="r">--</span>/s</span>
<span>Max<br><span class="val" id="mx">--</span>°C</span>
</div>
<div class="tick" id="tick">--</div>
<script>
function update(){fetch('/data').then(r=>r.json()).then(d=>{
 document.getElementById('t').textContent = d.c!=null ? Math.round(d.cf) : '--';
 document.getElementById('unit').textContent = '°'+d.unit;
 if(d.c==null){document.getElementById('status').className='status noprobe';document.getElementById('status').textContent='NO PROBE'}
 else if(d.over){document.getElementById('status').className='status overheat';document.getElementById('status').textContent='OVERHEAT!'}
 else if(d.c>=d.tg){document.getElementById('status').className='status ready';document.getElementById('status').textContent='READY'}
 else{document.getElementById('status').className='status heating';document.getElementById('status').textContent='HEATING'}
 document.getElementById('tg').textContent=Math.round(d.tg);
 document.getElementById('r').textContent=(d.r>=0?'+':'')+d.r.toFixed(1);
 document.getElementById('mx').textContent=Math.round(d.mx);
 document.getElementById('tick').textContent=new Date().toLocaleTimeString();
}).catch(e=>{});setTimeout(update,1000)};update();
</script></body></html>)raw");
  });

  server.on("/data", []() {
    server.send(200, "application/json", jsonData());
  });

  server.begin();

  // Captive portal detection — phones check these URLs
  server.onNotFound([]() {
    server.sendHeader("Location", "/", true);
    server.send(302, "text/plain", "");
  });

  splashScreen();
  delay(1000);

  Serial.println("Clip Thermometer v3 ready");
}

// ── Main Loop ───────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // ── Button ──
  bool down = (digitalRead(BUTTON_PIN) == LOW);
  if (down && !btnPressed) {
    btnPressed = true;
    btnDownTime = now;
  } else if (down && btnPressed) {
    // Long press (>1s) = toggle graph mode
    if (now - btnDownTime > 1000 && !graphMode) {
      graphMode = true;
      beep(30);
      delay(50);
      beep(30);
    }
  } else if (!down && btnPressed) {
    btnPressed = false;
    unsigned long pressDuration = now - btnDownTime;
    unsigned long sinceLast = now - lastRelease;
    lastRelease = now;

    if (pressDuration < 1000) {
      if (sinceLast < 400) {
        // Double-click = toggle °C/°F
        useFahrenheit = !useFahrenheit;
        beep(30); delay(50); beep(30); delay(50); beep(30);
      } else {
        // Single short press = cycle target
        currentTarget = (currentTarget + 1) % TARGET_COUNT;
        targetReached = false;
        overheated = false;
        beep(50);
      }
    }
    if (graphMode) {
      graphMode = false;
      beep(30);
    }
  }

  // ── Read temperature (4Hz) ──
  if (now - lastRead >= 250) {
    lastRead = now;
    float raw = thermocouple.readCelsius();

    if (isnan(raw) || raw < -50 || raw > 1100) {
      currentTemp = NAN;
    } else {
      currentTemp = raw;
      if (currentTemp > maxTemp) maxTemp = currentTemp;
      if (currentTemp < minTemp && currentTemp > 0) minTemp = currentTemp;
    }

    // Graph buffer (1 sample every 500ms)
    if (now - lastGraph >= 500) {
      lastGraph = now;
      if (!isnan(currentTemp)) {
        int graphMax = useFahrenheit ? 932 : 500;
        int y = map(constrain((int)toDisplay(currentTemp), 0, graphMax), 0, graphMax, GRAPH_H - 1, 0);
        graphY[graphIdx] = y;
        graphIdx = (graphIdx + 1) % 128;
        if (graphCount < 128) graphCount++;
      } else {
        graphY[graphIdx] = -1;
        graphIdx = (graphIdx + 1) % 128;
      }
    }
  }

  // ── Heating rate (1Hz) ──
  if (now - lastRate >= 1000 && lastRate > 0) {
    float dt = (now - lastRate) / 1000.0;
    if (!isnan(currentTemp) && !isnan(lastTemp)) {
      heatRate = (currentTemp - lastTemp) / dt;
    }
    lastTemp = currentTemp;
    lastRate = now;
  }
  if (lastRate == 0) { lastRate = now; lastTemp = currentTemp; }

  // ── Alarms ──
  if (!isnan(currentTemp) && !targetReached && !overheated) {
    if (currentTemp >= targets[currentTarget]) {
      targetReached = true;
      doubleBeep();
    }
    if (currentTemp >= maxSafeTemp) {
      overheated = true;
      longBeep();
    }
  }

  // ── Display ──
  if (now - lastDisplay >= 250) {
    lastDisplay = now;
    if (graphMode) drawGraph();
    else drawScreen();
  }

  // ── Web server ──
  server.handleClient();
  dnsServer.processNextRequest();
}

// ── Splash Screen ───────────────────────────────────────
void splashScreen() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(10, 5);
  display.println("CLIP THERMOMETER");
  display.drawLine(0, 17, 127, 17, SSD1306_WHITE);
  display.setCursor(10, 22);
  display.println("Hot Wire Cutter v3");
  display.setCursor(10, 32);
  display.print("WiFi: " AP_SSID);
  display.setCursor(10, 42);
  display.print("TARGET: ");
  display.print((int)targets[currentTarget]);
  display.print("C");

  display.setCursor(10, 55);
  display.print("Hold btn = graph");
  display.display();
}

// ── Normal Display ──────────────────────────────────────
void drawScreen() {
  display.clearDisplay();

  // Status bar (row 0)
  display.setTextSize(1);
  display.setCursor(0, 0);
  if (isnan(currentTemp))          display.print("NO PROBE");
  else if (overheated)             display.print("OVERHEAT!");
  else if (currentTemp >= targets[currentTarget]) display.print("READY");
  else                             display.print("HEATING");

  // Heating rate (top right)
  if (!isnan(currentTemp)) {
    char buf[12];
    snprintf(buf, sizeof(buf), "%+.1f/s", heatRate);
    int w = strlen(buf) * 6;
    display.setCursor(127 - w, 0);
    display.print(buf);
  }

  // Big temp (centered, rows ~12-48)
  if (isnan(currentTemp)) {
    display.setTextSize(2);
    display.setCursor(10, 24);
    display.print("NO PROBE");
  } else {
    float showTemp = toDisplay(currentTemp);
    display.setTextSize(3);
    char buf[6];
    snprintf(buf, sizeof(buf), "%.0f", showTemp);
    int w = strlen(buf) * 18;
    int x = (128 - w - 20) / 2;
    if (x < 0) x = 5;
    display.setCursor(x, 15);
    display.print(buf);

    // °C/°F
    display.setTextSize(2);
    display.setCursor(x + w + 2, 17);
    display.print(useFahrenheit ? "F" : "o");
    if (!useFahrenheit) {
      display.setCursor(x + w + 10, 12);
      display.print("C");
    }

    // Target indicator
    display.setTextSize(1);
    display.setCursor(2, 10);
    display.print("T:");
    display.print((int)toDisplay(targets[currentTarget]));
    if (currentTemp >= targets[currentTarget]) display.print(" V");
  }

  // Bottom bar: min / max
  display.setTextSize(1);
  display.setCursor(0, 56);
  if (!isnan(currentTemp)) {
    char line[22];
    snprintf(line, sizeof(line), "L:%3.0f  H:%4.0f  M:%4.0f",
             minTemp > 9000 ? 0 : toDisplay(minTemp),
             toDisplay(maxTemp), toDisplay(maxSafeTemp));
    display.print(line);
  }

  display.display();
}

// ── Graph Display ───────────────────────────────────────
void drawGraph() {
  display.clearDisplay();

  // Title
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("TEMP GRAPH  ");
  display.print(useFahrenheit ? "32-932F" : "0-500C");

  // Current temp overlay
  if (!isnan(currentTemp)) {
    char buf[10];
    snprintf(buf, sizeof(buf), "%.0f%s", toDisplay(currentTemp), unitStr());
    int w = strlen(buf) * 6;
    display.setCursor(127 - w, 0);
    display.print(buf);
  }

  // Draw the scrolling graph
  int graphTop = 10;
  int graphH = GRAPH_H;
  int graphMax = useFahrenheit ? 932 : 500;

  // Grid lines
  for (int t = 0; t <= graphMax; t += graphMax / 5) {
    int gy = graphTop + map(t, 0, graphMax, graphH - 1, 0);
    if (gy >= graphTop && gy <= graphTop + graphH) {
      for (int x = 0; x < 128; x += 4)
        display.drawPixel(x, gy, SSD1306_WHITE);
    }
  }

  // Data line
  for (int i = 0; i < 128; i++) {
    int idx = (graphIdx - 1 - i + 256) % 128;
    int y = graphY[idx];
    if (y >= 0) {
      int px = 127 - i;
      int py = graphTop + y;
      if (py >= graphTop && py < graphTop + graphH)
        display.drawPixel(px, py, SSD1306_WHITE);
      // Draw thicker line (vertical neighbor)
      if (py + 1 < graphTop + graphH)
        display.drawPixel(px, py + 1, SSD1306_WHITE);
    }
  }

  // Bottom info
  display.setTextSize(1);
  display.setCursor(0, 56);
  if (!isnan(currentTemp)) {
    char line[25];
    snprintf(line, sizeof(line), "T:%.0f  L:%.0f  H:%.0f",
             toDisplay(targets[currentTarget]),
             minTemp > 9000 ? 0 : toDisplay(minTemp),
             toDisplay(maxTemp));
    display.print(line);
  }

  display.display();
}

// ── JSON API ────────────────────────────────────────────
String jsonData() {
  char buf[250];
  snprintf(buf, sizeof(buf),
    "{\"c\":%s,\"cf\":%s,\"tg\":%.0f,\"r\":%.2f,\"mn\":%s,\"mx\":%s,\"safe\":%.0f,\"over\":%s,\"rdy\":%s,\"unit\":\"%s\"}",
    isnan(currentTemp) ? "null" : String(currentTemp, 1).c_str(),
    isnan(currentTemp) ? "null" : String(toDisplay(currentTemp), 1).c_str(),
    toDisplay(targets[currentTarget]),
    heatRate,
    minTemp > 9000 ? "null" : String(toDisplay(minTemp), 1).c_str(),
    String(toDisplay(maxTemp), 1).c_str(),
    toDisplay(maxSafeTemp),
    overheated ? "true" : "false",
    (!isnan(currentTemp) && currentTemp >= targets[currentTarget]) ? "true" : "false",
    unitStr()
  );
  return String(buf);
}

// ── Buzzer ──────────────────────────────────────────────
void beep(int ms) {
  digitalWrite(BUZZER_PIN, HIGH); delay(ms);
  digitalWrite(BUZZER_PIN, LOW);
}
void longBeep() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH); delay(200);
    digitalWrite(BUZZER_PIN, LOW);  delay(100);
  }
}
void doubleBeep() {
  digitalWrite(BUZZER_PIN, HIGH); delay(100);
  digitalWrite(BUZZER_PIN, LOW);  delay(50);
  digitalWrite(BUZZER_PIN, HIGH); delay(200);
  digitalWrite(BUZZER_PIN, LOW);
}
