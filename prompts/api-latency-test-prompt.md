# API Endpoint Latency Tester — build spec / how it works

**Live:** https://isaac1804.com/portfolio/demos/api-latency-test.html
**Source of the copy:** `http://117.72.62.20/` — an API relay's own `API地址延迟测试` page
**Generator:** `~/scripts/make-api-latency-test.py` (re-run it to regenerate the page from a fresh dump)

---

## What it is

A browser-side stopwatch for API endpoints. Press **开始测试** and every address in the
list is probed three times; the cards then re-sort from fastest to slowest with 1/2/3
rank badges. Nothing is sent to a server of ours — every visitor measures the network
between *their* browser and each endpoint, so two people in different cities get
different rankings.

## How it measures (and why it works cross-origin)

1. **`performance.now()` on both sides of a fetch** — high-resolution wall clock in ms.
   `t1 - t0` is the full round trip: DNS lookup + TCP + TLS + server processing +
   first byte of the response.
2. **`mode: 'no-cors'`** is the load-bearing trick. A normal `fetch` to another origin
   needs the server to send `Access-Control-Allow-Origin` *and* triggers a preflight
   `OPTIONS` request, which would pollute the timing and fail on endpoints that don't
   speak CORS. With `no-cors` the request is sent as a plain GET and the response
   arrives **opaque**: JS can read neither the body nor the status (it sees `status 0`).
   The original author never needed either — only the moment the promise resolves.
   Bonus: a relay API endpoint will usually reject a browser request without an API key,
   but a rejected (401/405) response still resolves, so the timing is still valid.
3. **The measured URL is a cheap one.** Every entry carries a `testUrl` pointing at a
   free path (`/health`, a 212-byte `cdn-cgi/trace`, a DoH resolve) — never the paid
   chat endpoint. Latency, not throughput, and no token quota is spent.
4. **`AbortController` + 5 s timeout.** A dead endpoint aborts → the sample becomes
   `null` → the card prints 超时 (timeout) instead of hanging the page.
5. **Three samples, 100 ms apart, averaged.** One lucky packet can't win the ranking;
   the loop is `for j < 3`, and the samples are averaged before rendering.
6. **`renderResults()` sorts and paints.** Numbers first (ascending), everything else
   last; `rank-1/2/3` CSS classes colour the podium. Each card also has 复制 buttons
   that copy the OpenAI/Anthropic base URLs for pasting into config.

## What was changed for this copy (everything else is verbatim)

The original is served over plain **HTTP**, so it can probe its own `http://…:11223`
mirrors. On an `https://` site the browser refuses those outright — **mixed content** —
and a naive copy would silently report every mirror as a timeout. So:

* **`mixedContentBlocked()` guard** — an `http://` address on an `https://` page is
  detected before the fetch and rendered as `⛔ 需 http 页面 (mixed content)`, which is
  the honest answer: no packet left the machine.
* **4 HTTPS addresses appended** to the original 3, so the tool does real work on the
  public site: Cloudflare edge, Google DoH, AliDNS, GitHub API.
* **Banner** states which mode the page is in (all reachable vs HTTP-only blocked).
* **"How this works / 工作原理"** panel at the bottom of the page.
* Empty endpoint rows are hidden for entries that have no Anthropic route.

Open the same file from disk (`file://`) or serve it over `http://` and all 7 addresses
are measurable, because the mixed-content rule only applies to `https://` documents.

## The relay mirrors, measured from Hong Kong (Sept 2026)

| Address | Where | `/health` | Verdict |
|---|---|---|---|
| 地址9 `64.90.19.58:11223` | Hong Kong (NetLab Global) | ~20–40 ms | fastest by ~25× |
| 地址8 `43.155.171.170:11223` | Seoul (Tencent Cloud) | ~0.3–0.7 s | usable |
| 地址7 `103.236.76.197:11223` | Beijing (CHINANET Shaanxi) | ~1.0–1.4 s | slowest from HK, despite the 「国内优先」 label |

All three are **plain HTTP on port 11223** — no TLS. Keys and prompts cross the network
in cleartext, so the relay is only for throwaway traffic, and its API keys are 1-day
leases (a dead key answers `401 {"error":{"message":"API key 已过期…"}}`).

## Rebuild

```bash
# 1. take a fresh dump of the relay's page
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
     http://117.72.62.20/ -o /tmp/ip_page.html
# 2. regenerate the portfolio copy (surgical edits + guards)
python3 ~/scripts/make-api-latency-test.py
# 3. verify in a real browser across file://, http:// and https://
python3 /tmp/verify_browser.py
```

## Pitfalls found while building this

* DoH endpoints need `accept: application/dns-json`; without it Cloudflare's
  `dns-query` answers **405** (timing still works, console noise doesn't). Use
  `cdn-cgi/trace` or `/resolve` endpoints for a bare-GET probe.
* `dns.quad9.net:5053` is unreachable from Hong Kong — 8 s timeout, shows as 超时.
* In `no-cors` mode Chrome logs `net::ERR_ABORTED` for every probe; that is the
  *expected* opaque-response behaviour, not a failure.
* A placeholder put inside a JS template literal must not contain `</script>` — it
  closes the outer tag and kills the whole page script.
