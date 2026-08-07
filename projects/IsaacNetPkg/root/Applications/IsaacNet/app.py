#!/usr/bin/env python3
"""
Isaacium — Ultimate Browser Engine
Flask backend with transparent proxy, bookmarks, history, notes, and more.
"""

import os
import json
import re
import urllib.parse
import html as html_module
from datetime import datetime
from io import BytesIO

import requests
from flask import (
    Flask, request, jsonify, send_from_directory,
    render_template, Response, make_response, redirect
)

# ── App Setup ──────────────────────────────────────────────
app = Flask(__name__, static_folder='static', static_url_path='')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

HEADERS_TIMEOUT = 15
USER_AGENT = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/605.1.15 (KHTML, like Gecko) '
    'IsaacNet/1.0'
)

# ── Data Helpers ──────────────────────────────────────────
def load_json(name, default=None):
    path = os.path.join(DATA_DIR, f'{name}.json')
    if os.path.exists(path):
        try:
            with open(path) as f:
                return json.load(f)
        except:
            return default or []
    return default or []

def save_json(name, data):
    path = os.path.join(DATA_DIR, f'{name}.json')
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def now_iso():
    return datetime.utcnow().isoformat() + 'Z'

# ── Ad Block List ─────────────────────────────────────────
AD_DOMAINS = {
    'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
    'googletagmanager.com', 'google-analytics.com', 'adservice.google.com',
    'adsrvr.org', 'adnxs.com', 'rubiconproject.com', 'criteo.com',
    'criteo.net', 'taboola.com', 'outbrain.com', 'scorecardresearch.com',
    'quantserve.com', 'exelator.com', 'moatads.com', 'adsafeprotected.com',
    'serving-sys.com', 'casalemedia.com', 'contextweb.com', 'openx.net',
    'pubmatic.com', 'sharethrough.com', 'indexww.com', 'agkn.com',
    'demdex.net', 'advertising.com', 'atdmt.com', 'media.net',
    'bluekai.com', 'tubemogul.com', 'tribalfusion.com',
    'popads.net', 'propellerads.com', 'adsterra.com', 'exoclick.com',
    'trafficfactory.biz', 'pushly.com', 'onesignal.com',
}

def is_ad_url(url):
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower().removeprefix('www.')
        for ad in AD_DOMAINS:
            if domain == ad or domain.endswith('.' + ad):
                return True
    except:
        pass
    return False

# ── Proxy Engine ──────────────────────────────────────────
BLOCKED_HEADERS_OUTGOING = {
    'x-frame-options', 'frame-options', 'content-security-policy',
    'x-content-security-policy', 'x-webkit-csp',
    'access-control-allow-origin',
}
ALLOWED_CONTENT_TYPES = {
    'text/html', 'text/plain', 'text/css', 'text/javascript',
    'application/javascript', 'application/json', 'application/xml',
    'image/', 'font/', 'video/', 'audio/',
}

class URLRewriter:
    """Rewrites HTML so all links go through the Isaacium proxy."""
    
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
    
    def proxy_url(self, url):
        """Convert a URL to go through our proxy."""
        resolved = urllib.parse.urljoin(self.base_url, url)
        if is_ad_url(resolved):
            return '/isaacium/blank'
        return '/isaacium/fetch?u=' + urllib.parse.quote(resolved, safe='')
    
    def rewrite_html(self, html):
        """Rewrite all navigable URLs in HTML to go through proxy."""
        # Replace href="..." - links
        html = re.sub(
            r'(href\s*=\s*["\'])((?!https?://|/isaacium/|#|javascript:|mailto:|tel:|data:)[^"\']+)',
            lambda m: m.group(1) + self.proxy_url(m.group(2)),
            html, flags=re.IGNORECASE
        )
        # Replace src="..." - images, scripts, iframes
        html = re.sub(
            r'(src\s*=\s*["\'])((?!https?://|/isaacium/|data:|blob:)[^"\']+)',
            lambda m: m.group(1) + self.proxy_url(m.group(2)),
            html, flags=re.IGNORECASE
        )
        # Replace action="..." - forms
        html = re.sub(
            r'(action\s*=\s*["\'])((?!https?://|/isaacium/|#)[^"\']+)',
            lambda m: m.group(1) + self.proxy_url(m.group(2)),
            html, flags=re.IGNORECASE
        )
        # Inject Isaacium toolbar into HTML pages
        inject_script = '''
<script>
(function(){
  window.__isaacium_url = "%s";
  // Post page info to parent
  function post(){ 
    try { 
      window.parent.postMessage({
        type: 'isaacium-page-loaded',
        url: window.__isaacium_url || window.location.href,
        title: document.title
      }, '*');
    } catch(e){}
  }
  if(document.readyState==='complete') post();
  else window.addEventListener('load', post);
  // Also send on first paint
  setTimeout(post, 500);
  // Intercept link clicks for same-origin navigation
  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if(a && a.href && !a.getAttribute('target')){
      // External links should open in new tab via the parent
    }
  });
})();
</script>
''' % html_module.escape(self.base_url)
        # Inject before </body>
        if '</body>' in html:
            html = html.replace('</body>', inject_script + '\n</body>')
        else:
            html += inject_script
        return html
    
    def rewrite_css(self, css, css_url):
        """Rewrite url() references in CSS."""
        base = css_url.rsplit('/', 1)[0] if '/' in css_url else css_url
        
        def replace_url(m):
            ref = m.group(1) or m.group(2) or m.group(3)
            ref = ref.strip(' \'"')
            resolved = urllib.parse.urljoin(base + '/', ref)
            if is_ad_url(resolved):
                return '/* blocked */'
            return 'url(' + self.proxy_url(resolved) + ')'
        
        css = re.sub(
            r'url\(["\']?([^"\'()]*)["\']?\)',
            replace_url,
            css
        )
        return css


@app.route('/isaacium/fetch')
def proxy_fetch():
    """Fetch a page through the Isaacium proxy."""
    url = request.args.get('u', '')
    if not url:
        return 'Missing URL', 400
    
    # Decode any double-encoding
    url = urllib.parse.unquote(url)
    
    # Validate URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Check if this is an ad request
    if is_ad_url(url):
        return '', 204
    
    try:
        # Fetch the page
        resp = requests.get(
            url,
            headers={
                'User-Agent': request.headers.get('User-Agent', USER_AGENT),
                'Accept': request.headers.get('Accept', 
                    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
                'Accept-Language': request.headers.get('Accept-Language', 'en-US,en;q=0.9'),
                'Referer': request.referrer or '',
                'Cookie': request.headers.get('Cookie', ''),
            },
            timeout=HEADERS_TIMEOUT,
            allow_redirects=True,
            stream=True,
        )
        
        # Determine content type
        content_type = resp.headers.get('Content-Type', 'text/html').lower()
        
        # Read content
        raw = resp.content
        
        # Strip blocking headers from response
        response_headers = {}
        for k, v in resp.headers.items():
            kl = k.lower()
            if kl not in BLOCKED_HEADERS_OUTGOING and kl not in {
                'content-encoding', 'transfer-encoding', 'content-length',
                'age', 'cf-cache-status', 'cf-ray', 'cf-request-id',
                'server-timing', 'alt-svc',
            }:
                response_headers[k] = v
        
        # Allow iframing
        response_headers['X-Frame-Options'] = 'ALLOWALL'
        response_headers['Access-Control-Allow-Origin'] = '*'
        
        # For HTML content, rewrite URLs
        if 'text/html' in content_type:
            try:
                html = raw.decode('utf-8')
            except:
                try:
                    html = raw.decode('latin-1')
                except:
                    html = raw.decode('utf-8', errors='replace')
            
            rewriter = URLRewriter(url)
            html = rewriter.rewrite_html(html)
            
            # Track in history
            try:
                history = load_json('history')
                now = now_iso()
                # Extract title from HTML
                title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
                title = title_match.group(1).strip() if title_match else url
                title = html_module.unescape(title)
                
                history.append({
                    'url': url,
                    'title': title,
                    'time': now,
                    'id': now.replace(':', '-').replace('.', '-'),
                })
                # Keep last 5000 entries
                if len(history) > 5000:
                    history = history[-5000:]
                save_json('history', history)
            except:
                pass
            
            encoded = html.encode('utf-8')
            return Response(encoded, status=resp.status_code, 
                          content_type='text/html; charset=utf-8',
                          headers=response_headers)
        
        # For CSS, rewrite url() references
        elif 'text/css' in content_type:
            try:
                css_text = raw.decode('utf-8')
            except:
                css_text = raw.decode('latin-1')
            rewriter = URLRewriter(url)
            css_text = rewriter.rewrite_css(css_text, url)
            encoded = css_text.encode('utf-8')
            return Response(encoded, status=resp.status_code,
                          content_type='text/css; charset=utf-8',
                          headers=response_headers)
        
        # For everything else, pass through as-is
        response = Response(resp.content, status=resp.status_code,
                          content_type=content_type,
                          headers=response_headers)
        return response
        
    except requests.exceptions.Timeout:
        return render_template('error.html', message=f'Timeout connecting to {url}', url=url), 504
    except requests.exceptions.ConnectionError:
        return render_template('error.html', message=f'Could not connect to {url}', url=url), 502
    except Exception as e:
        return render_template('error.html', message=str(e), url=url), 500


@app.route('/isaacium/blank')
def blank():
    """Return a blank 1x1 pixel for blocked content."""
    return Response('', content_type='text/html')


# ── Bookmarks API ─────────────────────────────────────────
@app.route('/api/bookmarks', methods=['GET'])
def get_bookmarks():
    bookmarks = load_json('bookmarks')
    return jsonify(bookmarks)

@app.route('/api/bookmarks', methods=['POST'])
def add_bookmark():
    data = request.json
    bookmarks = load_json('bookmarks')
    bookmark = {
        'id': now_iso().replace(':', '-').replace('.', '-'),
        'url': data.get('url', ''),
        'title': data.get('title', 'Untitled'),
        'favicon': data.get('favicon', ''),
        'folder': data.get('folder', 'Unfiled'),
        'added': now_iso(),
    }
    # Don't duplicate
    for b in bookmarks:
        if b['url'] == bookmark['url']:
            return jsonify(b)
    bookmarks.append(bookmark)
    save_json('bookmarks', bookmarks)
    return jsonify(bookmark), 201

@app.route('/api/bookmarks/<bookmark_id>', methods=['DELETE'])
def delete_bookmark(bookmark_id):
    bookmarks = load_json('bookmarks')
    bookmarks = [b for b in bookmarks if b['id'] != bookmark_id]
    save_json('bookmarks', bookmarks)
    return '', 204


# ── History API ───────────────────────────────────────────
@app.route('/api/history', methods=['GET'])
def get_history():
    history = load_json('history')
    # Optional search filter
    q = request.args.get('q', '').lower()
    if q:
        history = [h for h in history 
                  if q in h.get('url', '').lower() 
                  or q in h.get('title', '').lower()]
    # Optional limit
    limit = request.args.get('limit', 200, type=int)
    # Return newest first
    history = list(reversed(history[-limit:]))
    return jsonify(history)

@app.route('/api/history', methods=['DELETE'])
def clear_history():
    save_json('history', [])
    return '', 204


# ── Notes API ─────────────────────────────────────────────
@app.route('/api/notes', methods=['GET'])
def get_notes():
    notes = load_json('notes')
    return jsonify(notes)

@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.json
    notes = load_json('notes')
    note = {
        'id': now_iso().replace(':', '-').replace('.', '-'),
        'title': data.get('title', 'Untitled Note'),
        'content': data.get('content', ''),
        'color': data.get('color', '#2a2d3e'),
        'pinned': data.get('pinned', False),
        'updated': now_iso(),
        'created': now_iso(),
    }
    notes.insert(0, note)
    save_json('notes', notes)
    return jsonify(note), 201

@app.route('/api/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.json
    notes = load_json('notes')
    for note in notes:
        if note['id'] == note_id:
            if 'title' in data: note['title'] = data['title']
            if 'content' in data: note['content'] = data['content']
            if 'color' in data: note['color'] = data['color']
            if 'pinned' in data: note['pinned'] = data['pinned']
            note['updated'] = now_iso()
            save_json('notes', notes)
            return jsonify(note)
    return {'error': 'Not found'}, 404

@app.route('/api/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    notes = load_json('notes')
    notes = [n for n in notes if n['id'] != note_id]
    save_json('notes', notes)
    return '', 204


# ── Passwords API ─────────────────────────────────────────
@app.route('/api/passwords', methods=['GET'])
def get_passwords():
    passwords = load_json('passwords')
    return jsonify(passwords)

@app.route('/api/passwords', methods=['POST'])
def add_password():
    data = request.json
    passwords = load_json('passwords')
    entry = {
        'id': now_iso().replace(':', '-').replace('.', '-'),
        'domain': data.get('domain', ''),
        'username': data.get('username', ''),
        'password': data.get('password', ''),
        'note': data.get('note', ''),
        'added': now_iso(),
    }
    passwords.insert(0, entry)
    save_json('passwords', passwords)
    return jsonify(entry), 201

@app.route('/api/passwords/<pid>', methods=['PUT'])
def update_password(pid):
    data = request.json
    passwords = load_json('passwords')
    for p in passwords:
        if p['id'] == pid:
            for k in ('domain', 'username', 'password', 'note'):
                if k in data: p[k] = data[k]
            save_json('passwords', passwords)
            return jsonify(p)
    return {'error': 'Not found'}, 404

@app.route('/api/passwords/<pid>', methods=['DELETE'])
def delete_password(pid):
    passwords = load_json('passwords')
    passwords = [p for p in passwords if p['id'] != pid]
    save_json('passwords', passwords)
    return '', 204


# ── Settings API ──────────────────────────────────────────
@app.route('/api/settings', methods=['GET'])
def get_settings():
    settings = load_json('settings', {
        'theme': 'dark',
        'homepage': 'isaacium://newtab',
        'searchEngine': 'google',
        'adBlock': True,
        'readerMode': False,
        'sidebar': True,
        'splitView': False,
        'zoom': 100,
        'downloadPath': os.path.expanduser('~/Downloads'),
    })
    return jsonify(settings)

@app.route('/api/settings', methods=['PUT'])
def update_settings():
    data = request.json
    settings = load_json('settings', {})
    for k, v in data.items():
        settings[k] = v
    save_json('settings', settings)
    return jsonify(settings)


# ── Downloads tracking ────────────────────────────────────
@app.route('/api/downloads', methods=['GET'])
def get_downloads():
    downloads = load_json('downloads')
    return jsonify(downloads)


# ── Reader Mode ───────────────────────────────────────────
@app.route('/isaacium/reader')
def reader_mode():
    url = request.args.get('u', '')
    if not url:
        return 'Missing URL', 400
    
    try:
        resp = requests.get(
            urllib.parse.unquote(url),
            headers={'User-Agent': USER_AGENT},
            timeout=HEADERS_TIMEOUT,
        )
        
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Remove unwanted elements
        for tag in soup(['script', 'style', 'nav', 'header', 'footer', 
                        'aside', 'noscript', 'iframe', 'svg',
                        '[role="navigation"]', '[role="banner"]']):
            tag.decompose()
        
        # Try to find main content
        article = (
            soup.find('article')
            or soup.find('[role="main"]')
            or soup.find('main')
            or soup.body
        )
        
        title = soup.title.string if soup.title else url
        
        # Get just text content
        content_text = article.get_text(separator='\n', strip=True) if article else resp.text[:5000]
        lines = [l.strip() for l in content_text.split('\n') if l.strip()]
        content = '\n\n'.join(lines[:200])
        
        return render_template('reader.html',
                             title=html_module.unescape(str(title)),
                             content=content,
                             content_lines=content.split('\n'),
                             source_url=url)
    except:
        # Fallback: show stripped content
        return render_template('reader.html',
                             title='Reader Mode',
                             content='Could not extract content from ' + url,
                             content_lines=['Could not extract content from ' + url],
                             source_url=url)


# ── Main Page ─────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')


# ── Error Page ────────────────────────────────────────────
@app.route('/error')
def error_page():
    url = request.args.get('url', '')
    message = request.args.get('message', 'An error occurred')
    return render_template('error.html', message=message, url=url)


# ── Start ─────────────────────────────────────────────────
if __name__ == '__main__':
    print(f'╔═══════════════════════════════════════╗')
    print(f'║     IsaacNet Browser Engine v1.0      ║')
    print(f'║   Running on http://localhost:8540     ║')
    print(f'╚═══════════════════════════════════════╝')
    app.run(host='127.0.0.1', port=8540, debug=True)
