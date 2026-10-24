# Build spec — Library Kiosk (locked-down public-library terminal)

> This is the **web fallback** for a "modified Windows 11 ISO" request. A real Windows image was not built;
> this single-file HTML kiosk delivers the requested behaviour — ticket/HKID unlock, guest browsers, floating
> control bar, wipe-on-logout — in something a library can deploy in seconds.

**Goal.** One self-contained HTML file that behaves like a Hong Kong public-library kiosk terminal: a lock
screen that accepts a one-time ticket number or an HKID, a Windows-11-style desktop with working apps, guest-mode
browsers that refuse settings/chrome internals, a floating control bar (pause / zoom / logout), and a hard wipe
of every patron's data on logout.

## Hard requirements

- Single file, no build step, no external dependencies. Must open from `file://` and a USB stick.
- **Two equal auth paths**: ticket (matched + consumed, so a photocopied ticket dies) and HKID
  (case/whitespace-insensitive, greets the patron by name).
- **Guest-mode browsers** block `chrome://`, `edge://`, `about:config`, `about:support` before navigation and
  re-check the iframe's `location.href` after load so an in-page link can't sneak a restricted URL past the bar.
- **Logout wipes everything**: DOM nodes removed (not hidden), iframes/editors/canvas destroyed, zoom and timer
  reset, back to the lock screen. Nothing survives a session.
- **Floating control bar**: Pause Screen, Zoom 100/150/200%, Zoom Out, on-screen keyboard, high-contrast, help,
  red Log Out.
- **Hidden admin panel** (⚙️ Admin link + 5-click corner trigger, password-gated): Tickets, HKID, Catalog,
  Announcements, Usage Logs, Settings — persisted to `localStorage`.
- **Every event handler inline** (`onclick`/`onkeydown`), no `addEventListener` on elements, no `postMessage`.
  These three choices were forced by real breakage in earlier passes.

## State shape

```js
D = { tickets:[], hkids:[], catalog:[], announcements:[], logs:[] }   // data, persisted
S = { user, zoom, paused, remaining, printUsed, … }                   // session, wiped on logout
W = { z: 40, open:{} }                                                // window manager
K = { shiftOn, capsOn }                                               // on-screen keyboard state
A = { … }                                                            // admin panel
```

One object per concern; `logout()` tears down `W.open`, resets `S` and `K`, clears the DOM, returns to the lock
screen. Counts are rendered from their arrays, not hard-coded.

## Verification

```bash
node --check /Users/isaac/Desktop/library-kiosk.html   # 0 syntax errors
shasum -a 256 ~/Desktop/library-kiosk.html demos/library-kiosk-mirror/index.html  # must match
```

Then exercised in-browser: ticket unlock (and that the ticket is consumed on retry), HKID unlock by name,
blocked-URL refusal, DuckDuckGo search, print dialog, catalog search, zoom reflow, on-screen keyboard, admin
login + all six tabs, and logout leaving no window/iframe/editor content behind.

## Bugs this build actually hit (and fixed at the cause)

1. `let oskCaps` + `function oskCaps()` in the same scope → `SyntaxError` killed every handler. Renamed to
   `K.capsOn` / `K.caps()` (and the same for `oskShift`).
2. `addEventListener` on elements → moved to inline `onclick`/`onkeydown`.
3. `srcdoc` HTML-escaped (`&lt;`/`&gt;`) → browser start page rendered as literal text. Only escape `"`, leave tags raw.
4. `postMessage` bridge never fired → start page navigates the iframe directly.
5. Live function reference inserted into `innerHTML` → call the body builder at render time.

## Honest limits (stated in the artifact and on the analysis page)

- Browsers cannot load Google/Wikipedia (they send `X-Frame-Options: DENY`); only DuckDuckGo/Bing render in-frame.
- "Data wipe" is in-memory/`localStorage`, not forensic — a devtools user can read the database.
- A web page cannot lock the OS; for real enforcement pair this UI with Assigned Access / kiosk mode.

## File map

    demos/library-kiosk.html             the kiosk (single file)
    demos/library-kiosk-mirror/index.html  byte-identical mirror
    demos/library-kiosk-analysis.html    long-form analysis
