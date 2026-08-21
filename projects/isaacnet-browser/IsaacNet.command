#!/bin/bash
# =============================================================================
#  IsaacNet — double-click launcher
#  Runs the DoH + CONNECT browser and GUARANTEES the system proxy is restored
#  when the app quits (normal close, Cmd+Q, OR force-kill), so you never get
#  left with broken internet.
# =============================================================================

DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Auto-detect the active network service ────────────────────────────────
SVC="Wi-Fi"
while IFS= read -r s; do
    s="$(echo "$s" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [ -z "$s" ] && continue
    case "$s" in
        An*|*VPN*|*Bluetooth*|*Thunderbolt*|*FireWire*|*iPhone*|*USB*) continue ;;
    esac
    if networksetup -getinfo "$s" 2>/dev/null | grep -q "IP address"; then
        SVC="$s"; break
    fi
done < <(networksetup -listallnetworkservices 2>/dev/null | tail -n +2)

# ── Guarantee proxy is OFF whenever this launcher exits ────────────────────
cleanup() {
    networksetup -setwebproxystate      "$SVC" off 2>/dev/null
    networksetup -setsecurewebproxystate "$SVC" off 2>/dev/null
}
trap cleanup EXIT

# ── Launch the browser ─────────────────────────────────────────────────────
# NOTE: no `exec` here — the shell must stay alive as the parent so its EXIT
# trap below runs cleanup if Python is killed or crashes.
PORT="${1:-8541}"
python3 "$DIR/isaacnet_browser.py" "$PORT"
