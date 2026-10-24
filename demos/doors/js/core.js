/* ═══════════════════════════════════════════════════════════════════════════
   DOORS — core: utilities, settings, audio, textures, view, player, input, HUD
   Everything here is engine plumbing. Level content lives in world.js,
   the things that hunt you live in entities.js, and the run lives in game.js.
   ═══════════════════════════════════════════════════════════════════════════ */
window.DOORS = window.DOORS || {};
(function (NS) {
  'use strict';

  /* ── math / rng ───────────────────────────────────────────────────────── */
  const U = NS.util = {
    clamp: (v, a, b) => v < a ? a : v > b ? b : v,
    lerp: (a, b, t) => a + (b - a) * t,
    // damp: frame-rate independent approach, the only correct way to lerp a camera
    damp: (a, b, rate, dt) => b + (a - b) * Math.pow(rate, dt),
    /* Seeded RNG. Every room is generated from its door number, so a retry
       builds the identical room — otherwise "try the door again" quietly
       becomes a different level and you can't learn a layout. */
    rng(seed) {
      let s = (seed >>> 0) || 1;
      return function () {
        s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
        return s / 4294967296;
      };
    },
    range(r, a, b) { return a + (b - a) * r(); },
    pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; },
    chance(r, p) { return r() < p; },
    tsec(t) {
      t = Math.max(0, Math.floor(t));
      const m = Math.floor(t / 60), s = t % 60;
      return m + ':' + String(s).padStart(2, '0');
    },
    hex(h) { return '#' + h.toString(16).padStart(6, '0'); }
  };

  /* ── settings (persisted) ─────────────────────────────────────────────── */
  const DEF = { sens: 100, vol: 70, quality: 100, seenHelp: false };
  NS.settings = Object.assign({}, DEF);
  try { Object.assign(NS.settings, JSON.parse(localStorage.getItem('doors.settings') || '{}')); } catch (e) {}
  NS.saveSettings = function () {
    try { localStorage.setItem('doors.settings', JSON.stringify(NS.settings)); } catch (e) {}
  };
  NS.resetSettings = function () { Object.assign(NS.settings, DEF); NS.saveSettings(); };

  /* ── audio: every sound is synthesised, so the game is one small download
        and no third-party audio licensing. Nothing is created until the first
        user gesture (browsers block otherwise). ─────────────────────────── */
  const A = NS.audio = {
    ctx: null, master: null, ready: false, noiseBuf: null, amb: null, muted: false,
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = this.ctx = new AC();
      this.master = ctx.createGain();
      this.master.gain.value = (NS.settings.vol / 100) * 0.9;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 22; comp.ratio.value = 3.2;
      this.master.connect(comp).connect(ctx.destination);
      // 2 s of pink-ish noise, reused by footsteps, rumble, wind, screech
      const n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.0990460;
        b1 = 0.96300 * b1 + w * 0.2965164;
        b2 = 0.57000 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16;
      }
      this.noiseBuf = buf;
      this.ready = true;
      this.ambience();
    },
    setVolume(v) { if (this.master) this.master.gain.value = (v / 100) * 0.9; },
    now() { return this.ctx ? this.ctx.currentTime : 0; },
    noise(dur) {
      const s = this.ctx.createBufferSource();
      s.buffer = this.noiseBuf; s.loop = true;
      s.playbackRate.value = 0.8 + Math.random() * 0.5;
      return s;
    },
    /* hotel room-tone: filtered noise + a 50 Hz mains hum, both very quiet.
       The hum matters — silence reads as "broken game", hum reads as "empty". */
    ambience() {
      if (!this.ready || this.amb) return;
      const ctx = this.ctx;
      const src = this.noise(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      lp.type = 'lowpass'; lp.frequency.value = 320; lp.Q.value = 0.6;
      g.gain.value = 0.055;
      src.connect(lp).connect(g).connect(this.master); src.start();
      const hum = ctx.createOscillator(), hg = ctx.createGain();
      hum.type = 'sine'; hum.frequency.value = 49.5; hg.gain.value = 0.012;
      hum.connect(hg).connect(this.master); hum.start();
      this.amb = { src, g, hum, hg };
    },
    ambienceLevel(v) { if (this.amb) this.amb.g.gain.value = v; },
    step(run, crouch) {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      const s = this.noise(0.2), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = run ? 1650 : crouch ? 520 : 1050; bp.Q.value = 1.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(run ? 0.22 : crouch ? 0.045 : 0.12, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0008, t + (run ? 0.16 : 0.22));
      s.connect(bp).connect(g).connect(this.master);
      s.start(t); s.stop(t + 0.3);
    },
    door(open) {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      const o = ctx.createOscillator(), g = ctx.createGain(), bp = ctx.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(open ? 95 : 150, t);
      o.frequency.exponentialRampToValueAtTime(open ? 180 : 70, t + 0.55);
      bp.type = 'bandpass'; bp.frequency.value = 620; bp.Q.value = 3.5;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.10, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.62);
      o.connect(bp).connect(g).connect(this.master); o.start(t); o.stop(t + 0.7);
      const s = this.noise(0.4), ng = ctx.createGain(), hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 1400;
      ng.gain.setValueAtTime(0.05, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      s.connect(hp).connect(ng).connect(this.master); s.start(t); s.stop(t + 0.5);
    },
    thud(gain) {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now(), g = ctx.createGain();
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.18);
      g.gain.setValueAtTime(gain || 0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.34);
    },
    rush() {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      const s = this.noise(1.6), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(180, t);
      lp.frequency.exponentialRampToValueAtTime(2400, t + 1.1);
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.75, t + 0.9);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.7);
      s.connect(lp).connect(g).connect(this.master); s.start(t); s.stop(t + 1.8);
    },
    screech() {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      [1, 1.482, 2.06, 2.71].forEach((m, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = i % 2 ? 'sawtooth' : 'square';
        o.frequency.setValueAtTime(560 * m, t);
        o.frequency.exponentialRampToValueAtTime(760 * m, t + 0.22);
        g.gain.setValueAtTime(0.0, t);
        g.gain.linearRampToValueAtTime(0.11, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
        o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.36);
      });
    },
    hurt() {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      const s = this.noise(0.4), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 900;
      g.gain.setValueAtTime(0.42, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      s.connect(lp).connect(g).connect(this.master); s.start(t); s.stop(t + 0.45);
      this.thud(0.3);
    },
    ping(freq) {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = freq || 1180;
      g.gain.setValueAtTime(0.0, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.5);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.55);
    },
    ding() {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      [[988, 0], [1319, 0.18]].forEach(([f, d]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0, t + d);
        g.gain.linearRampToValueAtTime(0.10, t + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0006, t + d + 1.4);
        o.connect(g).connect(this.master); o.start(t + d); o.stop(t + d + 1.5);
      });
    },
    heartbeat(rate) {
      if (!this.ready) return;
      const ctx = this.ctx, t = this.now();
      [0, 0.16].forEach((d, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(62, t + d);
        o.frequency.exponentialRampToValueAtTime(38, t + d + 0.14);
        g.gain.setValueAtTime(i ? 0.16 : 0.24, t + d);
        g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.2);
        o.connect(g).connect(this.master); o.start(t + d); o.stop(t + d + 0.24);
      });
    },
    lever() {
      if (!this.ready) return;
      this.thud(0.35);
      const ctx = this.ctx, t = this.now(), s = this.noise(0.2), g = ctx.createGain();
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2200;
      g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      s.connect(hp).connect(g).connect(this.master); s.start(t); s.stop(t + 0.2);
    }
  };

  /* ── procedural textures ──────────────────────────────────────────────────
     No image files: 8 canvases replace what would otherwise be 8 downloads.
     Every pattern is drawn at 256² and repeated, so it survives any screen. */
  const T = NS.tex = { cache: {} };
  function cv(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h || w; return c;
  }
  function finish(c, rx, ry) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx || 1, ry || 1);
    t.anisotropy = 4;
    if ('colorSpace' in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function noise(ctx, w, h, amt, dark) {
    const img = ctx.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * amt * 255;
      d[i] = U.clamp(d[i] + n, 0, 255);
      d[i + 1] = U.clamp(d[i + 1] + n, 0, 255);
      d[i + 2] = U.clamp(d[i + 2] + n, 0, 255);
      if (dark) {
        const v = (d[i] + d[i + 1] + d[i + 2]) / 3;
        const k = v * dark;
        d[i] -= k * 0.2; d[i + 1] -= k * 0.28; d[i + 2] -= k * 0.3;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  T.get = function (name) {
    if (this.cache[name]) return this.cache[name];
    const c = cv(256), x = c.getContext('2d');
    let t;
    switch (name) {
      case 'wallpaper': {                       // dusty hotel damask
        x.fillStyle = '#332b26'; x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 8; i++) {
          const px = i * 32;
          x.fillStyle = i % 2 ? '#3b322b' : '#2e2722';
          x.fillRect(px, 0, 16, 256);
        }
        x.strokeStyle = 'rgba(150,124,92,.075)'; x.lineWidth = 1.2;
        for (let i = 0; i < 8; i++) {
          const px = i * 32 + 24;
          x.beginPath();
          for (let y = 0; y < 256; y += 32) {
            x.moveTo(px, y + 6);
            x.quadraticCurveTo(px + 10, y + 16, px, y + 26);
            x.quadraticCurveTo(px - 10, y + 16, px, y + 6);
          }
          x.stroke();
        }
        noise(x, 256, 256, 0.06, 0.25);
        t = finish(c, 2, 1);
        break;
      }
      case 'carpet': {                          // deep red runner
        x.fillStyle = '#3c1a17'; x.fillRect(0, 0, 256, 256);
        x.strokeStyle = 'rgba(150,74,54,.30)'; x.lineWidth = 3;
        for (let i = -256; i < 512; i += 26) {
          x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 256, 256); x.stroke();
          x.beginPath(); x.moveTo(i + 256, 0); x.lineTo(i, 256); x.stroke();
        }
        x.fillStyle = 'rgba(20,8,7,.35)';
        for (let i = 0; i < 60; i++) x.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
        noise(x, 256, 256, 0.10, 0.2);
        t = finish(c, 3, 5);
        break;
      }
      case 'wood': {
        x.fillStyle = '#4a3423'; x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 90; i++) {
          const y = Math.random() * 256;
          x.strokeStyle = 'rgba(' + (30 + Math.random() * 40 | 0) + ',' + (20 + Math.random() * 26 | 0) + ',12,.5)';
          x.lineWidth = 0.6 + Math.random() * 2.2;
          x.beginPath(); x.moveTo(0, y);
          for (let px = 0; px < 256; px += 32) x.lineTo(px, y + Math.sin(px * 0.05 + i) * 2.2);
          x.stroke();
        }
        noise(x, 256, 256, 0.07, 0.2);
        t = finish(c, 2, 2);
        break;
      }
      case 'books': {                           // shelf of spines
        x.fillStyle = '#251a12'; x.fillRect(0, 0, 256, 256);
        const cols = ['#7a2620', '#3f4d33', '#2c3a52', '#6b5324', '#4a2b3e', '#33443f', '#7b6031', '#5a2d22'];
        let px = 0;
        while (px < 256) {
          const w = 4 + Math.random() * 9, h = 200 + Math.random() * 52;
          x.fillStyle = cols[Math.floor(Math.random() * cols.length)];
          x.fillRect(px, 256 - h, w - 1, h);
          x.fillStyle = 'rgba(220,200,160,.30)';
          x.fillRect(px + 1, 256 - h + 12, w - 3, 2);
          x.fillRect(px + 1, 256 - h + 22, w - 3, 1);
          px += w;
        }
        noise(x, 256, 256, 0.05, 0.15);
        t = finish(c, 2, 1);
        break;
      }
      case 'concrete': {
        x.fillStyle = '#4b4a47'; x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 26; i++) {
          x.fillStyle = 'rgba(30,30,28,' + (0.05 + Math.random() * 0.12) + ')';
          const w = 20 + Math.random() * 90, h = 12 + Math.random() * 60;
          x.fillRect(Math.random() * 256, Math.random() * 256, w, h);
        }
        x.strokeStyle = 'rgba(24,24,22,.5)'; x.lineWidth = 1.5;
        x.beginPath(); x.moveTo(0, 128); x.lineTo(256, 128); x.stroke();
        noise(x, 256, 256, 0.12, 0.25);
        t = finish(c, 2, 2);
        break;
      }
      case 'metal': {
        x.fillStyle = '#3d4145'; x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 160; i++) {
          const y = Math.random() * 256;
          x.strokeStyle = 'rgba(' + (150 + Math.random() * 60 | 0) + ',' + (156 + Math.random() * 60 | 0) + ',' + (164 + Math.random() * 60 | 0) + ',.06)';
          x.lineWidth = 1; x.beginPath(); x.moveTo(0, y); x.lineTo(256, y); x.stroke();
        }
        x.fillStyle = 'rgba(18,20,22,.55)';
        for (let gx = 12; gx < 256; gx += 48) for (let gy = 12; gy < 256; gy += 48) {
          x.beginPath(); x.arc(gx, gy, 2.4, 0, 6.3); x.fill();
        }
        noise(x, 256, 256, 0.08, 0.2);
        t = finish(c, 2, 2);
        break;
      }
      case 'tile': {
        x.fillStyle = '#b9b2a2'; x.fillRect(0, 0, 256, 256);
        x.strokeStyle = 'rgba(90,86,74,.55)'; x.lineWidth = 3;
        for (let i = 0; i <= 256; i += 64) {
          x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 256); x.stroke();
          x.beginPath(); x.moveTo(0, i); x.lineTo(256, i); x.stroke();
        }
        noise(x, 256, 256, 0.07, 0.3);
        t = finish(c, 3, 5);
        break;
      }
      case 'leaf': {
        x.fillStyle = '#1e2c1c'; x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 220; i++) {
          x.fillStyle = 'rgba(' + (30 + Math.random() * 50 | 0) + ',' + (60 + Math.random() * 70 | 0) + ',' + (30 + Math.random() * 30 | 0) + ',.7)';
          x.beginPath();
          x.ellipse(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 12, 2 + Math.random() * 6, Math.random() * 6.3, 0, 6.3);
          x.fill();
        }
        noise(x, 256, 256, 0.08, 0.2);
        t = finish(c, 2, 2);
        break;
      }
      case 'face': {                            // Screech / Rush face, drawn once
        c.width = c.height = 256;
        const g = x.createRadialGradient(128, 128, 10, 128, 128, 128);
        g.addColorStop(0, '#e8ded0'); g.addColorStop(0.55, '#b9a898'); g.addColorStop(1, 'rgba(20,16,14,0)');
        x.fillStyle = g; x.beginPath(); x.ellipse(128, 128, 96, 120, 0, 0, 6.3); x.fill();
        x.fillStyle = '#0a0908';
        x.beginPath(); x.ellipse(96, 106, 17, 26, -0.12, 0, 6.3); x.fill();
        x.beginPath(); x.ellipse(160, 106, 17, 26, 0.12, 0, 6.3); x.fill();
        x.beginPath(); x.ellipse(128, 176, 26, 34, 0, 0, 6.3); x.fill();
        x.strokeStyle = 'rgba(40,30,26,.55)'; x.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
          x.beginPath(); x.moveTo(100 + i * 6, 140 + (i % 2) * 3); x.lineTo(104 + i * 6, 160); x.stroke();
        }
        t = finish(c, 1, 1); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        break;
      }
      case 'shroud': {                          // soft-edged darkness for Rush
        c.width = c.height = 256;
        const rg = x.createRadialGradient(128, 140, 30, 128, 140, 132);
        rg.addColorStop(0, 'rgba(4,4,6,1)');
        rg.addColorStop(0.62, 'rgba(4,4,6,.92)');
        rg.addColorStop(1, 'rgba(4,4,6,0)');
        x.fillStyle = rg; x.fillRect(0, 0, 256, 256);
        t = finish(c, 1, 1); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        break;
      }
      default: {
        x.fillStyle = '#444'; x.fillRect(0, 0, 256, 256); t = finish(c, 1, 1);
      }
    }
    this.cache[name] = t;
    return t;
  };

  /* ── view ─────────────────────────────────────────────────────────────── */
  /* three r140 defaults to legacy colour management, which treats hex colours as
     linear and then applies an sRGB output transform — so every surface renders
     ~1.8x lighter than the colour you authored (the "washed plastic" look).
     Turning it off makes #3a2a1c actually read as dark wood. */
  if (THREE.ColorManagement) {
    if ('legacyMode' in THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
    else THREE.ColorManagement.enabled = true;
  }

  const V = NS.view = { ready: false, menu: true };
  V.init = function () {
    const r = V.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * (NS.settings.quality / 100));
    r.setSize(window.innerWidth, window.innerHeight);
    r.shadowMap.enabled = false;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.12;
    if ('outputColorSpace' in r && THREE.SRGBColorSpace) r.outputColorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) r.outputEncoding = THREE.sRGBEncoding;
    document.getElementById('app').appendChild(r.domElement);
    r.domElement.id = 'stage';

    const s = V.scene = new THREE.Scene();
    s.background = new THREE.Color(0x05050a);
    s.fog = new THREE.FogExp2(0x05060a, 0.07);

    const c = V.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 90);
    c.rotation.order = 'YXZ';
    V.hemi = new THREE.HemisphereLight(0x3d4a5e, 0x14100c, 0.62);
    s.add(V.hemi);
    V.amb = new THREE.AmbientLight(0x40404c, 0.44);
    s.add(V.amb);

    // flashlight, parented to the camera so it always points where you look
    const torch = V.torch = new THREE.SpotLight(0xfff0d2, 0, 18, 0.46, 0.55, 1.2);
    torch.position.set(0.12, -0.12, 0.1);
    torch.target.position.set(0, 0, -1);
    c.add(torch); c.add(torch.target);
    V.ready = true;
    window.addEventListener('resize', V.resize);
  };
  V.resize = function () {
    if (!V.renderer) return;
    V.camera.aspect = window.innerWidth / window.innerHeight;
    V.camera.updateProjectionMatrix();
    V.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  V.setQuality = function (q) {
    if (!V.renderer) return;
    V.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * (q / 100));
    V.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  V.flash = function (strength) {
    const f = document.getElementById('flash');
    f.style.opacity = strength;
    clearTimeout(this._ft);
    this._ft = setTimeout(() => { f.style.opacity = 0; }, 60);
  };

  /* ── materials (shared, so 300 meshes don't compile 300 shaders) ──────── */
  NS.mat = {
    wall: () => new THREE.MeshStandardMaterial({ map: T.get('wallpaper'), color: 0xb9a68f, roughness: 0.94 }),
    wall2: () => new THREE.MeshStandardMaterial({ map: T.get('concrete'), color: 0x9a9a94, roughness: 1 }),
    carpet: () => new THREE.MeshStandardMaterial({ map: T.get('carpet'), color: 0x9c7f74, roughness: 1 }),
    tile: () => new THREE.MeshStandardMaterial({ map: T.get('tile'), color: 0xa9a497, roughness: 0.85 }),
    wood: () => new THREE.MeshStandardMaterial({ map: T.get('wood'), color: 0x9c7d5e, roughness: 0.86 }),
    book: () => new THREE.MeshStandardMaterial({ map: T.get('books'), roughness: 0.95 }),
    metal: () => new THREE.MeshStandardMaterial({ map: T.get('metal'), color: 0xa8adb2, roughness: 0.62, metalness: 0.35 }),
    leaf: () => new THREE.MeshStandardMaterial({ map: T.get('leaf'), color: 0x6f8a5e, roughness: 1 }),
    ceil: () => new THREE.MeshStandardMaterial({ color: 0x191714, roughness: 1 }),
    dark: () => new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.9 }),
    brass: () => new THREE.MeshStandardMaterial({ color: 0x8a6a32, roughness: 0.52, metalness: 0.55 }),
    lampOn: () => new THREE.MeshStandardMaterial({ color: 0xffe9c0, emissive: 0xffcf8a, emissiveIntensity: 1.15, roughness: 0.6 }),
    glass: () => new THREE.MeshStandardMaterial({ color: 0x9fb6a8, transparent: true, opacity: 0.18, roughness: 0.1, metalness: 0.2, side: THREE.DoubleSide }),
    snow: () => new THREE.MeshStandardMaterial({ color: 0xdfe6e2, roughness: 1 }),
    red: () => new THREE.MeshStandardMaterial({ color: 0x7e1b16, emissive: 0x501009, emissiveIntensity: 0.5, roughness: 0.8 }),
    doorTrim: () => new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.82 })
  };

  /* ── player ───────────────────────────────────────────────────────────── */
  const P = NS.player = {
    SPEED: { walk: 2.55, run: 4.5, crouch: 1.35 },
    x: 0, z: 0, vx: 0, vz: 0, yaw: 0, pitch: 0,
    hp: 100, stamina: 100, crouch: false, running: false, hidden: false,
    torchOn: false, battery: 100, keys: 0, picks: 2,
    eye: 1.62, bob: 0, stepDist: 0, dead: false
  };
  P.reset = function () {
    P.x = 0; P.z = -1.6; P.vx = P.vz = 0; P.yaw = 0; P.pitch = 0;
    P.hp = 100; P.stamina = 100; P.crouch = false; P.running = false; P.hidden = false;
    P.torchOn = false; P.battery = 100; P.keys = 0; P.picks = 2; P.dead = false; P.bob = 0;
    NS.view.torch.intensity = 0;
  };
  /* Movement is intentional: acceleration + damping rather than direct velocity,
     because instant stop/start is what makes small web games feel like a tech demo. */
  P.update = function (dt, input, bounds) {
    if (P.dead || P.hidden) { P.vx = P.vz = 0; return; }
    const wantCrouch = !!(input.keys.ctrl || input.touch.crouch);
    P.crouch = wantCrouch;
    let speed = wantCrouch ? P.SPEED.crouch : P.SPEED.walk;
    const wantRun = (input.keys.shift || input.touch.run) && P.stamina > 2 && !wantCrouch && input.moving();
    P.running = wantRun;
    if (wantRun) { speed = P.SPEED.run; P.stamina = Math.max(0, P.stamina - 25 * dt); }
    else P.stamina = Math.min(100, P.stamina + (input.moving() ? 9 : 20) * dt);

    const fwd = input.axis.y, side = input.axis.x;
    let dx = 0, dz = 0;
    if (fwd || side) {
      const sy = Math.sin(P.yaw), cy = Math.cos(P.yaw);
      dx = (-sy * fwd + cy * side);
      dz = (-cy * fwd - sy * side);
      const l = Math.hypot(dx, dz) || 1;
      dx /= l; dz /= l;
    }
    const accel = 18;
    P.vx = U.damp(P.vx, dx * speed, 1 / (1 + accel * dt), dt);
    P.vz = U.damp(P.vz, dz * speed, 1 / (1 + accel * dt), dt);

    // ---- collision: clamp inside the room, minus prop boxes
    let nx = P.x + P.vx * dt, nz = P.z + P.vz * dt;
    const R = 0.30;
    const solid = NS.world.blocks;
    for (let i = 0; i < solid.length; i++) {
      const b = solid[i];
      if (nx > b.minX - R && nx < b.maxX + R && P.z > b.minZ - R && P.z < b.maxZ + R) {
        nx = P.vx > 0 ? b.minX - R : b.maxX + R;
        P.vx = 0;
      }
      if (nz > b.minZ - R && nz < b.maxZ + R && P.x > b.minX - R && P.x < b.maxX + R) {
        nz = P.vz > 0 ? b.minZ - R : b.maxZ + R;
        P.vz = 0;
      }
    }
    nx = U.clamp(nx, bounds.minX, bounds.maxX);
    nz = U.clamp(nz, bounds.minZ, bounds.maxZ);
    P.x = nx; P.z = nz;

    // ---- head bob + footsteps driven by distance, not by a timer
    const dist = Math.hypot(P.vx, P.vz) * dt;
    P.stepDist += dist;
    const stride = P.running ? 1.45 : P.crouch ? 1.0 : 1.15;
    if (P.stepDist > stride) {
      P.stepDist = 0;
      NS.audio.step(P.running, P.crouch);
      NS.world.noiseEvent(P.x, P.z, P.running ? 1 : P.crouch ? 0.06 : 0.42);
    }
    P.bob += dist * (P.running ? 9 : 6.2);
    const bobY = Math.sin(P.bob) * (P.running ? 0.045 : 0.028);

    const targetEye = P.crouch ? 1.02 : P.eye;
    NS.view.camera.position.set(P.x, U.damp(NS.view.camera.position.y, targetEye + bobY, 0.001, dt), P.z);
    NS.view.camera.rotation.y = P.yaw;
    NS.view.camera.rotation.x = P.pitch;
  };
  P.damage = function (amount, cause) {
    if (P.dead || NS.game.godmode) return;
    P.hp = Math.max(0, P.hp - amount);
    NS.audio.hurt();
    NS.game.shake(0.55);
    const v = document.getElementById('vign');
    v.style.opacity = U.clamp(1 - P.hp / 100, 0, 0.9);
    if (P.hp <= 0) NS.game.die(cause || 'something');
  };
  P.heal = function (n) {
    P.hp = Math.min(100, P.hp + n);
    document.getElementById('vign').style.opacity = U.clamp(1 - P.hp / 100, 0, 0.9);
  };
  P.toggleTorch = function () {
    if (P.battery <= 0) { NS.hud.hint('The torch is dead.', 1.6); return; }
    P.torchOn = !P.torchOn;
    NS.view.torch.intensity = P.torchOn ? 3.4 : 0;
    NS.audio.ping(P.torchOn ? 860 : 520);
  };

  /* ── input ────────────────────────────────────────────────────────────── */
  const I = NS.input = {
    keys: {}, axis: { x: 0, y: 0 }, touch: { x: 0, y: 0, active: false, run: false, crouch: false },
    locked: false, dragging: false, lastX: 0, lastY: 0,
    moving() { return Math.abs(this.axis.x) + Math.abs(this.axis.y) > 0.08; },
    init() {
      const canvas = NS.view.renderer.domElement;
      window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        I.keys[k] = true;
        if (k === 'ctrl' || k === 'shift' || k === ' ' || k === 'tab') e.preventDefault();
        if (k === 'escape') NS.game.togglePause();
        if (k === 'f') P.toggleTorch();
        if (k === 'e') NS.game.interact();
        if (k === 'enter' && NS.game.state === 'lobby') NS.game.start('hotel');
      });
      window.addEventListener('keyup', (e) => { I.keys[e.key.toLowerCase()] = false; });
      window.addEventListener('blur', () => { I.keys = {}; });

      canvas.addEventListener('mousedown', () => {
        if (!I.locked && NS.game.playing()) canvas.requestPointerLock();
        else if (!NS.game.playing()) NS.game.interact();
      });
      document.addEventListener('pointerlockchange', () => {
        I.locked = document.pointerLockElement === canvas;
        if (!I.locked && NS.game.playing() && !NS.game.paused) NS.game.togglePause(true);
      });
      document.addEventListener('mousemove', (e) => {
        if (!I.locked) return;
        const s = (NS.settings.sens / 100) * 0.0022;
        P.yaw -= e.movementX * s;
        P.pitch = U.clamp(P.pitch - e.movementY * s, -1.35, 1.35);
      });

      /* keyboard axis (digital) is smoothed by the player's acceleration */
      setInterval(() => {
        const k = I.keys;
        I.axis.y = (k.w || k.arrowup ? 1 : 0) - (k.s || k.arrowdown ? 1 : 0);
        I.axis.x = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0);
      }, 16);

      /* touch: left stick moves, right half looks, buttons act */
      const stick = document.getElementById('stick'), nub = document.getElementById('stick-nub');
      const touch = I.touch;
      if ('ontouchstart' in window) {
        document.getElementById('touch').classList.add('on');
        document.body.classList.add('touch');
        let sid = null;
        stick.addEventListener('touchstart', (e) => {
          const t = e.changedTouches[0]; sid = t.identifier; touch.active = true;
          const r = stick.getBoundingClientRect();
          const dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
          nub.style.transform = 'translate(' + dx * 0.5 + 'px,' + dy * 0.5 + 'px)';
          touch.x = U.clamp(dx / 55, -1, 1); touch.y = U.clamp(-dy / 55, -1, 1);
          touch.run = Math.hypot(touch.x, touch.y) > 0.86;
          e.preventDefault();
        }, { passive: false });
        stick.addEventListener('touchmove', (e) => {
          for (const t of e.changedTouches) {
            if (t.identifier !== sid) continue;
            const r = stick.getBoundingClientRect();
            const dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
            nub.style.transform = 'translate(' + dx * 0.5 + 'px,' + dy * 0.5 + 'px)';
            touch.x = U.clamp(dx / 55, -1, 1); touch.y = U.clamp(-dy / 55, -1, 1);
            touch.run = Math.hypot(touch.x, touch.y) > 0.86;
          }
          e.preventDefault();
        }, { passive: false });
        const end = () => { touch.active = false; touch.x = touch.y = 0; touch.run = false; nub.style.transform = ''; sid = null; };
        stick.addEventListener('touchend', end); stick.addEventListener('touchcancel', end);

        const look = document.getElementById('tlook');
        let lx = null, ly = null, lid = null;
        look.addEventListener('touchstart', (e) => {
          const t = e.changedTouches[0]; lid = t.identifier; lx = t.clientX; ly = t.clientY;
        }, { passive: true });
        look.addEventListener('touchmove', (e) => {
          for (const t of e.changedTouches) {
            if (t.identifier !== lid) continue;
            const s = (NS.settings.sens / 100) * 0.0038;
            P.yaw -= (t.clientX - lx) * s;
            P.pitch = U.clamp(P.pitch - (t.clientY - ly) * s, -1.35, 1.35);
            lx = t.clientX; ly = t.clientY;
          }
        }, { passive: true });
        look.addEventListener('touchend', () => { lid = null; });
        document.getElementById('tb-act').addEventListener('click', () => NS.game.interact());
        document.getElementById('tb-hide').addEventListener('click', () => NS.game.interact());
        document.getElementById('tb-torch').addEventListener('click', () => P.toggleTorch());
      }
      // merge touch into the movement axis used by the player
      I.touchAxis = function () { return touch.active ? { x: touch.x, y: touch.y } : null; };
    }
  };

  /* ── HUD ──────────────────────────────────────────────────────────────── */
  const H = NS.hud = {
    el: {},
    init() {
      const ids = ['hud', 'hud-door', 'hp-fill', 'hp-num', 'st-fill', 'st-num', 'prompt', 'hint',
        'cross', 'slot-key', 'slot-pick', 'slot-torch', 'pick-n', 'torch-n', 'title-card',
        'tc-lbl', 'tc-big', 'tc-small'];
      ids.forEach((id) => { H.el[id] = document.getElementById(id); });
    },
    show(on) { H.el.hud.classList.toggle('on', !!on); document.body.classList.toggle('playing', !!on); },
    door(n) { H.el['hud-door'].textContent = n; },
    bars() {
      const hp = Math.max(0, Math.round(NS.player.hp));
      H.el['hp-fill'].style.width = hp + '%';
      H.el['hp-num'].textContent = hp;
      H.el['st-fill'].style.width = Math.round(NS.player.stamina) + '%';
      H.el['st-num'].textContent = NS.player.crouch ? 'crouched' : NS.player.running ? 'running' : '';
    },
    items() {
      const p = NS.player;
      H.el['slot-key'].classList.toggle('has', p.keys > 0);
      H.el['slot-pick'].classList.toggle('has', p.picks > 0);
      H.el['pick-n'].textContent = p.picks > 0 ? '×' + p.picks : '';
      H.el['slot-torch'].classList.toggle('has', p.torchOn);
      H.el['torch-n'].textContent = p.torchOn || p.battery < 100 ? Math.round(p.battery) : '';
      H.el['slot-key'].querySelector('.n').textContent = p.keys > 0 ? '×' + p.keys : '';
    },
    prompt(text) {
      const e = H.el.prompt;
      if (!text) { e.classList.remove('on'); return; }
      // phones have a button, not an E key
      const pre = document.body.classList.contains('touch') ? '' : '[E] ';
      e.textContent = pre + text; e.classList.add('on');
    },
    cross(on) { H.el.cross.classList.toggle('on', !!on); },
    hint(text, secs) {
      const e = H.el.hint;
      e.textContent = text; e.classList.add('on');
      clearTimeout(H._ht);
      H._ht = setTimeout(() => e.classList.remove('on'), (secs || 3) * 1000);
    },
    titleCard(lbl, big, small, secs) {
      H.el['tc-lbl'].textContent = lbl;
      H.el['tc-big'].textContent = big;
      H.el['tc-small'].textContent = small || '';
      H.el['title-card'].classList.add('on');
      clearTimeout(H._tc);
      if (secs !== 0) H._tc = setTimeout(() => H.el['title-card'].classList.remove('on'), (secs || 3.4) * 1000);
    },
    hideTitle() { H.el['title-card'].classList.remove('on'); }
  };

  NS.version = '1.0';
})(window.DOORS);
