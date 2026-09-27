# Link Compressor — isaac1804.com/s/

A self-hosted URL shortener that lives on my own domain: paste a long link, get a tiny
`https://isaac1804.com/s/xxxxx` back. Built as the big sibling of the browser-only
**a1d2.org Link Compressor** — that one only rewrites the link, this one actually *hosts* it,
so the short link keeps working forever and tells me how many times it was opened.

## Live
- App: https://isaac1804.com/tools/link-compressor/
- Backend: https://isaac1804.com/api/links (Cloudflare Worker `isaac-links` + KV `LINKS`)
- Example short link: https://isaac1804.com/s/rev

## Features
- **Compress the link itself** — strips tracking junk (`utm_*`, `fbclid`, `gclid`, `igshid`, `si`,
  `spm`, `mc_cid` …) before storing, and reports which parameters it removed. Signed URLs
  (`X-Amz-Signature`, `token`, `expires`) are left untouched so download links never break.
- **Real short links** — 5-character codes from a 31-character alphabet with no `0 O 1 l i`,
  so a code survives being read out loud or typed from a screen. Custom names available.
- **Bulk mode** — paste one link per line (or a comma-separated list) and it compresses them
  all, with a live "was 214 chars → 33 chars · 85% smaller · saved 181 characters" readout per link.
- **QR codes** — generated in the page (inline library, works offline), downloadable as PNG.
- **Click counting + tracking** — every hit on `/s/<code>` increments a counter in KV *and* logs who
  clicked: IP, city/country, ISP, device and which page they came from. Every creation logs the same
  about whoever made it.
- **Only I can see the logs** — the per-link log and the combined activity feed both require the admin
  password; anyone else gets a 401. The password (🔒 Admin box at the top of the page) also removes the
  rate limit, so with it there is no hourly cap on making links.
- **Everyone else can only make links** — a visitor can compress any link and open it; deleting,
  custom names, the list and the logs are all behind the password.
- **History** — searchable, exportable as JSON, kept in `localStorage`; with the admin token it
  merges with every link created anywhere.
- **No duplicates** — compressing the same URL twice hands back the code it already has.
- **Not an open redirect in practice** — anyone may compress any link (that is the point: it is meant
  to be usable without me), but creation is rate limited to 200 links per IP per hour and only
  `http(s)` targets are accepted, so it cannot be turned into a spam redirector. The admin token
  (kept in `~/.isaac-links-token`, never in the page source) adds custom names, deleting and the
  global list.

## Stack
Cloudflare Worker (routes on `isaac1804.com/s/*`, `/api/links*`, `/api/shorten`, `/api/stats`) +
Workers KV, deployed with `wrangler`. Front end is one self-contained HTML page on Cloudflare
Pages — no framework, no build step. Repo: `~/Documents/projects/apps/isaac-links/`
(`deploy.sh`), page source: `~/Desktop/homepage-deploy/tools/link-compressor/`.

## API
```
POST   /api/links           {"url":"…","slug":"optional","clean":true}  -> {short, slug, url, cleaned:[…]}
GET    /api/links           (token) every link + click counts
GET    /api/stats           totals + top links
DELETE /api/links/<code>    (token)
GET    /s/<code>            302 to the target, counts a click
```
Token goes in an `X-Link-Token` header (or `?token=`).
