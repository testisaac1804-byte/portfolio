# North Korea Web Archive — build spec

## Goal
Build a browsable offline copy of every publicly known website in the DPRK, starting from a
single site that would not open (`airkoryo.com.kp`). Publish the list plus the captured HTML to
the portfolio.

## What the failure actually was
`airkoryo.com.kp` returned a name-resolution error — which reads like "the server is down". It
was not: `curl --resolve www.airkoryo.com.kp:80:175.45.176.69` returned `200 OK`, 13,110 bytes,
`<TITLE>Air Koryo</TITLE>` in ~25 s at ~0.5 KB/s. The website was alive the whole time; only the
lookup was broken.

The root zone still delegates `kp.` → `ns1.kptc.kp` / `ns2.kptc.kp` (`175.45.176.15` / `.16`),
which sit inside the same `/22` as the websites. Probing them directly:

- `UDP/53` → timeout (filtered)
- `TCP/53` apex → `NOERROR`
- `TCP/53` child (`kcna.kp`, `naenara.com.kp`, `rodong.rep.kp`) → `SERVFAIL`
- Cloudflare DoH → `EDE(22): No Reachable Authority at delegation kp`

Both authorities live inside the link that closes, so when it closes every `.kp` host vanishes at
once. That is why it presented as "the country's internet went down" rather than "one site broke".

## Pipeline
1. **Enumerate** — no zone transfer is possible, so hostnames come from three sources: public
   DPRK-site trackers, passive-DNS history (`api.mnemonic.no`), and institutions appearing in
   archived links. Result: **44 candidate hosts**.
2. **Inventory** — query the Wayback CDX API per host and write `inventory.json` incrementally so
   the job is resumable. **Critical:** use `matchType=domain`, not a prefix match, or every host
   archived under `www.` reports zero captures (cost 24 false "never archived" results on the
   first pass).
3. **Mirror** — breadth-first from each site's real front page, same-host only, depth 2, 45-page
   cap, up to 220 assets fetched 3-way parallel. Seeds must include `/`, `/index.html`,
   `www.`-prefixed and `:80` variants plus every netloc the CDX knows, because archives store
   `www.host:80/`-style URLs.
4. **Rewrite** — strip the `web.archive.org/web/<ts>id_/` wrapper, then relativise every
   root-absolute reference so the mirror browses from `file://` with no server. Missing assets
   fall back to the archive URL.
5. **Verify** — re-parse every saved page and resolve each local reference against the
   filesystem. Never eyeball it.

## Three bugs worth remembering
| Symptom | Cause | Fix |
|---|---|---|
| 45 pages, 1 file on disk | article URLs are `index.php?newsID=…`; the query was truncated to 36 chars, so all IDs collapsed onto one filename | hash-suffix the full query → 1 file became 79 |
| sites with no CSS/images | host check compared raw netloc; archived URLs are `www.host:80`, never equal to `host`, so every asset was rejected as off-site | compare `.hostname`, never the netloc |
| 10 sites "never archived" | archive.org signals a rate-limit with **TCP connection refused**, not HTTP 429; the logger read that as an empty archive | treat connect-failure as throttle: 20–90 s backoff, 4 tries |

The third produced a confidently wrong conclusion about sites among the largest in the set
(Pyongyang Times, Kim Chaek University of Technology). After the fix: failed URLs per site
198 → 6, coverage 27 → 37 hosts.

## Result
- **37 of 44** hosts mirrored; **7** have no capture anywhere (`kiyctc`, `knic`, `cooksfriends`,
  `korelcfund`, `ryongnamsan.edu`, `silibank`, `star-co`).
- 84,841 URLs indexed, 1,255 pages, 5,752 files, 428 MB.
- Link resolution 9,698 / 13,141 (73.8%); the rest are links to pages beyond the 45-page cap.
- Four sites render unstyled — their CSS genuinely 404s in the archive (verified, not assumed).
- Live door: 14/14 probes to `175.45.176.0/22` on 80/443 refused.

## Deliverables
- `demos/nk-archive/index.html` — the hub list, generated from the manifests (no hand-typed
  numbers).
- `demos/nk-archive/sites/<host>/` — the 37 mirrored trees, browsable offline.
- `demos/nk-archive-analysis.html` — long-form write-up: DNS forensics, method, bug table,
  limits, evidence.
- This spec.

## Verification performed
- Hub and analysis page rendered at 390 / 768 / 1440 px: no horizontal overflow, tables scroll
  inside their own container.
- Every hub row link fetched → 200 against the local static server.
- Live: hub, analysis page, a sample of site trees, and the card markers.

## If this is ever rerun
Delete a site's `_manifest.json` to force a redo. Raise `MAX_PAGES` for deep mode. Keep
`THREADS=3` — higher concurrency re-triggers archive.org's throttle and nets out slower.
