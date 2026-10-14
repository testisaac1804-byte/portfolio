#!/usr/bin/env python3
"""Compose a Password Game solution as rich-text HTML with all required marks."""
import json, os, re
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ELEMENTS = json.load(open(os.path.join(HERE, 'elements.json')))
CHESS = json.load(open(os.path.join(HERE, 'chess_index.json')))
E2 = [e for e in ELEMENTS if len(e['symbol']) == 2]
E1 = [e for e in ELEMENTS if len(e['symbol']) == 1]

VS = {'\ufe0e', '\ufe0f'}
ZWJ = '\u200d'
ROMAN = set('IVXLCDM')
VOWELS = set('aeiouy')
# single-letter, non-roman, non-vowel elements, usable as atomic padding
PAD_EL = [(74, 'W'), (19, 'K'), (16, 'S'), (15, 'P'), (9, 'F'), (7, 'N'), (5, 'B'), (1, 'H')]
SEP = '~'
SIZES = [0, 1, 4, 9, 12, 16, 25, 28, 32, 36, 42, 49, 64, 81]
MAXL = len(SIZES)
STRENGTH = '\U0001F3CB\ufe0f\u200d\u2642\ufe0f'
MOON = ['\U0001F311', '\U0001F312', '\U0001F313', '\U0001F314', '\U0001F315',
        '\U0001F316', '\U0001F317', '\U0001F318']


def graphemes(s):
    n = 0
    for i, c in enumerate(s):
        if c in VS or c == ZWJ or 0x1F3FB <= ord(c) <= 0x1F3FF:
            continue
        if i > 0 and s[i - 1] == ZWJ:
            continue
        n += 1
    return n


def digitsum(s):
    return sum(int(c) for c in s if c.isdigit())


def atomic_sum(pw):
    tot = 0
    s = pw
    for e in E2 + E1:
        c = s.count(e['symbol'])
        if c:
            tot += e['num'] * c
            s = s.replace(e['symbol'], '')
    return tot


def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True


ROMAN_RE = re.compile(r"M{0,4}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})")
RV = [('CM', 900), ('CD', 400), ('XC', 90), ('XL', 40), ('IX', 9), ('IV', 4),
      ('M', 1000), ('D', 500), ('C', 100), ('L', 50), ('X', 10), ('V', 5), ('I', 1)]


def roman_value(t):
    v = 0
    i = 0
    while i < len(t):
        for s, n in RV:
            if t.startswith(s, i):
                v += n
                i += len(s)
                break
        else:
            i += 1
    return v


def roman_product(s):
    p = 1
    for m in ROMAN_RE.finditer(s):
        t = m.group(0)
        if t:
            p *= roman_value(t)
    return p


def roman_str(n):
    out = ''
    for v, s2 in [(1000,'M'),(900,'CM'),(500,'D'),(400,'CD'),(100,'C'),(90,'XC'),(50,'L'),
                  (40,'XL'),(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')]:
        while n >= v:
            out += s2
            n -= v
    return out


def id_roman_part(i):
    """Roman product contributed by a video id, or None if it cannot divide 35."""
    if len(i) != 11:
        return None
    p = roman_product(i)
    if p == 0 or 35 % p:
        return None
    return p


def next_prime(n):
    while not is_prime(n):
        n += 1
    return n


def coin_decomp(target, coins):
    """Fewest coins summing exactly to target."""
    INF = 1 << 30
    dp = [INF] * (target + 1)
    back = [None] * (target + 1)
    dp[0] = 0
    for v, sym in coins:
        for a in range(v, target + 1):
            if dp[a - v] + 1 < dp[a]:
                dp[a] = dp[a - v] + 1
                back[a] = (a - v, sym)
    if dp[target] >= INF:
        return None
    out = []
    a = target
    while a > 0:
        prev, sym = back[a]
        out.append(sym)
        a = prev
    return out


def pad_digits(total):
    d = ''
    for v in (9, 8, 7, 6, 5, 4, 3, 2, 1):
        while total >= v:
            d += str(v)
            total -= v
    return d


def best_hex(color):
    try:
        t = int(color.lstrip('#'), 16)
    except Exception:
        return color
    best, bestsum = color, 999
    for k in range(-5, 6):
        h = '#%06x' % (t + k)
        s = digitsum(h)
        if s < bestsum:
            best, bestsum = h, s
    return best


def cur_time(dt=None):
    d = dt or datetime.now()
    h = d.hour % 12 or 12
    return '%d:%02d' % (h, d.minute)


def esc(c):
    return c.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def build(st, ctx, minimal=False):
    """Return (text, html, info) for the current rules, or (None, None, err)."""
    ids = set(st['ruleIds'][:st['reached']]) if st.get('reached') is not None else set(st['ruleIds'])
    rtok = 'XXXV'
    if 'youtube' in ids and ctx.get('video') and not minimal:
        p = id_roman_part(ctx['video'][-11:])
        if p is None:
            return None, None, 'roman-id'
        rtok = roman_str(35 // p)
    toks = ['A1!xx']
    if 'month' in ids:
        toks.append('June')
    toks.append(rtok)
    if 'sponsors' in ids:
        toks.append('Pepsi')
    if 'periodic-table' in ids:
        toks.append('He')
    if 'captcha' in ids:
        toks.append(st.get('captcha') or '')
    if 'wordle' in ids:
        toks.append((st.get('wordle') or '').lower())
    if 'moon-phase' in ids:
        toks.append(ctx['moon'])
    if 'geo' in ids:
        toks.append((st.get('place') or '').lower().replace(' ', ''))
    if 'leap-year' in ids:
        toks.append(SEP + '0' + SEP)
    if 'chess' in ids:
        toks.append(CHESS[st['chess']]['sol'])
    if 'egg' in ids:
        toks.append('\U0001F95A')
        if st.get('hatched'):
            toks.append('\U0001F425')
    if 'affirmation' in ids:
        toks.append('iamloved')
    if 'strength' in ids:
        toks.append(STRENGTH * 3)
    if 'hatch' in ids:
        toks.append('\U0001F41B' * 5)
    if 'hex' in ids and st.get('color') and not minimal:
        toks.append(best_hex(st['color']))
    if 'youtube' in ids and ctx.get('video') and not minimal:
        toks.append(ctx['video'])
    if 'time' in ids and not minimal:
        toks.append(cur_time())

    fixed = ''.join(toks)
    used = set(c.lower() for c in fixed if c.isalpha())

    # sacrifice: two letters that must not appear anywhere in the password
    sac = ''
    if 'sacrafice' in ids:
        pick = [c for c in 'qzjxkvbgwypfm' if c not in used][:2]
        if len(pick) < 2:
            pick = [c for c in 'abcdefghijklmnopqrstuvwxyz' if c not in used][:2]
        if len(pick) >= 2:
            sac = ''.join(pick).upper()

    atomic_pad = ''
    if 'atomic-number' in ids:
        base_cnt = {}
        for ch in fixed:
            if ch.isalpha():
                base_cnt[ch.lower()] = base_cnt.get(ch.lower(), 0) + 1
        d = 200 - atomic_sum(fixed)
        if d < 0:
            return None, None, 'atomic-over'
        coins = [c for c in PAD_EL if c[1].lower() not in sac.lower()]
        syms = None
        for _ in range(len(coins)):
            syms = coin_decomp(d, coins)
            if syms is None:
                return None, None, 'atomic-coins'
            over = {}
            for ch in syms:
                over[ch.lower()] = over.get(ch.lower(), 0) + 1
            bad = [k for k, v in over.items() if base_cnt.get(k, 0) + v > MAXL]
            if not bad:
                break
            coins = [c for c in coins if c[1].lower() not in bad]
            if not coins:
                return None, None, 'atomic-letters'
        atomic_pad = SEP + SEP.join(syms) + SEP

    # length must be prime, >= twice the bold (vowel) count, and its decimal
    # digits are part of the 25-point digit budget -> pick a cheap prime
    base = ''.join(toks) + atomic_pad
    V = sum(1 for c in base if c.lower() in VOWELS)
    delta = int(ctx.get('delta', 0) or 0)
    start = next_prime(max(graphemes(base) + 8 - delta, 2 * V, 30))
    chosen = None
    digits_blocked = False
    for G in range(start, start + 4000):
        if not is_prime(G):
            continue
        body0 = base + str(G)
        nd0 = 25 - digitsum(body0)
        if nd0 < 0:
            digits_blocked = True
            continue
        p2 = pad_digits(nd0)
        b2 = (p2 + body0) if p2 else body0
        want = G + delta
        if graphemes(b2) <= want:
            chosen = (G, b2, want)
            break
    if chosen is None:
        return None, None, ('digits-over' if digits_blocked else 'len-token')
    target, body, want = chosen
    body += SEP * (want - graphemes(body))
    if graphemes(body) != want or digitsum(body) != 25 or str(target) not in body:
        return None, None, 'invariant'
    if 'atomic-number' in ids and atomic_sum(body) != 200:
        return None, None, 'atomic-mismatch'
    if 'roman-multiply' in ids and roman_product(body) != 35:
        return None, None, 'roman'
    cnt = {}
    for ch in body:
        if ch.isalpha():
            cnt[ch.lower()] = cnt.get(ch.lower(), 0) + 1
    if cnt and max(cnt.values()) > MAXL:
        return None, None, 'letters-over'
    if 'sacrafice' in ids:
        up = body.upper()
        pick = [c for c in 'qzjxgy' if c.upper() not in up][:2]
        if len(pick) < 2:
            pick = [c for c in 'abcdefghijklmnopqrstuvwxyz' if c.upper() not in up][:2]
        sac = ''.join(pick).upper() if len(pick) >= 2 else ''
    return body, target, sac


def keepalive():
    """Last-resort body: keeps Paul fed and the egg present so the game
    cannot end while the main composition is being worked out."""
    body = 'A1!xx' + '\U0001F95A' + '\U0001F41B' * 5 + 'J0J'
    nd = 25 - digitsum(body)
    if nd > 0:
        body = pad_digits(nd) + SEP + body
    return body


def to_html(body, target):
    """Serialize the composed text as rich-text HTML with all required marks."""
    toks_all = list(body)
    n = len(toks_all)
    roman_pos = set(i for i, c in enumerate(toks_all) if c in ROMAN)
    cand = [i for i, c in enumerate(toks_all) if i not in roman_pos and ord(c) < 0x2000]
    want_w = int(0.38 * target)
    wing = set()
    if want_w > 0 and len(cand) >= want_w:
        step = len(cand) / float(want_w)
        wing = set(cand[int(i * step)] for i in range(want_w))

    per_letter = {}
    html = []
    for i, c in enumerate(toks_all):
        style = []
        if c.isdigit():
            style.append('font-size: %dpx' % (int(c) ** 2))
        elif c.isalpha() and c.isascii():
            k = c.lower()
            kk = per_letter.get(k, 0)
            per_letter[k] = kk + 1
            style.append('font-size: %dpx' % SIZES[kk % len(SIZES)])
        ff = None
        if c in ROMAN:
            ff = 'Times New Roman'
        elif i in wing:
            ff = 'Wingdings'
        if ff:
            style.insert(0, 'font-family: ' + ff)
        inner = esc(c)
        if c.isascii() and c.lower() in VOWELS:
            inner = '<strong>' + inner + '</strong>'
        inner = '<em>' + inner + '</em>'
        if style:
            inner = '<span style="%s">%s</span>' % ('; '.join(style), inner)
        html.append(inner)
    return '<p>' + ''.join(html) + '</p>'
