# HKPCBypass

**Category:** Software & Apps · **Status:** Done

Multi-layer school bypass. DoH+SOCKS5+HTTP CONNECT.

**Stack / Tools:** Networking, Proxy, DoH, Python

**Build path:**
- V1 — Single proxy.
- V2 — DoH added: encrypted DNS.
- V3 — Multi-layer fallback.

**Location:** `~/demos/hkc-bypass.html`

Multi-layer school network bypass: DoH (encrypted DNS) + SOCKS5 + HTTP CONNECT with auto-fallback between layers. Python.

## Where it lives
- Source folder: `~/Documents/projects/network-tools/HKPCBypass`
- Artefacts on the site: 8 files · 534 lines of text · 48 KB

## Stack
- binary ×2 · Shell ×1 · Python ×1 · plist ×1
- external tools invoked: `python3`

## What's in the code
- `templates/newtab.html` — 253 lines (HTML)
- `native_app.py` — 245 lines (Python)
- `HKPCBypass.app/Contents/Info.plist` — 33 lines (plist)
- `start.command` — 3 lines (Shell)
- `HKPCBypass.app/Contents/Resources/icon.png` — 1 KB (binary, binary — not line-counted)
- `HKPCBypass.app/Contents/Resources/AppIcon.icns` — 22 KB (binary, binary — not line-counted)

## Verified in the Python source
- classes: `APIHandler`, `AppDelegate`, `ConnectProxy`
- functions: `_detect_net`, `_opener`, `_proxy_off`, `_proxy_on`, `doh_resolve`, `main`, `start_api`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
