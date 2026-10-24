/* ============================================================
   UB66 MIRROR GUARD  —  archive of www.ub66.com (Universe Browser)
   Loaded FIRST in <head>. This is NOT part of the captured site.

   Purpose: make the archived marketing page an INERT exhibit.
     1. blocks every outbound request (cross-origin and /files/),
        so the archive can never reach cdn.n4dhx7bt.com or the APK;
     2. disables the download flow entirely — this exhibit must not
        distribute the application binaries;
     3. strips the site's Google Analytics beacon tags at runtime as
        a second line of defence;
     4. shows a permanent "archived copy" bar.
   ============================================================ */
(function () {
  var LABEL = '\u5b58\u6a94\u526f\u672c / ARCHIVED COPY \u2014 \u7db2\u7d61\u5df2\u7981\u7528 \u00b7 \u4e0b\u8f09\u5df2\u505c\u7528 \u00b7 no data leaves this page';

  window.__mirrorBlocked = window.__mirrorBlocked || [];
  function note(url) { window.__mirrorBlocked.push(String(url)); }

  function blocked(url) {
    try {
      var u = new URL(url, location.href);
      if (u.origin !== location.origin) return true;          // cdn.n4dhx7bt.com, GA, cloudfront
      return /^\/(files|download)\//.test(u.pathname);        // APK / exe payload paths
    } catch (e) { return true; }
  }

  /* ---- 1. cut the wire ------------------------------------- */
  var _fetch = window.fetch;
  window.fetch = function (input) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    if (blocked(url)) { note(url); return Promise.reject(new TypeError('archived copy: network disabled')); }
    return _fetch.apply(this, arguments);
  };

  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, url) {
    if (blocked(url)) { note(url); this.__archived = true; }
    return _open.apply(this, arguments);
  };
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    if (this.__archived) { note('xhr'); return; }
    return _send.apply(this, arguments);
  };

  function StubWS(url) {
    note(url);
    this.url = url; this.readyState = 3; this.bufferedAmount = 0;
    this.send = function () {}; this.close = function () {};
    this.addEventListener = function () {}; this.removeEventListener = function () {};
    var self = this;
    setTimeout(function () {
      self.onerror && self.onerror({ type: 'error' });
      self.onclose && self.onclose({ code: 1006, reason: 'archived copy' });
    }, 0);
  }
  StubWS.prototype.dispatchEvent = function () {};
  StubWS.CONNECTING = 0; StubWS.OPEN = 1; StubWS.CLOSING = 2; StubWS.CLOSED = 3;
  window.WebSocket = StubWS;

  if (navigator.sendBeacon) navigator.sendBeacon = function (url) { note(url); return true; };

  /* ---- 2. neutralise the download flow --------------------- */
  function toast(msg, th) {
    var d = document.getElementById('__archive_toast');
    if (!d) {
      d = document.createElement('div');
      d.id = '__archive_toast';
      d.style.cssText = 'position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:2147483646;' +
        'max-width:min(520px,92vw);padding:12px 16px;border-radius:10px;' +
        'font:500 13px/1.5 -apple-system,system-ui,sans-serif;text-align:center;' +
        'color:#ffe1b8;background:rgba(40,16,10,.96);border:1px solid #8a4a22;' +
        'box-shadow:0 8px 30px rgba(0,0,0,.45);pointer-events:none';
      (document.body || document.documentElement).appendChild(d);
    }
    d.textContent = msg;
    clearTimeout(th); th = setTimeout(function () { d.remove(); }, 5200);
    return th;
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a,button') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var cls = a.className || '';
    if (/download/i.test(href) || /download-btn|default-download-link|backup-download-link/.test(cls) || a.id === 'download') {
      ev.preventDefault();
      ev.stopPropagation();
      toast('\u6b64\u6a94\u6848\u70ba\u5206\u6790\u7528\u5b58\u6a94\uff0c\u4e0d\u63d0\u4f9b\u4e0b\u8f09\u3002' +
            ' This is an analysis archive — the app download is disabled.');
      return false;
    }
  }, true);

  // Block programmatic navigation to the download gate / payload files
  try {
    var _assign = location.assign.bind(location);
    var _replace = location.replace.bind(location);
    location.assign = function (u) { if (blocked(u)) { return note(u); } return _assign(u); };
    location.replace = function (u) { if (blocked(u)) { return note(u); } return _replace(u); };
  } catch (e) {}

  /* ---- 3. strip analytics beacons that survived archiving --- */
  function stripTrackers() {
    var sels = ['#__ga', 'script[src*="google-analytics.com"]', 'script[src*="googletagmanager.com"]'];
    sels.forEach(function (s) {
      Array.prototype.forEach.call(document.querySelectorAll(s), function (n) { n.remove(); });
    });
  }

  /* ---- 4. permanent archive bar ---------------------------- */
  function installBar() {
    if (!document.body || document.getElementById('__archive_bar')) return;
    var b = document.createElement('div');
    b.id = '__archive_bar';
    b.textContent = LABEL;
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;' +
      'padding:6px 10px;font:600 11px/1.4 -apple-system,system-ui,sans-serif;letter-spacing:.04em;' +
      'text-align:center;color:#ffd8a8;background:rgba(24,16,8,.94);border-top:1px solid #6b4a1f;' +
      'pointer-events:none';
    document.body.appendChild(b);
  }

  function boot() { stripTrackers(); installBar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
