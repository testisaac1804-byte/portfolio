"""
Isaac Secure Messenger — Peer Discovery
Local network discovery via Zeroconf/Bonjour (_isaacmsg._tcp)
+ optional Bluetooth LE scanning.
"""
import socket, json, time, threading, uuid
from typing import Callable, Optional

try:
    from zeroconf import Zeroconf, ServiceInfo, ServiceBrowser, ServiceStateChange
    ZEROCONF_AVAILABLE = True
except ImportError:
    ZEROCONF_AVAILABLE = False

SERVICE_TYPE = "_isaacmsg._tcp.local."
SERVICE_PORT = 0  # Assigned at runtime

_discovered_peers = {}  # name -> PeerInfo
_peers_lock = threading.Lock()

class PeerInfo:
    """Represents a discovered peer on the network."""
    def __init__(self, name: str, host: str, port: int,
                 fingerprint: str = "", display_name: str = "",
                 properties: dict = None):
        self.name = name
        self.host = host
        self.port = port
        self.fingerprint = fingerprint
        self.display_name = display_name or name
        self.properties = properties or {}
        self.first_seen = time.time()
        self.last_seen = time.time()

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "host": self.host,
            "port": self.port,
            "fingerprint": self.fingerprint,
            "display_name": self.display_name,
            "first_seen": self.first_seen,
            "last_seen": self.last_seen,
        }

    def is_online(self, timeout: float = 30) -> bool:
        return (time.time() - self.last_seen) < timeout


class PeerDiscovery:
    """
    Discovers and advertises Isaac Secure Messenger peers on the local network.
    Uses Zeroconf/Bonjour for mDNS service discovery.
    """
    def __init__(self, service_port: int, display_name: str = "",
                 fingerprint: str = "", device_id: str = None):
        self.service_port = service_port
        self.display_name = display_name
        self.fingerprint = fingerprint
        self.device_id = device_id or str(uuid.uuid4())[:8]
        self._zeroconf = None
        self._service_info = None
        self._browser = None
        self._running = False
        self._on_peer_found: Optional[Callable] = None
        self._on_peer_lost: Optional[Callable] = None

    def set_callbacks(self, on_peer_found: Callable = None,
                      on_peer_lost: Callable = None):
        self._on_peer_found = on_peer_found
        self._on_peer_lost = on_peer_lost

    def start(self):
        """Start advertising and browsing for peers."""
        if not ZEROCONF_AVAILABLE:
            print("[PeerDiscovery] Zeroconf not available, skipping discovery")
            return

        if self._running:
            return
        self._running = True

        local_ip = self._get_local_ip()

        self._zeroconf = Zeroconf()

        # Register our service
        props = {
            "display_name": self.display_name.encode("utf-8"),
            "fingerprint": self.fingerprint.encode("utf-8"),
            "device_id": self.device_id.encode("utf-8"),
            "version": b"1.0",
        }
        self._service_info = ServiceInfo(
            SERVICE_TYPE,
            f"{self.display_name or self.device_id}.{SERVICE_TYPE}",
            addresses=[socket.inet_aton(local_ip)],
            port=self.service_port,
            weight=0, priority=0,
            properties=props,
        )
        self._zeroconf.register_service(self._service_info)

        # Browse for other services
        self._browser = ServiceBrowser(
            self._zeroconf, SERVICE_TYPE, [self._on_service_state_change]
        )

        print(f"[PeerDiscovery] Advertising on {local_ip}:{self.service_port}")

    def stop(self):
        """Stop advertising and browsing."""
        self._running = False
        if self._zeroconf:
            try:
                if self._service_info:
                    self._zeroconf.unregister_service(self._service_info)
                self._zeroconf.close()
            except Exception:
                pass
            self._zeroconf = None
            self._service_info = None
            self._browser = None

    def _on_service_state_change(self, zeroconf, service_type, name, state_change):
        if state_change == ServiceStateChange.Added:
            info = zeroconf.get_service_info(service_type, name)
            if info:
                peer = PeerInfo(
                    name=name,
                    host=socket.inet_ntoa(info.addresses[0]) if info.addresses else "0.0.0.0",
                    port=info.port,
                    fingerprint=info.properties.get(b"fingerprint", b"").decode(),
                    display_name=info.properties.get(b"display_name", name).decode(),
                    properties={k.decode(): v.decode() if isinstance(v, bytes) else v
                               for k, v in info.properties.items()},
                )
                # Don't add ourselves
                our_fp = self.fingerprint.encode("utf-8")
                if info.properties.get(b"fingerprint") == our_fp:
                    return

                with _peers_lock:
                    _discovered_peers[peer.fingerprint or name] = peer

                print(f"[PeerDiscovery] Found peer: {peer.display_name} at {peer.host}:{peer.port}")
                if self._on_peer_found:
                    self._on_peer_found(peer)

        elif state_change == ServiceStateChange.Removed:
            with _peers_lock:
                to_remove = [k for k, v in _discovered_peers.items() if name in v.name]
                for k in to_remove:
                    peer = _discovered_peers.pop(k, None)
                    if peer and self._on_peer_lost:
                        self._on_peer_lost(peer)

    @staticmethod
    def _get_local_ip() -> str:
        """Get the local IP address (best guess for the active interface)."""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(2)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return "127.0.0.1"

    @staticmethod
    def get_discovered_peers() -> list:
        """Get list of currently discovered peers."""
        with _peers_lock:
            return [p.to_dict() for p in _discovered_peers.values()]


# ── TCP Transport Layer ────────────────────────────────────────────────────

class SecureTransport:
    """
    Raw TCP transport for peer-to-peer communication.
    Sends/receives length-prefixed frames over a socket.
    All payloads are encrypted at the Double Ratchet layer.
    """
    def __init__(self, sock: socket.socket = None):
        self.sock = sock
        self.buffer = b""

    def connect(self, host: str, port: int, timeout: float = 10):
        """Connect to a peer."""
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.settimeout(timeout)
        self.sock.connect((host, port))

    def listen(self, host: str, port: int, backlog: int = 5) -> int:
        """Start listening and return the actual port."""
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((host, port))
        self.sock.listen(backlog)
        self.sock.settimeout(1.0)
        return self.sock.getsockname()[1]

    def accept(self) -> Optional["SecureTransport"]:
        """Accept a connection. Returns None on timeout."""
        try:
            client_sock, addr = self.sock.accept()
            st = SecureTransport(client_sock)
            st.peer_addr = addr
            return st
        except socket.timeout:
            return None

    def send_frame(self, data: bytes):
        """Send a length-prefixed frame."""
        if not self.sock:
            raise RuntimeError("Not connected")
        length = len(data).to_bytes(4, "big")
        self.sock.sendall(length + data)

    def recv_frame(self) -> Optional[bytes]:
        """Receive a length-prefixed frame. Returns None on timeout/disconnect."""
        if not self.sock:
            return None
        try:
            # Read 4-byte length header
            header = self._recv_exact(4)
            if header is None:
                return None
            length = int.from_bytes(header, "big")
            if length == 0:
                return b""
            return self._recv_exact(length)
        except (socket.timeout, ConnectionError, OSError):
            return None

    def _recv_exact(self, n: int) -> Optional[bytes]:
        """Read exactly n bytes from the socket."""
        data = b""
        while len(data) < n:
            chunk = self.sock.recv(n - len(data))
            if not chunk:
                return None
            data += chunk
        return data

    def close(self):
        if self.sock:
            try:
                self.sock.close()
            except OSError:
                pass
            self.sock = None

    def is_connected(self) -> bool:
        return self.sock is not None

    @property
    def peer_address(self) -> tuple:
        if self.sock:
            try:
                return self.sock.getpeername()
            except OSError:
                return None
        return None
