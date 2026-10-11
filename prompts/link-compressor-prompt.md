# Link Compressor — isaac1804.com/s/

**Category:** Software & Apps · **Status:** Done

A self-hosted URL shortener on my own domain: paste a long link, get a tiny `https://isaac1804.com/s/xxxxx` back that keeps working and tells me who opened it. (The browser-only a1d2.org Link Compressor only rewrites links; this one actually hosts them.)

**Stack / Tools:** Cloudflare Worker + Workers KV + Routes · vanilla HTML/CSS/JS single page on Pages · wrangler · Playwright (headless e2e) · QR generated in-page (no CDN)

**Build path:**
- **V1** — Worker + KV shortener routed onto isaac1804.com: 5-char codes from an alphabet with no `0 O 1 l i` (survives being read aloud), 302 redirects, click counting, same-URL reuse, admin token for custom names + deletes.
- **V1.1** — compressing opened to everyone (it has to work for whoever I send it to); abuse guard became 200 links/IP/hour + `http(s)`-only targets.
- **V1.2** — tracking: every link records who created it, every click records who opened it (IP, city/country, ISP, device, referer) — per-link log + combined activity feed, password-only.
- **V1.3** — fully admin controlled: 🔒 password box at the top unlocks everything; visitors can only make and follow links. Delete fixed (it was rendered for everyone and only printed an error when locked).

**Location:** live `https://isaac1804.com/tools/link-compressor/` · repo `~/Documents/projects/apps/isaac-links/` (`deploy.sh`) · page source `~/Desktop/homepage-deploy/tools/link-compressor/`

**Notes**
- **Compresses the link itself first**: strips `utm_*`/`fbclid`/`gclid`/`igshid`/`si`/`spm`/`mc_cid`… and reports what it removed; signed-URL params (`X-Amz-Signature`, `token`, `expires`) are left alone so download links never break.
- **Two credentials accepted**, checked constant-time, sent as the `X-Link-Token` header **only** (query strings are refused so a secret can never leak into browser history, edge logs or Referer): the admin password (`LINKS_PASSWORD` Worker secret — current value in `apps/isaac-links/ADMIN-CREDENTIALS-2026-10.txt`, mode 600, never published) and the long random `LINKS_TOKEN` (`~/.isaac-links-token`). 5 wrong tries per IP ⇒ 15-minute lockout.
- **Access model** — visitor: create + follow, nothing else (401 on list/log/activity/delete, custom names 403). Password: logs, delete, custom names, global list, bulk, QR, **no hourly cap** (rate limit is skipped when authenticated).
- **Pitfall** — Cloudflare route patterns are matched *including the query string*: `/api/activity` does not match `/api/activity?limit=5` (the request falls through to Pages' 404). Every pattern ends in `*`.
- **Pitfall** — a button that can only fail reads as broken. Render admin-only buttons only when unlocked; locked shows one 🔒 button that focuses the password field, and any 401 mid-session re-locks + re-asks.
- Verified live by `test-e2e.py` (46 checks) and `test-delete-admin.py` (lock/wrong-password/unlock/delete) — headless Playwright against the real site.
