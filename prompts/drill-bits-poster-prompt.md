# Drill Bits Poster

## Goal
Extremely detailed, print-ready A2 one-sheet technical poster about drill bits — types, geometry, sizes, speeds, materials, defects, safety.

## Deliverable
`Drill-Bits-Poster-A2.pdf` — single-sheet A2 landscape, built with reportlab from `build_poster.py`.

## Content
1. Header — DRILL BITS / THE COMPLETE REFERENCE + stat chips (sizes 0.1–80+ mm · spindles to 100k rpm· point 90–135° · HSS vs carbide coatings · 2/3/4 flutes)
2. Anatomy of a twist drill — shank, body, flutes, lips, point (web/chisel edge/margins), helix
3. Drill types table (13) — twist/jobber, stub, long/silver & Deming, centre, step, countersink, counterbore, spade, masonry, gun/straight-flute, indexable, core/annular
4. Drill materials — HSS, HSS-Co, carbide, coated (TiN/TiAlN/TiCN), PKD/diamond
5. Point geometries — 118°, split point, 135°, rake, parabolic, brad point
6. Sizes & numbering — fractional, metric, wire gauge 1–80, letter A–Z, DIN
7. Speeds & feeds — cutting speed by material, n=(1000·V)/(π·D), feed/rev, peck drilling
8. Coolant & chip removal — flood/mist/through-tool, deep-hole pecking
9. Defects & fixes table (7) — wander, oversize, chatter, work hardening, burned, broken, burr
10. Operation advice — punch, pilot, clearance vs tap, countersink depth, backing plate
11. Comparison — drill vs reamer vs tap; twist vs step vs hole saw vs annular
12. Safety (7 rules)
13. Glossary (14 terms)

## Style
A2 landscape, navy (#0F172A) + orange (#F97316), light print theme, zebra tables, ~2,400 words one sheet.

## Build
```bash
cd ~/Desktop/drill-bits-poster && env -u PYTHONPATH /Users/isaac/.venvs/poster/bin/python build_poster.py
```

## Notes
Values are indicative industry standards. Rebuild script kept next to the PDF.
