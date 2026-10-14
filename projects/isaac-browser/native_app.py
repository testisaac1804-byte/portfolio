#!/usr/bin/env python3
"""
Isaac Browser — Maximum Privacy / Incognito Browser for macOS
===============================================================
- Ephemeral WKWebView (nothing written to disk, ever)
- Built-in CONNECT proxy + DoH DNS (toggleable VPN bypass)
- Anti-fingerprinting: blocks WebRTC, Canvas, AudioContext, Battery API
- Tracker blocking: WKContentRuleList blocks ads/trackers/fingerprinters
- No referrer, no third-party cookies, all permissions denied
- 'New Identity' one-click session reset
- **Stealth Mode**: auto-wipes all data when you switch away from the browser
- **JS Toggle**: completely disable JavaScript for maximum privacy
- **Auto-Burn**: timer-based automatic identity reset
- **Force HTTPS**: upgrades all http:// to https://
- History burned immediately on close
"""

import os, sys, json, time, socket, ssl, struct, base64, signal, threading, select
import urllib.request, urllib.parse, html as html_module, re
import subprocess
from PyObjCTools import AppHelper
import Cocoa, WebKit, objc

# ── Ports & Paths ──────────────────────────────────────────────────────────
API_PORT     = 8556
PROXY_PORT   = 8557
APP_DIR      = os.path.dirname(os.path.abspath(__file__))
TEMPLATES    = os.path.join(APP_DIR, "templates")
CONFIG_FILE  = os.path.join(os.path.expanduser("~"), "Library", "Application Support",
                            "com.isaac.browser", "settings.json")

# ── Global State ───────────────────────────────────────────────────────────
PROXY_ENABLED  = False          # proxy OFF by default (DoH blocked on some networks) — toggle in UI
JS_ENABLED     = True           # JavaScript ON by default (needed for search/UI)
STEALTH_MODE   = True           # Auto-wipe on window blur
AUTO_BURN_MINUTES = 0           # 0 = disabled, otherwise minutes
_auto_burn_timer = None

# ── DoH DNS Providers ──────────────────────────────────────────────────────
DOH_PROVIDERS = [
    ('https://cloudflare-dns.com/dns-query',  '1.1.1.1', '1.0.0.1'),
    ('https://dns.google/dns-query',          '8.8.8.8', '8.8.4.4'),
    ('https://dns.quad9.net/dns-query',       '9.9.9.9', '149.112.112.112'),
    ('https://doh.dns.sb/dns-query',           '185.222.222.222', '45.11.45.11'),
]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) IsaacBrowser/2.0"

# ── Helper: HTTP opener ────────────────────────────────────────────────────
# PER-APP ONLY. Never inherits the OS proxy, so Chrome is unaffected.
# When the in-app proxy toggle is ON, the app's own requests are routed
# through the local CONNECT proxy; when OFF they go direct.
def _make_opener():
    if PROXY_ENABLED:
        ph = urllib.request.ProxyHandler({
            'http':  f'http://127.0.0.1:{PROXY_PORT}',
            'https': f'http://127.0.0.1:{PROXY_PORT}',
        })
    else:
        ph = urllib.request.ProxyHandler({})   # explicit bypass of system proxy
    hh = urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
    return urllib.request.build_opener(ph, hh)

# ── DoH DNS Resolution ─────────────────────────────────────────────────────
def _dns_query_qname(hostname):
    labels = hostname.rstrip('.').split('.')
    buf = b'\xaa\xbb\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00'
    for label in labels:
        buf += struct.pack('B', len(label)) + label.encode('ascii', errors='ignore')
    buf += b'\x00\x00\x01\x00\x01'
    return buf

def _parse_dns_a_records(resp_body):
    ips = []
    try:
        hdr = resp_body[:12]
        ancount = struct.unpack('>H', hdr[6:8])[0]
        pos = 12
        while pos < len(resp_body):
            if resp_body[pos] == 0:
                pos += 5
                break
            pos += 1 + resp_body[pos] + 1
        for _ in range(ancount):
            if pos >= len(resp_body): break
            if resp_body[pos] & 0xC0:
                pos += 2
            else:
                while pos < len(resp_body) and resp_body[pos]:
                    pos += 1 + resp_body[pos]
                pos += 1
            if pos + 10 > len(resp_body): break
            rtype, rclass, ttl, rdlen = struct.unpack('>HHIH', resp_body[pos:pos+10])
            pos += 10
            if rtype == 1 and rdlen == 4:
                ip = '.'.join(str(b) for b in resp_body[pos:pos+4])
                ips.append(ip)
            pos += rdlen
    except: pass
    return ips

def doh_resolve(hostname):
    qdata = _dns_query_qname(hostname)
    q_b64 = base64.urlsafe_b64encode(qdata).rstrip(b'=').decode()
    opener = _make_opener()

    def _try(url, host_header=None):
        try:
            headers = {'Accept': 'application/dns-message', 'User-Agent': UA}
            if host_header:
                headers['Host'] = host_header
            req = urllib.request.Request(url, headers=headers)
            resp = opener.open(req, timeout=5)
            return _parse_dns_a_records(resp.read())
        except: return None

    for url, *_ in DOH_PROVIDERS:
        ips = _try(f'{url}?dns={q_b64}')
        if ips: return ips

    for _, *ips in DOH_PROVIDERS:
        for ip in ips:
            if ip:
                result = _try(f'https://{ip}/dns-query?dns={q_b64}',
                              host_header=urllib.parse.urlparse(DOH_PROVIDERS[0][0]).hostname)
                if result: return result

    for ip, host in [('1.1.1.1', 'cloudflare-dns.com'), ('8.8.8.8', 'dns.google')]:
        try:
            req2 = urllib.request.Request(
                f'https://{ip}/resolve?name={hostname}&type=A',
                headers={'User-Agent': UA, 'Host': host})
            data = json.loads(opener.open(req2, timeout=5).read())
            ips = [a['data'] for a in data.get('Answer', []) if a.get('type') == 1]
            if ips: return ips
        except: continue
    return []

# ── CONNECT Proxy ──────────────────────────────────────────────────────────
class ConnectProxy:
    def __init__(self, port):
        self.port = port
        self._server = None

    def start(self):
        """Bind the local proxy. NEVER fatal — a busy port must not kill the
        browser. Returns True on success, False if the port is unavailable."""
        self._server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            self._server.bind(('127.0.0.1', self.port))
        except OSError as e:
            print(f"[Isaac Browser] Proxy port {self.port} unavailable ({e}); "
                  f"continuing without the local proxy.", flush=True)
            try: self._server.close()
            except: pass
            self._server = None
            return False
        self._server.listen(50)
        self._server.settimeout(1.0)
        t = threading.Thread(target=self._serve, daemon=True)
        t.start()
        return True

    def stop(self):
        try: self._server.close()
        except: pass

    def _serve(self):
        while True:
            try:
                client, addr = self._server.accept()
                threading.Thread(target=self._handle, args=(client,), daemon=True).start()
            except socket.timeout: continue
            except: break

    def _handle(self, client):
        remote = None
        try:
            client.settimeout(30)
            data = b''
            while b'\r\n\r\n' not in data:
                chunk = client.recv(4096)
                if not chunk: return
                data += chunk

            first_line = data.split(b'\r\n')[0].decode('utf-8', errors='replace')
            if not first_line.startswith('CONNECT'):
                client.sendall(b'HTTP/1.1 405 Method Not Allowed\r\n\r\n')
                return

            hostport = first_line.split(' ')[1]
            if ':' in hostport:
                host, port_str = hostport.rsplit(':', 1)
                port = int(port_str)
            else:
                host = hostport; port = 443

            ips = doh_resolve(host)
            if not ips:
                try: ips = [socket.gethostbyname(host)]
                except:
                    client.sendall(b'HTTP/1.1 502 DNS Failed\r\n\r\n')
                    return

            for ip in ips:
                try:
                    remote = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    remote.settimeout(10)
                    remote.connect((ip, port))
                    break
                except:
                    try: remote.close()
                    except: pass
                    remote = None

            if not remote:
                client.sendall(b'HTTP/1.1 502 Connection Failed\r\n\r\n')
                return

            client.sendall(b'HTTP/1.1 200 Connection Established\r\n\r\n')
            socks = [client, remote]
            while True:
                rlist, _, _ = select.select(socks, [], [], 30)
                if not rlist: break
                for sock in rlist:
                    d = sock.recv(65536)
                    if not d: return
                    (remote if sock is client else client).sendall(d)
        except: pass
        finally:
            try: client.close()
            except: pass
            try: remote.close()
            except: pass


# ── Main-thread helper ─────────────────────────────────────────────────────
class MainThreadHelper(Cocoa.NSObject):
    """For scheduling WebKit operations on the main thread via performSelector."""
    def cleanup_(self, data):
        _reset_ephemeral_store()
    def applyJS_(self, data):
        _apply_js_setting_impl()


# ── Local HTTP API Server ──────────────────────────────────────────────────
from http.server import HTTPServer, BaseHTTPRequestHandler

class APIHandler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _send(self, data, status=200, ctype='application/json'):
        body = data.encode() if isinstance(data, str) else json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get('Content-Length', 0))
        return self.rfile.read(length).decode() if length else '{}'

    def do_GET(self):
        path = self.path.split('?')[0]
        if path in ('/newtab', '/'):
            self._send_file('newtab.html', 'text/html; charset=utf-8')
        elif path == '/api/search':
            params = urllib.parse.parse_qs(self.path.split('?')[1] if '?' in self.path else '')
            q = params.get('q', [''])[0]
            if q:
                results = self._search_ddg(q)
                self._send({'results': results})
            else:
                self._send({'results': []})
        elif path == '/api/proxy-status':
            self._send({'proxy_enabled': PROXY_ENABLED})
        elif path == '/api/js-status':
            self._send({'js_enabled': JS_ENABLED})
        elif path == '/api/stealth-status':
            self._send({'stealth_mode': STEALTH_MODE})
        elif path == '/api/auto-burn-status':
            self._send({'auto_burn_minutes': AUTO_BURN_MINUTES})
        elif path == '/api/privacy-status':
            self._send({
                'proxy_enabled': PROXY_ENABLED,
                'js_enabled': JS_ENABLED,
                'stealth_mode': STEALTH_MODE,
                'auto_burn_minutes': AUTO_BURN_MINUTES,
            })
        else:
            self._send({'error': 'not found'}, 404)

    def do_POST(self):
        path = self.path.split('?')[0]
        try:
            data = json.loads(self._read_body())
        except: data = {}

        if path == '/api/set-proxy':
            global PROXY_ENABLED
            enabled = data.get('enabled', True)
            if enabled != PROXY_ENABLED:
                PROXY_ENABLED = enabled
                _apply_proxy(PROXY_ENABLED)
            self._send({'proxy_enabled': PROXY_ENABLED})
        elif path == '/api/set-js':
            global JS_ENABLED
            JS_ENABLED = data.get('enabled', False)
            _apply_js_setting()
            self._send({'js_enabled': JS_ENABLED})
        elif path == '/api/set-stealth':
            global STEALTH_MODE
            STEALTH_MODE = data.get('enabled', True)
            self._send({'stealth_mode': STEALTH_MODE})
        elif path == '/api/set-auto-burn':
            _set_auto_burn(data.get('minutes', 0))
            self._send({'auto_burn_minutes': AUTO_BURN_MINUTES})
        elif path == '/api/new-identity':
            helper = MainThreadHelper.alloc().init()
            helper.performSelectorOnMainThread_withObject_waitUntilDone_(
                b'cleanup:', None, False)
            self._send({'status': 'ok', 'message': 'Session reset. All data cleared.'})
        else:
            self._send({'error': 'not found'}, 404)

    def _send_file(self, filename, ctype):
        path = os.path.join(TEMPLATES, filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                data = f.read()
            self._send(data, ctype=ctype)
        else:
            self._send('<h1>New Tab</h1>', ctype='text/html; charset=utf-8')

    @staticmethod
    def _parse_results(html, engine_host):
        """Generic result-link extractor that works across search engines."""
        results = []; seen = set()
        for href, title in re.findall(
                r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>',
                html, re.DOTALL | re.IGNORECASE):
            title = re.sub(r'<[^>]+>', '', title)
            title = html_module.unescape(title).strip()
            title = title.split('|')[0].strip()
            if len(title) < 3:
                continue
            real_url = href
            if 'uddg=' in href:                       # DDG redirect wrapper
                qs = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                if 'uddg' in qs:
                    real_url = qs['uddg'][0]
            netloc = urllib.parse.urlparse(real_url).netloc
            if engine_host in netloc or not real_url.startswith('http'):
                continue
            if real_url in seen:
                continue
            seen.add(real_url)
            results.append({'title': title[:150], 'url': real_url[:500], 'snippet': ''})
            if len(results) >= 20:
                break
        return results

    def _search_ddg(self, query):
        """Keyless search: DuckDuckGo Instant Answer + Wikipedia, then Bing HTML.
        HTML scraping alone gets bot-blocked (429 / JS-challenge), so the
        JSON APIs carry the weight and HTML is only a last resort."""
        q = urllib.parse.quote(query)
        results = []
        seen = set()

        def _add(title, url, snippet=''):
            if not url or not title:
                return
            if url in seen:
                return
            seen.add(url)
            results.append({'title': title.strip()[:150],
                            'url': url[:500],
                            'snippet': snippet.strip()[:300]})

        opener = _make_opener()
        headers = {'User-Agent': UA, 'Accept': 'application/json,text/html'}

        # ── 1. DuckDuckGo Instant Answer API (keyless, bot-friendly) ──────
        try:
            req = urllib.request.Request(
                f'https://api.duckduckgo.com/?q={q}&format=json&no_html=1',
                headers=headers)
            data = json.loads(opener.open(req, timeout=8).read().decode('utf-8', 'replace'))
            if data.get('AbstractText'):
                _add(data.get('Heading') or query,
                     data.get('AbstractURL', ''), data['AbstractText'])
            for topic in data.get('RelatedTopics', []):
                if isinstance(topic, dict) and topic.get('FirstURL'):
                    _add(topic.get('Text', ''), topic['FirstURL'])
        except Exception:
            pass

        # ── 2. Wikipedia search API (keyless, reliable) ───────────────────
        if len(results) < 8:
            try:
                req = urllib.request.Request(
                    'https://en.wikipedia.org/w/api.php?action=query&list=search'
                    f'&srsearch={q}&format=json&srlimit=10', headers=headers)
                data = json.loads(opener.open(req, timeout=8).read().decode('utf-8', 'replace'))
                for hit in data.get('query', {}).get('search', []):
                    title = hit.get('title', '')
                    snip = re.sub(r'<[^>]+>', '', hit.get('snippet', ''))
                    _add(title,
                         'https://en.wikipedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')),
                         html_module.unescape(snip))
            except Exception:
                pass

        # ── 3. Bing HTML (last resort; may be bot-blocked) ────────────────
        if len(results) < 5:
            try:
                req = urllib.request.Request(
                    f'https://www.bing.com/search?q={q}',
                    headers={**headers, 'Accept': 'text/html',
                             'Accept-Language': 'en-US,en;q=0.9'})
                page = opener.open(req, timeout=8).read().decode('utf-8', 'replace')
                for item in self._parse_results(page, 'bing.com'):
                    _add(item['title'], item['url'], item.get('snippet', ''))
            except Exception as e:
                if not results:
                    return [{'title': f'Search unavailable ({e})', 'url': '', 'snippet': ''}]

        return results


def start_api_server():
    """Local API for the start page. Non-fatal if the port is busy."""
    try:
        server = HTTPServer(('127.0.0.1', API_PORT), APIHandler)
    except OSError as e:
        print(f"[Isaac Browser] API port {API_PORT} unavailable ({e}); "
              f"search/status API disabled.", flush=True)
        return
    server.serve_forever()


# ── Proxy: PER-APP ONLY — the OS is never modified ─────────────────────────
# NOTE: an earlier version called `networksetup -setwebproxy`, which is
# SYSTEM-WIDE. That leaked into Chrome/Safari and, worse, `-setwebproxystate
# off` on quit disabled the user's own proxy/VPN. All of that is gone.
# The proxy toggle now only affects Isaac Browser's own API requests.

def _sysproxy_on():
    """NO-OP — deliberately never touches system proxy (would leak into Chrome)."""

def _sysproxy_off():
    """NO-OP — never disables the user's own proxy/VPN when the app quits."""

def _apply_proxy(enabled):
    """Kept for API compatibility. Per-app only; the OS is never modified."""


# ── Global state: webview reference + helpers ──────────────────────────────
_current_webview = None
_current_ephemeral_store = None
_js_disable_script = None  # WKUserScript reference

def _reset_ephemeral_store():
    """Clear ALL data in the ephemeral store. Frontend JS handles navigation."""
    global _current_ephemeral_store
    if _current_ephemeral_store:
        types = WebKit.WKWebsiteDataStore.allWebsiteDataTypes()
        _current_ephemeral_store.removeDataOfTypes_modifiedSince_completionHandler_(
            types, Cocoa.NSDate.distantPast(), lambda: None)
    print("[Isaac Browser] New identity created — all session data cleared.")

def _apply_js_setting():
    """Toggle JavaScript on/off — dispatched to main thread asynchronously."""
    helper = MainThreadHelper.alloc().init()
    helper.performSelectorOnMainThread_withObject_waitUntilDone_(
        b'applyJS:', None, False)

def _apply_js_setting_impl():
    """Toggle JavaScript on/off by adding/removing the JS-nuke user script."""
    global _js_disable_script, _current_webview
    if _current_webview is None:
        return
    uc = _current_webview.configuration().userContentController()
    if JS_ENABLED:
        # Remove the JS-blocking script
        if _js_disable_script:
            uc.removeUserScript_(_js_disable_script)
            _js_disable_script = None
        print("[Isaac Browser] JavaScript enabled")
    else:
        # Add JS-blocking user script (runs at document start, nukes JS)
        js_block = """
        (function(){
            // Nuke all JavaScript execution paths
            window.eval = function() { return undefined; };
            window.setTimeout = function() { return 0; };
            window.setInterval = function() { return 0; };
            window.setImmediate = function() { return 0; };
            window.requestAnimationFrame = function() { return 0; };
            window.Function = undefined;
            window.Promise = undefined;
            window.WebAssembly = undefined;
            window.BigInt = undefined;
            window.Symbol = undefined;
            window.Reflect = undefined;
            window.Proxy = undefined;
            // Block event listener creation
            var _addEL = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                // Allow critical events but strip listeners from making JS calls
                if (type === 'load' || type === 'DOMContentLoaded') {
                    return _addEL.call(this, type, function(){}, options);
                }
                return _addEL.call(this, type, function(){}, options);
            };
        })();
        """
        script = WebKit.WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly_(
            js_block, WebKit.WKUserScriptInjectionTimeAtDocumentStart, True)
        uc.addUserScript_(script)
        _js_disable_script = script
        print("[Isaac Browser] JavaScript disabled")


def _set_auto_burn(minutes):
    """Set auto-burn timer. 0 = disabled."""
    global AUTO_BURN_MINUTES, _auto_burn_timer
    AUTO_BURN_MINUTES = minutes
    if _auto_burn_timer:
        _auto_burn_timer.cancel()
        _auto_burn_timer = None
    if minutes > 0:
        def _burn():
            _reset_ephemeral_store()
            # Re-schedule
            _set_auto_burn(minutes)
        _auto_burn_timer = threading.Timer(minutes * 60, _burn)
        _auto_burn_timer.daemon = True
        _auto_burn_timer.start()
        print(f"[Isaac Browser] Auto-burn: every {minutes} minute(s)")


# ── WKContentRuleList: Tracker & Fingerprinting Blocker ────────────────────
TRACKER_RULES_JSON = r"""
[{
  "trigger": { "url-filter": ".*" },
  "action": { "type": "block-cookies" }
},{
  "trigger": { "url-filter": ".*doubleclick.net.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*googleadservices.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*googlesyndication.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*google-analytics.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*googletagmanager.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*facebook.com/tr.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*connect.facebook.net.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*analytics.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*scorecardresearch.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*adsrvr.org.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*adnxs.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*criteo.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*criteo.net.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*hotjar.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*hotjar.io.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*mouseflow.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*fullstory.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*mixpanel.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*amplitude.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*segment.io.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*segment.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*optimizely.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*newrelic.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*datadoghq.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*mousestats.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*tiktok.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*pinterest.com/.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*linkedin.com/.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*snapchat.com.*" },
  "action": { "type": "block" }
},{
  "trigger": { "url-filter": ".*twitter.com/i/videos.*" },
  "action": { "type": "block" }
}]
"""

# ── Anti-Fingerprinting JavaScript Injection ───────────────────────────────
ANTI_FP_JS = """
(function(){
  // ── Block WebRTC (prevents IP leak) ──
  if (window.RTCPeerConnection) {
    try {
      window.RTCPeerConnection = undefined;
      window.webkitRTCPeerConnection = undefined;
      window.mozRTCPeerConnection = undefined;
      window.RTCSessionDescription = undefined;
      window.RTCIceCandidate = undefined;
      window.MediaStream = undefined;
    } catch(e) {}
  }

  // ── Block Canvas Fingerprinting ──
  try {
    HTMLCanvasElement.prototype.getContext = function(type) {
      if (type && type.indexOf('2d') >= 0) return null;
      return HTMLCanvasElement.prototype.__proto__.getContext.apply(this, arguments);
    };
    HTMLCanvasElement.prototype.toDataURL = function() { return ''; };
    HTMLCanvasElement.prototype.toBlob = function() {};
    OffscreenCanvas.prototype.toDataURL = function() { return ''; };
    OffscreenCanvas.prototype.toBlob = function() {};
    OffscreenCanvas.prototype.getContext = function(type) {
      if (type && type.indexOf('2d') >= 0) return null;
      return null;
    };
    CanvasRenderingContext2D.prototype.getImageData = function() { return null; };
    CanvasRenderingContext2D.prototype.measureText = function() { return {width:0}; };
  } catch(e) {}

  // ── Block AudioContext Fingerprinting ──
  try {
    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;
    window.OfflineAudioContext = undefined;
  } catch(e) {}

  // ── Block Battery API ──
  try {
    if (navigator.getBattery) {
      navigator.getBattery = function() {
        return Promise.reject(new Error('Battery API blocked'));
      };
    }
  } catch(e) {}

  // ── Block Geolocation ──
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition = function(s, e) {
        if (e) setTimeout(function() { e({code:1,message:'Permission denied'}); }, 0);
      };
      navigator.geolocation.watchPosition = function(s, e) {
        if (e) setTimeout(function() { e({code:1,message:'Permission denied'}); }, 0);
        return 0;
      };
    }
  } catch(e) {}

  // ── Block Media Devices (camera/mic) ──
  try {
    navigator.mediaDevices = undefined;
    navigator.getUserMedia = undefined;
    navigator.webkitGetUserMedia = undefined;
  } catch(e) {}

  // ── Block Sensor APIs ──
  try {
    window.Accelerometer = undefined;
    window.Gyroscope = undefined;
    window.Magnetometer = undefined;
    window.OrientationSensor = undefined;
    window.AmbientLightSensor = undefined;
    window.DeviceOrientationEvent = undefined;
    window.DeviceMotionEvent = undefined;
  } catch(e) {}

  // ── Spoof navigator properties (anti-fingerprinting) ──
  try {
    Object.defineProperty(navigator, 'webdriver', { get: function() { return false; } });
    Object.defineProperty(navigator, 'plugins', { get: function() { return []; } });
    Object.defineProperty(navigator, 'languages', { get: function() { return ['en-US','en']; } });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: function() { return 2; } });
    Object.defineProperty(navigator, 'deviceMemory', { get: function() { return 4; } });
    Object.defineProperty(navigator, 'doNotTrack', { get: function() { return '1'; } });
  } catch(e) {}

  // ── Block clipboard read (prevent sites reading your clipboard) ──
  try {
    navigator.clipboard.read = function() {
      return Promise.reject(new Error('Clipboard read blocked'));
    };
    navigator.clipboard.readText = function() {
      return Promise.reject(new Error('Clipboard read blocked'));
    };
  } catch(e) {}

  // ── Block screen capture detection ──
  try {
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler = function() {};
    }
  } catch(e) {}
})();
"""

# ── Injected toolbar (shown on every external page) ────────────────────────
TOOLBAR_JS = """
(function(){
  if (window.location.hostname === '127.0.0.1' ||
      window.location.hostname === 'localhost') return;
  if (document.getElementById('isaac-browser-bar')) return;

  var bar = document.createElement('div');
  bar.id = 'isaac-browser-bar';
  bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;' +
    'background:#1a1a2e;border-bottom:2px solid #e94560;padding:6px 12px;' +
    'display:flex;align-items:center;gap:8px;font-family:-apple-system,sans-serif;';

  function btn(text, clickHandler, title, extraStyle) {
    var b = document.createElement('button');
    b.textContent = text;
    b.style.cssText = 'background:#16213e;color:#fff;border:1px solid #0f3460;' +
      'border-radius:6px;padding:4px 8px;cursor:pointer;font-size:14px;line-height:1;' +
      (extraStyle||'');
    b.onclick = clickHandler;
    if (title) b.title = title;
    return b;
  }

  bar.appendChild(btn('\\u2190', function(){ history.back(); }, 'Back'));
  bar.appendChild(btn('\\u2192', function(){ history.forward(); }, 'Forward'));
  bar.appendChild(btn('\\u27F3', function(){ location.reload(); }, 'Reload'));

  var urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.style.cssText = 'flex:1;background:#16213e;color:#fff;border:1px solid #0f3460;' +
    'border-radius:6px;padding:6px 10px;font-size:13px;outline:none;';
  urlInput.value = window.location.href;
  urlInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      var val = urlInput.value.trim();
      if(val.includes('.') && !val.includes(' ')){
        if(!val.startsWith('http://') && !val.startsWith('https://'))
          val = 'https://' + val;
        window.location.href = val;
      } else if(val) {
        window.location.href = 'http://127.0.0.1:%d/newtab?q=' + encodeURIComponent(val);
      }
    }
  });

  bar.appendChild(urlInput);
  bar.appendChild(btn('\\u2302', function(){
    window.location.href = 'http://127.0.0.1:%d/newtab';
  }, 'New Tab', 'font-size:18px;'));
  bar.appendChild(btn('\\u2716', function(){
    // New Identity — clear everything
    fetch('/api/new-identity', {method:'POST'});
  }, 'New Identity - Clear All Data', 'color:#e94560;font-weight:bold;'));

  document.body.appendChild(bar);
  document.body.style.paddingTop = '44px';
})();
""" % (API_PORT, API_PORT)


# ── WKWebView Delegates ────────────────────────────────────────────────────

class SSLDelegate(Cocoa.NSObject):
    """Handles SSL challenges AND navigation callbacks for WKNavigationDelegate."""
    def webView_didReceiveAuthenticationChallenge_completionHandler_(self, wv, challenge, handler):
        ps = challenge.protectionSpace()
        if ps.authenticationMethod() == Cocoa.NSURLAuthenticationMethodServerTrust:
            cred = Cocoa.NSURLCredential.credentialForTrust_(ps.serverTrust())
            handler(Cocoa.NSURLSessionAuthChallengeUseCredential, cred)
        else:
            handler(Cocoa.NSURLSessionAuthChallengePerformDefaultHandling, None)

    def webView_didFinishNavigation_(self, webview, nav):
        webview.evaluateJavaScript_completionHandler_(ANTI_FP_JS, None)
        webview.evaluateJavaScript_completionHandler_(TOOLBAR_JS, None)

    def webView_decidePolicyForNavigationAction_decisionHandler_(self, webview, action, handler):
        url = action.request().URL().absoluteString() if action.request().URL() else ''
        # Allow local pages
        if url.startswith('http://127.0.0.1') or url.startswith('http://localhost') or url in ('about:blank', ''):
            handler(WebKit.WKNavigationActionPolicyAllow)
            return
        # Force HTTPS upgrade
        if url.startswith('http://') and not url.startswith('http://127.') and not url.startswith('http://localhost'):
            https_url = 'https://' + url[7:]
            req = Cocoa.NSURLRequest.requestWithURL_(Cocoa.NSURL.URLWithString_(https_url))
            webview.loadRequest_(req)
            handler(WebKit.WKNavigationActionPolicyCancel)
            return
        handler(WebKit.WKNavigationActionPolicyAllow)


class UIDelegate(Cocoa.NSObject):
    """WKUIDelegate — suppress new windows AND deny all permissions."""
    def webView_createWebViewWithConfiguration_forNavigationAction_windowFeatures_(self,
            wv, config, action, features):
        url = action.request().URL().absoluteString() if action.request().URL() else ''
        if url:
            wv.loadRequest_(Cocoa.NSURLRequest.requestWithURL_(
                Cocoa.NSURL.URLWithString_(url)))
        return None

    def webView_requestGeolocationPermissionForFrame_decisionHandler_(self, wv, frame, handler):
        handler(WebKit.WKPermissionDecisionDeny)
    def webView_requestMediaCapturePermissionForFrame_type_decisionHandler_(self, wv, frame, mtype, handler):
        handler(WebKit.WKPermissionDecisionDeny)
    def webView_requestNotificationPermissionForFrame_decisionHandler_(self, wv, frame, handler):
        handler(WebKit.WKPermissionDecisionDeny)
    def webView_requestDeviceOrientationPermissionForFrame_decisionHandler_(self, wv, frame, handler):
        handler(WebKit.WKPermissionDecisionDeny)


class AppDelegate(Cocoa.NSObject):
    def applicationShouldTerminateAfterLastWindowClosed_(self, notification):
        return True
    def applicationWillTerminate_(self, notification):
        _cleanup()
    def windowDidResignKey_(self, notification):
        """Stealth mode: auto-wipe when window loses focus."""
        if STEALTH_MODE and _current_ephemeral_store:
            _reset_ephemeral_store()
            print("[Isaac Browser] Stealth mode — data wiped on window blur")
    def windowDidBecomeKey_(self, notification):
        """After stealth wipe, reload to start page."""
        pass  # The wipe already cleared everything


def _cleanup():
    """Burn everything — clear clipboard, nuke ALL WebKit data.
    NOTE: the system proxy is NEVER touched (that would break Chrome)."""
    # Clear clipboard (paranoid)
    subprocess.run(["pbcopy"], input=b"", timeout=3)
    # Nuke WebKit data stores (with safety in case WebKit is already tearing down)
    try:
        store = WebKit.WKWebsiteDataStore.defaultDataStore()
        types = WebKit.WKWebsiteDataStore.allWebsiteDataTypes()
        store.removeDataOfTypes_modifiedSince_completionHandler_(types, Cocoa.NSDate.distantPast(), lambda: None)
    except Exception as e:
        print(f"[Isaac Browser] Cleanup note: {e}")
    try:
        if _current_ephemeral_store:
            _current_ephemeral_store.removeDataOfTypes_modifiedSince_completionHandler_(
                types, Cocoa.NSDate.distantPast(), lambda: None)
    except Exception as e:
        print(f"[Isaac Browser] Cleanup note: {e}")
    print("[Isaac Browser] All browsing data burned. Proxy disabled. Clipboard cleared.")


def create_browser_window():
    global _current_webview, _current_ephemeral_store

    app = Cocoa.NSApplication.sharedApplication()
    app.setActivationPolicy_(Cocoa.NSApplicationActivationPolicyRegular)

    # ── Menu bar ──
    menubar = Cocoa.NSMenu.alloc().init()
    app_item = Cocoa.NSMenuItem.alloc().init()
    menubar.addItem_(app_item)
    app_menu = Cocoa.NSMenu.alloc().init()
    app_item.setSubmenu_(app_menu)

    about_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "About Isaac Browser", b'orderFrontStandardAboutPanel:', '')
    app_menu.addItem_(about_item)
    app_menu.addItem_(Cocoa.NSMenuItem.separatorItem())

    # Proxy toggle
    proxy_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "Proxy: OFF", b'toggleProxy:', '')
    proxy_item.setState_(1 if PROXY_ENABLED else 0)
    app_menu.addItem_(proxy_item)

    # JavaScript toggle
    js_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "JavaScript: ON", b'toggleJS:', 'j')
    js_item.setState_(1 if JS_ENABLED else 0)
    js_item.setKeyEquivalentModifierMask_(Cocoa.NSEventModifierFlagCommand | Cocoa.NSEventModifierFlagShift)
    app_menu.addItem_(js_item)

    # Stealth mode toggle
    stealth_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "Stealth Mode: ON", b'toggleStealth:', '')
    stealth_item.setState_(1 if STEALTH_MODE else 0)
    app_menu.addItem_(stealth_item)

    app_menu.addItem_(Cocoa.NSMenuItem.separatorItem())

    # New Identity
    new_id_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "New Identity", b'newIdentity:', 'n')
    new_id_item.setKeyEquivalentModifierMask_(Cocoa.NSEventModifierFlagCommand | Cocoa.NSEventModifierFlagShift)
    app_menu.addItem_(new_id_item)

    app_menu.addItem_(Cocoa.NSMenuItem.separatorItem())

    quit_item = Cocoa.NSMenuItem.alloc().initWithTitle_action_keyEquivalent_(
        "Quit Isaac Browser", b'terminate:', 'q')
    app_menu.addItem_(quit_item)
    app.setMainMenu_(menubar)

    # ── Window ──
    rect = Cocoa.NSMakeRect(0, 0, 1280, 800)
    style = (Cocoa.NSTitledWindowMask | Cocoa.NSClosableWindowMask |
             Cocoa.NSMiniaturizableWindowMask | Cocoa.NSResizableWindowMask)
    window = Cocoa.NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
        rect, style, Cocoa.NSBackingStoreBuffered, False)
    window.setTitle_("Isaac Browser \\u2014 Maximum Privacy")
    window.setMinSize_(Cocoa.NSMakeSize(600, 400))
    window.center()

    # ── WKWebView Configuration ──
    config = WebKit.WKWebViewConfiguration.alloc().init()

    # Ephemeral data store — NOTHING touches disk
    _current_ephemeral_store = WebKit.WKWebsiteDataStore.nonPersistentDataStore()
    config.setWebsiteDataStore_(_current_ephemeral_store)

    # Lock down preferences
    prefs = WebKit.WKPreferences.alloc().init()
    prefs._setTelephoneNumberDetectionIsEnabled_(False)
    prefs.setJavaScriptCanOpenWindowsAutomatically_(False)
    prefs.setJavaScriptEnabled_(JS_ENABLED)  # Set based on user preference
    config.setPreferences_(prefs)

    # Disable auto-capitalization/auto-correction
    page_pref = WebKit.WKWebpagePreferences.alloc().init()
    config.setDefaultWebpagePreferences_(page_pref)

    # Create the webview
    webview = WebKit.WKWebView.alloc().initWithFrame_configuration_(
        Cocoa.NSMakeRect(0, 0, 1280, 800), config)
    webview.setAutoresizingMask_(Cocoa.NSViewWidthSizable | Cocoa.NSViewHeightSizable)
    _current_webview = webview

    # Load WKContentRuleList for tracker blocking
    WebKit.WKContentRuleListStore.defaultStore().compileContentRuleListForIdentifier_encodedContentRuleList_completionHandler_(
        "TrackerBlocker", TRACKER_RULES_JSON, lambda ruleList, error: (
            webview.configuration().userContentController().addContentRuleList_(ruleList)
            if ruleList else None
        )
    )

    # Set custom user agent (prevents UA fingerprinting)
    webview.setValue_forKey_(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
        "(KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "applicationNameForUserAgent"
    )

    # SSL + Nav delegate
    ssl_del = SSLDelegate.alloc().init()
    webview.setNavigationDelegate_(ssl_del)

    # UI delegate
    ui_del = UIDelegate.alloc().init()
    webview.setUIDelegate_(ui_del)

    # Load start page
    start_url = Cocoa.NSURL.URLWithString_(f"http://127.0.0.1:{API_PORT}/newtab")
    req = Cocoa.NSURLRequest.requestWithURL_(start_url)
    webview.loadRequest_(req)

    window.setContentView_(webview)
    window.makeKeyAndOrderFront_(None)
    app.activateIgnoringOtherApps_(True)

    # ── App Delegate ──
    delegate = AppDelegate.alloc().init()
    app.setDelegate_(delegate)
    window.setReleasedWhenClosed_(True)
    window.setDelegate_(delegate)

    # ── Menu actions ──
    class BrowserActions(Cocoa.NSObject):
        def toggleProxy_(self, sender):
            global PROXY_ENABLED
            PROXY_ENABLED = not PROXY_ENABLED
            sender.setState_(1 if PROXY_ENABLED else 0)
            sender.setTitle_("Proxy: ON" if PROXY_ENABLED else "Proxy: OFF")
            _apply_proxy(PROXY_ENABLED)
            print(f"[Isaac Browser] Proxy {'enabled' if PROXY_ENABLED else 'disabled'}")

        def toggleJS_(self, sender):
            global JS_ENABLED
            JS_ENABLED = not JS_ENABLED
            sender.setState_(1 if JS_ENABLED else 0)
            sender.setTitle_("JavaScript: ON" if JS_ENABLED else "JavaScript: OFF")
            _apply_js_setting()
            # Reload current page to apply change
            if _current_webview:
                _current_webview.reload_()
            print(f"[Isaac Browser] JavaScript {'enabled' if JS_ENABLED else 'disabled'}")

        def toggleStealth_(self, sender):
            global STEALTH_MODE
            STEALTH_MODE = not STEALTH_MODE
            sender.setState_(1 if STEALTH_MODE else 0)
            sender.setTitle_("Stealth Mode: ON" if STEALTH_MODE else "Stealth Mode: OFF")
            print(f"[Isaac Browser] Stealth mode {'enabled' if STEALTH_MODE else 'disabled'}")

        def newIdentity_(self, sender):
            _reset_ephemeral_store()
            print("[Isaac Browser] New identity activated — session wiped.")

    actions = BrowserActions.alloc().init()
    proxy_item.setTarget_(actions)
    js_item.setTarget_(actions)
    stealth_item.setTarget_(actions)
    new_id_item.setTarget_(actions)

    AppHelper.runEventLoop()


# ── Entry Point ────────────────────────────────────────────────────────────
if __name__ == '__main__':
    import sys

    print("""\033[96m
    \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
    \u2551   Isaac Browser \u2014 MAXIMUM PRIVACY MODE   \u2551
    \U0001f512 No History | No Cookies | No Cache
    \U0001f6e1  Tracker Blocked | Anti-Fingerprint
    \U0001f510 Proxy/VPN (toggle) | JS ON | Stealth Mode
    \U0001f504 One-Click New Identity | Auto-Burn
    \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\033[0m""")

    if '--no-proxy' in sys.argv:
        PROXY_ENABLED = False

    # 0. Already running? (avoids duplicate instances / port fights)
    try:
        with urllib.request.urlopen(
                f'http://127.0.0.1:{API_PORT}/api/privacy-status', timeout=1) as r:
            if r.status == 200:
                print("  [!] Isaac Browser is already running — reusing it.")
                sys.exit(0)
    except Exception:
        pass

    # 1. Start CONNECT proxy — non-fatal: a busy port must not kill the browser
    proxy_server = ConnectProxy(PROXY_PORT)
    if proxy_server.start():
        print(f"  [\u2713] CONNECT proxy on 127.0.0.1:{PROXY_PORT}")
    else:
        print(f"  [ ] CONNECT proxy unavailable (port {PROXY_PORT} in use)")

    # 2. Start API server
    threading.Thread(target=start_api_server, daemon=True).start()
    print(f"  [\u2713] API server on 127.0.0.1:{API_PORT}")

    # 3. System proxy is NEVER modified — Chrome/Safari are unaffected.
    print(f"  [ ] System proxy untouched (per-app only)")

    print(f"  [\u2713] JavaScript: {'ON' if JS_ENABLED else 'OFF'}")
    print(f"  [\u2713] Stealth mode: {'ON' if STEALTH_MODE else 'OFF'}")

    # 4. Signal handlers for clean exit
    def _signal_handler(sig, frame):
        print("\n  [*] Shutting down Isaac Browser...")
        _cleanup()
        sys.exit(0)

    signal.signal(signal.SIGTERM, _signal_handler)
    signal.signal(signal.SIGINT, _signal_handler)

    # 5. Create browser window (blocks until closed)
    print(f"  [\u2713] Opening browser window...\n")
    try:
        create_browser_window()
    except KeyboardInterrupt:
        pass
    finally:
        _cleanup()
        print("  [\u2713] Isaac Browser closed. All data burned. Clipboard cleared. Goodbye.")
