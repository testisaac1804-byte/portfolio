#!/usr/bin/env python3
"""Auto-flash ESP32-C3 by detecting USB unplug/replug into download mode."""
import subprocess, time, os, sys

PORT = '/dev/cu.usbmodem1101'
ESPHOME = os.path.expanduser('~/.platformio/packages/tool-esptoolpy/esptool.py')
PY = '/Library/Frameworks/Python.framework/Versions/3.14/bin/python3'
FW = os.path.expanduser('~/Documents/projects/clip-thermometer/.pio/build/esp32-c3-devkitm-1/firmware.bin')

def port_exists():
    return os.path.exists(PORT)

print("=" * 50)
print("STEP 1: UNPLUG the USB cable from the C3 now.")
print("         (waiting for port to disappear...)")
print("=" * 50, flush=True)

# Wait for unplug
t0 = time.time()
while port_exists():
    if time.time() - t0 > 60:
        print("ERROR: port never disappeared. USB still connected?", flush=True)
        sys.exit(1)
    time.sleep(0.1)
print("Port gone. Good.", flush=True)

print("=" * 50)
print("STEP 2: HOLD the BOOT button, then PLUG USB back in.")
print("         KEEP HOLDING BOOT until I say release.")
print("         (waiting for port to reappear...)")
print("=" * 50, flush=True)

# Wait for replug
t0 = time.time()
while not port_exists():
    if time.time() - t0 > 60:
        print("ERROR: port never reappeared. USB plugged?", flush=True)
        sys.exit(1)
    time.sleep(0.05)
print("Port detected! Flashing NOW (keep holding BOOT)...", flush=True)
time.sleep(0.3)

# Flash with no_reset (chip already in download mode from BOOT-held power-on)
r = subprocess.run(
    [PY, ESPHOME, '--chip', 'esp32c3', '--port', PORT, '--baud', '115200',
     '--before', 'no_reset', '--after', 'no_reset',
     'write_flash', '0x0', FW],
    capture_output=True, text=True
)
print(r.stdout[-1500:])
print(r.stderr[-1500:])

if r.returncode == 0:
    print("\nSUCCESS! You can release BOOT now.", flush=True)
else:
    print("\nFlash failed. See errors above.", flush=True)
