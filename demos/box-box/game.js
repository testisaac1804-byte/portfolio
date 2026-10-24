/* BOX, BOX — Pit Stop Chief
   A pit-stop timing game. The pit lane from the circuit game is the arena:
   one car, six crew, twelve controls, and a clock that starts when the car stops.

   Design notes worth keeping:
   - Every interactive part is a named node in the GLB (Wheel_FL, Jack_F, Crew_*),
     so the runtime animates the real Blender geometry instead of proxies.
   - Crew are station-locked: the FL crew can only touch the FL wheel. The game is
     therefore about pipelines and ordering, not clicking speed.
   - Release is always available, which is the only way to lose. */
(function () {
  'use strict';

  var GL, scene, camera, renderer, clock;
  var nodes = {}, A = null, wheels = {}, crews = {}, carRoot = null, carBody = null;
  var W = { FL: {}, FR: {}, RL: {}, RR: {} };
  var S = {
    mode: 'menu',        // menu | ready | stop | done
    t: 0, penalty: 0, unsafe: false, released: false,
    round: 0, fuelPct: 0, fuelDone: false,
    lifted: false, jackMoving: 0,
    arrive: 0,           // 0 = parked in box, 1 = at the far end of the lane
    depart: 0,           // 0 = in box, 1 = gone
    wheelsDone: 0, best: null, roundsPlayed: 0
  };

  // ------------------------------------------------------------------ rounds
  // gold/silver/bronze are hard floors, not aspirations: the minimum possible
  // stop is jack 0.8 + wheel (0.9 off + 1.5 on) + jack down 0.6 = 3.8 s, and a
  // cross-threaded nut adds 0.9 s to whichever corner draws it.
  var ROUNDS = [
    { fuel: 3.0, slowNut: false, gold: 4.30, silver: 5.10, bronze: 6.40,
      note: 'Standard stop. Jacks, four wheels, fuel, release.' },
    { fuel: 3.0, slowNut: false, gold: 4.10, silver: 4.90, bronze: 6.20,
      note: 'Same car, tighter clock. Every tenth is yours.' },
    { fuel: 3.2, slowNut: true,  gold: 5.20, silver: 6.00, bronze: 7.40,
      note: 'One nut is cross-threaded: that corner\u2019s wheel-off takes 1.8 s.' },
    { fuel: 5.00, slowNut: true, gold: 5.50, silver: 6.30, bronze: 7.50,
      note: 'A full tank. Fuel now runs longer than the wheels \u2014 start it first.' },
    { fuel: 5.00, slowNut: true, gold: 5.45, silver: 6.20, bronze: 7.40,
      note: 'Final stop. Cross-thread, full tank, and a watchful steward.' }
  ];

  var JOBS = {
    jack:    { kind: 'jackup',   crew: 'JACK', dur: 0.80, label: 'Front jack' },
    jackdn:  { kind: 'jackdown', crew: 'JACK', dur: 0.60, label: 'Jack down' },
    fuel:    { kind: 'fuel',     crew: 'FUEL', dur: 3.00, label: 'Fuel' },
    release: { kind: 'release',  crew: null,   dur: 0,    label: 'Release' }
  };
  ['FL', 'FR', 'RL', 'RR'].forEach(function (st) {
    JOBS['off:' + st] = { kind: 'off', st: st, crew: st, dur: 0.90, label: st + ' off' };
    JOBS['on:' + st]  = { kind: 'on',  st: st, crew: st, dur: 1.50, label: st + ' on' };
  });

  var active = [];   // {key, job, t, dur, crew}

  // ------------------------------------------------------------------ audio
  var SV = { ctx: null, on: true };
  function sInit() {
    if (SV.ctx) return;
    try { SV.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { SV.on = false; }
  }
  function tone(freq, dur, type, gain, slideTo) {
    if (!SV.on || !SV.ctx) return;
    var c = SV.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(gain || 0.09, c.currentTime + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + dur + 0.02);
  }
  function noise(dur, gain, hp) {
    if (!SV.on || !SV.ctx) return;
    var c = SV.ctx, n = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp || 900;
    var g = c.createGain(); g.gain.value = gain || 0.16;
    src.connect(f).connect(g).connect(c.destination); src.start();
  }
  var SFX = {
    gun:  function () { noise(0.30, 0.13, 1400); tone(140, 0.22, 'sawtooth', 0.05, 90); },
    jack: function () { tone(90, 0.20, 'square', 0.07, 60); },
    down: function () { tone(70, 0.24, 'square', 0.07, 46); },
    fuel: function () { noise(0.5, 0.05, 2600); },
    tick: function () { tone(880, 0.05, 'sine', 0.05); },
    go:   function () { tone(660, 0.12, 'square', 0.09); setTimeout(function () { tone(990, 0.16, 'square', 0.09); }, 110); },
    bad:  function () { tone(180, 0.42, 'sawtooth', 0.11, 70); },
    gold: function () { [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { tone(f, 0.26, 'triangle', 0.08); }, i * 95); }); },
    ok:   function () { [523, 784].forEach(function (f, i) { setTimeout(function () { tone(f, 0.2, 'triangle', 0.07); }, i * 90); }); }
  };

  // ------------------------------------------------------------------ three
  function initThree() {
    var canvas = document.getElementById('gl');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1017);
    scene.fog = new THREE.Fog(0x0b1017, 26, 64);

    camera = new THREE.PerspectiveCamera(33, 1, 0.1, 200);
    camera.position.set(-5.4, 6.8, 9.6);

    scene.add(new THREE.HemisphereLight(0x9fb4d4, 0x1a140f, 0.30));

    var dir = new THREE.DirectionalLight(0xfff2e2, 1.15);
    dir.position.set(-8, 12, 7);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 1; dir.shadow.camera.far = 40;
    dir.shadow.camera.left = -12; dir.shadow.camera.right = 12;
    dir.shadow.camera.top = 12; dir.shadow.camera.bottom = -12;
    dir.shadow.bias = -0.0012;
    scene.add(dir);

    var warm = new THREE.PointLight(0xffd7a8, 6, 22, 2);
    warm.position.set(1.6, 4.6, -1.2);
    scene.add(warm);
    var cool = new THREE.PointLight(0x9fc4ff, 4, 24, 2);
    cool.position.set(-4.2, 4.0, 6.0);
    scene.add(cool);

    clock = new THREE.Clock();
    window.addEventListener('resize', resize);
    resize();
  }

  function resize() {
    var st = document.getElementById('stage');
    var w = st.clientWidth || window.innerWidth, h = st.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    // pull the camera back on tall screens so the car never crops
    var aspect = camera.aspect;
    camera.fov = aspect < 0.95 ? 46 : 33;
    camera.updateProjectionMatrix();
  }

  function loadScene() {
    return new Promise(function (resolve, reject) {
      new THREE.GLTFLoader().load('assets/pitbox.glb', function (gltf) {
        GL = gltf.scene;
        GL.traverse(function (o) {
          if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
          if (o.name) nodes[o.name] = o;
        });
        scene.add(GL);
        carRoot = nodes['Car'] || null;
        carBody = nodes['CarBody'] || null;
        ['FL', 'FR', 'RL', 'RR'].forEach(function (st) {
          var key = 'Wheel_' + st;
          if (nodes[key]) {
            wheels[st] = nodes[key];
            W[st] = { stage: 'on', out: 0, home: nodes[key].position.clone() };
          }
        });
        ['FL', 'FR', 'RL', 'RR', 'JACK', 'FUEL'].forEach(function (c) {
          var key = 'Crew_' + c;
          if (nodes[key]) crews[c] = { ob: nodes[key], busy: false, job: null, q: [], lean: 0, home: nodes[key].position.clone(), baseRot: nodes[key].rotation.x };
        });
        resolve();
      }, undefined, reject);
    });
  }

  // ------------------------------------------------------------------ helpers
  function $(id) { return document.getElementById(id); }
  function wheelStates() {
    var n = 0;
    ['FL', 'FR', 'RL', 'RR'].forEach(function (s) { if (W[s].stage === 'fitted') n++; });
    return n;
  }
  function allWheelsOn() { return wheelStates() === 4; }
  function canRelease() { return allWheelsOn() && S.fuelDone && !S.lifted; }
  function round() { return ROUNDS[S.round]; }

  function jackComing() {
    for (var i = 0; i < active.length; i++) if (active[i].job.kind === 'jackup') return true;
    return false;
  }

  function busyCrew(key) {
    if (!key) return false;
    for (var i = 0; i < active.length; i++) if (active[i].crew === key) return true;
    var c = crews[key];
    return !!(c && c.q.length);
  }

  function jobState(key) {
    var j = JOBS[key];
    if (!j) return 'off';
    if (S.mode !== 'stop') return 'disabled';
    if (key === 'release') return 'ready';
    if (key === 'jack') return S.lifted ? 'done' : (busyCrew('JACK') ? 'busy' : 'ready');
    if (key === 'jackdn') {
      if (!S.lifted) return 'disabled';
      if (!allWheelsOn()) return 'disabled';
      return busyCrew('JACK') ? 'busy' : 'ready';
    }
    if (key === 'fuel') {
      if (S.fuelDone) return 'done';
      return busyCrew('FUEL') ? 'busy' : 'ready';
    }
    var st = j.st;
    if (j.kind === 'off') {
      // the crew can stand over the gun while the jack is still coming up
      if (!S.lifted && !jackComing()) return 'disabled';
      if (W[st].stage !== 'on') return 'done';
      return busyCrew(st) ? 'busy' : 'ready';
    }
    if (j.kind === 'on') {
      if (W[st].stage === 'fitted') return 'done';
      // queueable while this corner's wheel-off is running or queued
      if (W[st].stage === 'on' && !busyCrew(st)) return 'disabled';
      return busyCrew(st) ? 'busy' : 'ready';
    }
    return 'ready';
  }

  function dispatch(key) {
    if (S.mode !== 'stop') return false;
    var j = JOBS[key];
    if (!j) return false;
    var st = jobState(key);
    if (st === 'disabled' || st === 'done') { SFX.bad(); return false; }
    if (key === 'release') { doRelease(); return true; }

    // already running or queued?
    for (var i = 0; i < active.length; i++) if (active[i].key === key) return false;
    var c = crews[j.crew];
    if (c) for (var k = 0; k < c.q.length; k++) if (c.q[k] === key) return false;

    if (busyCrew(j.crew) && c) { c.q.push(key); refresh(); SFX.tick(); return true; }
    startJob(key);
    return true;
  }

  function startJob(key) {
    var j = JOBS[key];
    var dur = (key === 'fuel') ? round().fuel : j.dur;
    if (j.kind === 'off' && round().slowNut && S.slowSt === j.st) dur = 1.80;
    active.push({ key: key, job: j, t: 0, dur: dur, crew: j.crew });
    if (j.crew && crews[j.crew]) crews[j.crew].busy = true;
    if (j.kind === 'jackup') SFX.jack();
    else if (j.kind === 'jackdown') SFX.down();
    else if (j.kind === 'fuel') SFX.fuel();
    else SFX.gun();
    refresh();
  }

  function finishJob(a) {
    var j = a.job;
    if (j.kind === 'jackup') { S.lifted = true; }
    else if (j.kind === 'jackdown') { S.lifted = false; }
    else if (j.kind === 'fuel') { S.fuelDone = true; S.fuelPct = 1; }
    else if (j.kind === 'off') { W[j.st].stage = 'off'; }
    else if (j.kind === 'on') { W[j.st].stage = 'fitted'; }
    if (a.crew && crews[a.crew]) {
      crews[a.crew].busy = false;
      var q = crews[a.crew].q;
      if (q.length) { var nxt = q.shift(); setTimeout(function () { startJob(nxt); }, 30); }
    }
    refresh();
  }

  function doRelease() {
    S.released = true;
    var safe = canRelease();
    if (!safe) {
      S.unsafe = true;
      S.penalty += 5;
      SFX.bad();
      var t = $('toast'); t.textContent = 'Unsafe release · +5.00s'; t.classList.add('show');
      setTimeout(function () { t.classList.remove('show'); }, 1900);
    } else {
      SFX.ok();
    }
    finishStop();
  }

  function finishStop() {
    S.mode = 'done';
    var total = S.t + S.penalty;
    var r = round();
    var medal = 'none';
    if (!S.unsafe) {
      if (total <= r.gold) medal = 'gold';
      else if (total <= r.silver) medal = 'silver';
      else if (total <= r.bronze) medal = 'bronze';
    }
    if (!S.unsafe && (S.best === null || total < S.best)) {
      S.best = total;
      try { localStorage.setItem('boxbox.best', String(total)); } catch (e) {}
    }
    if (medal === 'gold') SFX.gold();

    // show results after the car has cleared the box
    $('rTime').textContent = total.toFixed(2);
    $('rMedal').className = medal;
    $('rMedal').textContent = S.unsafe ? 'Unsafe release' : (medal === 'none' ? 'No medal' : medal);
    $('rWheels').textContent = wheelStates() + '/4 on';
    $('rFuel').textContent = S.fuelDone ? 'in' : 'not in';
    $('rPen').textContent = S.penalty ? '+' + S.penalty.toFixed(2) + 's' : '—';
    $('rBest').textContent = S.best === null ? '—' : S.best.toFixed(2) + 's';
    $('rTitle').textContent = S.round >= ROUNDS.length - 1 ? 'Final stop' : 'Stop complete';
    var warn = $('rWarn');
    if (S.unsafe) {
      warn.className = 'warnbox show';
      warn.textContent = 'Released with the car not ready: ' + (S.lifted ? 'still on the jacks. ' : '') +
        (wheelStates() < 4 ? (4 - wheelStates()) + ' wheel(s) not on. ' : '') +
        (S.fuelDone ? '' : 'Fuel rig still attached. ') + 'Five second penalty, no medal.';
    } else warn.className = 'warnbox';
    $('btnNext').textContent = S.round >= ROUNDS.length - 1 ? 'Run it again' : 'Next round';
    $('rNote').textContent = S.round >= ROUNDS.length - 1
      ? 'That was the last stop of the championship. Your best stop is kept.'
      : 'Next: ' + ROUNDS[S.round + 1].note;
    setTimeout(function () { $('results').classList.add('show'); }, 900);
    refresh();
  }

  // ------------------------------------------------------------------ rounds
  function setRound(i) {
    S.round = Math.max(0, Math.min(ROUNDS.length - 1, i));
    var r = ROUNDS[S.round];
    $('roundNo').textContent = String(S.round + 1);
    $('target').textContent = 'Gold ' + r.gold.toFixed(2) + ' · Silver ' + r.silver.toFixed(2);
    // a cross-threaded corner is drawn per round so it is not always the same one
    var corners = ['FL', 'FR', 'RL', 'RR'];
    S.slowSt = r.slowNut ? corners[(S.round * 3 + S.roundsPlayed) % 4] : null;
    setStationNotes();
  }

  function setStationNotes() {
    ['FL', 'FR', 'RL', 'RR'].forEach(function (st) {
      var b = document.querySelector('[data-job="off:' + st + '"]');
      if (!b) return;
      b.classList.toggle('slow', S.slowSt === st);
      b.title = (S.slowSt === st) ? 'Cross-threaded nut: this wheel-off takes 1.8 s' : '';
    });
  }

  function resetStop() {
    S.mode = 'ready';
    S.t = 0; S.penalty = 0; S.unsafe = false; S.released = false;
    S.fuelPct = 0; S.fuelDone = false; S.lifted = false;
    S.arrive = 1; S.depart = 0;
    active.length = 0;
    ['FL', 'FR', 'RL', 'RR'].forEach(function (st) {
      W[st].stage = 'on'; W[st].out = 0;
      if (wheels[st]) wheels[st].position.copy(W[st].home);
    });
    Object.keys(crews).forEach(function (k) { crews[k].busy = false; crews[k].q.length = 0; crews[k].job = null; });
    if (carRoot) { carRoot.position.z = -14; }
    setRound(S.round);
    $('clock').textContent = '0.00';
    $('clock').className = '';
    $('results').classList.remove('show');
    $('menu').classList.remove('show');
    $('toast').classList.remove('show');
    refresh();
    runCountdown();
  }

  var cd = { on: false, t: 0, step: -1 };
  function runCountdown() {
    cd.on = true; cd.t = 0; cd.step = 0;
    var bulbs = document.querySelectorAll('#lights .bulb');
    for (var i = 0; i < bulbs.length; i++) bulbs[i].className = 'bulb';
    $('brief').textContent = round().note;
    $('lights').classList.add('show');
  }

  function updateCountdown(dt) {
    if (!cd.on) return;
    cd.t += dt;
    var bulbs = document.querySelectorAll('#lights .bulb');
    // car arrives while the lights come down: 5 reds over 1.75 s
    var reds = Math.min(5, Math.floor(cd.t / 0.35) + 1);
    S.arrive = Math.max(0, 1 - Math.min(1, cd.t / 1.75));
    for (var i = 0; i < bulbs.length; i++) {
      bulbs[i].className = 'bulb' + (i < reds && cd.t < 1.75 ? ' red' : '');
      if (cd.t >= 1.75) bulbs[i].className = 'bulb green';
    }
    if (cd.t >= 1.75 && cd.step === 0) { cd.step = 1; SFX.go(); }
    if (cd.t >= 2.35) {
      cd.on = false;
      $('lights').classList.remove('show');
      S.mode = 'stop'; S.t = 0; S.arrive = 0;
      refresh();
    }
  }

  // ------------------------------------------------------------------ refresh UI
  var BTN = {};
  function refresh() {
    document.querySelectorAll('button.job').forEach(function (b) {
      var key = b.getAttribute('data-job');
      BTN[key] = b;
      var st = jobState(key);
      b.className = 'job' + (key === 'release' ? ' primary' : '');
      b.disabled = (st === 'disabled' || st === 'done' || S.mode !== 'stop');
      if (st === 'done') b.classList.add('done');
      if (st === 'busy') b.classList.add('busy');
      if (st === 'queued') b.classList.add('queued');
    });
    // queued badges live on the text, easiest read at a glance
    ['jack', 'jackdn', 'fuel', 'release'].forEach(function () {});
    Object.keys(crews).forEach(function (c) {});
    // status rail
    $('chipFront').className = 'chip' + (S.lifted ? ' on' : '');
    $('chipFront').querySelector('i').textContent = S.lifted ? 'UP' : 'down';
    $('chipRear').className = 'chip' + (S.lifted ? ' on' : '');
    $('chipRear').querySelector('i').textContent = S.lifted ? 'UP' : 'down';
    $('chipFuel').className = 'chip' + (S.fuelDone ? ' on' : '');
    $('fuelBar').style.width = Math.round(S.fuelPct * 100) + '%';
    $('chipWheels').className = 'chip' + (allWheelsOn() ? ' on' : '');
    $('chipWheels').querySelector('i').textContent = wheelStates() + '/4';
    ['FL', 'FR', 'RL', 'RR'].forEach(function (st) {
      var box = document.querySelector('.station[data-st="' + st + '"]');
      if (box) box.classList.toggle('hot', W[st].stage === 'fitted');
      var em = $('st' + st);
      if (em) {
        em.textContent = W[st].stage === 'fitted' ? 'FITTED'
                       : (W[st].stage === 'off' ? 'OFF HUB' : 'ON HUB');
        em.style.color = W[st].stage === 'fitted' ? 'var(--ok)'
                       : (W[st].stage === 'off' ? 'var(--warn)' : 'var(--dim)');
      }
      var offBtn = BTN['off:' + st];
      if (offBtn) offBtn.classList.toggle('slow', S.slowSt === st);
    });
    if (BTN.jack) BTN.jack.textContent = S.lifted ? 'Jacked' : 'Jack up';
    if (BTN.fuel) BTN.fuel.textContent = S.fuelDone ? 'Fuel in' : 'Fuel';
  }

  // ------------------------------------------------------------------ loop
  function step(dt) {
    if (S.mode === 'stop') {
      S.t += dt;
      $('clock').textContent = (S.penalty ? (S.t + S.penalty) : S.t).toFixed(2);
      if (S.penalty) $('clock').className = 'pen'; else $('clock').className = 'live';
    }
    updateCountdown(dt);

    // jobs
    for (var i = active.length - 1; i >= 0; i--) {
      var a = active[i];
      // a job can be dispatched early but only makes progress once its
      // prerequisite is actually satisfied: guns wait for the jack, a new
      // tyre waits for the old one to come off
      var blocked = (a.job.kind === 'off' && !S.lifted) ||
                    (a.job.kind === 'on' && W[a.job.st].stage !== 'off');
      if (!blocked) a.t += dt;
      if (a.job.kind === 'fuel') S.fuelPct = Math.min(1, a.t / a.dur);
      if (a.t >= a.dur) { active.splice(i, 1); finishJob(a); }
    }

    // car position: arrive from the pit entry, depart down the lane
    if (carRoot) {
      if (S.mode === 'stop' || S.mode === 'ready') {
        S.depart = Math.max(0, S.depart - dt * 0.9);
      }
      if (S.mode === 'done') S.depart = Math.min(1, S.depart + dt * 0.55);
      var z = -14 * S.arrive + 15 * S.depart;
      carRoot.position.z += (z - carRoot.position.z) * Math.min(1, dt * 9);
    }
    // body lifts on the jacks
    if (carBody) {
      var lift = S.lifted ? 0.11 : 0;
      carBody.position.y += (lift - carBody.position.y) * Math.min(1, dt * 7);
    }
    // wheels slide off/on and spin while a gun is on them
    ['FL', 'FR', 'RL', 'RR'].forEach(function (st) {
      var w = wheels[st]; if (!w) return;
      var target = (W[st].stage === 'off') ? 1 : 0;
      W[st].out += (target - W[st].out) * Math.min(1, dt * 8);
      var dir = (st === 'FL' || st === 'RL') ? 1 : -1;
      w.position.x = W[st].home.x + dir * W[st].out * 0.55;
      w.position.z = W[st].home.z + W[st].out * 0.05;
      var spinning = active.some(function (a) { return a.job.st === st; });
      if (spinning) w.rotation.x += dt * 9;
    });
    // crew lean into the wheel they are working
    Object.keys(crews).forEach(function (k) {
      var c = crews[k];
      var want = (c.busy || c.q.length) ? 1 : 0;
      c.lean += (want - c.lean) * Math.min(1, dt * 6);
      var bob = c.busy ? Math.sin(performance.now() / 90) * 0.02 : 0;
      c.ob.rotation.x = (c.baseRot || 0) - c.lean * 0.22 + bob;
    });

    // gentle parallax so the box feels alive without a camera rig
    var px = (pointer.x || 0), py = (pointer.y || 0);
    var cx = -5.4 + px * 0.5, cy = 6.8 - py * 0.32, cz = 9.6;
    camera.position.x += (cx - camera.position.x) * Math.min(1, dt * 2.2);
    camera.position.y += (cy - camera.position.y) * Math.min(1, dt * 2.2);
    camera.position.z += (cz - camera.position.z) * Math.min(1, dt * 2.2);
    camera.lookAt(0.45, 0.62, -0.5);
  }

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(0.05, clock.getDelta());
    step(dt);
    renderer.render(scene, camera);
  }

  var pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ------------------------------------------------------------------ input
  document.querySelectorAll('button.job').forEach(function (b) {
    b.addEventListener('click', function () { dispatch(b.getAttribute('data-job')); });
  });
  var KEYS = { '1': 'off:FL', '2': 'off:FR', '3': 'off:RL', '4': 'off:RR',
               '5': 'on:FL', '6': 'on:FR', '7': 'on:RL', '8': 'on:RR',
               '9': 'jack', 'q': 'jackdn', 'w': 'fuel', ' ': 'release', 'enter': 'release' };
  window.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    if (KEYS[k]) { e.preventDefault(); dispatch(KEYS[k]); }
  });

  $('btnStart').addEventListener('click', function () { sInit(); resetStop(); });
  $('btnNext').addEventListener('click', function () {
    $('results').classList.remove('show');
    // after the last round the championship loops but the best stop stands
    if (S.round < ROUNDS.length - 1) S.round += 1; else S.round = 0;
    S.roundsPlayed += 1;
    setRound(S.round);
    resetStop();
  });

  // ------------------------------------------------------------------ boot
  function boot() {
    initThree();
    var savedBest = null;
    try { savedBest = parseFloat(localStorage.getItem('boxbox.best')); } catch (e) {}
    S.best = (savedBest && isFinite(savedBest)) ? savedBest : null;
    $('menuBest').textContent = S.best === null ? '—' : S.best.toFixed(2) + 's';

    loadScene().then(function () {
      setRound(0);
      refresh();
      animate();
      window.__ready = true;
    }).catch(function (err) {
      console.error('load failed', err);
      window.__loadError = String(err && err.message || err);
    });
  }

  // QA hook: the same dispatch path the buttons use, plus readable state
  window.__g = {
    state: function () {
      return { mode: S.mode, t: +S.t.toFixed(3), penalty: S.penalty, unsafe: S.unsafe,
        wheels: wheelStates(), fuel: S.fuelDone, fuelPct: +S.fuelPct.toFixed(2),
        lifted: S.lifted, round: S.round + 1, best: S.best,
        jobs: active.map(function (a) { return a.key + ':' + a.t.toFixed(2) + '/' + a.dur; }),
        queued: Object.keys(crews).reduce(function (n, k) { return n + crews[k].q.length; }, 0) };
    },
    do: dispatch,
    reset: function (i) { if (typeof i === 'number') setRound(i); resetStop(); },
    skipCountdown: function () { cd.t = 99; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
