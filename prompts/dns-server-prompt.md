# DNS Server

Built a custom recursive DNS server that people on the WiFi can set as their DNS resolver.

## What it does
- Listens on port 53 (UDP) — the standard DNS port
- Parses incoming DNS queries using dnslib
- Forwards to Cloudflare (1.1.1.1) as upstream
- Caches responses with TTL respect
- Live web dashboard on port 8055 showing all queries
- Optional ad/tracker blocking via blocklist
- Cache persists to disk between restarts

## How it works
```
Client → Your DNS (192.168.1.251:53) → Cloudflare 1.1.1.1 → Answer cached → Client
```

## Tech stack
- Python 3
- dnslib (DNS wire format parsing)
- HTTP server (dashboard)
- Threading (concurrent queries)
- JSON (cache persistence)

## Features
- 🌐 Forwarded queries go to Cloudflare
- 📦 Cached queries return instantly (no upstream call)
- 🚫 Blocked domains return NXDOMAIN
- 📊 Live dashboard shows all queries in real-time

## Usage
```bash
# Full DNS server (needs sudo for port 53):
sudo python3 dns_server.py

# Test without sudo:
python3 dns_server.py --port 5354
```

Other devices on the network set their DNS to `192.168.1.251` to use it.