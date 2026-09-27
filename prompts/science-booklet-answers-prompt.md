# Science Booklet Answer Keys (all 19 booklets)

**Category:** School / Science
**Status:** Done — published

Every science student booklet from Years 7–Y10/DAB, re-issued as a **full answer version**:
the original pages, images and questions are kept exactly as printed, with the model answers
added on top in red — written on the dotted answer lines, filled into the underline blanks,
ringed around the correct multiple-choice option, ticked in the correct box, and dropped into
the ruled table cells. Where a page genuinely has no room to write, the leftover answers are
listed on a clearly marked appendix page at the back so nothing is left unanswered.

**Stack / Tools:**
- PyMuPDF (`pymupdf`) — reads every text line, character box, fill-in blank (`_`, `…`),
  drawing/ruled line and table cell from the original PDF, and writes the red answers
  straight onto the untouched original pages (no rasterising, no re-layout, page count and
  images preserved).
- A layout engine that finds the whitespace: dotted answer lines, empty ruled table cells
  (matched to their row label), and free vertical bands; answers fall back to a tidy
  appendix page only when a page has literally nowhere to write.
- Parallel subagents each wrote the model answers for a 30-page slice of one booklet from
  the extracted text, output as structured JSON, then merged and rendered.

**How:**
1. Extracted page structure from all 19 booklets — 1,328 pages, 1,791 fill-in blanks,
   12,093 ruled lines, 7,099 images, plus every empty table cell with its row label.
2. Split each booklet into ~30-page chunks and had a subagent write the mark-scheme-style
   answers for each chunk as JSON (`blank` / `ring` / `tick` / `free` / `cell` / `note`).
3. Merged the chunks per booklet and rendered each answer version with PyMuPDF: answers
   written in red on the original pages, with per-page layout checks and visual QA.
4. Published the PDFs to the portfolio-files store (served through the files proxy, so they
   preview inline in the browser) and regenerated the science-booklet browse page on both
   isaac1804.com and the portfolio.

**Sources:** Island School science student booklets (PDF), 2024–2027 editions.

**Location:**
- `~/Documents/science booklet/` — originals
- `~/Documents/projects/science-answers/` — extract → answer JSON → render pipeline
- `https://isaac1804.com/science%20booklet/` — browse + preview (both sites)
