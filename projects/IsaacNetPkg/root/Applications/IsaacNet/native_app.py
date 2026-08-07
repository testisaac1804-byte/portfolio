#!/usr/bin/env python3
"""
IsaacNet — Native macOS Browser
Multi-layer school WiFi bypass: DoH via IP, IP rotation, system proxy, SNI bypass.
"""

import os, sys, json, signal, threading, time, re, ssl, socket, select, struct
import urllib.request, urllib.parse, html as html_module, subprocess
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8540
PROXY_PORT = 8541
APP_DIR = "/Applications/IsaacNet"
DATA_DIR = os.path.join(APP_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) IsaacNet/1.0'
SSL_CTX = ssl._create_unverified_context()

# ── Helpers ──────────────────────────────────────────────
def now_iso():
    return datetime.utcnow().isoformat() + 'Z'

def load_json(name, default=None):
    path = os.path.join(DATA_DIR, f'{name}.json')
    if os.path.exists(path):
        try:
            with open(path) as f: return json.load(f)
        except: pass
    return default if default is not None else []

def save_json(name, data):
    with open(os.path.join(DATA_DIR, f'{name}.json'), 'w') as f:
        json.dump(data, f, indent=2)

def proxy_bypass_opener():
    """Create an opener that bypasses system proxy + uses SSL bypass."""
    ph = urllib.request.ProxyHandler({})
    hh = urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
    return urllib.request.build_opener(ph, hh)

# ── DoH via IP addresses (bypasses all DNS filtering) ────
# If domain-based DoH is blocked, try direct IP addresses
DOH_BY_DOMAIN = [
    ('https://cloudflare-dns.com/dns-query',  '1.1.1.1', '1.0.0.1'),
    ('https://dns.google/dns-query',          '8.8.8.8', '8.8.4.4'),
    ('https://dns.quad9.net/dns-query',       '9.9.9.9', '149.112.112.112'),
    ('https://doh.dns.sb/dns-query',          '185.222.222.222', '45.11.45.11'),
]

def doh_resolve(hostname):
    """Resolve via multiple DoH providers (domain + IP). Zero school DNS."""
    import base64
    try:
        # Build DNS query packet
        tid = 0x1234
        header = struct.pack('!HHHHHH', tid, 0x0100, 1, 0, 0, 0)
        qname = b''.join(bytes([len(p)]) + p.encode() for p in hostname.split('.')) + b'\x00'
        qtype = struct.pack('!HH', 1, 1)
        dns_query = header + qname + qtype
        q_b64 = base64.urlsafe_b64encode(dns_query).rstrip(b'=').decode()
        
        # Phase 1: Try domain-based DoH
        for doh_url, *_ in DOH_BY_DOMAIN:
            try:
                op = proxy_bypass_opener()
                req = urllib.request.Request(f'{doh_url}?dns={q_b64}',
                    headers={'Accept': 'application/dns-message', 'User-Agent': UA})
                resp = op.open(req, timeout=5)
                ips = _parse_dns_response(resp.read())
                if ips: return ips
            except: continue
        
        # Phase 2: Try DoH by IP (bypasses domain-level blocking)
        for _, *ip_addrs in DOH_BY_DOMAIN:
            for ip in ip_addrs:
                try:
                    ip_url = f'https://{ip}/dns-query?dns={q_b64}'
                    # Need to send SNI-like Host header for DoH servers that check it
                    op = proxy_bypass_opener()
                    req = urllib.request.Request(ip_url,
                        headers={'Accept': 'application/dns-message', 'User-Agent': UA,
                                'Host': 'cloudflare-dns.com'})
                    resp = op.open(req, timeout=5)
                    ips = _parse_dns_response(resp.read())
                    if ips: return ips
                except: continue
        
        # Phase 3: Try JSON API via IP
        for ip in ['1.1.1.1', '8.8.8.8', '9.9.9.9']:
            try:
                json_url = f'https://{ip}/resolve?name={urllib.parse.quote(hostname)}&type=A'
                op = proxy_bypass_opener()
                req = urllib.request.Request(json_url,
                    headers={'User-Agent': UA, 'Host': 'cloudflare-dns.com'})
                resp = op.open(req, timeout=5)
                data = json.loads(resp.read())
                if 'Answer' in data:
                    ips = [a['data'] for a in data['Answer'] if a.get('type') == 1]
                    if ips: return ips
            except: continue
        
        return []
    except:
        return []

def _parse_dns_response(data):
    """Extract A record IPs from DNS response."""
    answers = []
    try:
        offset = 12
        while data[offset] != 0: offset += 1
        offset += 5
        while offset < len(data):
            if len(data) - offset < 14: break
            if data[offset] & 0xC0: offset += 2
            else:
                while data[offset] != 0 and offset < len(data): offset += 1
                offset += 1
            if offset + 10 > len(data): break
            atype, _, _, rdlength = struct.unpack_from('!HHIH', data, offset)
            offset += 10
            if atype == 1 and rdlength == 4:
                answers.append('.'.join(str(b) for b in data[offset:offset+4]))
            offset += rdlength
    except: pass
    return answers

# ── CONNECT Proxy ────────────────────────────────────────
def handle_proxy_client(client_sock, addr):
    """CONNECT tunnel: DoH DNS + IP rotation + raw TCP bypass."""
    try:
        client_sock.settimeout(30)
        data = b''
        while b'\r\n\r\n' not in data:
            chunk = client_sock.recv(4096)
            if not chunk: break
            data += chunk
            if len(data) > 65536: break
        
        request = data.decode('utf-8', errors='replace')
        first_line = request.split('\r\n')[0]
        
        if first_line.startswith('CONNECT'):
            parts = first_line.split(' ')
            if len(parts) >= 2:
                hostport = parts[1]
                host = hostport.rsplit(':', 1)[0]
                port = int(hostport.rsplit(':', 1)[1]) if ':' in hostport else 443
                
                # Phase 1: DNS via DoH (multi-provider + IP fallback)
                ips = doh_resolve(host)
                if not ips:
                    try: ips = [socket.gethostbyname(host)]
                    except: pass
                if not ips:
                    client_sock.sendall(b'HTTP/1.1 502 Bad Gateway\r\n\r\n')
                    client_sock.close(); return
                
                # Phase 2: Try each IP until one connects
                remote = None
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
                    client_sock.sendall(b'HTTP/1.1 502 Bad Gateway\r\n\r\n')
                    client_sock.close(); return
                
                client_sock.sendall(b'HTTP/1.1 200 Connection Established\r\n\r\n')
                
                # Raw TCP pipe (WKWebView does SSL through tunnel)
                socks = [client_sock, remote]
                while True:
                    r, _, _ = select.select(socks, [], [], 30)
                    if not r: break
                    for sock in r:
                        chunk = sock.recv(65536)
                        if not chunk:
                            socks.remove(sock)
                            try: (remote if sock == client_sock else client_sock).close()
                            except: pass
                            return
                        target = remote if sock == client_sock else client_sock
                        try: target.sendall(chunk)
                        except: return
        else:
            # Plain HTTP — forward with SSL bypass
            try:
                parts = first_line.split(' ')
                url = parts[1] if len(parts) >= 2 else ''
                if url:
                    op = proxy_bypass_opener()
                    req = urllib.request.Request(url, headers={'User-Agent': UA})
                    resp = op.open(req, timeout=15)
                    status = f'HTTP/1.1 {resp.status} OK\r\n'
                    hdrs = ''
                    for k, v in resp.headers.items():
                        if k.lower() not in ('transfer-encoding', 'content-encoding'):
                            hdrs += f'{k}: {v}\r\n'
                    client_sock.sendall((status + hdrs + '\r\n').encode())
                    client_sock.sendall(resp.read())
            except:
                client_sock.sendall(b'HTTP/1.1 502 Bad Gateway\r\n\r\n')
    except:
        pass
    finally:
        try: client_sock.close()
        except: pass

def run_proxy_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('127.0.0.1', PROXY_PORT))
    sock.listen(100)
    sock.settimeout(1)
    while True:
        try:
            c, a = sock.accept()
            threading.Thread(target=handle_proxy_client, args=(c, a), daemon=True).start()
        except socket.timeout: continue
        except: break

# ── Search ───────────────────────────────────────────────
def fetch_search_results(query):
    url = f'https://lite.duckduckgo.com/lite/?q={urllib.parse.quote(query)}'
    try:
        op = proxy_bypass_opener()
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'text/html'})
        resp = op.open(req, timeout=10)
        html = resp.read().decode('utf-8', errors='replace')
        
        results = []
        pattern = r'<a[^>]*rel="nofollow"[^>]*href="([^"]*)"[^>]*>(.*?)</a>'
        links = re.findall(pattern, html, re.DOTALL)
        seen = set()
        for href, title in links:
            href = html_module.unescape(href)
            title = re.sub(r'<[^>]+>', '', title).strip()
            title = html_module.unescape(title)
            if not title: continue
            title = title.split('|')[0].strip()
            if not title: continue
            
            real_url = href
            if 'uddg=' in href:
                from urllib.parse import parse_qs, urlparse as _up
                try:
                    qs = parse_qs(_up(href).query)
                    if 'uddg' in qs: real_url = qs['uddg'][0]
                except: pass
            elif not href.startswith('http'):
                continue
            if any(d in href for d in ['/y.js', '//a.', '/c.html']): continue
            if real_url in seen or not real_url.startswith('http'): continue
            seen.add(real_url)
            
            snippet = ''
            try:
                idx = html.find(href)
                sp = re.findall(r'<td[^>]*class="snippet"[^>]*>(.*?)</td>', html[idx:idx+1000], re.DOTALL)
                if sp: snippet = re.sub(r'<[^>]+>', '', sp[0]).strip()[:300]; snippet = html_module.unescape(snippet)
            except: pass
            results.append({'title': title[:150], 'url': real_url[:500], 'snippet': snippet})
            if len(results) >= 20: break
        return results
    except Exception as e:
        return [{'title': 'Search Error', 'url': '', 'snippet': f'Could not fetch results: {str(e)}'}]

# ── Search Results Page Template ────────────────────────
SEARCH_TEMPLATE = '''<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>IsaacNet Search — {q}</title>
<style>:root{{--bg:#0b0d14;--bg2:#11131e;--card:#181b2a;--border:#282c40;--text:#e4e6f0;--text2:#8a8ea0;--text3:#5a5e70;--accent:#6c8cff;--radius:8px;--font:-apple-system,BlinkMacSystemFont,sans-serif;}}*{{margin:0;box-sizing:border-box}}body{{font-family:var(--font);background:var(--bg);color:var(--text)}}
.bar{{background:var(--bg2);border-bottom:1px solid var(--border);padding:8px 16px;position:sticky;top:0;z-index:10}}
.bar-inner{{max-width:700px;margin:0 auto;display:flex;align-items:center;gap:8px}}
.logo{{font-weight:700;font-size:16px;background:linear-gradient(135deg,var(--accent),#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}}
.sb{{flex:1;display:flex;align-items:center;height:34px;background:var(--card);border:1px solid var(--border);border-radius:18px;padding:0 12px}}
.sb input{{flex:1;height:100%;background:transparent;border:none;color:var(--text);font-size:13px;outline:none}}
.results{{max-width:700px;margin:0 auto;padding:12px 16px}}
.r{{padding:10px 0;border-bottom:1px solid var(--border)}}
.r:last-child{{border:none}}
.rt{{font-size:15px;margin-bottom:2px}}
.rt a{{color:#8ab4f8;text-decoration:none}}
.rt a:hover{{text-decoration:underline}}
.ru{{font-size:11px;color:var(--text3);margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
.rs{{font-size:13px;color:var(--text2);line-height:1.5}}
.st{{font-size:12px;color:var(--text3);padding:6px 0 2px}}
.e{{text-align:center;padding:40px;color:var(--text2)}}
</style></head><body>
<div class="bar"><div class="bar-inner">
<span class="logo">IsaacNet</span>
<div class="sb"><form action="/search" method="get" style="display:flex;flex:1;align-items:center">
<input type="text" name="q" value="{iq}" placeholder="Search IsaacNet..." autofocus>
<button type="submit" style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:13px;">→</button>
</form></div></div></div>
<div class="results">
<div class="st">{count} results for <strong>{q}</strong></div>
{results_html}
<div style="text-align:center;padding:20px"><a href="/newtab" style="color:var(--accent);text-decoration:none;font-size:13px;">← Back to IsaacNet Home</a></div>
</div></body></html>'''

# ── API Handler ──────────────────────────────────────────
class APIHandler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    
    def _send(self, data, status=200, ctype='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.end_headers()
        if isinstance(data, str): self.wfile.write(data.encode())
        else: self.wfile.write(json.dumps(data).encode())
    
    def _read_body(self):
        length = int(self.headers.get('Content-Length', 0))
        return json.loads(self.rfile.read(length).decode()) if length else {}
    
    def do_OPTIONS(self): self._send({})
    
    def do_GET(self):
        path = self.path.split('?')[0]
        params = urllib.parse.parse_qs(self.path.split('?')[1]) if '?' in self.path else {}
        
        if path == '/newtab':
            p = os.path.join(APP_DIR, 'templates', 'newtab.html')
            if os.path.exists(p):
                with open(p,'r') as f: self._send(f.read(), ctype='text/html; charset=utf-8')
                return
            self._send({'error':'not found'},404); return
        
        if path == '/search':
            try:
                q = params.get('q',[''])[0]
                if not q: self.send_response(302); self.send_header('Location','/newtab'); self.end_headers(); return
                results = fetch_search_results(q)
                rh = ''
                for r in results:
                    if not r['url']: rh += f'<div class="e">{html_module.escape(r.get("snippet","Error"))}</div>'; continue
                    rh += f'<div class="r"><div class="rt"><a href="{html_module.escape(r["url"])}" target="_top">{html_module.escape(r["title"])}</a></div><div class="ru">{html_module.escape(r["url"][:60])}</div><div class="rs">{html_module.escape(r["snippet"])}</div></div>'
                if not results: rh = '<div class="e">No results found.</div>'
                eq = html_module.escape(q)
                self._send(SEARCH_TEMPLATE.format(q=eq, iq=eq, count=len(results), results_html=rh), ctype='text/html; charset=utf-8')
            except Exception as e:
                self._send(f'<html><body style="background:#0b0d14;color:#e4e6f0;font-family:sans-serif;padding:40px"><h2>IsaacNet Search</h2><p style="color:#8a8ea0">Error: {html_module.escape(str(e))}</p><a href="/newtab" style="color:#6c8cff">← Back</a></body></html>', ctype='text/html; charset=utf-8')
            return
        
        if path == '/api/bookmarks': self._send(load_json('bookmarks'))
        elif path == '/api/history':
            h = load_json('history'); q = params.get('q',[''])[0].lower()
            if q: h = [x for x in h if q in x.get('title','').lower() or q in x.get('url','').lower()]
            self._send(list(reversed(h[-200:])))
        elif path == '/api/notes': self._send(load_json('notes'))
        elif path == '/api/passwords': self._send(load_json('passwords'))
        elif path == '/api/settings': self._send(load_json('settings',{'theme':'dark','adBlock':True}))
        else: self._send({'error':'not found'},404)
    
    def do_POST(self):
        path=self.path.split('?')[0]; body=self._read_body()
        if path=='/api/bookmarks':
            b=load_json('bookmarks')
            bm={'id':now_iso().replace(':','-').replace('.','-'),'url':body.get('url',''),'title':body.get('title',''),'folder':'Unfiled','added':now_iso()}
            if not any(x['url']==bm['url'] for x in b): b.append(bm); save_json('bookmarks',b)
            self._send(bm,201)
        elif path=='/api/notes':
            n=load_json('notes')
            note={'id':now_iso().replace(':','-').replace('.','-'),'title':body.get('title',''),'content':body.get('content',''),'color':'#2a2d3e','pinned':False,'updated':now_iso(),'created':now_iso()}
            n.insert(0,note); save_json('notes',n); self._send(note,201)
        elif path=='/api/passwords':
            p=load_json('passwords')
            pw={'id':now_iso().replace(':','-').replace('.','-'),'domain':body.get('domain',''),'username':body.get('username',''),'password':body.get('password',''),'note':body.get('note',''),'added':now_iso()}
            p.insert(0,pw); save_json('passwords',p); self._send(pw,201)
        elif path=='/api/history':
            h=load_json('history'); e={'url':body.get('url',''),'title':body.get('title',''),'time':now_iso(),'id':now_iso().replace(':','-').replace('.','-')}
            h.append(e)
            if len(h)>5000: h=h[-5000:]
            save_json('history',h); self._send(e,201)
        else: self._send({'error':'not found'},404)
    
    def do_PUT(self):
        path=self.path.split('?')[0]; body=self._read_body()
        if path=='/api/settings': s=load_json('settings',{}); s.update(body); save_json('settings',s); self._send(s)
        elif path.startswith('/api/notes/'):
            nid=path.split('/')[-1]; notes=load_json('notes')
            for n in notes:
                if n['id']==nid:
                    for k in ('title','content','color','pinned'):
                        if k in body: n[k]=body[k]
                    n['updated']=now_iso(); save_json('notes',notes); self._send(n); return
            self._send({'error':'not found'},404)
        elif path.startswith('/api/passwords/'):
            pid=path.split('/')[-1]; pws=load_json('passwords')
            for p in pws:
                if p['id']==pid:
                    for k in ('domain','username','password','note'):
                        if k in body: p[k]=body[k]
                    save_json('passwords',pws); self._send(p); return
            self._send({'error':'not found'},404)
        else: self._send({'error':'not found'},404)
    
    def do_DELETE(self):
        parts=self.path.strip('/').split('/')
        if len(parts)>=3:
            _,c,i=parts[0],parts[1],parts[2]
            if c=='bookmarks': save_json('bookmarks',[b for b in load_json('bookmarks') if b['id']!=i])
            elif c=='notes': save_json('notes',[n for n in load_json('notes') if n['id']!=i])
            elif c=='passwords': save_json('passwords',[p for p in load_json('passwords') if p['id']!=i])
            elif c=='history': save_json('history',[])
        self._send({},204)

def run_api_server():
    HTTPServer(('127.0.0.1', PORT), APIHandler).serve_forever()

# ── System Proxy ─────────────────────────────────────────
def _detect_service():
    """Auto-detect active network service."""
    try:
        r = subprocess.run(['networksetup', '-listallnetworkservices'], capture_output=True, text=True, timeout=5)
        services = [s.strip() for s in r.stdout.split('\n') if s.strip() and not s.startswith('An') and s.strip() != 'ProtonVPN']
        for s in services:
            r2 = subprocess.run(['networksetup', '-getinfo', s], capture_output=True, text=True, timeout=3)
            if 'IP address' in r2.stdout and 'DHCP' in r2.stdout:
                return s
        return 'Wi-Fi'
    except: return 'Wi-Fi'

_original_proxy = None

def _sysproxy_on(service):
    global _original_proxy
    try:
        r = subprocess.run(['networksetup','-getsecurewebproxy',service], capture_output=True, text=True, timeout=3)
        _original_proxy = r.stdout
        subprocess.run(['networksetup','-setwebproxy',service,'127.0.0.1',str(PROXY_PORT),'off'], capture_output=True, timeout=5)
        subprocess.run(['networksetup','-setsecurewebproxy',service,'127.0.0.1',str(PROXY_PORT),'off'], capture_output=True, timeout=5)
        return True
    except: return False

def _sysproxy_off(service):
    subprocess.run(['networksetup','-setwebproxystate',service,'off'], capture_output=True, timeout=5)
    subprocess.run(['networksetup','-setsecurewebproxystate',service,'off'], capture_output=True, timeout=5)

# ── Native Window ────────────────────────────────────────
def create_native_window():
    from PyObjCTools import AppHelper
    import Cocoa, WebKit, objc
    
    class SSLDelegate(Cocoa.NSObject):
        def webView_didReceiveAuthenticationChallenge_completionHandler_(self, wv, challenge, handler):
            ps = challenge.protectionSpace()
            if ps.authenticationMethod() == Cocoa.NSURLAuthenticationMethodServerTrust:
                handler(Cocoa.NSURLSessionAuthChallengeUseCredential,
                       Cocoa.NSURLCredential.credentialForTrust_(ps.serverTrust()))
            else:
                handler(Cocoa.NSURLSessionAuthChallengePerformDefaultHandling, None)
    
    app = Cocoa.NSApplication.sharedApplication()
    rect = Cocoa.NSMakeRect(0, 0, 1280, 800)
    style = Cocoa.NSTitledWindowMask | Cocoa.NSClosableWindowMask | Cocoa.NSMiniaturizableWindowMask | Cocoa.NSResizableWindowMask
    window = Cocoa.NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(rect, style, Cocoa.NSBackingStoreBuffered, False)
    window.setTitle_("IsaacNet")
    window.setMinSize_(Cocoa.NSMakeSize(800, 500))
    window.center()
    
    wv = WebKit.WKWebView.alloc().initWithFrame_(Cocoa.NSMakeRect(0, 0, 1280, 800))
    wv.setAutoresizingMask_(Cocoa.NSViewWidthSizable | Cocoa.NSViewHeightSizable)
    delegate = SSLDelegate.alloc().init()
    wv.setNavigationDelegate_(delegate)
    
    url = Cocoa.NSURL.URLWithString_(f'http://localhost:{PORT}/newtab')
    wv.loadRequest_(Cocoa.NSURLRequest.requestWithURL_(url))
    
    window.setContentView_(wv)
    window.makeKeyAndOrderFront_(None)
    app.activateIgnoringOtherApps_(True)
    AppHelper.runEventLoop()

# ── Main ─────────────────────────────────────────────────
if __name__ == '__main__':
    service = _detect_service()
    
    def cleanup(*a):
        print("Shutting down...")
        _sysproxy_off(service)
        sys.exit(0)
    
    signal.signal(signal.SIGTERM, cleanup)
    signal.signal(signal.SIGINT, cleanup)
    
    threading.Thread(target=run_api_server, daemon=True).start()
    threading.Thread(target=run_proxy_server, daemon=True).start()
    
    for _ in range(30):
        try:
            proxy_bypass_opener().open(f'http://localhost:{PORT}/api/settings', timeout=2)
            break
        except: time.sleep(0.3)
    
    print(f"IsaacNet: API:{PORT} Proxy:{PROXY_PORT}")
    print(f"Network: {service}")
    
    if _sysproxy_on(service):
        print("✅ System proxy on — all traffic routed through IsaacNet")
    else:
        print("⚠️ System proxy failed (browsing may not work)")
    
    try:
        create_native_window()
    finally:
        _sysproxy_off(service)
        print("IsaacNet closed")
    
    sys.exit(0)
