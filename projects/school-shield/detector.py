"""
WiFi detector — auto-detects when connected to school network.
"""

from __future__ import annotations

import logging
import subprocess
import re
from typing import Optional

logger = logging.getLogger("school-shield.detector")


def get_current_wifi() -> Optional[str]:
    """Get the SSID of the currently connected WiFi network."""
    try:
        # macOS
        result = subprocess.run(
            ["networksetup", "-getairportnetwork", "en0"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if result.returncode == 0:
            match = re.search(r"Current Wi-Fi Network: (.+)", result.stdout)
            if match:
                return match.group(1).strip()
    except Exception:
        pass
    return None


def get_current_dns() -> list[str]:
    """Get current DNS servers for the active interface."""
    try:
        # Find the active network service
        result = subprocess.run(
            ["networksetup", "-listallnetworkservices"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        services = result.stdout.strip().split("\n")[1:]  # skip header

        for svc in services:
            svc = svc.strip()
            if not svc or svc.startswith("*"):
                continue
            # Check if this is Wi-Fi
            result2 = subprocess.run(
                ["networksetup", "-getdnsservers", svc],
                capture_output=True,
                text=True,
                timeout=5,
            )
            output = result2.stdout.strip()
            if output and "There aren't any" not in output:
                return output.split("\n")

    except Exception:
        pass

    return []


def set_dns_servers(servers: list[str], service: str | None = None) -> bool:
    """Set DNS servers for a network service."""
    try:
        if service is None:
            service = "Wi-Fi"  # default

        if servers:
            args = ["networksetup", "-setdnsservers", service] + servers
        else:
            args = ["networksetup", "-setdnsservers", service, "Empty"]

        result = subprocess.run(
            ["sudo"] + args,
            capture_output=True,
            text=True,
            timeout=5,
        )
        return result.returncode == 0
    except Exception:
        return False


def is_school_network(ssid: str | None = None) -> bool:
    """Check if we're on a school network."""
    if ssid is None:
        ssid = get_current_wifi()

    if not ssid:
        return False

    # Common school WiFi naming patterns
    school_patterns = [
        "island",
        "school",
        "edu",
        "student",
        "campus",
        "wifi",
        "hk",
        "ycis",
        "esf",
        "cdnis",
        "gsis",
    ]

    ssid_lower = ssid.lower()
    return any(pattern in ssid_lower for pattern in school_patterns)


def get_network_info() -> dict:
    """Get full network status for the dashboard."""
    wifi = get_current_wifi()
    dns = get_current_dns()

    # Check if DoH is active (DNS pointing to localhost)
    doh_active = any(
        server in ["127.0.0.1", "::1", "localhost"] for server in dns
    )

    return {
        "wifi_ssid": wifi or "Not connected / Ethernet",
        "is_school": is_school_network(wifi) if wifi else False,
        "dns_servers": dns,
        "doh_active": doh_active,
        "protection": "PROTECTED" if doh_active else "EXPOSED",
    }
