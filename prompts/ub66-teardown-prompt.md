# Build spec — Universe Browser (ub66.com) teardown + inert archive

## Goal

A single-page security write-up on `ub66.com` / 寰宇瀏覽器 / "Universe Browser", published on the
portfolio, plus a byte-faithful but **disarmed** archive of the live landing page rendered in a
phone frame on the same page.

## Deliverables

```
demos/ub66-teardown.html      write-up page; exhibit at #mirror inside a 390px phone frame
demos/ub66-mirror/            archived landing page + assets + guard.js
prompts/ub66-teardown-prompt.md
```

## Structure of the write-up

1. Verdict banner (red) — do not install.
2. What the site claims (its own three promises, EN + 中文).
3. What independent researchers found — Infoblox + UNODC, Oct 2025; WIRED / Android Authority /
   Gadgets 360 coverage; the Vault Viper / BBIN attribution.
4. **What I verified myself** — the original work:
   - hosting: Google Cloud Storage bucket behind CloudFront, AWS Route 53, GoDaddy registration 2014;
   - download chain: `download.html` → `files/files.json` → `cdn.n4dhx7bt.com`;
   - the CAPTCHA is client-side only (`getRandomNumber()` compared in the same page) and the
     download is delayed by a random 500–1500 ms — sandbox evasion;
   - payload host mints a fresh `Last-Modified` on every request (anti-forensics), with the three
     measured timestamps shown;
   - Windows launcher: PE32, UPX-packed, no code signature, SHA-256;
   - Android APK: package `bbin.mobile.browser`, self-signed cert `O=bbin, CN=kingsley`, `debuggable=true`,
     SHA-256, 6,078 files, Chromium 120 base;
   - permissions table with the dangerous ones called out (contacts, accounts, credentials,
     location, silent downloads, install-packages, boot autostart);
   - the "acceleration" is `libgojni.so` — a Go SSH tunnel ("dududu") with RC4 "teapot" framing,
     DNS-TXT failover, and a local database of visited domains;
   - hardcoded Alibaba Cloud endpoints (Shenzhen ×2, HK) + AliDNS 223.5.5.5, geolocated;
   - live `dig ub66.com TXT` tokens — the failover channel;
   - iOS: 寰宇浏览器安全版, seller CYBERLAND GAME STUDIO, bundle `com.bbin.Titanic`, 2.99/5 (620),
     updated 2026-10-14; older app id1109296472 delisted; not on Google Play.
5. An honest correction: **no `VpnService`** — it proxies only its own browser traffic, not the
   whole device. Say so; the press headlines over-read this.
6. Threat model (who is harmed).
7. The archive (§mirror) + what was changed.
8. Remediation if already installed; alternatives.
9. Method, hashes table, and an explicit *limits* box separating my findings from Infoblox's.

## Archive rules (important)

- Capture with `wget -p -k -E -H --no-parent`; flatten `www.ub66.com/` to the folder root.
- Delete the captured `www.googletagmanager.com/` asset folder and strip both GA tags
  (`UA-105143657-1`, `G-CE11RD4VBG`) from `index.html` and `download.html` — no beacons to the
  operator's analytics from this site.
- Add `guard.js` as the **first** script in `<head>` on both pages:
  - block all cross-origin requests, XHR, `fetch`, WebSocket, `sendBeacon`;
  - block same-origin `/files/` and `/download/`;
  - intercept clicks on anything download-ish and show a toast instead;
  - stub `location.assign/replace` for blocked URLs;
  - install a permanent "ARCHIVED COPY" bar.
- **Never host the APK or the EXE.** Publish hashes only.
- Keep the archive visually byte-faithful: same CSS, same images, same i18n JS, same fake captcha.

## Verification (must pass before deploy)

Headless Chromium against a local static server:

- archive: title loads, 2/2 images, `#__archive_bar` present, **0 external requests**;
- download button click → toast appears, URL unchanged, no navigation;
- `download.html` renders the canvas CAPTCHA and makes 0 external requests;
- write-up: 0 horizontal overflow at 390 / 430 / 900 / 1280 px;
- iframe resolves `./ub66-mirror/index.html` and its inner click/toast behaves.

## Pitfalls hit

- `loading="lazy"` on the exhibit iframe means the archive never loads until scrolled to — drop it.
- Long inline heredocs / `srv.shutdown()`-style one-liners get blocked by the command guard; write
  the Playwright check to `/tmp/*.py` and run the file.
- `strings -e l` is GNU-only; macOS `strings` rejects `-e`. Use a small Python AXML parser for the
  binary `AndroidManifest.xml` instead.
