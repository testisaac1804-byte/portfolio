#!/usr/bin/env python3
"""
Offline WiFi Chat v2 — Encrypted LAN chat. No internet. Firewall-proof.

Features:
  • TLS/SSL encryption — self-signed cert, DPI can't read traffic
  • Room password — only people with the code can join
  • Stealth mode — port 443 + TLS, looks like regular HTTPS
  • Typing indicators, emoji reactions, message history
  • Online user list, message deletion, chat export

Usage:
  python3 offline_chat.py                          # HTTP on :9001
  python3 offline_chat.py --tls                    # HTTPS on :9001 (encrypted)
  python3 offline_chat.py --password letmein        # Room password
  python3 offline_chat.py --stealth                # Port 443 + TLS + password
  python3 offline_chat.py --port 8443 --tls         # Custom port + TLS

The old offline_chat.py is kept as-is. This is a separate file.
"""

import argparse
import base64
import hashlib
import http.server
import json
import os
import random
import re
import secrets
import select
import shutil
import socket
import ssl
import subprocess
import sys
import tempfile
import threading
import time
import uuid
import urllib.parse
from collections import deque
from typing import Optional
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from socketserver import ThreadingMixIn

# ── Config ──────────────────────────────────────────────────────────────
ARGS = None
UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
MAX_FILE_SIZE = 50 * 1024 * 1024
HOST_TOKEN = secrets.token_urlsafe(16)
ROOM_PASSWORD = ""
LOCAL_IP = ""
CERT_FILE = ""
KEY_FILE = ""

# ── User & Message Store ────────────────────────────────────────────────
users: dict[str, dict] = {}
sse_clients: dict[str, list] = {}
message_history: deque = deque(maxlen=200)  # (msg_id, timestamp, event_dict)
next_msg_id = 0


def get_local_ip() -> str:
    """Discover LAN IP without any internet access. Multiple zero-network fallbacks."""
    global LOCAL_IP

    # Method 1: UDP connect trick (does NOT send data — just checks routing table)
    # Works on WiFi without internet as long as the interface has an IP.
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        LOCAL_IP = s.getsockname()[0]
        s.close()
        return LOCAL_IP
    except Exception:
        pass

    # Method 2: Iterate network interfaces (zero network I/O)
    try:
        for name, idx in socket.if_nameindex():
            if name.startswith("lo") or name.startswith("utun"):
                continue
            # Get IP for this interface via a dummy bind
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.bind((socket.if_indextoname(idx), 0))
                ip = s.getsockname()[0]
                s.close()
                if ip and ip != "0.0.0.0":
                    LOCAL_IP = ip
                    return LOCAL_IP
            except Exception:
                continue
    except Exception:
        pass

    # Method 3: gethostbyname (may hit /etc/hosts, no network needed)
    try:
        hostname = socket.gethostname()
        LOCAL_IP = socket.gethostbyname(hostname)
        if LOCAL_IP != "127.0.0.1":
            return LOCAL_IP
    except Exception:
        pass

    return "127.0.0.1"


def parse_user_agent(ua_str: str) -> dict:
    ua = (ua_str or "").lower()
    info = {"device_type": "unknown", "device_brand": "", "os": "Unknown", "browser": "Unknown"}

    if "iphone" in ua or ("ios" in ua and "mac" not in ua):
        info["os"] = "iOS"; info["device_type"] = "iPhone"; info["device_brand"] = "Apple"
    elif "ipad" in ua:
        info["os"] = "iPadOS"; info["device_type"] = "iPad"; info["device_brand"] = "Apple"
    elif "android" in ua:
        info["os"] = "Android"; info["device_type"] = "Android Phone"
        if "tablet" in ua: info["device_type"] = "Android Tablet"
        m = re.search(r';\s*([a-z]+)\s+build/', ua)
        info["device_brand"] = m.group(1).title() if m else "Android"
        m = re.search(r'android\s+([\d.]+)', ua)
        if m: info["os"] = f"Android {m.group(1)}"
    elif "mac os x" in ua or "macintosh" in ua:
        info["os"] = "macOS"; info["device_type"] = "Mac"; info["device_brand"] = "Apple"
    elif "windows" in ua:
        info["os"] = "Windows"; info["device_type"] = "Windows"; info["device_brand"] = "Microsoft"
    elif "linux" in ua and "android" not in ua:
        info["os"] = "Linux"; info["device_type"] = "Linux"; info["device_brand"] = "Linux"

    if "edg/" in ua or "edge/" in ua: info["browser"] = "Edge"
    elif "chrome/" in ua and "safari/" in ua and "crios" not in ua: info["browser"] = "Chrome"
    elif "crios/" in ua: info["browser"] = "Chrome"
    elif "firefox/" in ua: info["browser"] = "Firefox"
    elif "safari/" in ua and "chrome" not in ua: info["browser"] = "Safari"
    return info


def generate_self_signed_cert() -> tuple[str, str]:
    """Generate self-signed cert. Tries openssl, falls back to pure Python.
    Works on macOS, Linux, Windows — zero external dependencies."""
    cert_dir = Path(tempfile.gettempdir()) / "offline-chat-certs"
    cert_dir.mkdir(exist_ok=True)
    cert_file = cert_dir / "cert.pem"
    key_file = cert_dir / "key.pem"

    if cert_file.exists() and key_file.exists():
        return str(cert_file), str(key_file)

    ip = get_local_ip()

    # ── Try openssl first (fast, standard on macOS/Linux) ──
    openssl = shutil.which("openssl")
    if openssl:
        result = subprocess.run([
            openssl, "req", "-x509", "-newkey", "rsa:2048", "-nodes",
            "-keyout", str(key_file), "-out", str(cert_file),
            "-days", "365",
            "-subj", "/CN=OfflineChat/O=LAN/C=XX",
            "-addext", f"subjectAltName=IP:{ip},DNS:localhost",
        ], capture_output=True, timeout=15)
        if result.returncode == 0:
            os.chmod(str(key_file), 0o600)
            return str(cert_file), str(key_file)

    # ── Pure Python fallback (Windows, or no openssl) ──
    cert_pem, key_pem = _pure_python_self_signed_cert(ip)
    cert_file.write_text(cert_pem)
    key_file.write_text(key_pem)
    os.chmod(str(key_file), 0o600)
    return str(cert_file), str(key_file)


# ── Pure Python RSA + X.509 Self-Signed Certificate ────────────────────
# Zero external dependencies. Works on any Python 3.9+ platform.

def _miller_rabin(n: int, k: int = 40) -> bool:
    """Miller-Rabin primality test. k=40 gives < 2^-80 error rate."""
    if n < 2: return False
    if n == 2: return True
    if n % 2 == 0: return False
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1; d //= 2
    for _ in range(k):
        a = random.randrange(2, n - 1)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True


def _random_prime(bits: int) -> int:
    """Generate a random prime of given bit length."""
    while True:
        n = random.getrandbits(bits)
        n |= (1 << (bits - 1)) | 1  # ensure msb=1 and odd
        if _miller_rabin(n):
            return n


def _modinv(a: int, m: int) -> int:
    """Modular multiplicative inverse (Extended Euclidean)."""
    g, x, _ = _egcd(a, m)
    if g != 1:
        raise ValueError("modular inverse does not exist")
    return x % m


def _egcd(a: int, b: int) -> tuple[int, int, int]:
    if a == 0:
        return b, 0, 1
    g, x, y = _egcd(b % a, a)
    return g, y - (b // a) * x, x


def _der_length(length: int) -> bytes:
    """DER encode a length value."""
    if length < 0x80:
        return bytes([length])
    enc = length.to_bytes((length.bit_length() + 7) // 8, 'big')
    return bytes([0x80 | len(enc)]) + enc


def _der_integer(n: int) -> bytes:
    """DER encode an INTEGER."""
    if n == 0:
        return b'\x02\x01\x00'
    b = n.to_bytes((n.bit_length() + 7) // 8, 'big')
    if b[0] & 0x80:
        b = b'\x00' + b
    return b'\x02' + _der_length(len(b)) + b


def _der_sequence(parts: bytes) -> bytes:
    """DER encode a SEQUENCE."""
    return b'\x30' + _der_length(len(parts)) + parts


def _der_bitstring(data: bytes) -> bytes:
    """DER encode a BIT STRING (unused bits = 0)."""
    return b'\x03' + _der_length(len(data) + 1) + b'\x00' + data


def _der_oid(oid: str) -> bytes:
    """DER encode an OID string like '1.2.840.113549.1.1.11'."""
    parts = [int(x) for x in oid.split('.')]
    result = bytes([40 * parts[0] + parts[1]])
    for p in parts[2:]:
        if p < 128:
            result += bytes([p])
        else:
            chunks = []
            while p:
                chunks.append(p & 0x7F)
                p >>= 7
            chunks.reverse()
            for i, c in enumerate(chunks):
                if i < len(chunks) - 1:
                    c |= 0x80
                result += bytes([c])
    return b'\x06' + _der_length(len(result)) + result


def _der_null() -> bytes:
    return b'\x05\x00'


def _der_printable_string(s: str) -> bytes:
    """DER encode a PrintableString."""
    data = s.encode('ascii')
    return b'\x13' + _der_length(len(data)) + data


def _der_utc_time(t: int) -> bytes:
    """DER encode UTCTime (YYMMDDHHMMSSZ)."""
    dt = datetime.fromtimestamp(t, tz=timezone.utc)
    s = dt.strftime('%y%m%d%H%M%SZ')
    return b'\x17' + _der_length(len(s)) + s.encode('ascii')


def _der_set(parts: bytes) -> bytes:
    return b'\x31' + _der_length(len(parts)) + parts


def _der_context_explicit(tag: int, content: bytes) -> bytes:
    return bytes([0xA0 | tag]) + _der_length(len(content)) + content


def _pure_python_self_signed_cert(ip: str) -> tuple[str, str]:
    """Generate RSA-2048 key + self-signed X.509 cert. Pure Python stdlib."""

    # ── 1. Generate RSA 2048-bit key pair ──
    p = _random_prime(1024)
    q = _random_prime(1024)
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 65537
    d = _modinv(e, phi)

    # For CRT (optional, but cleaner)
    dp = d % (p - 1)
    dq = d % (q - 1)
    qinv = _modinv(q, p)

    # ── 2. DER-encode the RSA public key ──
    pubkey_seq = _der_sequence(
        _der_integer(n) + _der_integer(e)
    )
    pubkey_bitstring = _der_bitstring(pubkey_seq)

    # AlgorithmIdentifier: rsaEncryption (1.2.840.113549.1.1.1)
    rsa_oid = _der_oid("1.2.840.113549.1.1.1")
    rsa_alg_id = _der_sequence(rsa_oid + _der_null())
    spki = _der_sequence(rsa_alg_id + pubkey_bitstring)

    # ── 3. Build X.509 Name (issuer & subject) ──
    # CommonName, OrganizationName, CountryName
    cn = _der_set(_der_sequence(
        _der_oid("2.5.4.3") + _der_printable_string("OfflineChat")
    ))
    org = _der_set(_der_sequence(
        _der_oid("2.5.4.10") + _der_printable_string("LAN")
    ))
    country = _der_set(_der_sequence(
        _der_oid("2.5.4.6") + _der_printable_string("XX")
    ))
    name = _der_sequence(country + org + cn)

    # ── 4. Serial number ──
    serial = random.getrandbits(64)

    # ── 5. Validity: 1 year from now ──
    now = int(time.time())
    not_before = now - 86400  # 1 day ago (clock skew)
    not_after = now + 365 * 86400  # 1 year
    validity = _der_sequence(_der_utc_time(not_before) + _der_utc_time(not_after))

    # ── 6. Build TBSCertificate ──
    version = _der_context_explicit(0, _der_integer(2))  # v3
    sha256_oid = _der_oid("2.16.840.1.101.3.4.2.1")       # SHA-256 hash
    sha256_rsa_oid = _der_oid("1.2.840.113549.1.1.11")    # sha256WithRSAEncryption
    sig_alg = _der_sequence(sha256_rsa_oid + _der_null())

    tbs = _der_sequence(
        version +
        _der_integer(serial) +
        sig_alg +
        name +  # issuer
        validity +
        name +  # subject
        spki
    )

    # ── 7. Sign TBSCertificate with SHA-256 + RSA ──
    digest = hashlib.sha256(tbs).digest()

    # DigestInfo ::= SEQUENCE { digestAlgorithm AlgorithmIdentifier, digest OCTET STRING }
    digest_info = _der_sequence(
        _der_sequence(sha256_oid + _der_null()) +
        bytes([0x04, 32]) + digest
    )
    # PKCS#1 v1.5: 0x00 || 0x01 || 0xFF...0xFF || 0x00 || DigestInfo
    k = (n.bit_length() + 7) // 8  # key length in bytes
    ps_len = k - len(digest_info) - 3
    if ps_len < 8:
        raise RuntimeError("RSA key too short for SHA-256 signing")
    padded = b'\x00\x01' + (b'\xff' * ps_len) + b'\x00' + digest_info
    m = int.from_bytes(padded, 'big')

    # RSA sign: s = m^d mod n (using CRT for speed)
    sp = pow(m % p, dp, p)
    sq = pow(m % q, dq, q)
    s = (sp + ((sq - sp) * qinv % q) * p) % n
    sig = s.to_bytes(k, 'big')

    signature = _der_bitstring(sig)

    # ── 8. Assemble final certificate ──
    cert_der = _der_sequence(tbs + sig_alg + signature)

    # ── 9. PEM encode ──
    cert_b64 = base64.b64encode(cert_der).decode('ascii')
    cert_pem = "-----BEGIN CERTIFICATE-----\n"
    for i in range(0, len(cert_b64), 64):
        cert_pem += cert_b64[i:i+64] + "\n"
    cert_pem += "-----END CERTIFICATE-----\n"

    # ── 10. PEM encode private key (PKCS#1 format) ──
    # RSAPrivateKey ::= SEQUENCE { version, modulus, publicExponent, privateExponent,
    #                              prime1, prime2, exponent1, exponent2, coefficient }
    priv_key_der = _der_sequence(
        _der_integer(0) +      # version
        _der_integer(n) +      # modulus
        _der_integer(e) +      # publicExponent
        _der_integer(d) +      # privateExponent
        _der_integer(p) +      # prime1
        _der_integer(q) +      # prime2
        _der_integer(dp) +     # exponent1
        _der_integer(dq) +     # exponent2
        _der_integer(qinv)     # coefficient
    )
    key_b64 = base64.b64encode(priv_key_der).decode('ascii')
    key_pem = "-----BEGIN RSA PRIVATE KEY-----\n"
    for i in range(0, len(key_b64), 64):
        key_pem += key_b64[i:i+64] + "\n"
    key_pem += "-----END RSA PRIVATE KEY-----\n"

    return cert_pem, key_pem


# ── SSE Broadcasting ────────────────────────────────────────────────────
def _push_to_queues(data: bytes, queues: list):
    dead = []
    for q in queues:
        try:
            q.append(data)
        except Exception:
            dead.append(q)
    for q in dead:
        queues.remove(q)


def broadcast_event(event: dict, exclude_session: Optional[str] = None):
    """Push event to all SSE clients, optionally excluding one session."""
    dead_sessions = []
    data = f"data: {json.dumps(event)}\n\n".encode("utf-8")
    for sid, queues in sse_clients.items():
        if sid == exclude_session:
            continue
        _push_to_queues(data, queues)
        if not queues:
            dead_sessions.append(sid)
    for sid in dead_sessions:
        _remove_session(sid)


def broadcast_all(event: dict):
    """Push to EVERYONE including sender (for system events)."""
    dead_sessions = []
    data = f"data: {json.dumps(event)}\n\n".encode("utf-8")
    for sid, queues in sse_clients.items():
        _push_to_queues(data, queues)
        if not queues:
            dead_sessions.append(sid)
    for sid in dead_sessions:
        _remove_session(sid)


def send_to_session(session_id: str, event: dict):
    """Send event to one specific session."""
    for q in sse_clients.get(session_id, []):
        try:
            q.append(f"data: {json.dumps(event)}\n\n".encode("utf-8"))
        except Exception:
            pass


def _remove_session(session_id: str):
    sse_clients.pop(session_id, None)
    if session_id in users:
        name = users[session_id].get("name") or "Anonymous"
        users.pop(session_id, None)
        broadcast_all({
            "type": "system",
            "text": f"{name} left the chat",
            "user_count": len(users),
        })
        notify_admin()
        notify_user_list()


def user_list_public() -> list[dict]:
    return [
        {
            "name": u.get("name") or "Anonymous",
            "device_type": u.get("device_type", "unknown"),
            "device_brand": u.get("device_brand", ""),
            "os": u.get("os", "Unknown"),
            "browser": u.get("browser", "Unknown"),
        }
        for u in users.values()
    ]


def user_list_admin() -> list[dict]:
    return [
        {
            "name": u.get("name") or "Anonymous",
            "device_type": u.get("device_type", "unknown"),
            "device_brand": u.get("device_brand", ""),
            "os": u.get("os", "Unknown"),
            "browser": u.get("browser", "Unknown"),
            "ip": u.get("ip", ""),
            "connected_sec": int(time.time() - u.get("connected_at", time.time())),
            "label": f"{u.get('name') or 'Anonymous'} ({u.get('device_type', 'unknown')})",
        }
        for u in users.values()
    ]


def notify_admin():
    data = f"data: {json.dumps({'type': 'admin_users', 'users': user_list_admin()})}\n\n".encode("utf-8")
    for sid, u in users.items():
        if u.get("is_host"):
            for q in sse_clients.get(sid, []):
                try: q.append(data)
                except Exception: pass


def notify_user_list():
    data = f"data: {json.dumps({'type': 'user_list', 'users': user_list_public()})}\n\n".encode("utf-8")
    for queues in sse_clients.values():
        _push_to_queues(data, queues)


def is_local_ip(ip: str) -> bool:
    return ip in ("127.0.0.1", "::1", "localhost", LOCAL_IP)


# ── HTML ─────────────────────────────────────────────────────────────────
def get_html():
    """Return the chat HTML with runtime config injected."""
    # Precompute dynamic values
    _tls_badge = "<span class='badge enc'>🔒 TLS</span>" if ARGS.tls else ""
    _pw_badge = "<span class='badge lock'>🔑 PW</span>" if ROOM_PASSWORD else ""
    _pwd_overlay_class = "show" if ROOM_PASSWORD else ""
    _auth_ready = "false" if ROOM_PASSWORD else "true"
    _tls_js = "true" if ARGS.tls else "false"
    _has_password = "true" if ROOM_PASSWORD else "false"
    _pw_auth_js = """document.getElementById("password-submit").addEventListener("click",()=>{const pw=$.pwdInput.value.trim();fetch("/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})}).then(r=>r.json()).then(d=>{if(d.ok){authReady=true;$.pwdOverlay.classList.remove("show");connect()}else{$.pwdError.style.display="block";$.pwdInput.value=""}}).catch(()=>{toast("Auth error — is the server running?")})});""" if ROOM_PASSWORD else ""
    _pw_keydown_js = """$.pwdInput.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("password-submit").click()})""" if ROOM_PASSWORD else ""
    _pw_start_if = """if(!authReady){$.pwdOverlay.classList.add("show")}else{""" if ROOM_PASSWORD else ""
    _pw_start_endif = "}" if ROOM_PASSWORD else ""

    html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>Offline Chat</title>
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
:root{{--bg:#0d0d0d;--surface:#1a1a1a;--surface2:#222;--text:#e0e0e0;--text-dim:#888;--accent:#6c8cff;--accent2:#44cc66;--danger:#ff6b6b;--border:#2a2a2a;--system:#555;--font:-apple-system,BlinkMacSystemFont,'SF Pro','Segoe UI',Roboto,sans-serif;--safe-bottom:env(safe-area-inset-bottom,0px)}}
html,body{{height:100%;height:-webkit-fill-available;background:var(--bg);color:var(--text);font-family:var(--font);overflow:hidden;-webkit-tap-highlight-color:transparent}}
#app{{height:100%;display:flex;max-width:1000px;margin:0 auto}}
#sidebar{{display:none;width:240px;background:var(--surface);border-right:1px solid var(--border);flex-shrink:0;flex-direction:column;overflow:hidden}}
#sidebar.show{{display:flex}}
#sidebar h3{{font-size:11px;color:var(--text-dim);padding:12px 12px 6px;text-transform:uppercase;letter-spacing:.5px}}
#sidebar .user-list{{flex:1;overflow-y:auto;padding:0 8px}}
#sidebar .side-user{{display:flex;align-items:center;gap:8px;padding:8px 6px;border-radius:8px;font-size:13px;cursor:default}}
#sidebar .side-user:hover{{background:var(--surface2)}}
#sidebar .side-user .dot2{{width:7px;height:7px;border-radius:50%;background:var(--accent2);flex-shrink:0}}
#sidebar .side-user .typing-dot{{animation:pulse 0.8s infinite}}
@keyframes pulse{{0%,100%{{opacity:0.3}}50%{{opacity:1}}}}
#main{{flex:1;display:flex;flex-direction:column;min-width:0}}
#header{{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0}}
#header .title{{font-size:15px;font-weight:700}}
#header .badge{{font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600;color:#fff}}
#header .badge.enc{{background:var(--accent2);margin-left:2px}}
#header .badge.lock{{background:var(--danger);margin-left:2px}}
#header .dot{{width:8px;height:8px;border-radius:50%;background:#44cc66;flex-shrink:0}}
#header .dot.off{{background:#cc4444}}
#header .count{{font-size:12px;color:var(--text-dim);margin-left:auto}}
#header .btn{{background:none;border:1px solid var(--border);color:var(--text);padding:5px 8px;border-radius:6px;cursor:pointer;font-size:13px;flex-shrink:0}}
#header .btn:hover{{background:var(--surface2)}}
#header .btn.active{{background:var(--accent);border-color:var(--accent);color:#fff}}
#link-bar{{display:flex;align-items:center;gap:6px;padding:7px 12px;background:var(--surface2);flex-shrink:0;font-size:12px;border-bottom:1px solid var(--border);overflow:hidden}}
#link-bar .label{{color:var(--text-dim);flex-shrink:0}}
#link-bar .link{{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--accent);font-family:monospace;font-size:11px}}
#link-bar .copy-btn,.link-bar .export-btn{{background:var(--accent);border:none;color:#fff;padding:4px 10px;border-radius:5px;cursor:pointer;font-size:11px;flex-shrink:0}}
#messages{{flex:1;overflow-y:auto;padding:8px 10px;display:flex;flex-direction:column;gap:3px;-webkit-overflow-scrolling:touch}}
.msg{{padding:5px 8px;border-radius:8px;max-width:85%;word-break:break-word;line-height:1.35;font-size:14px;position:relative}}
.msg.system{{align-self:center;background:transparent;color:var(--system);font-size:11px;padding:2px 6px}}
.msg.chat{{align-self:flex-start;background:var(--surface)}}
.msg.chat .author{{font-size:11px;color:var(--accent);font-weight:600;margin-bottom:1px}}
.msg.mine{{align-self:flex-end;background:var(--accent)}}
.msg.mine .author{{font-size:11px;color:rgba(255,255,255,0.7);font-weight:600;margin-bottom:1px}}
.msg.mine .body{{color:#fff}}
.msg .time{{font-size:9px;color:var(--text-dim);margin-top:2px}}
.msg .actions{{display:none;position:absolute;top:-8px;right:4px;gap:2px}}
.msg:hover .actions,.msg:active .actions{{display:flex}}
.msg .actions button{{background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:1px 5px;border-radius:4px;cursor:pointer;font-size:10px}}
.msg .actions button:hover{{background:var(--accent);color:#fff}}
.msg .actions button.danger:hover{{background:var(--danger)}}
.msg .reactions{{display:flex;gap:2px;margin-top:3px;flex-wrap:wrap}}
.msg .reaction{{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1px 6px;font-size:11px;cursor:pointer;transition:all 0.15s}}
.msg .reaction:hover{{background:var(--accent);border-color:var(--accent)}}
.msg .reaction.active{{background:var(--accent);border-color:var(--accent);color:#fff}}
.msg.file-msg{{align-self:flex-start;background:var(--surface);padding:8px 10px}}
.msg.file-msg.mine{{align-self:flex-end;background:var(--accent)}}
.msg.file-msg .author{{font-size:11px;color:var(--accent);font-weight:600;margin-bottom:3px}}
.msg.file-msg.mine .author{{color:rgba(255,255,255,0.7)}}
.msg.file-msg .file-info{{display:flex;align-items:center;gap:6px}}
.msg.file-msg .file-icon{{font-size:24px}}
.msg.file-msg .file-name{{font-size:13px;font-weight:600;word-break:break-all}}
.msg.file-msg .file-size{{font-size:10px;color:var(--text-dim)}}
.msg.file-msg.mine .file-size{{color:rgba(255,255,255,0.5)}}
.msg.file-msg img.preview{{max-width:240px;max-height:200px;border-radius:6px;margin-top:4px;cursor:pointer}}
.msg.file-msg a{{color:var(--accent);text-decoration:none}}
.msg.file-msg.mine a{{color:#fff}}
.uploading{{opacity:0.5;pointer-events:none}}
#typing-indicator{{padding:2px 14px;font-size:11px;color:var(--text-dim);font-style:italic;min-height:18px;flex-shrink:0}}
#admin-panel{{display:none;flex-shrink:0;background:var(--surface);border-top:1px solid var(--border);padding:10px 12px;max-height:40vh;overflow-y:auto}}
#admin-panel.show{{display:block}}
#admin-panel h3{{font-size:12px;color:var(--text-dim);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}}
.user-row{{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px}}
.user-row:last-child{{border-bottom:none}}
.user-row .device-icon{{font-size:20px;flex-shrink:0;width:30px;text-align:center}}
.user-row .info{{flex:1;min-width:0}}
.user-row .info .device{{font-weight:700;font-size:13px}}
.user-row .info .meta{{font-size:11px;color:var(--text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
#input-area{{display:flex;gap:6px;padding:8px 10px;padding-bottom:calc(8px + var(--safe-bottom));background:var(--surface);border-top:1px solid var(--border);flex-shrink:0}}
#input-area input[type="text"]{{flex:1;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:9px 12px;border-radius:18px;font-size:14px;outline:none;-webkit-appearance:none}}
#input-area input[type="text"]:focus{{border-color:var(--accent)}}
#input-area .send-btn{{background:var(--accent);border:none;color:#fff;width:38px;height:38px;border-radius:50%;cursor:pointer;font-size:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center}}
#reaction-bar{{display:none;justify-content:center;gap:6px;padding:4px 10px;flex-shrink:0;background:var(--surface);border-top:1px solid var(--border)}}
#reaction-bar.show{{display:flex}}
#reaction-bar .rxn{{background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:4px 8px;cursor:pointer;font-size:16px;transition:all 0.15s}}
#reaction-bar .rxn:hover{{background:var(--accent);border-color:var(--accent);transform:scale(1.15)}}
#password-overlay{{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;align-items:center;justify-content:center;padding:20px}}
#password-overlay.show{{display:flex}}
#password-modal{{background:var(--surface);padding:24px;border-radius:14px;width:100%;max-width:320px;border:1px solid var(--border);text-align:center}}
#password-modal h2{{font-size:18px;margin-bottom:4px}}#password-modal .icon{{font-size:40px;margin-bottom:8px}}
#password-modal p{{font-size:12px;color:var(--text-dim);margin-bottom:12px}}
#password-modal input{{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:8px;font-size:14px;margin-bottom:8px;outline:none;text-align:center;-webkit-appearance:none}}
#password-modal input:focus{{border-color:var(--accent)}}
#password-modal .error{{color:var(--danger);font-size:12px;margin-bottom:8px;display:none}}
#password-modal button{{width:100%;padding:10px;border-radius:8px;border:none;cursor:pointer;font-size:14px;background:var(--accent);color:#fff}}
#settings-overlay{{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100;align-items:center;justify-content:center;padding:20px}}
#settings-overlay.show{{display:flex}}
#settings-modal{{background:var(--surface);padding:20px;border-radius:14px;width:100%;max-width:320px;border:1px solid var(--border)}}
#settings-modal h2{{font-size:16px;margin-bottom:8px}}
#settings-modal p{{font-size:12px;color:var(--text-dim);margin-bottom:10px}}
#settings-modal input{{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:8px;font-size:14px;margin-bottom:10px;outline:none;-webkit-appearance:none}}
#settings-modal input:focus{{border-color:var(--accent)}}
#settings-modal .actions{{display:flex;gap:8px;justify-content:flex-end}}
#settings-modal .actions button{{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:13px}}
#settings-modal .save-btn{{background:var(--accent);color:#fff}}
#settings-modal .cancel-btn{{background:var(--surface2);color:var(--text)}}
#toast{{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:8px 20px;border-radius:20px;font-size:14px;z-index:300;opacity:0;transition:opacity 0.3s;pointer-events:none}}
#toast.show{{opacity:1}}
@media(max-width:600px){{#sidebar{{position:fixed;top:0;left:0;bottom:0;z-index:50;width:260px;box-shadow:4px 0 20px rgba(0,0,0,0.5)}}#sidebar.show{{display:flex}}}}
</style>
</head>
<body>
<div id="password-overlay" class="__PWD_OVERLAY__">
<div id="password-modal">
<div class="icon">🔐</div>
<h2>Room Password</h2>
<p>This chat is protected. Enter the password to join.</p>
<input type="password" id="password-input" placeholder="Password" autocomplete="off">
<div class="error" id="password-error">Wrong password</div>
<button id="password-submit">Join Chat</button>
</div>
</div>
<div id="app">
<div id="sidebar">
<h3>👥 Online</h3>
<div class="user-list" id="sidebar-list"></div>
</div>
<div id="main">
<div id="header">
<span class="dot" id="status-dot"></span>
<span class="title">Offline Chat</span>
<span class="badge">LAN</span>
__TLS_BADGE__
__PW_BADGE__
<span class="count" id="user-count">0 online</span>
<button class="btn" id="sidebar-btn" title="Users">👥</button>
<button class="btn" id="users-btn" title="Admin" style="display:none">👑</button>
<button class="btn" id="settings-btn" title="Settings">⚙</button>
</div>
<div id="link-bar">
<span class="label">🔗</span>
<span class="link" id="share-link">—</span>
<button class="copy-btn" id="copy-btn">Copy</button>
<button class="export-btn" id="export-btn" title="Export chat" style="background:var(--surface2);margin-left:2px">⬇</button>
</div>
<div id="messages"></div>
<div id="typing-indicator"></div>
<div id="reaction-bar"><span class="rxn" data-emoji="👍">👍</span><span class="rxn" data-emoji="❤️">❤️</span><span class="rxn" data-emoji="😂">😂</span><span class="rxn" data-emoji="😮">😮</span><span class="rxn" data-emoji="😢">😢</span><span class="rxn" data-emoji="😡">😡</span><span class="rxn" data-emoji="👏">👏</span><span class="rxn" data-emoji="🔥">🔥</span></div>
<div id="admin-panel"><h3>👑 Connected Users</h3><div id="admin-list"></div></div>
<div id="input-area">
<input type="file" id="file-input" style="display:none" multiple>
<button class="send-btn" id="file-btn" title="Attach file" style="background:var(--surface2);font-size:14px">📎</button>
<input type="text" id="msg-input" placeholder="Message..." maxlength="2000" autocomplete="off" enterkeyhint="send">
<button class="send-btn" id="send-btn">➤</button>
</div>
</div></div>
<div id="toast"></div>
<div id="settings-overlay">
<div id="settings-modal">
<h2>⚙ Your Name</h2>
<p>Set a display name (optional). Leave blank to stay anonymous.</p>
<input type="text" id="name-input" placeholder="e.g. Isaac" maxlength="30">
<div class="actions">
<button class="cancel-btn" id="settings-cancel">Cancel</button>
<button class="save-btn" id="settings-save">Save</button>
</div></div></div>
<script>
// ── State ──
let mySession='',myName='',isHost=false,usersOnline=0;
let eventSource=null,connected=false,authReady=__AUTH_READY__;
let lastMsgEl=null,selectedMsgId=null;
let typingUsers={{}},typingTimeout=null;
const TLS=__TLS_JS__;
const HOST_TOKEN=new URLSearchParams(location.search).get('host')||'';
const PROTO=TLS?'https':'http';

// ── DOM refs ──
const $={
msgs:document.getElementById('messages'),
input:document.getElementById('msg-input'),
count:document.getElementById('user-count'),
dot:document.getElementById('status-dot'),
link:document.getElementById('share-link'),
sidebar:document.getElementById('sidebar'),
sidebarList:document.getElementById('sidebar-list'),
adminPanel:document.getElementById('admin-panel'),
adminList:document.getElementById('admin-list'),
typing:document.getElementById('typing-indicator'),
reactionBar:document.getElementById('reaction-bar'),
toast:document.getElementById('toast'),
usersBtn:document.getElementById('users-btn'),
sidebarBtn:document.getElementById('sidebar-btn'),
pwdOverlay:document.getElementById('password-overlay'),
pwdInput:document.getElementById('password-input'),
pwdError:document.getElementById('password-error'),
};

// ── Helpers ──
function toast(m){{$.toast.textContent=m;$.toast.classList.add('show');setTimeout(()=>$.toast.classList.remove('show'),2000)}}
function esc(s){{const d=document.createElement('div');d.textContent=s||'';return d.innerHTML}}
function scrollBottom(){{requestAnimationFrame(()=>{{$.msgs.scrollTop=$.msgs.scrollHeight}})}}

// ── Password flow ──
__PW_AUTH_JS__
__PW_KEYDOWN_JS__

// ── Connection ──
function connect(){{
if(!authReady)return;
if(eventSource)eventSource.close();
mySession=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const authParam=__HAS_PASSWORD__?'&auth='+encodeURIComponent(localStorage.getItem('offline-chat-auth')||''):'';
eventSource=new EventSource('/events?session_id='+mySession+authParam);
eventSource.onopen=()=>{{
connected=true;$.dot.classList.remove('off');
const saved=localStorage.getItem('offline-chat-name2');
if(saved){{myName=saved;sendAction({{action:'set_name',name:saved}})}}
if(HOST_TOKEN){{sendAction({{action:'claim_host',token:HOST_TOKEN}})}}
}};
eventSource.onmessage=(e)=>{{
try{{
const msg=JSON.parse(e.data);
switch(msg.type){{
case'welcome':usersOnline=msg.user_count;isHost=msg.is_host||false;updateHostUI();updateCount();
if(msg.history){{msg.history.forEach(m=>renderHistory(m))}}
break;
case'system':addSystem(msg.text);if(msg.user_count!==undefined){{usersOnline=msg.user_count;updateCount()}}break;
case'message':addChat(msg.msg_id,msg.from,msg.text,msg.from_session===mySession);break;
case'file_share':addFile(msg.msg_id,msg.from,msg.from_session,msg);break;
case'admin_users':renderAdmin(msg.users);break;
case'user_list':renderSidebar(msg.users);updateCount2(msg.users.length);break;
case'host_granted':isHost=true;updateHostUI();break;
case'my_session':break;
case'pong':break;
case'typing':handleTyping(msg.from_session,msg.from,msg.typing);break;
case'reaction':handleReaction(msg.msg_id,msg.emoji,msg.from);break;
case'delete_message':handleDelete(msg.msg_id);break;
case'history':break;
}}
}}catch(ex){{}}
}};
eventSource.onerror=()=>{{
connected=false;$.dot.classList.add('off');
if(eventSource){{eventSource.close();eventSource=null}}
addSystem('Disconnected. Reconnecting in 2s...');
setTimeout(connect,2000);
}};
const linkUrl=PROTO+'://'+location.host+'/link';
fetch(linkUrl).then(r=>r.json()).then(d=>{{$.link.textContent=d.link}}).catch(()=>{{}});
}}

// ── Send action ──
async function sendAction(data){{
data.session_id=mySession;
try{{await fetch('/send',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify(data)}})}}
catch(e){{}}
}}

// ── Typing ──
let typingTimer=null;
$.input.addEventListener('input',()=>{{
if(!connected)return;
if(typingTimer)clearTimeout(typingTimer);
sendAction({{action:'typing',typing:true}});
typingTimer=setTimeout(()=>{{sendAction({{action:'typing',typing:false}});typingTimer=null}},2000);
}});

function handleTyping(sid,name,isTyping){{
if(isTyping && sid!==mySession){{
typingUsers[sid]={{name:name,time:Date.now()}};
}}else{{
delete typingUsers[sid];
}}
// Clean stale
for(const k in typingUsers){{if(Date.now()-typingUsers[k].time>5000)delete typingUsers[k]}}
const names=Object.values(typingUsers).map(u=>u.name);
if(names.length===0)$.typing.textContent='';
else if(names.length===1)$.typing.textContent=names[0]+' is typing...';
else if(names.length===2)$.typing.textContent=names[0]+' and '+names[1]+' are typing...';
else $.typing.textContent=names.length+' people are typing...';
}}

// ── Render ──
function makeMsgEl(msgId,author,text,isMine,timeStr,uploadInfo){{
const el=document.createElement('div');
el.id='msg-'+msgId;
if(uploadInfo){{
el.className='msg file-msg'+(isMine?' mine':'');
const icon=uploadInfo.mime&&uploadInfo.mime.startsWith('image/')?'🖼️':uploadInfo.mime&&uploadInfo.mime.startsWith('video/')?'🎬':'📄';
const sizeStr=uploadInfo.size>1024*1024?(uploadInfo.size/1024/1024).toFixed(1)+'MB':(uploadInfo.size/1024).toFixed(1)+'KB';
let preview='';
if(uploadInfo.mime&&uploadInfo.mime.startsWith('image/')){{
preview='<img class="preview" src="'+esc(uploadInfo.url)+'" alt="'+esc(uploadInfo.name)+'" onclick="window.open(this.src)">';
}}
el.innerHTML='<div class="author">'+esc(author)+'</div><div class="file-info"><span class="file-icon">'+icon+'</span><div><a href="'+esc(uploadInfo.url)+'" target="_blank" class="file-name">'+esc(uploadInfo.name)+'</a><div class="file-size">'+sizeStr+'</div></div></div>'+preview+'<div class="time">'+timeStr+'</div><div class="reactions"></div><div class="actions">'+(isMine||isHost?'<button class="danger" onclick="deleteMsg('+msgId+')">✕</button>':'')+'<button onclick="quickReact('+msgId+')">+</button></div>';
}}else{{
el.className='msg chat'+(isMine?' mine':'');
el.innerHTML='<div class="author">'+esc(author)+'</div><div class="body">'+esc(text)+'</div><div class="time">'+timeStr+'</div><div class="reactions"></div><div class="actions">'+(isMine||isHost?'<button class="danger" onclick="deleteMsg('+msgId+')">✕</button>':'')+'<button onclick="quickReact('+msgId+')">+</button></div>';
}}
el.addEventListener('click',()=>{{selectMsg(msgId,el)}});
return el;
}}

function selectMsg(msgId,el){{
if(selectedMsgId===msgId){{
selectedMsgId=null;$.reactionBar.classList.remove('show');
}}else{{
selectedMsgId=msgId;$.reactionBar.classList.add('show');
// scroll to it
el.scrollIntoView({{behavior:'smooth',block:'center'}});
}}
}}

function quickReact(msgId){{
selectedMsgId=msgId;$.reactionBar.classList.add('show');
const el=document.getElementById('msg-'+msgId);
if(el)el.scrollIntoView({{behavior:'smooth',block:'center'}});
}}

function addChat(msgId,author,text,isMine){{
const t=new Date().toLocaleTimeString([],{{hour:'2-digit',minute:'2-digit'}});
const el=makeMsgEl(msgId,author,text,isMine,t);
$.msgs.appendChild(el);scrollBottom();
return el;
}}

function addFile(msgId,author,sessionId,data){{
const isMine=sessionId===mySession;
const t=new Date().toLocaleTimeString([],{{hour:'2-digit',minute:'2-digit'}});
const el=makeMsgEl(msgId,author,'',isMine,t,data);
$.msgs.appendChild(el);scrollBottom();
}}

function addSystem(text){{
const el=document.createElement('div');el.className='msg system';el.textContent=text;
$.msgs.appendChild(el);scrollBottom();
}}

function renderHistory(msg){{
const isMine=msg.from_session===mySession;
if(msg.text)addChat(msg.msg_id,msg.from,msg.text,isMine);
else if(msg.url)addFile(msg.msg_id,msg.from,msg.from_session,msg);
if(msg.reactions){{msg.reactions.forEach(r=>renderReaction(msg.msg_id,r.emoji,r.count))}}
}}

function renderAdmin(users){{
const icons={{iPhone:'📱','Android Phone':'🤖',iPad:'📱',Mac:'💻',Windows:'🖥',Linux:'🐧'}};
$.adminList.innerHTML=users.map(u=>{{
const dev=u.device_type||'unknown';
const icon=icons[dev]||'❓';
const name=u.name!=='Anonymous'?u.name:'Anonymous';
return'<div class="user-row"><span class="device-icon">'+icon+'</span><div class="info"><div class="device">'+esc(name)+'</div><div class="meta">'+esc(dev)+' · '+esc(u.os)+' · '+esc(u.browser)+' · IP: '+esc(u.ip)+'</div></div></div>';
}}).join('');
}}

function renderSidebar(users){{
const icons={{iPhone:'📱','Android Phone':'🤖',iPad:'📱',Mac:'💻',Windows:'🖥',Linux:'🐧'}};
$.sidebarList.innerHTML=users.map(u=>{{
const dev=u.device_type||'unknown';
const icon=icons[dev]||'❓';
const name=u.name||'Anonymous';
return'<div class="side-user"><span class="dot2'+(typingUsers[Object.keys(users).find(k=>users[k].name===name)]?' typing-dot':'')+'"></span><span>'+icon+'</span><span>'+esc(name)+'</span><span style="font-size:10px;color:var(--text-dim);margin-left:auto">'+esc(dev)+'</span></div>';
}}).join('');
}}

function handleReaction(msgId,emoji,from){{
if(from===myName)return;
const el=document.getElementById('msg-'+msgId);
if(!el)return;
const rxDiv=el.querySelector('.reactions');
const existing=rxDiv.querySelector('[data-emoji="'+emoji+'"]');
if(existing){{
const count=parseInt(existing.getAttribute('data-count')||'1')+1;
existing.setAttribute('data-count',count);
existing.textContent=emoji+' '+count;
}}else{{
const span=document.createElement('span');
span.className='reaction';span.setAttribute('data-emoji',emoji);span.setAttribute('data-count','1');
span.textContent=emoji+' 1';
span.onclick=()=>{{sendAction({{action:'react',msg_id:msgId,emoji:emoji}});span.classList.toggle('active')}};
rxDiv.appendChild(span);
}}
}}

function renderReaction(msgId,emoji,count){{
const el=document.getElementById('msg-'+msgId);
if(!el)return;
const rxDiv=el.querySelector('.reactions');
const span=document.createElement('span');
span.className='reaction';span.setAttribute('data-emoji',emoji);span.setAttribute('data-count',String(count));
span.textContent=emoji+' '+count;
span.onclick=()=>{{sendAction({{action:'react',msg_id:msgId,emoji:emoji}});span.classList.toggle('active')}};
rxDiv.appendChild(span);
}}

function deleteMsg(msgId){{
if(!confirm('Delete this message?'))return;
sendAction({{action:'delete_message',msg_id:msgId}});
}}

function handleDelete(msgId){{
const el=document.getElementById('msg-'+msgId);
if(el)el.remove();
}}

// ── Reaction bar ──
document.querySelectorAll('#reaction-bar .rxn').forEach(btn=>{{
btn.addEventListener('click',()=>{{
if(!selectedMsgId)return;
const emoji=btn.getAttribute('data-emoji');
sendAction({{action:'react',msg_id:selectedMsgId,emoji:emoji}});
// Visual feedback
const msgEl=document.getElementById('msg-'+selectedMsgId);
if(msgEl){{
const rxDiv=msgEl.querySelector('.reactions');
const existing=rxDiv.querySelector('[data-emoji="'+emoji+'"]');
if(existing){{
const count=parseInt(existing.getAttribute('data-count')||'1')+1;
existing.setAttribute('data-count',count);
existing.textContent=emoji+' '+count;
}}else{{
const span=document.createElement('span');
span.className='reaction active';span.setAttribute('data-emoji',emoji);span.setAttribute('data-count','1');
span.textContent=emoji+' 1';
span.onclick=()=>{{sendAction({{action:'react',msg_id:selectedMsgId,emoji:emoji}});span.classList.toggle('active')}};
rxDiv.appendChild(span);
}}
}}
}});
}});

// ── Send message ──
function sendMessage(){{
const text=$.input.value.trim();if(!text||!connected)return;
sendAction({{action:'message',text:text}});
$.input.value='';$.input.focus();
}}

document.getElementById('send-btn').addEventListener('click',sendMessage);
$.input.addEventListener('keydown',e=>{{if(e.key==='Enter'&&!e.shiftKey){{e.preventDefault();sendMessage()}}}});

// ── File upload ──
const $fileInput=document.getElementById('file-input');
document.getElementById('file-btn').addEventListener('click',()=>$fileInput.click());
$fileInput.addEventListener('change',()=>{{for(const file of $fileInput.files)uploadFile(file);$fileInput.value=''}});

async function uploadFile(file){{
if(file.size>50*1024*1024){{toast('File too large (max 50MB)');return}}
document.getElementById('file-btn').classList.add('uploading');
const form=new FormData();form.append('file',file);
form.append('session_id',mySession);
try{{
const resp=await fetch('/upload',{{method:'POST',body:form}});
const data=await resp.json();
if(data.ok){{}}
else{{toast('Upload failed: '+(data.error||'unknown'))}}
}}catch(e){{toast('Upload error: '+e.message)}}
document.getElementById('file-btn').classList.remove('uploading');
}}

// ── Export ──
document.getElementById('export-btn').addEventListener('click',()=>{{
const lines=[];
$.msgs.querySelectorAll('.msg').forEach(el=>{{
if(el.classList.contains('system')){{lines.push('[ '+el.textContent+' ]')}}
else{{
const author=el.querySelector('.author');const body=el.querySelector('.body');
const time=el.querySelector('.time');
const name=author?author.textContent:'Anonymous';
const txt=body?body.textContent:'[file]';
const tm=time?time.textContent:'';
lines.push(tm+' '+name+': '+txt);
}}
}});
const blob=new Blob([lines.join('\\n')],{{type:'text/plain'}});
const a=document.createElement('a');a.href=URL.createObjectURL(blob);
a.download='chat-export-'+new Date().toISOString().slice(0,10)+'.txt';
a.click();URL.revokeObjectURL(a.href);
toast('Chat exported!');
}});

// ── Buttons ──
document.getElementById('copy-btn').addEventListener('click',()=>{{
const l=$.link.textContent;if(l&&l!=='—'){{
navigator.clipboard.writeText(l).then(()=>{{
const b=document.getElementById('copy-btn');b.textContent='✓';
setTimeout(()=>b.textContent='Copy',1500);
}});
}}
}});

$.usersBtn.addEventListener('click',()=>{{
$.adminPanel.classList.toggle('show');$.usersBtn.classList.toggle('active');
if($.adminPanel.classList.contains('show'))sendAction({{action:'admin_refresh'}});
}});

$.sidebarBtn.addEventListener('click',()=>{{
$.sidebar.classList.toggle('show');$.sidebarBtn.classList.toggle('active');
}});

document.getElementById('settings-btn').addEventListener('click',()=>{{
document.getElementById('name-input').value=myName;
document.getElementById('settings-overlay').classList.add('show');
}});
document.getElementById('settings-cancel').addEventListener('click',()=>{{
document.getElementById('settings-overlay').classList.remove('show');
}});
document.getElementById('settings-save').addEventListener('click',()=>{{
const n=document.getElementById('name-input').value.trim();myName=n;
if(n){{localStorage.setItem('offline-chat-name2',n);sendAction({{action:'set_name',name:n}})}}
else{{localStorage.removeItem('offline-chat-name2');sendAction({{action:'set_name',name:''}})}}
document.getElementById('settings-overlay').classList.remove('show');
}});
document.getElementById('settings-overlay').addEventListener('click',e=>{{if(e.target===e.currentTarget)e.currentTarget.classList.remove('show')}});

function updateCount(){{$.count.textContent=usersOnline+' online'}}
function updateCount2(n){{usersOnline=n;$.count.textContent=n+' online'}}
function updateHostUI(){{
if(isHost){{$.usersBtn.style.display=''}}else{{$.usersBtn.style.display='none';$.adminPanel.classList.remove('show')}}
}}

// Start
__PW_START_IF__connect();
__PW_START_ENDIF__
setInterval(()=>{{sendAction({{action:'ping'}})}},25000);
// ── Panic close: blank screen instantly when tab closes ──
window.addEventListener('beforeunload',()=>{{
document.body.innerHTML='';
document.body.style.background='#fff';
}});
window.addEventListener('pagehide',()=>{{
document.body.innerHTML='';
document.body.style.background='#fff';
}});
</script>
</body>
</html>"""
    # The template was migrated from an f-string: literal braces are still doubled.
    # Collapse them back to single braces or the CSS/JS is invalid in the browser.
    html = html.replace("{{", "{").replace("}}", "}")
    html = html.replace("__PWD_OVERLAY__", _pwd_overlay_class)
    html = html.replace("__TLS_BADGE__", _tls_badge)
    html = html.replace("__PW_BADGE__", _pw_badge)
    html = html.replace("__AUTH_READY__", _auth_ready)
    html = html.replace("__TLS_JS__", _tls_js)
    html = html.replace("__HAS_PASSWORD__", _has_password)
    html = html.replace("__PW_AUTH_JS__", _pw_auth_js)
    html = html.replace("__PW_KEYDOWN_JS__", _pw_keydown_js)
    html = html.replace("__PW_START_IF__", _pw_start_if)
    html = html.replace("__PW_START_ENDIF__", _pw_start_endif)
    return html


# ── HTTP Handler ────────────────────────────────────────────────────────
class OfflineChatHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, format, *args):
        pass

    def _headers(self, code=200, content_type="text/html", extra=None):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.end_headers()

    def _client_ip(self) -> str:
        forwarded = self.headers.get("X-Forwarded-For", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return self.client_address[0]

    def _client_ua(self) -> str:
        return self.headers.get("User-Agent", "")

    def do_OPTIONS(self):
        self._headers(204, "text/plain")

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"

        if path == "/":
            self._headers(200, "text/html")
            self.wfile.write(get_html().encode("utf-8"))

        elif path == "/health":
            self._headers(200, "application/json")
            self.wfile.write(json.dumps({
                "status": "ok", "users": len(users),
                "tls": ARGS.tls, "stealth": ARGS.stealth,
                "password_protected": bool(ROOM_PASSWORD),
            }).encode())

        elif path == "/link":
            ip = LOCAL_IP
            proto = "https" if ARGS.tls else "http"
            port_str = f":{ARGS.port}" if ARGS.port not in (80, 443) else ""
            self._headers(200, "application/json")
            self.wfile.write(json.dumps({
                "link": f"{proto}://{ip}{port_str}",
                "host_link": f"{proto}://{ip}{port_str}?host={HOST_TOKEN}",
                "users": len(users),
                "tls": ARGS.tls,
                "password_required": bool(ROOM_PASSWORD),
            }).encode())

        elif path == "/events":
            params = urllib.parse.parse_qs(parsed.query)
            session_id = params.get("session_id", [""])[0]
            auth_token = params.get("auth", [""])[0]

            if not session_id:
                self._headers(400, "text/plain")
                self.wfile.write(b"Missing session_id")
                return

            # Password check
            if ROOM_PASSWORD:
                expected_auth = secrets.token_urlsafe(16)
                stored = getattr(self.server, '_auth_tokens', {})
                if auth_token and auth_token in stored:
                    pass  # already authenticated
                else:
                    self._headers(403, "text/plain")
                    self.wfile.write(b"Authentication required")
                    return

            ip = self._client_ip()
            ua = self._client_ua()
            is_local = is_local_ip(ip)

            # Register user
            is_new = session_id not in users
            if is_new:
                device_info = parse_user_agent(ua)
                users[session_id] = {
                    "name": "",
                    "ip": ip,
                    "user_agent": ua,
                    "device_type": device_info["device_type"],
                    "device_brand": device_info["device_brand"],
                    "os": device_info["os"],
                    "browser": device_info["browser"],
                    "connected_at": time.time(),
                    "is_host": is_local,
                }

            # Create SSE queue
            queue = []
            if session_id not in sse_clients:
                sse_clients[session_id] = []
            sse_clients[session_id].append(queue)

            self._headers(200, "text/event-stream", {
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            })

            user = users[session_id]
            user_name = user.get("name") or "Anonymous"

            try:
                # Send welcome with history
                hist = []
                for mid, ts, evt in message_history:
                    hist.append(evt)
                welcome = json.dumps({
                    "type": "welcome",
                    "session_id": session_id,
                    "user_count": len(users),
                    "is_host": is_local,
                    "history": hist,
                })
                self.wfile.write(f"data: {welcome}\n\n".encode())
                self.wfile.flush()

                if is_new:
                    broadcast_all({
                        "type": "system",
                        "text": f"{user_name} joined the chat",
                        "user_count": len(users),
                    })
                    notify_admin()
                    notify_user_list()

                # Keep alive
                while True:
                    ready, _, _ = select.select([self.rfile], [], [], 1.0)
                    if ready:
                        try:
                            self.rfile.read(1)
                            break
                        except Exception:
                            break

                    while queue:
                        data = queue.pop(0)
                        try:
                            self.wfile.write(data)
                            self.wfile.flush()
                        except Exception:
                            return

                    try:
                        self.wfile.write(b": hb\n\n")
                        self.wfile.flush()
                    except Exception:
                        break

            except (BrokenPipeError, ConnectionResetError, OSError):
                pass
            finally:
                if session_id in sse_clients:
                    if queue in sse_clients[session_id]:
                        sse_clients[session_id].remove(queue)
                    if not sse_clients[session_id]:
                        _remove_session(session_id)

        elif path.startswith("/files/"):
            file_name = path[len("/files/"):]
            file_path = UPLOAD_DIR / file_name
            if not file_path.resolve().is_relative_to(UPLOAD_DIR.resolve()):
                self._headers(403, "text/plain")
                self.wfile.write(b"Forbidden")
                return
            if file_path.exists() and file_path.is_file():
                ext = file_path.suffix.lower()
                mimes = {".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",
                         ".gif":"image/gif",".webp":"image/webp",".svg":"image/svg+xml",
                         ".mp4":"video/mp4",".mov":"video/quicktime",".pdf":"application/pdf",
                         ".txt":"text/plain",".json":"application/json"}
                ct = mimes.get(ext, "application/octet-stream")
                self._headers(200, ct, {"Content-Length": str(file_path.stat().st_size)})
                with open(file_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self._headers(404, "text/plain")
                self.wfile.write(b"Not found")
        else:
            self._headers(404, "text/plain")
            self.wfile.write(b"Not found")

    def do_POST(self):
        global next_msg_id
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"

        if path == "/auth":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body)
                pw = data.get("password", "")
                if ROOM_PASSWORD and pw == ROOM_PASSWORD:
                    token = secrets.token_urlsafe(16)
                    stored = getattr(self.server, '_auth_tokens', {})
                    stored[token] = time.time()
                    self.server._auth_tokens = stored
                    self._headers(200, "application/json")
                    self.wfile.write(json.dumps({"ok": True, "token": token}).encode())
                else:
                    self._headers(200, "application/json")
                    self.wfile.write(json.dumps({"ok": False}).encode())
            except Exception:
                self._headers(200, "application/json")
                self.wfile.write(json.dumps({"ok": False}).encode())
            return

        if path == "/send":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body)
            except json.JSONDecodeError:
                self._headers(400, "application/json")
                self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
                return

            session_id = data.get("session_id", "")
            action = data.get("action", "")

            if session_id not in users:
                self._headers(200, "application/json")
                self.wfile.write(json.dumps({"ok": False, "error": "Unknown session"}).encode())
                return

            user = users[session_id]

            if action == "message":
                text = (data.get("text", "") or "").strip()
                if not text or len(text) > 2000:
                    self._headers(200, "application/json")
                    self.wfile.write(json.dumps({"ok": False}).encode())
                    return
                msg_id = next_msg_id; next_msg_id += 1
                event = {
                    "type": "message", "msg_id": msg_id,
                    "from": user.get("name") or "Anonymous",
                    "from_session": session_id, "text": text,
                }
                message_history.append((msg_id, time.time(), {
                    "msg_id": msg_id, "from": event["from"],
                    "from_session": session_id, "text": text,
                    "type": "message", "reactions": [],
                }))
                broadcast_all(event)

            elif action == "set_name":
                name = (data.get("name", "") or "").strip()[:30]
                old_name = user.get("name") or "Anonymous"
                user["name"] = name
                new_name = user.get("name") or "Anonymous"
                if old_name != new_name:
                    broadcast_all({
                        "type": "system",
                        "text": f"{old_name} → {new_name}",
                        "user_count": len(users),
                    })
                    notify_admin()
                    notify_user_list()

            elif action == "claim_host":
                token = data.get("token", "")
                if token == HOST_TOKEN:
                    user["is_host"] = True
                    send_to_session(session_id, {"type": "host_granted"})
                    notify_admin()

            elif action == "admin_refresh":
                if user.get("is_host"):
                    send_to_session(session_id, {
                        "type": "admin_users",
                        "users": user_list_admin(),
                    })

            elif action == "ping":
                send_to_session(session_id, {"type": "pong"})

            elif action == "typing":
                is_typing = data.get("typing", False)
                broadcast_event({
                    "type": "typing",
                    "from_session": session_id,
                    "from": user.get("name") or "Anonymous",
                    "typing": is_typing,
                }, exclude_session=session_id)

            elif action == "react":
                msg_id = data.get("msg_id")
                emoji = data.get("emoji", "")[:4]
                if msg_id is not None and emoji:
                    broadcast_all({
                        "type": "reaction",
                        "msg_id": msg_id,
                        "emoji": emoji,
                        "from": user.get("name") or "Anonymous",
                    })
                    # Update history
                    for i, (mid, ts, evt) in enumerate(message_history):
                        if mid == msg_id:
                            rx = evt.setdefault("reactions", [])
                            found = False
                            for r in rx:
                                if r["emoji"] == emoji:
                                    r["count"] += 1
                                    found = True
                                    break
                            if not found:
                                rx.append({"emoji": emoji, "count": 1})
                            # Update in-place in deque
                            msg_list = list(message_history)
                            msg_list[i] = (mid, ts, evt)
                            message_history.clear()
                            message_history.extend(msg_list)
                            break

            elif action == "delete_message":
                msg_id = data.get("msg_id")
                if msg_id is not None:
                    # Allow if own message or host
                    is_own = False
                    for mid, ts, evt in message_history:
                        if mid == msg_id and evt.get("from_session") == session_id:
                            is_own = True
                            break
                    if is_own or user.get("is_host"):
                        broadcast_all({
                            "type": "delete_message",
                            "msg_id": msg_id,
                        })
                        # Remove from history
                        msg_list = [(mid, ts, evt) for mid, ts, evt in message_history if mid != msg_id]
                        message_history.clear()
                        message_history.extend(msg_list)

            self._headers(200, "application/json")
            self.wfile.write(json.dumps({"ok": True}).encode())

        elif path == "/upload":
            content_type = self.headers.get("Content-Type", "")
            if "multipart/form-data" not in content_type:
                self._headers(400, "application/json")
                self.wfile.write(json.dumps({"error": "Expected multipart/form-data"}).encode())
                return

            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            boundary_match = re.search(rb'boundary=(.+)', content_type.encode())
            if not boundary_match:
                self._headers(400, "application/json")
                self.wfile.write(json.dumps({"error": "No boundary"}).encode())
                return

            boundary = boundary_match.group(1)
            parts = body.split(b"--" + boundary)
            file_data, file_name, session_id = None, "file", ""

            for part in parts:
                if b"Content-Disposition" not in part:
                    continue
                if b"filename=" in part:
                    header_end = part.find(b"\r\n\r\n")
                    if header_end == -1: continue
                    headers = part[:header_end].decode("utf-8", errors="replace")
                    body_start = header_end + 4
                    file_content = part[body_start:]
                    if file_content.endswith(b"\r\n"): file_content = file_content[:-2]
                    fn_match = re.search(r'filename="([^"]*)"', headers)
                    if fn_match: file_name = fn_match.group(1)
                    file_data = file_content
                elif b'name="session_id"' in part:
                    header_end = part.find(b"\r\n\r\n")
                    if header_end != -1:
                        body_start = header_end + 4
                        session_id = part[body_start:].strip().decode("utf-8", errors="replace")

            if not file_data:
                self._headers(400, "application/json")
                self.wfile.write(json.dumps({"error": "No file uploaded"}).encode())
                return
            if len(file_data) > MAX_FILE_SIZE:
                self._headers(200, "application/json")
                self.wfile.write(json.dumps({"error": "File too large (max 50MB)"}).encode())
                return

            ext = Path(file_name).suffix.lower()
            safe_name = f"{uuid.uuid4().hex}{ext}"
            (UPLOAD_DIR / safe_name).write_bytes(file_data)

            ext_map = {".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",
                       ".gif":"image/gif",".webp":"image/webp",".svg":"image/svg+xml",
                       ".mp4":"video/mp4",".mov":"video/quicktime",".pdf":"application/pdf",
                       ".txt":"text/plain",".json":"application/json",".zip":"application/zip",
                       ".dxf":"application/dxf",".ai":"application/postscript"}
            mime = ext_map.get(ext, "application/octet-stream")

            result = {"ok": True, "name": file_name, "size": len(file_data),
                      "url": f"/files/{safe_name}", "mime": mime}

            # Broadcast + history
            if session_id in users:
                u = users[session_id]
                msg_id = next_msg_id; next_msg_id += 1
                evt = {
                    "type": "file_share", "msg_id": msg_id,
                    "from": u.get("name") or "Anonymous",
                    "from_session": session_id,
                    "name": file_name, "size": len(file_data),
                    "url": f"/files/{safe_name}", "mime": mime,
                    "reactions": [],
                }
                message_history.append((msg_id, time.time(), {
                    "msg_id": msg_id, "from": evt["from"],
                    "from_session": session_id, "name": file_name,
                    "size": len(file_data), "url": f"/files/{safe_name}",
                    "mime": mime, "type": "file_share", "reactions": [],
                }))
                broadcast_all(evt)

            self._headers(200, "application/json")
            self.wfile.write(json.dumps(result).encode())

        else:
            self._headers(404, "text/plain")
            self.wfile.write(b"Not found")


class ThreadedHTTPServer(ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True


# ── Main ────────────────────────────────────────────────────────────────
def main():
    global ARGS, LOCAL_IP, ROOM_PASSWORD, CERT_FILE, KEY_FILE

    parser = argparse.ArgumentParser(description="Offline WiFi Chat v2 — Zero Internet Required")
    parser.add_argument("--port", type=int, default=9001, help="Port (default: 9001)")
    parser.add_argument("--tls", action="store_true", help="Enable TLS/SSL encryption")
    parser.add_argument("--password", type=str, default="", help="Room password")
    parser.add_argument("--stealth", action="store_true",
                        help="Stealth mode: port 443 + TLS + password required")
    parser.add_argument("--bind-ip", type=str, default="",
                        help="Manual LAN IP override (if auto-detect fails)")
    ARGS = parser.parse_args()

    if ARGS.stealth:
        ARGS.tls = True
        ARGS.port = 443
        if not ARGS.password:
            ARGS.password = secrets.token_urlsafe(8)[:8]

    ROOM_PASSWORD = ARGS.password
    LOCAL_IP = ARGS.bind_ip if ARGS.bind_ip else get_local_ip()

    # Generate TLS cert if needed
    if ARGS.tls:
        CERT_FILE, KEY_FILE = generate_self_signed_cert()

    server = ThreadedHTTPServer(("0.0.0.0", ARGS.port), OfflineChatHandler)
    server._auth_tokens = {}

    # Wrap in TLS
    if ARGS.tls:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.load_cert_chain(CERT_FILE, KEY_FILE)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        server.socket = ctx.wrap_socket(server.socket, server_side=True)

    proto = "https" if ARGS.tls else "http"
    port_str = f":{ARGS.port}" if ARGS.port not in (80, 443) else ""

    print()
    print("═" * 60)
    print("  📡  OFFLINE CHAT v2 — Zero Internet Required")
    print("═" * 60)
    print()
    print(f"  {'🔒' if ARGS.tls else '🌐'}  Server:  {proto}://{LOCAL_IP}{port_str}")
    print()
    print(f"  🚫  NO INTERNET NEEDED — LAN only, nothing leaves your WiFi")
    print()
    if ARGS.tls:
        print(f"  🔐  TLS Encryption:  ACTIVE")
        print(f"  📜  Self-signed cert — accept the browser warning")
        print(f"  🛡️   All traffic encrypted — firewalls/DPI can't read it")
        print()
    if ARGS.stealth:
        print(f"  🥷  STEALTH MODE — port 443, looks like regular HTTPS")
        print()
    if ROOM_PASSWORD:
        print(f"  🔑  Room Password:  {ROOM_PASSWORD}")
        print(f"  🔐  Only people with the password can join")
        print()
    print(f"  👑  Host link:  {proto}://{LOCAL_IP}{port_str}?host={HOST_TOKEN}")
    print()
    print(f"  📂  Files:  {UPLOAD_DIR}")
    print(f"  💬  History:  last {message_history.maxlen} messages")
    print()
    print(f"  Press Ctrl+C to stop.")
    print("═" * 60)
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.shutdown()
        print("Offline Chat v2 stopped.")


if __name__ == "__main__":
    main()
