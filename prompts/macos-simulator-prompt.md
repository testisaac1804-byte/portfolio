# macOS Simulator

**Category:** Software & Apps · **Status:** Done

Full interactive macOS desktop simulator with menubar, dock, windows, and dark/light theme.

**Stack / Tools:** HTML, CSS, JS, Simulator

**Build path:**
- V1 — Menubar, dock, windows, themes.

**Location:** `~/Desktop/mac-simulator.html`

Interactive macOS desktop simulation with working menubar (Apple menu, app menus), dock with app icons, draggable windows, and light/dark theme switching. Built as a single-file HTML app.

## Finder app (redesigned)

Real-macOS Finder inside the simulator — single-file JS, no dependencies, localStorage-backed.

**Layout:** window titlebar shows the current folder name · toolbar = back/forward · new folder · move to trash · icon/list/column view buttons · search field · content = sidebar (Favorites / iCloud / Locations) + view pane · bottom = path bar (breadcrumbs) + status bar ("N items", "Available: 214.28 GB of 494.38 GB").

**Views:**
- **Icon** — 94px grid tiles, single-click select, ⌘-click multi-select, double-click opens.
- **List** — Name / Date Modified / Size / Kind columns, click headers to sort (folders sort first).
- **Column** — drill-down columns via `M.finderColumnChain()`; clicking a folder appends a column, clicking a file shows its preview pane (icon, kind, size, modified).

**Behaviour:** history stack for back/forward (`finderHistory` + `finderIdx`); breadcrumb nav (Macintosh HD ▸ Users ▸ isaac ▸ …); live search filters the current folder and reports "N of M shown"; New Folder creates `untitled folder` naming; Move to Trash really moves items into the Trash app window (which lists them with their source folder); Applications folder double-click launches the matching simulator app.

**Filesystem:** `M.finderDefaults()` seeds 24 nested locations (desktop, documents/work/archive, school/igcse, pictures/vacation/family, music/album, icloud/shared, macintosh/applications/system/users/home). `M.finderSeed()` adds any missing location to older saved state so existing localStorage users keep their files.

**Pitfalls:** state keys absent from `M.state` are dropped by the loader — guard every new key in `M.finderSeed()`. Keep synthetic Date Modified / Size deterministic (hash of the file name) or the list flickers on every render. The search input must survive re-render: re-render content only while typing, never the toolbar.
