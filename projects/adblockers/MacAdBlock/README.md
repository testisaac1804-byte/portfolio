# MacAdBlock — macOS DNS Sinkhole Ad-Blocker

A Pi-hole-style DNS ad-blocker for one Mac, with one hard rule: **no terminal commands to use it**. The
server binds port 53 itself as a root launchd daemon, so there is no `pfctl` redirect and no manual
`networksetup` step — the GUI's Install button does the whole setup (one macOS password dialog).

## How it works

```
query in ──▶ extract domain ──▶ allowlist?  ──yes──▶ forward upstream
                                     │no
                                     ▼
                    FNV-1a hash + parent suffixes ──▶ binary search blocklist.bin
                                     ├─ hit  ──▶ answer 0.0.0.0   (sinkholed)
                                     └─ miss ──▶ forward to Quad9 → Cloudflare fallback
```

- **143,596 domains** blocked (StevenBlack base + Hagezi Light)
- **718 KB** blocklist file — 5 bytes per entry, 40-bit FNV-1a hashes, sorted
- **~17 comparisons** per lookup (binary search over a `bytes` object)
- **11 HTTP endpoints** on `:8053` drive the dashboard

## Files

| File | Purpose |
|------|---------|
| `src/macadblock.py` | Core DNS server (:53) + HTTP API (:8053) |
| `src/macadblock_gui.py` | PyObjC control panel — Install / Uninstall / Set DNS / pause |
| `macadblock.sh` | CLI: install, uninstall, start, stop, status, toggle, reload, stats |
| `com.isaac.macadblock.plist` | LaunchDaemon definition (root, KeepAlive) |
| `tools/build_blocklist.py` | Rebuild the blocklist from StevenBlack + Hagezi |
| `blocklist/blocklist.bin` | The hash blocklist |

## Usage

### GUI
1. Run `python3 src/macadblock_gui.py` (or the packaged app)
2. **Install Daemon** → one password dialog → daemon loaded, bound to :53, DNS pointed at 127.0.0.1
3. Pause / resume from the same panel; **Uninstall Daemon** removes it and returns DNS to DHCP

### CLI
```bash
./macadblock.sh install        # copy plist to /Library/LaunchDaemons + load (sudo)
./macadblock.sh status         # running? + domain count, hit counts, q/m
./macadblock.sh toggle         # pause / resume (socket stays open)
./macadblock.sh reload         # re-read blocklist.bin without restarting
./macadblock.sh set-dns        # point active interfaces at 127.0.0.1
./macadblock.sh reset-dns      # back to DHCP
./macadblock.sh uninstall      # unload + remove plist + reset DNS
```

### Dashboard
Open **http://127.0.0.1:8053** — blocked/allowed counters, per-client breakdown, ban a client,
custom block list, allowlist, and a 1,000-entry query log.

### Test it works
```bash
dig @127.0.0.1 doubleclick.net   # → 0.0.0.0   (blocked)
dig @127.0.0.1 apple.com         # → real IP   (forwarded)
```

## Two caches you don't own

Blocking takes effect on the **next lookup**, but a browser that already resolved the name keeps its own
copy. That is why adding a rule flushes the macOS resolver (`dscacheutil` + `mDNSResponder` HUP) but never
signals a browser process:

- macOS resolver cache — flushed automatically on every add/remove.
- Chrome's internal host cache — survives for the life of the process; clear it at
  `chrome://net-internals/#dns` → *Clear host cache*, or restart the browser.
- Chrome's "Use secure DNS" (DoH) — bypasses this blocker entirely; it must be off.

## Notes / limits

- DNS-level filtering only. Hardcoded IPs, a VPN, or an app's own DoH endpoint ignore it.
- 40-bit hashes: with 143,596 entries the chance of one colliding pair is ≈0.9%. A collision
  **over-blocks** an unrelated domain (fail-closed); it never lets a blocked one through. Widening to
  64 bits is a rebuild, not a redesign.
- The list is borrowed (StevenBlack + Hagezi), not audited — false positives happen. Use the allowlist
  (`/api/allow?d=…`) rather than editing the source list; `h-adashx.ut.taobao.com` is a real example.
- Blocking a **parent** domain covers all its subdomains; blocking `web.example.com` does not block
  `example.com`.

## Rebuild the blocklist
```bash
python3 tools/build_blocklist.py      # writes blocklist/blocklist.bin
./macadblock.sh reload                # pick it up without a restart
```

## Credits

Inspired by [M-Abozaid/esp32-c3-adblock](https://github.com/M-Abozaid/esp32-c3-adblock) — adapted for macOS.
