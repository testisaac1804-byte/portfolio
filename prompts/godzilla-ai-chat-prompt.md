# Godzilla AI Chat

**Category:** Software & Apps · **Status:** Done

Godzilla-themed AI roleplay. TUI + GUI. Native .app.

**Stack / Tools:** AI, macOS, Chat, TUI

**Build path:**
- V1 — Terminal TUI.
- V2 — GUI with history.
- V3 — Native .app. Themed UI.

**Location:** `~/projects/`

Godzilla-themed AI roleplay. TUI (terminal) → GUI with history → native .app (WKWebView) with themed UI.

## Where it lives
- Source folder: `~/Documents/Godzilla AI`
- Artefacts on the site: 13 files · 1,727 lines of text · 468 KB

## Stack
- Python ×6 · binary ×3 · Shell ×1 · PDF ×1
- external tools invoked: `python3`

## What's in the code
- `scripts/godzilla_nui.py` — 417 lines (Python)
- `scripts/godzilla_tui.py` — 369 lines (Python)
- `scripts/godzilla_vui.py` — 278 lines (Python)
- `scripts/godzilla_gui.py` — 210 lines (Python)
- `Godzilla AI.app/Contents/Resources/scripts/godzilla_gui.py` — 210 lines (Python)
- `scripts/godzilla_cli.py` — 147 lines (Python)
- `setup.sh` — 66 lines (Shell)
- `Godzilla AI.app/Contents/Info.plist` — 30 lines (plist)
- `icon.png` — 45 KB (binary, binary — not line-counted)
- `Godzilla AI User Guide.pdf` — 7 KB (PDF, binary — not line-counted)
- `Godzilla AI.app/Contents/Resources/icon.png` — 45 KB (binary, binary — not line-counted)
- `Godzilla AI.app/Contents/Resources/AppIcon.icns` — 289 KB (binary, binary — not line-counted)

## Verified in the Python source
- CLI / options: `--char`, `--continuous`, `--json`, `--list`
- classes: `GestureDetector`, `GodzillaApp`, `Kaiju`, `KaijuNUI`
- functions: `ask_kaiju`, `chat_loop`, `cmd_ask`, `cmd_list`, `cmd_pipe`, `draw_hud`, `get_client`, `get_whisper`, `main`, `main_loop`, `record_audio`, `select_character`, `speak`, `speak_response`, `transcribe`, `voice_chat`

## Notes found in the scripts
- Godzilla AI Setup — installs dependencies and registers the app
- Check for Python
- Install dependencies

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
