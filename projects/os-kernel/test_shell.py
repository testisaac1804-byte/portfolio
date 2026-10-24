#!/usr/bin/env python3
"""Drive Hermes OS shell over a QEMU unix-socket serial line."""
import os, socket, subprocess, sys, time

KERNEL = "/Users/isaac/Documents/projects/drafts/oskernel/oskernel.elf"
SOCK = "/tmp/hermes_os.sock"

for p in (SOCK,):
    try: os.unlink(p)
    except FileNotFoundError: pass

qemu = subprocess.Popen(
    ["qemu-system-i386", "-kernel", KERNEL, "-m", "64",
     "-display", "none", "-no-reboot",
     "-serial", f"unix:{SOCK},server,nowait"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# wait for the socket
for _ in range(100):
    if os.path.exists(SOCK):
        break
    time.sleep(0.1)

s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
s.connect(SOCK)
s.setblocking(False)

buf = ""
def pump(seconds):
    global buf
    end = time.time() + seconds
    while time.time() < end:
        try:
            d = s.recv(65536)
            if d:
                buf += d.decode("utf-8", "replace")
                continue
        except BlockingIOError:
            pass
        time.sleep(0.03)

def wait_for(token, timeout=25):
    end = time.time() + timeout
    while time.time() < end:
        pump(0.2)
        if token in buf:
            return True
    return False

def send(cmd):
    s.sendall(cmd.encode())
    time.sleep(0.6)
    pump(1.2)

ok = wait_for("$ ", 40)
print("REACHED_SHELL:", ok)

for cmd in ["help\r", "ls\r", "cat README\r", "uptime\r", "ps\r", "mem\r"]:
    send(cmd)

pump(1.5)
print("================ TRANSCRIPT ================")
print(buf)
print("============================================")

qemu.terminate()
try: qemu.wait(timeout=5)
except subprocess.TimeoutExpired: qemu.kill()
