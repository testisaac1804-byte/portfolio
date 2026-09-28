# QuickCAM Pro

**Category:** Software & Apps · **Status:** Done

Advanced milling CAM simulation — toolpaths, workholding, G-code preview.

**Stack / Tools:** CAM, CNC, Simulation, HTML

**Location:** `~/demos/quickcam-pro.html`

Self-contained single-file HTML web app.

## Where it lives
- Source file: `~/Documents/QuickCAM_Pro.html`
- Artefacts on the site: 1 files · 1,767 lines of text · 92 KB

## Stack
- HTML ×1

## What's in the code
- `QuickCAM_Pro.html` — 1,767 lines (HTML)

## Verified in the page source
- page title: “QuickCAM Pro — Advanced Milling CAM Software”
- headings: Step 1: START QUICKCAM · Step 2: LOAD STL FILE · Step 3: ORIENTATE MODEL (CRITICAL) · Step 4: SET CUT DEPTH · Step 5: SET BILLET SIZE · Step 6: SET MODEL SIZE (SCALE CHECK) · Step 7: SET MODEL POSITION · Step 8: SET BOUNDARY · Step 9: SETUP TOOLS · Step 10: MACHINING PLANS
- functions: `resizeCanvas`, `requestRender`, `render`, `project`, `drawGrid`, `drawAxes`, `drawOrientationCube`, `drawCoordinateDisplay`, `drawStatusBar`, `drawBillet`, `drawCutter`, `drawCutDepthIndicator`, `drawSafeHeightIndicator`, `drawCutPlane`
- UI element ids: `app-header`, `center-panel`, `drop-zone`, `file-input`, `front-axle-x`, `gcode-preview`, `glcanvas`, `image-input`, `image-preview`, `left-panel`

## Notes found in the scripts
- tabs { display: flex; gap: 2px; }
- main { display: flex; flex: 1; height: calc(100vh - 56px); overflow: hidden; }
- glcanvas { width: 100%; height: 100%; display: block; cursor: grab; }

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
