# The Mill Poster — build spec

## Goal
One extremely detailed, print-ready A3 landscape poster covering the complete history and mechanics of mills:
watermills, windmills, textile mills and modern mills.

## Sections (10 color-coded panels, 3 columns)
1. **What Is a Mill?** — definition + universal 4-step chain (energy → rotation → gears → tool) with flow diagram
2. **Timeline** — 20 milestones from rotary querns (~200 BCE) to modern wind turbines (20-row table)
3. **Watermills** — full drive chain (pit wheel → wallower → spur wheel → stone nut), 5 wheel types with
   efficiencies (undershot/breastshot/pitchback/overshot/Poncelet), power formula P = 1000·9.81·Q·h·η with worked example
4. **Windmills** — sails → windshaft → brake wheel → stones, post/tower/smock mills, common/spring/patent sails,
   fantail (first feedback device), P = ½ρAv³Cp with Betz limit + worked example
5. **Gears & Mechanisms** — crown, bevel, lantern/wallower, spur, worm gears; cams & trip hammers; governors;
   Archimedes screw; gear-ratio maths (12 rpm wheel → ~180 rpm stones)
6. **Textile Mills** — spinning jenny, water frame, spinning mule, power loom; factory system, Cromford,
   Cottonopolis, Factory Act 1833, Ten Hours Act
7. **Modern Mills** — roller flour mills, Fourdrinier paper, steel rolling, sawmills, Pelton/Francis/Kaplan
   hydro turbines, HAWT wind turbines
8. **Mill Math** — 4 formula boxes (water power, wind power, gearing, units/rules of thumb) with worked examples
9. **Glossary** — 28 key terms in a side-by-side table
10. **Fun Facts** — Domesday Book mills, Barbegal, Dutch polders, governor → thermostat lineage

## Design
- A3 landscape (1190.55 × 841.89 pt), light paper background, deep navy title band
- 3 flowing columns, color-coded section panels (blue/cyan/teal/indigo/violet/orange/green/red/stone/pink)
- Body 6.6 pt Helvetica, section headers 8.6 pt bold white on accent bars, tables 5.5–5.8 pt
- WinAnsi-safe characters only (no Greek letters/arrows — they don't render in Helvetica)

## Tooling
- Build script: `~/.hermes/scripts/mills_poster_build.py`
- Python env: `~/.hermes/venvs/pdfenv` (reportlab, pypdf, pypdfium2, pdfplumber)
- Verification: content-stream grep via pypdf (dense multi-column text scrambles pdfplumber extraction);
  geometry check prints remaining column space per column and warns on overflow

## Output
- `Desktop/mills-poster/Mills-Poster.pdf` (~40 KB, vector)
- `Desktop/mills-poster/Mills-Poster-preview.png` (render for portfolio card preview)
