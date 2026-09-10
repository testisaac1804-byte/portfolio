# Waterjet Cutting Poster

**Goal:** Ultra-detailed A3 landscape technical poster about waterjet cutting machines, print-ready.

**Format:** A3 landscape (841.89 × 595.28 pt), single page, light theme (white/navy/water-blue palette), vector-drawn throughout (no photos). Built with reportlab canvas + platypus (script: `~/Desktop/waterjet-poster/build_poster.py`).

**Sections (top to bottom, 3 columns + footer):**
1. **Header banner** — navy, water-drop logo, title "WATERJET CUTTING", subtitle, stat pills: 6,000 bar / Mach 3 / ±0.05 mm / 300 mm thick.
2. **WHAT IS IT?** — cold machining process intro: 6,000 bar jet, garnet AWJ, no HAZ, no tool wear, no thermal distortion.
3. **ANATOMY — THE CUTTING HEAD** — vector cross-section diagram: HP water in → orifice (jewel, Ø0.08–0.5 mm) → mixing chamber (venturi vacuum) → garnet abrasive in (0.2–1.0 kg/min) → focusing tube (tungsten carbide, Ø0.5–1.5 mm) → supersonic jet → workpiece with kerf → catch tank. Numbered callouts 1–6 + legend.
4. **HOW IT WORKS — THE PHYSICS** — energy conversion, Bernoulli (v = √(2P/ρ), ≈ 900 m/s ≈ Mach 3), venturi, momentum transfer / micro-erosion, no melting (zero HAZ, < 90 °C), kerf & taper (+ 5-axis tilt ±60°).
5. **MACHINE ANATOMY — KEY COMPONENTS** — HP pump (intensifier vs direct-drive), water plant (RO filtration), abrasive feed, CNC gantry (20 m/min, ±0.05 mm).
6. **PURE WATERJET vs ABRASIVE (AWJ)** table — cut medium, materials, max thickness, cut mechanism, edge finish, running cost.
7. **KEY CUTTING PARAMETERS** table — pressure, orifice Ø, focusing tube Ø, abrasive flow, traverse speed, standoff distance, garnet mesh, piercing.
8. **HISTORY** — 1930s–50s paper mills/coal mining → 1958 Franz → 1971 McCartney → 1979 Flow Systems/Boeing → 1983 Hashish (AWJ) → 1990s 5-axis/CAD-CAM → today (6,000 bar, micro waterjets, automation).
9. **ADVANTAGES ✓ / LIMITATIONS ✗** — side-by-side green/red boxes.
10. **GARNET — THE ABRASIVE** — almandine (Mohs 7.5–8), mesh sizes 50/80/120/220, cost US$0.3–1.5/kg, recycling 3–5×, alternatives.
11. **WATERJET vs LASER vs PLASMA vs CNC MILL** table — HAZ, max steel, edge quality, kerf, thin-steel speed, materials, environment.
12. **MATERIALS & APPLICATIONS** — aerospace (Ti/CFRP), stone & marble, food, gaskets, armour, glass & signage, foam, electronics/PCB.
13. **KEY TERMS footer** — HAZ, kerf, taper, orifice, focusing tube, standoff, traverse speed, garnet, intensifier, venturi, AWJ, 5-axis.

**Verification:** no reportlab frame overflow (fit warnings = 0); glyphs √ ρ ≈ ≤ ↑ → embedded via Arial Unicode fallback; margins blank; A3 1 page. Poster PDF: `~/Desktop/Waterjet-Machine-Poster.pdf` (108 KB). Preview PNG: page 1 at 150 dpi (2481 × 1754).
