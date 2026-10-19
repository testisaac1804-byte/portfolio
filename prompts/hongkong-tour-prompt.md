# Hong Kong Tour

**Category:** Software & Apps · **Status:** Done

A Hong Kong tour guide with 143 real spots across 3 regions and 27 neighbourhoods
(Hong Kong Island, Kowloon, the New Territories). Every spot carries an actual
photograph of the place, a rating, a description, practical tips and a location,
with search and category filters on top. The same Python + HTML core ships as
four installable apps — macOS, Windows, Linux and Android — plus a portable ZIP,
an iPad Xcode project, and it also runs in the
browser as a static build with no server behind it.

**Stack / Tools:** Python, pywebview, Flask/HTTP, HTML/CSS/JS, Gradle + Android SDK, SwiftUI + WKWebView, dpkg, 7-Zip SFX, sips

**Build path:**
- V1 — Launcher, HTML UI, spots grouped by region and area, photo gallery.
- V2 — 143 spots across 3 regions / 27 areas with real photos, search, category filters, ratings.
- V3 — Shipped for desktop and Android: macOS .app, Windows .exe, Linux .deb, Android APK, portable ZIP, plus a static browser build. The iPad build is an Xcode project, not an installable .ipa.

**Location:** `/Applications/HongKongTour/`

## Where it lives
- Working folder: `/Applications/HongKongTour/`
- Browser build on the site: `demos/hongkong-tour/` (index.html + data.json + 166 optimised photos, 29 MB)
- Installers (built locally, published as GitHub release assets and streamed same-origin from `/files/hongkong-tour/` — 292–309 MB each): `dist/HongKongTour-macOS.dmg`, `-Windows.exe`, `-linux.deb`, `-Android.apk`, `-Portable.zip`
- macOS first launch: the .app is ad-hoc signed (`flags=0x2(adhoc)`, no Apple Developer ID), so Gatekeeper blocks a plain double-click — right-click → Open, or System Settings → Privacy & Security → Open Anyway. `spctl -a` reporting `rejected` is expected here, not a broken build.
- iPad/iPhone: `build/ios/HongKongTour.xcodeproj` (needs Xcode + a signing identity to produce an .ipa)

## The browser build
The desktop app normally talks to a small local HTTP server (`/api/region`,
`/api/search`, `/static/images/...`). For the site that server is removed
entirely: `build/build_web.py` freezes the `/api/region` response to `data.json`,
rewrites every image path to a relative one, and injects a local search index.
The 143 spot photos are resized to 1200 px at JPEG q75 (13 MB → 307 KB on the
largest one) for a 29 MB total, and they lazy-load, so a visitor only downloads
what they actually scroll past.

## Packaging traps (all three were real, all three produced broken files)
1. **The .deb came out 96 bytes.** macOS `ar` runs ranlib and writes a BSD
   symbol-table archive (`__.SYMDEF SORTED`), silently discarding the members.
   Fixed by writing the `!<arch>` format directly in `build/make_deb.py`.
2. **dpkg rejected the archive.** Debian stores control members as `./control`,
   not `DEBIAN/control`, and data files need an `md5sums` for verification.
3. **The .exe was a Mac binary.** p7zip's `7zCon.sfx` is Mach-O, so concatenating
   a payload onto it cannot produce a Windows executable. The SFX stub has to be
   a real PE binary — `build/sfx/7zS.sfx`, taken from `7z920_extra.7z`, since
   7-Zip's modern Extra package no longer ships SFX modules.
4. **The macOS .app would not open.** Finder hands a double-clicked app a minimal
   PATH, so a bare `python3` resolved to `/usr/bin/python3`, which has no
   pywebview. The launcher now probes each candidate interpreter with
   `"$PY" -c "import webview"` before using it.

## Verification
`build/verify_all_packs.py` checks all six packs without needing Windows, Linux,
Android or iOS hardware: it mounts the DMG and greps the launcher, parses the
.deb's `ar` members, confirms the .exe is a PE32 with a readable embedded 7-Zip
payload, reads the APK with `aapt dump badging`, and lints the Xcode project with
`plutil`. **56/56 checks pass.** The browser build is verified with Playwright
(headless Chromium): 143 spots render, real photos load, search returns results
and jumps to the right spot, filters match the data, and there are no JS errors
or 404s — 15/15.

## Gotchas worth remembering
- `bash` on this Mac resolves to Homebrew's **x86_64** binary, so build scripts
  must run with `/bin/bash` or anything touching `xcrun` fails on architecture.
- The system Python's venv PIL is broken (`_imaging` import clash), so the build
  reuses an existing icon rather than generating one, and runs with
  `env -u PYTHONPATH`.
- Loopback HTTP tests must bypass the system proxy or they get a 405.

## Where the installers are hosted

All five packs download from this project's card. They are far too big for
Cloudflare Pages — the 25 MiB per-file cap makes the deploy script *silently
delete* any offender — so they are published as GitHub release assets
(`testisaac1804-byte/portfolio-files`, tag `hongkong-tour-v1.0`) and streamed
through the site's own `files-proxy` Worker at
`https://isaac1804.com/files/hongkong-tour/<name>`. GitHub release assets also
beat committing them: the repo tree rejects anything over 100 MB.

The Worker fetches the release asset and pipes the body straight through instead
of buffering it, forwarding the `Range` header upstream and re-declaring
`Accept-Ranges: bytes`. That matters on a flaky link: a download that dies
half-way **resumes** rather than restarting from zero.

| Pack | Size |
| --- | --- |
| `HongKongTour-macOS.dmg` | 309,378,949 B (295 MB) |
| `HongKongTour-Windows.exe` | 306,419,009 B (292 MB) |
| `HongKongTour-linux.deb` | 306,294,892 B (292 MB) |
| `HongKongTour-Portable.zip` | 306,139,800 B (292 MB) |
| `HongKongTour-Android.apk` | 2,425,148 B (2.3 MB) |

Verified after going live: every URL returns `200` with a `Content-Length`
matching the local file, `Accept-Ranges: bytes`, a mid-file range request returns
`206` with the right `Content-Range` and bytes matching the local file at that
offset, and a download cut short at 1 MB and resumed with `curl -C -` finishes
byte-identical (SHA-256 match). The uploads themselves were resumable too — the
uploader skips any asset already present at the right size, so re-running never
re-uploads a finished file.
