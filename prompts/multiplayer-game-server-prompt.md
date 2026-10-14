# Arena — LAN Multiplayer Game

**Category:** Software & Apps · **Status:** Done

A top-down arena shooter that runs on your own Wi-Fi: one Mac hosts it and everyone else joins from a browser. Double-click Arena Server and it starts the match, prints the join address and shows a QR code; open Arena Join on any other Mac and it sweeps the local network, finds the host on its own and opens the game — no IP address to type, no internet, no account. Real-time WebSocket combat with a health bar, live scoreboard and kill feed, on a canvas arena that keeps running. Twin-stick: WASD and the mouse on a Mac, two separate thumb sticks on a phone so you can run one way and shoot the other.

**Stack / Tools:** WebSocket, Python, Canvas, LAN, pkgbuild, Real-time

**Build path:**
- V1 — Single-room WebSocket arena: real-time movement, aiming, shooting, health and a scoreboard.
- V2 — Phone support — a separate move stick and aim stick, so you can run one way and shoot another, plus a fire button.
- V3 — LAN discovery in the join app: it sweeps the network for the host instead of being told an address, and the host page shows the join link plus a QR code.
- V3.1 — Shipped as two double-click .pkg installers (host + join), verified by running the packaged bytes rather than the build tree: 39 protocol, 21 hostile-frame and 20 headless-browser checks. Hostile frames can no longer freeze the sim, a bad tick is skipped instead of ending the match, and player names and chat are scrubbed before they reach anyone else's screen.

**Download:**
- Join a game (512 KB): https://isaac1804.com/files/installers/Arena-Join-1.0.1.pkg
- Host a game (27 MB): https://isaac1804.com/files/installers/Arena-Server-1.0.1.pkg
- Install guide: https://isaac1804.com/portfolio/Desktop/arena/install.html

**Source folder:** `~/Documents/projects/apps/multiplayer-game-server`
**The user's own build spec for this project is at the end of this file.**

## Where it lives
- Source folder: `~/Documents/projects/apps/multiplayer-game-server`
- Artefacts on the site: 28 files · 3,815 lines of text · 135 KB

## Stack
- Python ×21 · Shell ×4 · .txt ×1 · Markdown ×1 · requirements.txt
- external tools invoked: `python3`, `uvicorn`

## What's in the code
- `client/index.html` — 719 lines (HTML)
- `server/game/game_manager.py` — 497 lines (Python)
- `tests/test_multiplayer.py` — 374 lines (Python)
- `server/main.py` — 286 lines (Python)
- `tests/browser_test.py` — 229 lines (Python)
- `scripts/build_join_app.sh` — 208 lines (Shell)
- `tests/test_hostile_frames.py` — 192 lines (Python)
- `README.md` — 186 lines (Markdown)
- `scripts/build_host_app.sh` — 181 lines (Shell)
- `scripts/make_icon.py` — 163 lines (Python)
- `scripts/build_pkgs.sh` — 155 lines (Shell)
- `server/game/ecs/components.py` — 94 lines (Python)

## Verified in the Python source
- routes: `get /`, `get /health`, `get /status`, `get /info`, `get /qr.svg`, `get /join`
- classes: `BulletTag`, `Client`, `Collider`, `ConnectionManager`, `Entity`, `GameManager`, `Health`, `Input`, `ItemTag`, `Name`, `PlayerTag`, `Raw`, `Renderable`, `Score`
- functions: `check`, `circles_overlap`, `clamp`, `clean_text`, `decode`, `diamond_alpha`, `disc_alpha`, `dist_sq`, `downsample`, `encode`, `error_msg`, `event_msg`, `get`, `info`, `join`, `join_url`

## Notes found in the scripts
- Verify the *shipped bytes* inside the rebuilt .pkg payloads.
- Build the two distributable installers into dist/:
- "Arena Server.pkg"  — install this on the Mac that hosts the game
- "Arena Join.pkg"    — send this to a friend; it installs the little

---
_Spec generated from the project's own files on 2026-10-13 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
