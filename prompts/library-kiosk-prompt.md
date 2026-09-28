# Library Kiosk

**Category:** Software & Apps · **Status:** Done

Locked-down public-library kiosk sim — ticket/HKID auth, guest browsers, session timer, data wipe on logout.

**Stack / Tools:** Kiosk, HTML, JS, Auth

**Location:** `~/demos/library-kiosk.html`

Self-contained single-file HTML web app.

## Where it lives
- Source file: `~/Desktop/library-kiosk.html`
- Artefacts on the site: 1 files · 671 lines of text · 71 KB

## Stack
- HTML ×1

## What's in the code
- `library-kiosk.html` — 671 lines (HTML)

## Verified in the page source
- page title: “Library Kiosk — Hong Kong Public Libraries”
- headings: 🔐 Administrator Access · 📚 Library Kiosk — Help · 🖨️ Print · 🛡️ Administrator Panel · Active Tickets · HKID Database · Catalog · Announcements · Usage Logs · Settings
- functions: `save`, `tick`, `z`, `E`, `go`, `nav`, `esc`
- UI element ids: `admin-modal`, `admin-msg`, `admin-panel`, `admin-password`, `admin-trigger`, `announce-bar`, `announce-edit`, `announce-text`, `ap-announcements`, `ap-catalog`

## Notes found in the scripts
- desktop.active{display:block}
- start-menu.show{display:flex;animation:startIn .2s ease}
- desktop.active~#kiosk-toolbar,#kiosk-toolbar.show{display:flex}

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
