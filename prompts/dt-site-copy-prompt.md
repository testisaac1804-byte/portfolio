# DT Site Copy (Isaac Edition)

**Category:** Software & Apps · **Status:** Done

Full copy of Mr McGill's Design & Technology Google Site (sites.google.com/view/dtmcgill) — all 74 pages, rebranded to Isaac, hosted publicly.

**Stack / Tools:** Google Sites scraping (Jina reader proxy + raw HTML), Playwright/Chromium SVG capture, Python + bs4 + markdown, GitHub Pages, da.gd short link

**Build path:**
- V1 — Single Finishing page copy (banner + rendered slides poster image)
- V2 — Full site: 49 nav pages fetched via Jina markdown, rebuilt as static HTML with sidebar nav
- V3 — Crawled hidden IGCSE coursework section (25 more pages, linked only from Coursework Guide) → 74 pages total

**Location:** https://isaac1804.com/isaac-dt/ · short: https://da.gd/53Kfta · local: `~/Desktop/DT-Site-Copy/`

**Build notes (real knowledge):**
- Google Sites + Google Slides block automated browsers (empty shell, black stage). Working path: Jina reader proxy (r.jina.ai) for rendered markdown; raw curl HTML for embed iframes (docs.google.com presentation/document, youtube) which ARE present in unrendered HTML.
- lh3 image URLs are SHORT-LIVED signed URLs — must download IMMEDIATELY after a fresh Jina render (fresh render → curl download in same script run). Stale URLs 403 (net::ERR_BLOCKED_BY_ORB in browsers). 204/204 images captured this way.
- Past papers live in 3 public Drive folders (nested year subfolders). Mirror via embeddedfolderview?id=<ID>#list rendered in Playwright → scrape file/subfolder links → download via drive.google.com/uc?export=download (public files OK; large files need confirm token; view-only files like the Strip Heater video stay linked to Drive).
- Slides decks kept as live iframe embeds; drive /preview embeds kept as-is (work in real browsers) unless the file was downloadable → local.
- Rebrand: McGill→Isaac (case-insensitive), steve→Isaac, email steve.mcgill@online.island.edu.hk→isaac_cs.chan@online.island.edu.hk. MUST rewrite internal site links BEFORE rebranding, or URLs become dtIsaac.
- Content extraction: strip Jina markdown nav (3 repeated nav blocks) by cutting after the LAST sites.google.com/view/dtmcgill link line; cut footer at "Page updated"/"Google Sites".
- Jina free tier ~20 req/min — 3.2s delay between page fetches.
- Nav pages list ≠ full site: content links reveal orphan pages (25 IGCSE coursework pages). Crawl raw HTML of every page for /view/dtmcgill/ slugs, BFS until closure.
