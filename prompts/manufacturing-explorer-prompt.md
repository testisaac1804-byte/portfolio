# Manufacturing Explorer

**Category:** Software & Apps · **Status:** Done

200-method 3D manufacturing explorer. Three.js + Flask.

**Stack / Tools:** Three.js, Flask, 3D, G-code

**Build path:**
- V1 — 112 methods.
- V2 — Collapsible panels.
- V3 — 200 methods.

**Location:** `~/demos/game-server.html`

200-method 3D manufacturing explorer. Three.js 3D scene + Flask backend, collapsible panels, G-code reference.

## Where it lives
- Published copy on the site (working folder isn't on this Mac): `~/Desktop/portfolio-deploy/demos/manufacturing-explorer.html`
- Published copy on the site (working folder isn't on this Mac): `~/Desktop/portfolio-deploy/projects/manufacturing-explorer`
- Artefacts on the site: 14 files · 2,745 lines of text · 2.2 MB

## Stack
- HTML ×8 · .js ×2 · JavaScript ×2 · JSON ×1
- external tools invoked: `npm`

## What's in the code
- `../projects/manufacturing-explorer/static/jsm/OrbitControls.js` — 1,417 lines (JavaScript)
- `manufacturing-explorer.html` — 701 lines (HTML)
- `../projects/manufacturing-explorer/app.py` — 532 lines (Python)
- `../projects/manufacturing-explorer/templates/test3d.html` — 40 lines (HTML)
- `../projects/manufacturing-explorer/templates/min3d.html` — 32 lines (HTML)
- `../projects/manufacturing-explorer/templates/cube.html` — 17 lines (HTML)
- `../projects/manufacturing-explorer/index.html` — 1 lines (HTML)
- `../projects/manufacturing-explorer/methods.json` — 1 lines (JSON)
- `../projects/manufacturing-explorer/static/index.html` — 1 lines (HTML)
- `../projects/manufacturing-explorer/static/jsm/index.html` — 1 lines (HTML)
- `../projects/manufacturing-explorer/static/jsm/OrbitControls_umd.js` — 1 lines (JavaScript)
- `../projects/manufacturing-explorer/templates/index.html` — 1 lines (HTML)

## Verified in the Python source
- functions: `_additive`, `_analyze`, `_casting`, `_finishing`, `_forming`, `_gen_gcode`, `_generic`, `_hsz`, `_joining`, `_load_methods`, `_parse_stl_binary`, `_parse_toolpath`, `_subtractive`, `cube`, `generate_gcode`, `get_method`

## Verified in the page source
- page title: “Manufacturing Explorer — 200+ Methods”
- headings: ${m[1]} — Parameters
- functions: `genGcode`, `parseToolpath`, `additive`, `z`, `z`, `z`, `subtractive`, `dpp`, `forming`, `bd`, `joining`, `casting`, `finishing`, `generic`
- UI element ids: `count`, `list`, `overlay`, `params`, `resize`, `view3d`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
