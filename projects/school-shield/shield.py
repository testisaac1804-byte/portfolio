#!/usr/bin/env python3
"""
School Shield — One-click school WiFi stealth mode.

    sudo python shield.py on          # Enable protection
    sudo python shield.py off         # Disable
    python shield.py status           # Check status
    python shield.py dashboard        # Web dashboard on :8777
"""

from __future__ import annotations

import logging
import os
import signal
import subprocess
import sys
import time

import click

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)

DOH_PID_FILE = os.path.expanduser("~/.school-shield-doh.pid")


# ── Root check ───────────────────────────────────────────────


def _require_root():
    if os.geteuid() != 0:
        click.echo("⚠️  This command needs sudo.\n")
        click.echo(f"    sudo python shield.py {' '.join(sys.argv[1:])}")
        sys.exit(1)


# ── CLI ──────────────────────────────────────────────────────


@click.group()
def main():
    """🛡️  School Shield — One-click school WiFi stealth mode."""


@main.command()
@click.option("--mode", type=click.Choice(["full", "dns"]), default="dns",
              help="'dns' = encrypt DNS only (works now). 'full' = DNS + VPN kill switch")
@click.option("--auto", "auto_mode", is_flag=True,
              help="Auto-detect school WiFi and toggle automatically")
def on(mode: str, auto_mode: bool):
    """🔒 Enable protection."""
    _require_root()
    import detector
    import firewall

    info = detector.get_network_info()
    click.echo(f"📡 WiFi: {info['wifi_ssid']}")
    click.echo(f"🏫 School: {'YES' if info['is_school'] else 'No'}")

    # Step 1: Kill switch (firewall)
    click.echo("\n🛡️  Firewall kill switch...")
    if firewall.enable_killswitch(mode):
        click.echo("   ✅ Active")
    else:
        click.echo("   ⚠️  Failed (may need pf enabled)")

    # Step 2: Point DNS to localhost
    click.echo("🔒 DNS → DoH proxy...")
    if detector.set_dns_servers(["127.0.0.1"]):
        click.echo("   ✅ 127.0.0.1")
    else:
        click.echo("   ⚠️  Failed")

    # Step 3: Start DNS-over-HTTPS proxy
    click.echo("🔐 DNS-over-HTTPS...")
    _start_doh_background()

    click.echo(f"\n{'═' * 42}")
    click.echo("🟢  PROTECTED")
    click.echo(f"{'═' * 42}")
    click.echo(f"  DNS:      Encrypted over HTTPS (Cloudflare)")
    click.echo(f"  Kill sw:  {'FULL — only VPN + DoH allowed' if mode == 'full' else 'DNS only'}")
    click.echo(f"\n  Dashboard: python shield.py dashboard")

    if auto_mode:
        click.echo("\n🔍 Monitoring for WiFi changes... (Ctrl+C to stop)")
        try:
            while True:
                time.sleep(10)
                if not detector.is_school_network():
                    click.echo("\n👋 Left school network — disabling")
                    _disable_all()
                    break
        except KeyboardInterrupt:
            click.echo("\n👋 Done")


@main.command()
def off():
    """🔓 Disable protection — restore normal DNS and firewall."""
    _require_root()
    _disable_all()
    click.echo("\n🔓  EXPOSED — Normal network restored")


def _disable_all():
    import detector
    import firewall

    click.echo("🔓 Restoring DNS...")
    detector.set_dns_servers(["Empty"])
    click.echo("   ✅ Default DNS")

    click.echo("🛡️  Clearing firewall...")
    firewall.disable_killswitch()
    click.echo("   ✅ Cleared")

    click.echo("🔐 Stopping DoH proxy...")
    _stop_doh_background()
    click.echo("   ✅ Stopped")


@main.command()
def status():
    """📊 Check protection status."""
    import detector
    import firewall

    info = detector.get_network_info()
    fw = firewall.status()

    protected = info["doh_active"] or fw["enabled"]

    click.echo(f"{'═' * 42}")
    click.echo(f"{'🟢 PROTECTED' if protected else '🔴 EXPOSED'}")
    click.echo(f"{'═' * 42}")
    click.echo(f"  WiFi:      {info['wifi_ssid']}")
    click.echo(f"  School:    {'Yes' if info['is_school'] else 'No'}")
    click.echo(f"  DoH:       {'✅ Active' if info['doh_active'] else '❌ Off'}")
    click.echo(f"  DNS:       {', '.join(info['dns_servers']) or 'Default'}")
    click.echo(f"  Firewall:  {'✅ ' + str(fw['rule_count']) + ' rules' if fw['enabled'] else '❌ Off'}")


@main.command()
@click.option("--port", default=8777, help="Dashboard port")
def dashboard(port: int):
    """📊 Start web status dashboard."""
    import uvicorn
    from dashboard import create_app

    app = create_app()
    click.echo(f"📊 Dashboard: http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="warning")


# ── DoH proxy process management ─────────────────────────────


def _start_doh_background():
    """Start DNS-over-HTTPS proxy in background."""
    if _is_doh_running():
        click.echo("   ℹ️  Already running")
        return

    script_dir = os.path.dirname(os.path.abspath(__file__))
    doh_script = os.path.join(script_dir, "doh_proxy.py")

    proc = subprocess.Popen(
        [sys.executable, doh_script],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=script_dir,
        preexec_fn=os.setpgrp,
    )

    with open(DOH_PID_FILE, "w") as f:
        f.write(str(proc.pid))

    time.sleep(0.5)
    click.echo(f"   ✅ PID {proc.pid}")


def _stop_doh_background():
    try:
        with open(DOH_PID_FILE) as f:
            pid = int(f.read().strip())
        os.kill(pid, signal.SIGTERM)
        os.remove(DOH_PID_FILE)
    except (FileNotFoundError, ProcessLookupError, ValueError):
        pass


def _is_doh_running() -> bool:
    try:
        with open(DOH_PID_FILE) as f:
            pid = int(f.read().strip())
        os.kill(pid, 0)
        return True
    except (FileNotFoundError, ProcessLookupError, ValueError):
        return False


if __name__ == "__main__":
    main()
