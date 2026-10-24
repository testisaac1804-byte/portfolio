/* ============================================================
   LOW TIDE — the harbour after dark
   Vanilla three.js r140. No pointer-lock helper, no audio files:
   every sound is synthesised, which is why the game is 700 KB.
   ============================================================ */
(function () {
'use strict';
const T = THREE;
const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const shortAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

/* ------------------------------------------------------------ state */
const LT = window.LT = {
  ready: false,
  phase: 'menu',            // menu | playing | paused | dead | won
  deckZ: 1.6,
  player: { x: 0, y: 1.6, z: -2.4, yaw: 0, pitch: 0, crouch: false, eye: 1.68, phase: 0, speed: 0 },
  battery: 100,
  torchOn: false,
  cranking: false,
  noise: 0,
  breakers: { A: false, B: false, C: false },
  hunter: { x: 4.6, z: -45, y: 0, heading: 0, mode: 'water', target: null, fixAge: 99, wander: 0, speed: 0 },
  deaths: 0,
  elapsed: 0,
  caught: false,
  anchors: null,
};

let rects = [], solids = [], breakerDefs = [];

/* ------------------------------------------------------------ audio */
const A = {
  ctx: null, master: null, muted: false, started: false,
  init() {
    if (this.ctx) return;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = this.ctx = new C();
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(ctx.destination);

    // one 2 s noise buffer, reused by wind, water, steps and breath
    const n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;      // brownish
      d[i] = last * 3.2;
    }
    this.noiseBuf = buf;

    const loop = (filterType, freq, q, gain) => {
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = filterType; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain(); g.gain.value = gain;
      src.connect(f).connect(g).connect(this.master);
      src.start();
      return { g, f };
    };
    this.wind = loop('lowpass', 260, 0.6, 0.16);
    this.water = loop('bandpass', 640, 0.8, 0.09);
    // slow gusts
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.055; lg.gain.value = 0.075;
    lfo.connect(lg).connect(this.wind.g.gain); lfo.start();
    const lfo2 = ctx.createOscillator(), lg2 = ctx.createGain();
    lfo2.frequency.value = 0.13; lg2.gain.value = 0.035;
    lfo2.connect(lg2).connect(this.water.g.gain); lfo2.start();

    // continuous breath bed, gain driven by proximity
    this.breathSrc = ctx.createBufferSource();
    this.breathSrc.buffer = buf; this.breathSrc.loop = true;
    const bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 420; bf.Q.value = 1.4;
    this.breathGain = ctx.createGain(); this.breathGain.gain.value = 0;
    this.breathSrc.connect(bf).connect(this.breathGain).connect(this.master);
    this.breathSrc.start();

    this.started = true;
  },
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  to(level) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.breathGain.gain.setTargetAtTime(level, t, 0.4);
  },
  burst(dur, type, freq, q, gain, pan) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    src.playbackRate.value = 0.7 + Math.random() * 0.6;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = src.connect(f).connect(g);
    if (pan !== undefined && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner(); p.pan.value = clamp(pan, -1, 1);
      node = g.connect(p); node = p;
    }
    node.connect(this.master);
    src.start(t); src.stop(t + dur + 0.05);
  },
  tone(freq, dur, gain, type = 'sine', slide = 0, pan) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o.connect(g);
    if (pan !== undefined && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner(); p.pan.value = clamp(pan, -1, 1);
      node = g.connect(p); node = p;
    }
    node.connect(this.master);
    o.start(t); o.stop(t + dur + 0.05);
  },
  step(loud) {
    this.burst(0.09, 'bandpass', 1150 + Math.random() * 300, 1.1, 0.10 * loud);
    this.tone(88 + Math.random() * 16, 0.12, 0.07 * loud, 'sine', 0.6);
  },
  hunterStep(pan, vol) {
    this.tone(52, 0.34, 0.22 * vol, 'sine', 0.55, pan);
    this.burst(0.22, 'lowpass', 260, 0.7, 0.16 * vol, pan);
  },
  crankTick() {
    this.burst(0.03, 'bandpass', 2400, 4, 0.10);
    this.tone(420, 0.03, 0.05, 'square');
  },
  clunk() {
    this.tone(70, 0.5, 0.4, 'sine', 0.45);
    this.burst(0.35, 'lowpass', 520, 0.7, 0.3);
    this.tone(190, 0.14, 0.16, 'square', 0.4);
  },
  horn() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    [98, 99.6, 147].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.13 / (i + 1), t + 0.55);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.1);
      o.connect(lp).connect(g).connect(this.master);
      o.start(t); o.stop(t + 3.2);
    });
  },
  death() {
    this.tone(46, 1.9, 0.5, 'sine', 0.4);
    this.burst(1.2, 'lowpass', 340, 0.6, 0.34);
    this.tone(1220, 0.9, 0.05, 'sine', 0.25);
  },
};

/* ------------------------------------------------------------ renderer */
const stage = $('#stage');
/* ?low=1 forces the cheap path; otherwise quality adapts if frames are slow */
const FORCE_LOW = /[?&]low=1/.test(location.search);
const FORCE_HIGH = /[?&]high=1/.test(location.search); // pinned quality: no adaptive fallback
const renderer = new T.WebGLRenderer({ antialias: !FORCE_LOW, powerPreference: 'high-performance' });
renderer.setPixelRatio(FORCE_LOW ? 1 : Math.min(devicePixelRatio || 1, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = T.sRGBEncoding;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.shadowMap.enabled = !FORCE_LOW;
renderer.shadowMap.type = T.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene = new T.Scene();
const FOG = 0x0a1117;
scene.fog = new T.FogExp2(FOG, 0.047);
scene.background = new T.Color(FOG);

const camera = new T.PerspectiveCamera(68, innerWidth / innerHeight, 0.05, 320);
camera.rotation.order = 'YXZ';

scene.add(new T.HemisphereLight(0x2c3d50, 0x05070a, 0.16));
const ambient = new T.AmbientLight(0x16202c, 0.34);
scene.add(ambient);
const moon = new T.DirectionalLight(0x9dc0e8, 0.17);
moon.position.set(18, 30, 12);
scene.add(moon);

/* torch — the only real light you own */
const torch = new T.SpotLight(0xffeccb, 0, 34, 0.44, 0.5, 1.55);
torch.castShadow = true;
torch.shadow.mapSize.set(1024, 1024);
torch.shadow.camera.near = 0.4;
torch.shadow.camera.far = 28;
torch.shadow.bias = -0.0016;
torch.position.set(0, -0.06, 0.1);
camera.add(torch);
scene.add(camera);
const torchTarget = new T.Object3D();
torchTarget.position.set(0, -0.02, -1);
camera.add(torchTarget);
torch.target = torchTarget;

/* a hand's-width of spill so your own feet are never pure black */
const torchFill = new T.PointLight(0xffe6c0, 0.55, 6.5, 1.8);
torchFill.position.set(0, -0.15, 0);
camera.add(torchFill);

/* lamp + beam, dark until the third breaker */
const lampLight = new T.PointLight(0xffd9a0, 0, 46, 1.5);
lampLight.position.set(0, 10.5, -52.2);
scene.add(lampLight);
const beam = new T.SpotLight(0xffe0b0, 0, 110, 0.12, 0.4, 1.0);
beam.position.set(0, 10.4, -52.2);
scene.add(beam);
const beamTarget = new T.Object3D();
beamTarget.position.set(0, -14, -96);
scene.add(beamTarget);
beam.target = beamTarget;

/* drifting mist motes */
(function motes() {
  const N = 220, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = Math.random() * 4 - 1;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 26;
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(pos, 3));
  /* a soft round sprite — square Points read as digital snow */
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const c2 = cv.getContext('2d');
  const grd = c2.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,0.85)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.22)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  c2.fillStyle = grd;
  c2.fillRect(0, 0, 64, 64);
  const tex = new T.CanvasTexture(cv);
  const m = new T.PointsMaterial({
    color: 0xaec4d6, size: 0.11, map: tex, transparent: true, opacity: 0.34,
    depthWrite: false, sizeAttenuation: true, fog: true,
  });
  const pts = new T.Points(g, m);
  pts.frustumCulled = false;
  scene.add(pts);
  LT._motes = pts;
})();

/* ------------------------------------------------------------ geometry */
let nodes = {}, lampMats = [], breakerMats = {}, hunterRig = null, limbs = {};

const loader = new T.GLTFLoader();

/* Blender exports one primitive per material, so a single modelled object
   arrives as LampHead_1, LampHead_2, Breaker_A_1 … . Everything downstream
   must match on the stem, never on an exact name. */
const stem = (n) => String(n).replace(/_\d+$/, '');

loader.load('assets/pier.glb', (gltf) => {
  const root = gltf.scene;
  scene.add(root);

  const meshes = [];
  root.traverse((o) => { if (o.isMesh) meshes.push(o); });
  meshes.forEach((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => { if (m && m.emissive) m.emissiveIntensity = Math.min(m.emissiveIntensity || 1, 1); });
    /* the sea is a 240 m plane: never let it into the shadow pass */
    if (mats.some((m) => m && /water/i.test(m.name))) o.castShadow = false;
    nodes[o.name] = nodes[o.name] || [];
    nodes[o.name].push(o);
  });

  const byStem = (p) => meshes.filter((o) => stem(o.name).startsWith(p));

  /* The boathouse window and the pier bulbs are emissive in the .blend with a white
     emissive colour, which at night renders as flat paper cut-outs — a pure white
     rectangle on the wall. Warm them and pull them down so they read as lit glass. */
  meshes.forEach((o) => {
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => {
      if (!m || !m.emissive) return;
      const n = m.name || '';
      if (/window_glass/i.test(n)) { m.emissive.setHex(0xffb877); m.emissiveIntensity = 0.5; }
      else if (/^bulb$/i.test(n)) { m.emissive.setHex(0xffc07a); m.emissiveIntensity = 0.85; }
      /* NOTE: the creature looked like grey plastic for a while. It is not the material
         (it is #08090a): it was standing inside a bulb's 9.5 m point-light radius, which
         blows any surface out. Pick the shot away from the pier bulbs instead of
         "fixing" the material. */
    });
  });

  /* own material instances for anything that has to light up */
  function ownEmissive(objs, hex, intensity, bucket) {
    objs.forEach((o) => {
      const mats = (Array.isArray(o.material) ? o.material : [o.material]).map((mm) => {
        const c = mm.clone();
        if (mm.name && /lamp_off/i.test(mm.name)) {
          c.emissive = new T.Color(hex);
          c.emissiveIntensity = intensity;
          bucket.push(c);
        }
        return c;
      });
      o.material = mats.length === 1 ? mats[0] : mats;
    });
  }
  ownEmissive(byStem('LampHead'), 0xffcf8a, 0.0, lampMats);
  ['A', 'B', 'C'].forEach((id) => {
    breakerMats[id] = [];
    ownEmissive(byStem('Breaker_' + id), 0xffa040, 0.05, breakerMats[id]);
  });

  /* the hunter is modelled as separate parts around a joint; the exporter
     dropped the empty that grouped them, so regroup here. Local offsets are
     preserved, which means the pivot stays at the creature's feet. */
  hunterRig = new T.Group();
  hunterRig.name = 'HunterRig';
  scene.add(hunterRig);
  byStem('Hunter_').forEach((o) => hunterRig.add(o));
  limbs = {
    armL: byStem('Hunter_ArmL')[0], armR: byStem('Hunter_ArmR')[0],
    legL: byStem('Hunter_LegL')[0], legR: byStem('Hunter_LegR')[0],
    head: byStem('Hunter_Head')[0], torso: byStem('Hunter_Torso')[0],
  };
  hunterRig.visible = false;

  fetchAnchors();
}, undefined, (e) => {
  console.error('pier.glb failed', e);
  document.body.insertAdjacentHTML('beforeend',
    '<div style="position:fixed;inset:0;display:grid;place-items:center;color:#cf5a44;font:12px monospace;background:#070b0f">pier.glb failed to load</div>');
});

function fetchAnchors() {
  fetch('assets/pier.json').then((r) => r.json()).then((a) => {
    LT.anchors = a;
    LT.deckZ = a.deck_z;
    rects = [
      { x0: a.bounds.deck.x0, x1: a.bounds.deck.x1, z0: -a.bounds.deck.y1, z1: -a.bounds.deck.y0 },
      { x0: a.bounds.head.x0, x1: a.bounds.head.x1, z0: -a.bounds.head.y1, z1: -a.bounds.head.y0 },
    ];
    solids = a.colliders;
    breakerDefs = a.breakers;
    // warm bulbs along the pier — the only landmarks in the fog
    a.bulbs.forEach((b) => {
      const l = new T.PointLight(0xffb46a, 1.55, 9.5, 1.9);
      l.position.set(b[0], b[1], b[2]);
      scene.add(l);
    });
    makeBeacon(a);
    placePlayer(a.player_start);
    const h = a.hunter_spawn;
    LT.hunter.x = h[0]; LT.hunter.z = h[2]; LT.hunter.y = 0;
    LT.hunter.heading = Math.PI;
    LT.ready = true;
    renderer.compile(scene, camera);
  }).catch((e) => console.error('anchors', e));
}

/* ------------------------------------------------------------ beacon
   Fog is a shader trick, not air: a spotlight lights surfaces, never the space
   between you and them. So the beam is a real (unlit) cone that sweeps. */
let beacon = null, beamSpin = null;
const coneMats = [];   // [haze, core] — kept in sync with BEAMS below
// additive over a near-black sky goes white fast, so these stay LOW: the cone is
// only there to suggest volume. Hard silhouettes at 0.4+ read as paper cut-outs.
// One shaft, not two: a short wide "haze" cone seen near-axis projects as a grey ring
// around the lamp, which reads as a smoke ring rather than light.
const BEAMS = [
  { r: 2.0, len: 78, op: 0.42, pow: 2.4 },
];
function beamTexture() {
  // canvas TOP is v=1 = the far end of the cone (CanvasTexture flips Y), so the
  // gradient runs transparent-at-distance → bright-at-the-lamp.
  const c = document.createElement('canvas');
  c.width = 16; c.height = 256;
  const g2 = c.getContext('2d');
  const gr = g2.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0.00, 'rgba(255,214,160,0)');
  gr.addColorStop(0.30, 'rgba(255,222,175,0.09)');
  gr.addColorStop(0.66, 'rgba(255,234,196,0.30)');
  gr.addColorStop(0.90, 'rgba(255,244,220,0.66)');
  gr.addColorStop(1.00, 'rgba(255,250,236,0.82)');
  g2.fillStyle = gr; g2.fillRect(0, 0, 16, 256);
  const t = new T.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}
function makeBeacon(a) {
  const mast = a.mast || [0, LT.deckZ + 9.2, -52.2];
  beacon = new T.Group();
  beacon.position.set(mast[0], mast[1], mast[2]);
  // a fixed downward rake, then a spinner inside it: rotating a level beam in Y alone
  // passes through dead-astern, where it projects as a flat disc instead of a shaft
  beacon.rotation.x = -0.15;
  beamSpin = new T.Group();
  beacon.add(beamSpin);
  const tex = beamTexture();
  BEAMS.forEach((B) => {
    const geo = new T.CylinderGeometry(0.12, B.r, B.len, 24, 1, true);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, -B.len / 2);
    // A plain cone gives a hard silhouette edge — the giveaway that the beam is
    // cardboard. Fade alpha by the angle between the surface normal and the eye so
    // the rim dissolves and the body reads as volume.
    const m = new T.ShaderMaterial({
      uniforms: {
        map: { value: tex },
        tint: { value: new T.Color(0xffdba8) },
        opacity: { value: 0 },
        power: { value: B.pow },
      },
      vertexShader: `
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main() {
          vUv = uv;
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D map; uniform vec3 tint; uniform float opacity; uniform float power;
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main() {
          float len = texture2D(map, vUv).a;
          float facing = abs(dot(normalize(vN), normalize(vV)));
          float a = len * pow(facing, power) * opacity;
          gl_FragColor = vec4(tint * a, 1.0);
        }`,
      transparent: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
      side: T.DoubleSide,
    });
    m.userData.op = B.op;
    coneMats.push(m);
    beamSpin.add(new T.Mesh(geo, m));
  });
  scene.add(beacon);
}

/* ------------------------------------------------------------ collision */
function inWalk(x, z, r) {
  for (let i = 0; i < rects.length; i++) {
    const b = rects[i];
    if (x > b.x0 + r && x < b.x1 - r && z > b.z0 + r && z < b.z1 - r) return true;
  }
  return false;
}
function inSolid(x, z, r) {
  for (let i = 0; i < solids.length; i++) {
    const s = solids[i];
    if (x > s.x0 - r && x < s.x1 + r && z > s.z0 - r && z < s.z1 + r) return true;
  }
  return false;
}
const canStand = (x, z, r) => inWalk(x, z, r) && !inSolid(x, z, r);

/* ------------------------------------------------------------ player */
function placePlayer(p) {
  const P = LT.player;
  P.x = p[0]; P.z = p[2];
  P.y = P.crouch ? 1.06 : 1.68;
  P.yaw = 0; P.pitch = 0; P.phase = 0; P.speed = 0;
  camera.position.set(P.x, LT.deckZ + P.y, P.z);
}

const keys = Object.create(null);
addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  keys[e.code] = true;
  if (e.code === 'KeyM') { A.muted = !A.muted; if (A.master) A.master.gain.value = A.muted ? 0 : 0.9; }
  if (e.code === 'KeyF' && LT.phase === 'playing') toggleTorch();
  if (e.code === 'Escape' && LT.phase === 'playing') pause();
});
addEventListener('keyup', (e) => { keys[e.code] = false; });

function toggleTorch() {
  if (LT.battery <= 0.5) { A.burst(0.06, 'bandpass', 900, 3, 0.06); return; }
  LT.torchOn = !LT.torchOn;
  A.tone(1500, 0.03, 0.05, 'square');
}

/* pointer lock */
function lock() {
  try { const r = renderer.domElement.requestPointerLock(); if (r && r.catch) r.catch(() => {}); }
  catch (e) { /* headless / unsupported */ }
}
stage.addEventListener('click', () => {
  if (LT.phase === 'playing' && document.pointerLockElement !== renderer.domElement) {
    renderer.domElement.requestPointerLock();
  }
});
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== renderer.domElement || LT.phase !== 'playing') return;
  look(-e.movementX * 0.0021, -e.movementY * 0.0021);
});
document.addEventListener('pointerlockchange', () => {
  if (!document.pointerLockElement && LT.phase === 'playing') pause();
});
function look(dyaw, dpitch) {
  const P = LT.player;
  P.yaw += dyaw;
  P.pitch = clamp(P.pitch + dpitch, -1.32, 1.32);
}

/* ------------------------------------------------------------ touch */
const touch = { on: ('ontouchstart' in window) && matchMedia('(pointer:coarse)').matches, mx: 0, mz: 0 };
if (touch.on) $('#touch').classList.add('on');
(function bindTouch() {
  const stick = $('#stick'), knob = stick.querySelector('i');
  let sid = null, sx = 0, sy = 0;
  const startS = (e) => {
    sid = e.pointerId; sx = e.clientX; sy = e.clientY; stick.setPointerCapture(sid);
  };
  const moveS = (e) => {
    if (e.pointerId !== sid) return;
    const dx = clamp((e.clientX - sx) / 44, -1, 1), dy = clamp((e.clientY - sy) / 44, -1, 1);
    touch.mx = dx; touch.mz = dy;
    knob.style.transform = `translate(${dx * 28}px,${dy * 28}px)`;
  };
  const endS = () => { sid = null; touch.mx = 0; touch.mz = 0; knob.style.transform = ''; };
  stick.addEventListener('pointerdown', startS);
  stick.addEventListener('pointermove', moveS);
  stick.addEventListener('pointerup', endS);
  stick.addEventListener('pointercancel', endS);

  let lid = null, lx = 0, ly = 0;
  renderer.domElement.addEventListener('pointerdown', (e) => {
    lid = e.pointerId; lx = e.clientX; ly = e.clientY;
  });
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (e.pointerId !== lid) return;
    look(-(e.clientX - lx) * 0.0045, -(e.clientY - ly) * 0.0045);
    lx = e.clientX; ly = e.clientY;
  });
  renderer.domElement.addEventListener('pointerup', () => { lid = null; });

  const hold = (id, on, off) => {
    const el = $(id);
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); on(); });
    el.addEventListener('pointerup', (e) => { e.preventDefault(); if (off) off(); });
    el.addEventListener('pointercancel', () => { if (off) off(); });
  };
  hold('#t_torch', () => { if (LT.phase === 'playing') toggleTorch(); });
  hold('#t_crank', () => { keys.KeyR = true; }, () => { keys.KeyR = false; });
  hold('#t_use', () => { keys.KeyE = true; }, () => { keys.KeyE = false; });
})();

/* ------------------------------------------------------------ noise */
let noiseImpulse = 0;
function addNoise(amount) { noiseImpulse = Math.max(noiseImpulse, amount); }

function updateNoise(dt) {
  const P = LT.player;
  let want = 0;
  if (LT.cranking) want = 0.52;
  else if (P.speed > 0.2) want = P.crouch ? 0.10 : (P.speed > 3.4 ? 0.92 : 0.36);
  LT.noise = clamp(lerp(LT.noise, want, 1 - Math.pow(0.0016, dt)), noiseImpulse, 1);
  if (noiseImpulse > 0) {
    LT.noise = Math.max(LT.noise, noiseImpulse);
    noiseImpulse = Math.max(0, noiseImpulse - dt * 1.5);
  }
  const pips = document.querySelectorAll('#noise .pip');
  const lvl = Math.round(LT.noise * pips.length);
  pips.forEach((p, i) => {
    p.className = 'pip' + (i < lvl ? (LT.noise > 0.7 ? ' hot on' : ' on') : '');
  });
}

/* ------------------------------------------------------------ hunter */
const HUNT = {
  hear: 28, fix: 0.135, catch: 1.15,
  speed: { water: 0.72, hunt: 2.12, search: 1.16, idle: 0.44 },
};

function hunterFootstepAudio(dist) {
  const P = LT.player, H = LT.hunter;
  const dx = H.x - P.x, dz = H.z - P.z;
  // bearing relative to the camera: +1 = right
  const rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw);
  const pan = clamp((dx * rx + dz * rz) / Math.max(1, Math.hypot(dx, dz)), -1, 1);
  A.hunterStep(pan, clamp(1 - dist / 22, 0.05, 1));
}

function updateHunter(dt) {
  const P = LT.player, H = LT.hunter;
  const dx = P.x - H.x, dz = P.z - H.z;
  const dist = Math.hypot(dx, dz) || 0.001;

  /* --- hearing: only the noise matters, never the torch */
  const loud = LT.noise * Math.max(0, 1 - dist / HUNT.hear);
  if (loud > HUNT.fix) {
    const err = 0.9 + dist * 0.10;
    H.target = { x: P.x + (Math.random() - 0.5) * err, z: P.z + (Math.random() - 0.5) * err };
    H.fixAge = 0;
    H.mode = 'hunt';
  } else {
    H.fixAge += dt;
    if (H.mode === 'hunt' && H.fixAge > 3.2) H.mode = 'search';
  }

  /* --- dormant in the water until something wakes it */
  if (H.mode === 'water') {
    H.target = { x: 1.1, z: -49.2 };
    if (Math.hypot(H.x - H.target.x, H.z - H.target.z) < 0.7) H.mode = 'idle';
    else if (LT.elapsed > 20 && loud > 0.05) H.mode = 'search';
  }

  if (H.mode === 'idle') {
    H.wander -= dt;
    if (!H.target || H.wander <= 0) {
      H.target = { x: (Math.random() - 0.5) * 3.4, z: -6 - Math.random() * 42 };
      H.wander = 5 + Math.random() * 5;
    }
  }
  if (H.mode === 'search' && (!H.target || H.fixAge > 7)) {
    H.mode = 'idle';
  }

  /* --- move */
  let sp = HUNT.speed[H.mode] || 0.4;
  if (H.mode === 'hunt' && dist < 6) sp *= 1.25;
  H.speed = sp;
  if (H.target) {
    const tx = H.target.x - H.x, tz = H.target.z - H.z;
    const d = Math.hypot(tx, tz);
    if (d > 0.12) {
      const nx = H.x + (tx / d) * sp * dt;
      const nz = H.z + (tz / d) * sp * dt;
      // it can walk on water, but not through a wall
      if (!inSolid(nx, H.z, 0.34)) H.x = nx;
      if (!inSolid(H.x, nz, 0.34)) H.z = nz;
      H.heading = Math.atan2(tx, tz);
    }
    if (H.mode === 'hunt' && d < 0.9) H.mode = 'search';
  }

  /* --- height: pier deck or the water */
  const wantY = inWalk(H.x, H.z, 0.1) ? LT.deckZ : 0;
  H.y = lerp(H.y, wantY, 1 - Math.pow(0.02, dt));

  /* --- pose */
  if (hunterRig) {
    hunterRig.visible = true;
    hunterRig.position.set(H.x, H.y, H.z);
    hunterRig.rotation.y = H.heading;
    const t = performance.now() / 1000;
    const gait = sp > 0.2 ? Math.sin(t * sp * 3.4) : 0;
    if (limbs.armL) limbs.armL.rotation.x = gait * 0.42;
    if (limbs.armR) limbs.armR.rotation.x = -gait * 0.42;
    if (limbs.legL) limbs.legL.rotation.x = -gait * 0.34;
    if (limbs.legR) limbs.legR.rotation.x = gait * 0.34;
    if (limbs.torso) limbs.torso.rotation.z = Math.sin(t * 0.7) * 0.035;
    if (limbs.head) limbs.head.rotation.x = -0.12 + Math.sin(t * 0.5) * 0.05;
  }

  /* --- tells: breath, steps, torch flicker */
  const prox = clamp(1 - dist / 16, 0, 1);
  A.to(prox * prox * 0.22);
  H._stepT = (H._stepT || 0) + dt * sp * 0.75;
  if (H._stepT > 1) { H._stepT = 0; if (dist < 30) hunterFootstepAudio(dist); }

  /* --- caught */
  if (dist < HUNT.catch && !LT.caught) die();
  return dist;
}

/* ------------------------------------------------------------ interactions */
let heldT = 0, holdTarget = null;

function nearestBreaker() {
  const P = LT.player;
  let best = null, bd = 99;
  breakerDefs.forEach((b) => {
    if (LT.breakers[b.id]) return;
    const d = Math.hypot(b.pos[0] - P.x, b.pos[2] - P.z);
    if (d < 2.15 && d < bd) { bd = d; best = b; }
  });
  return best;
}

const HOLD_T = 2.6;

function throwBreaker(b) {
  LT.breakers[b.id] = true;
  addNoise(1.0);
  A.clunk();
  const mats = breakerMats[b.id] || [];
  mats.forEach((m) => { m.emissive.setHex(0xffa040); m.emissiveIntensity = 1.6; });
  const row = document.querySelector(`#objectives .row[data-b="${b.id}"]`);
  if (row) row.classList.add('done');
  if (b.id === 'C') win();
}

function updateInteraction(dt) {
  const b = nearestBreaker();
  const hint = $('#hint');
  const ring = hint.querySelector('.ring i');
  if (!b) {
    hint.classList.remove('on');
    heldT = 0; holdTarget = null;
    return;
  }
  hint.classList.add('on');
  if (holdTarget !== b.id) { holdTarget = b.id; heldT = 0; }
  if (keys.KeyE) {
    heldT += dt;
    if (Math.random() < dt * 6) A.burst(0.05, 'bandpass', 700, 2, 0.04);
  } else {
    heldT = Math.max(0, heldT - dt * 2.2);
  }
  ring.style.width = clamp((heldT / HOLD_T) * 100, 0, 100) + '%';
  if (heldT >= HOLD_T) { heldT = 0; throwBreaker(b); }
}

/* ------------------------------------------------------------ torch loop */
let crankAcc = 0, flick = 0;

function updateTorch(dt, hunterDist) {
  const P = LT.player;
  LT.cranking = !!keys.KeyR && LT.phase === 'playing';
  if (LT.cranking) {
    const before = LT.battery;
    LT.battery = clamp(LT.battery + 11.5 * dt, 0, 100);
    crankAcc += dt;
    if (crankAcc > 0.105) {
      crankAcc = 0;
      A.crankTick();
      addNoise(0.52);
      P.camRoll = (P.camRoll || 0) + 0.012;
    }
    if (before < 100 && LT.battery >= 100) A.tone(880, 0.08, 0.05, 'sine');
  }
  if (LT.torchOn) {
    LT.battery = clamp(LT.battery - 3.35 * dt, 0, 100);
    if (LT.battery <= 0) { LT.torchOn = false; A.tone(120, 0.3, 0.08, 'sawtooth', 0.4); }
  }

  const low = LT.battery < 18;
  let intensity = LT.torchOn ? (low ? 1.3 : 2.2) : 0;
  // the tell: it is close, and the filament knows
  if (hunterDist < 11) {
    flick += dt * (6 + (11 - hunterDist) * 2.2);
    const n = Math.sin(flick) * Math.sin(flick * 2.7 + 1.3);
    intensity *= 0.42 + 0.58 * Math.abs(n);
  } else if (low) {
    flick += dt * 11;
    intensity *= 0.6 + 0.4 * Math.abs(Math.sin(flick * 2.1));
  }
  torch.intensity = lerp(torch.intensity, intensity, 1 - Math.pow(0.001, dt));
  torchFill.intensity = 0.3 + torch.intensity * 0.075;
  torch.visible = torch.intensity > 0.02;

  const t = $('#torch');
  t.classList.toggle('low', low && LT.battery > 0);
  t.classList.toggle('dead', LT.battery <= 0);
  t.querySelector('.fill').style.width = LT.battery.toFixed(0) + '%';
  $('#torchhint').textContent = LT.battery <= 0
    ? 'dead — hold R to crank it back'
    : (LT.cranking ? 'cranking…' : (LT.torchOn ? 'lit · F to darken' : 'R to crank · F to light'));
}

/* ------------------------------------------------------------ camera */
function updateCamera(dt) {
  const P = LT.player;
  const eyeWant = P.crouch ? 1.06 : 1.68;
  P.y = lerp(P.y, eyeWant, 1 - Math.pow(0.0005, dt));
  const bob = P.speed > 0.4 ? Math.sin(P.phase * 2) * 0.017 * Math.min(1, P.speed / 2.2) : 0;
  P.camRoll = (P.camRoll || 0) * Math.pow(0.02, dt);
  camera.position.set(P.x, LT.deckZ + P.y + bob, P.z);
  camera.rotation.set(P.pitch, P.yaw, Math.sin(P.phase) * 0.006 + P.camRoll, 'YXZ');
}

/* ------------------------------------------------------------ input + move */
function updateMove(dt) {
  const P = LT.player;
  P.crouch = !!(keys.ControlLeft || keys.ControlRight || keys.KeyC);
  P.cranking = !!keys.KeyR;
  let ix = 0, iz = 0;
  if (keys.KeyW || keys.ArrowUp) iz -= 1;
  if (keys.KeyS || keys.ArrowDown) iz += 1;
  if (keys.KeyA || keys.ArrowLeft) ix -= 1;
  if (keys.KeyD || keys.ArrowRight) ix += 1;
  if (touch.mx || touch.mz) { ix += touch.mx; iz += touch.mz; }
  const mag = Math.hypot(ix, iz);
  if (mag > 1) { ix /= mag; iz /= mag; }
  // cranking pins you in place — that is the cost of light
  if (LT.cranking) { ix = 0; iz = 0; }

  const sprint = (keys.ShiftLeft || keys.ShiftRight) && !P.crouch;
  const base = P.crouch ? 1.22 : (sprint ? 4.25 : 2.55);
  const target = Math.hypot(ix, iz) * base;

  const fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw);
  const rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw);
  const vx = (fx * -iz + rx * ix);
  const vz = (fz * -iz + rz * ix);

  if (target > 0.01) {
    const step = base * dt;
    const nx = P.x + vx * step, nz = P.z + vz * step;
    if (canStand(nx, P.z, 0.30)) P.x = nx;
    if (canStand(P.x, nz, 0.30)) P.z = nz;
    P.phase += dt * (sprint ? 11 : P.crouch ? 5.4 : 7.6);
    P.speed = lerp(P.speed, base, 0.25);
    if (Math.sin(P.phase) < -0.985 && !P._steped) {
      P._steped = true;
      A.step(P.crouch ? 0.35 : sprint ? 1 : 0.68);
    }
    if (Math.sin(P.phase) > 0) P._steped = false;
  } else {
    P.speed = lerp(P.speed, 0, 0.3);
  }
  P.sprinting = sprint;
}

/* ------------------------------------------------------------ flow */
let rafId = null, lastT = 0, winT = 0, lampOn = false, cardShown = false;

function start() {
  A.init(); A.resume();
  LT.phase = 'playing';
  LT.elapsed = 0;
  LT.noise = 0;
  $('#menu').classList.remove('on');
  $('#won').classList.remove('on');
  cardShown = false;
  $('#dead').classList.remove('on');
  $('#hud').classList.add('on');
  P_reset();
  lock();
}

function P_reset() {
  const a = LT.anchors || { player_start: [0, 1.6, -2.4] };
  LT.breakers = { A: false, B: false, C: false };
  document.querySelectorAll('#objectives .row').forEach((r) => r.classList.remove('done'));
  Object.keys(breakerMats).forEach((k) => breakerMats[k].forEach((m) => {
    m.emissive.setHex(0xffa040); m.emissiveIntensity = 0.05;
  }));
  LT.battery = 100;
  LT.torchOn = false;
  placePlayer(a.player_start);
  const h = LT.anchors.hunter_spawn;
  const H = LT.hunter;
  H.x = h[0]; H.z = h[2]; H.y = 0; H.mode = 'water';
  H.target = null; H.fixAge = 99; H.wander = 0;
  LT.caught = false;
  lampOn = false;
  lampLight.intensity = 0;
  beam.intensity = 0;
  lampMats.forEach((m) => { m.emissiveIntensity = 0; });
}

function respawn() {
  const keep = Object.assign({}, LT.breakers);
  const deaths = LT.deaths;
  $('#dead').classList.remove('on');
  LT.phase = 'playing';
  P_reset();                       // full reset, then restore what still stands
  LT.deaths = deaths;
  Object.keys(keep).forEach((k) => {
    if (!keep[k]) return;
    LT.breakers[k] = true;
    const row = document.querySelector(`#objectives .row[data-b="${k}"]`);
    if (row) row.classList.add('done');
    (breakerMats[k] || []).forEach((m) => {
      m.emissive.setHex(0xffa040); m.emissiveIntensity = 1.6;
    });
  });
  lock();
}

function pause() {
  if (LT.phase !== 'playing') return;
  LT.phase = 'paused';
  $('#paused').classList.add('on');
  if (document.pointerLockElement) document.exitPointerLock();
  A.to(0);
}
function unpause() {
  LT.phase = 'playing';
  $('#paused').classList.remove('on');
  A.resume();
  lock();
}

function die() {
  LT.caught = true;
  LT.phase = 'dead';
  LT.deaths += 1;
  A.death();
  A.to(0);
  if (document.pointerLockElement) document.exitPointerLock();
  const n = Object.values(LT.breakers).filter(Boolean).length;
  $('#d_breakers').textContent = n + ' / 3';
  $('#d_deaths').textContent = LT.deaths;
  $('#d_eyebrow').textContent = clockStr(LT.elapsed);
  setTimeout(() => {
    if (LT.phase === 'dead') $('#dead').classList.add('on');
  }, 900);
}

function win() {
  LT.phase = 'won';
  lampOn = true;
  const hint = $('#hint'); if (hint) hint.classList.remove('on');
  winT = 0;
  A.horn();
  if (document.pointerLockElement) document.exitPointerLock();
  const n = Object.values(LT.breakers).filter(Boolean).length;
  $('#w_time').textContent = clockStr(LT.elapsed);
  $('#w_eyebrow').textContent = clockStr(LT.elapsed);
  $('#w_deaths').textContent = LT.deaths;
  $('#w_breakers').textContent = n + ' / 3';
  // the card is gated on GAME time in the frame loop (winT), not wall-clock:
  // at 5 fps a 3.2 s timeout lands before the beam has even crossed the sky.
}

function clockStr(t) {
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

/* ------------------------------------------------------------ loop */
/* if the machine cannot hold ~26 fps, drop the shadow pass rather than the game */
let fpsAvg = 60, fpsT = 0, fpsN = 0, checkedPerf = FORCE_LOW || FORCE_HIGH;
LT.quality = FORCE_LOW ? 'low' : 'high';
function applyLow() {
  LT.quality = 'low';
  renderer.shadowMap.enabled = false;
  torch.castShadow = false;
  renderer.setPixelRatio(1);
  renderer.setSize(innerWidth, innerHeight);
}
function watchPerf(dt) {
  if (checkedPerf) return;
  fpsT += dt; fpsN++;
  if (fpsT < 2.5) return;
  fpsAvg = fpsN / fpsT;
  checkedPerf = true;
  if (fpsAvg < 26) applyLow();
}

function frame(now) {
  rafId = requestAnimationFrame(frame);
  const t = now / 1000;
  const raw = lastT ? t - lastT : 0.016;
  let dt = Math.min(raw, 0.05);
  lastT = t;
  watchPerf(raw);
  if (!LT.ready) { renderer.render(scene, camera); return; }

  if (LT.phase === 'playing') {
    LT.elapsed += dt;
    updateMove(dt);
    updateInteraction(dt);
    updateNoise(dt);
    const dist = updateHunter(dt);
    updateTorch(dt, dist);
    updateCamera(dt);
    $('#clock').textContent = clockStr(LT.elapsed);
  } else if (LT.phase === 'won') {
    // slow lift to the lamp
    winT += dt;
    const P = LT.player;
    P.z = lerp(P.z, -41.0, 1 - Math.pow(0.55, dt));
    // step aside as we back off so the beam crosses the frame instead of
    // receding straight down the camera axis
    P.x = lerp(P.x, 2.1, 1 - Math.pow(0.35, dt));
    if (winT > 5.0 && !cardShown) {
      cardShown = true;
      $('#won').classList.add('on');
    }
    const lx = 0.0, lz = -52.2, ly = LT.deckZ + 9.1;
    const dx = lx - P.x, dz = lz - P.z;
    const wantYaw = Math.atan2(-dx, -dz);
    const horiz = Math.max(0.9, Math.hypot(dx, dz));
    const wantPitch = Math.min(0.88, Math.atan2(ly - (LT.deckZ + P.y), horiz));
    const k = 1 - Math.pow(0.03, dt);
    P.yaw += shortAngle(wantYaw - P.yaw) * k;
    P.pitch = lerp(P.pitch, wantPitch, k);
    camera.position.set(P.x, LT.deckZ + P.y, P.z);
    camera.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
    lampLight.intensity = lerp(lampLight.intensity, 4.2, 1 - Math.pow(0.2, dt));
    beam.intensity = lerp(beam.intensity, 3.4, 1 - Math.pow(0.3, dt));
    // sweep to the RIGHT of the mast: the ending card sits on the left third, so a
    // beam swinging that way disappears behind the card's scrim exactly when it matters.
    const ang = -Math.sin(winT * 0.22) * 1.05;
    if (beamSpin) beamSpin.rotation.y = ang;
    // the spotlight that lights the water must follow the same direction the cone
    // geometry rotates into: rotating (0,0,-1) by +ang about Y sends it to -sin(ang).
    beamTarget.position.set(-Math.sin(ang) * 60, -13, -52.2 - Math.cos(ang) * 60);
    coneMats.forEach((m) => {
      const tgt = m.userData.mute ? 0 : m.userData.op;
      m.uniforms.opacity.value = lerp(m.uniforms.opacity.value, tgt, 1 - Math.pow(0.2, dt));
    });
    lampMats.forEach((m) => { m.emissiveIntensity = lerp(m.emissiveIntensity, 1.2, 1 - Math.pow(0.25, dt)); });
  } else if (LT.phase === 'dead') {
    const H = LT.hunter;
    camera.position.set(LT.player.x, LT.deckZ + LT.player.y, LT.player.z);
    const dx = H.x - LT.player.x, dz = H.z - LT.player.z;
    const want = Math.atan2(-dx, -dz);
    LT.player.yaw = lerp(LT.player.yaw, want, 1 - Math.pow(0.02, dt));
    LT.player.pitch = lerp(LT.player.pitch, 0.08, 1 - Math.pow(0.05, dt));
    camera.rotation.set(LT.player.pitch, LT.player.yaw, 0, 'YXZ');
  } else if (LT.phase === 'menu') {
    // slow drift at the pier head while the menu is up
    const t2 = now / 1000;
    camera.position.set(Math.sin(t2 * 0.06) * 0.6, LT.deckZ + 1.7, -46.5);
    camera.rotation.set(-0.02, Math.PI + Math.sin(t2 * 0.05) * 0.14, 0, 'YXZ');
  }

  // motes drift with the player so the mist is always local
  if (LT._motes) {
    const g = LT._motes.geometry.attributes.position;
    const P = LT.player;
    for (let i = 0; i < g.count; i++) {
      g.array[i * 3 + 1] += Math.sin(now / 2600 + i) * 0.0012;
    }
    LT._motes.position.set(P.x, LT.deckZ, P.z);
    g.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

/* ------------------------------------------------------------ ui wiring */
$('#startBtn').addEventListener('click', start);
$('#resumeBtn').addEventListener('click', unpause);
$('#retryBtn').addEventListener('click', respawn);
$('#againBtn').addEventListener('click', () => { LT.deaths = 0; start(); });
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ------------------------------------------------------------ QA hooks */
LT.hooks = {
  warp(x, z) { LT.player.x = x; LT.player.z = z; updateCamera(1); },
  warpHunter(x, z) { LT.hunter.x = x; LT.hunter.z = z; LT.hunter.mode = 'idle'; LT.hunter.fixAge = 99; },
  hunterMode(m) { LT.hunter.mode = m; },
  setBattery(v) { LT.battery = v; },
  progress() { return { p: holdTarget ? +(heldT / HOLD_T).toFixed(3) : 0, target: holdTarget }; },
  perf() { return { fps: +fpsAvg.toFixed(1), quality: LT.quality }; },
  debug() {
    const w = hunterRig ? hunterRig.getWorldPosition(new T.Vector3()) : null;
    return {
      hunterRig: !!hunterRig,
      parts: hunterRig ? hunterRig.children.length : 0,
      world: w ? [+w.x.toFixed(2), +w.y.toFixed(2), +w.z.toFixed(2)] : null,
      limbs: Object.keys(limbs).filter((k) => !!limbs[k]),
      lampMats: lampMats.length,
      breakerMats: Object.keys(breakerMats).map((k) => k + ':' + breakerMats[k].length),
      keys: Object.keys(nodes).length,
      torch: +torch.intensity.toFixed(2),
      hmat: limbs.torso ? [limbs.torso.material.name, limbs.torso.material.color.getHexString(), limbs.torso.material.roughness] : null,
      emis: limbs.head ? [limbs.head.material.name, limbs.head.material.emissiveIntensity || 0] : null,
      lampI: lampMats[0] ? [+lampMats[0].emissiveIntensity.toFixed(1), '#' + lampMats[0].emissive.getHexString(), lampMats[0].name] : null,
    };
  },
  setNoise(v) { LT.noise = v; },
  /* aim the camera exactly at the creature — it drifts while idle, so a fixed yaw
     frames pier furniture instead of a monster by the time the screenshot lands. */
  faceHunter() {
    const dx = LT.hunter.x - LT.player.x;
    const dy = (LT.hunter.y + 0.95) - (LT.deckZ + LT.player.y);
    const dz = LT.hunter.z - LT.player.z;
    LT.player.yaw = Math.atan2(-dx, -dz);
    LT.player.pitch = Math.atan2(dy, Math.max(0.5, Math.hypot(dx, dz)));
  },
  beaconPart(which, on) {
    if (coneMats[which]) {
      coneMats[which].userData.mute = !on;
      coneMats[which].uniforms.opacity.value = on ? coneMats[which].userData.op : 0;
    }
  },
  /* QA: recolour every mesh matching a regex, to prove WHICH material is on screen */
  paint(re, hex) {
    const rx = new RegExp(re, 'i');
    let n = 0;
    scene.traverse((o) => {
      if (!o.isMesh || !rx.test(o.name)) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      o.material = mats.length === 1 ? mats[0].clone() : mats.map((m) => m.clone());
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        m.color = new T.Color(hex); if ('emissive' in m) m.emissive = new T.Color(hex); n++;
      });
    });
    return n;
  },
  nodeList(re) {
    const rx = new RegExp(re, 'i'), out = [];
    scene.traverse((o) => {
      if (!o.isMesh || !rx.test(o.name)) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      out.push([o.name, m && m.name, m && m.color && '#' + m.color.getHexString(),
                m && +(m.emissiveIntensity || 0).toFixed(2), m && m.emissive && '#' + m.emissive.getHexString()]);
    });
    return out;
  },
  lampNodes() {
    const out = [];
    scene.traverse((o) => {
      if (/lamp/i.test(o.name) && o.isMesh) {
        const p = new T.Vector3(); o.getWorldPosition(p);
        out.push([o.name, +p.x.toFixed(1), +p.y.toFixed(2), +p.z.toFixed(1),
                  o.material.name, +(o.material.emissiveIntensity || 0).toFixed(2)]);
      }
    });
    return out;
  },
  setTorch(on) { LT.torchOn = !!on; },
  start,
  throwOne(id) { const b = (LT.anchors.breakers || []).find((x) => x.id === id); if (b) throwBreaker(b); },
  look(dy, dp) { look(dy, dp); },
  snapshot() {
    const H = LT.hunter, P = LT.player;
    return {
      phase: LT.phase, ready: LT.ready,
      player: { x: +P.x.toFixed(3), z: +P.z.toFixed(3), yaw: +P.yaw.toFixed(3) },
      hunter: { x: +H.x.toFixed(3), z: +H.z.toFixed(3), mode: H.mode, y: +H.y.toFixed(2) },
      hunterDist: +Math.hypot(P.x - H.x, P.z - H.z).toFixed(2),
      breakers: Object.assign({}, LT.breakers),
      noise: +LT.noise.toFixed(3), battery: +LT.battery.toFixed(1),
      torch: LT.torchOn, deaths: LT.deaths, elapsed: +LT.elapsed.toFixed(1),
      lamp: +lampLight.intensity.toFixed(2), winT: +winT.toFixed(2), card: cardShown,
    };
  },
};

rafId = requestAnimationFrame(frame);
})();
