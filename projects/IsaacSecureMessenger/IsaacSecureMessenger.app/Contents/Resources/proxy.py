"""
Isaac Secure Messenger — IsaacNet Proxy Integration
Transparently routes TCP connections through the IsaacNet CONNECT proxy
when on school WiFi (or any filtered network).
"""
import os, socket, select, threading, time, json
from typing import Optional


class IsaacNetProxy:
    """
    Transparent proxy router. Detects if IsaacNet proxy is running
    (on port 8541 by default) and routes traffic through it.
    """
    DEFAULT_PROXY_PORT = 8541

    def __init__(self, proxy_host: str = "127.0.0.1",
                 proxy_port: int = None):
        self.proxy_host = proxy_host
        self.proxy_port = proxy_port or self.DEFAULT_PROXY_PORT
        self._enabled = False
        self._detected = False

    def detect(self) -> bool:
        """Check if IsaacNet proxy is running on the configured port."""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect((self.proxy_host, self.proxy_port))
            # Proxy is listening — send a test CONNECT
            s.sendall(
                b"CONNECT 1.1.1.1:443 HTTP/1.1\r\n"
                b"Host: 1.1.1.1:443\r\n"
                b"\r\n"
            )
            resp = s.recv(1024)
            s.close()
            if b"200" in resp:
                self._detected = True
                self._enabled = True
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            pass
        self._detected = False
        self._enabled = False
        return False

    @property
    def is_enabled(self) -> bool:
        return self._enabled

    def enable(self):
        self._enabled = True

    def disable(self):
        self._enabled = False

    def create_socket(self, host: str, port: int,
                      timeout: float = 10) -> Optional[socket.socket]:
        """
        Create a socket connection to the target, either directly
        or through the IsaacNet CONNECT proxy.
        """
        if self._enabled:
            return self._connect_via_proxy(host, port, timeout)
        else:
            return self._connect_direct(host, port, timeout)

    def _connect_direct(self, host: str, port: int,
                        timeout: float) -> Optional[socket.socket]:
        """Direct TCP connection."""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(timeout)
            s.connect((host, port))
            s.settimeout(None)
            return s
        except (socket.timeout, ConnectionRefusedError, OSError):
            return None

    def _connect_via_proxy(self, host: str, port: int,
                           timeout: float) -> Optional[socket.socket]:
        """Connect through the IsaacNet CONNECT proxy."""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(timeout)

            # First check if proxy is alive
            proxy_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            proxy_sock.settimeout(3)
            proxy_sock.connect((self.proxy_host, self.proxy_port))
            proxy_sock.close()

            s.connect((self.proxy_host, self.proxy_port))

            # Send CONNECT request
            connect_req = (
                f"CONNECT {host}:{port} HTTP/1.1\r\n"
                f"Host: {host}:{port}\r\n"
                f"User-Agent: IsaacSecureMessenger/1.0\r\n"
                f"\r\n"
            ).encode()
            s.sendall(connect_req)

            # Read response
            resp = b""
            while b"\r\n\r\n" not in resp:
                chunk = s.recv(4096)
                if not chunk:
                    break
                resp += chunk
                if len(resp) > 4096:
                    break

            if b"200" in resp:
                s.settimeout(None)
                return s
            else:
                s.close()
                # Proxy responded but no tunnel — fall back to direct
                return self._connect_direct(host, port, timeout)

        except (socket.timeout, ConnectionRefusedError, OSError) as e:
            # Proxy unavailable — fall back to direct connection
            return self._connect_direct(host, port, timeout)

    # ── Proxy tunnel (bidirectional pipe) ──────────────────────────────

    @staticmethod
    def proxy_pipe(local_sock: socket.socket,
                   remote_sock: socket.socket,
                   timeout: float = 60):
        """
        Bidirectional pipe between two sockets.
        Blocks until either side disconnects or timeout.
        """
        socks = [local_sock, remote_sock]
        try:
            while True:
                r, _, _ = select.select(socks, [], [], timeout)
                if not r:
                    break
                for sock in r:
                    data = sock.recv(65536)
                    if not data:
                        return
                    if sock == local_sock:
                        remote_sock.sendall(data)
                    else:
                        local_sock.sendall(data)
        except (ConnectionError, OSError):
            pass
        finally:
            try:
                local_sock.close()
            except OSError:
                pass
            try:
                remote_sock.close()
            except OSError:
                pass


# ── Auto-detect proxy on startup ──────────────────────────────────────────

def auto_detect_proxy() -> IsaacNetProxy:
    """
    Automatically detect if IsaacNet proxy is running.
    Tries port 8541 (default), then checks if we can reach the internet
    without a proxy (if not, proxy is needed).
    """
    proxy = IsaacNetProxy()

    # Try default port
    if proxy.detect():
        print("[Proxy] IsaacNet CONNECT proxy detected on port 8541")
        proxy.enable()
        return proxy

    # Try common alternative ports
    for port in [8080, 3128, 8888]:
        proxy.proxy_port = port
        if proxy.detect():
            print(f"[Proxy] IsaacNet CONNECT proxy detected on port {port}")
            proxy.enable()
            return proxy

    # Check if we can reach the internet directly
    proxy.proxy_port = IsaacNetProxy.DEFAULT_PROXY_PORT
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3)
        s.connect(("1.1.1.1", 443))
        s.close()
        print("[Proxy] Direct internet access available, proxy not needed")
        proxy.disable()
    except (socket.timeout, OSError):
        # Can't reach internet directly — try proxy anyway
        proxy.enable()
        print("[Proxy] No direct internet, enabling proxy routing")

    return proxy
