# Anatomy of a WhatsApp "Linked Device" Phishing Kit — `web.mis-ws.org`

**Category:** Software & Security · **Status:** Done · **Type:** Defensive reverse engineering + site mirror

`web.mis-ws.org` serves 153 bytes to a desktop browser and a polished support-chat app to an iPhone.
That asymmetry is the point: the kit needs the victim's **WhatsApp to be on the device in their hand**.
What follows is the full teardown — how the gate works, how the bundle was deobfuscated, exactly how the
pairing-code handoff steals the account, and how the mirror was captured and made inert.

**Stack / Tools:** Node 22 (ESM loader hooks, custom deobfuscator) · Playwright + Chrome-for-Testing · Python · `curl` with iPhone UA · HTML write-up

**Artifacts on the site:**

- `demos/wa-kit-teardown.html` — the published teardown (self-contained, 6-stage flow + live mirror)
- `demos/mis-ws-kit/` — archived copy of the site (byte-for-byte assets + `guard.js`)
- this file — build spec / method notes

---

## Verdict

**Not a WhatsApp vulnerability.** Every step is a supported feature — linked devices, pairing codes,
QR login — aimed at a person instead of a machine. The kit's engineering budget went into **trust
theatre and anti-forensics**, not exploits: UA gating, a bot/AI-crawler blocklist, an anti-debug trap
that wipes the document, obfuscated bundles, 7-day domains, and 2-minute single-use links.

The victim completes the account takeover themselves: the chat hands them an 8-digit code and tells
them to open WhatsApp → Settings → Linked devices → Link with phone number → enter it. That instruction
is literally correct. It authorises the *operator's* server as a device on the victim's account.

## 1 — The cloak (three layers, all observed)

| Layer | Mechanism | Evidence |
|---|---|---|
| Server | Desktop/bot UA → bare 404 shell | `curl` desktop = 153 B; iPhone UA = full SPA |
| Inline head script | mobile-UA allowlist + `bot\|spider\|crawl\|slurp\|headlesschrome\|phantomjs\|selenium\|puppeteer\|playwright\|python-requests\|curl/\|wget` denylist | 1.8 KB `index.html` |
| `mgate.js` | platform ≠ win32/macintel/cros, WebGL `UNMASKED_RENDERER` not a desktop GPU, `navigator.userAgentData.mobile` ≠ false | 2.1 KB chunk |

Additionally the app chunk contains an anti-debug routine: `debugger`-timing + `outerWidth-innerWidth > 220`
+ `navigator.webdriver`; on detection it sets `document.documentElement.innerHTML = ''` and `window.stop()`.
This is why a naive Playwright run shows a blank page with **no console error** — the module returns before
`mount('#app')`.

One deliberate exception: `/q/<6–16 chars>` bypasses the mobile check, because that page must open on a
desktop to display the QR fallback.

## 2 — Deobfuscation (obfuscator.io, self-decoding)

Four bundles, each with its own string array, decoder and **rotation IIFE**. Approach that worked:

1. Extract `function <arr>(){const _=[…];…}` and `function <dec>(i){i=i-0xNNN;…}` by brace matching.
2. Extract the rotation IIFE `(function(a,b){…}(arr,0xNNNN))` and `eval` all three together — without the
   rotation the index map is wrong (this is why a naive substitution only resolves ~30% of strings).
3. Collect every alias of the decoder (`const x = dec`, `const y = x`, …) to a fixed point — the bundles
   use aliases of aliases, which silently drops most call sites otherwise.
4. Substitute `<alias>(0xNNN)` → string literal.

Result: **13,449 substitutions**, 43 unresolved (dynamic keys), across `main`/gate/entry/app bundles.
The 1.19 MB app chunk is Vue 3 + a 4-language i18n table (zh-CN / zh-HK / zh-TW / en-US, auto-selected
from `.hk`/`.mo`/`.tw` hostnames) — the localisation is a targeting feature, not a nicety.

A separate Node DOM mock + ESM loader hook mapped the lazy chunk graph before that:
`entry → gate → app`, with `mgate.js` resolved only on the second pass.

## 3 — The flow

1. **Landing** — mobile UA only, five `noindex` metas (robots/googlebot/bingbot/baiduspider/yandexbot).
2. **Bot script** — fake 「WhatsApp 安全檢測中心」 greeting, account-risk warning, liability disclaimer,
   service menu (查詢訂單 / 物流配送 / 退款售後 / 人工專員). Pretext is vague so any visitor maps their own
   unfinished transaction onto it.
3. **Number capture** — 驗證手機號碼 card, country picker defaulting to **+86**.
4. **Pairing** — WebSocket `/api/v1/ws1`:
   `session.start {mode:'phone', client_session_key, timeout_seconds:300, metadata:{source:'web-kf', domain, ua, ip}}`
   → `session.update` (`awaiting_phone` / `created`) → `session.code`.
   The backend holds a real like-WhatsApp linked-device session; WhatsApp issues an 8-digit code; the
   kit renders it in chat as 「安全人員校驗驗證碼 · 8 位驗證碼」 with a countdown.
5. **Role reversal** — the same card tells the victim to open WhatsApp → 設定 → 關聯設備 →
   使用電話號碼關聯 → enter the code. The victim types the operator's authorisation code into their own phone.
6. **Hold** — 「AI 檢測已完成…請保持設備關聯狀態」 + 「請勿在手機端移除剛關聯的設備」. Removal is
   reframed as the cause of a ban.
7. **Human operator** — `/session/message`, `/session/poll`, `/session/typing`, `/session/media`,
   `/session/access-check {device_id, ip}`. The bot script is local; the "specialist" is a person.
8. **Fallback** — `POST /api/pc-scan` → `/q/<code>` (120 s TTL) → real QR rendered to the victim,
   scanned from 關聯設備 → 掃描二維碼. Error reasons relayed from WhatsApp verbatim:
   `login_rejected`, `device_limit`, `login_timeout`.

Why it works: the pairing code is *supposed* to be entered on the phone. The kit only lies about
**whose device is waiting on the other side**.

## 4 — Capturing and neutralising the mirror

Capture: Playwright, iPhone 13 UA + touch + 390×844, `response` hook writes every same-origin body to
disk keyed by path; `guard.js` loaded via `add_init_script` to satisfy the gates during capture.

Mirror fixes (all deliberate, all documented in the page footer):

- absolute `/llFco8/…` and `'/llFco8/'` → relative, so the copy runs from a subdirectory;
- Vite's preload helper prefixes deps with `/` and resolves via `import.meta.resolve` — patched to keep
  `./GbdDzTQ6mWpLgsXz.css` inside the folder;
- images whose paths are baked into the string table (`/llFco8/…`) are rewritten at runtime by the guard.

`guard.js` (not part of the kit):

1. spoofs iPhone UA / platform / `userAgentData` / `webdriver=false` / WebGL renderer, so the kit's own
   gate passes and the UI renders in a desktop iframe;
2. hard-blocks `fetch`, `XHR`, `WebSocket`, `sendBeacon` — same-origin `/api|/session|/monitor|/analytics`
   rejected outright, all cross-origin rejected;
3. adds a permanent 「存檔副本 / ARCHIVED COPY」 bar.

Verified: page renders the real first screen (gate, risk warning, menu, 開始驗證), 0 network calls leave,
0 4xx, 0 console errors. The archive cannot be used as a working kit.

## 5 — Indicators

- Host: `web.mis-ws.org` (apex `mis-ws.org` has no A record) · registered **2026-10-12** · Gname.com
- NS: `a.share-dns.com` / `b.share-dns.net`
- Edge: `9dae60af.a1vk0eiqz0.xyz` → `cdn.a1vk0eiqz0.xyz` (wildcard cert 2026-09-19)
- IPs: `45.61.163.20`, `45.61.150.6`, `45.59.119.120`, `144.172.98.253`, `144.172.102.144`, `172.86.90.167`
- Assets: `/llFco8/` (rotating entry chunk; 13 `.webp`, 1 `.png`)
- API: `/api/allocate`, `/api/pc-scan/<code>`, `/api/tg-cs/session/{health,access-check}`, WS `/api/v1/ws1`
- Storage: `kf-wa-pairing-session`, `kf-wa-ws-path`, `kf-wa-allocate-ip`, `kf-human-verification-passed`
- Analytics: Umami, website-id `1e2159ad-6f45-474d-9533-3ca58be064e1`

## 6 — Safety notes

- Nothing was submitted to the live operator: no phone number, no code, no session. All analysis is static
  (fetched bundles) plus offline rendering of the captured copy.
- The published mirror has no reachable endpoint by construction, carries a visible archive label, and is
  `noindex` (inherited from the captured shell) — it is an exhibit, not a tool.
- Recovery advice on the page: unlink unfamiliar devices, enable two-step verification; a linked device
  survives a reinstall and a password change, only unlinking removes it.
