import sys, time
sys.path.insert(0, '/Users/isaac/password-game-solver')
import composer

RULES = ['min-length','number','uppercase','special','digits','month','roman','sponsors',
         'roman-multiply','captcha','wordle','periodic-table','geo','moon-phase','chess',
         'leap-year','affirmation','strength','egg','hatch','fire','sacrafice','twice-italic',
         'wingdings','hex-color','times-new-roman','digit-font-size','letter-font-size',
         'include-length','prime-length','skip','time','youtube','letter-font-size2','final']

def trial(reached, **kw):
    st = {'ruleIds': RULES, 'reached': reached, 'pw': '', 'plen': 18, 'failing': [],
          'captcha': kw.get('captcha','75pfw'), 'month': kw.get('month','June'),
          'wordle': kw.get('wordle','crane'), 'place': kw.get('place','Netherlands'),
          'color': kw.get('color','#aabbcc'), 'chess': kw.get('chess_idx', 0),
          'ytDur': kw.get('ytDur', 900), 'ytCur': 0, 'ytId': '',
          'sacraficedLetters': kw.get('sac', ['q','z']), 'leap': 0,
          'browserTZOffset': -480, 'browserLang': 'en'}
    ctx = {'moon': composer.MOON[0],
           'video': kw.get('video', 'https://youtu.be/0ll9rEtoRrs'),
           'delta': kw.get('delta', 0)}
    r = composer.build(st, ctx)
    return r

for reached in (5, 12, 20, 24, 36):
    b, t, s = trial(reached)
    print('reached', reached, '->', 'OK len' if b else 'FAIL', (len(b) if b else s), 'target', t)
