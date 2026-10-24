# Build spec — tripo3d.uk (Tripo Studio reseller) teardown + evidence bundle

## Goal

A single-page investigation of `tripo3d.uk` — a Nuxt re-skin of Tripo's own Studio app that bills
users in private credits and settles every generation through a pool of borrowed official Tripo API
keys — published on the portfolio with a hash-pinned evidence bundle next to it.

The question the page has to answer in one screen: **how does this site make money, and what is the
user actually buying?**

## Deliverables

```
demos/tripo3d-uk-teardown.html        write-up (dark teardown tokens, wa-kit-teardown lineage)
demos/tripo3d-uk-evidence/index.html  evidence hub: files, hashes, verify commands, what is withheld
demos/tripo3d-uk-evidence/served-shell.html.txt  byte-identical 3,396 B response to GET /
                                                  (.txt so the bytes survive CDN/skin injection)
demos/tripo3d-uk-evidence/announcement.json    byte-identical 555 B body of GET /api/announcement
demos/tripo3d-uk-evidence/bundles.sha256       SHA-256 of all 49 JS chunks (1,320,125 B)
demos/tripo3d-uk-evidence/MANIFEST.sha256      shasum -c verifiable
prompts/tripo3d-uk-prompt.md                   this file
```

## Method (reproducible, no account needed)

1. `GET /` → 3,396 B shell; empty `<div id="__nuxt">`; `window.__NUXT__.config.public.apiBase === ""`.
2. Parse the 35 `<link>` hints (1 modulepreload + 32 prefetch + stylesheet/icon) → 22 JS + 12 CSS filenames.
3. Pull every chunk. Grep for:
   - `path:"/..."` → the 22-route table (11 workspace + 8 `/admin` + `/`, `/login`, `/register`);
   - `"/api/…"`, `"/admin/…"` → the endpoint surface (auth, task, upload, balance, poll, admin keys/subservers);
   - Chinese string literals in admin chunks → `号池总余额`, `自动补充`, `阈值`, `管理 Tripo API Key`,
     `管理批量图片转模型 API Key`, `客户端下载地址（含 Windows EXE）`, `分流`, `主/子服务器`.
4. Credit meter: the minified `H=()=>p.quad?"15 积分":O()?"10 积分":"5 积分"` plus the `O()` toggle set
   (`quad`, `forceSymmetry`, `flattenBottom`, `faceLimit`, `textureSize!==4096`, `textureFormat`).
   Balance gate: `if(balance<cost) → "积分不足 (需要 X，当前 Y)"`.
5. Confirm there is **no payment path**: zero 支付宝/微信/Stripe/PayPal strings across 1.32 MB; the only
   balance mutations are `/admin/users` (扣除成功) and `POST /admin/batch-keys/{id}/recharge` (充值成功).
6. `GET /api/announcement` → the operator's own notice that the backend accounts run out of credits.
   Capture the body byte-for-byte; it is the load-bearing quote on the page.
7. Registry facts from Nominet RDAP + `whois -h whois.nic.uk tripo3d.uk` (registered 2026-07-03,
   expiry 2027-07-03, Cloudflare tag, registrant validation failed 03-Jul-2026).
8. Upstream pricing from `developers.tripo3d.ai/en/pricing` (2026-10-21): 1 credit = US$0.01;
   H-series text→3D 10 credits, image→3D 20, +standard texture +10. Derive the break-even floor
   per local credit — do not invent a retail price, the site publishes none.

## Structure of the write-up

1. **Deck** — one sentence: not Tripo; a re-skin that sells prepaid credits routed through borrowed API keys.
2. **Stat strip** — 3,396 B shell · 49 chunks / 1.32 MB · 22 routes (8 `/admin`) · 5-credit base ·
   6,000-credit pool floor · 0 lines of payment code.
3. **Call-out** — the announcement verbatim (Chinese, unedited) + a gloss; hash under it.
4. **01 What the domain is** — WHOIS/RDAP table with a "why it matters" column.
5. **02 The product is Tripo's app, re-skinned** — route table in a mono block; the eight admin routes named as the business.
6. **03 The meter: 5 / 10 / 15** — the minified credit-cost function, the toggle→tier mapping table, the balance gate.
7. **04 The supply side is a pool of borrowed keys** — key-farm console strings, 6,000 floor,
   auto-replenish, per-key balance/concurrency/priority/expiry, 分流 modes; ASCII flow
   visitor → clone → key pool → developers.tripo3d.ai.
8. **05 Where the money comes from** — 4-row revenue table (prepaid credits · off-site card keys ·
   studio API keys + Windows EXE · 分站 sub-dealers), each row citing the build artifact that proves it.
9. **06 Unit economics, computed** — upstream credits → US$ → local credits → break-even HK$/credit;
   then the float argument (selling more credits than the pool can serve is the margin *and* the risk).
10. **07 Failure modes** — symptom → cause → who pays.
11. **08 Evidence** — hash table + buttons to the bundle, manifest, raw JSON, build spec.
12. **09 What a buyer is actually buying** — warnbox: unsecured prepayment, unnamed operator,
    four-month-old domain, no refund path; plus two cards (cheap models → official; the genre → shared-key arbitrage).
13. **10 Method** + footer **Honesty notes**: identity unknown (privacy + failed validation), no price
    list exists so every figure is a derived floor, admin screens read from code not from a live login,
    vendor bundle hashed but not republished.

## Hard rules for this page

- Quote Chinese verbatim; do not translate inside the quote block — gloss separately.
- Every number is computed from a fetched artifact or the vendor's public price page; keep the
  arithmetic visible (10 cr × $0.01 ÷ 5 local cr = $0.020).
- No accusation of illegality. The finding is structural: prepaid credits against a rented key pool,
  with the operator's own notice as the evidence for what happens when the pool empties.
- `.tblwrap` must be `overflow-x:auto` (the lifted token CSS ships `overflow:hidden`, which clips the
  last column on a phone).
- Do **not** mirror or republish the vendor's application bundle — hash it. Only the served shell and
  the API response are byte-identical, because those are the actual evidence.

### The archived copy (`demos/tripo3d-uk-mirror/`)

Same capture, made runnable: 49 JS chunks + 36 CSS in `_nuxt/` (all 49 hashes equal the origin
manifest; the 22 per-route sheets only appear when the router renders that route), plus
`studio.hdr` (1.6 MB) for the three.js scene and `viewer/images/*.png` (the material swatches the
viewer asks for root-absolute). `index.html` = the verbatim shell with seven deltas — 36 asset URLs
made relative, `baseURL:"/"` derived from `location.pathname` (a router pinned to `/` renders their
404 on every subdirectory URL), the icon link dropped (the origin answers it with the SPA document),
`mirror-guard.js?v=3` injected first with `noindex` (the query string is a cache-buster; a bare
filename is edge-cached and an updated guard never reaches a returning browser), an explicit
`<link rel="icon" href="/portfolio/demos/tripo3d-uk-mirror/favicon.ico">` with the deploy path (a
relative one re-probes `/workspace/favicon.ico`) and a 100 B icon.

`mirror-guard.js` is the only authored file, and it is a fake backend: **any username and any
password log in** (`POST /api/auth/login` → 200 with a token and a fabricated user, `role: admin`,
`balance: 128`), `/api/announcement` → the captured body, `/api/gen-models` → a catalogue with the
real shape so the pickers populate, `/admin/*` → empty-but-correct shapes, `/api/auth/refresh` → 401
(so the copy always opens on the real login screen instead of logging itself in).
`fetch`/XHR/WebSocket/EventSource/beacon/service-worker/forms blocked, stopped URLs in
`window.__mirrorBlocked` (fake answers in `window.__mirrorUnstubbed`), fixed bottom label in Chinese
and English.

A job submitted here runs a **local demo**: `POST /api/task` stores a timestamp, the poll endpoints
report a rising percentage, and at 7 s the guard imports the bundle's own event bus
(`_nuxt/C8rqidu5.js`, same URL as the app's import, so the same module instance) and calls
`emitLoadModel` with `demo-model.glb` — the Khronos "Duck" sample, 118 KB, CC0. That is what puts a
model on the stage and lights up the material swatches, the transform panel and 导出. It is labelled
DEMO on the stage and in the bottom bar: nothing came from the uploaded picture. The bus is driven
from the guard because the app's own `emitTaskStarted` never reaches the asset panel under this
mirror — a submitted job would otherwise sit invisible while the API returned a perfectly good id.

Faking the session is deliberate and must stay labelled: the paid screens are the evidence, and
nobody can see them without an account the operator sells — but every number is a constant, nothing
is generated, and the bar says so. Each payload carries its fields both at the top level and under
`data` (shallow copy) because the minified `$api` unwrap direction is unknowable from outside.

Verify: 52 asset requests, 0 to `tripo3d.uk`, 2 blocked API calls, 0 failed requests, 0 overflow at
390/768/1440, iframe renders `Tripo Studio` + the operator's own announcement modal.
The folder is in `theme-inject.py`'s `SKIP_PREFIX` — the skin must not touch vendored bundles.
