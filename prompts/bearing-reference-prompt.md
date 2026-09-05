# Bearing Reference — Interactive Web App

Build spec for the interactive bearing reference (single-file HTML, works offline, no external deps).

## Deliverable
`~/Desktop/bearing-poster/Bearing-Reference.html` (self-contained; ~112 KB; dark engineering/blueprint theme, `#0d1b2e`).

## Purpose
One interactive reference covering EVERY bearing type for DT coursework, F1 in Schools and revision. Superset of the printed poster (`Bearing-Numbers-Poster.pdf`).

## Features (7 tabs)
1. **🔍 Types** — 22 bearing types (deep-groove, angular-contact, self-aligning, thrust ball, cylindrical/needle/tapered/spherical roller, roller thrust, linear bushings, insert/pillow-block, miniature, full-complement, hybrid ceramic, thin-section, crossed roller, slewing, plain bushings, spherical plain, cam follower, air/magnetic). Each card has a parametric SVG cutaway + detail modal (features, uses, example codes, variants, pros/cons, speed/load/misalignment, fact). Search + category filter chips.
2. **🔢 Decoder** — live ISO 15 designation decoder: prefix/type/series/bore/suffix segmentation with colours + meanings. Handles 6205-2RS, NU/NJ/NUP, NA/HK needle, UC inserts, GE/GAC spherical plain, LM linear, MR miniatures, XRB/CRB, KR/CF. Bore rules: 00-03 specials (10/12/15/17), ×5 rule, <10 mm = direct, 620/621/622 specials, HK/NK/GE/LM direct mm.
3. **🧱 Builder** — reverse decoder: pick family → series → bore → suffix, generates a valid code (zero-padded bore codes!) and live-decodes it. ABEC 1-9 vs ISO P0-P2 grade table.
4. **📐 Dimensions** — 67 real bearings (6000/6200/6300/6800/6900 + miniatures incl. 608 8×22×7, 623 3×10×4) with d/D/B + load ratings C/Co; searchable/sortable; row click → L10 life calculator ((C/P)^3 or ^10/3 → million revs + hours).
5. **🛠 Mounting** — 3 mounting rules, ISO 286 fit calculator (p6/j6/h6/g6 shaft; H7/J7/N7/P7 housing, µm values by size range), method cards incl. F1-in-Schools press-fit tip (print PLA hubs 0.1-0.2 mm undersized).
6. **⚠️ Failures** — 8 failure modes (spalling, brinelling, false brinelling, fluting, overheating, contamination, cage damage, corrosion) + grease vs oil + NLGI grades (30-50% fill rule).
7. **🎯 Quiz** — 8 random questions (bore/type/series/suffix), scoring + wrong-answer review.

## Architecture
- Namespaced objects: `B` (data), `T` (SVG), `D` (decoder), `V` (views), `Q` (quiz), `N` (tools).
- Radio-button tab switching; inline `onclick`/`onchange` handlers; string concat (no template literals).
- Built-in `#selftest` harness (runs on load, writes result to hidden div): 24 decoder cases + 12 build-a-code cases + life-calc math + dims/fits checks.

## Verification
- `node --check` on extracted JS.
- Headless Chromium: `--dump-dom` → grep `<div id="selftest">` for `SELFTEST PASS`.
- Works fully offline (no CDN, system fonts only).

## Deploy
- Copied to `demos/bearing-reference.html` in portfolio repo; card uses o:7 iframe demo.
- Live: `https://testisaac1804-byte.github.io/portfolio/` → Bearing Reference card.
