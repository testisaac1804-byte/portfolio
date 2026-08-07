"""
Isaac Secure Messenger — Main Application
Flask API server + PyObjC native window (WKWebView).
"""
import os, sys, json, time, threading, webbrowser, uuid, signal, atexit
import urllib.parse

# ── Path setup ─────────────────────────────────────────────────────────────
APP_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, APP_DIR)

# ── Flask ──────────────────────────────────────────────────────────────────
from flask import Flask, jsonify, request, send_from_directory
app = Flask(__name__, static_folder=None)

# ── App state ──────────────────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.expanduser("~"),
                        "Library", "Application Support",
                        "isaac-secure-messenger")
os.makedirs(DATA_DIR, exist_ok=True)

# Import our modules
from secure_channel import SecureChannel, MSG_TYPE_CIPHERTEXT, MSG_TYPE_FILE_META
from file_transfer import FileTransfer
from voice_notes import VoiceRecorder, VoiceNoteMessage
from disappearing_messages import DisappearingMessages
from peer_discovery import PeerDiscovery, PeerInfo
from proxy import auto_detect_proxy

# Global state
secure_channel = SecureChannel(DATA_DIR, display_name="")
file_transfer = FileTransfer(DATA_DIR)
voice_recorder = VoiceRecorder(os.path.join(DATA_DIR, "voice_notes"))
disappearing = DisappearingMessages(
    os.path.join(DATA_DIR, "disappearing.json"))
peer_discovery = None
server_port = 0
current_conversation = {"fingerprint": "", "name": ""}
message_history = {}  # fingerprint -> list of messages
proxy = auto_detect_proxy()

# Callback wiring
def setup_callbacks():
    secure_channel.on_message = handle_decrypted_message
    secure_channel.on_file = handle_file_metadata
    secure_channel.on_voice_note = handle_voice_note
    secure_channel.on_disappear_timer = handle_disappear_timer
    secure_channel.on_peer_connected = handle_peer_connected
    secure_channel.on_peer_disconnected = handle_peer_disconnected
    secure_channel.on_error = handle_error

def handle_decrypted_message(their_fp, plaintext):
    if plaintext and plaintext.startswith("__FILE_KEY__:"):
        # File key delivery — handled separately
        return

    msg = {
        "id": str(uuid.uuid4())[:8],
        "sender": their_fp,
        "sender_name": secure_channel.peer_display_name,
        "content": plaintext,
        "timestamp": time.time(),
        "type": "text",
        "disappearing": False,
    }

    if their_fp not in message_history:
        message_history[their_fp] = []
    message_history[their_fp].append(msg)

def handle_file_metadata(their_fp, meta):
    msg = {
        "id": str(uuid.uuid4())[:8],
        "sender": their_fp,
        "content": f"[File] {meta.get('filename', 'unknown')} "
                   f"({file_transfer.format_size(meta.get('filesize', 0))})",
        "timestamp": time.time(),
        "type": "file",
        "file_meta": meta,
    }
    if their_fp not in message_history:
        message_history[their_fp] = []
    message_history[their_fp].append(msg)

def handle_voice_note(their_fp, msg):
    vn = VoiceNoteMessage.from_message(msg)
    m = {
        "id": str(uuid.uuid4())[:8],
        "sender": their_fp,
        "content": f"[Voice Note] {vn.duration:.1f}s",
        "timestamp": time.time(),
        "type": "voice",
        "voice_file": vn.filepath,
        "duration": vn.duration,
    }
    if their_fp not in message_history:
        message_history[their_fp] = []
    message_history[their_fp].append(m)

def handle_disappear_timer(their_fp, msg):
    disappearing.add_message(
        msg.get("id", str(uuid.uuid4())),
        msg.get("content", ""), their_fp,
        msg.get("timer", 30)
    )

def handle_peer_connected(their_fp, display_name):
    print(f"[App] Peer connected: {display_name} ({their_fp})")

def handle_peer_disconnected(their_fp):
    print(f"[App] Peer disconnected: {their_fp}")

def handle_error(msg):
    print(f"[App] Error: {msg}")


# ── API Routes ─────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(os.path.join(APP_DIR, "static"), "index.html")

@app.route("/static/<path:path>")
def static_files(path):
    return send_from_directory(os.path.join(APP_DIR, "static"), path)

@app.route("/api/status")
def api_status():
    peers = peer_discovery.get_discovered_peers() if peer_discovery else []
    return jsonify({
        "fingerprint": secure_channel.fingerprint,
        "display_name": secure_channel.display_name,
        "listening_port": server_port,
        "peer_count": len(peers),
        "proxy_enabled": proxy.is_enabled,
        "proxy_detected": proxy._detected,
        "session_count": len(secure_channel.sessions),
    })

@app.route("/api/peers")
def api_peers():
    if peer_discovery:
        return jsonify({"peers": peer_discovery.get_discovered_peers()})
    return jsonify({"peers": []})

@app.route("/api/bundle")
def api_bundle():
    return jsonify(secure_channel.get_public_bundle())

@app.route("/api/connect", methods=["POST"])
def api_connect():
    """Connect to a discovered peer by fingerprint."""
    data = request.get_json()
    fingerprint = data.get("fingerprint")
    host = data.get("host")
    port = data.get("port")

    # Find peer in discovered list
    if peer_discovery:
        for p in peer_discovery.get_discovered_peers():
            if p["fingerprint"] == fingerprint:
                host = p["host"]
                port = p["port"]
                break

    if not host or not port:
        return jsonify({"error": "Host and port required"}), 400

    # Get their public bundle via API
    try:
        import urllib.request, ssl
        ctx = ssl._create_unverified_context()
        proxy_h = urllib.request.ProxyHandler({})
        https_h = urllib.request.HTTPSHandler(context=ctx)
        opener = urllib.request.build_opener(proxy_h, https_h)

        # Try to fetch their bundle via HTTP (local network)
        bundle_url = f"http://{host}:{port}/api/bundle"
        req = urllib.request.Request(bundle_url)
        resp = opener.open(req, timeout=10)
        their_bundle = json.loads(resp.read())

        # Initiate X3DH session
        session, init_msg = secure_channel.initiate_session(
            their_bundle, fingerprint
        )

        # Connect TCP and send X3DH init
        success = secure_channel.connect_to_peer(host, port)
        if success:
            return jsonify({"status": "connected",
                           "session_id": session.session_id})
        else:
            return jsonify({"error": "TCP connection failed"}), 500

    except Exception as e:
        return jsonify({"error": f"Connection failed: {str(e)}"}), 500

@app.route("/api/send", methods=["POST"])
def api_send():
    """Send an encrypted message to a peer."""
    data = request.get_json()
    their_fp = data.get("fingerprint")
    content = data.get("content", "")
    timer = data.get("timer", 0)  # 0 = no disappear

    if not their_fp or not content:
        return jsonify({"error": "fingerprint and content required"}), 400

    # Encrypt message
    encrypted = secure_channel.encrypt_message(their_fp, content)
    if not encrypted:
        return jsonify({"error": "No session with peer"}), 400

    # Send over transport
    # (In a full implementation, this would find the active transport)
    msg_id = str(uuid.uuid4())[:8]

    # Store in history
    msg = {
        "id": msg_id,
        "sender": "me",
        "content": content,
        "timestamp": time.time(),
        "type": "text",
        "disappearing": timer > 0,
        "timer": timer,
    }
    if their_fp not in message_history:
        message_history[their_fp] = []
    message_history[their_fp].append(msg)

    # If disappearing, schedule deletion
    if timer > 0:
        disappearing.add_message(msg_id, content, "me", timer)

    return jsonify({"status": "sent", "id": msg_id})

@app.route("/api/messages")
def api_messages():
    """Get message history for a conversation."""
    fingerprint = request.args.get("fingerprint", "")
    if fingerprint and fingerprint in message_history:
        return jsonify({"messages": message_history[fingerprint]})
    return jsonify({"messages": []})

@app.route("/api/conversations")
def api_conversations():
    """Get all conversations (peers we've exchanged messages with)."""
    convos = []
    for fp, msgs in message_history.items():
        if msgs:
            convos.append({
                "fingerprint": fp,
                "peer_name": secure_channel.peer_display_name or fp[:16],
                "last_message": msgs[-1]["content"][:100],
                "timestamp": msgs[-1]["timestamp"],
                "message_count": len(msgs),
            })
    return jsonify({"conversations": convos})

@app.route("/api/disappearing")
def api_disappearing():
    return jsonify({"timers": disappearing.get_all_timers()})

@app.route("/api/self-info")
def api_self_info():
    return jsonify({
        "fingerprint": secure_channel.fingerprint,
        "display_name": secure_channel.display_name,
        "data_dir": DATA_DIR,
    })

@app.route("/api/proxy/status")
def api_proxy_status():
    return jsonify({
        "enabled": proxy.is_enabled,
        "detected": proxy._detected,
        "port": proxy.proxy_port,
    })

@app.route("/api/proxy/toggle", methods=["POST"])
def api_proxy_toggle():
    data = request.get_json()
    if data.get("enable"):
        proxy.enable()
    else:
        proxy.disable()
    return jsonify({"enabled": proxy.is_enabled})

@app.route("/api/voice/start", methods=["POST"])
def api_voice_start():
    """Start recording a voice note."""
    try:
        fp = voice_recorder.start_recording()
        return jsonify({"status": "recording", "file": fp})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/voice/stop", methods=["POST"])
def api_voice_stop():
    """Stop recording and return the file path."""
    try:
        fp = voice_recorder.stop_recording()
        duration = 0
        if fp and os.path.exists(fp):
            # Rough duration: wav at 44100Hz, 16-bit mono = 88200 bytes/sec
            fsize = os.path.getsize(fp)
            duration = fsize / 88200.0
        return jsonify({"status": "stopped", "file": fp, "duration": duration})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/file/upload", methods=["POST"])
def api_file_upload():
    """Upload and prepare a file for encrypted transfer."""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    f = request.files["file"]
    temp_path = os.path.join(DATA_DIR, "uploads", f.filename)
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    f.save(temp_path)
    try:
        meta = file_transfer.prepare_send(temp_path)
        return jsonify({"status": "prepared", "metadata": meta})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Start app ──────────────────────────────────────────────────────────────

def start_app(display_name: str = ""):
    """Initialize and start the secure messenger."""
    global server_port, peer_discovery

    secure_channel.display_name = display_name
    setup_callbacks()

    # Start TCP server for peer connections
    server_port = secure_channel.start_server(port=0)
    print(f"[App] Listening on port {server_port}")

    # Start peer discovery via Bonjour
    peer_discovery = PeerDiscovery(
        service_port=server_port,
        display_name=display_name,
        fingerprint=secure_channel.fingerprint,
    )
    peer_discovery.start()

    # Detect proxy
    proxy.detect()

    print(f"[App] Your fingerprint: {secure_channel.fingerprint}")
    return server_port


def create_native_window(port: int):
    """Create PyObjC native window with WKWebView."""
    from PyObjCTools import AppHelper
    import Cocoa, WebKit, objc

    app = Cocoa.NSApplication.sharedApplication()
    app.setActivationPolicy_(Cocoa.NSApplicationActivationPolicyRegular)

    # Menu bar (Cmd+Q)
    menubar = Cocoa.NSMenu.alloc().init()
    app_item = Cocoa.NSMenuItem.alloc().init()
    menubar.addItem_(app_item)
    app_menu = Cocoa.NSMenu.alloc().init()
    app_item.setSubmenu_(app_menu)
    quit_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "Quit Isaac Secure Messenger", b'terminate:', 'q')
    app_menu.addItem_(quit_item)
    app.setMainMenu_(menubar)

    # Window
    rect = Cocoa.NSMakeRect(0, 0, 1100, 750)
    style = (Cocoa.NSTitledWindowMask | Cocoa.NSClosableWindowMask |
             Cocoa.NSMiniaturizableWindowMask | Cocoa.NSResizableWindowMask)
    window = Cocoa.NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
        rect, style, Cocoa.NSBackingStoreBuffered, False)
    window.setTitle_("Isaac Secure Messenger")
    window.setMinSize_(Cocoa.NSMakeSize(700, 500))
    window.center()

    # WKWebView
    webview = WebKit.WKWebView.alloc().initWithFrame_(Cocoa.NSMakeRect(0, 0, 1100, 750))
    webview.setAutoresizingMask_(Cocoa.NSViewWidthSizable | Cocoa.NSViewHeightSizable)

    # SSL delegate for IsaacNet proxy
    class SSLDelegate(Cocoa.NSObject):
        def webView_didReceiveAuthenticationChallenge_completionHandler_(self, wv, challenge, handler):
            ps = challenge.protectionSpace()
            if ps.authenticationMethod() == Cocoa.NSURLAuthenticationMethodServerTrust:
                cred = Cocoa.NSURLCredential.credentialForTrust_(ps.serverTrust())
                handler(Cocoa.NSURLSessionAuthChallengeUseCredential, cred)
            else:
                handler(Cocoa.NSURLSessionAuthChallengePerformDefaultHandling, None)

    ssl_delegate = SSLDelegate.alloc().init()
    webview.setNavigationDelegate_(ssl_delegate)

    # Load the app
    url = Cocoa.NSURL.URLWithString_(f"http://127.0.0.1:{port}/")
    req = Cocoa.NSURLRequest.requestWithURL_(url)
    webview.loadRequest_(req)

    window.setContentView_(webview)
    window.makeKeyAndOrderFront_(None)
    app.activateIgnoringOtherApps_(True)

    # AppDelegate for clean shutdown
    class AppDelegate(Cocoa.NSObject):
        def applicationShouldTerminateAfterLastWindowClosed_(self, notification):
            return True
        def applicationWillTerminate_(self, notification):
            secure_channel.stop()
            if peer_discovery:
                peer_discovery.stop()

    delegate = AppDelegate.alloc().init()
    app.setDelegate_(delegate)

    # Cleanup on SIGTERM/SIGINT
    def cleanup(*a):
        secure_channel.stop()
        if peer_discovery:
            peer_discovery.stop()
        sys.exit(0)
    signal.signal(signal.SIGTERM, cleanup)
    signal.signal(signal.SIGINT, cleanup)

    AppHelper.runEventLoop()


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Isaac Secure Messenger")
    parser.add_argument("--name", default="", help="Display name")
    parser.add_argument("--port", type=int, default=0, help="Server port")
    parser.add_argument("--no-gui", action="store_true",
                       help="Run without GUI (CLI mode)")
    parser.add_argument("--fingerprint", action="store_true",
                       help="Show fingerprint and exit")
    args = parser.parse_args()

    if args.fingerprint:
        # Create temporary bundle just to show fingerprint
        from x3dh_protocol import IdentityKeyBundle
        bundle_path = os.path.join(DATA_DIR, "key_bundle.json")
        if os.path.exists(bundle_path):
            from x3dh_protocol import load_key_bundle
            bundle = load_key_bundle(bundle_path)
        else:
            bundle_b = X3DHKeyBundle()
            bundle_b.generate_signed_pre_key()
            bundle_b.generate_one_time_keys(20)
            save_key_bundle(bundle_b, os.path.join(DATA_DIR, "key_bundle.json"))
        print(bundle.identity.fingerprint)
        return

    display_name = args.name or os.getenv("USER", "Anonymous")

    # Start Flask HTTP server on a background thread
    http_port = args.port or 0
    import socket as _sock
    if http_port == 0:
        _s = _sock.socket(_sock.AF_INET, _sock.SOCK_STREAM)
        _s.bind(("127.0.0.1", 0))
        http_port = _s.getsockname()[1]
        _s.close()

    def run_flask():
        import urllib.parse
        app.run(host="127.0.0.1", port=http_port, debug=False, use_reloader=False)
    threading.Thread(target=run_flask, daemon=True).start()
    time.sleep(0.3)  # Let Flask start

    port = start_app(display_name)

    print(f"\n  ╔══════════════════════════════════════════╗")
    print(f"  ║     Isaac Secure Messenger               ║")
    print(f"  ║     HTTP API on port {http_port:<5}             ║")
    print(f"  ║     P2P on port {port:<5}                    ║")
    print(f"  ╚══════════════════════════════════════════╝")
    print(f"  Fingerprint: {secure_channel.fingerprint}")
    print(f"  Peer discovery via Bonjour: _isaacmsg._tcp")
    print(f"  Proxy: {'ENABLED' if proxy.is_enabled else 'NOT DETECTED'}")
    print()

    if args.no_gui:
        print("Running in CLI mode. Press Ctrl+C to stop.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
    else:
        create_native_window(http_port)


if __name__ == "__main__":
    main()
