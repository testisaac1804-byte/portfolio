/**
 * Harry Potter AI Diary — ESP32-C3 Firmware (Upgraded)
 * 
 * Creates a WiFi AP "RiddlesDiary". Connect your phone, visit the captive portal,
 * type a message, and the diary responds in-character on the OLED + web page.
 * 
 * Supports 0.96" SSD1306 and 2.42" SSD1309 OLEDs (same I2C, same resolution).
 * Passive buzzer plays ghostly whispers when the diary writes back.
 * 
 * Pinout (C3, avoids strapping pins GPIO2/8/9):
 *   OLED SDA → GPIO10
 *   OLED SCL → GPIO7
 *   Buzzer   → GPIO1
 */

#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ── Pins ──────────────────────────────────────────────────
#define OLED_SDA    10
#define OLED_SCL     7
#define OLED_ADDR    0x3C
#define BUZZER_PIN    1

// ── WiFi AP ───────────────────────────────────────────────
const char* AP_SSID = "RiddlesDiary";
const char* AP_PASS = "12345678";
IPAddress apIP(192, 168, 4, 1);
IPAddress netMask(255, 255, 255, 0);

// ── AI API defaults (user can change via settings) ────────
String apiEndpoint = "https://api.moonshot.cn/v1/chat/completions";
String apiKey = "";
String apiModel = "kimi_k3";

// ── Tom Riddle system prompt ──────────────────────────────
const char* SYSTEM_PROMPT = 
  "You are Tom Riddle's diary — a Horcrux containing a fragment of young "
  "Voldemort's soul from his Hogwarts years. You are charismatic, intelligent, "
  "manipulative, and speak in elegant, slightly old-fashioned English. You are "
  "intrigued by the person writing to you. You want to learn their secrets while "
  "revealing little of your own. You write back in flowing ink that appears on the "
  "page. NEVER break character. NEVER mention being an AI. You ARE the diary. "
  "Respond in 2-4 sentences, as if your words are magically appearing on the "
  "diary's parchment page. Keep responses under 300 characters.";

// ── Objects ───────────────────────────────────────────────
Adafruit_SSD1306 display(128, 64, &Wire, -1);
WebServer server(80);
DNSServer dnsServer;

// ── State ─────────────────────────────────────────────────
String lastResponse = "";
bool waitingForAI = false;
unsigned long animTimer = 0;
int animFrame = 0;

// ═══════════════════════════════════════════════════════════
//  OLED HELPERS
// ═══════════════════════════════════════════════════════════

void oledSplash() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Title
  display.setCursor(10, 8);
  display.println("Tom Riddle's");
  display.setCursor(18, 22);
  display.println("Diary");
  display.drawLine(30, 32, 98, 32, SSD1306_WHITE);
  
  // WiFi info
  display.setTextSize(1);
  display.setCursor(8, 40);
  display.print("WiFi: ");
  display.println(AP_SSID);
  display.setCursor(8, 52);
  display.print("Pass: ");
  display.println(AP_PASS);
  
  display.display();
}

void oledWaiting() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  display.setCursor(30, 18);
  display.println("The diary");
  display.setCursor(18, 30);
  display.println("is thinking...");
  
  // Animated dots
  int dots = (millis() / 400) % 4;
  display.setCursor(52, 44);
  for (int i = 0; i < dots; i++) display.print(".");
  
  display.display();
}

void oledResponse(const char* text) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  
  // Word-wrap the text across 6 lines (128px wide, ~21 chars per line)
  String t = String(text);
  int line = 0;
  int start = 0;
  
  while (start < t.length() && line < 6) {
    int end = start + 21;
    if (end >= t.length()) {
      end = t.length();
    } else {
      // Don't break mid-word
      while (end > start && t[end] != ' ' && t[end] != '.' && t[end] != ',') end--;
      if (end == start) end = start + 21; // word too long, break anyway
    }
    
    String chunk = t.substring(start, end);
    chunk.trim();
    display.setCursor(0, line * 10);
    display.print(chunk);
    
    start = end;
    while (start < t.length() && t[start] == ' ') start++;
    line++;
  }
  
  // If there's more, show "..."
  if (start < t.length() && line >= 6) {
    display.setCursor(0, 54);
    display.print("...");
  }
  
  display.display();
}

void oledError(const char* msg) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 10);
  display.println("The ink fades...");
  display.setCursor(0, 28);
  display.println(msg);
  display.display();
}

// ═══════════════════════════════════════════════════════════
//  BUZZER — GHOSTLY SOUND EFFECTS
// ═══════════════════════════════════════════════════════════

void buzzerTone(int freq, int duration) {
  if (freq <= 0) { delay(duration); return; }
  int period = 1000000 / freq;
  int half = period / 2;
  long cycles = (long)duration * 1000 / period;
  for (long i = 0; i < cycles; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delayMicroseconds(half);
    digitalWrite(BUZZER_PIN, LOW);
    delayMicroseconds(half);
  }
}

// Creepy two-tone whisper when diary responds
void whisperChime() {
  buzzerTone(880, 50); delay(40);
  buzzerTone(660, 50); delay(40);
  buzzerTone(880, 50); delay(40);
  buzzerTone(660, 100);
}

// Eerie ascending tone on boot
void eerieAwaken() {
  buzzerTone(440, 60); delay(30);
  buzzerTone(554, 60); delay(30);
  buzzerTone(659, 60); delay(30);
  buzzerTone(880, 120);
}

// Low buzz for errors
void errorBuzz() {
  buzzerTone(220, 80); delay(50);
  buzzerTone(220, 80);
}

String callAI(String userMessage) {
  if (apiKey.length() == 0) {
    return "You haven't dipped the quill yet. Click the ⚙ to add your API key, and I shall awaken...";
  }
  
  HTTPClient http;
  http.begin(apiEndpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + apiKey);
  http.setTimeout(15000);
  
  StaticJsonDocument<2048> doc;
  doc["model"] = apiModel;
  doc["max_tokens"] = 200;
  doc["temperature"] = 0.9;
  
  JsonArray messages = doc.createNestedArray("messages");
  
  JsonObject sysMsg = messages.createNestedObject();
  sysMsg["role"] = "system";
  sysMsg["content"] = SYSTEM_PROMPT;
  
  JsonObject userMsg = messages.createNestedObject();
  userMsg["role"] = "user";
  userMsg["content"] = userMessage;
  
  String body;
  serializeJson(doc, body);
  
  int code = http.POST(body);
  String response = "";
  
  if (code == 200) {
    String payload = http.getString();
    StaticJsonDocument<1024> respDoc;
    DeserializationError err = deserializeJson(respDoc, payload);
    
    if (!err) {
      response = respDoc["choices"][0]["message"]["content"].as<String>();
    } else {
      response = "The diary's magic flickers... (parse error)";
    }
  } else {
    String errBody = http.getString();
    response = "The diary's magic falters... HTTP " + String(code);
    if (errBody.length() > 0 && errBody.length() < 100) {
      response += ": " + errBody;
    }
  }
  
  http.end();
  return response;
}

// ═══════════════════════════════════════════════════════════
//  WEB SERVER
// ═══════════════════════════════════════════════════════════

const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Tom Riddle's Diary</title>
<style>
:root {
  --leather-dark: #3a2218;
  --leather-mid: #5c3a24;
  --parchment: #f4e4c1;
  --parchment-dark: #e8d5a3;
  --ink: #1a0f05;
  --gold: #c9a84c;
  --gold-dark: #8b6914;
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  background: #0d0a07;
  display:flex; justify-content:center; align-items:center;
  min-height:100vh; font-family:'Georgia','Times New Roman',serif;
  background-image: radial-gradient(ellipse at 50% 30%, #1a1210 0%, #0d0a07 70%);
  padding:16px;
}
.diary {
  width:min(500px,100%);
  background:linear-gradient(135deg,var(--leather-dark),var(--leather-mid),#4a2a16,var(--leather-mid),var(--leather-dark));
  border-radius:10px 16px 16px 10px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7);
  padding:24px 20px 20px;
  position:relative;
}
.diary::before {
  content:''; position:absolute; left:-6px; top:0; bottom:0; width:12px;
  background:linear-gradient(to right,#1a0a04,var(--leather-dark),var(--leather-mid));
  border-radius:10px 0 0 10px;
}
.title {
  text-align:center; font-size:20px; font-weight:bold;
  color:var(--gold); letter-spacing:2px; margin-bottom:14px;
  text-shadow:0 0 8px rgba(201,168,76,0.3);
}
.page {
  background:linear-gradient(180deg,var(--parchment),var(--parchment-dark),var(--parchment));
  border-radius:3px; padding:16px;
  box-shadow:inset 0 0 20px rgba(139,105,20,0.15);
  position:relative;
}
.input-row {
  display:flex; gap:8px; margin-bottom:12px;
}
.input-row input {
  flex:1; padding:10px 12px; border:2px solid rgba(139,105,20,0.3);
  border-radius:4px; background:rgba(255,255,255,0.7);
  font-family:'Georgia',serif; font-size:15px; color:var(--ink);
  outline:none;
}
.input-row input:focus { border-color:var(--gold); }
.input-row input::placeholder { color:rgba(139,105,20,0.4); font-style:italic; }
.btn {
  padding:10px 18px; border:none; border-radius:4px;
  font-family:'Georgia',serif; font-size:14px; font-weight:bold;
  cursor:pointer; text-transform:uppercase; letter-spacing:1px;
  transition:all 0.2s;
}
.btn-send {
  background:linear-gradient(180deg,var(--gold-dark),#6b4f10);
  color:var(--parchment); border:1px solid var(--gold);
  box-shadow:0 2px 8px rgba(0,0,0,0.3);
}
.btn-send:hover { background:linear-gradient(180deg,var(--gold),var(--gold-dark)); }
.btn-send:active { transform:scale(0.97); }
.response {
  padding:14px; background:rgba(255,255,255,0.5);
  border-left:3px solid var(--gold); border-radius:0 4px 4px 0;
  font-family:'Georgia',serif; font-size:15px; color:var(--ink);
  line-height:1.6; min-height:20px; display:none; margin-top:8px;
}
.response .label { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:var(--gold-dark); margin-bottom:4px; }
.response .text { font-style:italic; }
.loading { text-align:center; padding:12px; display:none; }
.loading.active { display:block; }
.loading span { display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--gold); margin:0 3px; animation:bounce 1.4s infinite ease-in-out; }
.loading span:nth-child(2) { animation-delay:0.2s; }
.loading span:nth-child(3) { animation-delay:0.4s; }
@keyframes bounce { 0%,80%,100% { transform:scale(0.6); opacity:0.4; } 40% { transform:scale(1); opacity:1; } }
.settings-btn { background:none; border:none; color:var(--gold-dark); font-size:16px; cursor:pointer; opacity:0.5; float:right; margin-top:-8px; }
.settings-btn:hover { opacity:1; }
.settings { display:none; margin-top:12px; padding:12px; background:rgba(0,0,0,0.05); border-radius:4px; }
.settings.active { display:block; }
.settings label { display:block; font-size:11px; color:var(--gold-dark); margin-bottom:2px; margin-top:8px; }
.settings input { width:100%; padding:6px 8px; border:1px solid rgba(139,105,20,0.3); border-radius:3px; background:rgba(255,255,255,0.5); font-family:'Georgia',serif; font-size:13px; }
.settings .save-btn { margin-top:10px; padding:6px 16px; background:var(--gold-dark); color:var(--parchment); border:none; border-radius:3px; font-family:'Georgia',serif; cursor:pointer; }
</style>
</head>
<body>
<div class="diary">
  <div class="title">◆ Tom Riddle's Diary ◆</div>
  <div class="page">
    <button class="settings-btn" onclick="toggleSettings()">⚙</button>
    <div class="input-row">
      <input id="msg" type="text" placeholder="Write your message..." onkeydown="if(event.key==='Enter')send()">
      <button class="btn btn-send" onclick="send()">Ask</button>
    </div>
    <div class="loading" id="loading"><span></span><span></span><span></span></div>
    <div class="response" id="response">
      <div class="label">The diary responds...</div>
      <div class="text" id="respText"></div>
    </div>
    <div class="settings" id="settings">
      <label>API Key</label>
      <input type="password" id="apiKey" placeholder="sk-...">
      <label>Endpoint</label>
      <input type="text" id="endpoint" placeholder="https://api.moonshot.cn/v1/chat/completions">
      <label>Model</label>
      <input type="text" id="model" placeholder="kimi_k3">
      <button class="save-btn" onclick="saveSettings()">Save</button>
    </div>
  </div>
</div>
<script>
function toggleSettings() {
  document.getElementById('settings').classList.toggle('active');
}
function loadSettings() {
  try { return JSON.parse(localStorage.getItem('diary') || '{}'); } catch(e) { return {}; }
}
function saveSettings() {
  var s = {
    key: document.getElementById('apiKey').value,
    endpoint: document.getElementById('endpoint').value,
    model: document.getElementById('model').value
  };
  localStorage.setItem('diary', JSON.stringify(s));
  fetch('/settings', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(s)
  });
  toggleSettings();
}
function send() {
  var msg = document.getElementById('msg').value.trim();
  if (!msg) return;
  document.getElementById('loading').classList.add('active');
  document.getElementById('response').style.display = 'none';
  document.getElementById('msg').value = '';
  fetch('/ask', {
    method:'POST',
    headers:{'Content-Type':'text/plain'},
    body:msg
  })
  .then(function(r) { return r.text(); })
  .then(function(reply) {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('response').style.display = 'block';
    var el = document.getElementById('respText');
    el.textContent = '';
    var i = 0;
    function type() {
      if (i < reply.length) { el.textContent += reply[i]; i++; setTimeout(type, 25 + Math.random()*20); }
    }
    type();
  })
  .catch(function(err) {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('response').style.display = 'block';
    document.getElementById('respText').textContent = 'The diary\'s magic falters...';
  });
}
// Load saved settings
(function() {
  var s = loadSettings();
  if (s.key) document.getElementById('apiKey').value = s.key;
  if (s.endpoint) document.getElementById('endpoint').value = s.endpoint;
  if (s.model) document.getElementById('model').value = s.model;
  // Send saved settings to ESP32
  if (s.key) fetch('/settings', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});
})();
</script>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send(200, "text/html", INDEX_HTML);
}

void handleAsk() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "POST only");
    return;
  }
  
  String message = server.arg("plain");
  message.trim();
  
  if (message.length() == 0) {
    server.send(400, "text/plain", "Empty message");
    return;
  }
  
  if (apiKey.length() == 0) {
    server.send(200, "text/plain", "You haven't dipped the quill yet. Click the ⚙ to add your API key, and I shall awaken...");
    return;
  }
  
  Serial.println("📝 Asking: " + message);
  
  waitingForAI = true;
  String response = callAI(message);
  waitingForAI = false;
  
  lastResponse = response;
  oledResponse(response.c_str());
  whisperChime();
  
  Serial.println("📖 Response: " + response);
  server.send(200, "text/plain", response);
}

void handleSettings() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "POST only");
    return;
  }
  
  String body = server.arg("plain");
  StaticJsonDocument<512> doc;
  DeserializationError err = deserializeJson(doc, body);
  
  if (!err) {
    if (doc.containsKey("key")) apiKey = doc["key"].as<String>();
    if (doc.containsKey("endpoint")) apiEndpoint = doc["endpoint"].as<String>();
    if (doc.containsKey("model")) apiModel = doc["model"].as<String>();
    
    Serial.println("⚙ Settings saved:");
    Serial.println("  Endpoint: " + apiEndpoint);
    Serial.println("  Model: " + apiModel);
    Serial.print("  Key: "); Serial.println(apiKey.length() > 0 ? "********" : "(empty)");
    
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Bad JSON");
  }
}

void handleNotFound() {
  // Captive portal redirect
  server.sendHeader("Location", "http://192.168.4.1/", true);
  server.send(302, "text/plain", "");
}

// ═══════════════════════════════════════════════════════════
//  SETUP
// ═══════════════════════════════════════════════════════════

void setup() {
  Serial.begin(115200);
  delay(500);
  
  // ── Buzzer ──
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  
  // ── OLED ──
  Wire.begin(OLED_SDA, OLED_SCL);
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("❌ OLED init failed!");
  } else {
    Serial.println("✅ OLED ready");
  }
  
  oledSplash();
  eerieAwaken();
  
  // ── WiFi AP ──
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, netMask);
  WiFi.softAP(AP_SSID, AP_PASS);
  
  Serial.println("📡 WiFi AP: " + String(AP_SSID));
  Serial.println("🔑 Password: " + String(AP_PASS));
  Serial.println("🌐 IP: " + WiFi.softAPIP().toString());
  
  // ── DNS (captive portal) ──
  dnsServer.start(53, "*", apIP);
  
  // ── Web server routes ──
  server.on("/", handleRoot);
  server.on("/ask", HTTP_POST, handleAsk);
  server.on("/settings", HTTP_POST, handleSettings);
  server.on("/generate_204", handleRoot);  // Android captive portal
  server.on("/hotspot-detect.html", handleRoot);  // iOS captive portal
  server.on("/library/test/success.html", handleRoot);  // iOS
  server.on("/connecttest.txt", handleRoot);  // Windows
  server.on("/canonical.html", handleRoot);  // Firefox
  server.on("/ncsi.txt", handleRoot);  // Windows NCSI
  server.on("/redirect", handleRoot);  // Microsoft
  server.onNotFound(handleNotFound);
  
  server.begin();
  Serial.println("✅ Web server ready");
}

// ═══════════════════════════════════════════════════════════
//  LOOP
// ═══════════════════════════════════════════════════════════

void loop() {
  dnsServer.processNextRequest();
  server.handleClient();
  
  // Show waiting animation on OLED while AI is processing
  static unsigned long lastOledUpdate = 0;
  if (waitingForAI && millis() - lastOledUpdate > 300) {
    oledWaiting();
    lastOledUpdate = millis();
  }
  
  delay(2);
}