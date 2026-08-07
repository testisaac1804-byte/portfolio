"""
Isaac Secure Messenger — Secure Channel
Ties together X3DH key agreement + Double Ratchet + TCP transport.
"""
import json, os, time, threading, base64, uuid, queue
from typing import Optional, Callable

from crypto_utils import generate_x25519_keypair, hkdf_expand, KEY_LEN, RATCHET_INFO
from x3dh_protocol import (
    X3DHKeyBundle, X3DHSession, IdentityKeyBundle,
    x3dh_initiate, x3dh_respond,
    OneTimePreKey, SignedPreKey,
    save_key_bundle, load_key_bundle,
    save_session, load_session,
)
from double_ratchet import DoubleRatchet, save_ratchet, load_ratchet
from peer_discovery import SecureTransport


# ── Message types ──────────────────────────────────────────────────────────

MSG_TYPE_X3DH_INIT = "x3dh_init"       # X3DH initiation
MSG_TYPE_CIPHERTEXT = "ciphertext"      # Regular encrypted message
MSG_TYPE_FILE_META = "file_meta"        # File transfer metadata
MSG_TYPE_FILE_CHUNK = "file_chunk"      # File transfer chunk
MSG_TYPE_VOICE_NOTE = "voice_note"      # Voice note
MSG_TYPE_DISAPPEAR = "disappear"        # Disappearing message timer
MSG_TYPE_ACK = "ack"                    # Delivery acknowledgment
MSG_TYPE_TYPING = "typing"              # Typing indicator
MSG_TYPE_PING = "ping"                 # Keepalive
MSG_TYPE_PONG = "pong"                 # Keepalive response


# ── Secure Channel ─────────────────────────────────────────────────────────

class SecureChannel:
    """
    Full secure channel managing X3DH key agreement, Double Ratchet,
    TCP transport, and message serialization.
    """

    def __init__(self, data_dir: str, display_name: str = ""):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)

        # Key bundle
        bundle_path = os.path.join(data_dir, "key_bundle.json")
        if os.path.exists(bundle_path):
            self.key_bundle = load_key_bundle(bundle_path)
        else:
            self.key_bundle = X3DHKeyBundle()
            self.key_bundle.generate_signed_pre_key()
            self.key_bundle.generate_one_time_keys(20)
            save_key_bundle(self.key_bundle, bundle_path)

        self.display_name = display_name
        self.peer_display_name = ""

        # Sessions: peer_fingerprint -> (session, ratchet)
        self.sessions = {}
        self.ratchets = {}

        # Active transport
        self.transport: Optional[SecureTransport] = None
        self.transport_lock = threading.Lock()

        # Callbacks
        self.on_message: Optional[Callable] = None
        self.on_file: Optional[Callable] = None
        self.on_voice_note: Optional[Callable] = None
        self.on_disappear_timer: Optional[Callable] = None
        self.on_peer_connected: Optional[Callable] = None
        self.on_peer_disconnected: Optional[Callable] = None
        self.on_error: Optional[Callable] = None

        # Running state
        self._running = False
        self._recv_thread: Optional[threading.Thread] = None

        # IsaacNet proxy reference
        self.proxy_port = 8541  # Default IsaacNet CONNECT proxy port
        self.use_proxy = False

    @property
    def fingerprint(self) -> str:
        return self.key_bundle.identity.fingerprint

    def get_public_bundle(self) -> dict:
        """Get our public bundle for sharing with peers."""
        return self.key_bundle.get_public_bundle()

    # ── Session Management ──────────────────────────────────────────────

    def initiate_session(self, peer_public_bundle: dict,
                         their_fingerprint: str) -> tuple:
        """
        Initiate an X3DH session as Alice.
        Returns (session, initial_message).
        """
        session = x3dh_initiate(self.key_bundle.identity, peer_public_bundle)
        ratchet = DoubleRatchet(
            shared_secret=session.shared_secret,
            their_public_key=peer_public_bundle["signed_pre_key"]["public"],
            is_initiator=True,
        )

        self.sessions[their_fingerprint] = session
        self.ratchets[their_fingerprint] = ratchet

        # Save session
        session_path = os.path.join(self.data_dir, f"session_{their_fingerprint[:8]}.json")
        save_session(session, session_path)

        # Save ratchet
        ratchet_path = os.path.join(self.data_dir, f"ratchet_{their_fingerprint[:8]}.json")
        save_ratchet(ratchet, ratchet_path)

        # Build initial X3DH message to send to peer
        init_msg = {
            "type": MSG_TYPE_X3DH_INIT,
            "session_id": session.session_id,
            "identity_key": self.key_bundle.identity.public,
            "ephemeral_key": session.initiator_ephemeral_public,
            "used_opk_id": session.used_opk_id,
            "our_fingerprint": self.fingerprint,
            "our_display_name": self.display_name,
        }

        return session, init_msg

    def handle_x3dh_init(self, msg: dict) -> X3DHSession:
        """
        Handle incoming X3DH initiation from a peer (Bob's side).
        Returns the session.
        """
        initiator_ik = msg["identity_key"]
        ephem_pub = msg["ephemeral_key"]
        opk_id = msg["used_opk_id"]
        their_fingerprint = msg["our_fingerprint"]

        # Find the used OPK
        used_opk = None
        for opk in self.key_bundle.one_time_pre_keys:
            if opk.key_id == opk_id:
                used_opk = opk
                break

        session_id = msg["session_id"]
        session = x3dh_respond(
            session_id, self.key_bundle,
            ephem_pub, initiator_ik,
            used_opk if used_opk else None,
        )

        # Save updated key bundle (OPK removed)
        bundle_path = os.path.join(self.data_dir, "key_bundle.json")
        save_key_bundle(self.key_bundle, bundle_path)

        # Create Double Ratchet (responder side)
        ratchet = DoubleRatchet(
            shared_secret=session.shared_secret,
            their_public_key=ephem_pub,
            is_initiator=False,
        )

        self.sessions[their_fingerprint] = session
        self.ratchets[their_fingerprint] = ratchet

        # Save
        session_path = os.path.join(self.data_dir, f"session_{their_fingerprint[:8]}.json")
        save_session(session, session_path)
        ratchet_path = os.path.join(self.data_dir, f"ratchet_{their_fingerprint[:8]}.json")
        save_ratchet(ratchet, ratchet_path)

        self.peer_display_name = msg.get("our_display_name", their_fingerprint)
        return session

    def get_ratchet(self, their_fingerprint: str) -> DoubleRatchet:
        return self.ratchets.get(their_fingerprint)

    # ── Message Encryption / Decryption ─────────────────────────────────

    def encrypt_message(self, their_fingerprint: str,
                        plaintext: str) -> Optional[dict]:
        """Encrypt a plaintext message using the Double Ratchet."""
        ratchet = self.ratchets.get(their_fingerprint)
        if not ratchet:
            if self.on_error:
                self.on_error(f"No session with {their_fingerprint}")
            return None

        result = ratchet.encrypt_message(plaintext.encode("utf-8"))

        # Save ratchet state
        ratchet_path = os.path.join(self.data_dir, f"ratchet_{their_fingerprint[:8]}.json")
        save_ratchet(ratchet, ratchet_path)

        return {
            "type": MSG_TYPE_CIPHERTEXT,
            "sender_fingerprint": self.fingerprint,
            "from": self.display_name,
            **result
        }

    def decrypt_message(self, their_fingerprint: str,
                        msg: dict) -> Optional[str]:
        """Decrypt a ciphertext message."""
        ratchet = self.ratchets.get(their_fingerprint)
        if not ratchet:
            if self.on_error:
                self.on_error(f"No session with {their_fingerprint}")
            return None

        plaintext = ratchet.decrypt_message(msg)

        # Save ratchet state
        ratchet_path = os.path.join(self.data_dir, f"ratchet_{their_fingerprint[:8]}.json")
        save_ratchet(ratchet, ratchet_path)

        return plaintext.decode("utf-8", errors="replace")

    def encrypt_file_key(self, their_fingerprint: str) -> Optional[bytes]:
        """Derive a file encryption key from the ratchet state."""
        from crypto_utils import secure_random
        file_key = secure_random(32)
        # Encrypt the file key with our session
        msg = self.encrypt_message(their_fingerprint,
                                    f"__FILE_KEY__:{base64.b64encode(file_key).decode()}")
        return file_key, msg

    # ── Transport ───────────────────────────────────────────────────────

    def start_server(self, port: int = 0) -> int:
        """Start listening for incoming connections. Returns actual port."""
        transport = SecureTransport()
        actual_port = transport.listen("0.0.0.0", port)
        self.transport = transport
        self._running = True

        self._recv_thread = threading.Thread(target=self._accept_loop,
                                              daemon=True)
        self._recv_thread.start()
        return actual_port

    def _accept_loop(self):
        """Background thread: accept connections and handle them."""
        while self._running:
            try:
                client = self.transport.accept()
                if client:
                    threading.Thread(target=self._handle_peer,
                                     args=(client,), daemon=True).start()
            except Exception as e:
                if self._running:
                    time.sleep(0.5)

    def connect_to_peer(self, host: str, port: int) -> bool:
        """Connect to a peer's server."""
        transport = SecureTransport()
        try:
            transport.connect(host, port)
            threading.Thread(target=self._handle_peer,
                             args=(transport,), daemon=True).start()
            return True
        except Exception as e:
            if self.on_error:
                self.on_error(f"Connection failed: {e}")
            return False

    def _handle_peer(self, transport: SecureTransport):
        """Handle communication with a connected peer."""
        addr = transport.peer_address or ("unknown", 0)

        peer_fp = None  # Will be set after X3DH init

        while self._running and transport.is_connected():
            try:
                raw = transport.recv_frame()
                if raw is None:
                    break

                msg = json.loads(raw.decode("utf-8"))
                msg_type = msg.get("type")

                if msg_type == MSG_TYPE_X3DH_INIT:
                    # Incoming X3DH handshake
                    their_fp = msg["our_fingerprint"]
                    peer_fp = their_fp
                    self.handle_x3dh_init(msg)
                    if self.on_peer_connected:
                        self.on_peer_connected(their_fp, msg.get("our_display_name", ""))

                elif msg_type == MSG_TYPE_CIPHERTEXT:
                    their_fp = msg.get("sender_fingerprint") or peer_fp
                    if their_fp and self.on_message:
                        plain = self.decrypt_message(their_fp, msg)
                        self.on_message(their_fp, plain)

                elif msg_type == MSG_TYPE_FILE_META:
                    their_fp = msg.get("sender_fingerprint") or peer_fp
                    if their_fp and self.on_file:
                        self.on_file(their_fp, msg)

                elif msg_type == MSG_TYPE_VOICE_NOTE:
                    their_fp = msg.get("sender_fingerprint") or peer_fp
                    if their_fp and self.on_voice_note:
                        self.on_voice_note(their_fp, msg)

                elif msg_type == MSG_TYPE_DISAPPEAR:
                    if self.on_disappear_timer:
                        self.on_disappear_timer(
                            msg.get("sender_fingerprint") or peer_fp,
                            msg
                        )

                elif msg_type == MSG_TYPE_ACK:
                    pass  # Delivery success

                elif msg_type == MSG_TYPE_PING:
                    transport.send_frame(json.dumps({"type": MSG_TYPE_PONG}).encode())

                elif msg_type == MSG_TYPE_PONG:
                    pass

            except (json.JSONDecodeError, ConnectionError, OSError) as e:
                break

        # Disconnected
        transport.close()
        if peer_fp and self.on_peer_disconnected:
            self.on_peer_disconnected(peer_fp)

    def send_message(self, transport: SecureTransport, msg: dict):
        """Send a raw message over transport."""
        payload = json.dumps(msg).encode("utf-8")
        transport.send_frame(payload)

    def stop(self):
        """Stop all networking."""
        self._running = False
        if self.transport:
            self.transport.close()
            self.transport = None
