# IsaacSecureMessenger

**Category:** Software & Apps · **Status:** Done

E2E encrypted messaging - X3DH + AES-256-GCM.

**Stack / Tools:** macOS, Encryption, AES-256, PyObjC

**Build path:**
- V1 — Browser chat. Manual key exchange.
- V2 — Native app: QR code pairing.
- V3 — X3DH protocol. Production grade.

**Location:** `~/projects/IsaacSecureMessenger/`

E2E encrypted messenger. X3DH key agreement (identity + signed prekeys + one-time prekeys) + AES-256-GCM for messages. PyObjC native .app; QR-code pairing for key exchange.

## Where it lives
- Source folder: `~/Documents/projects/apps/IsaacSecureMessenger`
- Artefacts on the site: 22 files · 3,524 lines of text · 754 KB

## Stack
- Python ×10 · binary ×2 · Shell ×1 · plist ×1
- external tools invoked: `python3`

## What's in the code
- `IsaacSecureMessenger.app/Contents/Resources/app.py` — 504 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/static/script.js` — 459 lines (JavaScript)
- `IsaacSecureMessenger.app/Contents/Resources/secure_channel.py` — 343 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/static/style.css` — 342 lines (CSS)
- `IsaacSecureMessenger.app/Contents/Resources/x3dh_protocol.py` — 321 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/peer_discovery.py` — 266 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/double_ratchet.py` — 213 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/proxy.py` — 202 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/disappearing_messages.py` — 180 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/file_transfer.py` — 176 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/voice_notes.py` — 162 lines (Python)
- `IsaacSecureMessenger.app/Contents/Resources/crypto_utils.py` — 126 lines (Python)

## Verified in the Python source
- CLI / options: `--fingerprint`, `--name`, `--no-gui`, `--port`
- classes: `DisappearingMessage`, `DisappearingMessages`, `DoubleRatchet`, `FileTransfer`, `IdentityKeyBundle`, `IsaacNetProxy`, `OneTimePreKey`, `PeerDiscovery`, `PeerInfo`, `SecureChannel`, `SecureTransport`, `SignedPreKey`, `VoiceNoteMessage`, `VoiceRecorder`
- functions: `aes_decrypt`, `aes_decrypt_str`, `aes_encrypt`, `aes_encrypt_str`, `api_bundle`, `api_connect`, `api_conversations`, `api_disappearing`, `api_file_upload`, `api_messages`, `api_peers`, `api_proxy_status`, `api_proxy_toggle`, `api_self_info`, `api_send`, `api_status`

## Notes found in the scripts
- Isaac Secure Messenger — Dependency Installer
- Double-click this file to install everything needed.
- Requires macOS and an internet connection.

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
