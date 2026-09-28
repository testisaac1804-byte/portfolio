# IsaacNet Browser

**Category:** Software & Apps · **Status:** Done

Browser frontend for the IsaacNet proxy.

**Stack / Tools:** Networking, Browser, Proxy

**Location:** `~/isaacnet-browser`

## Where it lives
- Published copy on the site (working folder isn't on this Mac): `~/Desktop/portfolio-deploy/demos/isaacnet-browser.html`
- Published copy on the site (working folder isn't on this Mac): `~/Desktop/portfolio-deploy/projects/isaacnet-browser`
- Artefacts on the site: 5 files · 894 lines of text · 38 KB

## Stack
- HTML ×2 · Python ×2 · Shell ×1
- external tools invoked: `networksetup`, `node`, `python3`

## What's in the code
- `../projects/isaacnet-browser/isaacnet_browser.py` — 538 lines (Python)
- `../projects/isaacnet-browser/probe.py` — 184 lines (Python)
- `isaacnet-browser.html` — 136 lines (HTML)
- `../projects/isaacnet-browser/IsaacNet.command` — 35 lines (Shell)
- `../projects/isaacnet-browser/index.html` — 1 lines (HTML)

## Verified in the Python source
- classes: `AppDelegate`, `ConnectProxy`
- functions: `_detect_service`, `_doh_json`, `_doh_wire`, `_opener`, `_parse_wire`, `_wire_query`, `doh_resolve`, `main`, `normalize_url`, `proxy_off`, `proxy_on`, `tls_handshake`

## Verified in the page source
- page title: “IsaacNet Browser”
- headings: ' + (host.indexOf("wikipedia") !== -1 ? "TCP/IP — the protocol stack behind every request" : "Securely proxied: " + host) + '
- UI element ids: `chain`, `lock`, `page`

## Notes found in the scripts
- =============================================================================
- IsaacNet — double-click launcher
- Runs the DoH + CONNECT browser and GUARANTEES the system proxy is restored

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
