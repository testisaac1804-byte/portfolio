# Build spec — Offline Chat (LAN, zero-internet multi-user chat)

## Goal

A multi-user chat with file sharing that runs with **no internet at all**: no tunnel, no relay, no
external service. One host starts it; everyone else joins from a browser on the same local network.
Python standard library only — no `pip install`, no virtualenv, no build step. Ship it as a **new
file** beside the existing app, never editing the original.

Explicit constraint from the request: *"make sure its seperate file dont delete the old ne"*.

## Hard requirements

| Requirement | Implementation |
|---|---|
| No internet dependency | Bind `0.0.0.0`, serve same-origin only; no outbound socket anywhere |
| No packages | `http.server`, `ssl`, `json`, `secrets`, `socket`, `subprocess` from stdlib |
| Feature parity with the original app | real-time messages, display names, file upload, device detection, host/admin panel, share link, reconnect, dark + mobile UI |
| Works on any client | plain HTTP + `EventSource`; the client is one HTML string |
| Never touch the original | new files only: `offline_chat.py` (v1), `offline_chat_v2.py`, `start_chat.py` |

## Protocols

- **Push:** `GET /events?session_id=…` → `text/event-stream`, held open per client.
- **Actions:** `POST /send` with `{action: message | set_name | react | delete | claim_host | ping}`.
- **Files:** `POST /upload` (multipart) → stored in `uploads/`, served at `/files/<name>`.
- **Discovery:** `GET /link` → `{link, host}` where `host` carries a one-time admin token.

## Security features (v2)

1. `--tls` — self-signed cert, generated on first run, cached in temp.
   - Prefer `openssl req -x509 -newkey rsa:2048 -addext subjectAltName=IP:<lan>,DNS:localhost`.
   - **Fallback when `openssl` is missing** (stock Windows): pure-Python RSA-2048 keygen
     (Miller–Rabin primes) + hand-built X.509 DER, signed `sha256WithRSAEncryption`
     (OID `1.2.840.113549.1.1.11`), PKCS#1 v1.5 padding, PEM at 64 columns.
2. `--password P` — room password; `/auth` returns a token, `/events` and `/send` require it.
3. `--stealth` — port 443 + TLS + password, so flows look like ordinary HTTPS.
4. `--bind-ip IP` — manual override when LAN IP detection picks the wrong adapter.
5. **Panic close** — `beforeunload` + `pagehide` blank `document.body` and clear stored state.

## Cross-platform rules (learned the hard way)

- Target **Python 3.9+**: `Optional[str]`, never `str | None`.
- Do not assume `openssl` exists; do not assume a POSIX shell.
- Do not assume the host can create a hotspot or an ad-hoc network — many managed Macs cannot.
  `start_chat.py` must explain the realistic options (existing LAN, phone hotspot, direct cable)
  instead of pretending to create a radio.

## Traps that cost real time

- **Do not build the HTML with an f-string.** JavaScript object literals and CSS braces collide with
  Python interpolation. Use a plain triple-quoted string plus `__MARKER__` tokens and `.replace()`.
- If the template was migrated *from* an f-string, every brace is still doubled (`{{`/`}}`).
  Collapse them once at render time — 204 of them leaked into a shipped page and produced an
  unstyled page whose JS never ran.
- In a non-raw Python string, `\'` is consumed by Python. Never generate nested
  `onclick="window.open('…')"` inside a JS single-quoted string; use `window.open(this.src)`.
- Verify the **client** with `node --check` on the extracted inline script and a real headless
  browser, not just `curl` returning 200. A page can serve fine and still be inert.

## Verification checklist

- [ ] `python3 -m py_compile` on both files
- [ ] `/health` returns `{status, users, tls, stealth, password_protected}`
- [ ] `/` returns the full shell; `{{` count is 0; extracted script passes `node --check`
- [ ] two concurrent SSE clients: second join emits `system` + `user_list`; a message from one is
      received by the other and replayed in `history` for a later session
- [ ] wrong password rejected; correct password yields a token that `/events` accepts
- [ ] `--tls` → `/health` over HTTPS shows `tls: true`
- [ ] the pure-Python cert path exercised with `PATH` stripped of `openssl`, under system Python 3.9
- [ ] headless Chrome on the static demo: message bubbles render, share link fills, 0 console errors
- [ ] original files untouched (`git status` / checksums)

## Deliverable shape

- `offline_chat_v2.py` — server + client in one file
- `start_chat.py` — guided launcher
- `demos/offline-chat.html` — UI demo (real markup, `fetch`/`EventSource` stubbed, labelled as demo)
- `demos/offline-chat-analysis.html` — build analysis with measured numbers and honest limits
- `demos/offline-chat-mirror/` — byte-identical copies of both `.py` files + hashes + downloads
