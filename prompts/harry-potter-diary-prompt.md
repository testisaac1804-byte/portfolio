# Build spec — Harry Potter AI Diary (Tom Riddle's diary, as hardware)

Rebuild brief for a one-input device: you write on the page, something writes back.

## V1 — shipped (ESP32-C3 + OLED + phone portal)

- **MCU:** ESP32-C3 SuperMini (pre-soldered header), PlatformIO `esp32-c3-devkitm-1`
- **Display:** 0.96″ / 2.42″ SSD1306-family OLED, I²C, addr `0x3C` — SDA GPIO10, SCL GPIO7
  (never GPIO2/8/9: C3 strapping pins)
- **AP:** `RiddlesDiary` / `12345678`, static `192.168.4.1`
- **Captive portal:** `DNSServer` wildcard `*` → 192.168.4.1, plus explicit routes for
  `/generate_204` (Android), `/hotspot-detect.html` + `/library/test/success.html` (iOS),
  `/connecttest.txt` + `/ncsi.txt` (Windows), `/canonical.html` (Firefox), `/redirect` (Microsoft),
  and `onNotFound` → 302 to the page
- **API:** `POST /ask` (text/plain in/out) → `HTTPClient` → OpenAI-compatible endpoint;
  `POST /settings` (JSON `{key,endpoint,model}`), key held in RAM only
- **UI:** whole page in PROGMEM as `R"rawliteral(...)"` — no filesystem image
- **AI params:** 200 max tokens, temperature 0.9, 15 s timeout, `StaticJsonDocument<2048>` req / `<1024>` resp
- **Persona:** Tom Riddle Horcrux system prompt; 2–4 sentences, <300 chars, never break character
- **States:** splash → thinking (dots every 300 ms) → reply / “The ink fades…” + HTTP code
- **Libraries:** Adafruit SSD1306, Adafruit GFX, ArduinoJson
- **Artifact:** `firmware.bin` 1,026,592 B · `src/main.cpp` 579 lines / 20,320 B

## V1.5 — browser twin (the mirror)

- Canvas 560×360 (0.64 aspect), DPR-scaled, re-blit on resize
- Ink = three passes: bleed (+2.5 px, alpha .12) → body (per-segment colour jitter rgb(26–34,15–20,5–10))
  → centre line (0.3× width); width from stroke speed, 1.2–3.5 px, quadratic smoothing through midpoints
- `setPointerCapture`, touch-scroll suppressed, leaf cleared after each reply, typewriter 25–45 ms/char
- Settings in `localStorage` (`diary_settings`); key never in page source
- **Known limit:** the canvas PNG is discarded — pixels only answer “has the user written anything?”.
  Drawing alone sends a fixed “illegible handwriting” instruction. No OCR, no vision call.
- Mirror is byte-identical to `~/Desktop/harry-potter-diary.html`
  (`sha256 b04e2f6ac5c5c1e8cb7eb0d277c64a6d3ec20cc74da71e7b7138def3619839b8`, 20,363 B)

## V2 — e-paper book (in port, not flashed)

- **Board:** LilyGO T5 V2.4 — ESP32 dual-core LX6 240 MHz, 4 MB flash, no PSRAM
- **Panel:** 2.13″ SPI e-paper 122×250; DEPG0213BN (2-grey) or GDEM0213B74 (4-grey) — check which
- **Refresh:** ~2 s full, partial refresh supported; panel power gated by GPIO12; ~300 µA idle
- **Driver:** GxEPD2 (swap out Adafruit SSD1306); layout for 122 px wide ≈ 15 chars/line at readable size
- **Ink behaviour:** blank the page, partial-refresh the reply in, full refresh on page turn;
  periodically force a full refresh to clear accumulated ghosting
- **Power:** 500 mAh LiPo (502030), deep sleep between writes, voltage check before refresh (brown-out
  mid-page leaves half a sentence)
- **Input (open):** 2.13″ 4-wire resistive overlay + XPT2046 (¥11–17, 4 GPIOs) — or three buttons.
  A 14-pin “2.4″ SPI touch” module is usually ILI9341 TFT + XPT2046, i.e. LCD, not 墨水屏 — verify.
- **Cut on purpose:** phone/captive portal, buzzer (silent book), per-char typewriter (e-paper is bistable:
  the answer should simply *be there*)
- **Keep:** same persona prompt, same `POST /ask` shape, same JSON schema, same 300-char reply budget

## Verification checklist

1. `pio run -e esp32-c3-devkitm-1` clean; note `firmware.bin` size
2. Portal opens unprompted on iOS **and** Android (both probe paths)
3. `POST /ask` with no key → in-character refusal, no crash
4. Wrong key → HTTP 401 surfaced in the reply text
5. V2: partial refresh leaves <1 full-refresh of ghosting after 20 replies
6. V2: 24 h idle → no visible fade, battery delta logged
