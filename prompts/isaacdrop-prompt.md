# IsaacDrop — Self-Hosted File Sharing (Google-Drive-Style + Passwords)

**Stack:** Python FastAPI + uvicorn, single-file dark-theme HTML SPA, cloudflared tunnel + launchd, da.gd + GitHub Pages redirect. Lives at `~/Documents/projects/apps/IsaacDrop/`, port **8585**.

## How it works
- Single `server/main.py` (~1100 lines): JSON metadata (`data/files.json`), blobs in `data/storage/`, users in `data/users.json`. Stateless HMAC tokens: file-unlock tokens (6h), login tokens (7d, `X-Auth-Token`).
- `run-servers.sh` (launchd agent `com.isaac.isaacdrop`, KeepAlive + RunAtLoad): boots uvicorn + cloudflared, extracts the trycloudflare URL, re-points `~/Desktop/portfolio-deploy/camdrive.html` (GitHub Pages redirect) to it, commits + pushes. Killed server/tunnel → loop exits → launchd restarts the pair with a fresh URL. `caffeinate -s` keeps the Mac awake on AC.
- Public chain: `da.gd/isaacdrop` → `https://isaac1804.com/portfolio/camdrive.html` → tunnel → local server. (da.gd blacklists trycloudflare.com.)

## Features
- **Accounts:** register/login (first account = admin ⭐), guests browse/upload/download. Every file/folder has an `owner`; **only owner or admin can rename/move/trash/restore/purge/protect/restore-version/create folders**; uploads over a same-name file require ownership (409 otherwise). Admin Users panel: promote/demote (last-admin + self-demote guards), reset password, delete user. Guests get a delete-link for each upload.
- **Drive:** folders + breadcrumbs, trash/restore, star (per-user), search, sort, multi-select ZIP download (incl. folders), version history (re-upload same name, restore any version), inline previews (image/video/audio/PDF/text), expiry per file.
- **Protection:** per-file AND per-folder passwords (name hidden until unlocked; folder gate blocks browse/upload/download; token scoped to the gating folder). Optional expiry 1h/1d/7d/30d/never.
- **Admin console:** account chip bottom-left → Login/Register/Account/Logout; ⭐ Admins-only 👥 Users button.

## Key details
- Token payload: `{scope}.{expiry}.{hmac-sha256}` with `data/secret.key` (survives restarts).
- Upload streams to disk in 1MB chunks (2GB cap via `MAX_UPLOAD_MB`).
- Frontend `api()` wrapper attaches `X-Auth-Token`, auto-opens the Login modal on 403 `{"auth":"login_required"}`, toasts on `{"forbidden"}` (not owner) / `{"admin"}`.
- 101 automated tests (curl API + Playwright UI) all pass — see session notes for the suites.

## Usage
- Start: `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.isaac.isaacdrop.plist` (already installed) — or double-click `IsaacDrop-AutoStart.command` / stop with `IsaacDrop-Stop.command`.
- Manual: `.venv/bin/python launcher.py` (LAN) / `launcher.py --public` (tunnel).
- Logs: `~/Library/Logs/IsaacDrop/{server,tunnel,agent,redirect}.log`.
- Register the first account on the page to become admin.