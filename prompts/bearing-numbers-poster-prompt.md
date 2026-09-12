# Bearings Poster

## Goal
Extremely detailed, print-ready A2 one-sheet technical poster about bearings — types, ISO/DIN numbering, sizes, loads, life, failures, applications.

## Deliverable
`Bearing-Numbers-Poster-A2.pdf` — single-sheet A2 landscape, built with reportlab from `build_poster.py`.

## Content
1. Header — BEARINGS & THEIR NUMBERS + stat chips (ball/roller/plain · angular-contact to 90° · precision P0–P6 · life millions of revs · loads to 100s of kN)
2. What a bearing is — supports a rotating shaft, carries radial + axial loads, reduces friction
3. Bearing types table — deep-groove ball, angular contact, cylindrical roller, tapered roller, spherical, needle, thrust, plain/sleeve
4. The rolling bearing numbering system (ISO 15 / DIN 623) — decode a 4-digit code: type digit, width/series, bore code, prefixes/suffixes (seals, C3, cage)
5. How to read a bearing number — bore = last 2 digits × 5 mm (00=10, 01=12, 02=15, 03=17), series, worked decoder
6. Dimensions & clearances — bore, OD, width; radial clearance (C2/C0/C3/C4); ZZ/2RS vs open
7. Materials & construction — bearing steel 52100/GCr15, races, balls, cages, seals, grease vs oil
8. Loads & life — radial vs axial; dynamic C vs static C0; L10=(C/P)^3 ×10^6; preload
9. Failures & causes — pitting/spalling, brinelling, contamination, misalignment, overheating
10. Common sizes table — 6200, 6300, thin-section (honest indicative values; 6204→20 mm bore)
11. Plain & linear bearings — bronze/sintered bushes, PTFE, linear ball bushings, pillow block
12. Applications — motors, gearboxes, wheels, pulleys, spindles, pumps, fans, conveyors
13. Glossary (13 terms)

## Style
A2 landscape, navy (#0F172A) + orange (#F97316), light print theme, zebra tables, ~2,900 words one sheet.

## Build
```bash
cd ~/Desktop/bearing-poster && env -u PYTHONPATH /Users/isaac/.venvs/poster/bin/python build_poster.py
```

## Notes
Keep bearing numbers accurate (6204→bore 20 mm; 6305→25 mm; 6201-2RS→12 mm, 2 rubber seals). Rebuild script kept next to the PDF.
