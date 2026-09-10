# CNC Router Poster — Build Spec

**Type:** A1 landscape reference poster (PDF), single page, print-ready.
**Toolchain:** reportlab (custom generator script `~/Desktop/cnc-router-poster/build_poster.py`), venv `~/.venvs/pdf` (run with `env -u PYTHONPATH`).

## Deliverables
- `CNC-Router-Poster-A1.pdf` — full poster (84 x 59 cm)
- `CNC-Router-Poster-A2.pdf` — exact 70.7% vector scale
- `CNC-Router-Poster-A3-scaled.pdf` — exact 50% vector scale
- `CNC-Router-Poster-preview.png` — page-1 render (palette PNG, ~320 KB)

## Design
Navy/white/orange technical palette. 3-column card layout via reportlab
BaseDocTemplate with three `Frame`s + `FrameBreak`s for balance (col1: cards
1–8, col2: 9–15, col3: 16–22). All content is vector (Helvetica), diagrams
drawn with reportlab graphics shapes.

## Content — 22 sections
1. What is a CNC router (axes, right-hand rule, history)
2. Digital workflow (CAD → CAM → post → control → cut)
3. Anatomy of a gantry router — labelled schematic (frame, rails, ball screw,
   spindle, spoilboard, dust shoe)
4. Motion systems (lead screw / ball screw / rack & pinion / belt)
5. Electronics & control (NEMA steppers, drivers, GRBL / FluidNC / Mach3 / LinuxCNC)
6. Spindles & motors (trim router vs VFD spindle, ER collet sizes, runout)
7. Bits & tooling (up/down/compression/ball nose/V-bit/O-flute; HSS vs carbide; coatings)
8. Feeds & speeds — chipload formula with worked 4,800 mm/min example
9. G-code essentials (G0/G1/G2/G3/G20/G21/G90/M3… + annotated program)
10. Materials guide (softwood, hardwood, plywood, MDF, acrylic, aluminium, foam, PCB)
11. Workholding (clamps, tape, screws, vacuum, vises, tabs)
12. Safety (PPE, dust, e-stop, fire)
13. Troubleshooting (chatter, burning, broken bits, lost steps, tearout, ghosting)
14. CNC router vs laser vs 3D printer
15. Glossary (12 terms)
16. End mill anatomy — labelled diagram (shank, flutes, D, cutting length)
17. Climb vs conventional milling — two top-view diagrams with chip shapes
18. Running your first job — 8-step checklist
19. Maintenance & care
20. Choosing a router (budget rule: frame > spindle > electronics)
21. Project ideas (signs, furniture, jigs, PCBs, acrylic, aluminium)
22. Software & resources (Fusion 360, Carbide Create, Easel, VCarve, Estlcam, UGS, GRBL/FluidNC)

## Facts locked in
- Chipload formula: Feed (mm/min) = chipload (mm/tooth) × RPM × flutes
- Trim router 10–30k RPM; VFD spindle 6–24k RPM, ER11/ER20/ER25/ER32
- Ball screw 0.02–0.05 mm/300 mm accuracy; rack & pinion 10 m/min+
- Climb = cutter rotates with feed (clean finish); conventional = against (safer with backlash)

## Verify before shipping
- `env -u PYTHONPATH ~/.venvs/pdf/bin/python build_poster.py` → 1 page, all 22 headings
- pdfplumber: deepest word < frame bottom; 0 words in column gaps
- pypdf: scaled copies are single page at A2/A3 sizes
