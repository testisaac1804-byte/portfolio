# QuickCAM Pro

**Category:** Software & Apps · **Status:** Done (V2)

Browser clone of Denford QuickCAM Pro for F1 in Schools body-block machining. Import an STL,
orientate it into a 223 × 50 × 65 mm balsa block, choose machining plans, generate a toolpath,
simulate it, export Denford VR5 G-code.

**Stack / Tools:** CAM, CNC, Simulation, G-code, single-file HTML + Canvas 2D

**Location:** `~/Documents/QuickCAM_Pro.html` (101,682 B, sha-256 `be332767…3a8b319b5b`)

## Where it lives
- Source file: `~/Documents/QuickCAM_Pro.html`
- App on the site: `./demos/quickcam-pro.html`
- Byte-identical mirror: `./demos/quickcam-pro-mirror/index.html`
- Analysis: `./demos/quickcam-pro-analysis.html`
- Reference: `~/Downloads/821581509-F1-in-School-Design-Guide.pdf`

## Hard constraints
- **One HTML file. No dependencies, no CDN, no backend.** Must run from a USB stick, offline.
  That rules out Three.js and WebGL — everything is drawn into a 2D canvas by a hand-written
  transform → project → fill loop.
- Dark theme (`#0d1117`).
- **Exactly 24 wizard steps** (user corrected this twice: "i said 24 steps for f1 car wizard").
- Machining plans are **user-selectable**, never forced.
- Every action must visibly change the 3D view.

## Architecture

```
parseSTL(buf, onProgress)      binary + ASCII, chunked 1,000 tri/slice, yields to the event loop
autoFitMesh()                  bbox → axis-swap → uniform scale (capped 1:1) → centre in block
modelMat()                     ONE matrix: rotate about machine axes Z→Y→X, then scale, then offset
  ├── drawMesh()               per-face: normal → cull if dot(n,camDir) ≤ 0 → project → fill
  └── calculateToolpath()      rasterises the SAME transformed tris into a 110×110 heightmap
generateGCodeText()            Denford VR5: N-numbers, M06 T01, S8000 M03, G04 P2000, G00/G01, M30
```

`modelMat()` is the load-bearing abstraction: the viewport and the toolpath must share one
transform, or the cut and the picture disagree (that was bug 3).

## Four bugs that made it look broken (all fixed, all measured)

1. **Inverted back-face cull** — kept faces pointing away from the camera, so a closed shell drew
   its own inner cavity. `camDir` must point *toward* the camera; keep `dot(n, camDir) > 0`.
2. **Rotation order** — X was applied before Z, so with the auto-orientation's Z = −90° a tilt
   swung 90° sideways. Fix: rotate about the *machine* axes, Z first. (rotX 45°: 14,550 px → 30,742 px.)
3. **Toolpath in the wrong coordinate space** — rasteriser walked raw mesh coords while the grid
   was in billet space; `state.toolpath.length` stayed **0**. Fix: transform through `modelMat()`
   → 11,720 points, Z 35.67 → 75.00 mm.
4. **237 ms frames** — 530k trig calls/frame. Hoist the matrix + camera constants → 20–28 ms.
   (A `Path2D` shade-bucket "optimisation" measured 6,525 ms to build — rejected.)

## Specs from the F1 guide
- Billet 223 × 50 × 65 mm; cut depth 32.5 mm default, guide derivation 35.675 mm (centre line + tool radius).
- Raster Roughing 270° — 80% stepover, 100% stepdown. Raster Finish 270° — 15% stepover.
- Tool: 1/4" (6.35 mm) ball nose; balsa allows stepdown up to 300% of tool diameter.
- Axle holes drilled with the 6.35 mm ball nose at the Manufacturing Centre.
- G-code: G21/G17/G90/G40/G49/G80/G54, M06 T01, S8000 M03, G04 P2000, M30.

## Feature checklist
- [x] 24-step F1 Car Wizard (step 25 renders blank)
- [x] 12 selectable plans: Roughing X/Y/Z, X & Y Parallel, Raster, Radial, Spiral, Contour Follow,
      Fine X Parallel, Fine Y Parallel, Fine Raster
- [x] 16-tool Denford library, Manufacturing Centre tool flagged
- [x] Binary + ASCII STL parser with progress, 2.9 MB / 58,920 tri in ~412 ms
- [x] Cut-depth plane, billet, grid, axis triad
- [x] Simulation: play / pause / stop / speed, real tool motion, cut surface lowers
- [x] Denford VR5 G-code with per-plan section headers and honouring of move types
- [x] .nc / .fnc export via Blob
- [x] Image import for lithophanes
- [x] Custom boundary, datum, material, side B, axle holes

## Verification (do not skip)
Drive the real page in headless Chrome over CDP; attach the STL with `DOM.setFileInputFiles` on
the page's own `#file-input` — never call the loader directly. Then:
- `state.mesh.numTriangles` = 58,920
- canvas `getImageData` warm-pixel count > 30,000 (ASCII density map should show a solid blob)
- `state.toolpath.length` > 0
- `generateGCodeText()` contains `M30` and a plan section header
- `render()` timed with `performance.now()` < 40 ms

## Pitfalls learned the hard way
- Proven-by-reading-code is not proven. Three "fixed!" claims were rejected before pixels were measured.
- macOS has no `timeout`; use background + sleep.
- `Path2D` with many subpaths is far slower than per-face `ctx.fill()`.
- Culling needs the mesh winding proved (signed tetrahedron volume > 0), not assumed.
