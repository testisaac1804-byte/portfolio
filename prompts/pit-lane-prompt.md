# Pit Lane — a harbour circuit built in Blender, driven in the browser

**Category:** Games & 3D · **Status:** Done

A racing game whose world is generated in Blender by Python and exported as a single 1.8 MB GLB: a 1.70 km harbour circuit with 15 m asphalt, kerbs, armco, a chequered start line, pit garages, a grandstand, an overhead gantry with five start lights, trees, a seawall, the sea with boats and a city skyline — plus the car, named in the scene so the game can lift it out. three.js drives it: three laps against the clock, a countdown wired to the gantry lights, live lap and sector timing with a best-lap delta, a minimap, speed/gear HUD, results table with gaps, persistent personal bests, pause and restart, keyboard and touch controls. 31,686 triangles, 35 draw calls.

**Stack / Tools:** Blender 5.0 (bpy), Python, glTF/GLB, three.js, JavaScript, Playwright

**Build path:**
- V1 — Circuit generated in Blender from a Catmull-Rom spline: control points sampled into 850 stations, then every ribbon (road, kerbs, painted lines, barriers) swept along them. Car assembled from primitives, scene exported as GLB and the centreline exported as JSON.
- V1.1 — Fixed: the ribbon builder wrote height into Y instead of Z (the road was a 15 m vertical wall); the spline closed the loop by crossing itself; the sea was placed below the ground plane and was invisible; the gantry banner floated above the beam; the game's centreline JSON was Z-mirrored against the GLB, so the car drove perfectly along a centreline that did not exist while sitting on grass; the kerb ribbon assigned its vertex array once after the two-sided loop, so both sides indexed one side's geometry; the personal best was written to localStorage before the comparison that decides whether a lap was a personal best, so the badge could only ever fire on a second, faster run.

**Source folder:** `~/Desktop/pit-lane`
**The user's own build spec for this project is at the end of this file.**

## Where it lives
- Source folder: `~/Desktop/pit-lane`
- Live: https://isaac1804.com/portfolio/demos/pit-lane/play.html
- Layout: `index.html`, `game.js`, `assets/circuit.glb` (1.8 MB), `assets/track.json`, `assets/three.min.js`, `assets/GLTFLoader.js`
- Blender side: `blender/build_circuit.py` (generates the whole world and the car), `blender/render_views.py` (QA renders), `blender/pit-lane.blend`
- QA harnesses: `qa/autopilot.py`, `qa/final_qa.py`, `qa/mobile_qa.py`, `qa/pb_test.py`, `qa/flow_qa.py`, plus probes for the coordinate frame, DOM layers and the render loop

## How the world is built

The spline is a list of control points. `build_circuit.py` samples it into 850 evenly spaced stations, each carrying a position and a tangent, and every ribbon in the scene is swept along those stations — which is why the kerbs follow the curvature without a single hand-placed tile.

Blender's glTF exporter maps `(x, y, z_up)` to `(x, z_up, -y)`. The circuit JSON must therefore be emitted **already mirrored into game space**, or physics and rendering disagree by a reflection while each stays self-consistent. That note is written into the exporter itself.

## How it was verified

The harness drives the game's own physics rather than teleporting the car:

- `qa/autopilot.py` steers for the centreline with a per-curvature speed limit and completes three real laps: 1:04.533, 1:04.550, 1:04.550, zero frames off track, zero page errors.
- `qa/final_qa.py` covers countdown, pause, resume, restart, quit-to-garage and touch steering.
- `qa/pb_test.py` races three times: badge on run one, absent on an identical run two, present on a faster run three.
- `qa/mobile_qa.py` asserts geometric collisions at 390x844, 360x640 and 844x390 — no overlapping HUD elements, nothing clipped, no horizontal scroll.

## Honest limits

An arcade racer, not a simulator: a bicycle model with grip, drift and a handbrake, not a tyre model. No AI opposition, no damage, no pit strategy — the pit lane is scenery. Sound is generated in the browser. One circuit layout. The lap record lives in `localStorage`, so it is per-browser.

## Rebuilding

```bash
cd ~/Desktop/pit-lane/blender
"/Applications/Installed Applications/Blender.app/Contents/MacOS/Blender" -b --python build_circuit.py
```

That regenerates `assets/circuit.glb`, `assets/track.json` and `pit-lane.blend`. Then copy the game tree into `~/Desktop/portfolio-deploy/demos/pit-lane/` and redeploy.

---

# The user's own build spec

> can you make me a game in blender
