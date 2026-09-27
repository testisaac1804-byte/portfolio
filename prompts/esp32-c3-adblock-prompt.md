# ESP32-C3 AdBlock

**Category:** Software & Apps · **Status:** Done

Network DNS sinkhole on ESP32. Blocks ads for all WiFi devices.

**Stack / Tools:** ESP32, C, DNS, IoT

**Reference:** https://github.com/M-Abozaid/esp32-c3-adblock — open-source Pi-hole-class DNS ad-blocker on an ESP32-C3 (537k domains as 40-bit FNV-1a hashes in flash, binary-searched; UDP DNS sinkhole + web dashboard, MIT). Used as the reference for this build.

**Build path:**
- Note — C3 incompatible with RT-AC58U WPA2. Used WROOM-32D.

**Location:** `~/projects/adblockers/`

Network DNS sinkhole on ESP32 with ~144k blocked domains, a web dashboard, and a captive-portal WiFi setup. Answers blocked domains with 0.0.0.0 and forwards the rest. The C3 is WPA2-incompatible with the RT-AC58U, so use a WROOM-32D (CP2102, needs the SiLabs driver) or run the sinkhole in AP mode.
