# MacAdBlock — macOS DNS Sinkhole Ad-Blocker

A Pi-hole-style DNS ad-blocker for your Mac. **Same approach as the ESP32-C3 adblock project**: stores domain hashes on disk (not in RAM), binary-searches them for fast lookups. Blocks ads, trackers, and malware at the DNS level.

## How it works

```
query in ──▶ extract domain ──▶ FNV-1a hash (+ parent suffixes)
         ──▶ binary-search the blocklist hash file
              ├─ hit  ──▶ answer 0.0.0.0   (sinkholed)
              └─ miss ──▶ forward to Quad9, relay the reply
```

- **143,596 domains** blocked (StevenBlack base + Hagezi Light)
- **0.68 MB** blocklist file (5-byte FNV-1a hashes)
- **~18 reads** per lookup (binary search)
- **Zero collisions** at this size

## Files

| File | Purpose |
|------|---------|
| `src/macadblock.py` | Core DNS + HTTP server |
| `src/macadblock_gui.py` | macOS menu bar GUI (rumps) |
| `macadblock.sh` | CLI start/stop/status |
| `tools/build_blocklist.py` | Rebuild blocklist from StevenBlack + Hagezi |
| `blocklist/blocklist.bin` | The hash blocklist |
| `MacAdBlock.app` | Clickable macOS app (on Desktop) |

## Usage

### GUI (menu bar)
1. Double-click **MacAdBlock.app** on your Desktop
2. The shield icon (🛡️) appears in your menu bar
3. Click **Start Blocker** to begin blocking
4. Optional: **Setup: Port 53 Redirect** (sudo once) — redirects system DNS port 53 → 8054
5. Optional: **Set DNS → 127.0.0.1** (sudo once) — makes your whole Mac use the blocker
6. Open the **Dashboard** in your browser for stats

### CLI
```bash
./macadblock.sh start          # Start the DNS server (no root)
./macadblock.sh stop           # Stop
./macadblock.sh status         # Check if running
./macadblock.sh setup-pf       # Setup port redirect 53→8054 (one-time sudo)
./macadblock.sh set-dns        # Set system DNS to 127.0.0.1
./macadblock.sh reset-dns      # Reset DNS to DHCP
```

### Dashboard
Open **http://127.0.0.1:8053** in your browser to see:
- Live blocked/allowed stats
- Per-client breakdown
- Ban/unban clients
- Add custom blocked domains

### Test it works
```bash
# After starting the blocker:
dig @127.0.0.1 -p 8054 doubleclick.net   # → 0.0.0.0 (blocked)
dig @127.0.0.1 -p 8054 google.com        # → real IP (forwarded)
```

## Architecture (no root needed)

The DNS server listens on **port 8054** (no root required). To intercept standard DNS (port 53), a one-time `pfctl` redirect is used:
```
port 53 → pf redirect → port 8054 → MacAdBlock → Quad9
```

## Rebuild the blocklist
```bash
python3 tools/build_blocklist.py
# Upload to dashboard or restart the server
```

## Credits

Inspired by [M-Abozaid/esp32-c3-adblock](https://github.com/M-Abozaid/esp32-c3-adblock) — adapted for macOS.
