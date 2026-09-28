# School Shield

One-click stealth mode for using a laptop on school WiFi: DNS-over-HTTPS proxy + a
macOS `pf` firewall kill switch + a live dashboard.

```bash
sudo python shield.py on          # enable protection
sudo python shield.py off         # disable
python shield.py status           # show what's currently active
python shield.py dashboard        # web dashboard on :8777
```

## How it works

| File | Lines | Role |
|---|---|---|
| `shield.py` | 208 | CLI entry point — `on` / `off` / `status` / `dashboard` |
| `detector.py` | 132 | Detects the current WiFi network and DNS, and whether it's a school network |
| `doh_proxy.py` | 143 | DNS-over-HTTPS proxy: takes plain DNS queries and forwards them to Cloudflare over HTTPS, so the local network can't read which domains are being looked up |
| `firewall.py` | 130 | Kill switch built on macOS `pf` (packet filter) — writes a rule set to a temp file and loads it, so traffic can't leak out unproxied |
| `dashboard.py` | 144 | FastAPI app + single-page dashboard showing network, DNS and firewall state |

`main.py` is the uv/pyproject stub (6 lines); the real entry point is `shield.py`, which
calls into `detector.set_dns_servers(["127.0.0.1"])` to point the machine at the local
DoH proxy and into `firewall` for the `pf` rules.

## Requirements

Python ≥ 3.11, macOS, root for `on`/`off` (the firewall and DNS changes need it).
Dependencies (`pyproject.toml`): click, dnspython, fastapi, httpx, uvicorn.

## Notes

* DNS is redirected by pointing the active network service at the local DoH proxy on
  loopback, so the change is per-network-service and survives sleep but not a manual
  network change — re-run `status` (or `on`) after switching WiFi.
* The `pf` kill switch is intentionally simple: it blocks direct DNS (port 53) so a
  failing proxy surfaces as "no DNS" rather than a silent leak.
* This is a personal privacy tool for my own laptop. Don't run it on a network you
  don't control the consequences of.
