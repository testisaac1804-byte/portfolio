# Plasma Cutting Poster

## Goal
Build an extremely detailed, print-ready A3 technical poster about plasma cutting for the DT workshop / coursework.

## Deliverable
`Plasma-Cutter-Poster.pdf` — 6-page A3 portrait poster (2,880+ words, vector diagrams), built with reportlab from `build_poster.py`.

## Page plan
1. Title banner + what plasma cutting is + physics (4th state of matter, ionisation, 15,000–30,000 °C) + step-by-step cut sequence
2. Anatomy of a plasma torch — vector cross-section diagram (electrode, hafnium tip, swirl ring, nozzle, shield cup, kerf, sparks) + parts table
3. Complete system diagram + plasma gas selection + materials table + typical cutting parameters by thickness
4. Parameter effects + cut quality (kerf, bevel, dross, HAZ, warping) + troubleshooting table
5. Plasma vs oxy-fuel/laser/waterjet comparison + advantages/limitations + safety table + applications
6. Consumables & maintenance + history timeline + glossary

## Style
- A3 portrait, navy (#0E2A47) + orange (#F57C00) plasma theme, white background
- Vector diagrams via reportlab.graphics.shapes with white-halo leader lines
- Zebra-striped tables, navy header rows
- WinAnsi-safe characters only (no ₂ → → O2/N2, no arrows → em dashes)

## Build
```bash
cd ~/Desktop/Plasma-Cutter-Poster && .venv/bin/python build_poster.py
```

## Notes
- Values are indicative — reference manufacturer cut charts (Hypertherm, ESAB, Lincoln Electric).
- Rebuild script kept at `~/Desktop/Plasma-Cutter-Poster/build_poster.py` for edits.
