# IsaacNetPkg

**Category:** Software & Apps · **Status:** Done

Password-protected .pkg. AppleScript uninstall.

**Stack / Tools:** macOS, pkgbuild, AppleScript, launchd

**Build path:**
- V1 — AppleScript in bash heredocs. Broke.
- V2 — Fixed: AppleScript as real file.

**Location:** `~/projects/IsaacNetPkg/`

Password-protected .pkg installer. osacompile → Mach-O universal binary. The AppleScript startup dialog must be a real .scpt file (a bash heredoc broke). postinstall: chmod 644 files / 755 dirs, then clear quarantine (`xattr -dr com.apple.quarantine`).

## Where it lives
- Source folder: `~/Documents/projects/network-tools/isaacnet-browser`
- Artefacts on the site: 3 files · 757 lines of text · 27 KB

## Stack
- Python ×2 · Shell ×1
- external tools invoked: `networksetup`, `python3`

## What's in the code
- `isaacnet_browser.py` — 538 lines (Python)
- `probe.py` — 184 lines (Python)
- `IsaacNet.command` — 35 lines (Shell)

## Verified in the Python source
- classes: `AppDelegate`, `ConnectProxy`
- functions: `_detect_service`, `_doh_json`, `_doh_wire`, `_opener`, `_parse_wire`, `_wire_query`, `doh_resolve`, `main`, `normalize_url`, `proxy_off`, `proxy_on`, `tls_handshake`

## Notes found in the scripts
- =============================================================================
- IsaacNet — double-click launcher
- Runs the DoH + CONNECT browser and GUARANTEES the system proxy is restored

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
