# Build notes — 「禁日」 flipbook, rebuilt

**Ask:** "its a old flipbook that is very trash i made before with photos, can you make it better maybe with
same size and actually put it into my website as a portfolio card and also one for my homepage"

Two deliverables came out of that: **`demos/kinjitsu/`** (the reader) and **`demos/kinjitsu-teardown.html`**
(the rebuild log), plus a card on the portfolio and a card on the homepage.

---

## 1. What the old thing actually was

Not a compiled app — two **Script Editor applets**:

```
/Applications/Installed Applications/「禁日」.app          → 36 pages, JPEG, 378–465 × 640
/Applications/Installed Applications/「禁日」 后续.app     → 39 pages, PNG,  413–1204 × 640–1734
```

Both carry the **same 15,094-byte `main.scpt`** (`osadecompile` diff is empty) and the same bundle id
`com.apple.ScriptEditor.id.test-flipbook`, displayed as "test flipbook". The pages live inside each bundle at
`Contents/Resources/FlipbookPhotos/page 1.jpg … page 36.jpg` (unpadded numbers).

The script, decompiled:

1. If `FlipbookPhotos/` is empty, copy user-picked images **into the app bundle**, then ask for a re-launch.
2. `defaults write com.apple.Preview PVImageOpeningMode 1` — a machine-wide Preview preference.
3. Open every page at once → 36+ full images decode before first paint.
4. Drive System Events: `⌘2`, `⌥⌘1`, **View ▸ Enter Full Screen**, all inside `try … end try` with a
   "just zoom the window" fallback. When Accessibility is denied you get error `-25211` and the app still
   appears to open — it just never goes full screen.

**Reading order:** filename order, unpadded. Finder's numeric sort gets it right (verified 1,2,…,36); a plain
lexicographic sort would have put page 10 before page 2.

## 2. What "with same size" was taken to mean

Both readings are honoured, because they turned out to be different problems:

- **Same page dimensions** — pages are never resampled. `build-kinjitsu.py` asserts every output file's
  pixel width/height against its source and aborts if they differ; the only change is PNG → JPEG q84.
- **Same viewing size** — the reader has a **100%** mode that draws the page at exactly `naturalWidth ×
  naturalHeight` (page 1 → 451×563 on every viewport, asserted in the tests). Default is fit-to-stage.

## 3. How it is built

`~/scripts/build-kinjitsu.py` (idempotent):

- reads the two bundles read-only, numeric-sorts pages, normalises names to `v1-01.jpg` / `v2-01.jpg`
- copies small JPEGs byte-for-byte; re-encodes the 38.5 MB PNG volume at native size, q84 → 8.65 MB
- writes 220 px thumbnails (75 files, 1.62 MB)
- writes `pages/manifest.json` **and** `pages/manifest.js` (`window.KJ=…`) — the reader loads it as a classic
  `<script>` so the book also works off `file://`, where `fetch()` of local JSON is blocked
- records provenance per page: `"src":"page 7.jpg"` next to the web filename

`demos/kinjitsu/index.html` — one file, no dependencies:

| Concern | Implementation |
|---|---|
| Layout | stage sized per page aspect ratio from the manifest (67 distinct geometries across 75 pages, AR 0.49–0.82) — no stretch, no fake spread; the only crop is the framing pass, which never resamples |
| Turn | two layers; front rotates `-104°` about its left edge in 2400 px perspective; commit resets with `transition:none` + forced reflow so the new page doesn't swing back |
| Continuity | volume 1 → volume 2 chains at the seam (36 → 1) in both directions |
| Prefetch | next 2 / previous 1, plus the far page across a seam |
| Deep links | `#v1p12`, `#v2p20`, kept in sync with `replaceState`; a `hashchange` handler covers pasting a link while already inside |
| Resume | `localStorage["kinjitsu:progress"]` = `{v,p}`; cover offers "Continue page N", hidden on a fresh visit |
| Thumbs | 75-button drawer, cross-volume jump, `aria-current` tracking |
| Keys | `←/→/Space/PageUp/PageDown`, `Home/End`, `T`, `F`, `0`, `Esc` |
| States | spinner while a page decodes, error panel naming the failed file + retry, `prefers-reduced-motion` → 130 ms fade |

## 4. Verification (numbers, not intentions)

`~/scripts/verify-kinjitsu.py` (headless Chromium, 3 viewports) ends with **`FAILURES: none`**:
no horizontal overflow at 390/768/1440, top bar fits (wraps to two rows on phones), page 1 decodes 451×563,
`→`/`←` move 1→2→1, resting transform is literally `none`, 75 thumbnail buttons, end-of-volume roll-over to
1/39, 100% mode = 451×563, **0 console errors, 0 failed requests**.

`~/scripts/verify-kinjitsu-states.py`: fresh visit hides *Continue*; read to page 3 + reload → *Continue page 3*
lands on 3/36; aborting `pages/v1-05.jpg` raises the error panel with that filename; reduced-motion mode still
navigates.

`~/scripts/verify-kinjitsu-page.py`: the write-up page at 390/768/1440 → 0 overflow, 4 tables, thumbnails
decode, CTA lands in the reader.

Two bugs were caught by this pass and fixed before deploy:

1. **`Continue page 1` on a fresh visit** — `.cta{display:inline-flex}` outranked the `hidden` attribute.
   Fixed with `[hidden]{display:none!important}`.
2. **Top bar scrolled sideways at 390 px** — now wraps into two rows (`flex-wrap`, tabs on row 2).
3. **Pasting `#v1p12` while already in the book did nothing** — same-document fragment navigation never
   re-runs the script; added a `hashchange` handler.

## 5. Honest limits

- Source pages are small (page 1 is 451 px wide; drawn 543 px at 1440 = ~1.2× upscale and it shows).
- The pages are photographs: no selectable text, no search, not indexed. This Mac has only English
  `tessdata`, so no CJK OCR was possible — the book's text was never machine-read.
- No audio, bookmarks or per-page notes: none existed in the original.
- The two volumes are chained as one continuous book — my reading of the material, not a documented fact.

## 6. Rebuild

```bash
python3 ~/scripts/build-kinjitsu.py            # stage pages → demos/kinjitsu/pages/
python3 ~/scripts/verify-kinjitsu.py           # FAILURES: none
python3 ~/scripts/verify-kinjitsu-states.py
bash ~/scripts/deploy-isaac-site.sh            # → https://isaac1804.com/portfolio/demos/kinjitsu/
```

Original `.app` bundles were never modified — the build script only reads them.

## Framing pass (white/black edges)

The photos came framed: black caption bar across the top (13% of the height), black surround at the sides, and a
bright white strip along the sheet edge. `~/scripts/trim-kinjitsu-pages.py` takes that off:

- walk each side inward while the line is still dark (mean ≤ 120); accept the band only if the band itself is
  black (mean ≤ 45); then remove the pure-white rim;
- veto the crop if > 1.5% of the page's ink would be lost, and skip dark pages entirely (title cards / night
  scenes — their black *is* the artwork);
- 65 of 75 pages trimmed, median 13.9% of the frame, max ink loss 0.52%.

Order matters: `build-kinjitsu.py` (stages untouched originals) → `trim-kinjitsu-pages.py --apply` →
`reindex-kinjitsu.py` (rewrites manifest + thumbs at the new sizes). Re-running only the first step restores the
original framing.
