# MacAdBlock

**Category:** Software & Apps · **Status:** Done

macOS DNS sinkhole on :53 (root launchd daemon), dashboard + API on :8053.

**Stack / Tools:** macOS, DNS, Python, launchd

**Build path:**
- V1 — Basic hosts file.
- V2 — Sinkhole on :8054 + pfctl 53→8054 redirect; pause/race/removal bugs.
- V3 — Binds :53 as a root launchd daemon; no pf rule, Install/Uninstall in the GUI.

**Location:** `~/Documents/projects/adblockers/MacAdBlock/`

macOS DNS sinkhole. A root LaunchDaemon runs a Python DNS server bound directly to :53 — no pfctl redirect — and answers 143,596 ad/tracker domains with 0.0.0.0 for every app on the Mac; the control panel is a PyObjC window (rumps/NSStatusItem is broken on macOS 26) with Install / Uninstall / pause, and the dashboard + JSON API listen on :8053. Adding or removing a domain flushes the macOS resolver cache immediately and never signals a browser process; an allowlist is consulted before the blocklist so a domain in the 143k list can still be unblocked.

## Where it lives
- Source folder: `~/Documents/projects/adblockers/MacAdBlock`
- Artefacts on the site: 11 files · 1,372 lines of text · 753 KB

## Stack
- Python ×3 · .txt ×3 · Shell ×2 · plist ×1
- external tools invoked: `launchctl`, `networksetup`, `pfctl`, `python3`

## What's in the code
- `src/macadblock.py` — 676 lines (Python)
- `src/macadblock_gui.py` — 364 lines (Python)
- `macadblock.sh` — 102 lines (Shell)
- `README.md` — 92 lines (Markdown)
- `tools/build_blocklist.py` — 73 lines (Python)
- `tools/build_app.sh` — 61 lines (Shell)
- `com.isaac.macadblock.plist` — 23 lines (plist)
- `blocklist/blocklist.bin` — 701 KB (binary, binary — not line-counted)

## Verified in the Python source
- classes: `APIHandler`, `MacAdBlockAppDelegate`, `ReusableHTTPServer`
- functions: `build_blocked_response`, `build_error_response`, `build_forward_response`, `dns_worker`, `flush_dns_cache`, `fnv`, `fnv_hash`, `in_blocklist`, `is_blocked`, `load_allowlist`, `load_banned`, `load_blocklist`, `load_custom`, `main`, `norm`, `notify_user`

## Notes found in the scripts
- macadblock v3 — control the DNS sinkhole
- The server binds port 53 directly as a root launchd daemon, so there is no
- pfctl redirect any more: start/stop go through launchd, not nohup.
- Build MacAdBlock.app bundle

---
_Spec generated from the project's own files on 2026-10-22 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
