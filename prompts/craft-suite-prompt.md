# The Craft Suite — 13 apps, 6,986 CLI commands, and the "AI cracked Adobe" claim

**Category:** Investigations · **Status:** Done

An audit of the ArtCraft "Crafting Apps": thirteen clean-room Rust replacements for Photoshop, Acrobat, Premiere, Lightroom, Illustrator, After Effects, AutoCAD, Excel, InDesign, PowerPoint, Word, Pro Tools and Figma. All thirteen GUIs were installed, then each app's separately-released headless CLI was installed and driven against this machine's own files — a DT poster, a Chinese product guide, a school deck and a Fusion 360-style DXF. Result: 6,986 CLI commands across the set, 1.76 GB on disk, a valid PSD written and read back, an A1 poster rasterised in 12 ms, a CJK docx converted in 0.21 s, a pptx slide rendered in 0.34 s, and a faux redaction recovered from underneath a black rectangle. The viral claim that "someone cracked Adobe" was checked against the installed 181 MB PhotoCraft binary: no Adobe libraries, no `.8bf` plug-ins, no ICC files, no Adobe copyright strings — the 83 "adobe" matches are PSD/XMP namespace names the format requires. The AI part of the rumour is true and is the interesting part: the repos ship an 18.7 KB `AGENTS.md` and `.claude` rules and commit at roughly 100 commits per day. A download pack (installer + verifier + manifest, 9,005 B, sha256-pinned) was built and published so the CLI layer — which the official launcher does not install — can be reproduced in one command.

**Stack / Tools:** Rust (the apps), bash 3.2 installer/verifier, GitHub Releases API, Python 3.9+ (JSON counting), Playwright/urllib (live verification), Cloudflare Pages + a Worker file proxy

**Build path:**
- V1 — Read `getartcraft.com/apps` and all 13 repos, pulled stars/languages/push dates from the GitHub API, confirmed all 14 bundles already in `/Applications`. Found no `<app>-cli` on `PATH`.
- V1.1 — Wrote the CLI installer. First version died at line 12 with `photocraft: unbound variable` (bash 3.2 under `set -u`); rewrote it with a `ver_of()` case block, `curl -C -`, quarantine stripping and symlinks. Installed all 13 (~1.76 GB) in the background.
- V1.2 — Verified every CLI by hand: PDF render/info/text/audit, xlsx formula round-trip via `check`, DXF→SVG→PDF, docx→PDF, pptx→PNG, PSD creation, laser SVG with `--outline-text`.
- V1.3 — Corrected the command counts. First pass counted output *lines*, which inflated the total to 32,264 because several apps pretty-print JSON and indent parameter docs under each command. Re-derived as registry entries (JSON arrays / column-0 lines): **6,986**, consistent between Python and the shipped bash verifier.
- V1.4 — Published the pack (`installers/Craft-Suite-CLI-Pack-v1.0.zip`) through the files proxy; verified the served bytes hash to the local build.
- V2 (open) — Prove FilmCraft, EffectCraft, DesignCraft, SoundCraft and FigCraft on real projects; those five are reported as "CLI responds" only.

**Known traps:**
- `getartcraft.com/app` is a 404; the web studio is `app.getartcraft.com`.
- The `/apps` download button serves a Linux `.flatpak` even on a Mac — use the launcher release page.
- `pdfcraft-cli batch --steps ocr` needs `PDFCRAFT_MODELS=/Applications/PdfCraft.app/Contents/Resources/models`, and rejects `--language zh`.
- Running `/Applications/PdfCraft.app/Contents/MacOS/PdfCraft --help` launches the GUI and hangs the shell; use the CLI binary.
- Argument styles are not uniform: `pdfcraft-cli render … --out x.png` (flag) vs `deckcraft-cli render in.pptx --slide 0 out.png` (positional); `gridcraft-cli run` takes `--out` for a new file and `--in` only for an existing one; `cell.set` wants `{cell, input}`, not `{range, value}`.
- `deckcraft-cli info <pptx>` exits 1; `render` works.
- `photocraft-cli` has no `image.resizeImage`; query `<app>-cli commands` first.
- macOS ships no `timeout`, so the verifier wraps each call in a perl `alarm`.

**Source folder:** `/tmp/craft-pack` (pack build), `~/.hermes/scripts/craft-cli-install.sh` (installer)
**The user's own build spec for this project is at the end of this file.**

## Where it lives
- Analysis page: https://isaac1804.com/portfolio/demos/craft-suite-analysis.html
- Download pack: https://isaac1804.com/files/installers/Craft-Suite-CLI-Pack-v1.0.zip (9,005 B · sha256 `60dd37f9…2b20`)
- Official apps page: https://getartcraft.com/apps
- Official launcher: https://github.com/storytold/craft-launcher/releases

## The user's own words

> "can you put it onto my portfolio and saying this apps analysis and the download pack and link to the official link"
