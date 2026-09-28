# WiFi Chat

**Category:** Software & Apps · **Status:** Done

LAN offline chat - no internet needed. WebSocket + DXF sharing.

**Stack / Tools:** WebSocket, Flask, LAN, Offline

**Build path:**
- V1 — Basic text.
- V2 — DXF/SVG uploads.
- V3 — Offline-first. Cross-device.

**Location:** `~/demos/wifi-chat.html`

LAN offline chat — Flask + WebSocket, no internet needed. DXF/SVG file sharing, cross-device, offline-first.

## Where it lives
- Source folder: `~/Documents/projects/network-tools/wifi-chat`
- Artefacts on the site: 20 files · 944 lines of text · 10.8 MB

## Stack
- STL model ×7 · Python ×4 · binary ×3 · .txt ×2 · requirements.txt

## What's in the code
- `client/index.html` — 361 lines (HTML)
- `server/main.py` — 289 lines (Python)
- `launcher.py` — 177 lines (Python)
- `server/chat_manager.py` — 117 lines (Python)
- `server/__init__.py` — 0 lines (Python)
- `uploads/6bb38a1a4c62470691b3b45761517533.stl` — 11 KB (STL model, binary — not line-counted)
- `uploads/a80648917da843af9c01d2d513335746.zip` — 73 KB (archive, binary — not line-counted)
- `uploads/ebd7fc10b99046de949ad04b7be3f53e.stl` — 11 KB (STL model, binary — not line-counted)
- `uploads/bc309475af564c17ac041e628b487934.stl` — 78 KB (STL model, binary — not line-counted)
- `uploads/3abde903b766469a8a2e0487aa874e67.jpg` — 3.4 MB (binary, binary — not line-counted)
- `uploads/eab1b3026f374bd38502232abed03560.stl` — 11 KB (STL model, binary — not line-counted)
- `uploads/2e3410c5b30b4be8853eb19c0f2c2e05.stl` — 349 KB (STL model, binary — not line-counted)

## Verified in the Python source
- routes: `get /`, `get /health`, `get /link`, `post /upload`
- classes: `ChatManager`, `ChatUser`
- functions: `get_local_ip`, `is_host_ip`, `main`, `start_tunnel`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
