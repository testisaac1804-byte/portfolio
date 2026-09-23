# isaac1804.com — Site Plan & Expansion Ideas

_Last updated: 2026-09-23 · Live: https://isaac1804.com · Deploy: `bash ~/scripts/deploy-isaac-site.sh`_

## 1. What the site is today

| Path | What it is |
|---|---|
| `/` | Homepage — link hub: Portfolio, Web Apps, Quest, Macintosh HD, Browse Files, Local Servers, Links |
| `/portfolio/` | 422 cards across 4 categories + ~25 browse libraries (3D print, VEX, laser, sheet music, manuals) |
| `/quests/` | **NEW** — hub for the three Chinese ARG sites (孩子回家 / 溪埕國小 / 邺山彼处) + guides |
| `/isaac-dt/` | Design & Technology site |
| `/nas/` | IsaacNAS portal |
| `/childquest-*`, `/hces-quest-*`, `/yeshan-*` | The three quest sites + their walkthrough guides |
| `/science booklet/` | IGCSE science booklets (proxy-served) |

**Architecture:** one Cloudflare Pages deployment; bulk files live in the `portfolio-files` store and are served
through `files-proxy.isaac1804.workers.dev` (correct content-types, inline previews, `?download=1`).
DNS on Cloudflare (`carla`/`yichun.ns.cloudflare.com`), nameservers set at Spaceship via API.

---

## 2. Shipped in this round

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

