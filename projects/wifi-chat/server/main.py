"""
WiFi Chat Room Server — anonymous local network chat with device detection.
"""
import asyncio
import json
import secrets
import socket
import uuid
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, UploadFile, File
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from server.chat_manager import ChatManager

CLIENT_DIR = Path(__file__).resolve().parent.parent / "client"
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"

chat = ChatManager()

# Track all connected websockets
connections: dict[str, WebSocket] = {}

# Host tracking for disconnect detection
host_connected = False
host_grace_timer = None
HOST_GRACE_SECONDS = 0  # End chat instantly when host leaves

# Host token — generated at startup, shared with launcher
HOST_TOKEN = secrets.token_urlsafe(16)
LOCAL_IP = ""


def get_local_ip() -> str:
    """Get the local network IP address."""
    global LOCAL_IP
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        LOCAL_IP = s.getsockname()[0]
        s.close()
        return LOCAL_IP
    except Exception:
        return "127.0.0.1"


def is_host_ip(ip: str) -> bool:
    """Check if this IP belongs to the host machine."""
    return ip in ("127.0.0.1", "::1", "localhost", LOCAL_IP)


async def broadcast(message: dict, exclude_session: str | None = None):
    """Send a message to all connected clients."""
    dead = []
    for sid, ws in connections.items():
        if sid == exclude_session:
            continue
        try:
            await ws.send_json(message)
        except Exception:
            dead.append(sid)
    for sid in dead:
        connections.pop(sid, None)
        chat.remove_user(sid)


app = FastAPI(lifespan=None, title="WiFi Chat Room")


@app.get("/")
async def index():
    """Serve the chat client."""
    html_path = CLIENT_DIR / "index.html"
    return HTMLResponse(html_path.read_text())


@app.get("/health")
async def health():
    return {"status": "ok", "users": chat.user_count()}


@app.get("/link")
async def share_link(request: Request):
    """Get the shareable link + host token."""
    ip = get_local_ip()
    port = request.url.port or 9000
    return {
        "link": f"http://{ip}:{port}",
        "host_link": f"http://localhost:{port}?host={HOST_TOKEN}",
        "users": chat.user_count(),
    }


# Ensure upload directory exists
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static uploads
app.mount("/files", StaticFiles(directory=str(UPLOAD_DIR)), name="files")


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file, return its info for sharing."""
    if not file.filename:
        return {"error": "No file"}
    # Limit file size to 50MB
    contents = await file.read()
    if len(contents) > 50 * 1024 * 1024:
        return {"error": "File too large (max 50MB)"}
    # Generate unique filename
    ext = Path(file.filename).suffix.lower()
    safe_name = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_DIR / safe_name
    filepath.write_bytes(contents)
    return {
        "ok": True,
        "name": file.filename,
        "size": len(contents),
        "url": f"/files/{safe_name}",
        "mime": file.content_type or "application/octet-stream",
    }


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    session_id = str(id(ws))
    connections[session_id] = ws

    # Get client info
    headers = ws.headers
    user_agent = headers.get("user-agent", "") or headers.get("User-Agent", "")
    ip = ws.client.host if ws.client else "unknown"

    # Host = localhost IP
    is_host = is_host_ip(ip)

    user = chat.add_user(session_id, ip, user_agent)
    print(f"[CONNECT] ip={ip} device={user.device_type} os={user.os} browser={user.browser} ua={user_agent[:80]}")

    async def notify_host():
        """Send admin user list only to the host."""
        for sid, w in connections.items():
            u = chat.get_user(sid)
            if u and u.is_host:
                try:
                    await w.send_json({
                        "type": "admin_users",
                        "users": chat.user_list_for_admin(),
                    })
                except Exception:
                    pass

    try:
        # Send welcome
        await ws.send_json({
            "type": "welcome",
            "session_id": session_id,
            "user_count": chat.user_count(),
            "is_host": is_host,
            "you": {
                "name": user.public_name(),
                "device_type": user.device_type,
            }
        })

        # Notify everyone about join
        await broadcast({
            "type": "system",
            "text": f"{user.public_name()} joined the chat",
            "user_count": chat.user_count(),
        })

        # Only host gets admin user list
        await notify_host()

        while True:
            data = await ws.receive_json()
            msg_type = data.get("type", "")

            if msg_type == "message":
                text = data.get("text", "").strip()
                if not text or len(text) > 2000:
                    continue
                out = {
                    "type": "message",
                    "from": user.public_name(),
                    "from_session": session_id,
                    "text": text,
                }
                await broadcast(out)

            elif msg_type == "set_name":
                name = data.get("name", "").strip()
                if len(name) <= 30:
                    old_name = user.public_name()
                    chat.set_name(session_id, name if name else "")
                    new_name = user.public_name()
                    if old_name != new_name:
                        await broadcast({
                            "type": "system",
                            "text": f"{old_name} → {new_name}",
                            "user_count": chat.user_count(),
                        })
                        await notify_host()

            elif msg_type == "claim_host":
                # Client sends host token to claim host status
                token = data.get("token", "")
                if token == HOST_TOKEN:
                    global host_connected, host_grace_timer
                    is_host = True
                    user.is_host = True
                    host_connected = True
                    # Cancel any pending grace timer
                    if host_grace_timer:
                        host_grace_timer.cancel()
                        host_grace_timer = None
                        # Tell everyone host is back
                        await broadcast({
                            "type": "host_returned",
                            "user_count": chat.user_count(),
                        })
                    await ws.send_json({"type": "host_granted"})
                    await notify_host()

            elif msg_type == "ping":
                await ws.send_json({"type": "pong"})

            elif msg_type == "file_share":
                # Relay file share to all clients
                await broadcast({
                    "type": "file_share",
                    "from": user.public_name(),
                    "from_session": session_id,
                    "name": data.get("name", "file"),
                    "size": data.get("size", 0),
                    "url": data.get("url", ""),
                    "mime": data.get("mime", ""),
                })

            elif msg_type == "admin_refresh":
                if is_host:
                    await ws.send_json({
                        "type": "admin_users",
                        "users": chat.user_list_for_admin(),
                    })

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        connections.pop(session_id, None)
        was_host = chat.get_user(session_id)
        was_host_flag = was_host and was_host.is_host
        chat.remove_user(session_id)

        await broadcast({
            "type": "system",
            "text": f"{user.public_name()} left the chat",
            "user_count": chat.user_count(),
        })
        await notify_host()

        # Host disconnect — start grace period
        if was_host_flag:
            host_connected = False
            _conns = connections
            _chat = chat

            async def end_chat():
                global host_grace_timer
                await asyncio.sleep(HOST_GRACE_SECONDS)
                if not host_connected:
                    msg = {"type": "chat_ended", "text": "Host left — chat has ended."}
                    dead = []
                    for sid, w in list(_conns.items()):
                        try:
                            await w.send_json(msg)
                        except Exception:
                            dead.append(sid)
                    for sid in dead:
                        _conns.pop(sid, None)
                        _chat.remove_user(sid)
                host_grace_timer = None

            host_grace_timer = asyncio.create_task(end_chat())
