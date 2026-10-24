# Changelog — MacAdBlock

## 2026-10-22 — V3: zero-terminal, and the removal bug actually fixed

### The daemon now owns port 53
- `src/macadblock.py` binds **:53** directly as a root launchd daemon
  (`com.isaac.macadblock.plist`, `root:wheel`, `KeepAlive`). The `pfctl` 53→8054
  redirect that never loaded is gone, so there is no terminal step left.
- HTTP dashboard + JSON API stay on **:8053**.

### Bugs fixed
| Reported symptom | Real cause | Fix |
|---|---|---|
| Pause left the blocker half-dead (queries refused, then timeouts) | the DNS worker closed its socket on pause, and a rapid toggle started a second worker | `dns_lock` + a single worker; paused = socket open, queries dropped |
| "I removed a blocked domain and it's still blocked" | `unblock` only deleted the custom entry — the domain also lives in the 143k main list, so the lookup still hit | `unblock` now also writes the **allowlist**, and the allowlist is consulted *before* the blocklist |
| "Adding a block quit Chrome" | the cache flush broadcast `SIGHUP` to every Chrome/Safari process | only `dscacheutil -flushcache` + `killall -HUP mDNSResponder`; no browser process is ever signalled |
| New blocks took effect only after quitting the browser | browser-internal DNS cache outlives system cache | flush runs on **add, unblock and disallow** |
| "I blocked `toddleapp.com` and nothing happened" | `web.toddleapp.com` was the entry; the app used the apex | block the parent domain — subdomains inherit |

### Perf / correctness
- custom lookup: list scan → `set`; main blocklist: sorted 40-bit FNV-1a hashes + binary search (5 bytes/entry).
- query log ring buffer 200 → **1000** entries; `/api/stats` returns all of them.
- upstream chain now Quad9 → Cloudflare → **8.8.8.8** (the HGC/sweetpotato router throttles
  1.1.1.1), overridable with `MACADBLOCK_UPSTREAM="ip[,ip:port]"`.

### Tooling
- `macadblock.sh` rewritten for V3 (install/uninstall via launchd; the old `nohup` + `pfctl`
  path is gone) — `install`, `uninstall`, `start`, `stop`, `status`, `toggle`, `reload`,
  `set-dns`, `reset-dns`, `stats`, `log`.
- `README.md` corrected (port 53, PyObjC panel, the three DNS caches, the ~0.9% hash-collision
  note that replaces the wrong "zero collisions" claim).

### Verified
- `dig @127.0.0.1 doubleclick.net` → `0.0.0.0`; `dig @127.0.0.1 apple.com` → real IP.
- unblock → allowlist entry → `dig` returns a real answer again (no browser restart).
- `curl 127.0.0.1:8053/api/status` → `{"running": true}`.
- Dashboard HTML snapshotted byte-identically for the portfolio mirror
  (sha256 `8f5f93e571a6274f…`, 6,692 bytes).

### Known leftovers
- Setting system DNS still needs one admin password (the GUI's **Set DNS** button uses the
  macOS auth dialog). The daemon itself needs no password once installed.
- A stray `~/Desktop/MacAdBlock.empty-root-dir` (root-owned, empty) is left from repairing the
  symlink that used to point at this folder; remove with
  `sudo rm -rf ~/Desktop/MacAdBlock.empty-root-dir`.
