# 218.com / 213.com — Complete Network Analysis
**Date:** 2026-09-17 · **Sources:** live probing, fresh page captures, app JS mining, DNS/WHOIS, decrypted app config

---

## 0. Executive summary

Two illegal offshore casino networks targeting Chinese/HK gamblers, both now reachable via their apex domains (218.com / 213.com).

| | **218 network — 永诚贵宾会** | **213 network — PG娱乐** |
|---|---|---|
| Platform | **BBIN white-label** (BB电子/BB视讯/BB体育, bbinproblem.support, publicbmw flash loader) | **TruckSDK / OpenShare** door network (merchant FNQ2, agent ZYM) |
| Platform domains | vir888.net / vir999.net / vir888.com (dj8886) | skr004.cc / skr005.cc relay + ee131.cc / cocokobe.com app mirrors |
| Entry | 218.com → 185.186.146.156:8080 → 218yc.com | 213.com → 302 → random-sub.213NNNN.cc door |
| Backup lines | 2182999/2183111/2183666/2185666.com :9900/:8866 (real app) | 213h5tz0072–74.cc H5 doors + 213h5004–08.cc fake browsers |
| Hosting | Vultr JP, WoodsDale KR/IN, GCP, AWS, Cnservers US | Iens (Brazil IPs), AWS, CloudFront, Alibaba DNS relay |
| Registrar | GoDaddy (bulk) | Gname (bulk) |

---

## 1. The 218 network (永诚贵宾会 — BBIN casino)

### 1.1 Entry chain (verified live today)
```
218.com ──▶ fake "Loading..." page
   └─ JS: atob("aHR0cDovLzE4NS4xODYuMTQ2LjE1Njo4MDgw") = http://185.186.146.156:8080
   └─ http://185.186.146.156:8080/?r=<base64(current URL)>  → 301
   └─ https://www.218yc.com/   (TLS-fingerprint gated: HTTP 000 to curl, browsers pass)
```
- **218.com**: GoDaddy + Domains By Proxy (US privacy), registered 1998-04-02 (exp 2031), NS clint/tess.cloudflare.com, A = 185.186.146.156 (Cnservers, Los Angeles). The `?r=` param tracks the source URL (affiliate funnel).
- **218yc.com** (备用网址资讯站 hub): GoDaddy, created **2025-09-18**, NS marlowe/randy.cloudflare.com (different CF account), A = w.218cdn.com → 45.77.28.136 (Vultr Tokyo). **Hardening flip-flops**: 09-14 blocked → 09-15 open (200) → 09-17 gated again.
- **218cdn.com / 217cdn.com**: twin CDN domains (2023-01-29 / 2024-06-02), NS henry/kami.cloudflare.com.

### 1.2 Backup lines → the REAL app (all verified live)
| Domain | Port | Result | IP (geo) |
|---|---|---|---|
| 2182999.com | :9900 | 302 → `/web/#/first` → **app 200** | 146.88.161.34 (WoodsDale — "KRJPL") |
| 2183111.com | :8866 | same app 200 | 146.88.161.34 |
| 2183666.com | :9900 | same app 200 | 103.241.116.187 (WoodsDale KR) |
| 2185666.com | :9900 | same app 200 | 103.241.116.187 |

- All four: GoDaddy, custom NS `SNM1A0G.317dccne.com` / `SNN3A0G.317dccne.com`.
- The hub page also lists **`www81019827016236468.<line>.com`** — a 17-digit www-prefix trick generating infinite unique hostnames on each domain to defeat domain blacklists.

### 1.3 The app (what the lines serve)
App shell (`/web/#/first`) leaks:
- CDN: `g4.cldfvn.com` + `cdn4.cldfvn.com` (cldfvn.com = Name.com, created 2024-11-19, NS clyde/phoenix.cloudflare.com)
- `alias = 'ZGo4ODg2'` (base64 of **dj4886**) · server alias `REAL_SITE_SERVER_ALIAS = dj8886` · template `dj8886` · title **永诚贵宾会**
- GTM container **GTM-5PQDSQV** · xray telemetry `https://www992073.ats.elegancepath.online:3637/api/info` (GoDaddy 2023-09-12, AWS Route53 + Global Accelerator 76.223.106.153 / 13.248.237.124)
- Game providers (from decrypted i18n): **BB电子/BB视讯/BB体育 (BBIN)**, PG, CQ9, PT, PP (Pragmatic), KY, JDB, FG, SW, SG, AW, PS, MT, ACE, KA, GTI, LEG, TP, TIAN, XBB, MegaCasino (大满贯), FP. Games: 百家乐 (Baccarat), 龙虎斗 (Dragon-Tiger), 轮盘 (Roulette)…
- `bbCasinoJackpotUrl = https://kco7a3h5.com/app/flash/publicbmw/EjpRemote.js` — classic **BBIN flash casino loader** (kco7a3h5.com: GoDaddy, 103.241.113.49, NS jmm7788cne.com)
- `SUPPORT_URL = https://bbinproblem.support` — BBIN official support domain (Name.com, 2013-12-12)
- `AGENT_LOGIN_LINK = ag.218920.com` → CNAME `ag-dj8886.ld0088cne.com` → **34.54.245.238 (GCP)** → frameset `/user/login` = **agent backoffice portal** (218920.com: GoDaddy, NS 317dccne.com)
- Fake browser (寰宇浏览器): `LT_BROWSER_IP = https://tripleexperience.net/` (GoDaddy, 103.240.219.191, NS wu2222cne.com — serves "operation error." stub) · `BROWSE_URL = 2182999.com` · `BROWSER_IP = //2182999.com:9900/`
- 1257 i18n strings, zh-cn only, theme 7, mobile-only layout (max-width 454px)

### 1.4 API layer (cracked)
- **Encryption cracked**: all `/entrance/api` traffic = JSON → AES-256-ECB, key = ASCII bytes of `MD5(alias)`, wrapped in **double base64**. (Key for this deployment: `3335303530373164373034616163346663646563646265383736373335333439`.)
- 3 bootstrap calls: **lang** (i18n strings, 1257 keys), **init** (197-key config: CDNs, links, navbar, banners — decrypted & saved), **config** (game categories: element/article/jp/casino/card/sport/live/platformIcon).
- Full API surface from app JS: `/infe/mcenter`, `/infe/user/pwdlogin/{getData,delay,changPassword}`, `/infe/rest/promotions/advertise/{award,fastArea}`, `/infe/marquee/homeHotNews`, `/entrance/jackpot/jackpotPoolList`, `/entrance/offer/`, `/entrance/sendmail/sendMail`, `/m/verify/mkcode` (captcha), `/web/api.php` fallback.
- **Domain-rotation system** (`host_utils.js` in hub): ports **9900 / 5569 / 6899 / 7730 / 8866**; `getHost()` → `/api/hostnames` → reverse-proxies to `ai-cli.airegioncare.com/api/mem_domain` (AWS Global Accelerator 99.83.226.164 / 75.2.0.125), headers `RealUserAddr` + `RealUserID` filled from `get.wadidowe.net:9988/api/get_ip` → `{"get_ip":"89.238.156.195","key_id":"79d8ea4b"}` (M247 UK, reliablehosting). Both rotation endpoints are now tightened (`HIHI` / `ip_not_allow`).

### 1.5 Legacy platform domains (the "vir" family — what the app was built for)
From app JS hostname regex: `local.vir888.net`, `www-dev.vir888.com`, `www.bb-in555.com`, `www.vir999.net` are valid `/web/` hosts.

| Domain | Registrar | Created | Notes |
|---|---|---|---|
| vir888.com | Name.com | **2005-11-29** | oldest; NS amjshcne.com |
| vir999.net | GoDaddy | 2015-07-08 | **live 200** via Google LB ("via: 1.1 google"); NS amjshcne.com |
| www-dev.vir888.com | — | — | 103.241.237.92 (WoodsDale India) = dev/staging |
| vir888.net | Cloudflare Registrar | **2025-10-28** | NS razvan/ziggy.cloudflare — the 2025 relaunch domain |
| www.bb-in555.com | (bb-in555.com GoDaddy) | 2021-07-20 | app hostname |
| www.217jc02.com | GoDaddy | 2021-01-13 | → w.217cdn.com → 103.53.80.225 (xTom Japan); HTTP 444 (nginx no-response gate) |

### 1.6 Other 218-side domains
- **m2gnkr.com**: GoDaddy 2024-07-09, GCP 34.36.138.75, HTTP 200/0 bytes — relay/redirect stub.
- **bd742.com**: Domain.com 2016-10-19, Cloudflare, HTTP 200 (3 bytes) — tracking stub.
- **84992020.xyz** (2014-02-06): appears in the 213 SDK's adblock-detection selector list (`a[href*="/84992020.xyz"]`) — operator promo domain.
- **elegancepath.online / airegioncare.com / wadidowe.net**: GoDaddy/Name.com + AWS Route53/GA — the rotation/telemetry trio (2022–2023).

### 1.7 The "cne.com" nameserver fingerprint ⭐
Custom NS domains ending in **`*cne.com`** appear across the whole 218 network: `317dccne.com` (2182999/3111/3666/5666, 218920), `amjshcne.com` (vir888.com, vir999.net), `wu2222cne.com` (tripleexperience.net), `jmm7788cne.com` (kco7a3h5.com), `ld0088cne.com` (ag.218920.com). Registered across GoDaddy AND Name.com — a deliberate shared DNS layer proving **one operator runs 2182999/3111/3666/5666/920, vir888/vir999, tripleexperience, kco7a3h5 together**.

---

## 2. The 213 network (PG娱乐 — TruckSDK door farm)

### 2.1 Entry chain (verified live today)
```
213.com ──302──▶ https://yy2iaikt.213001.cc/?agentName=ZYM   (door, HTTP 200)
```
- **213.com**: Gname, registered **1996-02-24** (exp 2031), NS **dan/rosemary.cloudflare.com — the SAME Cloudflare account as the entire 213 door pool**. Registrant country: PH (privacy-redacted). Apex repointed onto operator infra = they control the brand entry now.
- Door page (fresh capture, identical structure to 09-15): 欢迎回家, merchant **FNQ2**, agent **ZYM**, kefu `https://yybet213cscht.yixiangmeiju.top/kefu/ZGF0YTM6MjkxMTo4OToxOTY6MDp6aDo0MDIyOjEzMTo5MDpkYXRhMw==` (base64 = `data3:2911:89:196:0:zh:4022:131:90:data3`), 97客服号 **219wy3sj35**, footer `COPYRIGHT©2025 PG娱乐`.

### 2.2 Door pool + relay (all bulk-registered)
| Pool | Domains | Registered | NS |
|---|---|---|---|
| Doors | 2138051–2138059.cc + 3128060.cc | **2026-07-24** (Gname, bulk) | dan/rosemary.cloudflare.com |
| H5 doors | 213h5tz0069–71 (09-15) → **0072–74 (09-17)** | day-of-deploy (Gname) | same CF |
| Fake browsers | 213h5004–08.cc (chrome/firefox/quark/huanyu/opera) | 2026-07-24 | same CF |
| Relay | **skr004.cc + skr005.cc** | **2025-04-30** (Gname, same minute) | **AliDNS (Alibaba)** |

- Door subdomain chain: `yy2iaikt.213001.cc` → CNAME `14da6ec7.skr005.cc` → `gcdca92.cdn.skr005.cc` → **186.240.215.18 / .47** (Iens Technology — IPs geo Singapore, used as Brazil-region entry servers).
- **Pre-deploy tell confirmed**: 213h5tz0075/0076 not yet registered; the farm stays ~3 doors ahead.
- Apex doors have NO A records (CF-proxied subdomains only) — `dig +short 2138051.cc` = empty even when live.

### 2.3 SDK backend (from fresh sdk.js)
| Host | Role | Notes |
|---|---|---|
| gw.gwpg.cc | prod gateway | → skr004.cc relay → 137.220.152.41 (Iens Tokyo); NS dan/rosemary (CF) |
| gateway.cocokobe.com | AWS gateway | CNAME → `k8s-ccgame-gatewayi-86ab273f45-115223609…` (AWS NLB — **leaks K8s cluster name "ccgame"**) |
| app.cocokobe.com | app download | CloudFront (dkuw5ccex7wum.cloudfront.net) |
| h5.e107–e122.cc | H5 pool | CloudFront (d3su8la501l4r8.cloudfront.net) |
| app-2wsx.ee131.cc / int-app-1qaz.ee131.cc | **new app-mirror family** | ee131.cc = Amazon Registrar 2023-11-08; CloudFront (d38p46rojgqocj / d3n86u6bm7evbj) |
| app-1wdv.cocokobe.com / app-bz-1qaz.cocokobe.com / h52wsx-k67.cocokobe.com | app mirrors | CloudFront |
| gymk9r.mianmashe.com | download host | Gname 2017-05-25 |
| yybet213cscht.yixiangmeiju.top | kefu | 2014-07-24; 138.113.55.202 (Meteverse HK) |
| 97chat.app | 97聊天 IM | 2015-06-25; 169.150.230.98 (Datacamp) — "97" chat app w/ 客服号 |
| m1.openfpcdn.io | FingerprintJS | device fingerprinting on every visitor |

---

## 3. IP inventory (47 unique, geolocated)

**218 side:** 185.186.146.156 Cnservers US (218.com origin relay) · 45.77.28.136 Vultr Tokyo (218yc/218cdn) · 146.88.161.34 + 103.241.116.187 WoodsDale KRJPL/KR (backup lines) · 103.241.237.92/.238 WoodsDale India (vir-dev/vir999) · 103.53.80.225 xTom Japan (217cdn) · 103.240.219.191 + 103.241.113.49 (tripleexperience/kco7a3h5) · 34.36.138.75 + 34.54.245.238 GCP (m2gnkr/agent portal) · 16.163.x AWS HK (wadidowe) · 89.238.156.195 M247 UK (rotation API) · 99.83.226.164/75.2.0.125 + 76.223.106.153/13.248.237.124 AWS Global Accelerator (airegioncare/elegancepath) · Cloudflare anycast (218.com, 218yc, cldfvn, bd742) · CloudFront (hub assets d3jt9qjcf20krh, dmxu4q6duoa7o)

**213 side:** 186.240.215.18/.47 Iens (doors/H5 — geo Singapore, "Brazil" VPS role) · 137.220.152.41 Iens Tokyo (gw.gwpg.cc) · 138.113.55.202 Meteverse HK (kefu) · 169.150.230.98/109.61.92.193 Datacamp (97chat) · 154.219.98.13 Vapeline HK (213.com) · CloudFront + AWS NLB (mirrors/gateway)

---

## 4. Timeline (operation history)

```
2005  vir888.com ......... platform domain heritage (BBIN white-label era)
2013  bbinproblem.support . BBIN official support domain
2014  yixiangmeiju.top, 84992020.xyz
2015  vir999.net, 97chat.app
2016  bd742.com
2017  mianmashe.com ....... 213 download host
2021  217jc02.com, bb-in555.com
2022  airegioncare.com (06), wadidowe.net (08)
2023  218cdn.com (01), cocokobe.com (09), elegancepath.online (09), ee131.cc (11)
2024  217cdn.com (06), m2gnkr.com (07), cldfvn.com (11)
2025  04-30 skr004/skr005.cc (AliDNS relay layer)
      09-18 218yc.com hub .... 10-28 vir888.net relaunch ... 12-22 2182999.com
2026  07-24 213 pool bulk-registered + 213.com moved onto operator CF
      09-15 H5 doors 0069-71 deployed same-day · 09-17 doors 0072-74 live
```

---

## 5. Takedown surface (who to hit)

| Layer | Targets | Channels |
|---|---|---|
| Apex domains | **218.com** (GoDaddy), **213.com** (Gname) | registrar abuse |
| Hub + lines | 218yc.com, 2182999/3111/3666/5666.com, 218920.com (GoDaddy) | GoDaddy legalportal |
| Platform | vir888.net (Cloudflare Registrar), vir999.net, vir888.com, bb-in555.com | registrars |
| CDN/DNS | cldfvn.com (Name.com), 218cdn/217cdn (GoDaddy), all CF accounts (clint/tess, marlowe/randy, henry/kami, clyde/phoenix, razvan/ziggy, adam/edna, dan/rosemary) | abuse.cloudflare.com |
| Rotation | wadidowe.net, airegioncare.com, elegancepath.online (GoDaddy/Name.com + AWS) | registrars + AWS abuse |
| 213 pool | 2138051-59.cc, 3128060.cc, 213h5tz*.cc, 213h5*.cc, skr004/005.cc (Gname + AliDNS) | Gname abuse + Alibaba |
| Origin hosts | Vultr (45.77.28.136), WoodsDale (146.88.161.34, 103.241.x), Cnservers (185.186.146.156), xTom (103.53.80.225), GCP (34.36.138.75, 34.54.245.238) | provider abuse |

**Key evidence artifacts on disk:** `~/Desktop/mirror-213-com/`, `~/Desktop/mirror-218yc-com/`, `~/Documents/casino-recon/` (decrypted entrance_init.json/lang/config, recon_all.json, scripts), `~/Documents/prompts/casino-213-218-capture-prompt.md`, `~/Desktop/218-takedown-kit.md`, `~/Desktop/218-com-abuse-report.md`.

**Caveats:** 218yc.com content can't be pulled by curl (TLS-fingerprint gate) — content verified via backup lines instead. Domains rotate weekly — re-verify with dig before relying on any address in this report.

## 6. Admin / backoffice surfaces (probed 2026-09-17)

### 218 network — agent backoffice FOUND
- **`https://ag.218920.com`** — agent portal (CNAME ag-dj8886.ld0088cne.com → GCP 34.54.245.238)
  - `/` = frameset "Welcome" → `/user/login` → `<script>top.window.location='/vi/'</script>`
  - **`/vi/` = Vue 3 + Element Plus casino-management SPA** (v3/js/index.BwQvMKi2.js + plugins-core)
  - API base **`/paa/api/`** — live probe leaked K8s pod name: **`agent-cli-node-api-6cdbcb49bc-6lzhv`** (Node.js API in Kubernetes)
  - Panel modules (from SPA JS): member bet-statistics + commission search + level management + points records, cash/bonus + winner-list, **domain IP whitelist** (`/domain/ip_white_list/index`, `/ip/whitelist/index`), **login codes** (`/domain/login_code`), deposit/login structure reports, **2FA + device binding** (`/domain/two_factor_authentication/*`, `/login_verify/*`), sub-accounts, push center (`/push_center/list`), exports, `/paa/api/hall/redirect`
  - New backend domains: `iheil0m.uy1gqb6i.com` (CloudFront, Amazon Registrar **2026-01-08**), `tutorial.bc9qk72ce.com` (Next.js tutorial site, Name.com 2023-06-08), `socket.dudufor.com` (push, 103.18.175.15), config buckets: Tencent COS (1304426969, Chongqing+Guangzhou), Kingsoft KS3 (Guangzhou+Shanghai), S3 ap-northeast-1 (bbin-tutorial-frontend)
- **`ag.vir999.net`** → GCP 34.102.186.231, HTTP 403 (TLS-fingerprint gate — same panel family on the platform domain)
- `admin.2182999.com` → 308 → :9900 → "SubDomain Not Exist!! [90008]" — no panel
- Player app (`2182999.com:9900/web`) → `/admin`, `/entrance/admin` etc = clean **404** — no admin on player side

### 213 network — NO exposed admin (verified negative)
- `admin.213001.cc` / `ag.213001.cc` / `/admin` / `/manager` / `/webadmin` / `/phpmyadmin` … on door + H5 hosts → **catch-all door page (9027 B 欢迎回家)** — wildcard subdomains, not panels
- `gw.gwpg.cc` (SDK gateway): Spring-Boot-style JSON 404s (`{"code":404,"msg":"404 NOT_FOUND \"No static resource admin.\""}`) — merchant backend is a **Java/Spring Boot** service in K8s cluster "ccgame"; admin not publicly exposed
- Agent recruitment = agentName=ZYM affiliate + 97客服 219wy3sj35 chat; merchant FNQ2

## 7. Extended recon follow-up (2026-09-17, second pass)

- **CT-log subdomain discovery (crt.sh) — ops stack exposed:**
  - `kibana.vir999.net` / `prom.vir999.net` / `monitor.vir999.net` → **35.227.211.185 (Google Cloud)** — operator runs Elasticsearch Kibana + Prometheus monitoring; 443 returns 403 (gated), 5601/9090 firewalled
  - `hall-ccd.vir999.net` → **34.49.193.54 (Google Cloud)** — game-hall/CDN role; connection refused
  - `vir999.net` TXT: `google-site-verification=vCyU5l1voQMZEHhYIgnjLhAn3vTdwrSj7C3RXwaS0n4` (operator's Google Search Console token = account fingerprint); 218.com TXT: `"dc"`
- **213 door pool = wildcard DNS confirmed**: ANY random 8-char subdomain on 2138051.cc resolves → `*.skr005.cc` → `cdn.skr005.cc` → origin. **New origin IPs**: 186.240.219.10, 186.240.239.8/.10 (all Iens Singapore geo — pool expanded beyond 186.240.215.18/.47)
- **213h5009.cc now live** (HTTP 200, was 000 earlier) — fake-browser farm fully deployed
- **H5 pool drift/decay**: h5.e111.cc → 208.98.40.39 (Sharktech Chicago); h5.e113.cc → 39.106.20.134 (Alibaba Beijing) serving unrelated "旅拍世界" page — SDK still lists them but they no longer serve casino content
- `/web/api.php` fallback → 404 (only `/entrance/api` exists); masked server header `CK6u06Vu4`
- m2gnkr.com = nginx empty 200 stub · bd742.com = Cloudflare 3-byte stub · :8080 relay with cookie jar → no session unlock (49-byte body)
- Wayback CDX: rate-limited (429) from this IP on 2026-09-17 — retry later for snapshot inventory
