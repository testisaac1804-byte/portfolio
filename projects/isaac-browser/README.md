# Isaac Browser — source

A privacy-first macOS browser written from scratch in Python with PyObjC and
`WKWebView`.

## Files

| File | Purpose |
|---|---|
| `native_app.py` | The whole application — `NSWindow` + `WKWebView`, ephemeral data store, tracker filter, anti-fingerprinting, stealth mode, auto-burn, the per-app CONNECT proxy and the local API that backs the start page. |
| `newtab.html` | The start page: URL bar, search, and the privacy shield controls. Served to the web view by the in-process API on `127.0.0.1:8556`. |

## Running it

```bash
python3 native_app.py          # needs pyobjc + pyobjc-framework-WebKit
```

Packaged as a double-clickable `.app` with a universal Mach-O launcher, so it
opens from Launchpad like any other application — no terminal involved.

## Design rule

The bundled CONNECT proxy and DoH resolver route **only this app's own
traffic**. The macOS system proxy is never read or written, so Chrome, Safari
and system-wide networking are unaffected whether the in-app proxy is on or off.

Build notes, the bugs that took the longest, and the verification steps are in
`prompts/isaac-browser-prompt.md`.
