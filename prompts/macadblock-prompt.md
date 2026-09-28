# MacAdBlock

**Category:** Software & Apps · **Status:** Done

macOS DNS ad-blocker daemon on :8053.

**Stack / Tools:** macOS, DNS, Python, launchd

**Build path:**
- V1 — Basic hosts file.
- V2 — Daemon mode: launchd, auto-start.
- V3 — System-wide: blocks ads in EVERY app.

**Location:** `~/projects/adblockers/`

macOS DNS ad-blocker. A launchd LaunchDaemon runs a Python DNS server on :8053 with an ad/tracker blocklist; point system DNS at 127.0.0.1 to block ads app-wide. Re-sign after edits; NSStatusItem is broken on macOS 26, so use a plain window or a LaunchAgent.

## Where it lives
- Source folder: `~/Documents/projects/adblockers/MacAdBlock`
- Artefacts on the site: 11 files · 1,354 lines of text · 752 KB

## Stack
- Python ×3 · .txt ×3 · Shell ×2 · plist ×1
- external tools invoked: `networksetup`, `pfctl`, `python3`

## What's in the code
- `src/macadblock.py` — 657 lines (Python)
- `src/macadblock_gui.py` — 364 lines (Python)
- `macadblock.sh` — 97 lines (Shell)
- `README.md` — 79 lines (Markdown)
- `tools/build_blocklist.py` — 73 lines (Python)
- `tools/build_app.sh` — 61 lines (Shell)
- `com.isaac.macadblock.plist` — 23 lines (plist)
- `blocklist/blocklist.bin` — 701 KB (binary, binary — not line-counted)

## Verified in the Python source
- classes: `APIHandler`, `MacAdBlockAppDelegate`, `ReusableHTTPServer`
- functions: `build_blocked_response`, `build_error_response`, `build_forward_response`, `dns_worker`, `flush_dns_cache`, `fnv`, `fnv_hash`, `in_blocklist`, `is_blocked`, `load_allowlist`, `load_banned`, `load_blocklist`, `load_custom`, `main`, `norm`, `notify_user`

## Notes found in the scripts
- macadblock v2 — start/stop/reload MacAdBlock DNS sinkhole
- DNS on port 8054 (no root needed); pfctl redirects 53→8054
- Build MacAdBlock.app bundle
- Remove old app if exists

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
