#!/usr/bin/env python3
"""
MacAdBlock v2 — macOS DNS sinkhole ad-blocker.
Binary-searches sorted 40-bit FNV-1a hash blocklist,
forwards legitimate queries to upstream DNS (Quad9).
HTTP API on port 8053 for management + dashboard.
Runs as root daemon on port 53.
"""
import socket, struct, os, sys, json, threading, time, collections, subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class ReusableHTTPServer(HTTPServer):
    allow_reuse_address = True

# --- config ---
HASH_BYTES = 5
MASK = (1 << (HASH_BYTES * 8)) - 1
FNV_OFFSET = 0xcbf29ce484222325
FNV_PRIME = 0x100000001b3
U64 = (1 << 64) - 1
UPSTREAM_DNS = [('9.9.9.9', 53), ('1.1.1.1', 53)]  # Quad9 + Cloudflare fallback
BLOCKLIST_PATH = os.path.join(os.path.dirname(__file__), '..', 'blocklist', 'blocklist.bin')
BIND_ADDR = '0.0.0.0'
DNS_PORT = 53  # Direct port 53 (requires root)
HTTP_PORT = 8053
QUERY_LOG_SIZE = 1000  # ring buffer

# --- state (thread-safe) ---
_lock = threading.Lock()
running = False
dns_worker_thread = None
blocklist_data = b''
num_hashes = 0
total_blocked = 0
total_allowed = 0
clients = {}
custom_domains = {}       # domain -> hash
custom_hashes = set()     # just hashes for O(1) lookup
allowlist_domains = {}    # domain -> hash (bypass blocklist)
allowlist_hashes = set()
banned_ips = set()
query_log = collections.deque(maxlen=QUERY_LOG_SIZE)
start_time = time.time()
last_query_time = 0
queries_last_minute = 0
minute_window_start = 0

def fnv_hash(data: bytes) -> int:
    h = FNV_OFFSET
    for c in data:
        h = ((h ^ c) * FNV_PRIME) & U64
    return h & MASK

def load_blocklist(path=None):
    global blocklist_data, num_hashes
    p = path or BLOCKLIST_PATH
    if not os.path.exists(p):
        print(f"[macadblock] no blocklist at {p}")
        blocklist_data = b''
        num_hashes = 0
        return
    with open(p, 'rb') as f:
        blocklist_data = f.read()
    num_hashes = len(blocklist_data) // HASH_BYTES
    print(f"[macadblock] loaded {num_hashes:,} blocklist entries ({len(blocklist_data):,} bytes)")

def in_blocklist(hash_val: int) -> bool:
    if num_hashes == 0:
        return False
    lo, hi = 0, num_hashes - 1
    while lo <= hi:
        mid = (lo + hi) >> 1
        v = int.from_bytes(blocklist_data[mid*HASH_BYTES:(mid+1)*HASH_BYTES], 'little')
        if v < hash_val:
            lo = mid + 1
        elif v > hash_val:
            hi = mid - 1
        else:
            return True
    return False

def is_blocked(domain: str) -> bool:
    domain = domain.lower().strip('.')
    if domain.startswith('www.'):
        domain = domain[4:]
    # Check allowlist first — if allowed, never block
    check = domain
    while True:
        h = fnv_hash(check.encode())
        if h in allowlist_hashes:
            return False
        dot = check.find('.')
        if dot < 0:
            break
        parent = check[dot+1:]
        if '.' not in parent:
            break
        check = parent
    # Check blocklist + custom
    check = domain
    while True:
        h = fnv_hash(check.encode())
        if in_blocklist(h) or h in custom_hashes:
            return True
        dot = check.find('.')
        if dot < 0:
            break
        parent = check[dot+1:]
        if '.' not in parent:
            break
        check = parent
    return False

def parse_dns_query(data: bytes):
    if len(data) < 13:
        return None
    i = 12
    labels = []
    while i < len(data):
        l = data[i]
        if l == 0:
            i += 1
            break
        if l & 0xC0:
            i += 2
            break
        i += 1
        if i + l > len(data):
            return None
        labels.append(data[i:i+l].decode('ascii', errors='ignore').lower())
        i += l
    if i + 4 > len(data):
        return None
    domain = '.'.join(labels)
    qtype = (data[i] << 8) | data[i+1]
    if domain.startswith('www.') and len(domain) > 4:
        domain = domain[4:]
    return domain, qtype

def build_blocked_response(query: bytes, qtype: int):
    tid = query[:2]
    flags = struct.pack('>H', 0x8180)
    qdcount = struct.pack('>H', 1)
    ancount = struct.pack('>H', 1 if qtype == 1 else 0)
    nscount = struct.pack('>H', 0)
    arcount = struct.pack('>H', 0)
    header = tid + flags + qdcount + ancount + nscount + arcount
    qstart = 12
    while qstart < len(query):
        if query[qstart] == 0:
            qstart += 5
            break
        if query[qstart] & 0xC0:
            qstart += 2
            break
        qstart += 1 + query[qstart]
    question = query[12:qstart]
    if qtype != 1:
        return header + question
    answer = struct.pack('>HHHIH', 0xC00C, 1, 1, 300, 4) + bytes([0, 0, 0, 0])
    return header + question + answer

def build_forward_response(query: bytes, upstream_reply: bytes):
    return query[:2] + upstream_reply[2:]

def build_error_response(query: bytes):
    tid = query[:2]
    flags = struct.pack('>H', 0x8182)
    err = tid + flags + struct.pack('>HHHH', 1, 0, 0, 0)
    qstart = 12
    while qstart < len(query):
        if query[qstart] == 0:
            qstart += 5
            break
        if query[qstart] & 0xC0:
            qstart += 2
            break
        qstart += 1 + query[qstart]
    err += query[12:qstart]
    return err

def dns_worker():
    global total_blocked, total_allowed, running, last_query_time, queries_last_minute, minute_window_start, _keep_alive
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind((BIND_ADDR, DNS_PORT))
    except OSError as e:
        print(f"[macadblock] DNS bind failed: {e}")
        with _lock:
            running = False
        return
    sock.settimeout(1.0)
    # Create upstream sockets (one per upstream DNS)
    upstreams = []
    for addr in UPSTREAM_DNS:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(2.0)
        upstreams.append((s, addr))

    print(f"[macadblock] DNS sinkhole on {BIND_ADDR}:{DNS_PORT} (upstream: {', '.join(a[0] for a in UPSTREAM_DNS)})")

    while True:
        try:
            data, addr = sock.recvfrom(1024)
        except socket.timeout:
            # Check if we should exit
            with _lock:
                if not running and not _keep_alive:
                    break
            continue
        except Exception:
            continue

        # If paused, just drop queries silently
        with _lock:
            if not running:
                continue

        if not data or len(data) < 13:
            continue
        result = parse_dns_query(data)
        if result is None:
            continue
        domain, qtype = result
        ip_str = addr[0]
        now = time.time()

        # Track query rate
        with _lock:
            last_query_time = now
            if now - minute_window_start >= 60:
                minute_window_start = now
                queries_last_minute = 0
            queries_last_minute += 1

        with _lock:
            if ip_str not in clients:
                clients[ip_str] = {'blocked': 0, 'allowed': 0}
            client = clients[ip_str]
            blocked = ip_str in banned_ips or is_blocked(domain)

        if blocked:
            with _lock:
                total_blocked += 1
                client['blocked'] += 1
                query_log.append({'time': now, 'domain': domain, 'client': ip_str, 'action': 'blocked', 'qtype': qtype})
            resp = build_blocked_response(data, qtype)
            try:
                sock.sendto(resp, addr)
            except Exception:
                pass
        else:
            with _lock:
                total_allowed += 1
                client['allowed'] += 1
                query_log.append({'time': now, 'domain': domain, 'client': ip_str, 'action': 'allowed', 'qtype': qtype})
            # Try each upstream DNS
            replied = False
            for up_sock, up_addr in upstreams:
                try:
                    up_sock.sendto(data, up_addr)
                    reply, _ = up_sock.recvfrom(1024)
                    resp = build_forward_response(data, reply)
                    sock.sendto(resp, addr)
                    replied = True
                    break
                except socket.timeout:
                    continue
                except Exception:
                    continue
            if not replied:
                err = build_error_response(data)
                try:
                    sock.sendto(err, addr)
                except Exception:
                    pass

    sock.close()
    for s, _ in upstreams:
        s.close()
    print("[macadblock] DNS worker stopped")

# Keep-alive flag: when True, DNS worker stays alive even when running=False (paused)
_keep_alive = True

# --- HTTP API ---
class APIHandler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_GET(self):
        global running, total_blocked, total_allowed, custom_domains, custom_hashes
        global allowlist_domains, allowlist_hashes, banned_ips, num_hashes, blocklist_data, clients
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        if path == '/api/stats':
            with _lock:
                cl = [{'ip': ip, 'blocked': c['blocked'], 'allowed': c['allowed'],
                       'banned': ip in banned_ips} for ip, c in clients.items()]
                log_copy = list(query_log)
                self._json({
                    'running': running,
                    'blocked': total_blocked,
                    'allowed': total_allowed,
                    'num_hashes': num_hashes,
                    'blocklist_size': len(blocklist_data),
                    'clients': sorted(cl, key=lambda x: -(x['blocked'] + x['allowed'])),
                    'custom': list(custom_domains.keys()),
                    'allowlist': list(allowlist_domains.keys()),
                    'banned': list(banned_ips),
                    'queries': log_copy,  # all queries (up to 1000)
                    'uptime': int(time.time() - start_time),
                    'qpm': queries_last_minute,
                })
        elif path == '/api/toggle':
            with _lock:
                running = not running
            self._json({'running': running})
        elif path == '/api/status':
            with _lock:
                self._json({'running': running})
        elif path == '/api/addblock':
            d = params.get('d', [None])[0]
            if d and '.' in d:
                d = d.strip().lower()
                if d.startswith('www.'):
                    d = d[4:]
                with _lock:
                    if d in custom_domains:
                        self._json({'ok': False, 'error': 'exists'})
                    else:
                        h = fnv_hash(d.encode())
                        custom_domains[d] = h
                        custom_hashes.add(h)
                        save_custom()
                        # Flush system + Chrome DNS cache so blocking takes effect immediately
                        flush_dns_cache()
                        self._json({'ok': True, 'domain': d})
            else:
                self._json({'ok': False, 'error': 'invalid'})
        elif path == '/api/unblock':
            d = params.get('d', [None])[0]
            if d:
                d = d.strip().lower()
                with _lock:
                    # Remove from custom blocklist
                    if d in custom_domains:
                        custom_hashes.discard(custom_domains.pop(d))
                        save_custom()
                    # Auto-add to allowlist so it bypasses main blocklist too
                    if d not in allowlist_domains:
                        h = fnv_hash(d.encode())
                        allowlist_domains[d] = h
                        allowlist_hashes.add(h)
                        save_allowlist()
                    flush_dns_cache()
                self._json({'ok': True})
        elif path == '/api/allow':
            d = params.get('d', [None])[0]
            if d and '.' in d:
                d = d.strip().lower()
                if d.startswith('www.'):
                    d = d[4:]
                with _lock:
                    if d in allowlist_domains:
                        self._json({'ok': False, 'error': 'exists'})
                    else:
                        h = fnv_hash(d.encode())
                        allowlist_domains[d] = h
                        allowlist_hashes.add(h)
                        save_allowlist()
                        self._json({'ok': True, 'domain': d})
            else:
                self._json({'ok': False, 'error': 'invalid'})
        elif path == '/api/disallow':
            d = params.get('d', [None])[0]
            if d:
                d = d.strip().lower()
                with _lock:
                    if d in allowlist_domains:
                        allowlist_hashes.discard(allowlist_domains.pop(d))
                        save_allowlist()
                        flush_dns_cache()
                self._json({'ok': True})
        elif path == '/api/ban':
            ip = params.get('ip', [None])[0]
            if ip:
                with _lock:
                    if ip in banned_ips:
                        banned_ips.discard(ip)
                    else:
                        banned_ips.add(ip)
                    save_banned()
                    self._json({'ok': True, 'banned': ip in banned_ips})
        elif path == '/api/reload':
            load_blocklist()
            self._json({'ok': True, 'num_hashes': num_hashes})
        elif path == '/api/clearlog':
            with _lock:
                query_log.clear()
            self._json({'ok': True})
        elif path == '/api/reset':
            with _lock:
                total_blocked = 0
                total_allowed = 0
                clients.clear()
                query_log.clear()
            self._json({'ok': True})
        else:
            if path == '/' or path == '/index.html':
                self.serve_dashboard()
            else:
                self._json({'error': 'not found'}, 404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()

    def serve_dashboard(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(DASHBOARD_HTML.encode())

def save_custom():
    p = os.path.join(os.path.dirname(BLOCKLIST_PATH), 'custom.txt')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f:
        for d in sorted(custom_domains.keys()):
            f.write(d + '\n')

def flush_dns_cache():
    """Flush system DNS cache so blocking takes effect immediately."""
    try:
        # Flush macOS system DNS cache
        subprocess.run(['sudo', 'dscacheutil', '-flushcache'], capture_output=True, timeout=5)
        subprocess.run(['sudo', 'killall', '-HUP', 'mDNSResponder'], capture_output=True, timeout=5)
        print("[macadblock] DNS cache flushed")
    except Exception as e:
        print(f"[macadblock] DNS cache flush failed: {e}")

def load_custom():
    global custom_domains, custom_hashes
    p = os.path.join(os.path.dirname(BLOCKLIST_PATH), 'custom.txt')
    if os.path.exists(p):
        with open(p) as f:
            for line in f:
                d = line.strip().lower()
                if d:
                    if d.startswith('www.'):
                        d = d[4:]
                    h = fnv_hash(d.encode())
                    custom_domains[d] = h
                    custom_hashes.add(h)

def save_allowlist():
    p = os.path.join(os.path.dirname(BLOCKLIST_PATH), 'allowlist.txt')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f:
        for d in sorted(allowlist_domains.keys()):
            f.write(d + '\n')

def load_allowlist():
    global allowlist_domains, allowlist_hashes
    p = os.path.join(os.path.dirname(BLOCKLIST_PATH), 'allowlist.txt')
    if os.path.exists(p):
        with open(p) as f:
            for line in f:
                d = line.strip().lower()
                if d:
                    if d.startswith('www.'):
                        d = d[4:]
                    h = fnv_hash(d.encode())
                    allowlist_domains[d] = h
                    allowlist_hashes.add(h)

def save_banned():
    p = os.path.join(os.path.dirname(BLOCKLIST_PATH), 'banned.txt')
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f:
        for ip in sorted(banned_ips):
            f.write(ip + '\n')

def load_banned():
    global banned_ips
    p = os.path.join(os.path.dirname(BLOCKLIST_PATH), 'banned.txt')
    if os.path.exists(p):
        with open(p) as f:
            for line in f:
                ip = line.strip()
                if ip:
                    banned_ips.add(ip)

DASHBOARD_HTML = r"""<!doctype html>
<html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>MacAdBlock</title><style>
*{box-sizing:border-box}
body{font:14px/1.5 system-ui,-apple-system,sans-serif;margin:0;background:#0d1117;color:#c9d1d9}
header{background:#161b22;padding:12px 20px;border-bottom:1px solid #30363d;display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:10}
h1{margin:0;font-size:17px;white-space:nowrap}h1 span{color:#8b949e;font-weight:400;font-size:13px;margin-left:6px}
.toggle{position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0}
.slider{position:absolute;inset:0;background:#21262d;border-radius:24px;transition:.25s}
.slider::before{content:"";position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:#8b949e;border-radius:50%;transition:.25s}
.toggle input:checked+.slider{background:#238636}
.toggle input:checked+.slider::before{background:#fff;transform:translateX(20px)}
.wrap{padding:16px 20px;max-width:1100px;margin:auto}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:20px}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:12px 14px}
.card .v{font-size:20px;font-weight:700;line-height:1.2}.card .l{color:#8b949e;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.b{color:#f85149}.a{color:#3fb950}.q{color:#58a6ff}
table{width:100%;border-collapse:collapse;background:#161b22;border-radius:8px;overflow:hidden;margin-bottom:16px;font-size:13px}
th,td{padding:7px 10px;text-align:left;border-bottom:1px solid #21262d}
th{background:#21262d;color:#8b949e;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:.5px}
tr:hover td{background:#1c2128}
.tag{display:inline-block;background:#30363d;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:500}
.tag.blocked{background:#3d1f1f;color:#f85149}.tag.allowed{background:#1a3326;color:#3fb950}
button{background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:12px}
button:hover{background:#30363d}button.danger{border-color:#f8514940;color:#f85149}
input{background:#0d1117;border:1px solid #30363d;color:#c9d1d9;border-radius:5px;padding:5px 8px;font-size:13px}
input:focus{outline:none;border-color:#58a6ff}
h2{font-size:13px;color:#8b949e;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.5px}
.row{display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap}
.mono{font-family:'SF Mono',Menlo,monospace;font-size:12px}
.empty{color:#484f58;font-style:italic;padding:8px 0}
.actions{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.actions button{font-size:11px;padding:4px 10px}
</style></head><body>
<header>
<label class=toggle><input type=checkbox id=tog onchange=toggle()><span class=slider></span></label>
<h1>🛡️ MacAdBlock <span id=host></span></h1>
</header>
<div class=wrap>
<div class=cards id=sys></div>

<div class=actions>
<button onclick=reload()>🔄 Reload Blocklist</button>
<button onclick=resetStats()>📊 Reset Stats</button>
<button onclick=clearLog()>🗑️ Clear Log</button>
</div>

<h2>Recent Queries</h2>
<table id=ql><thead><tr><th>Time</th><th>Domain</th><th>Client</th><th>Action</th></tr></thead><tbody></tbody></table>

<h2>Clients</h2>
<table id=ct><thead><tr><th>Client</th><th>Blocked</th><th>Allowed</th><th></th></tr></thead><tbody></tbody></table>

<h2>Custom Blocked Domains</h2>
<div class=row><input id=dom placeholder="ads.example.com" size=28><button onclick=addDom()>+ Block</button></div>
<table id=cl><tbody></tbody></table>

<h2>Allowlist (never block)</h2>
<div class=row><input id=alw placeholder="example.com" size=28><button onclick=addAllow()>+ Allow</button></div>
<table id=alt><tbody></tbody></table>
</div>

<script>
async function api(p){let r=await fetch(p);return r.json()}
function fmt(n){return n.toLocaleString()}
function fmtTime(t){let d=new Date(t*1000);return d.toLocaleTimeString()}
function fmtUptime(s){let h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h+'h '+m+'m'}

async function load(){
let s=await api('/api/stats');
tog.checked=s.running;
host.textContent=(s.running?'ON':'OFF')+' · '+fmt(s.qpm)+' q/m · uptime '+fmtUptime(s.uptime);
sys.innerHTML=[
['Blocked',fmt(s.blocked),'b'],['Allowed',fmt(s.allowed),'a'],
['Blocklist',fmt(s.num_hashes),'q'],['Clients',s.clients.length,''],
['Size',(s.blocklist_size/1048576).toFixed(2)+' MB','']
].map(c=>'<div class=card><div class="v '+c[2]+'">'+c[1]+'</div><div class=l>'+c[0]+'</div></div>').join('');

// Query log
ql.tBodies[0].innerHTML=(s.queries||[]).reverse().map(q=>
'<tr><td class=mono>'+fmtTime(q.time)+'</td><td class=mono>'+q.domain+'</td><td class=mono>'+q.client+'</td><td><span class="tag '+q.action+'">'+q.action+'</span></td></tr>'
).join('')||'<tr><td colspan=4 class=empty>no queries yet</td></tr>';

// Clients
ct.tBodies[0].innerHTML=s.clients.sort((a,b)=>(b.blocked+b.allowed)-(a.blocked+a.allowed)).map(c=>
'<tr><td class=mono>'+c.ip+(c.banned?' <span class=tag style="background:#3d1f1f;color:#f85149">BANNED</span>':'')+'</td>'+
'<td class=b>'+fmt(c.blocked)+'</td><td class=a>'+fmt(c.allowed)+'</td>'+
'<td><button class=danger onclick="api(\'/api/ban?ip='+c.ip+'\').then(load)">'+(c.banned?'Unban':'Ban')+'</button></td></tr>'
).join('')||'<tr><td colspan=4 class=empty>no clients yet</td></tr>';

// Custom blocked
cl.tBodies[0].innerHTML=s.custom.map(d=>'<tr><td class=mono>'+d+'</td><td style=text-align:right><button class=danger onclick="api(\'/api/unblock?d='+encodeURIComponent(d)+'\').then(load)">remove</button></td></tr>').join('')||'<tr><td class=empty>none</td></tr>';

// Allowlist
alt.tBodies[0].innerHTML=(s.allowlist||[]).map(d=>'<tr><td class=mono>'+d+'</td><td style=text-align:right><button class=danger onclick="api(\'/api/disallow?d='+encodeURIComponent(d)+'\').then(load)">remove</button></td></tr>').join('')||'<tr><td class=empty>none</td></tr>';
}

function toggle(){api('/api/toggle').then(load)}
function addDom(){let d=dom.value.trim();if(d){api('/api/addblock?d='+encodeURIComponent(d)).then(()=>{dom.value='';load()})}}
function addAllow(){let d=alw.value.trim();if(d){api('/api/allow?d='+encodeURIComponent(d)).then(()=>{alw.value='';load()})}}
function reload(){api('/api/reload').then(r=>{if(r.ok)alert('Blocklist reloaded: '+r.num_hashes+' entries')})}
function resetStats(){if(confirm('Reset all stats?'))api('/api/reset').then(load)}
function clearLog(){api('/api/clearlog').then(load)}
load();setInterval(load,2000);
</script></body></html>"""

def run_http():
    try:
        server = ReusableHTTPServer(('127.0.0.1', HTTP_PORT), APIHandler)
        print(f"[macadblock] Dashboard at http://127.0.0.1:{HTTP_PORT}")
        server.serve_forever()
    except OSError as e:
        print(f"[macadblock] HTTP server failed: {e}")

def main():
    global running, dns_worker_thread, _keep_alive
    load_blocklist()
    load_custom()
    load_allowlist()
    load_banned()
    print("=" * 50)
    print("MacAdBlock v2 — macOS DNS Sinkhole")
    print(f"  Blocklist: {num_hashes:,} domains ({len(blocklist_data):,} bytes)")
    print(f"  Custom: {len(custom_domains)} blocked, {len(allowlist_domains)} allowed")
    print(f"  Banned IPs: {len(banned_ips)}")
    print(f"  Dashboard: http://127.0.0.1:{HTTP_PORT}")
    print(f"  Upstream: {', '.join(a[0] for a in UPSTREAM_DNS)}")
    print("=" * 50)
    print()

    # Start dashboard HTTP (always runs)
    http_thread = threading.Thread(target=run_http, daemon=True)
    http_thread.start()

    # Start DNS worker immediately (stays alive, paused when running=False)
    running = True
    dns_worker_thread = threading.Thread(target=dns_worker, daemon=True)
    dns_worker_thread.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[macadblock] shutdown")
        running = False
        _keep_alive = False
        time.sleep(1.5)

if __name__ == '__main__':
    main()
