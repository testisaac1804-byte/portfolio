#!/bin/bash
# macadblock v3 — control the DNS sinkhole
# The server binds port 53 directly as a root launchd daemon, so there is no
# pfctl redirect any more: start/stop go through launchd, not nohup.

LABEL="com.isaac.macadblock"
PLIST_SRC="$(cd "$(dirname "$0")" && pwd)/$LABEL.plist"
PLIST_DST="/Library/LaunchDaemons/$LABEL.plist"
LOGFILE="/tmp/macadblock.log"
API="http://127.0.0.1:8053"

ACTION="${1:-status}"

api_up() { curl -sf -m 3 "$API/api/status" >/dev/null 2>&1; }

case "$ACTION" in
  install)
    sudo cp "$PLIST_SRC" "$PLIST_DST"
    sudo chown root:wheel "$PLIST_DST"
    sudo chmod 644 "$PLIST_DST"
    sudo launchctl load -w "$PLIST_DST"
    echo "installed + loaded $LABEL (binds :53 as root, restarts on crash)"
    ;;

  uninstall)
    sudo launchctl unload -w "$PLIST_DST" 2>/dev/null || true
    sudo rm -f "$PLIST_DST"
    for iface in $(networksetup -listallnetworkservices 2>/dev/null | grep -v '^An asterisk'); do
      sudo networksetup -setdnsservers "$iface" empty 2>/dev/null || true
    done
    echo "uninstalled $LABEL, DNS back to DHCP"
    ;;

  start)
    sudo launchctl load -w "$PLIST_DST" 2>/dev/null || true
    for i in 1 2 3 4 5 6 7 8 9 10; do api_up && break; sleep 0.5; done
    if api_up; then echo "started"; else echo "failed to start — see $LOGFILE"; exit 1; fi
    ;;

  stop)
    sudo launchctl unload -w "$PLIST_DST" 2>/dev/null || true
    echo "stopped"
    ;;

  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;

  status)
    if api_up; then
      echo "running"
      curl -s "$API/api/stats" | python3 -c "import sys,json;d=json.load(sys.stdin);print(f\"  {d['num_hashes']:,} domains · {d['blocklist_size']/1024:.0f} KB · {d['blocked']:,} blocked / {d['allowed']:,} allowed · {d['qpm']} q/m\")"
      exit 0
    else
      echo "not running"
      exit 1
    fi
    ;;

  toggle)
    curl -sf "$API/api/toggle" | python3 -c "import sys,json;d=json.load(sys.stdin);print('ON' if d.get('running') else 'OFF')"
    ;;

  reload)
    curl -s "$API/api/reload" | python3 -c "import sys,json;d=json.load(sys.stdin);print(f\"reloaded: {d['num_hashes']:,} entries\")"
    ;;

  stats)
    curl -s "$API/api/stats" | python3 -m json.tool
    ;;

  set-dns)
    # Only interfaces that actually carry an address — a VPN or a dormant
    # service will happily accept 127.0.0.1 and then break every lookup.
    for iface in $(networksetup -listallnetworkservices 2>/dev/null | grep -v '^An asterisk'); do
      dev=$(networksetup -listallhardwareports 2>/dev/null | awk -v s="$iface" '$0 ~ s {getline; getline; print $2}')
      [ -n "$dev" ] && ! ifconfig "$dev" 2>/dev/null | grep -q "inet " && continue
      sudo networksetup -setdnsservers "$iface" 127.0.0.1 2>/dev/null || true
    done
    sudo dscacheutil -flushcache 2>/dev/null
    echo "DNS -> 127.0.0.1"
    ;;

  reset-dns)
    for iface in $(networksetup -listallnetworkservices 2>/dev/null | grep -v '^An asterisk'); do
      sudo networksetup -setdnsservers "$iface" empty 2>/dev/null || true
    done
    sudo dscacheutil -flushcache 2>/dev/null
    echo "DNS -> DHCP"
    ;;

  log)
    tail -f "$LOGFILE" 2>/dev/null || echo "no log"
    ;;

  *)
    echo "Usage: $0 {install|uninstall|start|stop|restart|status|toggle|reload|stats|set-dns|reset-dns|log}"
    exit 1
    ;;
esac
