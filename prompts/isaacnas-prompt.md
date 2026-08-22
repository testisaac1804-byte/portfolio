# IsaacNAS — Personal Cloud

Password-protected personal cloud file server. Drop files in `~/NAS/` and they're instantly accessible from any device.

## Stack
- **Backend**: FastAPI + uvicorn (Python 3.14)
- **Auth**: Session-based cookie auth
- **UI**: Single-page dark-themed file browser (HTML/CSS/JS inline)
- **Tunnel**: localhost.run SSH reverse proxy for internet access
- **Redirect**: GitHub Pages meta-refresh → da.gd shortlink
- **Daemon**: macOS LaunchAgent (com.isaac.nas), auto-starts on login

## Features
- Password login
- Directory browsing with breadcrumbs
- File download (direct link)
- File upload (multipart form)
- Create folders
- Auto-start on login via LaunchAgent
- SSH tunnel for internet access
- da.gd/isaacnas4 shortlink

## Key code
- `server.py` — FastAPI app with all routes
- `launcher.py` — Starts server + tunnel + updates GitHub Pages redirect
- `run-server.sh` — Shell wrapper that strips PYTHONPATH

## How it works
1. LaunchAgent starts `run-server.sh` on login
2. Server binds to port 8777
3. SSH tunnel exposes port to internet via localhost.run
4. GitHub Pages redirect page updated with new tunnel URL
5. da.gd/isaacnas4 → GitHub Pages → tunnel → server