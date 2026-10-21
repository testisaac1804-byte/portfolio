# Build spec — Island School Google Sites: how many paths sit behind one URL

**Ask (21 Oct 2026):** *"how many /. are behind this link https://sites.google.com/online.island.edu.hk"*
→ then *"can you put it in my portfolio"*.

**Deliverable:** `demos/island-gsites-teardown.html` (recon page + live 164-path inventory),
`demos/island-gsites-data.json` / `.csv` (dataset), portfolio card.

## 0. Acceptance test (written before building)

1. **Functional** — the page states the real answer (11 public, 153 gated, 164 paths, ~800 nav
   entries), renders all 164 paths in a filterable/searchable table, and ships the dataset as
   JSON + CSV. No path list is fetched at runtime: the data is inline.
2. **Layout bar** — no horizontal page scroll at 390 / 768 / 1440; inventory table needs no
   horizontal scroll on a phone (fixed layout, title merged under the slug); tap targets ≥ 44 px;
   evidence table stacks into cards below 600 px; empty-search state is explicit; focus-visible
   ring on every control; 0 console errors.

## 1. What the URL actually is

`sites.google.com/online.island.edu.hk` → **HTTP 404, 0 bytes**. It is a namespace, not a site.
Each Site occupies one path segment under it. Google Sites exposes no directory listing, no
sitemap index, and no public API that lists a domain's Sites.

## 2. Discovery legs (in order, each one leaks what the last missed)

| # | leg | what it gave | how |
|---|---|---|---|
| 1 | Google index | 12 slugs | `site:sites.google.com/online.island.edu.hk`, paginated 30 pages via real Chrome + CDP; CAPTCHA at page 8 → crawler self-aborts |
| 2 | Wayback CDX | 162 slugs | CDX over `/online.island.edu.hk/*` **and** legacy `/a/online.island.edu.hk/*` |
| 3 | on-site links | +1 | crawl `island.edu.hk` + sitemap + live Sites nav HTML → found `is-experiential-learning` |
| 4 | live probe | 11 / 153 | every candidate fetched, classified by final URL + `<title>` |

Classification rule: `200` + real `<title>` + Sites markup ⇒ **public**; redirect to
`accounts.google.com` ⇒ **gated**. Then re-check all 11 public with plain `curl` (no cookie jar)
so a cached response cannot fake a pass.

## 3. Numbers (re-derive, never inherit)

- 164 distinct paths = 11 public + 153 gated
- ~800 public nav entries (Maths 196, French 135, Spanish 97, Japanese 84, Chinese 83,
  Elements 77, Higher Ed 56, IBCP 36, CAS 16, Quest Week 13, GP Cookbook 7)
- 162 archive slugs; 12 index slugs; 0 credentials used
- Nav entries are nav links, **not** certified page totals — say so on the page

## 4. Page structure (kept from the teardown family)

hero + stat strip → "the link is not a site" callout → method (4 legs + chain diagram) →
live inventory table (search / filter / copy / download, empty state) → the 11 public sites →
the 153 gated list + what "gated" does *not* prove → honest limitation → evidence table →
what's next → footer (Method + Honesty notes).

## 5. Verification actually run

- Playwright at 390 / 768 / 1440: `document.documentElement.scrollWidth - innerWidth == 0`,
  164 rows, `minTap = 44`, 0 console errors
- filter: Public → 11 rows, Gated → 153 rows; search `french` → 2 rows (`/islandschoolfrench`,
  `/french-speaking-practice`); search `zzzznope` → empty state visible, table hidden
- `#inv` scrollWidth == clientWidth at 390 (fixed layout + `.tsub` second line)
- dataset downloads: JSON 200 / 12,468 B, CSV 200 / 4,687 B
- screenshots read back at 390 / 1440 and graded (hero, inventory, evidence, 153-list)

## 6. Pitfalls hit

- `overflow-wrap:anywhere` on a slug column breaks words mid-syllable (`/islandschoo lfrench`);
  `break-word` + `table-layout:fixed` gives clean breaks at hyphens with zero horizontal scroll.
- A 4-column inventory on a 390 px screen: hide Title/Nav and render them as a muted second line
  under the path (`.tsub`) instead of letting the table scroll.
- CSS `content:"\00b7"` inside a Python f-string rendered as literal `007` — use the real `·`.
- Auto table layout takes its min width from the longest unbreakable slug, so `break-word` alone
  does not stop overflow; only `table-layout:fixed` + explicit column widths does.

## 7. Honesty

164 is what is visible from outside. A Site never published, linked, crawled or archived is
invisible to all four legs; an exact count needs the school's Sites dashboard. No account, token
or sign-in wall was touched.
