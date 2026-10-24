# Build spec — Shrinkage & fit calculators (shrink-only page + lock-taper pocket)

**Goal.** Two single-file HTML tools and one CLI around a single honest claim: a 40 mm printed cube
**cannot** resolve the shrinkage it is meant to measure, so a shrink calculator must be allowed to answer
*“no change, leave the slicer at 100 %”*. The second tool answers the question that shrinkage cannot —
how to make a part go in **slowly and smoothly** instead of dropping in or needing a mallet.

## Hard requirements

- **Zero network requests** in both pages: no CDN, no webfonts, no raster assets, no `fetch`. Must run from
  `file://`, from a USB stick, and inside a portfolio iframe. (Verified: `0` matches for `src=`/`href=` to
  anything external in the shrink page.)
- **Shrink page does one job.** Preset material, nominal size, three reading boxes, and four outputs
  (shrink %, slicer scale %, measured mm, off nominal mm) plus a per-axis table. No pocket geometry, no
  lead-in controls, no diagrams. The fit tool stays separate so neither page compromises the other.
- **Multiple readings per axis**, accepted space/comma/newline separated. Per-axis datum is the
  **minimum** (a tilted caliper only ever reads big); measured size is the **mean of the axis minima**.
  Spread is reported separately so noise never hides inside an average.
- **A noise floor derived from the user's own data:** `max(0.05, max_spread/2 + 0.02)` mm. A deviation
  at or below it must produce **100.00 % scale**, with the raw arithmetic shown greyed underneath as
  evidence — never as the instruction.
- **Verdict precedence, fixed and testable:** preset → nothing parseable → under noise → oversized →
  real shrink. Coverage warnings (“only one axis”) are **notes**, never the verdict, or they mask the
  oversized branch.
- **Never emit a dishonest number:** no `NaN`, no `Infinity`, no `0.000 %` from junk input, and no
  sub-100 % scale offered as the fix for a part that printed oversized.
- **Lock fit:** gap ramps from mouth to floor instead of being constant. Defaults
  `−0.04 mm/side` land clearance, `0.20 mm/side` mouth opening, taper length **equal to** pocket depth.
  Report free travel, bite-zone length and bite rate (µm per mm of push); warn below 1.5 mm of bite zone,
  above 0.09 mm/side interference, and when the mouth is so wide the first millimetres fall in loose.
- **Every number on screen is re-derivable in one line of arithmetic** shown on the analysis page.
- CLI parity: `dt filament shrink <nominal> <reading…>` prints shrink only (`--pocket` opts into geometry);
  `dt filament fit <envelope> --fit lock --clearance -0.04 --hole-bias 0 --lead taper --lead-allow 0.20
  --taper-len 20` prints the pocket and the insertion ramp. `--json` on both.

## Verification contract

- Headless Chrome at **390 / 768 / 1440 px**, narrow widths via iframe (Chrome clamps a headless window to
  ~500 px, so a “390 px” screenshot at window width is a lie).
- Assertions: `document.documentElement.scrollWidth <= innerWidth`, min tap target ≥ 44 px, table
  overflow = 0, no clipped SVG text (via `getBBox()`), `0` console errors.
- Every displayed value recomputed independently in Python and compared to the rendered DOM — 9 maths
  checks, 8 UI states (empty, measured, real shrink, oversized, one axis, junk, zero nominal, after reset).
- Both harnesses live in `~/.hermes/scripts/` (`verify-shrink.py`, `verify-shrinkfit.py`) and exit non-zero
  on any failed assertion.

## Pitfalls worth carrying forward

- **A scale factor is not a fit knob.** It multiplies the gap along with the parts: scaling both to
  100.3 % turns a 0.16 mm mouth gap into 0.1605 mm. Shrink correction preserves fits by design; only
  pocket mouth/floor/taper change how entry feels.
- **40 mm is too short a witness.** One caliper tick (0.01 mm) is 0.025 % on 40 mm — half the effect.
  Use a 100 mm+ bar before believing any material constant; the preset table exists for the rest.
- **Elephant's foot is not shrinkage.** A 40.09 mm bottom against a 40.05 mm mid-face is a first-layer
  flare (+0.02 mm/side). Use the mid-face minima for shrink, the bottom maximum for entry clearance.
- **`dt` must be a symlink, not a copy** — a copied launcher resolves `DT_DIR` to `/usr/local/bin` and
  every sub-app dies with exit 2. Fixed with `resolve_root()`.
- The stiffest bug found in testing was a *correct-looking* one: the single-axis warning was promoted to
  the verdict, which silently hid the oversized message. Test states in pairs, not one at a time.

## Files

| Path | Role |
|---|---|
| `~/Desktop/Shrink-Calculator.html` | shrink-only page, 18,556 B, self-contained |
| `~/Desktop/Shrink-Fit-Calculator.html` | pocket / lock-taper calculator, 48,434 B |
| `~/DTApps/filament-calc/filament` | CLI: `shrink`, `fit`, `shrinklist` |
| `~/.hermes/scripts/verify-shrink.py` | shrink-page harness |
| `~/.hermes/scripts/verify-shrinkfit.py` | fit-page harness |
