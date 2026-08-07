#!/usr/bin/env python3
"""
HKPC Bypass — defeats Palo Alto DNS interception + app filtering on HKPC WiFi
"""
import os, sys, json, time, socket, ssl, struct, base64, threading, select, signal
import urllib.request, urllib.parse, html as html_module, re
import subprocess
from PyObjCTools import AppHelper
import Cocoa, WebKit, objc

API_PORT, PROXY_PORT = 8560, 8561
TEMPLATES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")

DOH_PROVIDERS = [
    ('https://cloudflare-dns.com/dns-query', '1.1.1.1', '1.0.0.1'),
    ('https://dns.google/dns-query', '8.8.8.8', '8.8.4.4'),
    ('https://dns.quad9.net/dns-query', '9.9.9.9', '149.112.112.112'),
]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) HKPCBypass/1.0"

def _opener():
    ph = urllib.request.ProxyHandler({})
    hh = urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
    return urllib.request.build_opener(ph, hh)

def doh_resolve(hostname):
    labels = hostname.rstrip('.').split('.')
    buf = b'\xaa\xbb\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00'
    for l in labels: buf += struct.pack('B', len(l)) + l.encode()
    buf += b'\x00\x00\x01\x00\x01'
    qb64 = base64.urlsafe_b64encode(buf).rstrip(b'=').decode()
    opener = _opener()
    for url, ip1, ip2 in DOH_PROVIDERS:
        for ip in [ip1, ip2]:
            if not ip: continue
            try:
                url2 = f'https://{ip}/dns-query?dns={qb64}'
                req = urllib.request.Request(url2,
                    headers={'Accept':'application/dns-message','User-Agent':UA,'Host':urllib.parse.urlparse(url).hostname})
                resp = opener.open(req, timeout=5)
                body = resp.read()
                ancount = struct.unpack('>H', body[6:8])[0]
                pos = 12
                while pos < len(body):
                    if body[pos] == 0: pos += 5; break
                    pos += 1 + body[pos] + 1
                ips = []
                for _ in range(ancount):
                    if pos >= len(body): break
                    if body[pos] & 0xC0: pos += 2
                    else:
                        while pos < len(body) and body[pos]: pos += 1 + body[pos]
                        pos += 1
                    if pos + 10 > len(body): break
                    rtype, _, _, rdlen = struct.unpack('>HHIH', body[pos:pos+10])
                    pos += 10
                    if rtype == 1 and rdlen == 4:
                        ips.append('.'.join(str(b) for b in body[pos:pos+4]))
                    pos += rdlen
                if ips: return ips
            except: continue
    return []

class ConnectProxy:
    def __init__(self, p): self.port = p
    def start(self):
        self._s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._s.bind(('127.0.0.1', self.port))
        self._s.listen(50); self._s.settimeout(1)
        threading.Thread(target=self._serve, daemon=True).start()
    def stop(self):
        try: self._s.close()
        except: pass
    def _serve(self):
        while True:
            try:
                c, _ = self._s.accept()
                threading.Thread(target=self._handle, args=(c,), daemon=True).start()
            except socket.timeout: continue
            except: break
    def _handle(self, c):
        r = None
        try:
            c.settimeout(30)
            d = b''
            while b'\r\n\r\n' not in d:
                chunk = c.recv(4096)
                if not chunk: return
                d += chunk
            fl = d.split(b'\r\n')[0].decode()
            if not fl.startswith('CONNECT'): c.sendall(b'HTTP/1.1 405\r\n\r\n'); return
            hp = fl.split(' ')[1]
            h, p = hp.rsplit(':', 1) if ':' in hp else (hp, '443')
            port = int(p)
            ips = doh_resolve(h)
            if not ips: c.sendall(b'HTTP/1.1 502 DNS Failed\r\n\r\n'); return
            for ip in ips:
                try:
                    r = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    r.settimeout(10); r.connect((ip, port)); break
                except:
                    try: r.close()
                    except: pass
                    r = None
            if not r: c.sendall(b'HTTP/1.1 502\r\n\r\n'); return
            c.sendall(b'HTTP/1.1 200 Connection Established\r\n\r\n')
            socks = [c, r]
            while True:
                rl, _, _ = select.select(socks, [], [], 30)
                if not rl: break
                for s in rl:
                    data = s.recv(65536)
                    if not data: return
                    (r if s is c else c).sendall(data)
        except: pass
        finally:
            try: c.close()
            except: pass
            try: r.close()
            except: pass

def _detect_net():
    try:
        r = subprocess.run(['networksetup','-listallnetworkservices'], capture_output=True, text=True, timeout=5)
        for s in r.stdout.strip().split('\n'):
            s = s.strip()
            if not s or s.startswith('An') or 'VPN' in s: continue
            try:
                r2 = subprocess.run(['networksetup','-getinfo',s], capture_output=True, text=True, timeout=3)
                if 'IP address' in r2.stdout: return s
            except: continue
    except: pass
    return 'Wi-Fi'

_NET = _detect_net()
def _proxy_on():
    subprocess.run(['networksetup','-setwebproxy',_NET,'127.0.0.1',str(PROXY_PORT),'off'], timeout=5, capture_output=True)
    subprocess.run(['networksetup','-setsecurewebproxy',_NET,'127.0.0.1',str(PROXY_PORT),'off'], timeout=5, capture_output=True)
def _proxy_off():
    subprocess.run(['networksetup','-setwebproxystate',_NET,'off'], timeout=5, capture_output=True)
    subprocess.run(['networksetup','-setsecurewebproxystate',_NET,'off'], timeout=5, capture_output=True)

# ── API ────────────────────────────────────────────────────────────────────
from http.server import HTTPServer, BaseHTTPRequestHandler
class APIHandler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/api/status':
            self._json({'mode':'BYPASS','doh':'active','proxy':f'127.0.0.1:{PROXY_PORT}'})
        elif path in ('/newtab','/'):
            p = os.path.join(TEMPLATES,'newtab.html')
            if os.path.exists(p):
                with open(p) as f: self._html(f.read())
            else: self._html('<h1>HKPC Bypass</h1>')
        elif path == '/api/search':
            q = urllib.parse.parse_qs(self.path.split('?')[1] if '?' in self.path else '').get('q',[''])[0]
            self._json(self._search(q) if q else {'results':[]})
        else: self._json({'error':'not found'}, 404)
    def do_POST(self): self._json({'error':'not found'}, 404)
    def _json(self, d, s=200):
        b = json.dumps(d).encode()
        self.send_response(s); self.send_header('Content-Type','application/json')
        self.send_header('Content-Length',str(len(b))); self.end_headers(); self.wfile.write(b)
    def _html(self, h):
        b = h.encode()
        self.send_response(200); self.send_header('Content-Type','text/html; charset=utf-8')
        self.send_header('Content-Length',str(len(b))); self.end_headers(); self.wfile.write(b)
    def _search(self, q):
        opener = _opener()
        url = f'https://lite.duckduckgo.com/lite/?q={urllib.parse.quote(q)}'
        try:
            req = urllib.request.Request(url, headers={'User-Agent':UA,'Accept':'text/html'})
            resp = opener.open(req, timeout=10)
            html = resp.read().decode('utf-8', errors='replace')
            results = []; seen = set()
            for h, t in re.findall(r'<a[^>]*rel="nofollow"[^>]*href="([^"]*)"[^>]*>(.*?)</a>', html, re.DOTALL):
                t2 = html_module.unescape(re.sub(r'<[^>]+>','',t).strip()).split('|')[0].strip()
                if not t2 or not h or h in seen: continue
                real = h
                if 'uddg=' in h:
                    qs = urllib.parse.parse_qs(urllib.parse.urlparse(h).query)
                    if 'uddg' in qs: real = qs['uddg'][0]
                elif not h.startswith('http'): continue
                if not real.startswith('http'): continue
                seen.add(real)
                results.append({'title':t2[:150],'url':real[:500]})
                if len(results)>=20: break
            return {'results':results}
        except Exception as e:
            return {'results':[{'title':f'Search error: {e}','url':''}]}

def start_api():
    HTTPServer(('127.0.0.1', API_PORT), APIHandler).serve_forever()

# ── GUI ────────────────────────────────────────────────────────────────────
class AppDelegate(Cocoa.NSObject):
    def applicationDidFinishLaunching_(self, n):
        w = Cocoa.NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
            Cocoa.NSMakeRect(100,80,1200,800),
            Cocoa.NSTitledWindowMask|Cocoa.NSClosableWindowMask|
            Cocoa.NSMiniaturizableWindowMask|Cocoa.NSResizableWindowMask,
            Cocoa.NSBackingStoreBuffered, False)
        w.setTitle_("HKPC Bypass"); w.setMinSize_(Cocoa.NSMakeSize(600,400))
        c = WebKit.WKWebViewConfiguration.alloc().init()
        c.setWebsiteDataStore_(WebKit.WKWebsiteDataStore.nonPersistentDataStore())
        p = WebKit.WKPreferences.alloc().init()
        p.setJavaScriptEnabled_(True); c.setPreferences_(p)
        v = WebKit.WKWebView.alloc().initWithFrame_configuration_(
            Cocoa.NSMakeRect(0,0,1200,800), c)
        v.setAutoresizingMask_(Cocoa.NSViewWidthSizable|Cocoa.NSViewHeightSizable)
        v.setNavigationDelegate_(self); v.setUIDelegate_(self)
        w.contentView().addSubview_(v)
        url = Cocoa.NSURL.URLWithString_(f"http://127.0.0.1:{API_PORT}/newtab")
        v.loadRequest_(Cocoa.NSURLRequest.requestWithURL_(url))
        w.makeKeyAndOrderFront_(None)
        Cocoa.NSApplication.sharedApplication().activateIgnoringOtherApps_(True)
        self.win, self.web = w, v
        print("[HKPC] Window ready — HKPC WiFi bypass active")
    def windowWillClose_(self, n):
        _proxy_off()
        Cocoa.NSApplication.sharedApplication().terminate_(None)
    def webView_didFinishNavigation_(self, w, n): pass
    def webView_createWebViewWithConfiguration_forNavigationAction_windowFeatures_(self, w, c, a, f):
        if a.request().URL():
            self.web.loadRequest_(a.request())
        return None

def main():
    proxy = ConnectProxy(PROXY_PORT); proxy.start(); time.sleep(0.2)
    _proxy_on()
    threading.Thread(target=start_api, daemon=True).start(); time.sleep(0.2)
    signal.signal(signal.SIGTERM, lambda *a: (_proxy_off(), sys.exit(0)))
    signal.signal(signal.SIGINT, lambda *a: (_proxy_off(), sys.exit(0)))
    print("="*50); print("  HKPC BYPASS — DoH + CONNECT Proxy Active")
    print("  Close window to disable"); print("="*50)
    app = Cocoa.NSApplication.sharedApplication()
    app.setActivationPolicy_(Cocoa.NSApplicationActivationPolicyRegular)
    d = AppDelegate.alloc().init()
    app.setDelegate_(d)
    AppHelper.runEventLoop()

if __name__ == "__main__":
    main()
