# $100 HKD DIY Tablet

# $100 HKD DIY Tablet

A working touchscreen Linux tablet built from Pinduoduo parts for about HK$100.

## Parts
- **Board** (~50–70 HKD): Orange Pi Zero 2W (Allwinner H618) / Mango Pi MQ-Pro / Orange Pi Zero 3
- **Screen** (~30–40 HKD): 3.5" SPI TFT, ILI9486 or ILI9341 + XPT2046 touch, 480×320
- **Power** (~15–30 HKD): 5V power bank or LiPo + TP4056
- Reuse: microSD 8GB+, USB cable, Dupont wires

## Build
1. Flash Armbian to microSD (`dd` from macOS), boot, SSH in
2. Wire the TFT to the GPIO header (VCC/GND/CS/RESET/DC/MOSI/SCK/LED/MISO) + touch on CS1
3. `armbian-config` → enable `spi-spidev` + `spi-add-cs1` overlay
4. Build **fbcp-ili9341** (framebuffer copy driver) → screen mirrors the console
5. Lightweight desktop: `xorg openbox lightdm` + `xserver-xorg-input-evdev`; calibrate with `xinput-calibrator`
6. Or skip X entirely with `fbterm` (terminal on the framebuffer)

## Reality check
Terminal, file manager, SSH, Python and info displays work well. Video and modern browsers don't (1GB RAM).

## Pitfalls
Screen dark → SPI not enabled. Touch dead → needs its own CS (CS1, not CS0). Power bank cutting out at low current draw. Weak onboard WiFi antenna.