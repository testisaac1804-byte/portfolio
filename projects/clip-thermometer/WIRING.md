# No-Solder Breadboard Wiring

Uses an ESP32 DevKit (pre-soldered male pins) plugged into a breadboard.
MAX6675 and OLED modules use female-female dupont wires pushed into through-holes.

```
┌────────────────── BREADBOARD ──────────────────────┐
│                                                     │
│   ESP32 DevKit (pre-soldered, plugged into board)   │
│   ┌──────────────────────────────────────┐          │
│   │  o 3V3  ───────────┬─── MAX6675 VCC  │          │
│   │  o GND  ───────┬───┴─── MAX6675 GND  │          │
│   │  o D4   ───────┼─────── MAX6675 SCK  │          │
│   │  o D5   ───────┼─────── MAX6675 SO   │          │
│   │  o D6   ───────┼─────── MAX6675 CS   │          │
│   │  o D21  ───────┼─────── OLED SDA     │          │
│   │  o D22  ───────┼─────── OLED SCL     │          │
│   │  o 3V3  ───────┴──┬──── OLED VCC     │          │
│   │  o GND  ──────────┴──── OLED GND     │          │
│   └──────────────────────────────────────┘          │
│                                                     │
│   MAX6675 Module                SSD1306 OLED        │
│   ┌──────────────┐          ┌──────────────┐        │
│   │ ·· VCC  GND  │          │ VCC  GND     │        │
│   │ ·· SCK  SO   │          │ SCL  SDA     │        │
│   │ ·· CS        │          └──────────────┘        │
│   │ ╔══════════╗ │                                  │
│   │ ║ Screw    ║ │  ← thermocouple goes here        │
│   │ ║ terminals║ │     red → +, blue → -            │
│   │ ╚══════════╝ │                                  │
│   └──────────────┘                                  │
│                                                     │
└─────────────────────────────────────────────────────┘

ESP32 DevKit pin mapping (different from C3 SuperMini!):
  GPIO4  = D4   (MAX6675 SCK)
  GPIO5  = D5   (MAX6675 SO)
  GPIO6  = D6   (MAX6675 CS)
  GPIO21 = D21  (OLED SDA)
  GPIO22 = D22  (OLED SCL)
```

## What You Need — Zero Soldering

| Part | Notes |
|------|-------|
| **ESP32 DevKit V1** (WROOM-32D) | Already has male pins soldered — plugs into breadboard |
| **MAX6675 module** | Push female dupont wires into holes (friction fit) |
| **SSD1306 OLED module** | Push female dupont wires into holes |
| **Breadboard** (400 or 830 tie-points) | Standard |
| **Female-female dupont wires** (10x) | Connect from ESP32 male pins to module holes |
| **K-type thermocouple** (comes with MAX6675 kit) | Screws into MAX6675 terminals — no solder |
| **Micro USB cable** | Power |

### Why ESP32 DevKit instead of C3 SuperMini?
- DevKit comes with headers **pre-soldered** — just plug into breadboard
- C3 SuperMini needs you to solder the pins on first

## Probe Clip (No 3D Printer Needed)

Skip the 3D printed clip. Instead:
- **Kapton tape** — tape the thermocouple bead directly to the hot wire (handles 400°C)
- **Binder clip** — clip the probe wire to the cutter frame, bend bead to touch the wire
- **Small screw + washer** — clamp bead against the wire

Kapton tape is the easiest: wrap once around the hot wire with the bead sandwiched between tape and wire.
