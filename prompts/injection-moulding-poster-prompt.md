# Injection Moulding Poster

7-page A4 manufacturing revision poster (IGCSE DT 0445), print-ready PDF.

## Stack
- Python + **reportlab** (platypus + vector `Drawing` graphics) — venv: `~/.venvs/pdfenv`
- pypdfium2 (page renders for preview PNG)

## How it works
- Script: `~/Desktop/injection-moulding-poster.py` → `~/Desktop/Injection-Moulding-Poster.pdf`
- Full-styled platypus: banner, colour-bar section headers, callout boxes, zebra tables
- Three hand-built vector diagrams: annotated injection machine (hopper/barrel/screw/nozzle/clamp, numbered to a parts table), 7-step cycle timeline with width ∝ time, and a two-plate mould cross-section (sprue/runner/gate/cavity/core/cooling/ejectors/parting line)
- Content: process definition, machine parts, cycle, gates, mould anatomy, over/insert moulding, undercuts, 10-polymer table, additives, DFM rules, surface features, 12-defect table, pros/cons, applications, sustainability, process comparison, 18-term glossary

## Key details / pitfalls
- Reportlab 5.x changed `Polygon(...)` to `Polygon(points=[...])` — old positional list args crash
- Helvetica = WinAnsi only: replace ≈ → ~, → → -, Ø → dia. or the glyphs render as boxes
- Keep sections as `KeepTogether` blocks; measure flowable heights before placing page breaks (a naive layout left near-empty pages)
- Layout verified via pdfplumber text extraction + pypdfium2 ink-coverage render (model has no vision)

## Usage
```bash
~/.venvs/pdfenv/bin/python ~/Desktop/injection-moulding-poster.py
```
Rebuild → regenerate preview PNG (pypdfium2 page 1 render) → portfolio card already wired to `Desktop/injection-moulding-poster/`.
