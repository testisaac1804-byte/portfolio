# Harry Potter AI Diary

A physical Tom Riddle's diary built on an ESP32-C3 SuperMini with a 0.96" OLED.

## Stack
- ESP32-C3 SuperMini (PlatformIO, `esp32-c3-devkitm-1` env)
- SSD1306 0.96" OLED over I2C (SDA=10, SCL=7 — avoids C3 strapping pins)
- WiFi AP `RiddlesDiary` + captive portal (works on iOS/Android/Windows/macOS)
- OpenAI-compatible AI API (Moonshot Kimi default; endpoint + model configurable in settings)

## How it works
1. ESP32 creates a WiFi AP and serves a parchment-styled captive portal page.
2. Phone connects → portal auto-opens → user types a message.
3. The diary replies in-character (mysterious, slightly sinister Tom Riddle prompt) on the page AND on the OLED with a typewriter effect.
4. Settings (API key, endpoint, model) are stored in browser localStorage and synced to the ESP32.

## Key files
- `src/main.cpp` — firmware (~480 lines)
- `platformio.ini` — C3 + WROOM environments
- `README.md` — full pinout + usage guide

## Repo
`~/Documents/projects/harry-potter-diary/`