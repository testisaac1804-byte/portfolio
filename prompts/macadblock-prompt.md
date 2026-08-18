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
