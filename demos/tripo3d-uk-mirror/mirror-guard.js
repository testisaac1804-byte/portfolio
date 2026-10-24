/*  tripo3d.uk — archived demo session guard  ·  captured 2026-10-21
 *
 *  This file is NOT part of the original site. It is injected into the archived copy so that a
 *  byte-faithful copy of somebody else's front-end cannot talk to their backend, and so the screens
 *  behind the login wall can still be inspected.
 *
 *  Everything below is fabricated: any username and any password "log in", every number on screen
 *  is a constant in this file, no model is generated, no upload leaves the page, and the one
 *  endpoint that carries real captured content is /api/announcement.
 */
(function () {
  'use strict';

  var META = {
    origin: 'https://tripo3d.uk',
    captured: '2026-10-21',
    shellSha256: '09c0734a9755e6ed…',
    mode: 'demo-session',
    note: 'Archived copy. Any credentials are accepted locally; nothing is sent anywhere.'
  };
  window.__MIRROR__ = META;
  window.__mirrorBlocked = [];
  window.__mirrorUnstubbed = [];
  window.__mirrorStubbed = [];

  /* captured from the live origin at 2026-09-16 23:19:35 — the operator's own notice */
  var ANNOUNCEMENT = '{"code":0,"data":{"id":1,"title":"系统公告","content":"模型生成后确定没问题最好当天下载，要不然会无法下载，放了多天的模型提交任务报错，无法下载等等情况大部分原因都是后台账号积分消耗完导致的，这种情况请各位用户重新提交图片生成模型或者点击缩略图上的紫色复用按钮，复用完成之后用新开的模型副本提交任务。本站严禁黄赌毒、政治，请各位勿上传相关违规图片，上传了也无法生成，谢谢各位合作。","enabled":true,"updated_at":"2026-09-16T23:19:35"}}';

  var TOKEN = 'archived-copy.demo.token';
  var NAME = 'demo';

  var REFUSAL = '存檔演示：唔會真正生成模型 · archived copy, generation disabled';

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function J(obj, status) {
    return new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json', 'X-Archive': 'demo' }
    });
  }
  /* the app is minified around a `json.data ?? json` unwrap we cannot see from outside, so answer
     with both: the fields at the top level *and* under `data`, as a shallow copy (no cycles). */
  function dual(obj, status) {
    var copy = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) copy[k] = obj[k];
    obj.data = copy;
    return J(obj, status);
  }
  function user(name) {
    return {
      id: 1, uid: 1, username: name, nickname: name,
      email: name + '@archive.invalid',
      role: 'admin', status: 'active',
      balance: 128, frozen: 0, total_consumed: 42,
      created_at: '2026-07-03 00:00:00', last_login_at: '2026-10-21 23:59:00'
    };
  }
  /* ── demo task bookkeeping ───────────────────────────────────────────────────────────────────────
     A job is a timestamp in localStorage. The poll endpoint turns elapsed seconds into progress, so
     the progress bar, the queue and the "已完成" toast all behave, then the viewer loads one vendored
     sample file. Reload keeps the history; nothing leaves the browser. */
  var DEMO_SECONDS = 7;
  var TASK_KEY = 'archive_demo_tasks';
  var tasks = {};
  try { tasks = JSON.parse(localStorage.getItem(TASK_KEY) || '{}') || {}; } catch (e) { tasks = {}; }

  function saveTasks() { try { localStorage.setItem(TASK_KEY, JSON.stringify(tasks)); } catch (e) {} }
  function newTask() {
    var id = 'demo-' + Date.now().toString(36) + '-' + String(Math.floor(Math.random() * 900 + 100));
    tasks[id] = Date.now(); saveTasks(); return id;
  }
  function forget(id) { delete tasks[id]; saveTasks(); }
  function taskState(id) {
    var t0 = tasks[id];
    if (!t0) return null;
    var el = (Date.now() - t0) / 1000;
    var pct = Math.max(4, Math.min(100, Math.round((el / DEMO_SECONDS) * 100)));
    var done = el >= DEMO_SECONDS;
    return {
      task_id: id, taskId: id, id: id,
      name: 'DEMO · 示範模型', taskType: 'text_to_model', task_type: 'text_to_model',
      native_format: 'glb', input_json: '{}',
      status: done ? 'success' : (el < 0.7 ? 'queued' : 'running'),
      progress: done ? 100 : pct,
      thumbnail: '/api/task/' + id + '/thumbnail',
      created_at: new Date(t0).toISOString().replace('T', ' ').slice(0, 19)
    };
  }
  function listTasks() {
    /* one pre-completed model so the asset panel has something to click on first load */
    if (!tasks['demo-seed']) tasks['demo-seed'] = Date.now() - 3600e3;
    var out = [];
    for (var id in tasks) { var st = taskState(id); if (st) out.push(st); }
    out.sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; });
    return out;
  }

  function readName(body) {
    try {
      var b = typeof body === 'string' ? JSON.parse(body) : body;
      if (b && (b.username || b.email)) return String(b.username || b.email).slice(0, 40);
    } catch (e) {}
    return null;
  }
  function path(url) {
    var u = String(url).replace(/^https?:\/\/[^/]+/, '');
    return u.split('?')[0];
  }

  /* ── the fake backend ─────────────────────────────────────────────────── */
  var GEN_MODELS = {
    h: [
      { label: 'v3.1 — 最高精度', value: 'v3.1-20260211', credits: 20, face_min: 500, face_max: 2000000, quad_max: 0 },
      { label: 'v3.0 — 均衡', value: 'v3.0-20250812', credits: 15, face_min: 500, face_max: 1500000, quad_max: 0 }
    ],
    p: [
      { label: 'P1 — 三角面', value: 'P1-20260311', credits: 5, face_min: 50, face_max: 20000, quad_max: 0 },
      { label: 'P2 — 四边面', value: 'P2-20260311', credits: 5, face_min: 50, face_max: 20000, quad_max: 150000 }
    ],
    default_h: 'v3.1-20260211', default_p: 'P1-20260311',
    updated_at: '2026-09-14 11:43:40'
  };

  function route(p, method, opts) {
    /* auth */
    if (/^\/api\/(auth\/login|auth\/register)$/.test(p) && method === 'POST') {
      var n = readName(opts && opts.body);
      if (n) NAME = n;
      return dual({ access_token: TOKEN, token: TOKEN, user: user(NAME), expires_in: 86400 });
    }
    if (p === '/api/auth/me') return dual(user(NAME));
    /* boot-time silent refresh: answer 401 the way the origin does for an anonymous visitor, so the
       copy opens on the real login screen instead of logging itself in. */
    if (p === '/api/auth/refresh') return J({ code: 401, message: 'unauthorized' }, 401);
    if (/^\/api\/auth\/(logout|password)$/.test(p)) return dual({ ok: true });

    /* account */
    if (p === '/api/user/balance') return dual({ balance: 128, frozen: 0, total_consumed: 42 });
    if (/^\/api\/user\/tasks(\/poll)?$/.test(p)) {
      var L = listTasks();
      for (var qi = 0; qi < L.length; qi++) maybeStage(L[qi]);
      return dual({ tasks: L, total: L.length, has_more: false, pending: L.filter(function (t) { return t.status !== 'success'; }).length });
    }
    if (p === '/api/user/assets') return dual({ assets: [], total: 0, has_more: false });

    /* catalogue */
    if (p === '/api/gen-models') return dual(GEN_MODELS);
    if (p === '/api/announcement') return new Response(ANNOUNCEMENT, {
      status: 200, headers: { 'Content-Type': 'application/json', 'X-Archive': 'captured' }
    });

    /* uploads: accepted locally, so the file you pick previews in the panel. Nothing is transmitted
       and no token means anything — the app only needs a truthy token to move on. */
    if (/^\/api\/upload(\/image)?$/.test(p) && method === 'POST') {
      return dual({ image_token: 'demo-image-token', file_token: 'demo-file-token', ok: true });
    }
    if (/^\/api\/upload\/model$/.test(p) && method === 'POST') return J({ code: 400, message: REFUSAL }, 400);

    /* ── a real task lifecycle, ending on a vendored sample model ────────────
       The job is local: a clock, not a renderer. What the viewer finally loads is Duck.glb (Khronos
       sample, CC-BY) served from this directory — every task, texture pass and retopo ends on the
       same file, and the thumbnail says so. Nothing is generated and nothing is sent. */
    if (/^\/api\/task$/.test(p) && method === 'POST') {
      var tid = newTask();
      bus(function (b) { b.emitTaskStarted({ taskId: tid, name: 'DEMO · 生成中…', type: 'HighPoly' }); });
      return dual({ task_id: tid, id: tid, status: 'queued', progress: 0 });
    }
    var dl = p.match(/^\/api\/task\/([^/]+)\/(download|thumbnail)$/);
    if (dl) {
      window.__mirrorBlocked.push('rewrite ' + p + ' -> ' + (dl[2] === 'download' ? 'demo-model.glb' : 'demo-thumb.png'));
      return _fetch.call(this, ROOT + (dl[2] === 'download' ? 'demo-model.glb' : 'demo-thumb.png'), { method: 'GET' });
    }
    var tk = p.match(/^\/api\/task\/([^/]+)$/);
    if (tk) {
      if (method === 'DELETE') { forget(tk[1]); return dual({ ok: true }); }
      var st = taskState(tk[1]);
      maybeStage(st);
      return st ? dual(st) : J({ code: 404, message: 'no such demo task' }, 404);
    }

    /* admin console — shapes taken from the call sites in the bundle */
    if (p === '/admin/stats') return dual({
      TotalUsers: 128, ActiveKeys: 6, ExpiringKeys: 1,
      TodayCalls: 412, TodayCredits: 2100, TotalBalance: 18400
    });
    if (/^\/admin\/(balance-trend|keys\/stats)$/.test(p)) return dual({ series: [] });
    if (p === '/admin/tasks/active') return dual({ tasks: [] });
    if (/^\/admin\/users/.test(p)) return dual({ users: [], total: 0, has_more: false });
    if (/^\/admin\/keys(\/stats)?/.test(p)) return dual({ keys: [], total: 0, has_more: false });
    if (/^\/admin\/(logs|batch-keys)/.test(p)) {
      if (method !== 'GET') return dual({ ok: true });
      return dual({ logs: [], data: [], keys: [], has_more: false });
    }
    if (/^\/api\/admin\/gen-models$/.test(p)) return dual(GEN_MODELS);
    if (/^\/api\/admin\/subserver/.test(p)) return dual({ mode: 'main', auth_enabled: false, servers: [] });
    if (/^\/admin\/config/.test(p)) {
      if (method !== 'GET') return dual({ ok: true });
      return dual({ polling_interval_ms: 2000, max_retry: 2, credit_safety_factor: 2,
                    credit_warn_threshold: 50, total_max_concurrent: 8,
                    single_key_concurrent: 3, schedule_strategy: 'weighted',
                    balance_refresh_interval: 300 });
    }
    if (/^\/admin\/models/.test(p)) return dual({ ok: true });

    /* anything else that looks like an API: answer empty, and say so in the console */
    if (/^\/(api|admin)\//.test(p)) {
      window.__mirrorStubbed.push(method + ' ' + p);
      return dual({ ok: true, items: [], list: [], total: 0, has_more: false });
    }
    return null;
  }

  /* ── patch the network away ───────────────────────────────────────────── */
  /* the three.js environment probe is requested from the origin's *root* ("/studio.hdr"), which does
     not exist under /portfolio/demos/. Find the copy we vendored beside this document instead. */
  var ROOT = location.pathname.replace(/[^/]*$/, '');
  var _fetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var p = path(url);
    if (/\/studio\.hdr$/.test(p) && p !== ROOT + 'studio.hdr') {
      var local = ROOT + 'studio.hdr';
      window.__mirrorBlocked.push('rewrite ' + p + ' -> ' + local);
      return _fetch.call(this, local, init);
    }
    if (!/^\/(api|admin)\//.test(p)) return _fetch.apply(this, arguments);
    var out = route(p, method, init);
    if (!out) { out = dual({ ok: true }); window.__mirrorUnstubbed.push(method + ' ' + p); }
    window.__mirrorBlocked.push(method + ' ' + p);
    return Promise.resolve(out);
  };

  var _open = XMLHttpRequest.prototype.open;
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) {
    this.__arch = { method: (m || 'GET').toUpperCase(), url: u, blocked: /^\/(api|admin)\//.test(path(u)) };
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    var a = this.__arch;
    if (!a || !a.blocked) return _send.apply(this, arguments);
    var self = this, out = route(a.url, a.method, { body: body });
    window.__mirrorBlocked.push(a.method + ' ' + a.url);
    var text = out ? out.__text : null;
    setTimeout(function () {
      try {
        Object.defineProperty(self, 'readyState', { value: 4, configurable: true });
        Object.defineProperty(self, 'status', { value: 200, configurable: true });
        Object.defineProperty(self, 'responseText', { value: '{"ok":true}', configurable: true });
        Object.defineProperty(self, 'response', { value: self.responseType && self.responseType !== 'text' ? null : '{"ok":true}', configurable: true });
        self.dispatchEvent(new Event('readystatechange'));
        self.dispatchEvent(new Event('load'));
        self.dispatchEvent(new Event('loadend'));
      } catch (e) {}
    }, 0);
  };

  var _WS = window.WebSocket;
  if (_WS) {
    window.WebSocket = function (u) {
      window.__mirrorBlocked.push('WS ' + u);
      throw new Error('demo copy: no live socket');
    };
    window.WebSocket.prototype = _WS.prototype;
  }
  if (window.EventSource) {
    window.EventSource = function (u) {
      window.__mirrorBlocked.push('SSE ' + u);
      throw new Error('demo copy: no event stream');
    };
  }
  if (navigator.sendBeacon) {
    navigator.sendBeacon = function (u) { window.__mirrorBlocked.push('beacon ' + u); return true; };
  }
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register = function () {
      window.__mirrorBlocked.push('serviceWorker.register');
      return Promise.reject(new Error('demo copy: no service worker'));
    };
  }
  window.addEventListener('submit', function (e) { e.preventDefault(); }, true);
  window.addEventListener('beforeunload', function (e) {
    if (/^https?:\/\/([^/]*\.)?tripo3d\./.test(location.href)) e.preventDefault();
  });

  /* ── the label ────────────────────────────────────────────────────────── */

  /* ── talking to the app's own event bus ─────────────────────────────────────────────────────────
     The bundle is frozen, so its bus chunk has one fixed name. Importing it here resolves to the
     very same module instance the app already loaded, which is what lets the demo announce a job
     the app did not start itself. */
  var busPromise = null;
  function bus(cb) {
    if (!busPromise) {
      busPromise = import(ROOT + '_nuxt/C8rqidu5.js')
        .then(function (m) { return m.u(); })
        .catch(function () { return null; });
    }
    busPromise.then(function (b) { if (b) { try { cb(b); } catch (e) {} } });
  }

  /* once a job finishes, put the sample model on the stage — no click needed */
  var stageLoaded = {};
  function maybeStage(st) {
    if (!st || st.status !== 'success' || stageLoaded[st.task_id]) return;
    if (st.task_id.indexOf('demo-seed') === 0) return;
    stageLoaded[st.task_id] = 1;
    bus(function (b) {
      b.emitLoadModel({ url: ROOT + 'demo-model.glb', name: 'DEMO · 示範模型', taskId: st.task_id, nativeFormat: 'glb' });
    });
  }

  /* thumbnails and "download" links are plain DOM, so fetch() patching never sees them — point them
     at the local files instead of letting them 404 */
  function rewriteNode(el) {
    try {
      if (!el || el.nodeType !== 1) return;
      var tag = el.tagName;
      if (tag === 'IMG') {
        var src = el.getAttribute('src') || '';
        if (/\/api\/task\/[^/]+\/thumbnail/.test(src)) {
          var want = ROOT + 'demo-thumb.png';
          if (src !== want) el.setAttribute('src', want);
        }
        var vi = src.match(/^\/viewer\/images\/([A-Za-z0-9_.\-]+)$/);
        if (vi) {
          var want2 = ROOT + 'viewer/images/' + vi[1];
          if (src !== want2) el.setAttribute('src', want2);
        }
      } else if (tag === 'A') {
        var href = el.getAttribute('href') || '';
        if (/\/api\/task\/[^/]+\/download/.test(href)) {
          var wantH = ROOT + 'demo-model.glb';
          if (href !== wantH) {
            el.setAttribute('href', wantH);
            el.setAttribute('download', 'demo-model.glb');
          }
        }
      }
      var inner = el.querySelectorAll && el.querySelectorAll('img,a');
      if (inner) for (var i = 0; i < inner.length; i++) rewriteNode(inner[i]);
    } catch (e) {}
  }
  function watchDom() {
    rewriteNode(document.body || document.documentElement);
    try {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var m = muts[i];
          if (m.type === 'attributes') rewriteNode(m.target);
          else for (var j = 0; j < m.addedNodes.length; j++) rewriteNode(m.addedNodes[j]);
        }
      }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href'] });
    } catch (e) {}
  }

  function bar() {
    var b = document.createElement('div');
    b.id = '__archive_bar';
    b.setAttribute('style', [
      'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:2147483647',
      'display:flex', 'align-items:center', 'gap:8px', 'flex-wrap:wrap',
      'padding:7px 12px', 'background:rgba(10,12,17,.95)',
      'border-top:1px solid rgba(248,113,113,.45)',
      'font:600 10.5px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace',
      'letter-spacing:.09em', 'text-transform:uppercase', 'color:#ffb4b4',
      'backdrop-filter:blur(8px)', '-webkit-backdrop-filter:blur(8px)'
    ].join(';'));
    b.innerHTML =
      '<span style="color:#f87171">◼ DEMO SESSION</span>' +
      '<span style="color:#98a1b3">任何帳號密碼都會登入 · 數據係假 · 生成結果 = 示範模型 Duck.glb（非生成）</span>' +
      '<span style="color:#6d7686;letter-spacing:0">archived 21 oct 2026 · not affiliated</span>' +
      '<a href="../tripo3d-uk-teardown.html" style="margin-left:auto;color:#7c8cff;text-decoration:none">← teardown</a>';
    (document.body || document.documentElement).appendChild(b);
    document.documentElement.style.setProperty('--archive-bar-h', '30px');
    var s = document.createElement('style');
    s.textContent = '#__nuxt{padding-bottom:34px!important}';
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bar);
    document.addEventListener('DOMContentLoaded', watchDom);
  } else { bar(); watchDom(); }

  try {
    if (document.title.indexOf('archived') === -1) document.title += ' — archived copy';
  } catch (e) {}
})();
