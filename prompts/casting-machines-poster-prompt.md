# Casting Machines Poster

## Goal
Build an extremely detailed, print-ready A2 technical poster about casting machines for DT (IGCSE 0445 Manufacturing Technology) / coursework.

## Deliverable
`Casting-Machines-Poster.pdf` — single-sheet A2 landscape poster (2,000+ words), built with reportlab from `build_poster.py`.

## Content plan
1. Header — title + stat chips (6,000+ years old · 90% of world steel continuously cast · ±0.05 mm best tolerance · 6 machine families · 100% scrap recycled)
2. The basics — what casting is, the 6-step cycle (melt → mould → pour → fill → solidify → finish), why cast vs machine, expendable vs permanent mould family tree
3. The melting machines — furnaces table: cupola, induction (coreless), electric arc (EAF), crucible, reverberatory (how each melts / metals / typical use)
4. Machine family 1 — sand casting system: flasks (cope/drag), jolt-squeeze machine, sand slinger, automatic lines, core shooter, shakeout + full process flow
5. Machine family 2 — die casting machine: clamping unit (kN rating), die anatomy, hot chamber (gooseneck/plunger, Zn/Mg) vs cold chamber (shot sleeve, Al/brass), 6-step cycle
6. Machine family 3 — investment casting line (lost wax): wax injection press, shell line, autoclave dewax, burnout furnace, pour station
7. Machine family 4 — centrifugal casting machine (horizontal/vertical axis, ~100×g)
8. Machine family 5 — continuous casting machine (ladle → tundish → water-cooled copper mould → pinch rolls → torch cut)
9. Machine family 6 — other processes: gravity die, low-pressure die, lost foam, shell moulding, squeeze, vacuum
10. Process comparison matrix (10 processes × tolerance/finish/batch/tooling/parts)
11. Casting defects table (9 defects: cause + prevention)
12. Design rules + shrinkage allowances per metal
13. Materials table (grey iron → Zamak)
14. Glossary (18 key terms) + DT exam-tip box (sand vs die casting)

## Style
- A2 landscape, navy (#0F172A) + molten-orange (#F97316) theme, light background for printing
- Zebra-striped tables, navy header rows, orange kicker bars on section banners
- WinAnsi-safe characters (arrows via Symbol-font fallback verified in build)

## Build
```bash
cd ~/Desktop/casting-poster && SIZE=A2 /Users/isaac/.venvs/poster/bin/python build_poster.py
```

## Notes
- Values are indicative industry standards (tolerances, shrinkage %, melt temperatures).
- Rebuild script kept at `~/Desktop/casting-poster/build_poster.py` for edits.
