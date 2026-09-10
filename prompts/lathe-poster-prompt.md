# Lathe Reference Poster

## Goal
Build an extremely detailed, print-ready A2 engineering poster about lathes for the DT workshop / coursework.

## Deliverable
`Lathe-Poster.pdf` — 1-page A2 landscape poster (2,000+ words, custom SVG anatomy diagram), built as HTML (`Lathe-Poster.html`) and printed to PDF via headless Chromium (Playwright).

## Content sections
1. Anatomy of an engine lathe — custom-drawn SVG side-view diagram with 12 labelled parts (headstock, spindle, chuck & jaws, workpiece, tool bit, compound rest, cross slide, apron/handwheel, tailstock, dead centre, bed & ways, leadscrew), colour legend, rotation + feed arrows
2. Main parts & their jobs — 16-row table (bed → change gears)
3. Lathe operations — 12 cards (facing, straight turning, taper turning, grooving/parting, knurling, thread cutting, drilling, boring, reaming, eccentric turning, filing/polishing, hard turning) + extras footnote
4. Workholding, measuring & tooling — 3-jaw vs 4-jaw vs collets vs between centres, measuring tools, HSS/carbide/ceramic/CBN/PCD, CNMG insert-code decoder, tool geometry
5. Speeds, feeds & depth of cut — RPM = (CS × 1000) ÷ (π × D) with worked example, cutting-speed table for 7 materials (HSS + carbide), rules of thumb
6. Types of lathes — 10 types + lathe-vs-mill explainer
7. Safety & daily care — shop rules + maintenance checklist
8. Why it matters + footer band: 3,300-year evolution timeline (Egypt bow lathe → CNC) + quick facts

## Style
- A2 landscape (594 × 420 mm), light theme (readability), steel-blue (#2c4166) + orange (#e07b39) engineering palette
- White cards on light-gray background, numbered section headers
- Inline SVG machine diagram with leader lines; no raster images
- Unicode-safe: avoid emoji-range glyphs (they inflate line boxes in Chromium print)

## Build
```bash
# HTML at ~/Desktop/Lathe-Poster.html → PDF via headless Chromium:
python3 - <<'PY'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='<chrome-headless-shell>')
    pg = b.new_page(viewport={'width':2245,'height':1587})
    pg.goto('file:///Users/isaac/Desktop/Lathe-Poster.html')
    pg.pdf(path='/Users/isaac/Desktop/Lathe-Poster.pdf', width='594mm', height='420mm',
           print_background=True, margin={'top':'0','bottom':'0','left':'0','right':'0'})
PY
# Fit check: content scrollHeight must be ≤ 1587px at 96dpi (594mm page)
```

## Verify
- PDF = exactly 1 page (pypdf `page_count`), page size 1684 × 1191 pt
- Text layer spotcheck: HEADSTOCK, Maudslay, RPM formula, CNMG, E-stop all present
- Rendered pixel check: header + footer bands dark, diagram zone non-white
