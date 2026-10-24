# Build spec — full mirror of ps.ps

**Slug:** `psps` · **Status:** done · **Date:** 21 Oct 2026 · **Origin:** `https://ps.ps`

## Goal

Isaac was sent `ps.ps` with “what even is that”. Answer that three ways at once:

1. say what the site is in plain English,
2. say whether it is safe to open,
3. keep a **full, browsable copy** of it in the portfolio, plus a long-form teardown.

The mirror is the deliverable — a screenshot would not survive the origin going away, and this is an
aggregated content blog whose posts are mostly images and short lists.

## Deliverables

| File | What it is |
|---|---|
| `demos/psps-mirror/` | 53 pages + 84 assets, 10.6 MB, browsable with no server |
| `demos/psps-mirror/MIRROR.json` | URL → local path → origin sha256, plus the rewrite rules |
| `demos/psps-analysis.html` | long-form teardown (the card's “Read the analysis”) |
| `prompts/psps-mirror-prompt.md` | this spec |

## Routing (Z-BlogPHP uses query strings, static hosting does not)

| Origin | File |
|---|---|
| `/` | `index.html` |
| `/?id=N` | `p/N.html` |
| `/?cate=N` | `cate/N.html` |
| `/?cate=N&page=M` | `cate/N-M.html` |
| `/?page=M` | `page/M.html` |
| `/?date=YYYY-MM` | `date/YYYY-MM.html` |
| `/?date=YYYY-MM&page=M` | `date/YYYY-MM-M.html` |
| `/zb_users/…`, `/zb_system/…` | same path, kept at mirror root |

## Rewrite rules (the only edits inside any page)

1. Internal absolute links `https://ps.ps/…` → the mapping above, relative to the file's depth.
2. Root-absolute assets → depth-relative, so `/portfolio/demos/psps-mirror/` works under a subpath.
3. Search form `action` disabled (`#` + `onsubmit="return false"`) — a static mirror must not POST to the
   live blog. The box stays visible, inert, and the analysis page says so.
4. `zb_system/script/c_html_js_add.php?…` saved as `.js` so the server sends a JavaScript content-type;
   `bloghost`/`ajaxurl` inside it blanked for the same reason as (3).
5. `feed.php` saved as `feed.xml` so browsers parse it instead of downloading it.
6. `<link rel="canonical">` and `og:url` are **left pointing at the origin** — they are metadata, not
   navigation.

## Verification (do this, don't claim it)

1. **Link closure:** parse every local HTML file, resolve every relative `href`/`src`/`action`, assert the
   target exists. Repeat the crawl until no new URL appears. Result: 0 unresolved.
2. **Fidelity:** re-fetch each origin URL, replay the exact rewrite function, byte-compare with the local
   file. Any mismatch is a bug in the rewrite, not in the capture.
3. **Render:** serve the folder, load 5 representative pages in headless Chromium, assert 0 failed requests
   and non-empty `innerText`.
4. **Safety, passive only:** headers, HTTP→HTTPS behaviour, unknown-path response, outbound links,
   URLhaus. Never log in, never submit a form.

## Pitfalls hit on this build

- Grep-based `?page=` rewriting corrupts `?date=YYYY-MM&page=M` — parse the query string, then match
  longest-first (`cate&page`, then `cate`, then `date&page`, then `date`, then `page`).
- A “skip if `rel="canonical"` within N chars” heuristic silently skips the `<link>` that follows it. Match
  the enclosing tag instead.
- The idempotent pass must pass unknown paths through untouched, or a second run mangles already-relative
  links (`="./q/x"` → `"./x"` class of bug).
- The theme's icon font is referenced from CSS, not HTML — parse `url()` in stylesheets too.

## Known gaps (state them, don't paper over)

`?id=2`, `?id=21`, `?cate=3/5/6` are 404 at the origin. No sitemap and no tag index, so the crawl is
bounded by what the pages link to. Search and comments are server-side and cannot work statically.
Snapshot: 21 Oct 2026.
