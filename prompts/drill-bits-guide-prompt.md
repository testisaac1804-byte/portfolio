# Drill Bits Guide

**Category:** Software & Apps · **Status:** Done

Interactive DT workshop guide — every type of drill bit, how it cuts, when to use it.

**Stack / Tools:** HTML, CSS, JS (single file, no dependencies), SVG vector diagrams

**Build path:**
- V1 — 10-bit A4 poster (PDF), dark workshop-manual style
- V2 — Interactive: 18 bits, anatomy hotspots (hover = part names), material filters, live search, detail modal with specs/tips/safety/related
- V3 — 22 bits (added annular cutter, left-hand bit, flex auger, concrete core), RPM speed calculator (cutting-speed formula), pilot-hole finder, tap-drill chart (M2–M16), 22-question quiz with explanations, troubleshooting table, 8-step technique guide, sharpening & care, 6 drill machines, 21-term glossary

**Location:** `~/Desktop/drill-bits-interactive.html` · live demo `demos/drill-bits-interactive.html` · posters `projects/drill-bits-guide/`

## Build notes
- All bits drawn as inline SVG, tip-down, 160×120 viewBox; orange `.hp` hotspot circles carry `data-label` for the anatomy tooltip/legend sync.
- Teeth zigzags must span exactly the cup width: `l<step> 7 l<step> -7` repeated `W/(2·step)` times — overshooting teeth was a real bug (paths extended past the bit edge).
- RPM formula: `RPM = cutting speed (m/min) × 1000 ÷ (π × Ø mm)`, clamped per bit type (hole saw ≤600, Forstner ≤1200, spade ≤1800).
- Pilot hole ≈ 68–80% of screw Ø by material; tap drill ≈ major Ø − pitch.
- Print = A3 landscape poster of all 22 cards via `@media print`; `#sec-bits { display:block !important }` in print so the poster exports from ANY tab (blank-PDF bug fixed).
- `.backdrop[hidden]{display:none!important}` required — the `.backdrop{display:flex}` class overrode the `hidden` attribute and blocked all clicks.
- Tested headless via Playwright (Chromium 1234): 22 cards, calculators, quiz flow, zero JS errors.
