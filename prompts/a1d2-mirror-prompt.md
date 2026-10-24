# Build spec — a1d2.org mirror + behavioural teardown

**Slug:** `a1d2` · **Status:** done · **Date:** 21 Oct 2026 · **Origin:** `https://a1d2.org`

## Goal

Mirror **a1d2.org** — registered 2026-09-12, one project, a fork of p2r3's `ha.mr` compressor (MIT) — as an
**offline-working** copy, and audit the running site against its own code and DNS: separate what the site
*says* from what its code *does*, then write the gap up with the evidence that proves each claim.

**Do not assert who operates the domain.** The registrant is redacted, there is no `MX`, and nothing on the
site names a person. Describe what is observable and stop there — no “this is the author's own site”, no
guessing at intent from the Chinese-first copy.

## Deliverables

| File | What it is |
|---|---|
| `demos/a1d2-mirror/` | 12 files, 234 KB: landing page, `/q/` compressor, all JS/CSS, both licences, the origin's 404 |
| `demos/a1d2-mirror/MIRROR.json` | URL → path → sha256 for every file + the exact rewrite |
| `demos/a1d2-mirror-analysis.html` | long-form teardown (the card's “Read the audit”) |
| `prompts/a1d2-mirror-prompt.md` | this spec |

## Scope

Static, same-origin only: `/`, `/style.css`, `/q/`, `/q/main.js`, `/q/compress.js`, `/q/alphabets.js`,
`/q/lean-qr/lean-qr.js`, `/q/stats`, `/q/stats.js`, `/q/LICENSE`, `/q/lean-qr/LICENSE`, and the 404 page.
No attempts at origin discovery — no historical DNS, no subdomain brute force, no certificate mining for
bypass. The site is behind Cloudflare on purpose; the deliverable is the honest “what the domain does and
doesn't publish”, not an origin hunt.

## Rewrite rules

`index.html` needed **nothing** — it already used relative refs. `q/index.html` and `q/stats` referenced
root-absolute paths (`/q/main.js`, `/q/stats.js`, `/q/LICENSE`), rewritten to `./…` so the mirror works
under `/portfolio/demos/a1d2-mirror/`. Everything else is byte-identical, including the Cloudflare Web
Analytics beacon — it 404s locally, and that 404 is part of the finding.

## Verification

1. Serve the folder; load `/` and `/q/` in headless Chromium; assert 0 page errors.
2. **Functional, not visual:** type a URL into `#input-link` with real keystrokes, wait for the debounced
   `#output-link`, capture the payload; paste it into `#input-reverse` and assert it round-trips.
3. **Behavioural:** navigate to `q/#<payload>` for a payload pointing at `example.com` and record what
   actually happens (does an interstitial appear?). This is the step that overturned the upstream README.
4. **Endpoint probes:** `GET /stats.json`, `POST /a` with several content types, `GET /a`.
5. DNS/RDAP/CT: `dig` A/MX/TXT, RDAP for the registrar + redaction state, certspotter for subdomains.

## What the checks found (why they were worth running)

- `main.js:317` — “Redirect straight through - no confirmation screen”, then `location.replace()`. The
  upstream project has an interstitial; this fork deleted it. Verified in a browser, not inferred.
- The browser test also showed `location.replace` leaves **no history entry**.
- `/q/stats` copy still claims a confirmation screen, and `main.js` contains no `fetch` at all: the
  counter's client half is gone, `/stats.json` is 404, `POST /a` is 405.
- Cloudflare Web Analytics is injected on all three pages → the site is **not** third-party-free.
- No `MX`, no `TXT` → the advertised `support@a1d2.org` cannot receive mail, and there is no SPF/DMARC.

## Pitfalls hit on this build

- Blind `"/q/" → "./q/"` rewriting on a page that lives *inside* `/q/` deletes the `=` in `href="./q/x"`
  when done as a raw string replace. Rewrite attributes with a regex that keeps the `=`, and re-diff
  against the origin afterwards.
- The compressor is debounced and gated on module load: a Playwright `fill()` can race ahead of
  `#content` becoming interactive (`pointer-events:none` until the module's last lines run). Wait for
  the output element to change, don't sleep.
- QR payloads go in the **path** (`/q/PAYLOAD`), not the fragment, so `/q/anything` is a 200 — a mirror
  that 404s unknown `/q/` paths is broken.

## Honest limits

The mirror cannot demonstrate the counter (endpoints absent) and cannot show the beacon working (it 404s
locally). “Where it is hosted” stays unanswered: anycast + redacted RDAP + no origin leak in CT logs means
the only truthful statement is that the origin is unknown.
