#!/usr/bin/env python3
"""Test Hermes OS with QEMU pipe serial."""
import subprocess
import time
import os
import threading
import select

kernel = "/Users/isaac/Desktop/oskernel/oskernel.elf"
PIPE_DIR = "/tmp/hermes_serial"

# Create pipe dir
os.makedirs(PIPE_DIR, exist_ok=True)

# QEMU's pipe: creates PIPE_DIR.in and PIPE_DIR.out
qemu = subprocess.Popen(
    ["qemu-system-i386", "-kernel", kernel, "-m", "64",
     f"-serial", f"pipe:{PIPE_DIR}/serial",
     "-display", "none", "-no-reboot"],
    stderr=subprocess.PIPE
)

time.sleep(2)

# Open the pipes
# QEMU writes to .out (we read it)
# QEMU reads from .in (we write to it)
try:
    # Open the output pipe for reading (QEMU writes here)
    out_fd = os.open(f"{PIPE_DIR}/serial.out", os.O_RDONLY | os.O_NONBLOCK)
    
    # Read initial output
    time.sleep(4)
    while True:
        try:
            data = os.read(out_fd, 8192)
            if not data: break
            print(data.decode('utf-8', errors='replace'), end='')
        except BlockingIOError:
            break
    
    # Now open the input pipe for writing
    in_fd = os.open(f"{PIPE_DIR}/serial.in", os.O_WRONLY)
    
    # Send help
    print("\n\n=== SENDING: help ===")
    os.write(in_fd, b"help\n")
    time.sleep(1)
    
    # Read response
    while True:
        try:
            data = os.read(out_fd, 8192)
            if not data: break
            print(data.decode('utf-8', errors='replace'), end='')
        except BlockingIOError:
            break
    
    # Send more commands
    for cmd in [b"ls\n", b"uptime\n", b"hello\n", b"ps\n", b"mem\n"]:
        print(f"\n>>> {cmd.decode().strip()}")
        os.write(in_fd, cmd)
        time.sleep(1)
        while True:
            try:
                data = os.read(out_fd, 8192)
                if not data: break
                print(data.decode('utf-8', errors='replace'), end='')
            except BlockingIOError:
                break
    
    os.close(in_fd)
    os.close(out_fd)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

qemu.kill()
qemu.wait()
print("\nDONE")
