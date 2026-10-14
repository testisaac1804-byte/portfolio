#!/usr/bin/env python3
"""Full Password Game solver: reads the game's Vue state, composes a rich-text
solution, and drives each remaining rule (fire, Paul, sacrifice, youtube, final)."""
import sys, os, time, json, subprocess, threading
from collections import deque

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import composer
from composer import MOON
from solver.browser_control import BrowserController

HERE = os.path.dirname(os.path.abspath(__file__))
POOL = os.path.join(HERE, 'yt_pool.json')
YTDLP = os.path.expanduser('~/.venvs/pg/bin/yt-dlp')
PROXY = 'http://127.0.0.1:8557'

GET = """(() => {
  if (!window.__getPG) {
    window.__getPG = () => {
      const pm = document.querySelector('.ProseMirror');
      if (!pm) return null;
      let el = pm, vm = null;
      while (el && !vm) { vm = el.__vue__; el = el.parentElement; }
      let cur = vm, main = null;
      for (let i = 0; i < 10 && cur; i++) { if (cur.rules && cur.editor) { main = cur; break; } cur = cur.$parent; }
      return main;
    };
  }
  const m = window.__getPG();
  if (!m) return null;
  const ids = (m.rules || []).map(r => r.id);
  return {
    pw: m.password || '',
    plen: m.passwordLength,
    reached: m.ruleReached,
    failing: (m.errorRules || []).map(i => ids[i]),
    ruleIds: ids,
    captcha: m.currCaptcha || '',
    chess: m.currChessPuzzle,
    place: (m.currPlace && m.currPlace.title) || '',
    color: m.randomColor || '',
    wordle: m.wordleAnswer || '',
    ytDur: m.randomYoutubeDuration,
    ytId: m.currYoutubeId || '',
    ytCur: m.currYoutubeDuration,
    hasYT: typeof window.YT !== 'undefined' && !!window.YT.Player,
    hasPlayer: !!document.getElementById('youtube-player'),
    hatched: !!m.paulHatched,
    dead: !!m.paulDied,
    deathText: m.deathScreenText || '',
    bugsPw: (m.password || '').split('\U0001F41B').length - 1,
    complete: !!m.isComplete,
    match: !!m.passwordsMatch,
    sac: m.sacraficedLetters || [],
    hl: (m.highlights || []).slice(0, 10),
    nodes: (() => { const out = []; m.editor.state.doc.descendants(n => {
        if (n.text && out.length < 16) { const mk = n.marks.find(x => x.type.name === 'textStyle');
          out.push([n.text, mk ? mk.attrs.fontSize : '-', mk ? mk.attrs.fontFamily : '-', n.marks.map(x => x.type.name).join('+')]); } });
      return out; })(),
    errIdx: (m.errorRules || []).slice(0, 6)
  };
})()"""

SET = """(h) => { const m = window.__getPG(); if (!m) return false; m.editor.commands.setContent(h, true); return true; }"""
SAC = """(l) => { const m = window.__getPG(); if (!m) return false; m.sacrafice(l); return true; }"""
CAP = """() => { const m = window.__getPG(); if (!m) return false; m.refreshCaptcha(); return true; }"""
DONE = """() => { const m = window.__getPG(); if (!m) return false; m.setComplete(); return true; }"""


USABLE = {}


def build_usable(pool):
    USABLE.clear()
    seen = {}
    for d, i in pool:
        if 178 <= d <= 2181 and i not in seen and good_id(i, 6):
            seen[i] = 1
            USABLE.setdefault(d, []).append(i)
    return len(USABLE)


def usable_for(t, bl=None):
    bl = bl or set()
    for dd in (t, t - 1, t + 1):
        for i in USABLE.get(dd, []):
            if i not in bl:
                return i
    return None


def grow_pool(pool, out):
    from concurrent.futures import ThreadPoolExecutor
    k = 0
    while not out.get('stop'):
        batch = [QUERIES[(k + j) % len(QUERIES)] + ' ' + str(k + j) for j in range(6)]
        k += 6
        try:
            with ThreadPoolExecutor(max_workers=6) as ex:
                for res in ex.map(run_query, batch):
                    pool.extend(res)
            save_pool(pool)
            build_usable(pool)
            out['k'] = k
        except Exception as e:
            print('grow err', e, flush=True)
            time.sleep(3)


def load_pool():
    try:
        return json.load(open(POOL))
    except Exception:
        return []


def save_pool(p):
    try:
        seen = {}
        for e in p:
            seen[e[1]] = e
        p[:] = list(seen.values())
        tmp = POOL + '.tmp'
        with open(tmp, 'w') as f:
            json.dump(p, f)
        os.replace(tmp, POOL)
    except Exception:
        pass


def grow_once(pool):
    from concurrent.futures import ThreadPoolExecutor
    k = int(time.time()) % 100000
    batch = [QUERIES[(k + j) % len(QUERIES)] + ' ' + str(k + j) for j in range(6)]
    try:
        with ThreadPoolExecutor(max_workers=3) as ex:
            for res in ex.map(run_query, batch[:3]):
                pool.extend(res)
    except Exception as e:
        print('grow err', e, flush=True)
    save_pool(pool)


def good_id(i, maxd):
    if composer.id_roman_part(i) is None or composer.digitsum(i) > maxd:
        return False
    if composer.atomic_sum(i) > 100:
        return False
    low = i.lower()
    return all(low.count(c) <= 2 for c in set(low))


QUERIES = ['music', 'news', 'vlog', 'tutorial', 'podcast', 'song', 'trailer', 'lecture',
           'review', 'aerial', 'documentary', 'asmr', 'compilation', 'interview', 'radio',
           'stream', 'gameplay', 'cooking', 'workout', 'travel', 'history', 'science',
           'finance', 'coding', 'guitar', 'piano', 'concert', 'anime', 'sports', 'tech']


def run_query(q):
    try:
        r = subprocess.run([YTDLP, '--proxy', PROXY, '--no-warnings', '--flat-playlist',
                            '--print', '%(duration)s %(id)s', 'ytsearch300:' + q],
                           capture_output=True, text=True, timeout=420)
    except Exception:
        return []
    out = []
    for line in r.stdout.splitlines():
        parts = line.split()
        if len(parts) != 2:
            continue
        try:
            out.append([int(float(parts[0])), parts[1]])
        except Exception:
            pass
    return out


def find_video(target, pool, blacklist):
    """Find a duration-matching youtube id that is roman-compatible and digit-cheap."""
    for maxd in (2, 4, 6, 9):
        for d, i in list(pool):
            if i not in blacklist and abs(d - target) <= 1 and good_id(i, maxd):
                return 'https://youtu.be/' + i
        from concurrent.futures import ThreadPoolExecutor, as_completed
        for start in range(0, len(QUERIES), 6):
            batch = QUERIES[start:start + 6]
            with ThreadPoolExecutor(max_workers=6) as ex:
                for res in ex.map(run_query, batch):
                    for d, i in res:
                        pool.append([d, i])
                        if abs(d - target) <= 1 and i not in blacklist and good_id(i, maxd):
                            save_pool(pool)
                            return 'https://youtu.be/' + i
            save_pool(pool)
    save_pool(pool)
    return None


def search_worker(target, pool, blacklist, out):
    try:
        out['url'] = find_video(target, pool, blacklist)
    except Exception as e:
        print('search err', e, flush=True)
    finally:
        out['done'] = True


def main():
    b = BrowserController(headless=False)
    b.start()
    try:
        b.page.set_default_timeout(20000)
    except Exception:
        pass
    print('game loaded', flush=True)
    pool = load_pool()
    blacklist = set()
    st0 = b.page.evaluate(GET) or {}
    VID = {'url': None, 'done': False, 'target': st0.get('ytDur'), 'k': 0, 'stop': False}
    build_usable(pool)
    print('pool', len(pool), 'usable durations', len(USABLE), 'target', VID['target'], flush=True)
    if len(USABLE) < 260:
        print('expanding pool...', flush=True)
        for _ in range(14):
            if len(USABLE) >= 260:
                break
            grow_once(pool)
            build_usable(pool)
            print('  pool', len(pool), 'usable', len(USABLE), flush=True)
    _have = bool(st0.get('ytDur')) and bool(usable_for(st0['ytDur'], blacklist))
    if not _have:
        threading.Thread(target=grow_pool, args=(pool, VID), daemon=True).start()
    else:
        print('pool already covers', st0.get('ytDur'), usable_for(st0['ytDur'], blacklist), flush=True)
    video = None
    waited = 0
    if st0.get('ytDur') and not _have:
        print('bg search for', st0['ytDur'], flush=True)
        threading.Thread(target=search_worker,
                         args=(st0['ytDur'], pool, blacklist, VID), daemon=True).start()
    for attempt in range(0):
        try:
            stp = b.page.evaluate(GET)
        except Exception as e:
            print('eval err', e, flush=True)
            stp = None
        if not stp:
            time.sleep(1.0)
        else:
            t = stp.get('ytDur')
            u = usable_for(t, blacklist) if t else None
            if u:
                video = 'https://youtu.be/' + u
                print('video match target', t, u, 'reloads', attempt, flush=True)
                break
            if attempt % 5 == 0:
                print('reload', attempt, 'target', t, 'usable', len(USABLE), flush=True)
        try:
            b.page.goto('https://neal.fun/password-game/', timeout=20000, wait_until='commit')
        except Exception as e:
            print('goto err', str(e)[:60], flush=True)
        time.sleep(4)
        if attempt % 5 == 4:
            build_usable(pool)
    moon_i = 0
    last = None
    sac_done = None
    fails = {}
    body = None
    hist = deque(maxlen=12)
    DELTA = [0]
    prev_body = None
    LB = [None]
    for step in range(6000):
        try:
            st = b.page.evaluate(GET)
            if (not st or not st.get('ruleIds') or st.get('reached') is None
                    or st.get('reached') < 1):
                time.sleep(1.0)
                continue
            if st['dead']:
                print('PAUL DIED text=', st.get('deathText'), flush=True)
                for h in list(hist):
                    print('   hist', h, flush=True)
                break
            hist.append((step, st['reached'], st['failing'], st['pw'].count('\U0001F95A'),
                         st['pw'].count('\U0001F425'), st['pw'].count('\U0001F525'),
                         st['pw'].count('\U0001F41B'), len(st['pw'])))
            if 'hatch' in set(st['ruleIds'][:st['reached']]) - set([]) and st.get('bugsPw') != LB[0]:
                print('bugs', LB[0], '->', st.get('bugsPw'), 'plen', st.get('plen'), flush=True)
                LB[0] = st.get('bugsPw')
            ids = set(st['ruleIds'][:st['reached']])
            if 'youtube' in ids and not video:
                u = usable_for(st['ytDur'], blacklist) if st['ytDur'] else None
                if VID.get('url'):
                    video = VID['url']
                    print('using video', video, flush=True)
                elif u:
                    video = 'https://youtu.be/' + u
                    print('using video', video, flush=True)
                else:
                    waited += 1
                    if waited % 40 == 0:
                        print('no usable video for', st['ytDur'], 'usable', len(USABLE), flush=True)
            if prev_body and st['plen']:
                d = composer.graphemes(prev_body) - st['plen']
                if abs(d) <= 8 and d != DELTA[0]:
                    DELTA[0] = d
                    print('len delta', d, 'ours', composer.graphemes(prev_body), 'game', st['plen'], flush=True)
            ctx = {'moon': MOON[moon_i % 8], 'video': video, 'delta': DELTA[0]}
            body, target, sac = composer.build(st, ctx)
            if body is None:
                err = sac
                b2 = t2 = None
                if err in ('digits-over', 'roman', 'letters-over', 'atomic-over'):
                    b2, t2, _ = composer.build(st, dict(ctx, video=None), minimal=True)
                if b2 is None:
                    b2 = composer.keepalive()
                    t2 = composer.graphemes(b2)
                if b2:
                    prev_body = b2
                    html2 = composer.to_html(b2, t2)
                    if html2 != last or st['pw'] != b2:
                        b.page.evaluate(SET, html2)
                        last = html2
                fails[('cf', err)] = fails.get(('cf', err), 0) + 1
                if fails[('cf', err)] in (1, 5, 20, 60):
                    print(f"compose-fail {err} x{fails[('cf', err)]} failing={st['failing']} plen={st['plen']} cap={st['captcha']!r} time={composer.cur_time()}", flush=True)
                if video and err in ('letters-over', 'roman-id', 'roman', 'atomic-over'):
                    bad = video.rsplit('/', 1)[-1]
                    blacklist.add(bad)
                    for dd in USABLE:
                        USABLE[dd] = [x for x in USABLE[dd] if x not in blacklist]
                    video = usable_for(st['ytDur'], blacklist)
                    video = ('https://youtu.be/' + video) if video else None
                    print('blacklist(video)', bad, err, '->', video, flush=True)
                cap = st.get('captcha') or ''
                if err == 'sacrifice' or any(c.isdigit() for c in cap):
                    b.page.evaluate(CAP)
                    time.sleep(0.6)
                else:
                    time.sleep(2.0)
                continue
            html = composer.to_html(body, target)
            prev_body = body
            if sac and sac_done != sac:
                b.page.evaluate(SAC, list(sac))
                sac_done = sac
            if (html != last or st['pw'] != body
                    or ('hatch' in ids and st['pw'].count(chr(0x1F41B)) < 5)):
                b.page.evaluate(SET, html)
                last = html
                if 'youtube' in ids:
                    print("bugsBody=", (body or "").count(chr(0x1F41B)), "bugsGame=", st.get("bugsPw"), "lenGame=", st.get("plen"), flush=True); print(f"step {step}: len={target} plen={st['plen']} urlInPw={'youtube.com/watch?v=' in st['pw']} urlInBody={'youtube.com/watch?v=' in body} ytId={st['ytId']!r} ytCur={st['ytCur']} failing={st['failing']}", flush=True)
                else:
                    print(f"step {step}: len={target} reached={st['reached']} failing={st['failing']}", flush=True)
            elif st['failing']:
                key = tuple(st['failing'])
                fails[key] = fails.get(key, 0) + 1
                if fails[key] in (1, 4, 10, 25):
                    pw = st['pw']
                    chars = [(h, pw[h-1] if 0 <= h-1 < len(pw) else '?') for h in st['hl']]
                    print(f"STUCK {st['failing']} x{fails[key]} errIdx={st['errIdx']} hl={chars}", flush=True)
                    for nd in st['nodes']:
                        print('    node', nd, flush=True)
                if st['failing'] == ['moon-phase']:
                    moon_i += 1
                    continue
                if 'youtube' in st['failing'] and st['ytId'] and st['ytCur'] and abs(st['ytCur'] - st['ytDur']) > 1:
                    blacklist.add(st['ytId'])
                    for dd in USABLE:
                        USABLE[dd] = [x for x in USABLE[dd] if x not in blacklist]
                    video = usable_for(st['ytDur'], blacklist)
                    video = ('https://youtu.be/' + video) if video else None
                    print('blacklist', st['ytId'], st['ytCur'], '->', video, flush=True)
            if st['complete']:
                if st['match']:
                    print('WON', flush=True)
                    try:
                        open(os.path.join(HERE, 'final_password.txt'), 'w').write(body or '')
                        b.page.screenshot(path=os.path.join(HERE, 'won.png'), timeout=90000)
                    except Exception as e:
                        print('shot err', e, flush=True)
                    break
                print('complete but not matching; re-setting', flush=True)
                b.page.evaluate(SET, html)
            if 'final' in ids and not st['complete'] and set(st['failing']) <= {'final'}:
                print('FINAL: submitting', flush=True)
                b.page.evaluate(SET, html)          # make the editor hold exactly `html`
                time.sleep(0.25)
                b.page.evaluate(DONE)               # save it as the final password + clear
                time.sleep(0.35)
                b.page.evaluate(SET, html)          # re-type the identical content
                last = html
                time.sleep(0.5)
            elif st['complete'] and not st['match'] and html:
                b.page.evaluate(SET, html)          # keep confirming
            time.sleep(0.5)
        except Exception as e:
            print('err', e, flush=True)
            time.sleep(1.0)
    print('done', flush=True)


if __name__ == '__main__':
    main()
