# DocScribe — a writing pad with nothing to set up

A Google-Docs-shaped editor you can just open and type in. There is no login, no API
key, no Google account and no setup page — **no console work of any kind**. The text is
stored in Cloudflare KV, which the site already had.

## Live

- App: https://docscribe.isaac1804.workers.dev
- Backend: Cloudflare Worker `docscribe` + KV namespace `DOCSCRIBE`
- Open it and start writing. That is the whole setup.

## Why this exists (the interesting part)

V1 was an honest attempt at "make it work for Google Docs": a local Python app that read
and wrote a real Google Doc through the Docs API. It worked — but the Google Doc *was* the
database, so every page load and every save called `documents.get` / `documents.batchUpdate`.
That requires an OAuth client, which requires the full click-through:

> Cloud project → enable the Docs API → OAuth consent screen wizard → External audience →
> add yourself as a test user → publish → add the `documents` scope → create a Web
> application client → paste the redirect URI → download the JSON → and re-authorise every
> **7 days** because an unpublished app in Testing status expires refresh tokens.

That is a lot of console clicking before the first word gets typed, and it deliberately
puts your document in Google's hands. So instead of documenting the walkthrough, the
dependency was **deleted**: the storage moved from a Google Doc into the KV store that was
already provisioned. Every step above disappeared at once, and so did Google.

## Features

- **Zero setup** — no client ID, no secret, no access key, no unlock box. The Worker's
  secret list is genuinely empty.
- **No access key at all** — the door is the browser, not a typed password. The first
  browser to open the URL claims the pad and gets a 256-bit random cookie; the claim is
  first-write-wins in KV.
- **Nobody else can touch it** — no cookie means `403 already claimed` on read, write,
  export and delete. The pad does not leak its text to anyone who finds the URL.
- **Autosave** — the editor posts only when there is a change.
- **An honest edit log** — one log row equals one real edit caused by real typing at real
  wall-clock time. A save that changes nothing returns early and writes nothing, so the log
  cannot inflate itself.
- **Export to `.docx`** — a ZIP written by hand (no libraries, because a Worker has no npm
  deps here): `[Content_Types].xml`, `_rels`, `word/document.xml`, CRC-32 checked by the
  ZIP writer itself. Verified with `file` (reports "Microsoft Word 2007+"), `unzip -t`
  (clean) and macOS `textutil` (reads the body back, CJK and escaped entities included).
- **Export to `.md`** — plain markdown for anything that is not Word.
- **Getting it into Google Docs anyway** — download the `.docx`, then in Drive:
  *New → File upload*, right-click the file, *Open with → Google Docs*. Drive converts it to
  a native Google Doc. Three clicks, no API project, and the conversion happens in Drive
  where it belongs.
- **Second device** — the home page hands out a one-tap pairing link (`/pair?t=…`), single
  use and 10-minute expiry. The link *is* the credential, so it can be redeemed by a device
  that has no cookie yet; no code to read off a screen and retype.

## Files

- `cloud/worker.js` — the whole app: routing, KV storage, owner claim, autosave, exports,
  the hand-rolled `.docx` ZIP writer.
- `cloud/test_core.mjs` — 39 assertions on the pure helpers (ZIP checksums, XML escaping,
  save-mode maths, filename safety).
- `cloud/test_access.mjs` — 54 assertions driving the real Worker against an in-memory KV
  stand-in: claim, lockout, save, no-op save, export, pairing, delete.
- `cloud/deploy.sh` — runs both suites and only then deploys with the `isaac1804` API token.
  Shipping is gated on 93/93.
- `cloud/README.md` — the one-line "what do I do" page. There is no setup guide because
  there is nothing to set up.
- `app.py`, `google_client.py`, `templates/setup.html` — the old local V1, kept for
  reference. It still needs the OAuth client and should not be used.

## Verification done

- 93/93 offline assertions (`node test_core.mjs` + `node test_access.mjs`).
- Live: first visit returns 200 and sets the owner cookie; a stranger gets 403 on every
  route; the `.docx` downloaded from the live Worker opens in real Word tooling.
- The deployed home page contains **zero** mentions of Google, OAuth, key or setup.
- KV was wiped after testing (`owner` key deleted explicitly) so the owner's first visit
  claims a clean, empty pad.
