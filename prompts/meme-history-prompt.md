# Build spec — 梗史 2000—2026 (Chinese internet meme history)

**Goal.** One self-contained HTML file that documents Chinese internet memes year by year, 2000 → 2026,
with the origin of each meme rather than a naked list of names.

## Hard requirements

- Single file, **zero network requests** (no CDN, no webfonts, no images). Must open from a USB stick and print cleanly.
- Every year 2000–2026 gets the **same skeleton**: giant numeral, one-line note for the year, one tier-1
  “meme of the year” card (3-paragraph origin story + *why this one* + *how to use it*), then 5–11 short cards
  (origin line + one paragraph).
- Preserve user-supplied names verbatim, including lowercase Latin (`mj`, `city 不 city`, `栓 Q`).
- Search, tag filter, and year jump. A bare four-digit query must take a **year branch** (exact year match),
  not a substring match.
- Counts in the header/footer are computed from the payload, never hard-coded.

## Data shape

```json
{"y":2009,"name":"贾君鹏你妈妈喊你回家吃饭","tag":"围观事件","tier":1,
 "origin":"one line: where it came from",
 "story":["para","para","para"],
 "why":"why this is the year's meme","use":"how people actually use the phrase",
 "src":["维基百科","https://…"]}
```

`tier:2` entries carry `origin` + `story[]` only. The year is the only grouping key — adding a year is one array.

## Editorial rules

1. **Year = widest spread, not birth.** 很黄很暴力 aired Dec 2007, filed 2008. State the rule on the page.
2. **Do not pad.** 2000–2007 has 6–9 entries a year and that is the honest shape; the era text says why
   (memes grew out of typing habits then, and documentation is thin).
3. **No invented numbers.** A figure appears only if a source had it. Where media conflict (the MJ effect,
   the 牛来 box office), give both and say they conflict.
4. **Judgement is visible.** Each king carries a *why this one* box so a reader can disagree with the pick.
5. **Five eras**, each naming the medium that produced the memes of that period:
   2000–2007 网络方言 / 2008–2012 围观 / 2013–2017 造词 / 2018–2022 短视频 / 2023–2026 抽象与情绪.

## Verification (all of it ran)

```bash
# headless Chromium, DOM read-back
chromium --headless=new --virtual-time-budget=4000 --dump-dom file://…/meme-history.html | grep -c '<article'
# → 250 ; sections → 27 ; .card.hl → 27
```

Interaction was tested by dispatching real `input`/`click` events and writing the result into `document.title`,
then reading the DOM: `2003` → 8 cards, `馒头` → 3, `zzzz` → 0, clear → 250, tag 网络方言 → 20.
Layout: `scrollWidth ≤ innerWidth` at 500/768/1280/1440 px, 0 JS errors.

## Known gaps

- No images (deliberate — keeps the zero-request property).
- 2026 stops at August; September–October still moving.
- 2000–2007 dates are year-level, not month-level.
