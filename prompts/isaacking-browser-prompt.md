# IsaacKing Browser

**Category:** Software & Apps · **Status:** Done

Whitelist-only macOS browser. No search, no in-app settings — the allowlist is a file you edit.

**Stack / Tools:** Python 3.14, PyObjC (WKWebView + WKNavigationDelegate), py2app self-contained .app

**Build path:**
- V1 — White screen when quitting and reopening.
- V2 — Fixed: the start page loads as an HTML string (no redirect chain, no white flash).
- V3 — Self-contained 76 MB .app with its own Python; whitelist re-read live; `isaacking` CLI; no-search guard.

**Location:** `~/IsaacKing/` — installed at `/Applications/IsaacKing.app`

## What it is

A real macOS browser built on PyObjC + WKWebView rather than wrapping a web view around a
page. It is deliberately crippled in two ways: there is **no search**, and **nothing loads
unless it is on the whitelist**.

## The two rules

**No search.** Anything typed into the URL bar that contains a space is refused — the browser
answers "no search" instead of guessing a search engine. You type an address or you type
nothing.

**Whitelist only.** Every navigation is intercepted in
`webView:decidePolicyForNavigationAction:` and checked against
`~/IsaacKing/whitelist.json` before it is allowed. Anything else renders a blocked page.
`localhost` and `about:blank` are always allowed so the app's own start page works.

## The whitelist is a file, not a setting

`~/IsaacKing/whitelist.json` is the sole authority. It accepts plain strings, so the smallest
valid file is:

```json
["roblox.com"]
```

It is re-read from disk on **every** URL check, so editing the file takes effect immediately —
no restart. There is intentionally no settings page and no write API; the browser exposes only
a read-only `GET /api/whitelist`.

The `isaacking` CLI does the same job from the terminal:

```
isaacking list
isaacking add example.com
isaacking remove example.com
isaacking launch
```

## Why it does not break the rest of the Mac

IsaacKing never touches system networking. It writes no proxy settings and calls no
`networksetup`, so a crash cannot leave the machine pointing at a dead port. The earlier
white-screen-on-reopen bug came from the run loop swallowing signal handlers, which left a
stale process and a stale window behind; the current build replaces that loop and quits
cleanly.

## Verified

Launches from Finder/Spotlight as `IsaacKing` (its own identity, not "Python"); a second
launch focuses the existing window instead of duplicating it; Cmd+Q exits in about a second,
releases the port and leaves zero orphan windows; relaunching renders fresh with a new process
id. The installed bundle carries its own interpreter and was confirmed to still run with the
original source file hidden.

---

_Spec written from the shipped build on 2026-10-11. Nothing here is inferred — the whitelist
behaviour, the no-search rule and the verification results were all observed directly._
