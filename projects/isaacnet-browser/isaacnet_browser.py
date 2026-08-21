#!/usr/bin/env python3
"""
IsaacNet Browser — self-contained macOS browser that routes all traffic
through a DoH DNS + CONNECT proxy to bypass school filtering.

    python3 isaacnet_browser.py [proxy_port]

Defaults to CONNECT proxy on 127.0.0.1:8541. Closing the window restores
the normal network state.

Bypass layers:
  1. DoH DNS      — resolves every hostname over HTTPS (hides DNS lookups)
  2. CONNECT      — tunnels HTTPS through a local proxy that connects to the
                    *resolved IP* directly (hides the destination from DNS filters)
  3. Cert bypass  — accepts self-signed/MITM certs so pages still load when the
                    school runs SSL inspection

Only stdlib + PyObjC required (no pip deps).
"""

import base64
import json
import logging
import os
import select
import signal
import socket
import ssl
import struct
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request

from PyObjCTools import AppHelper
import Cocoa
import WebKit
import objc
from Foundation import (
    NSURLSessionAuthChallengeUseCredential,
    NSURLSessionAuthChallengeCancelAuthenticationChallenge,
)

PROXY_PORT = 8541
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) IsaacNet/2.0"

LOG_FILE = os.path.expanduser("~/.isaacnet.log")
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("isaacnet")


# ─────────────────────────────────────────────────────────────────────────────
# Layer 1 — DoH DNS resolution (multi-provider, IP-direct with Host override)
# ─────────────────────────────────────────────────────────────────────────────

# (host, wire_path, json_path, primary IP, secondary IP)
DOH_PROVIDERS = [
    ("cloudflare-dns.com", "/dns-query", "/dns-query", "1.1.1.1", "1.0.0.1"),
    ("dns.google",         "/dns-query", "/resolve",    "8.8.8.8", "8.8.4.4"),
    ("dns.quad9.net",      "/dns-query", "/dns-query",  "9.9.9.9", "149.112.112.112"),
]


def _opener():
    """HTTP opener that ignores SSL certs (bypass MITM) and ignores any system
    proxy (so the DoH request itself never loops back through us)."""
    ctx = ssl._create_unverified_context()
    ph = urllib.request.ProxyHandler({})
    hh = urllib.request.HTTPSHandler(context=ctx)
    return urllib.request.build_opener(ph, hh)


def _wire_query(hostname: str) -> bytes:
    """Build a minimal DNS wire-format A-record query."""
    labels = hostname.rstrip(".").split(".")
    buf = b"\xaa\xbb\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00"
    for label in labels:
        buf += struct.pack("B", len(label)) + label.encode()
    buf += b"\x00\x00\x01\x00\x01"  # QTYPE=A, QCLASS=IN
    return buf


def _parse_wire(body: bytes):
    """Extract A records from a DNS wire-format response."""
    try:
        ancount = struct.unpack(">H", body[6:8])[0]
    except struct.error:
        return []
    pos = 12
    # skip question section (qname + QTYPE + QCLASS)
    try:
        while pos < len(body):
            if body[pos] == 0:
                pos += 5
                break
            pos += 1 + body[pos]
    except IndexError:
        return []
    ips = []
    for _ in range(ancount):
        try:
            if pos >= len(body):
                break
            if body[pos] & 0xC0:
                pos += 2
            else:
                while pos < len(body) and body[pos]:
                    pos += 1 + body[pos]
                pos += 1
            if pos + 10 > len(body):
                break
            rtype, _, _, rdlen = struct.unpack(">HHIH", body[pos:pos + 10])
            pos += 10
            if rtype == 1 and rdlen == 4:
                ips.append(".".join(str(b) for b in body[pos:pos + 4]))
            pos += rdlen
        except (struct.error, IndexError):
            break
    return ips


def _doh_wire(hostname: str):
    """RFC 8484 wire-format DoH, connecting to the provider IP directly with a
    Host header override (so the network only sees a connection to the IP)."""
    qb64 = base64.urlsafe_b64encode(_wire_query(hostname)).rstrip(b"=").decode()
    opener = _opener()
    for host, wire_path, _, ip1, ip2 in DOH_PROVIDERS:
        for ip in (ip1, ip2):
            if not ip:
                continue
            try:
                url = f"https://{ip}{wire_path}?dns={qb64}"
                req = urllib.request.Request(
                    url,
                    headers={
                        "Accept": "application/dns-message",
                        "User-Agent": UA,
                        "Host": host,
                    },
                )
                body = opener.open(req, timeout=5).read()
                ips = _parse_wire(body)
                if ips:
                    return ips
            except Exception as e:
                log.debug("wire DoH %s failed: %s", host, e)
                continue
    return []


def _doh_json(hostname: str):
    """JSON API DoH fallback (simpler response format)."""
    opener = _opener()
    for host, _, json_path, ip1, ip2 in DOH_PROVIDERS:
        for ip in (ip1, ip2):
            if not ip:
                continue
            try:
                url = f"https://{ip}{json_path}?name={urllib.parse.quote(hostname)}&type=A"
                req = urllib.request.Request(
                    url,
                    headers={
                        "Accept": "application/dns-json",
                        "User-Agent": UA,
                        "Host": host,
                    },
                )
                data = json.loads(opener.open(req, timeout=5).read())
                ips = [a["data"] for a in data.get("Answer", []) if a.get("type") == 1]
                if ips:
                    return ips
            except Exception as e:
                log.debug("json DoH %s failed: %s", host, e)
                continue
    return []


def doh_resolve(hostname: str):
    """Resolve a hostname to IPs via DoH. Wire format first, JSON fallback."""
    ips = _doh_wire(hostname) or _doh_json(hostname)
    log.info("DoH %s -> %s", hostname, ips)
    return ips


# ─────────────────────────────────────────────────────────────────────────────
# Layer 2 — CONNECT proxy (tunnels HTTPS to the resolved IP)
# ─────────────────────────────────────────────────────────────────────────────

class ConnectProxy:
    def __init__(self, port):
        self.port = port
        self._sock = None

    def start(self):
        self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._sock.bind(("127.0.0.1", self.port))
        self._sock.listen(50)
        self._sock.settimeout(1)
        threading.Thread(target=self._serve, daemon=True).start()
        log.info("CONNECT proxy on 127.0.0.1:%d", self.port)

    def stop(self):
        try:
            self._sock.close()
        except Exception:
            pass

    def _serve(self):
        while True:
            try:
                c, _ = self._sock.accept()
                threading.Thread(target=self._handle, args=(c,), daemon=True).start()
            except socket.timeout:
                continue
            except Exception:
                break

    def _handle(self, c):
        remote = None
        try:
            c.settimeout(30)
            data = b""
            while b"\r\n\r\n" not in data:
                chunk = c.recv(4096)
                if not chunk:
                    return
                data += chunk
            first = data.split(b"\r\n")[0].decode(errors="replace")
            if not first.startswith("CONNECT"):
                c.sendall(b"HTTP/1.1 405 Method Not Allowed\r\n\r\n")
                return
            target = first.split(" ")[1]
            host, port = target.rsplit(":", 1) if ":" in target else (target, "443")
            port = int(port)

            ips = doh_resolve(host)
            if not ips:
                c.sendall(b"HTTP/1.1 502 DNS Failed\r\n\r\n")
                return

            for ip in ips:
                try:
                    remote = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    remote.settimeout(10)
                    remote.connect((ip, port))
                    break
                except Exception:
                    try:
                        remote.close()
                    except Exception:
                        pass
                    remote = None
            if not remote:
                c.sendall(b"HTTP/1.1 502 Bad Gateway\r\n\r\n")
                return

            c.sendall(b"HTTP/1.1 200 Connection Established\r\n\r\n")
            log.info("tunnel %s:%d via %s", host, port, ip)

            # Bidirectional pipe. Long timeout so WebSockets/keepalive survive.
            socks = [c, remote]
            while True:
                rl, _, _ = select.select(socks, [], [], 3600)
                if not rl:
                    break
                for s in rl:
                    chunk = s.recv(65536)
                    if not chunk:
                        return
                    (remote if s is c else c).sendall(chunk)
        except Exception as e:
            log.debug("proxy handler error: %s", e)
        finally:
            try:
                c.close()
            except Exception:
                pass
            try:
                remote.close()
            except Exception:
                pass


# ─────────────────────────────────────────────────────────────────────────────
# System proxy management (auto set on launch, restore on exit)
# ─────────────────────────────────────────────────────────────────────────────

def _detect_service():
    try:
        r = subprocess.run(
            ["networksetup", "-listallnetworkservices"],
            capture_output=True, text=True, timeout=5,
        )
        for s in r.stdout.strip().split("\n"):
            s = s.strip()
            if not s or s.startswith("An") or "VPN" in s:
                continue
            try:
                r2 = subprocess.run(
                    ["networksetup", "-getinfo", s],
                    capture_output=True, text=True, timeout=3,
                )
                if "IP address" in r2.stdout:
                    return s
            except Exception:
                continue
    except Exception:
        pass
    return "Wi-Fi"


NET_SERVICE = _detect_service()


def proxy_on(port=PROXY_PORT):
    subprocess.run(
        ["networksetup", "-setwebproxy", NET_SERVICE, "127.0.0.1", str(port), "off"],
        capture_output=True, timeout=5,
    )
    subprocess.run(
        ["networksetup", "-setsecurewebproxy", NET_SERVICE, "127.0.0.1", str(port), "off"],
        capture_output=True, timeout=5,
    )
    log.info("system proxy -> 127.0.0.1:%d (%s)", port, NET_SERVICE)


def proxy_off():
    subprocess.run(
        ["networksetup", "-setwebproxystate", NET_SERVICE, "off"],
        capture_output=True, timeout=5,
    )
    subprocess.run(
        ["networksetup", "-setsecurewebproxystate", NET_SERVICE, "off"],
        capture_output=True, timeout=5,
    )
    log.info("system proxy restored")


# ─────────────────────────────────────────────────────────────────────────────
# Browser UI (PyObjC WKWebView)
# ─────────────────────────────────────────────────────────────────────────────

HOME_HTML = """<!doctype html><html><head><meta charset="utf-8">
<style>
body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;
background:linear-gradient(135deg,#0f172a,#1e293b);font-family:-apple-system,sans-serif;color:#e2e8f0}
.card{text-align:center;padding:40px}
h1{font-size:34px;margin:0 0 6px}
.badge{display:inline-block;background:#10b981;color:#052e16;font-weight:700;
padding:4px 14px;border-radius:999px;font-size:14px;letter-spacing:.5px}
p{color:#94a3b8;margin:18px 0 4px;font-size:15px}
code{background:#0b1220;padding:2px 8px;border-radius:6px;font-size:13px;color:#7dd3fc}
</style></head><body><div class="card">
<h1>🔒 IsaacNet</h1><span class="badge">DOH + CONNECT ACTIVE</span>
<p>Type an address in the bar above — traffic is resolved over HTTPS<br>
and tunnelled straight to the site's IP.</p>
<p><code>127.0.0.1:""" + str(PROXY_PORT) + """</code></p>
</div></body></html>"""


def normalize_url(s):
    s = s.strip()
    if not s:
        return None
    if s.startswith(("http://", "https://")):
        return s
    # Looks like a domain -> https
    if "." in s and " " not in s:
        return "https://" + s
    # Otherwise search DuckDuckGo
    return "https://duckduckgo.com/?q=" + urllib.parse.quote(s)


class AppDelegate(Cocoa.NSObject):
    def applicationDidFinishLaunching_(self, note):
        # ── Window ──
        self.win = Cocoa.NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
            Cocoa.NSMakeRect(80, 80, 1100, 760),
            Cocoa.NSTitledWindowMask | Cocoa.NSClosableWindowMask |
            Cocoa.NSMiniaturizableWindowMask | Cocoa.NSResizableWindowMask,
            Cocoa.NSBackingStoreBuffered, False,
        )
        self.win.setTitle_("IsaacNet")
        self.win.setMinSize_(Cocoa.NSMakeSize(520, 360))

        content = self.win.contentView()
        W, H = 1100, 760

        # ── Toolbar ──
        toolbar = Cocoa.NSView.alloc().initWithFrame_(Cocoa.NSMakeRect(0, H - 44, W, 44))
        toolbar.setAutoresizingMask_(Cocoa.NSViewWidthSizable | Cocoa.NSViewMinYMargin)
        content.addSubview_(toolbar)

        def button(title, x, w, action):
            b = Cocoa.NSButton.alloc().initWithFrame_(Cocoa.NSMakeRect(x, 8, w, 28))
            b.setTitle_(title)
            b.setTarget_(self)
            b.setAction_(action)
            toolbar.addSubview_(b)
            return b

        self.btn_back = button("‹", 8, 30, "onBack:")
        self.btn_fwd = button("›", 42, 30, "onFwd:")
        self.btn_reload = button("⟳", 76, 30, "onReload:")
        self.btn_home = button("⌂", 110, 30, "onHome:")

        # URL field
        self.url_field = Cocoa.NSTextField.alloc().initWithFrame_(
            Cocoa.NSMakeRect(148, 10, W - 148 - 80, 24)
        )
        self.url_field.setAutoresizingMask_(Cocoa.NSViewWidthSizable)
        self.url_field.setPlaceholderString_("Search or enter address")
        self.url_field.setTarget_(self)
        self.url_field.setAction_("onGo:")
        toolbar.addSubview_(self.url_field)

        self.btn_go = button("Go", W - 72, 52, "onGo:")
        self.btn_go.setAutoresizingMask_(Cocoa.NSViewMinXMargin)

        # ── Web view ──
        cfg = WebKit.WKWebViewConfiguration.alloc().init()
        prefs = WebKit.WKPreferences.alloc().init()
        prefs.setJavaScriptEnabled_(True)
        cfg.setPreferences_(prefs)
        self.web = WebKit.WKWebView.alloc().initWithFrame_configuration_(
            Cocoa.NSMakeRect(0, 0, W, H - 44), cfg
        )
        self.web.setAutoresizingMask_(Cocoa.NSViewWidthSizable | Cocoa.NSViewHeightSizable)
        self.web.setNavigationDelegate_(self)
        self.web.setUIDelegate_(self)
        content.addSubview_(self.web)

        # Home page
        self.web.loadHTMLString_baseURL_(HOME_HTML, Cocoa.NSURL.URLWithString_("about:blank"))

        self.win.makeKeyAndOrderFront_(None)
        Cocoa.NSApplication.sharedApplication().activateIgnoringOtherApps_(True)
        self._refresh_buttons()
        log.info("browser window ready")

    # ── Actions ──
    def onGo_(self, sender):
        u = normalize_url(self.url_field.stringValue())
        if u:
            self.web.loadRequest_(Cocoa.NSURLRequest.requestWithURL_(Cocoa.NSURL.URLWithString_(u)))

    def onBack_(self, sender):
        if self.web.canGoBack():
            self.web.goBack_()

    def onFwd_(self, sender):
        if self.web.canGoForward():
            self.web.goForward_()

    def onReload_(self, sender):
        self.web.reload_(None)

    def onHome_(self, sender):
        self.web.loadHTMLString_baseURL_(HOME_HTML, Cocoa.NSURL.URLWithString_("about:blank"))

    def _refresh_buttons(self):
        self.btn_back.setEnabled_(bool(self.web.canGoBack()))
        self.btn_fwd.setEnabled_(bool(self.web.canGoForward()))

    # ── Navigation delegate ──
    def webView_didCommitNavigation_(self, w, n):
        self.url_field.setStringValue_(str(w.URL().absoluteString()))
        self._refresh_buttons()

    def webView_didFinishNavigation_(self, w, n):
        self._refresh_buttons()

    def webView_didFailNavigation_withError_(self, w, n, err):
        log.warning("nav fail: %s", err)
        self._refresh_buttons()

    # ── Cert bypass: accept MITM / self-signed certs so pages still load ──
    def webView_didReceiveAuthenticationChallenge_completionHandler_(
        self, webView, challenge, completionHandler
    ):
        trust = challenge.protectionSpace().serverTrust()
        if trust is not None:
            cred = Cocoa.NSURLCredential.credentialForTrust_(trust)
            log.info("accepted server trust for %s", challenge.protectionSpace().host())
            completionHandler(NSURLSessionAuthChallengeUseCredential, cred)
        else:
            completionHandler(NSURLSessionAuthChallengeCancelAuthenticationChallenge, None)

    # ── Open target=_blank links in the same web view ──
    def webView_createWebViewWithConfiguration_forNavigationAction_windowFeatures_(
        self, w, cfg, action, features
    ):
        if action.request().URL():
            self.web.loadRequest_(action.request())
        return None

    # ── Cleanup on close ──
    def applicationWillTerminate_(self, note):
        proxy_off()

    def windowWillClose_(self, note):
        proxy_off()
        Cocoa.NSApplication.sharedApplication().terminate_(None)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PROXY_PORT

    proxy = ConnectProxy(port)
    proxy.start()
    time.sleep(0.2)
    proxy_on(port)

    signal.signal(signal.SIGTERM, lambda *a: (proxy_off(), sys.exit(0)))
    signal.signal(signal.SIGINT, lambda *a: (proxy_off(), sys.exit(0)))

    print("=" * 52)
    print("  IsaacNet Browser — DoH + CONNECT proxy active")
    print(f"  proxy: 127.0.0.1:{port}   (close window to disable)")
    print("=" * 52)

    app = Cocoa.NSApplication.sharedApplication()
    Cocoa.NSProcessInfo.processInfo().setProcessName_("IsaacNet")
    app.setActivationPolicy_(Cocoa.NSApplicationActivationPolicyRegular)
    delegate = AppDelegate.alloc().init()
    app.setDelegate_(delegate)
    AppHelper.runEventLoop()


if __name__ == "__main__":
    main()
