# Vacuum Forming Poster

## Goal
Build an extremely detailed, print-ready A1 technical poster about vacuum forming (thermoforming) for the DT workshop / IGCSE DT 0445 coursework.

## Deliverable
`Vacuum-Forming-Poster.pdf` — 1-page A1 landscape poster (841 × 594 mm, 12 panels), built from `Vacuum-Forming-Poster.html` (inline CSS + SVG diagrams) via headless Chrome print-to-PDF. Editable source HTML kept alongside.

## Panel plan (3 × 4 grid)
1. How vacuum forming works — thermoforming physics, atmospheric pressure does the pressing, glass-transition temp, sag signal + SVG cross-section diagram
2. Machine anatomy — heater bank, clamp frame, sheet, platen, vacuum box (plenum), pump, controller + annotated SVG
3. Step-by-step process — 12 numbered steps from mould design to reset + cycle-timing callout
4. Mold types — male vs female (with SVG), plug assist, drape forming, rule of thumb
5. Materials matrix — HIPS, ABS, PETG, acrylic, PVC, polycarbonate, HDPE/PP with form temps + uses
6. Design rules — draft 3–5°, no undercuts, radiused corners, depth:width ≤ 1:2, vent holes + SLOP mnemonic
7. Making the mold — MDF, plywood, 3D print, plaster, foam, clay + 5-point mould checklist
8. Real-world applications — packaging, medical, automotive, F1-in-Schools + production-scale table
9. Advantages vs disadvantages — 7 vs 7 + exam comparison vs injection moulding
10. Faults & fixes — 9-row troubleshooting table + golden rule callout
11. Safety — 8 badges: heat, gloves, fumes (HCl), cooling, pinch points, fire, trimming + pre-start checklist
12. Glossary + exam facts — 10 key terms + top 6 IGCSE DT 0445 exam points

## Style
- A1 landscape (841 × 594 mm), white background, dark header `#101018` with teal accent `#2dd4bf`
- 12 panels with number badges (01–12), emoji icons, colored accent top borders (red/orange/blue/green/purple/teal)
- Inline SVG vector diagrams for machine cross-section, anatomy, and male/female mould comparison
- Zebra-striped tables with colored header rows, badge chips, numbered step list
- Footer with version note and tag line

## Build
```bash
"/Applications/Installed Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$HOME/Desktop/Vacuum-Forming-Poster.pdf" \
  "file://$HOME/Desktop/Vacuum-Forming-Poster.html"
```

## Notes
- Values are indicative — check manufacturer sheet data (Formech, Vaquform, Formech 686) for exact temps.
- Source HTML kept at `~/Desktop/Vacuum-Forming-Poster.html` for edits; re-run the Chrome command to re-export.
