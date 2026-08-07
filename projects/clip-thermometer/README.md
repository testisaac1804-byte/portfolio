# Clip Thermometer — Hot Wire Cutter Temperature Measurer

DIY clip-on K-type thermocouple thermometer. **Zero soldering** — everything plugs into a breadboard.

## Bill of Materials (~$7.50 total, no soldering)

| Part | Cost | Notes |
|------|------|-------|
| ESP32 DevKit V1 (WROOM) | ~$3 | Pre-soldered male pins — plugs into breadboard |
| MAX6675 + K-type thermocouple | ~$3 | AliExpress kit, screw terminals for probe |
| 0.96" SSD1306 OLED (I2C) | ~$1.50 | Blue or white |
| Breadboard (400 tie-points) | ~$1 | Standard |
| Female-female dupont wires (10x) | ~$1 | Push into module through-holes |
| Micro USB cable | already have | Power |

## No-Solder Assembly

```
ESP32 DevKit (pre-soldered pins) → plug into breadboard
MAX6675 module                → push female duponts into holes
SSD1306 OLED                  → push female duponts into holes
K-type thermocouple           → screw into MAX6675 terminals (red=+, blue=-)
```

## Wiring

| ESP32 Pin | MAX6675 | OLED |
|-----------|---------|------|
| 3V3 | VCC | VCC |
| GND | GND | GND |
| D4 (GPIO4) | SCK | — |
| D5 (GPIO5) | SO | — |
| D6 (GPIO6) | CS | — |
| D21 (GPIO21) | — | SDA |
| D22 (GPIO22) | — | SCL |

### Using ESP32-C3 SuperMini instead?
Same code works — just change upload target to `esp32-c3-devkitm-1`. Different pins:
- OLED: SDA→GPIO8, SCL→GPIO9
- MAX6675: SCK=4, SO=5, CS=6

**But you'll need to solder headers onto the C3 SuperMini first.** DevKit V1 comes pre-soldered.

## Probe-to-Wire Attachment (pick one)

| Method | How | Heat Limit |
|--------|-----|------------|
| **Kapton tape** | Tape bead to hot wire, 1 wrap | 400°C |
| **Binder clip** | Clip probe cable to frame, bend bead to touch wire | Any |
| **Screw + washer** | Clamp bead against wire | Any |

Kapton tape is easiest — sold in small rolls on AliExpress for ~$1.

## Build & Flash

```bash
cd ~/Documents/projects/clip-thermometer

# For ESP32 DevKit (pre-soldered, no-solder build):
pio run -e esp32dev -t upload

# For ESP32-C3 SuperMini (needs headers soldered):
pio run -e esp32-c3-devkitm-1 -t upload
```

## What You'll See

```
┌──────────────────────────────┐
│ HOT WIRE THERMOMETER          │
│──────────────────────────────│
│                              │
│         287 °C               │  ← big live temp
│                              │
│                              │
│ MIN:  23 C  MAX: 312 C       │  ← tracking
└──────────────────────────────┘
```

Shows `NO PROBE` if thermocouple is disconnected.

## Temperature Range

- **MAX6675 chip**: 0°C – 1024°C
- **K-type thermocouple bead**: -100°C – 1250°C (the bead can take more heat than the chip reads)
- **Hot wire cutter foam cutting**: typically 200-400°C — well within range
