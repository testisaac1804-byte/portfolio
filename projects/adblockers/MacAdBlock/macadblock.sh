#!/bin/bash
# macadblock v2 — start/stop/reload MacAdBlock DNS sinkhole
# DNS on port 8054 (no root needed); pfctl redirects 53→8054

ACTION="${1:-status}"
DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$DIR/src/macadblock.py"
PIDFILE="/tmp/macadblock.pid"
LOGFILE="/tmp/macadblock.log"

case "$ACTION" in
  start)
    if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
      echo "already running PID $(cat "$PIDFILE")"
      exit 0
    fi
    # Kill anything holding our ports
    kill -9 $(lsof -ti :8053 -P -n 2>/dev/null) 2>/dev/null
    kill -9 $(lsof -ti :8054 -P -n 2>/dev/null) 2>/dev/null
    pkill -9 -f "macadblock" 2>/dev/null
    sleep 1

    # Start server
    nohup /usr/local/bin/python3 "$SRC" > "$LOGFILE" 2>&1 &
    SPID=$!
    echo $SPID > "$PIDFILE"

    # Wait for HTTP server to be ready
    for i in 1 2 3 4 5; do
      if curl -sf http://127.0.0.1:8053/api/status >/dev/null 2>&1; then
        break
      fi
      sleep 0.5
    done
    echo "started PID $SPID"
    ;;
  stop)
    if [ -f "$PIDFILE" ]; then
      kill "$(cat "$PIDFILE")" 2>/dev/null
      rm -f "$PIDFILE"
    fi
    pkill -f "macadblock.py" 2>/dev/null
    # Remove pf redirect if active
    sudo pfctl -a com.macadblock -F all 2>/dev/null || true
    echo "stopped"
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    if curl -sf http://127.0.0.1:8053/api/status >/dev/null 2>&1; then
      if [ -f "$PIDFILE" ]; then echo "running"; else echo "running (orphaned)"; fi
      exit 0
    else
      echo "stopped"
      exit 1
    fi
    ;;
  toggle)
    curl -sf http://127.0.0.1:8053/api/toggle | python3 -c "import sys,json; d=json.load(sys.stdin); print('ON' if d.get('running') else 'OFF')"
    ;;
  reload)
    curl -s http://127.0.0.1:8053/api/reload | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'reloaded: {d[\"num_hashes\"]:,} entries')"
    ;;
  stats)
    curl -s http://127.0.0.1:8053/api/stats | python3 -m json.tool
    ;;
  setup-pf)
    # One-time pf redirect: 53 → 8054
    printf 'rdr pass on lo0 proto udp from any to 127.0.0.1 port 53 -> 127.0.0.1 port 8054\n' | \
      sudo pfctl -a com.macadblock -f - 2>/dev/null
    sudo pfctl -e 2>/dev/null
    echo "✓ pf redirect: 53→8054"
    ;;
  set-dns)
    # Set DNS on active interfaces only
    for iface in $(networksetup -listallnetworkservices 2>/dev/null | grep -v '^An asterisk' | tail -n +2); do
      sudo networksetup -setdnsservers "$iface" 127.0.0.1 2>/dev/null || true
    done
    echo "✓ DNS set to 127.0.0.1"
    ;;
  reset-dns)
    for iface in $(networksetup -listallnetworkservices 2>/dev/null | grep -v '^An asterisk' | tail -n +2); do
      sudo networksetup -setdnsservers "$iface" empty 2>/dev/null || true
    done
    echo "✓ DNS reset to DHCP"
    ;;
  log)
    tail -f "$LOGFILE" 2>/dev/null || echo "no log"
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|toggle|reload|stats|setup-pf|set-dns|reset-dns|log}"
    exit 1
    ;;
esac