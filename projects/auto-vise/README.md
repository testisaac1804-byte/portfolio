# Auto-Clamping Vise

## Wiring

```
Arduino Nano     A4988 Driver        ACS712         Buttons/LEDs
───────────     ──────────────       ──────         ────────────
D2          →   STEP
D3          →   DIR
D4          →   ENABLE
D5          →   MS1 (optional)
D6          →   MS2 (optional)  
D7          →   MS3 (optional)
5V          →   VDD
GND         →   GND
A0          →                       VOUT
5V          →                       VCC
GND         →                       GND

D9          ←   CLAMP button (other leg → GND, internal pullup)
D10         ←   RELEASE button (other leg → GND, internal pullup)
D11         →   GREEN LED anode (cathode → 220Ω → GND)
D12         →   RED LED anode   (cathode → 220Ω → GND)

Power:
12V PSU    →   A4988 VMOT (+)
GND        →   A4988 GND (-)
                 ↑ wire ACS712 in series here ↑
12V PSU(+) →   ACS712 IP+  →  ACS712 IP-  →  A4988 VMOT
```

## Calibration

Upload, open Serial Monitor (115200 not needed — LEDs tell everything).

1. Power on — green blinks 3x = calibrated
2. Press CLAMP with nothing in jaws
3. If it runs to safety timeout → `CURRENT_THRESHOLD` (line ~30) is too high. Lower it.
4. If it trips immediately → threshold too low. Raise it.
5. Find the value where it reliably stops when gripping something but doesn't false-trigger

Default threshold is 100 ADC units above baseline. This is ~0.5A rise on ACS712 5A.

## Printed Parts (Fusion 360 / STL)

Need to design:
- **Fixed jaw** — screws to base, holds M8 nut captive
- **Moving jaw** — rides on 2x LM8UU bearings + 8mm rods, has M8 nut captive
- **Base plate** — holds rods, fixed jaw, stepper motor mount
- **Motor bracket** — clamps NEMA 17 to base, aligns shaft with M8 rod
- **Coupler** — 5mm shaft → M8 threaded rod (flexible shaft coupler or printed)

Key: the M8 threaded rod IS the lead screw. As the motor turns it, the nut in the moving jaw converts rotation to linear motion.

## Operation

- **CLAMP** button: drives jaw forward, stops automatically when current spikes (item gripped)
- **RELEASE** button: backs jaw off 2000 steps (~4-5mm with M8x1.25 pitch + full-step)
- **Cancel mid-clamp**: press RELEASE during clamping to abort
- **Red LED** = clamping/releasing, **Green + Red** = clamped, **Green blink** = released
