# isaac1804.com — Site Plan & Expansion Ideas

_Last updated: 2026-09-27 · Live: https://isaac1804.com · Deploy: `bash ~/scripts/deploy-isaac-site.sh`_

## 1. What the site is today

| Path | What it is |
|---|---|
| `/` | Homepage — link hub: Portfolio, Web Apps, Quest, Macintosh HD, Browse Files, Local Servers, Links |
| `/portfolio/` | 422 cards across 4 categories + ~25 browse libraries (3D print, VEX, laser, sheet music, manuals) |
| `/quests/` | **NEW** — hub for the three Chinese ARG sites (孩子回家 / 溪埕國小 / 邺山彼处) + guides |
| `/isaac-dt/` | Design & Technology site |
| `/nas/` | IsaacNAS portal |
| `/childquest-*`, `/hces-quest-*`, `/yeshan-*` | The three quest sites + their walkthrough guides |
| `/science booklet/` | IGCSE science booklets (proxy-served) — 19 files incl. the 2026–27 editions |
| `/revision/` | IGCSE revision hub by subject (+ `/revision/unit-1-number/` Maths unit page) |
| `/tools/` | Workshop calculators (laser, gears, resistors, beams, filament, CNC) |
| `/tools/link-compressor/` | **NEW** — Link Compressor: paste a long link → `isaac1804.com/s/xxxxx` (bulk, QR, click counts) |
| `/s/<code>` | **NEW** — short links: Worker route, 302 + click counting, KV `LINKS` |

**Architecture:** one Cloudflare Pages deployment; bulk files live in the `portfolio-files` store and are served
through `files-proxy.isaac1804.workers.dev` (correct content-types, inline previews, `?download=1`).
DNS on Cloudflare (`carla`/`yichun.ns.cloudflare.com`), nameservers set at Spaceship via API.

### File pipeline (run in this order)

```bash
python3 ~/scripts/sync-igcse-files.py   # ~/Documents -> portfolio + homepage + portfolio-files, then push
bash   ~/scripts/portfolio-prep.sh      # regenerate every browse page (now includes proxy listings)
python3 ~/scripts/gen-sitemap.py        # sitemap.xml
bash   ~/scripts/deploy-isaac-site.sh   # portfolio-prep + CV cards + wrangler pages deploy
python3 ~/scripts/verify-site-update.py # check the live URLs actually serve the new stuff
```

---

## 2a. Shipped 2026-09-27 (evening) — 🔗 Link Compressor

**New `/tools/link-compressor/`** — a self-hosted URL shortener living on the real domain:
paste a long link, get `https://isaac1804.com/s/xxxxx` back. It is the hosted big sibling of the
browser-only **a1d2.org** compressor (that one only rewrites a link; this one *owns* the short link
and logs who used it).

- **Backend:** new Worker `isaac-links` (`~/Documents/projects/apps/isaac-links/`, `./deploy.sh`) +
  KV namespace `LINKS` (id `30cd56899a0b4dbcb82325e562954409`). **Worker routes on the Pages zone:**
  `isaac1804.com/s/*`, `/api/links*`, `/api/shorten`, `/api/stats` — Worker routes take precedence
  over the Pages custom domain for those paths, so both live on the same hostname. workers.dev is
  now off for this Worker.
- **Compresses, not just shortens:** strips `utm_*` / `fbclid` / `gclid` / `igshid` / `si` / `spm` …
  and reports what it removed; signed URLs (`X-Amz-Signature`, `token`, `expires`) are left alone.
- Codes: 5 chars, 31-char alphabet with no `0 O 1 l i`; custom names allowed; repeating a URL
  returns its existing code. QR codes are generated in-page (self-hosted `qrcode.min.js`).
- **Abuse guard:** compressing is **open to anyone for any link** (Isaac's call, 2026-09-27 — it has
  to work for whoever he sends the tool to), guarded by a 200-links/hour/IP limit and `http(s)`-only
  targets. The admin token only adds custom names / delete / global list — token lives in
  `~/.isaac-links-token` (chmod 600) and a Worker secret, never in the page source.
- Page features: bulk paste (one link per line), per-link "was 214 chars → 33 chars · 85% smaller"
  readout, copy/open/QR/delete per link, searchable history in `localStorage`, JSON export,
  live totals. Token can be handed to a phone as `/tools/link-compressor/#token=…`.
- Wired in: homepage hub card, `/tools/` banner, `sitemap.xml`, portfolio card
  (**431 cards**, `sw`, newest position so it shows in "Recently added") + `prompts/link-compressor-prompt.md`.
- **Verified live** with `~/Documents/projects/apps/isaac-links/test-e2e.py` (Playwright, headless):
  46/46 checks — load, single/bulk/deduped compressing, real redirect, an outside link compressing
  with no token, custom slug after unlocking, the log refusing reads without the token, the creator +
  click log showing IP/place/ISP/device, the activity feed, 12 authenticated creations back-to-back,
  QR canvas, stats, mobile no-h-scroll, zero JS errors.
- Known quirk (documented in the UI): Cloudflare's KV **list** API is eventually consistent, so the
  Totals card can lag up to ~60 s behind a link you just made; per-link counts are immediate.

### 2a-bis. Link Compressor V1.2 — tracking + unlimited (same evening)

Isaac asked: *"when someone clicks … I (only me) can check who clicked on it and who created the
shorten link, and if I put in password I can also make unlimited shorten links."*

- **Who created it** — every `POST /api/links` stores `by`: IP, city/region/country, ISP
  (`cf.asOrganization`) + ASN, Cloudflare colo, timezone, lat/long when available, language, device
  string (`Chrome on Mac` / `Safari on iPhone` / `bot / link preview`) and the raw user-agent.
- **Who clicked it** — every `/s/<code>` hit appends to `ev:<code>` (last **100** clicks, newest
  first) with the same fields plus the **referer**; `cl:` total and `last:` timestamp stay separate so
  the redirect never waits on a write (`ctx.waitUntil`). Nothing is loaded on the visitor's machine —
  it all comes from the request Cloudflare already sees. No cookies, no third-party script.
- **Only Isaac sees it** — `GET /api/links/<code>` and `GET /api/activity` both 401 without the token
  (verified in the e2e). Public `POST`/`/s/` never expose a log.
- **Password = unlimited** — the 200/hour/IP limit and its KV counter are consulted only when the
  request is *not* authenticated; with the token there is no rate limit at all (12 back-to-back
  creations + a 25-in-a-row curl run, all 200; the 429 branch is unreachable with a token).
- **UI**: each link row now has **📊 Log** → a modal with the created-by block, clicks/unique-IPs/
  countries chips and one card per click; plus a **📈 Who clicked — activity** card with a combined
  newest-first feed of creations and clicks (and a 🔄 refresh). Both are token-gated and say so when
  locked.
- **Real bug found & fixed while building this:** Cloudflare **route patterns match the path
  INCLUDING the query string** — `isaac1804.com/api/activity` alone did NOT match
  `…/api/activity?limit=5`, so the request fell through to Pages and returned the site's 404 HTML
  while the same path with no query returned 200. Every pattern now ends in `*`
  (`/api/activity*`, `/api/stats*`, `/api/shorten*`) with a comment in `wrangler.toml` so nobody
  "tidies" them back. This is the second `wrangler.toml`/routes trap on this project.
- New helper script `~/scripts/check-inline-js.py` — extracts and `node --check`s every inline
  `<script>` in a page (the tool page's JS is 20 KB of hand-written vanilla JS; deploy only after it
  passes).

---

## 2. Shipped 2026-09-27 (this round)

**Files synced up (all three repos pushed):**
- **3 new 2026–27 science booklets** — Chemistry Unit 1, DAB Unit 1 Cells & Microbes (Revised June 2026), Forces Double Award 2026 → `science booklet/` in the portfolio + homepage repos *and* the `portfolio-files` store (the browse pages link to the proxy, which only serves that store)
- **135 new Y10 (1011) lesson files / 185 MB** — Biology Cells & Microbes L1–8 + revision pack (knowledge organiser, exam questions, answers), Chemistry Unit 1 lessons 1–6 + Unit 1 revision worksheets with mark schemes, DT 10DT201 material-properties tree, Maths Unit 1, Thrive L1–5, Chinese 0509, English FLE
- **4526 Cambridge past papers** committed to the portfolio-files store (repo now 11,526 tracked files)
- Economics Edexcel textbook re-split into 3 parts (<100 MB each) for GitHub

**8 new cards** (`des`, portfolio now **430 cards**):
IGCSE Science Booklets 2026–27 · IGCSE Biology Cells & Microbes (Unit 1) · IGCSE Chemistry Unit 1 States of Matter · IGCSE Maths Unit 1 Number · DT Material Properties · Thrive Wellbeing · Y10 Chinese 0509 & English FLE · IGCSE Lesson Files Y10 1011 (all subjects)
— plus updated **Science Booklets (Y7–Y10)** and **IGCSE Study Resources** cards, and a prompt `.md` for each new card.

**Little details:**
- Homepage hub: science-booklet line now names the 2026–27 editions (19 files); IGCSE things line fixed (was "1011 files" = folder name, not a count)
- Revision hub: 📕 booklet links for Biology / Chemistry / Physics, 📝 unit-revision link for Maths, 🗂 all-booklets link
- `sitemap.xml` now includes homepage sub-pages (e.g. `/revision/unit-1-number/`)
- New `gen_proxy_index.py` + prep step 4/4: `tools/generate.py` blanks the science-booklet browse page (no local content in the portfolio repo), which left a dead listing after every deploy — now regenerated as a proxy listing in both repos on every prep
- files-proxy worker: a 404 from a *stale negative edge-cache entry* (a file pushed minutes earlier) is now retried with a cache-buster before returning not-found
- `sync-macintosh-hd.py`: rebase-then-push retry — the isaac-nas daemon pushes "Update NAS redirect" commits to the homepage repo constantly and plain pushes were being rejected

**Housekeeping / known issues**
- Files >25 MiB are dropped from the Pages bundle by the deploy script (currently `8C Mapping Matter` + a DT mp4) — fine, because every browse page links through the proxy; never hand-write a `/science booklet/...` link to a big file
- `~/Desktop/nas-redirect` is a second clone of the homepage repo owned by the NAS daemon — always `git fetch && git rebase origin/main` before pushing the homepage repo

---

## 2b. Shipped 2026-09-23

- **PWA** — `manifest.json` + service worker → installable on phone, **works offline** (network-first so never stale)
- **Icons + social card** — `icon-192/512`, `apple-touch-icon`, `og-image.png` (1200×630) for link previews
- **SEO** — `sitemap.xml` (64 URLs), `robots.txt`, canonical + Open Graph + Twitter tags
- **Popular-tag chips** — one click filters 422 cards by tag (e.g. F1 → 144)
- **Recently added** strip — newest projects & libraries at the top
- **Share button** per card — native share sheet on mobile, copy-link fallback
- **Back-to-top** button · **Print stylesheet** (clean one-sheet of all cards)
- **Quest Hub** — `/quests/` ties the ARG sites together with a fictional-content disclaimer
- Housekeeping: removed 8 malformed junk dirs, untracked the `.wrangler` cache

---

## 3. What this website can ALSO be used for

### A. Study & revision hub (highest everyday value)
1. **Revision hub per subject** — one page per IGCSE subject: syllabus, notes, past papers, booklets, key formulas. You already own the raw material (notes/, science booklet/, past papers, igcse books).
2. **Offline revision pack (PWA)** — the service worker already works; add a "Save for offline" button per subject so a whole subject works on the school bus / with flaky WiFi.
3. **Flashcards / quiz mode** — generate from your notes; store progress in `localStorage` (no backend needed).
4. **Past-paper tracker** — log which papers you've done, score, and time — a simple KV-backed table.
5. **Formula sheet generator** — pick subject → printable one-page formula sheet (you already build HTML→PDF).

### B. Workshop & maker tools
6. **Laser settings calculator** — material + thickness + power → starting speed/passes, from your `.clb` libraries. Tie into the existing laser reference.
7. **Engineering calculators** — gear ratios, beam deflection, pulley/belt lengths, unit conversion, resistor colour codes, tolerance stacks. (There's an `engineering-calculators` skill to reuse.)
8. **3D print log** — every print: model, material, temps, result, photo. Becomes a personal database + a public "what works" reference.
9. **Filament/profile comparison** — pick a material, see your proven settings.
10. **CNC/feed-speed calculator** — for the Boxford and the 5-axis model.

### C. Showcase & applications
11. **CV / résumé page** — auto-generated from your cards (projects, skills, achievements) → print-ready PDF for school/internship applications.
12. **Build write-ups (blog)** — short posts per project: what, how, what broke, what I'd change. Great for university applications.
13. **Photo/timelapse gallery** — per-project build photos.
14. **DT coursework showcase** — structured presentation of F1 in Schools / DT work (the Boxford CO₂ pack and jigs already support this).
15. **Awards & competitions page** — VEX, F1 in Schools, results.

### D. Services (money / favours)
16. **Commission intake** — you already have `/portfolio/upload` (3D model upload). Turn it into a proper quote request: file + material + quantity → email/Worker notification.
17. **Print-on-demand catalogue** — your STL libraries as an orderable list with prices.
18. **Classmate file drop** — IsaacDrop is already this; surface it better.

### E. Platform & community
19. **Quest platform** — the three ARGs could become a proper hub: landing page per quest, progress tracking, hint system, "no spoilers" mode.
20. **Public JSON API** — the proxy worker could expose `/api/files.json` so others can build on your libraries.
21. **Comments/guestbook** — Cloudflare KV + a Worker (no card needed).
22. **Analytics-lite** — a Worker counting page hits (no third-party tracking).

---

## 4. Suggested roadmap

**Phase 2 — everyday value ✅ SHIPPED**
- ~~Revision hub `/revision/`~~ ✅ 11 subject cards linking notes + resources + past papers + Pearson
- ~~Laser settings calculator~~ ✅ in `/tools/` (material/thickness/power → speed, power, passes)
- ~~Engineering calculators~~ ✅ `/tools/` — gear ratio, resistor code, beam deflection, print cost, CNC feeds

**Phase 3 — depth ✅ SHIPPED**
- ~~Print log~~ ✅ `/print-log/` — Worker + KV (`print-log.isaac1804.workers.dev`, KV `print-log-prints`), passcode 1804; logs material/temps/layer/speed/grams/hours/result, "use last settings", stats (success rate, filament, time)
- ~~CV page~~ ✅ `/cv/` — auto-generated from portfolio cards (`cv/cards.json` regenerated on every deploy by `extract-cards.js`), print-ready A4
- ~~Revision progress~~ ✅ `/revision/` — "mark revised" per subject with progress bar (localStorage)
- ~~Command palette~~ ✅ ⌘K/Ctrl+K on the portfolio — searches projects, libraries and pages

**Phase 4 — reach (do next)**
- **Per-subject revision pages** — expand `/revision/` into a real page per subject (syllabus checklist, formula sheet, topic progress)
- **Build write-ups** — a short post per project (photo + what broke + what you'd change)
- **Formula sheet generator** — printable per-subject formula cards
- **Print Log → calculator link** — feed real logged settings into `/tools/` laser/print calculators
- Offline revision packs per subject (PWA groundwork already in place)
- Commission intake upgrade on `/portfolio/upload` (quote request → email)
- Quest platform with progress/hints saved per user
- Public JSON API for your libraries (other students can query them)
- Laser settings sharing: export a `.clb` from the calculator

**Housekeeping / known issues**
- Local DNS on the Mac still has a stale entry — flush with `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
- IsaacDrop's public link depends on trycloudflare quick tunnels, which are rate-limited and churn constantly → move to a **named tunnel** with a permanent hostname
- The homepage `🔌 Local Servers` section links to `http://localhost:…` — only works on this Mac; consider hiding it behind a toggle
- `da.gd/betterterm` points at `raw.githubusercontent.com` — a GitHub URL in a public short link
- **Fixed Sep 2026:** junk `"quoted"` directories (720 paths) were being generated because `git ls-tree` without `-z` C-quotes paths containing emoji/non-ASCII. Now uses `-z`, plus a guard in `gen_library_indexes.py`.

