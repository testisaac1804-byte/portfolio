/* ============================================================================
   PIT LANE — Harbour Circuit
   Arcade time trial. World + car authored procedurally in Blender 5.0 (bpy),
   exported to glTF. Physics, camera, HUD and audio live here.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var ERRORS = window.__errors = [];
  function fail(msg) {
    ERRORS.push(String(msg));
    var e = $('err');
    if (e) { e.style.display = 'block'; e.textContent = '⚠ ' + msg; }
    if (window.console) console.error(msg);
  }
  window.addEventListener('error', function (e) { fail(e.message || 'script error'); });
  window.addEventListener('unhandledrejection', function (e) { fail('promise: ' + (e.reason && e.reason.message || e.reason)); });

  if (typeof THREE === 'undefined') { fail('three.js failed to load'); return; }

  // ---------------------------------------------------------------- tuning
  var CFG = {
    maxSpeed: 69,           // m/s (~248 km/h)
    accel: 30,
    brake: 52,
    coast: 7.5,
    reverseMax: 13,
    gripNormal: 8.5,
    gripDrift: 1.9,
    yawLow: 1.85,
    yawHigh: 0.70,
    offTrackGrip: 6.2,
    offTrackMax: 0.52,
    wheelRadF: 0.30,
    wheelRadR: 0.345,
    laps: 3,
    shadowSpan: 78
  };

  // ---------------------------------------------------------------- state
  var S = {
    mode: 'garage',        // garage | countdown | racing | paused | finished
    lap: 1,
    armed: true,
    lapStartT: 0,
    lapTime: 0,
    times: [],
    raceT: 0,
    countdownT: 0,
    lastBeep: -1,
    s: 0, prevS: 0, maxS: 0,
    speed: 0, yaw: 0, velYaw: 0, steer: 0,
    offTrack: false, drift: 0, shake: 0,
    topSpeed: 0,
    bestLap: null,
    bestTotal: null,
    newPB: false,
    lapDeltaShown: 0
  };

  var INPUT = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  var KEYS = {};

  // ---------------------------------------------------------------- renderer
  var canvas = $('c');
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true, powerPreference: 'high-performance',
    preserveDrawingBuffer: true, stencil: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  var scene = new THREE.Scene();
  var SKY = { top: 0x2a6296, mid: 0x9dc9e0, haze: 0xf6d9b8, fog: 0xc4d7df };
  scene.fog = new THREE.Fog(SKY.fog, 210, 1150);

  var camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.35, 4000);
  camera.position.set(0, 6, 18);

  // ---------------------------------------------------------------- sky
  var sunDir = new THREE.Vector3(0.52, 0.62, 0.42).normalize();
  function makeSky() {
    var geo = new THREE.SphereGeometry(2600, 32, 20);
    var mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        uTop: { value: new THREE.Color(SKY.top) },
        uMid: { value: new THREE.Color(SKY.mid) },
        uHaze: { value: new THREE.Color(SKY.haze) },
        uSun: { value: sunDir.clone() },
        uSunCol: { value: new THREE.Color(0xfff0cf) }
      },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: [
        'uniform vec3 uTop, uMid, uHaze, uSun, uSunCol;',
        'varying vec3 vP;',
        'void main(){',
        '  vec3 d = normalize(vP);',
        '  float t = pow(clamp(d.y, 0.0, 1.0), 0.55);',
        '  vec3 col = mix(uMid, uTop, t);',
        '  col = mix(uHaze, col, smoothstep(-0.10, 0.16, d.y));',
        '  float s = max(dot(d, normalize(uSun)), 0.0);',
        '  col += uSunCol * pow(s, 340.0) * 1.6;',
        '  col += uSunCol * pow(s, 9.0) * 0.13;',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });
    var m = new THREE.Mesh(geo, mat);
    m.frustumCulled = false;
    return m;
  }
  var sky = makeSky();
  scene.add(sky);

  // environment reflections from the sky (keeps metals from going black)
  try {
    var pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileCubemapShader && pmrem.compileCubemapShader();
    scene.environment = pmrem.fromScene(scene, 0.06).texture;
    pmrem.dispose();
  } catch (e) { /* non-fatal */ }

  // ---------------------------------------------------------------- lights
  var hemi = new THREE.HemisphereLight(0xd3e8f6, 0x5b6a52, 0.62);
  scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xfff1da, 2.35);
  sun.position.copy(sunDir).multiplyScalar(220);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 60;
  sun.shadow.camera.far = 420;
  sun.shadow.camera.left = -CFG.shadowSpan;
  sun.shadow.camera.right = CFG.shadowSpan;
  sun.shadow.camera.top = CFG.shadowSpan;
  sun.shadow.camera.bottom = -CFG.shadowSpan;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.35;
  scene.add(sun);
  scene.add(sun.target);

  // ---------------------------------------------------------------- track data
  var PTS = [], N = 0, CUM = [], LEN = 0, HW = 7.5;
  var tmpV = new THREE.Vector3();

  function buildTrackIndex() {
    CUM = new Array(N);
    CUM[0] = 0;
    for (var i = 1; i < N; i++) {
      var a = PTS[i - 1], b = PTS[i];
      CUM[i] = CUM[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]);
    }
    var last = PTS[N - 1], first = PTS[0];
    LEN = CUM[N - 1] + Math.hypot(first[0] - last[0], first[1] - last[1]);
  }

  var lastIdx = 0;
  /* locate a world point on the centreline: nearest sample + segment projection */
  function locate(x, z, full) {
    var best = 0, bestD = Infinity, i, dx, dz, d2;
    if (!full && lastIdx > 0) {
      var lo = Math.max(0, lastIdx - 26), hi = Math.min(N - 1, lastIdx + 26);
      for (i = lo; i <= hi; i++) {
        dx = x - PTS[i][0]; dz = z - PTS[i][1]; d2 = dx * dx + dz * dz;
        if (d2 < bestD) { bestD = d2; best = i; }
      }
      if (best === lo || best === hi) full = true;
    }
    if (full || lastIdx === 0) {
      bestD = Infinity;
      for (i = 0; i < N; i += 2) {
        dx = x - PTS[i][0]; dz = z - PTS[i][1]; d2 = dx * dx + dz * dz;
        if (d2 < bestD) { bestD = d2; best = i; }
      }
    }
    lastIdx = best;
    // refine on the two adjacent segments
    var res = { i: best, s: CUM[best], lat: 0, dist: Math.sqrt(bestD) };
    var bestScore = Infinity;
    for (var k = -1; k <= 0; k++) {
      var i0 = (best + k + N) % N, i1 = (i0 + 1) % N;
      var p0 = PTS[i0], p1 = PTS[i1];
      var ex = p1[0] - p0[0], ez = p1[1] - p0[1];
      var segLen = Math.hypot(ex, ez) || 1e-6;
      var t = ((x - p0[0]) * ex + (z - p0[1]) * ez) / (segLen * segLen);
      t = Math.max(0, Math.min(1, t));
      var cx = p0[0] + ex * t, cz = p0[1] + ez * t;
      var ddx = x - cx, ddz = z - cz;
      var dd = Math.hypot(ddx, ddz);
      if (dd < bestScore) {
        bestScore = dd;
        var nx = ez / segLen, nz = -ex / segLen;
        var sAt = CUM[i0] + segLen * t;
        res = { i: i0, s: sAt >= CUM[N - 1] ? (sAt - CUM[N - 1]) : sAt, lat: ddx * nx + ddz * nz, dist: dd };
      }
    }
    return res;
  }

  function poseAt(s) {
    s = ((s % LEN) + LEN) % LEN;
    var i = Math.min(N - 1, Math.max(0, Math.round((s / LEN) * (N - 1))));
    var p = PTS[i], q = PTS[(i + 1) % N], r = PTS[(i - 1 + N) % N];
    var tx = q[0] - r[0], tz = q[1] - r[1];
    var L = Math.hypot(tx, tz) || 1;
    return { x: p[0], z: p[1], tx: tx / L, tz: tz / L };
  }
  function yawFromTangent(tx, tz) { return Math.atan2(-tx, -tz); }

  // ---------------------------------------------------------------- car objects
  var carRig = new THREE.Group();     // world position + heading
  var carTilt = new THREE.Group();    // body roll / pitch
  var carNode = null;
  var wheels = {}, frontWheels = [], allWheels = [];
  var gantryLights = [];
  var carReady = false;

  // ---------------------------------------------------------------- dust
  var dust = null, dustPos, dustVel, dustLife, dustMax = 300, dustHead = 0;
  function makeDust() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,0.85)');
    rg.addColorStop(0.4, 'rgba(255,255,255,0.35)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
    var tex = new THREE.CanvasTexture(c);

    var geo = new THREE.BufferGeometry();
    dustPos = new Float32Array(dustMax * 3);
    dustVel = new Float32Array(dustMax * 3);
    dustLife = new Float32Array(dustMax);
    for (var i = 0; i < dustMax; i++) { dustPos[i * 3 + 1] = -999; }
    geo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    var mat = new THREE.PointsMaterial({
      size: 1.5, map: tex, transparent: true, opacity: 0.5, depthWrite: false,
      color: 0xe2d5bd, sizeAttenuation: true, blending: THREE.NormalBlending
    });
    dust = new THREE.Points(geo, mat);
    dust.frustumCulled = false;
    scene.add(dust);
  }
  function spawnDust(x, y, z, spread) {
    if (!dust) return;
    var i = dustHead; dustHead = (dustHead + 1) % dustMax;
    dustPos[i * 3] = x + (Math.random() - 0.5) * spread;
    dustPos[i * 3 + 1] = y + Math.random() * 0.2;
    dustPos[i * 3 + 2] = z + (Math.random() - 0.5) * spread;
    dustVel[i * 3] = (Math.random() - 0.5) * 2.4;
    dustVel[i * 3 + 1] = 0.9 + Math.random() * 1.9;
    dustVel[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
    dustLife[i] = 0.75 + Math.random() * 0.5;
  }
  function updateDust(dt) {
    if (!dust) return;
    for (var i = 0; i < dustMax; i++) {
      if (dustLife[i] <= 0) continue;
      dustLife[i] -= dt;
      if (dustLife[i] <= 0) { dustPos[i * 3 + 1] = -999; continue; }
      dustPos[i * 3] += dustVel[i * 3] * dt;
      dustPos[i * 3 + 1] += dustVel[i * 3 + 1] * dt;
      dustPos[i * 3 + 2] += dustVel[i * 3 + 2] * dt;
      dustVel[i * 3] *= (1 - 1.6 * dt);
      dustVel[i * 3 + 2] *= (1 - 1.6 * dt);
      dustVel[i * 3 + 1] *= (1 - 0.7 * dt);
    }
    dust.geometry.attributes.position.needsUpdate = true;
  }

  // ---------------------------------------------------------------- audio
  var A = {
    ctx: null, master: null, engGain: null, osc1: null, osc2: null, filt: null,
    tyres: null, noiseGain: null, muted: false, started: false
  };
  function audioInit() {
    if (A.started) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      A.ctx = ctx;
      A.master = ctx.createGain();
      A.master.gain.value = A.muted ? 0 : 0.5;
      A.master.connect(ctx.destination);

      A.filt = ctx.createBiquadFilter();
      A.filt.type = 'lowpass';
      A.filt.frequency.value = 700;
      A.filt.Q.value = 3.5;
      A.filt.connect(A.master);

      A.engGain = ctx.createGain();
      A.engGain.gain.value = 0.0;
      A.engGain.connect(A.filt);

      A.osc1 = ctx.createOscillator(); A.osc1.type = 'sawtooth'; A.osc1.frequency.value = 70;
      A.osc2 = ctx.createOscillator(); A.osc2.type = 'square'; A.osc2.frequency.value = 104;
      var g2 = ctx.createGain(); g2.gain.value = 0.35;
      A.osc1.connect(A.engGain);
      A.osc2.connect(g2); g2.connect(A.engGain);
      A.osc1.start(); A.osc2.start();

      // wind / tyre noise
      var len = ctx.sampleRate * 1.2;
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      var src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 0.8;
      A.noiseGain = ctx.createGain(); A.noiseGain.gain.value = 0.0;
      src.connect(bp); bp.connect(A.noiseGain); A.noiseGain.connect(A.master);
      src.start();
      A.tyres = bp;
      A.started = true;
    } catch (e) { /* audio is optional */ }
  }
  function beep(freq, dur, type, vol) {
    if (!A.started || A.muted) return;
    var ctx = A.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(vol || 0.22, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(A.master);
    o.start(); o.stop(ctx.currentTime + dur + 0.02);
  }
  function chime(up) {
    beep(up ? 880 : 560, 0.16, 'triangle', 0.18);
    setTimeout(function () { beep(up ? 1320 : 420, 0.22, 'triangle', 0.16); }, 120);
  }
  function thud() {
    if (!A.started || A.muted) return;
    var ctx = A.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(120, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.22);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    o.connect(g); g.connect(A.master); o.start(); o.stop(ctx.currentTime + 0.32);
  }
  function audioUpdate() {
    if (!A.started) return;
    var sp = Math.abs(S.speed) / CFG.maxSpeed;
    var thr = Math.max(INPUT.throttle, S.mode === 'countdown' ? 0.55 : 0);
    var f = 52 + sp * 250 + thr * 22;
    var t = A.ctx.currentTime;
    A.osc1.frequency.setTargetAtTime(f, t, 0.05);
    A.osc2.frequency.setTargetAtTime(f * 1.503, t, 0.06);
    A.filt.frequency.setTargetAtTime(420 + sp * 2100 + thr * 900, t, 0.07);
    var target = (S.mode === 'racing' || S.mode === 'countdown') ? (0.035 + sp * 0.055 + thr * 0.02) : 0.0;
    if (A.muted) target = 0;
    A.engGain.gain.setTargetAtTime(target, t, 0.08);
    var tyre = (S.offTrack && sp > 0.05) ? 0.05 + sp * 0.10 : (S.drift > 0.25 ? 0.03 + S.drift * 0.06 : 0.0);
    A.noiseGain.gain.setTargetAtTime(A.muted ? 0 : tyre, t, 0.1);
  }

  // ---------------------------------------------------------------- load
  var assetsOK = false;
  function setProgress(p, txt) {
    $('prog').style.width = Math.round(p * 100) + '%';
    if (txt) $('loadtxt').textContent = txt;
  }

  function loadEverything() {
    var pend = 2;
    function done() { if (--pend === 0) onLoaded(); }

    var loader = new THREE.GLTFLoader();
    loader.load('assets/circuit.glb', function (gltf) {
      onModel(gltf);
      done();
    }, function (xhr) {
      if (xhr.lengthComputable) setProgress(0.12 + 0.8 * (xhr.loaded / xhr.total));
    }, function (err) {
      fail('could not load circuit.glb — ' + (err && err.message ? err.message : err));
      setProgress(1, 'Asset load failed');
      done();
    });

    fetch('assets/track.json').then(function (r) {
      if (!r.ok) throw new Error('track.json ' + r.status);
      return r.json();
    }).then(function (j) {
      PTS = j.points; N = PTS.length; HW = j.width / 2;
      buildTrackIndex();
      done();
    }).catch(function (e) {
      fail('track data: ' + e.message);
      done();
    });
  }

  function onModel(gltf) {
    var root = gltf.scene;
    var env = scene.environment;

    root.traverse(function (o) {
      if (!o.isMesh) return;
      var meshName = o.name || '';
      o.castShadow = /Car|Wheel|Gantry|Grandstand|Pit|Trees|Barriers|TyreStacks|Flood/.test(meshName);
      o.receiveShadow = /Road|Kerbs|StartLine|Ground|Barriers|TyreStacks|Pit|Grandstand/.test(meshName);
      var mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(function (m) {
        if (!m) return;
        if (m.isMeshStandardMaterial) {
          m.envMapIntensity = 0.85;
          if (m.metalness > 0.6) m.metalness = 0.6;
          if (m.emissiveIntensity > 1) m.emissiveIntensity = 1;
        }
        m.side = THREE.FrontSide;
      });
      if (/^Light_/.test(meshName)) {
        o.material = o.material.clone();
        o.material.emissive = new THREE.Color(0x50100a);
        o.material.emissiveIntensity = 1;
        gantryLights.push(o);
      }
      if (/^Wheel_/.test(meshName)) {
        o.rotation.order = 'YXZ';
        wheels[meshName] = o;
      }
    });

    gantryLights.sort(function (a, b) { return a.name < b.name ? -1 : 1; });
    Object.keys(wheels).sort().forEach(function (k) { allWheels.push(wheels[k]); });
    frontWheels = [wheels['Wheel_FL'], wheels['Wheel_FR']].filter(Boolean);

    carNode = root.getObjectByName('Car');
    if (carNode) {
      carNode.position.set(0, 0, 0);
      carNode.rotation.set(0, 0, 0);
      carNode.updateMatrixWorld(true);
      // wheels are children of Car already; keep references valid
      carTilt.add(carNode);
      carRig.add(carTilt);
      scene.add(carRig);
      carReady = true;
    } else {
      fail('Car node missing from GLB');
    }
    // everything else stays at world origin
    root.updateMatrixWorld(true);
    scene.add(root);
    makeDust();
    assetsOK = true;
  }

  // ---------------------------------------------------------------- reset / start
  function placeOnGrid() {
    var s0 = LEN - 15;
    var p = poseAt(s0);
    carRig.position.set(p.x, 0, p.z);
    S.yaw = yawFromTangent(p.tx, p.tz);
    S.velYaw = S.yaw;
    S.speed = 0; S.steer = 0;
    S.s = s0; S.prevS = s0; S.maxS = s0;
    S.offTrack = false; S.drift = 0;
    lastIdx = 0;
    carRig.rotation.y = S.yaw;
    snapChase();
    carTilt.rotation.set(0, 0, 0);
    allWheels.forEach(function (w) { w.rotation.set(0, 0, 0); });
    resetLights();
  }

  function resetLights() {
    gantryLights.forEach(function (o) {
      o.material.emissive.setHex(0x3a0d08);
      o.material.emissiveIntensity = 1;
    });
  }
  function lightGantry(n, green) {
    gantryLights.forEach(function (o, i) {
      var on = green ? true : i < n;
      var col = green ? 0x22ff66 : 0xff2200;
      o.material.emissive.setHex(on ? col : 0x3a0d08);
      o.material.emissiveIntensity = on ? 1.4 : 1;
    });
  }

  var hudEls = {
    hud: $('hud'), lapnum: $('lapnum'), curtime: $('curtime'), delta: $('delta'),
    bestv: $('bestv'), topv: $('topv'), spd: $('spd'), gears: $('gearbox').children,
    count: $('count'), countn: $('countn'), toast: $('toast'), vig: $('vig'), flash: $('flash')
  };

  function startRace() {
    if (!assetsOK && !carReady) { fail('assets not ready'); return; }
    audioInit();
    S.mode = 'countdown';
    S.countdownT = 4.0;
    S.lastBeep = -1;
    S.lap = 1; S.armed = true; S.times = []; S.lapTime = 0; S.raceT = 0; S.sessionBest = null;
    S.topSpeed = 0; S.newPB = false;
    INPUT.steer = 0; INPUT.throttle = 0; INPUT.brake = 0;
    placeOnGrid();
    $('menu').classList.remove('on');
    $('results').classList.remove('on');
    $('pause').classList.remove('on');
    hudEls.hud.classList.add('on');
    hudEls.lapnum.innerHTML = '1<em>/' + CFG.laps + '</em>';
    hudEls.curtime.textContent = '0:00.000';
    hudEls.delta.className = '';
    $('timelbl').textContent = 'Lap time';
    toast('Lights out in 3', 1400);
  }

  function restartRace() { startRace(); }

  function toGarage() {
    S.mode = 'garage';
    S.times = []; S.lap = 1; S.speed = 0;
    placeOnGrid();
    hudEls.hud.classList.remove('on');
    $('results').classList.remove('on');
    $('pause').classList.remove('on');
    $('menu').classList.add('on');
    resetLights();
  }

  function finishRace() {
    S.mode = 'finished';
    var total = S.times.reduce(function (a, b) { return a + b; }, 0);
    var best = Math.min.apply(null, S.times);
    var prevBest = parseFloat(localStorage.getItem('pitlane.bestlap') || 'NaN');
    var prevTotal = parseFloat(localStorage.getItem('pitlane.besttotal') || 'NaN');
    S.newPB = !(prevBest === prevBest) ? true : best < prevBest;
    if (S.newPB || !(prevTotal === prevTotal) || total < prevTotal) {
      localStorage.setItem('pitlane.bestlap', String(best));
      localStorage.setItem('pitlane.besttotal', String(total));
    }
    S.bestLap = Math.min(best, (prevBest === prevBest) ? prevBest : best);
    paintResults(best, total);
    hudEls.hud.classList.remove('on');
    $('results').classList.add('on');
    chime(true);
    beep(660, 0.3, 'triangle', 0.2);
    if (window.__game) window.__game.lastResult = { best: best, total: total, times: S.times.slice() };
  }

  function paintResults(best, total) {
    var rows = '';
    S.times.forEach(function (t, i) {
      var gap = t - best;
      rows += '<tr><td>Lap ' + (i + 1) + '</td><td class="' + (t === best ? 'best' : '') + '">' +
        fmt(t) + '</td><td style="text-align:right;color:' + (gap === 0 ? 'var(--good)' : 'var(--muted)') + '">' +
        (gap === 0 ? 'best' : '+' + gap.toFixed(3)) + '</td></tr>';
    });
    $('laps').innerHTML = rows;
    $('rtotal').textContent = fmt(total);
    $('pbbadge').classList.toggle('on', !!S.newPB);
    $('rtitle').textContent = S.newPB ? 'New benchmark' : 'Chequered flag';
    $('rhint').textContent = 'Best lap ' + fmt(best);
    var stored = parseFloat(localStorage.getItem('pitlane.bestlap') || 'NaN');
    if (stored === stored) $('spBest').textContent = fmt(stored);
  }

  // ---------------------------------------------------------------- sim
  function simulate(dt) {
    if (!carReady) return;

    if (S.mode === 'countdown') {
      S.countdownT -= dt;
      var t = S.countdownT;
      var idx = Math.ceil(t - 0.6);          // 3,2,1 then GO
      var lit = Math.max(0, Math.min(5, Math.round((4.0 - t) * 1.6)));
      lightGantry(lit, false);
      if (idx !== S.lastBeep) {
        S.lastBeep = idx;
        if (idx >= 1 && idx <= 3) { showCount(String(idx)); beep(520, 0.14, 'square', 0.16); }
      }
      if (t <= 0) {
        S.mode = 'racing';
        S.raceT = 0; S.lapTime = 0;
        showCount('GO', true);
        lightGantry(5, true);
        beep(980, 0.4, 'square', 0.2);
        setTimeout(resetLights, 1500);
      }
      // keep car planted
      S.speed = 0;
      return;
    }

    if (S.mode !== 'racing') return;

    S.raceT += dt;
    S.lapTime += dt;

    var speed = S.speed;
    var thr = INPUT.throttle, brk = INPUT.brake;
    var steerInput = INPUT.steer;
    var off = S.offTrack;
    var maxS = CFG.maxSpeed * (off ? CFG.offTrackMax : 1);

    // longitudinal
    if (thr > 0) {
      var head = 1 - Math.min(1, Math.abs(speed) / maxS);
      speed += CFG.accel * thr * (0.35 + 0.65 * head) * dt;
    }
    if (brk > 0) {
      if (speed > 0.4) speed -= CFG.brake * brk * dt;
      else speed -= CFG.accel * 0.55 * brk * dt;
    }
    if (thr === 0 && brk === 0) {
      var c = CFG.coast * (off ? 2.2 : 1);
      speed = speed > 0 ? Math.max(0, speed - c * dt) : Math.min(0, speed + c * dt);
    }
    if (INPUT.handbrake) speed = speed > 0 ? Math.max(0, speed - 18 * dt) : speed;
    speed = Math.max(-CFG.reverseMax, Math.min(maxS, speed));

    // steering — smoothed input, speed-sensitive rate
    var target = steerInput;
    S.steer += (target - S.steer) * Math.min(1, 11 * dt);
    var sn = Math.min(1, Math.abs(speed) / CFG.maxSpeed);
    var yawRate = CFG.yawLow + (CFG.yawHigh - CFG.yawLow) * Math.pow(sn, 0.85);
    var direction = speed >= 0 ? 1 : -1;
    var gripNeed = INPUT.handbrake ? 1.32 : 1.0;
    S.yaw += S.steer * yawRate * gripNeed * direction * dt;

    // velocity direction lags heading → drift
    var grip = INPUT.handbrake ? CFG.gripDrift : (off ? CFG.offTrackGrip : CFG.gripNormal);
    var diff = angDiff(S.yaw, S.velYaw);
    S.velYaw += diff * Math.min(1, grip * dt);
    S.speed = speed;
    S.drift = Math.min(1, Math.abs(diff) * 2.4 + (INPUT.handbrake && Math.abs(speed) > 12 ? 0.35 : 0));

    // integrate
    var fx = -Math.sin(S.velYaw), fz = -Math.cos(S.velYaw);
    carRig.position.x += fx * speed * dt;
    carRig.position.z += fz * speed * dt;
    carRig.rotation.y = S.yaw;

    // body attitude (visual only)
    var rollTarget = -S.steer * 0.055 * Math.min(1, Math.abs(speed) / 32) * (INPUT.handbrake ? 1.5 : 1);
    var pitchTarget = brk > 0 ? 0.028 : (thr > 0 ? -0.016 : 0);
    carTilt.rotation.z += (rollTarget - carTilt.rotation.z) * Math.min(1, 6 * dt);
    carTilt.rotation.x += (pitchTarget - carTilt.rotation.x) * Math.min(1, 5 * dt);

    // track position
    S.prevS = S.s;
    var loc = locate(carRig.position.x, carRig.position.z, false);
    S.s = loc.s;
    var wasOff = S.offTrack;
    S.offTrack = Math.abs(loc.lat) > HW + 0.55;

    // barrier wall
    var limit = HW + 3.3;
    if (Math.abs(loc.lat) > limit) {
      var pen = Math.abs(loc.lat) - limit;
      var sign = loc.lat > 0 ? 1 : -1;
      // push back toward centreline
      var i = loc.i, p = PTS[i], q = PTS[(i + 1) % N];
      var ex = q[0] - p[0], ez = q[1] - p[1], el = Math.hypot(ex, ez) || 1;
      var nx = ez / el, nz = -ex / el;
      carRig.position.x -= nx * sign * (pen + 0.02);
      carRig.position.z -= nz * sign * (pen + 0.02);
      if (Math.abs(speed) > 6) {
        S.speed = speed * 0.55;
        S.shake = Math.min(1, S.shake + 0.55);
        thud();
        for (var d = 0; d < 6; d++) spawnDust(carRig.position.x, 0.3, carRig.position.z, 1.6);
      }
    }

    if (S.offTrack && !wasOff && Math.abs(S.speed) > 4) {
      toast('Off track — grip lost', 1200);
      beep(220, 0.1, 'square', 0.1);
    }

    // dust
    if ((S.offTrack && Math.abs(S.speed) > 6) || S.drift > 0.55) {
      if (Math.random() < 0.85) {
        var bx = carRig.position.x - fx * 1.6, bz = carRig.position.z - fz * 1.6;
        spawnDust(bx, 0.25, bz, 1.2);
      }
    }

    // wheels
    var spinF = (S.speed / CFG.wheelRadF) * dt;
    var spinR = (S.speed / CFG.wheelRadR) * dt;
    var steerVis = S.steer * 0.42;
    if (wheels.Wheel_FL) { wheels.Wheel_FL.rotation.y = steerVis; wheels.Wheel_FL.rotation.x -= spinF; }
    if (wheels.Wheel_FR) { wheels.Wheel_FR.rotation.y = steerVis; wheels.Wheel_FR.rotation.x -= spinF; }
    if (wheels.Wheel_RL) wheels.Wheel_RL.rotation.x -= spinR;
    if (wheels.Wheel_RR) wheels.Wheel_RR.rotation.x -= spinR;

    // lap crossing
    var crossed = (S.prevS > LEN * 0.62 && S.s < LEN * 0.38);
    if (crossed) {
      if (S.armed) {
        S.armed = false;
        S.lapStartT = 0;
        S.lapTime = 0;
        S.lap = 1;
        S.maxS = S.s;
        beep(760, 0.12, 'sine', 0.14);
      } else {
        var lt = S.lapTime;
        S.times.push(lt);
        // session best only — the persistent record is written once, in finishRace(),
        // otherwise the first lap of a race can never count as a new personal best
        var prevBest = (S.sessionBest != null) ? S.sessionBest : Infinity;
        var isBest = lt < prevBest;
        if (isBest) S.sessionBest = lt;
        if (isBest) {
          showDelta(0, true);
          toast('<b>New best lap</b> ' + fmt(lt), 2200);
        } else {
          showDelta(lt - prevBest, false);
        }
        chime(isBest);
        hudEls.flash.style.opacity = '0.16';
        setTimeout(function () { hudEls.flash.style.opacity = '0'; }, 40);
        S.lapTime = 0;
        S.lap = S.times.length + 1;
        if (S.times.length >= CFG.laps) { finishRace(); return; }
      }
    }

    S.topSpeed = Math.max(S.topSpeed, Math.abs(S.speed) * 3.6);
    var stored = parseFloat(localStorage.getItem('pitlane.bestlap') || 'NaN');
    S.bestLap = (stored === stored) ? stored : null;
  }

  function angDiff(a, b) {
    var d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  // ---------------------------------------------------------------- camera
  var camPos = new THREE.Vector3(0, 8, 20);
  var camLook = new THREE.Vector3();
  var chaseYaw = 0;
  var attractT = 0;

  /* put the chase camera exactly at its rest pose — used when a race starts or
     resumes, so it never sweeps in from the garage orbit */
  function snapChase() {
    var sp = Math.abs(S.speed) / CFG.maxSpeed;
    chaseYaw = S.yaw;
    var back = 8.6 + sp * 2.6;
    var up = 3.15 + sp * 0.85;
    camPos.set(carRig.position.x + Math.sin(chaseYaw) * back, up,
               carRig.position.z + Math.cos(chaseYaw) * back);
    camLook.set(carRig.position.x - Math.sin(chaseYaw) * 6, 1.15,
                carRig.position.z - Math.cos(chaseYaw) * 6);
    camera.fov = 62 + sp * 17;
  }

  function updateCamera(dt) {
    var goalPos = tmpV.clone(), goalLook = new THREE.Vector3();
    var sp = Math.abs(S.speed) / CFG.maxSpeed;
    var shake = 0;
    if (S.shake > 0) {
      shake = S.shake;
      S.shake = Math.max(0, S.shake - dt * 2.2);
    }
    var offShake = S.offTrack && Math.abs(S.speed) > 12 ? 0.35 * Math.min(1, sp * 1.6) : 0;

    if (S.mode === 'garage' || S.mode === 'finished' || S.mode === 'paused') {
      attractT += dt * (S.mode === 'paused' ? 0.06 : 0.16);
      var radius = S.mode === 'finished' ? 13 : 11;
      var cx = carRig.position.x + Math.cos(attractT) * radius;
      var cz = carRig.position.z + Math.sin(attractT) * radius;
      goalPos.set(cx, 3.6 + Math.sin(attractT * 0.7) * 1.1, cz);
      goalLook.set(carRig.position.x, 0.8, carRig.position.z);
      camPos.lerp(goalPos, 1 - Math.exp(-4 * dt));
      camLook.lerp(goalLook, 1 - Math.exp(-6 * dt));
      camera.fov += (46 - camera.fov) * Math.min(1, 3 * dt);
    } else {
      var targetYaw = (S.speed >= 0) ? S.yaw : S.yaw;
      chaseYaw += angDiff(targetYaw, chaseYaw) * Math.min(1, 4.2 * dt);
      var back = 8.6 + sp * 2.6;
      var up = 3.15 + sp * 0.85;
      var bx = carRig.position.x + Math.sin(chaseYaw) * back;
      var bz = carRig.position.z + Math.cos(chaseYaw) * back;
      goalPos.set(bx, up, bz);
      goalLook.set(
        carRig.position.x - Math.sin(chaseYaw) * (6 + sp * 10),
        1.15 + sp * 0.3,
        carRig.position.z - Math.cos(chaseYaw) * (6 + sp * 10)
      );
      var k = 1 - Math.exp(-(7.5 + sp * 3) * dt);
      camPos.lerp(goalPos, k);
      camLook.lerp(goalLook, 1 - Math.exp(-9 * dt));
      var fovGoal = 62 + sp * 17;
      camera.fov += (fovGoal - camera.fov) * Math.min(1, 3.4 * dt);
      shake += offShake;
    }

    camera.position.copy(camPos);
    if (shake > 0.001) {
      var amp = shake * 0.30 + offShake * 0.16;
      camera.position.x += (Math.random() - 0.5) * amp;
      camera.position.y += (Math.random() - 0.5) * amp;
      camera.position.z += (Math.random() - 0.5) * amp;
    }
    camera.lookAt(camLook);
    camera.updateProjectionMatrix();

    // keep the shadow frustum around the car
    sun.position.set(
      carRig.position.x + sunDir.x * 150,
      sunDir.y * 150,
      carRig.position.z + sunDir.z * 150
    );
    sun.target.position.set(carRig.position.x, 0, carRig.position.z);
    sun.target.updateMatrixWorld();
    sky.position.set(camera.position.x, 0, camera.position.z);
  }

  // ---------------------------------------------------------------- HUD
  var lastHud = {};
  function fmt(t) {
    if (!isFinite(t)) return '—';
    var m = Math.floor(t / 60), s = t - m * 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(3);
  }
  function setText(el, key, v) {
    if (lastHud[key] === v) return;
    lastHud[key] = v; el.textContent = v;
  }
  function updateHud() {
    if (!hudEls.hud.classList.contains('on')) return;
    var lap = Math.min(CFG.laps, S.times.length + 1);
    setText(hudEls.lapnum, 'lap', (S.mode === 'racing' || S.mode === 'countdown') ? String(lap) : '1');
    if (!hudEls.lapnum.querySelector('em')) hudEls.lapnum.innerHTML = lap + '<em>/' + CFG.laps + '</em>';
    var cur = S.mode === 'racing' ? S.lapTime : (S.mode === 'finished' ? 0 : 0);
    setText(hudEls.curtime, 'cur', fmt(cur));
    setText(hudEls.spd, 'spd', String(Math.round(Math.abs(S.speed) * 3.6)));
    setText(hudEls.topv, 'top', Math.round(S.topSpeed) + ' km/h');
    var best = (S.bestLap != null) ? S.bestLap : parseFloat(localStorage.getItem('pitlane.bestlap') || 'NaN');
    setText(hudEls.bestv, 'best', (best === best) ? fmt(best) : '—');
    hudEls.bestv.classList.toggle('pb', S.newPB);

    var lit = Math.round(Math.abs(S.speed) / CFG.maxSpeed * 5);
    for (var i = 0; i < hudEls.gears.length; i++) {
      hudEls.gears[i].classList.toggle('on', i < lit);
    }
    var v = Math.min(1, Math.abs(S.speed) / CFG.maxSpeed);
    hudEls.vig.style.opacity = (v * v * 0.85).toFixed(2);

    drawMap();
  }

  function showDelta(d, isBest) {
    var el = hudEls.delta;
    if (isBest) { el.textContent = '− best'; el.className = 'on down'; }
    else {
      el.textContent = (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(3);
      el.className = 'on ' + (d > 0 ? 'up' : 'down');
    }
    setTimeout(function () { el.className = ''; }, 2600);
  }

  var countTimer = null;
  function showCount(txt, isGo) {
    var el = hudEls.countn;
    el.textContent = txt;
    el.className = '';
    void el.offsetWidth;
    el.className = 'pop' + (isGo ? ' go' : '');
    clearTimeout(countTimer);
    countTimer = setTimeout(function () { el.className = ''; }, 900);
  }

  var toastTimer = null;
  function toast(html, ms) {
    hudEls.toast.innerHTML = html;
    hudEls.toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { hudEls.toast.classList.remove('on'); }, ms || 1600);
  }

  // ---------------- minimap
  var mapBase = null, mapCtx = null, mapScale = 1, mapOff = { x: 0, y: 0 }, mapW = 328;
  function buildMap() {
    var cv = $('map');
    mapCtx = cv.getContext('2d');
    var base = document.createElement('canvas');
    base.width = base.height = mapW;
    var c = base.getContext('2d');
    var minx = Infinity, maxx = -Infinity, minz = Infinity, maxz = -Infinity;
    for (var i = 0; i < N; i++) {
      minx = Math.min(minx, PTS[i][0]); maxx = Math.max(maxx, PTS[i][0]);
      minz = Math.min(minz, PTS[i][1]); maxz = Math.max(maxz, PTS[i][1]);
    }
    var pad = 28;
    mapScale = Math.min((mapW - pad * 2) / (maxx - minx), (mapW - pad * 2) / (maxz - minz));
    mapOff.x = (mapW - (maxx - minx) * mapScale) / 2 - minx * mapScale;
    mapOff.y = (mapW - (maxz - minz) * mapScale) / 2 - minz * mapScale;

    function proj(x, z) { return [x * mapScale + mapOff.x, z * mapScale + mapOff.y]; }

    // road
    c.lineJoin = 'round'; c.lineCap = 'round';
    c.strokeStyle = 'rgba(255,255,255,0.10)';
    c.lineWidth = 15;
    c.beginPath();
    for (var k = 0; k < N; k += 3) {
      var p = proj(PTS[k][0], PTS[k][1]);
      if (k === 0) c.moveTo(p[0], p[1]); else c.lineTo(p[0], p[1]);
    }
    c.closePath(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.42)';
    c.lineWidth = 2.2;
    c.stroke();

    // start line
    var sp = proj(PTS[0][0], PTS[0][1]);
    c.fillStyle = '#ff4d2e';
    c.beginPath(); c.arc(sp[0], sp[1], 4.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.font = '600 15px -apple-system, system-ui, sans-serif';
    mapBase = base;
    mapCtx.clearRect(0, 0, mapW, mapW);
    mapCtx.drawImage(mapBase, 0, 0);
  }
  function drawMap() {
    if (!mapBase) return;
    var c = mapCtx;
    c.clearRect(0, 0, mapW, mapW);
    c.drawImage(mapBase, 0, 0);
    var x = carRig.position.x * mapScale + mapOff.x;
    var y = carRig.position.z * mapScale + mapOff.y;
    var fx = -Math.sin(S.yaw), fz = -Math.cos(S.yaw);
    var a = Math.atan2(fz, fx);
    c.save();
    c.translate(x, y);
    c.rotate(a);
    c.fillStyle = '#ff4d2e';
    c.beginPath();
    c.moveTo(9, 0); c.lineTo(-6, 6); c.lineTo(-3, 0); c.lineTo(-6, -6);
    c.closePath(); c.fill();
    c.restore();
    c.strokeStyle = 'rgba(255,77,46,0.35)';
    c.lineWidth = 1.5;
    c.beginPath(); c.arc(x, y, 13, 0, Math.PI * 2); c.stroke();
  }

  // ---------------------------------------------------------------- input
  function readKeys() {
    var k = KEYS;
    INPUT.throttle = (k['w'] || k['arrowup']) ? 1 : 0;
    INPUT.brake = (k['s'] || k['arrowdown']) ? 1 : 0;
    var st = ((k['a'] || k['arrowleft']) ? 1 : 0) - ((k['d'] || k['arrowright']) ? 1 : 0);
    INPUT.steer = st;
    INPUT.handbrake = !!(k[' '] || k['shift']);
  }
  document.addEventListener('keydown', function (e) {
    var kk = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].indexOf(kk) >= 0) e.preventDefault();
    KEYS[kk] = true;
    if (kk === 'escape' || kk === 'p') togglePause();
    if (kk === 'r' && (S.mode === 'racing' || S.mode === 'countdown' || S.mode === 'paused' || S.mode === 'finished')) restartRace();
    if (kk === 'm') toggleMute();
    if ((kk === 'enter' || kk === ' ') && S.mode === 'garage') startRace();
    if ((kk === 'enter' || kk === ' ') && S.mode === 'finished') restartRace();
    readKeys();
  });
  document.addEventListener('keyup', function (e) {
    KEYS[e.key.toLowerCase()] = false;
    readKeys();
  });
  window.addEventListener('blur', function () { KEYS = {}; readKeys(); });

  function togglePause() {
    if (S.mode === 'racing') {
      S.mode = 'paused';
      $('pause').classList.add('on');
    } else if (S.mode === 'paused') {
      S.mode = 'racing';
      $('pause').classList.remove('on');
      snapChase();
    }
  }
  function toggleMute() {
    A.muted = !A.muted;
    if (A.master) A.master.gain.value = A.muted ? 0 : 0.5;
    $('mute-x').style.display = A.muted ? 'block' : 'none';
    try { localStorage.setItem('pitlane.muted', A.muted ? '1' : '0'); } catch (e) {}
  }

  // touch
  var touchActive = false;
  function bindTouch(el, on, off) {
    ['pointerdown', 'touchstart'].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.preventDefault(); on(); el.classList.add('hit'); }, { passive: false });
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'touchend', 'touchcancel'].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.preventDefault(); off(); el.classList.remove('hit'); }, { passive: false });
    });
  }
  function syncTouch() {
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    // a narrow viewport gets pads too: phones that mis-report pointer type, touch laptops,
    // and a desktop window dragged narrow all need them (and it makes this testable headless)
    var want = coarse || window.innerWidth <= 820 || 'ontouchstart' in window;
    touchActive = want;
    if (want) {
      $('touch').classList.add('on');
      if ($('menuHint')) $('menuHint').textContent = 'Touch controls enabled';
    } else {
      $('touch').classList.remove('on');
    }
    return want;
  }
  function initTouch() {
    syncTouch();
    window.addEventListener('resize', syncTouch);
    window.addEventListener('orientationchange', syncTouch);
    bindTouch($('tL'), function () { KEYS['a'] = true; readKeys(); }, function () { KEYS['a'] = false; readKeys(); });
    bindTouch($('tR'), function () { KEYS['d'] = true; readKeys(); }, function () { KEYS['d'] = false; readKeys(); });
    bindTouch($('tA'), function () { KEYS['w'] = true; readKeys(); }, function () { KEYS['w'] = false; readKeys(); });
    bindTouch($('tB'), function () { KEYS[' '] = true; readKeys(); }, function () { KEYS[' '] = false; readKeys(); });
  }

  // ---------------------------------------------------------------- buttons
  document.addEventListener('click', function (e) {
    var id = e.target.closest ? null : null;
  });
  function bindClick(id, fn) {
    var el = $(id);
    if (el) el.addEventListener('click', function (e) { e.preventDefault(); fn(); });
  }

  // ---------------------------------------------------------------- loop
  var last = 0, running = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!last) last = now;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (window.__game) {
      window.__game.frames = (window.__game.frames || 0) + 1;
      window.__game.dtSum = (window.__game.dtSum || 0) + dt;
      window.__game.lastDt = dt;
    }
    if (!window.__game || !window.__game.pauseSim) {
      readKeys();
      simulate(dt);
      updateDust(dt);
    }
    updateCamera(dt);
    audioUpdate();
    renderer.render(scene, camera);
    updateHud();
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && S.mode === 'racing') togglePause();
  });

  var ready = false;
  function onLoaded() {
    if (ready) return;
    ready = true;
    assetsOK = true;
    buildMap();
    placeOnGrid();
    setProgress(1, 'Ready');
    setTimeout(function () { $('loading').classList.add('done'); }, 220);
    try {
      var b = parseFloat(localStorage.getItem('pitlane.bestlap') || 'NaN');
      if (b === b) { $('spBest').textContent = fmt(b); S.bestLap = b; }
      if (localStorage.getItem('pitlane.muted') === '1') toggleMute();
    } catch (e) {}
    if (window.__game) window.__game.readyFlag = true;
    window.__ready = true;
  }

  // ---------------------------------------------------------------- debug hook
  window.__game = {
    pauseSim: false,
    readyFlag: false,
    lastResult: null,
    state: function () {
      return {
        mode: S.mode, lap: S.lap, laps: CFG.laps, times: S.times.slice(),
        lapTime: S.lapTime, speed: S.speed, kmh: Math.abs(S.speed) * 3.6,
        s: S.s, len: LEN, offTrack: S.offTrack, drift: S.drift,
        yaw: S.yaw, x: carRig.position.x, z: carRig.position.z,
        trackZ: carRig.position.z, bestLap: S.bestLap, topSpeed: S.topSpeed,
        lights: gantryLights.length, wheels: Object.keys(wheels).length,
        carReady: carReady, samples: N, width: HW * 2,
        errors: ERRORS.slice()
      };
    },
    start: startRace,
    restart: restartRace,
    garage: toGarage,
    pause: togglePause,
    mute: toggleMute,
    input: function (o) {
      if (!o) return INPUT;
      if ('throttle' in o) INPUT.throttle = o.throttle;
      if ('brake' in o) INPUT.brake = o.brake;
      if ('steer' in o) INPUT.steer = o.steer;
      if ('handbrake' in o) INPUT.handbrake = o.handbrake;
    },
    /* advance the physics deterministically, without rendering */
    step: function (dt, input) {
      if (input) this.input(input);
      simulate(dt || 1 / 60);
      updateDust(dt || 1 / 60);
    },
    /* centreline sample for the autopilot harness */
    sample: function (dist) {
      var p = poseAt(dist);
      return { x: p.x, z: p.z, tx: p.tx, tz: p.tz, len: LEN };
    },
    place: function (dist, speed) {
      var p = poseAt(dist);
      carRig.position.set(p.x, 0, p.z);
      S.yaw = S.velYaw = yawFromTangent(p.tx, p.tz);
      carRig.rotation.y = S.yaw;
      S.speed = speed || 0;
      S.s = dist; S.prevS = dist;
      lastIdx = 0;
      var l = locate(p.x, p.z, true);
      S.s = l.s;
    },
    hud: function () {
      return {
        speed: $('spd').textContent,
        time: $('curtime').textContent,
        lap: $('lapnum').textContent,
        best: $('bestv').textContent,
        hudOn: $('hud').classList.contains('on'),
        menuOn: $('menu').classList.contains('on'),
        resultsOn: $('results').classList.contains('on'),
        pauseOn: $('pause').classList.contains('on'),
        rows: $('laps').children.length,
        total: $('rtotal').textContent
      };
    },
    lightsOn: function () { return gantryLights.filter(function (o) { return o.material.emissive.getHex() !== 0x3a0d08; }).length; },
    /* hard facts for the verification harness */
    probe: function () {
      var lit = 0, w = renderer.domElement.width, h = renderer.domElement.height;
      try {
        var gl = renderer.getContext();
        var px = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
        for (var i = 0; i < px.length; i += 4 * 41) {
          if (px[i] > 26 || px[i + 1] > 26 || px[i + 2] > 26) lit++;
        }
      } catch (e) { return { lit: -1, err: String(e) }; }
      return { lit: lit, w: w, h: h, tris: renderer.info.render.triangles, calls: renderer.info.render.calls };
    }
  };

  // ---------------------------------------------------------------- boot
  bindClick('start', startRace);
  bindClick('again', restartRace);
  bindClick('tomenu', toGarage);
  bindClick('resume', togglePause);
  bindClick('prestart', restartRace);
  bindClick('pquit', toGarage);
  bindClick('mute', toggleMute);
  bindClick('pausebtn', togglePause);
  initTouch();
  setProgress(0.06, 'Loading circuit');
  loadEverything();
  requestAnimationFrame(frame);
})();
