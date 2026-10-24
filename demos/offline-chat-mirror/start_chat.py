#!/usr/bin/env python3
"""
Offline Chat Launcher — zero WiFi, zero internet, zero router.

For Mac-to-Mac: one person creates a computer-to-computer network,
everyone joins it, chat just works. Like AirDrop but for group chat.

Usage:
  python3 start_chat.py              # Guides you through setup
  python3 start_chat.py --school     # Password + TLS for school
"""

import argparse
import os
import secrets
import signal
import socket
import subprocess
import sys
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
CHAT_SERVER = SCRIPT_DIR / "offline_chat_v2.py"


def get_local_ip() -> str:
    """Find IP without internet."""
    for method in [
        lambda: (lambda s: (s.connect(("8.8.8.8", 80)), s.getsockname()[0], s.close())[1])(socket.socket(socket.AF_INET, socket.SOCK_DGRAM)),
    ]:
        try: return method()
        except: pass
    for line in subprocess.run(["ifconfig"], capture_output=True, text=True).stdout.split("\n"):
        import re
        m = re.search(r"inet\s+(\d+\.\d+\.\d+\.\d+)", line)
        if m and not m.group(1).startswith("127."):
            return m.group(1)
    return "127.0.0.1"


def create_network_via_applescript(name: str, channel: str = "6") -> bool:
    """Try to open the 'Create Network' dialog via AppleScript."""
    script = f'''
    tell application "System Events"
        tell process "ControlCenter"
            -- Click Wi-Fi menu bar item
            try
                click menu bar item "Wi-Fi" of menu bar 1
                delay 0.5
                click menu item "Create Network…" of menu 1 of menu bar item "Wi-Fi" of menu bar 1
            on error
                -- Try alternative path
                click menu bar item "Wi-Fi" of menu bar 1
                delay 0.5
                keystroke "n" using command down
            end try
        end tell
    end tell
    '''
    try:
        subprocess.run(["osascript", "-e", script], timeout=5)
        return True
    except:
        return False


def main():
    parser = argparse.ArgumentParser(description="Offline Chat Launcher")
    parser.add_argument("--password", default="", help="Chat room password")
    parser.add_argument("--tls", action="store_true", help="Enable TLS encryption")
    parser.add_argument("--school", action="store_true",
                        help="School mode: TLS + password + guidance")
    parser.add_argument("--port", type=int, default=9001, help="Server port")
    args = parser.parse_args()

    if args.school:
        args.tls = True
        if not args.password:
            args.password = secrets.token_urlsafe(4)[:4]

    # ── Find IP ──
    ip = get_local_ip()
    if ip == "127.0.0.1":
        print("⚠️  No network interface found. Make sure Wi-Fi is ON.")
        print("   (You don't need to be connected to a network — just turn Wi-Fi on.)")
        sys.exit(1)

    protocol = "https" if args.tls else "http"
    port_str = f":{args.port}" if args.port not in (80, 443) else ""
    link = f"{protocol}://{ip}{port_str}"

    # ── Build server command ──
    cmd = [sys.executable, str(CHAT_SERVER), "--port", str(args.port), "--bind-ip", ip]
    if args.password:
        cmd += ["--password", args.password]
    if args.tls:
        cmd += ["--tls"]

    env = {k: v for k, v in os.environ.items()
           if k not in ("PYTHONPATH", "PYTHONHOME")}

    # ── Banner ──
    print()
    print("═" * 58)
    if args.school:
        print("  🎒  OFFLINE CHAT — School Mode")
    else:
        print("  💬  OFFLINE CHAT — No WiFi Needed")
    print("═" * 58)
    print()
    print("  ┌─────────────────────────────────────────────────┐")
    print("  │  HOW TO CONNECT (Mac to Mac, 0 internet):       │")
    print("  │                                                 │")
    print("  │  1. HOST: Click Wi-Fi icon → Create Network…    │")
    print("  │     Name: OfflineChat    Leave password blank   │")
    print("  │     Click Create                                │")
    print("  │                                                 │")
    print("  │  2. OTHERS: Click Wi-Fi icon → Join OfflineChat │")
    print("  │                                                 │")
    print("  │  3. Everyone opens this link in their browser:  │")
    print(f"  │     {link:<43} │")
    print("  │                                                 │")
    print("  │  That's it. No router. No internet. No phone.   │")
    print("  └─────────────────────────────────────────────────┘")
    print()
    if args.tls:
        print(f"  🔒  TLS ENCRYPTED — traffic is scrambled")
        print(f"  📜  Accept the certificate warning in browser")
    if args.password:
        print(f"  🔑  Room password: {args.password}")
    if args.school:
        print(f"  🛡️   School cannot see this traffic")
    print()
    print(f"  🛑  Press Ctrl+C to stop")
    print("═" * 58)
    print()

    # ── Start server ──
    server = subprocess.Popen(cmd, env=env)

    def cleanup(sig, frame):
        print("\n🛑 Stopping...")
        server.terminate()
        server.wait()
        print("Done.")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        server.wait()
    except KeyboardInterrupt:
        cleanup(None, None)


if __name__ == "__main__":
    main()
