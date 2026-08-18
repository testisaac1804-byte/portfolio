#!/usr/bin/env python3
"""Portfolio deploy generator: builds files.json manifest + per-folder index.html listings.

Run from the deploy root (portfolio-deploy/) before pushing.
Excludes build junk (.pio, .git, __pycache__, node_modules, venv, .DS_Store, etc).
"""
import os, json, datetime, html

ROOT = os.path.dirname(os.path.abspath(__file__))  # tools/
DEPLOY = os.path.dirname(ROOT)

EXCLUDE_DIRS = {'.git', '.pio', '__pycache__', 'node_modules', 'venv', '.venv',
                'env', '.idea', '.vscode', '.gitattributes', 'tools'}
EXCLUDE_FILES = {'.DS_Store', 'Thumbs.db', 'desktop.ini', 'files.json'}

def is_listing(path):
    """Detect a generated directory-listing index.html (vs a real app index.html)."""
    try:
        with open(path, 'rb') as fh:
            head = fh.read(400).decode('utf-8', 'ignore')
        return ('portfolio-listing' in head) or ("Isaac's Files" in head) or ('Root - Isaac Projects' in head)
    except OSError:
        return False
# folders we don't want listed at all (build artifacts, private)
SKIP_LIST_DIRS = {'.pio', '.git'}

TEXT_EXT = {'.md','.py','.js','.mjs','.cjs','.cpp','.c','.h','.hpp','.ino','.pde',
            '.html','.htm','.css','.json','.txt','.sh','.bash','.zsh','.scad',
            '.dxf','.plist','.xml','.csv','.ini','.cfg','.yml','.yaml','.toml',
            '.scpt','.applescript','.ts','.tsx','.jsx','.rs','.go','.java','.rb',
            '.php','.sql','.svg','.gitignore','.gitkeep','.md','.adoc','.bat',
            '.ps1','.asm','.ld','.make','.mk','.log','.dat','.properties'}
IMG_EXT = {'.png','.jpg','.jpeg','.gif','.webp','.bmp','.ico','.icns'}

def rel(p):
    r = os.path.relpath(p, DEPLOY)
    if r == '.': return ''
    return r.replace(os.sep, '/')

def human(n):
    for u in ['B','KB','MB','GB']:
        if n < 1024: return f"{n:.0f} {u}" if u=='B' else f"{n:.1f} {u}"
        n /= 1024
    return f"{n:.1f} TB"

def ext_kind(name):
    e = os.path.splitext(name)[1].lower()
    if e in IMG_EXT: return 'image'
    if e == '.stl': return 'stl'
    if e == '.dxf': return 'dxf'
    if e == '.pdf': return 'pdf'
    if e in TEXT_EXT: return 'text'
    return 'binary'

def build_tree(path):
    """Recursively build a node dict. path is absolute."""
    name = os.path.basename(path) or ''
    node = {'name': name, 'path': rel(path), 'type': 'dir', 'children': []}
    try:
        entries = sorted(os.listdir(path), key=lambda s: s.lower())
    except OSError:
        return node
    dirs, files = [], []
    for e in entries:
        if e in EXCLUDE_DIRS or e in EXCLUDE_FILES: continue
        full = os.path.join(path, e)
        if os.path.isdir(full): dirs.append(e)
        else: files.append(e)
    for d in dirs:
        node['children'].append(build_tree(os.path.join(path, d)))
    for f in files:
        full = os.path.join(path, f)
        if f == 'index.html' and is_listing(full):
            continue  # skip generated folder listings
        try: size = os.path.getsize(full)
        except OSError: size = 0
        node['children'].append({
            'name': f, 'path': rel(full), 'type': 'file',
            'size': size, 'sizeH': human(size), 'kind': ext_kind(f)
        })
    return node

def write_file_listing(dirpath):
    """Write an index.html directory listing into dirpath (skipping junk)."""
    rp = rel(dirpath)
    title = os.path.basename(dirpath) or 'Root'
    # parent breadcrumb
    crumbs = []
    parts = rp.split('/') if rp else []
    acc = ''
    crumb_html = '<a class="home" href="https://testisaac1804-byte.github.io/portfolio/">\u2190 Portfolio Home</a>'
    for i, p in enumerate(parts):
        acc += ('/' if acc else '') + p
        crumbs.append((p, acc))
    # build breadcrumb bar
    if crumbs:
        bar = '<div class="bc">'
        for i, (name, path) in enumerate(crumbs):
            href = 'https://testisaac1804-byte.github.io/portfolio/' + path + '/'
            if i == len(crumbs)-1:
                bar += f'<span class="cur">{html.escape(name)}</span>'
            else:
                bar += f'<a href="{href}">{html.escape(name)}</a><span class="sep">/</span>'
        bar += '</div>'
    else:
        bar = ''

    rows = []
    try: entries = sorted(os.listdir(dirpath), key=lambda s: s.lower())
    except OSError: entries = []
    dirs = [(e, True) for e in entries if os.path.isdir(os.path.join(dirpath, e)) and e not in EXCLUDE_DIRS]
    fls = [(e, False) for e in entries if os.path.isfile(os.path.join(dirpath, e)) and e not in EXCLUDE_FILES and e != 'index.html']
    # parent link
    if rp:
        parent = '/'.join(rp.split('/')[:-1])
        phref = 'https://testisaac1804-byte.github.io/portfolio/' + (parent + '/' if parent else '')
        rows.append(f'<a class="row up" href="{phref}"><span>\u2191 ..</span></a>')
    for name, isdir in dirs + fls:
        icon = '\U0001f4c1' if isdir else '\U0001f4c4'
        if not isdir:
            k = ext_kind(name)
            icon = {'image':'\U0001f5bc','stl':'\U0001f9ca','dxf':'\U0001f4d0','pdf':'\U0001f4d6','text':'\U0001f4c4','binary':'\U0001f4e6'}.get(k,'\U0001f4c4')
        href = html.escape(name) + ('/' if isdir else '')
        size = ''
        if not isdir:
            try: size = human(os.path.getsize(os.path.join(dirpath, name)))
            except OSError: size = ''
        rows.append(f'<a class="row" href="{href}"><span>{icon} {html.escape(name)}</span>'
                    + (f'<span class="sz">{size}</span>' if size else '') + '</a>')
    doc = f"""<!DOCTYPE html><html lang="en"><!--portfolio-listing--><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>{html.escape(title)} - Isaac's Files</title><style>body{{font-family:Inter,system-ui,sans-serif;background:#0d0e12;color:#d0d6e0;margin:0;padding:24px;max-width:900px}}h1{{font-size:20px;color:#f0f0f5;margin:12px 0 16px}}a.home{{display:inline-block;margin-bottom:8px;color:#818cf8;text-decoration:none;font-size:13px}}.bc{{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:13px;margin-bottom:4px;color:#666}}.bc a{{color:#818cf8;text-decoration:none}}.bc a:hover{{text-decoration:underline}}.bc .sep{{color:#444}}.bc .cur{{color:#c8ccd6;font-weight:600}}.row{{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 12px;border:1px solid rgba(255,255,255,0.06);border-radius:6px;margin-bottom:6px;text-decoration:none;color:#c8ccd6;font-size:14px;background:rgba(255,255,255,0.02)}}.row:hover{{background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.3)}}.row.up{{color:#818cf8}}.row .sz{{color:#666;font-size:12px;white-space:nowrap}}</style></head><body>{crumb_html}<h1>{html.escape(title)}</h1>{''.join(rows)}</body></html>"""
    with open(os.path.join(dirpath, 'index.html'), 'w') as fh:
        fh.write(doc)

def main():
    tree = build_tree(DEPLOY)
    manifest = {
        'generated': datetime.datetime.now().isoformat(timespec='seconds'),
        'root': tree,
    }
    out = os.path.join(DEPLOY, 'files.json')
    with open(out, 'w') as fh:
        json.dump(manifest, fh, ensure_ascii=False)
    sz = os.path.getsize(out)
    # count files
    def count(n):
        if n['type']=='file': return 1
        return sum(count(c) for c in n.get('children',[]))
    total = count(tree)
    print(f'files.json written: {human(sz)}, {total} files')

    # regenerate listings
    n = 0
    for root, dirs, files in os.walk(DEPLOY):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        if '.git' in root.split(os.sep): continue
        if '.pio' in root.split(os.sep): continue
        if os.path.abspath(root) == DEPLOY: continue  # never overwrite the portfolio index.html
        write_file_listing(root)
        n += 1
    print(f'{n} index.html listings generated')

if __name__ == '__main__':
    main()
