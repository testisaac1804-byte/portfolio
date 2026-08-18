# Isaac's Project Portfolio

An open-source, self-hosted portfolio of every project Isaac has built — software apps, hardware/electronics, Fusion 360 CAD designs, and design documents.

**Live:** https://testisaac1804-byte.github.io/portfolio/

## What it is

A single-page interactive portfolio (Linear-inspired dark theme) that catalogs 100+ projects across four categories:

| Category | Contents |
|----------|----------|
| 💻 Software & Apps | 24 apps — network tools, AI chat, browsers, daemons |
| 🔧 Hardware & Electronics | ESP32 builds, Arduino, sensors, 3D-printed tools |
| 📐 Fusion 360 CAD | 60+ original designs — F1 parts, jigs, storage |
| 📄 Design & Documents | 20+ posters, portfolios, presentations |

Every card includes an interactive preview where possible: **live Three.js 3D STL viewer**, **in-browser DXF renderer**, **PDF/image viewer**, or an **iframe live demo**. Each project also links to its build prompt and full source folder.

## How it works

- **`index.html`** — the app shell (theme, header, filters, modals)
- **`app.js`** — all project data + rendering + 3D/DXF viewers (no build step, no framework)
- **`tools/generate.py`** — regenerates `files.json` (a full file-tree manifest) and per-folder `index.html` directory listings, so every project folder is browsable on the web
- **`demos/`** — static single-file live demos embedded via iframe
- **`prompts/`** — the compressed build spec for each project
- **`projects/`, `Documents/`, `Downloads/`, `Desktop/`** — the actual source files (STL, DXF, PDF, code) served directly

## Running locally

```bash
cd ~/Desktop/portfolio-deploy
python3 -m http.server 8888
# open http://127.0.0.1:8888
```

## Deploying

```bash
cd ~/Desktop/portfolio-deploy
python3 tools/generate.py      # refresh files.json + folder listings
git add -A && git commit -m "update"
git push origin main            # GitHub Pages auto-builds
```

## Contributing

This is fully open source (MIT). Anyone can:
- **Fork** the repo and add their own projects
- **Browse** every project's source files directly on the site (no login, no paywall)
- **Reuse** any STL/DXF/code under the MIT license

To add a project: append an entry to the `D` object in `app.js`, drop the files in the matching folder, run `tools/generate.py`, and push.

## License

MIT — see [LICENSE](LICENSE).
