/* ============================================================
   mis-ws.org kit — ARCHIVE GUARD
   This file is NOT part of the original kit. It exists so the
   captured copy can be displayed safely:
     1. makes the kit's own "mobile only" gate pass, so the UI
        renders inside a desktop iframe
     2. hard-blocks every network call, so the copy is inert and
        cannot be used against the real operator's backend
   Files in llFco8/ are byte-for-byte as captured.
   ============================================================ */
(function () {
  'use strict';

  // ---- 1. spoof a mobile device (the kit's mgate.js checks all of these) ----
  var UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
  function def(obj, prop, value) {
    try { Object.defineProperty(obj, prop, { get: function () { return value; }, configurable: true }); } catch (e) {}
  }
  def(navigator, 'userAgent', UA);
  def(navigator, 'appVersion', UA.replace('Mozilla/', ''));
  def(navigator, 'platform', 'iPhone');
  def(navigator, 'maxTouchPoints', 5);
  def(navigator, 'webdriver', false);   // the kit's anti-debug aborts the whole app if true
  def(navigator, 'userAgentData', {
    mobile: true,
    platform: 'iOS',
    brands: [{ brand: 'Safari', version: '18.0' }],
    getHighEntropyValues: function () { return Promise.resolve({ platform: 'iOS', mobile: true }); }
  });
  ['WebGLRenderingContext', 'WebGL2RenderingContext'].forEach(function (n) {
    var C = window[n];
    if (!C || !C.prototype || !C.prototype.getParameter) return;
    var orig = C.prototype.getParameter;
    C.prototype.getParameter = function (p) {
      if (p === 0x9246) return 'Apple GPU';        // UNMASKED_RENDERER_WEBGL
      if (p === 0x9245) return 'Apple Inc.';       // UNMASKED_VENDOR_WEBGL
      return orig.call(this, p);
    };
  });

  // ---- 1b. keep the kit's baked-in "/llFco8/..." asset paths inside this folder ----
  (function () {
    function fix(v) {
      return (typeof v === 'string' && v.indexOf('/llFco8/') === 0) ? '.' + v : v;
    }
    var sa = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (n, v) {
      if (String(n).toLowerCase() === 'src') v = fix(v);
      return sa.call(this, n, v);
    };
    try {
      var d = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        configurable: true,
        get: function () { return d.get.call(this); },
        set: function (v) { d.set.call(this, fix(v)); }
      });
    } catch (e) {}
  })();

  // ---- 2. block all outbound traffic unless explicitly allowed (capture mode) ----
  if (window.__ALLOW_NET__) return;

  var BLOCKED = /(^|\/)(api|session|monitor|collect|analytics)(\/|$)/i;

  function isBlocked(url) {
    try {
      var u = new URL(url, location.href);
      if (u.origin !== location.origin) return true;   // never talk to a third party
      return BLOCKED.test(u.pathname);
    } catch (e) { return true; }
  }

  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    if (isBlocked(url)) {
      window.__mirrorBlocked = (window.__mirrorBlocked || []).concat([url]);
      return Promise.reject(new TypeError('archive guard: network disabled'));
    }
    return realFetch.apply(this, arguments);
  };

  var XO = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, url) {
    if (isBlocked(url)) {
      window.__mirrorBlocked = (window.__mirrorBlocked || []).concat([url]);
      this.__blocked = true;
      return;
    }
    return XO.apply(this, arguments);
  };
  var XS = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    if (this.__blocked) { try { this.abort(); } catch (e) {} return; }
    return XS.apply(this, arguments);
  };

  window.WebSocket = function (url) {
    window.__mirrorBlocked = (window.__mirrorBlocked || []).concat([String(url)]);
    var self = this;
    this.url = String(url); this.readyState = 3; this.bufferedAmount = 0;
    this.send = function () {}; this.close = function () {};
    this.addEventListener = function () {};
    this.removeEventListener = function () {};
    setTimeout(function () { self.onerror && self.onerror({ type: 'error' }); self.onclose && self.onclose({ code: 1006 }); }, 0);
  };
  window.WebSocket.CONNECTING = 0; window.WebSocket.OPEN = 1;
  window.WebSocket.CLOSING = 2; window.WebSocket.CLOSED = 3;

  if (navigator.sendBeacon) {
    navigator.sendBeacon = function (url) {
      window.__mirrorBlocked = (window.__mirrorBlocked || []).concat([String(url)]);
      return true;
    };
  }

  // ---- 3. label it, so nobody mistakes the copy for the real thing ----
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.id = 'archive-guard-bar';
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;' +
      'background:#111;color:#ffd166;font:600 11px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;' +
      'text-align:center;padding:5px 8px;letter-spacing:.2px;opacity:.95';
    bar.textContent = '存档副本 / ARCHIVED COPY — 网络已禁用 · no data leaves this page';
    document.body.appendChild(bar);
  });
})();
