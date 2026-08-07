#!/usr/bin/env python3
"""
WiFi Chat — Start server + SSH tunnel so anyone anywhere can join.
"""
import json
import os
import re
import signal
import socket
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent
VENV_PYTHON = PROJECT_DIR / ".venv" / "bin" / "python3"
PORT = 9000

running = True


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def start_tunnel():
    """Start SSH tunnel to localhost.run, return URL or None."""
    try:
        proc = subprocess.Popen(
            ["ssh", "-o", "StrictHostKeyChecking=no",
             "-o", "UserKnownHostsFile=/dev/null",
             "-o", "ConnectTimeout=10",
             "-o", "ServerAliveInterval=30",
             "-R", f"80:localhost:{PORT}", "nokey@localhost.run"],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, bufsize=1,
        )
        # Read until we get the tunnel URL
        for _ in range(100):
            line = proc.stdout.readline()
            if not line:
                break
            print(f"  [tunnel] {line.rstrip()}")
            m = re.search(r'https?://([a-z0-9]+\.lhr\.life)', line)
            if m:
                return f"https://{m.group(1)}", proc
        proc.terminate()
    except Exception as e:
        print(f"  Tunnel failed: {e}")
    return None, None


def main():
    if not VENV_PYTHON.exists():
        print("ERROR: venv not found. Run: cd ~/Desktop/wifi-chat && uv venv && uv pip install -r requirements.txt")
        sys.exit(1)

    clean_env = {k: v for k, v in os.environ.items() if k not in ("PYTHONPATH", "PYTHONHOME")}

    print("Starting WiFi Chat server...")
    server_proc = subprocess.Popen(
        [str(VENV_PYTHON), "-m", "uvicorn", "server.main:app",
         "--host", "0.0.0.0", "--port", str(PORT), "--log-level", "warning"],
        cwd=str(PROJECT_DIR), env=clean_env,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    )

    # Wait for server (longer timeout)
    for i in range(30):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/health", timeout=1)
            break
        except Exception:
            time.sleep(0.5)
    else:
        print("ERROR: Server failed to start. Output:")
        out = server_proc.stdout.read().decode(errors='ignore')
        print(out[-500:] if len(out) > 500 else out)
        server_proc.terminate()
        sys.exit(1)

    # Get host link
    try:
        resp = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/link", timeout=3)
        data = json.loads(resp.read())
        lan_link = data["link"]
        host_link = data["host_link"]
    except Exception:
        lan_link = f"http://{get_local_ip()}:{PORT}"
        host_link = f"http://localhost:{PORT}"

    # Start tunnel for internet access
    print("Setting up internet tunnel...")
    tunnel_url, tunnel_proc = start_tunnel()

    # Shorten the tunnel URL using da.gd with a readable custom code
    short_url = None
    if tunnel_url:
        try:
            # Generate a short code with only unambiguous chars: 2-9, a-h, j-n, p-z (no 0/1/I/L/O)
            import random, string
            safe_chars = "23456789abcdefghjkmnpqrstuvwxyz"
            code = ''.join(random.choice(safe_chars) for _ in range(5))
            req = urllib.request.Request(
                f"https://da.gd/s?url={urllib.parse.quote(tunnel_url)}&shorturl={code}",
                headers={"User-Agent": "curl/8.0"}
            )
            resp = urllib.request.urlopen(req, timeout=10)
            result = resp.read().decode().strip()
            if result.startswith("http"):
                short_url = result
            else:
                # Fallback: let da.gd pick the code
                req2 = urllib.request.Request(
                    f"https://da.gd/s?url={urllib.parse.quote(tunnel_url)}",
                    headers={"User-Agent": "curl/8.0"}
                )
                resp2 = urllib.request.urlopen(req2, timeout=10)
                short_url = resp2.read().decode().strip()
                if not short_url.startswith("http"):
                    short_url = None
        except Exception:
            pass

    # Build dialog message
    show_url = short_url or tunnel_url
    lines = []
    if show_url:
        lines.append(f"🌐 Anyone, anywhere:\\n{show_url}\\n")
    if lan_link:
        lines.append(f"📡 Same WiFi:\\n{lan_link}")

    msg = "\\n".join(lines).replace('"', '\\"')
    subprocess.run([
        "osascript", "-e",
        f'display dialog "{msg}" with title "WiFi Chat" buttons {{"OK"}} default button "OK" giving up after 30'
    ], timeout=35)

    # Open browser with host link (includes short URL as param)
    browser_url = host_link
    if show_url:
        browser_url += "&share=" + urllib.parse.quote(show_url)
    subprocess.run(["open", browser_url], timeout=5)

    print(f"\n🚀 WiFi Chat running")
    if tunnel_url:
        print(f"   Internet: {tunnel_url}")
    print(f"   LAN:      {lan_link}")
    print(f"   Press Ctrl+C to stop.\n")

    def cleanup(sig, frame):
        global running
        running = False
        server_proc.terminate()
        if tunnel_proc:
            tunnel_proc.terminate()

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        server_proc.wait()
    except KeyboardInterrupt:
        cleanup(None, None)


if __name__ == "__main__":
    main()
