# Hong Kong Tour

**Category:** Software & Apps · **Status:** Done

Interactive Hong Kong tour guide app — Flask + HTML, native macOS .app bundle with photo gallery and tour routes.

**Stack / Tools:** Flask, HTML, Tour, macOS .app

**Build path:**
- V1 — Photo gallery, tour routes, ratings.

**Location:** `/Applications/HongKongTour.app/`

## Where it lives
- Published copy on the site (working folder isn't on this Mac): `~/Desktop/portfolio-deploy/demos/hongkong-tour.html`
- Artefacts on the site: 1 files · 640 lines of text · 29 KB

## Stack
- HTML ×1

## What's in the code
- `hongkong-tour.html` — 640 lines (HTML)

## Verified in the page source
- page title: “Hong Kong Tour”
- headings: 🇭🇰 香港旅遊 · Hong Kong Tour · 🇭🇰 香港 · ${area.name}
- fetches / endpoints: `/api/search?q=${encodeURIComponent(val)}`
- functions: `init`, `loadData`, `renderSidebar`, `renderWelcomeStats`, `selectRegion`, `renderFilters`, `setFilter`, `renderRegion`, `renderSpotCard`, `ratingNum`, `toggleExpand`, `doSearch`, `showSearchResults`, `goToSpot`
- UI element ids: `contentArea`, `filterBar`, `mainHeader`, `pageSubtitle`, `pageTitle`, `regionContent`, `regionNav`, `searchContent`, `searchInput`, `statAreas`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
