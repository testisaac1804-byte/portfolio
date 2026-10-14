# Isaac Browser — build notes

**A real macOS web browser, written from scratch in Python.**
PyObjC + `WKWebView`. Not a shell around Chrome and not a mockup — it creates its
own `NSWindow`, its own `WKWebView`, and gets its own WebKit renderer process
(`WebContent` / `GPU` / `Networking` XPC children), exactly like Safari does.

The goal was a browser that is private *by construction* rather than by settings:
nothing to forget to enable, nothing left behind to clean up.

---

## Privacy architecture

- **Ephemeral data store.** The `WKWebView` is created with a non-persistent
  `WKWebsiteDataStore`, so history, cookies, localStorage and the HTTP cache exist
  only in RAM. Nothing is ever written to `~/Library/WebKit` or the disk.
- **Auto-burn on exit.** On quit, all website data types are removed through the
  data store API — a clean teardown rather than just letting the process die.
- **Tracker filtering.** In-page requests to a known tracker/ad domain list are
  refused before they go out.
- **Anti-fingerprinting.** User-Agent, screen dimensions and timezone are spoofed
  so the browser does not present a unique, trackable signature.
- **Leak surfaces closed.** WebRTC and geolocation are blocked, referrers are
  stripped, and navigation is HTTPS-only.
- **Stealth mode + New Identity.** One click discards the current session's
  in-memory state and regenerates the fingerprint.

---

## The proxy: per-app, never system-wide

The app ships an ephemeral **CONNECT proxy** on `127.0.0.1:8557` plus a DoH
resolver, and it is a deliberate design rule that **it routes only the browser's
own traffic and never touches the macOS system proxy**.

An earlier version did the convenient thing and called:

```
networksetup -setwebproxy <service> 127.0.0.1 8557
networksetup -setsecurewebproxy <service> 127.0.0.1 8557
```

Those calls are system-wide. Every other app — Chrome included — got silently
repointed at the browser's local proxy, and on quit the teardown ran
`-setwebproxystate off`, which **disabled the machine's proxy entirely**,
including a VPN's. From the user's side: Chrome appeared broken for no visible
reason, and it was this browser doing it.

All system-proxy mutation is now deleted; the outbound path uses a per-app
opener that never inherits the OS proxy configuration. The proxy toggle affects
this app and nothing else.

---

## Packaging: four things that stop a Python app opening on macOS 26

1. **macOS 26 rejects a shell script as `CFBundleExecutable`.** A bash launcher
   makes the bundle look valid and then silently does nothing on double-click.
   The fix is a compiled **Mach-O universal launcher** (arm64 + x86_64) that
   satisfies the loader and then `exec`s the Python framework binary.
2. **A fatal port bind killed the app on every launch.** The proxy called
   `bind()` with no guard, so a stale process holding 8557 raised
   `OSError: [Errno 48]` and took the whole app down before a window appeared.
   Both the proxy and the local API server are now non-fatal on a busy port, and
   an already-running check runs first to stop duplicate instances.
3. **Editing an app after signing invalidates it.** Changing `Info.plist` or the
   icon leaves a stale `_CodeSignature` and Gatekeeper reports *"plist or
   signature have been modified"*. Re-sign ad-hoc after every change.
4. **Builds need no admin.** Everything is assembled into `~/Applications`, which
   Launchpad and Spotlight both index — no `sudo`, no password prompt.

## Search without an API key

HTML-scraping DuckDuckGo and Google returns 429s and JS challenges. The browser
instead queries the **DuckDuckGo Instant Answer API** and the **MediaWiki
search API**, with a Bing HTML pass as a last resort — keyless, reliable, and
not bot-blocked.

## Verification

- Window opens on double-click; `WebContent`/`GPU`/`Networking` XPC children
  confirm a page genuinely rendered.
- Search returns real results (10–12 per query).
- `networksetup -getwebproxy` stays `Enabled: No` with the app running and when
  the in-app proxy is toggled on.
- The app, its launcher and the bundle all pass `codesign --verify`.
