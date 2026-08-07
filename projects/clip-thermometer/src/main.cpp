#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "max6675.h"

// ── Pinout (works on ESP32 DevKit AND ESP32-C3) ─────────
// ESP32 DevKit V1: D4=4, D5=5, D6=6, D21=21, D22=22
// ESP32-C3 SuperMini: GPIO4=4, GPIO5=5, GPIO6=6, GPIO8=8, GPIO9=9
#if defined(ARDUINO_ESP32C3_DEV)
  #define TC_SCK    4
  #define TC_CS     6
  #define TC_SO     5
  #define OLED_SDA  8
  #define OLED_SCL  9
#else  // ESP32 DevKit / WROOM
  #define TC_SCK    4
  #define TC_CS     5
  #define TC_SO     6
  #define OLED_SDA  21
  #define OLED_SCL  22
#endif

// ── Display ─────────────────────────────────────────────
#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
#define OLED_ADDR     0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
MAX6675 thermocouple(TC_SCK, TC_CS, TC_SO);

// ── Forward declarations ───────────────────────────────
void drawScreen();

// ── State ───────────────────────────────────────────────
float currentTemp  = 0;
float maxTemp      = 0;
float minTemp      = 9999;
unsigned long lastRead = 0;

// ── Setup ───────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);   // let USB-Serial-JTAG settle

  // OLED init
  Wire.begin(OLED_SDA, OLED_SCL);
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("OLED init failed!");
    for (;;) delay(100);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Clip Thermometer");
  display.println("Hot Wire Cutter");
  display.display();
  delay(1000);

  Serial.println("Clip Thermometer ready");
}

// ── Loop ────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // Read thermocouple every 250ms
  if (now - lastRead >= 250) {
    lastRead = now;
    currentTemp = thermocouple.readCelsius();

    // Filter bogus readings (MAX6675 returns 0 or NaN when probe is disconnected)
    if (isnan(currentTemp) || currentTemp < -50 || currentTemp > 1100) {
      // Probe disconnected or bad reading — show error
      currentTemp = NAN;
    } else {
      if (currentTemp > maxTemp) maxTemp = currentTemp;
      if (currentTemp < minTemp) minTemp = currentTemp;
    }

    drawScreen();
  }

  // Also print to serial for debugging
  static unsigned long lastSerial = 0;
  if (now - lastSerial >= 1000) {
    lastSerial = now;
    if (isnan(currentTemp)) {
      Serial.println("Probe disconnected");
    } else {
      Serial.printf("Temp: %.1f °C  |  Max: %.1f °C\n", currentTemp, maxTemp);
    }
  }
}

// ── Display Drawing ─────────────────────────────────────
void drawScreen() {
  display.clearDisplay();

  // ── Top bar: title ──
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("HOT WIRE THERMOMETER");

  // Thin separator line
  display.drawLine(0, 10, 127, 10, SSD1306_WHITE);

  // ── Center: big temperature ──
  if (isnan(currentTemp)) {
    display.setTextSize(2);
    display.setCursor(10, 20);
    display.print("NO PROBE");
  } else {
    // Big number
    display.setTextSize(3);
    display.setCursor(5, 18);

    char buf[8];
    snprintf(buf, sizeof(buf), "%.0f", currentTemp);
    display.print(buf);

    // °C symbol
    display.setTextSize(2);
    display.setCursor(display.getCursorX() + 2, 20);
    display.print("o");
    display.setTextSize(2);
    display.setCursor(display.getCursorX(), 14);
    display.print("C");
  }

  // ── Bottom: min/max ──
  display.setTextSize(1);
  display.setCursor(0, 56);
  if (!isnan(currentTemp)) {
    char line[22];
    snprintf(line, sizeof(line), "MIN:%4.0f C  MAX:%4.0f C",
             minTemp > 9000 ? 0 : minTemp, maxTemp);
    display.print(line);
  }

  // ── Reset button hint ──
  display.setTextSize(1);
  display.setCursor(0, 0);  // overwrite title area for reset status
  // (don't overwrite — just redraw title above)

  display.display();
}
