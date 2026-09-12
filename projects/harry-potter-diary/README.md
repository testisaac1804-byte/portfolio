# Harry Potter AI Diary

**Stack:** ESP32-C3 SuperMini, SSD1306 0.96" OLED (I2C), WiFi AP + captive portal, AI API (OpenAI-compatible).

**What it does:** A physical Tom Riddle's diary. The ESP32 creates a WiFi AP (`RiddlesDiary` / `12345678`). Connect your phone, a captive portal opens a parchment-styled web page. Type a message, and the diary responds in-character — mysterious, intelligent, slightly sinister. The response appears on both the OLED display and the web page with a typewriter effect.

**Libraries:** Adafruit SSD1306, Adafruit GFX, ArduinoJson.

## Pinout (C3, avoids strapping pins GPIO2/8/9)

| Part | Pin |
|------|-----|
| OLED SDA | 10 |
| OLED SCL | 7 |
| OLED VCC | 3.3V |
| OLED GND | GND |

## How to use

1. **Build & flash:** `pio run -e esp32-c3-devkitm-1 -t upload`
2. **Connect phone** to WiFi `RiddlesDiary` (password: `12345678`)
3. Captive portal opens automatically → parchment page
4. **Configure:** Click ⚙ → enter API key, endpoint, model
5. **Ask the diary:** Type a message → tap "Ask"
6. OLED shows the diary's response with a typewriter effect

## Default AI config

- **Endpoint:** `https://api.moonshot.cn/v1/chat/completions`
- **Model:** `kimi_k3`
- **Key:** Your Kimi API key (sk-sp-...)

Any OpenAI-compatible API works — just change endpoint/model in settings.

## Features

- WiFi AP with captive portal (works on iOS, Android, Windows, macOS)
- Parchment-styled web UI with floating candle particles
- Typewriter effect on responses
- OLED shows splash screen → response → error states
- Settings saved in browser localStorage + synced to ESP32
- Tom Riddle system prompt: charismatic, manipulative, never breaks character

## Repo

`~/Documents/projects/harry-potter-diary/`
- `src/main.cpp` — firmware (~480 lines)
- `platformio.ini` — C3 and WROOM environments
- `data/` — (reserved for future SPIFFS assets)