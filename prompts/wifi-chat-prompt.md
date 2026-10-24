# WiFi Chat

**Category:** Software & Apps · **Status:** Done

Anonymous chat that works anywhere — FastAPI + WebSocket behind an SSH reverse tunnel, so friends on any network join via a short da.gd link. Shares any file up to 50MB and shows the host each device's type, brand, OS and browser.

**Stack / Tools:** FastAPI, WebSocket, localhost.run, da.gd, python-multipart

**Build path:**
- V1 — LAN text chat.
- V2 — Internet tunnel + short links.
- V3 — File sharing + device detection.
- V4 — Instant blank on host-leave.

**Location:** `~/Desktop/wifi-chat/`

Anonymous chat where Isaac is always the host. Anyone anywhere joins through a short link — no same-WiFi requirement (the school WiFi blocks device-to-device, so the launcher spins up an SSH reverse tunnel through localhost.run and shortens the `.lhr.life` URL with da.gd using unambiguous characters only).

## How it works
- `launcher.py` starts uvicorn, opens the tunnel, fetches a short URL, pops a dialog, opens the browser.
- `server/main.py` — FastAPI app: `/health`, `/link`, `/upload`, WebSocket `/ws`. Host claims with a secret `host_token` from the URL; host sees the 👥 admin panel.
- `server/chat_manager.py` — `ChatUser` dataclass + `user-agents` library detects device type/brand/OS/browser (iPhone, Android Phone, Mac, Windows…).
- `client/index.html` — single-file HTML5 client, no build step.

## Key decisions
- Host detection via secret URL token (not IP) — the host opens the LAN link, so IP-matching broke.
- `.command` launcher (not AppleScript `.app`) — the `.app` silently failed to open Terminal.
- da.gd is the only shortener that accepts `.lhr.life`; custom unambiguous codes avoid 0/1/I/l/O confusion.
- File sharing: `UploadFile` POST to `/upload`, then a `file_share` WebSocket broadcast. MIME field is named `mime` (not `type`) because `type` collides with the message-type field.
- Host-leave: grace period 0 → instant `chat_ended` broadcast → client hides the whole app and shows a blank white screen.

## Pitfalls
- `python-multipart` must be installed or `/upload` throws `RuntimeError: Form data requires "python-multipart"`.
- File MIME must NOT reuse the `type` key in the WS payload.
- Tunnel dies when the Mac sleeps; the launcher re-runs are cheap.
