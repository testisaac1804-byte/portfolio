# IsaacKing Browser

**Category:** Software & Apps · **Status:** Done

Whitelist-only browser. PyObjC + WKWebView .app.

**Stack / Tools:** macOS, WKWebView, PyObjC, Browser

**Build path:**
- V1 — White screen bug.
- V2 — Fixed: HTML string direct load.

**Location:** `~/projects/`

Whitelist-only browser: PyObjC + WKWebView. V1 had a white-screen bug — fixed by loading the HTML string directly instead of the URL. Only whitelisted domains load; everything else is blocked.

## Where it lives
- Published copy on the site (working folder isn't on this Mac): `~/Desktop/portfolio-deploy/demos/isaacking-browser.html`
- Artefacts on the site: 1 files · 149 lines of text · 9 KB

## Stack
- HTML ×1

## What's in the code
- `isaacking-browser.html` — 149 lines (HTML)

## Verified in the page source
- page title: “IsaacKing Browser — Whitelist-Only”
- headings: '+esc(cap)+' · Blocked — not on whitelist
- functions: `esc`, `domainOf`, `allowed`, `renderPage`, `renderBlocked`
- UI element ids: `back`, `lock`, `viewport`, `wlAdd`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
