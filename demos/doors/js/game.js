/* ═══════════════════════════════════════════════════════════════════════════
   DOORS — the run: state machine, interaction, threats, menus, loop.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (NS) {
  'use strict';
  const U = NS.util, P = NS.player, A = NS.audio;
  const G = NS.game = {
    state: 'loading', mode: 'hotel', paused: false, godmode: false,
    doorNum: 1, doorsPassed: 0, deaths: 0, startedAt: 0, elapsed: 0,
    timers: [], shakeT: 0, shakeAmt: 0, torque: 0, powered: false, lit: []
  };

  /* ── tiny helpers ─────────────────────────────────────────────────────── */
  const $ = (id) => document.getElementById(id);
  G.playing = () => G.state === 'playing';
  G.shake = function (amt) { G.shakeAmt = Math.max(G.shakeAmt, amt); G.shakeT = 0.5; };
  G.after = function (secs, fn) { G.timers.push({ at: G.elapsed + secs, fn }); };

  /* ── boot ─────────────────────────────────────────────────────────────── */
  G.boot = function () {
    NS.view.init();
    NS.hud.init();
    NS.input.init();
    $('load-bar').style.width = '55%';
    G.buildMenuScene();
    G.wireMenus();
    G.floorList();
    $('load-bar').style.width = '100%';
    setTimeout(() => { G.show('lobby'); G.state = 'lobby'; }, 420);
    requestAnimationFrame(G.frame);
  };

  /* the lobby is not a static image: a real hallway sits behind the scrim,
     drifting forward so the menu breathes without a video file */
  G.buildMenuScene = function () {
    NS.world.mode = 'hotel';
    NS.world.clear();
    const r = NS.world.add(1, 'hotel');
    NS.world.add(2, 'hotel');
    P.x = 0; P.z = r.group.position.z - 2.2; P.yaw = 0; P.pitch = 0;
    NS.view.camera.position.set(0, 1.62, P.z);
    NS.view.camera.rotation.set(0, 0, 0);
    NS.view.torch.intensity = 0;
    G.doorNum = 1;
  };

  /* ── screens ──────────────────────────────────────────────────────────── */
  G.show = function (name) {
    ['loading', 'lobby', 'floors', 'howto', 'settings', 'pause', 'dead', 'won']
      .forEach((s) => $(s).classList.toggle('on', s === name));
  };
  G.hideScreens = function () {
    ['lobby', 'floors', 'howto', 'settings', 'pause', 'dead', 'won', 'loading']
      .forEach((s) => $(s).classList.remove('on'));
  };

  /* ── the official floor list ──────────────────────────────────────────── */
  const FLOORS = [
    {
      kind: 'Main floor', name: 'Floor 1 — The Hotel', live: true,
      desc: 'The iconic starting area. Grand hallways, a massive library, a dark greenhouse, and an electrical circuit puzzle at Door 100. Escape is an elevator.'
    },
    {
      kind: 'Main floor', name: 'Floor 2 — The Mines', live: false,
      desc: 'Direct continuation after the Floor 1 elevator crash. Water hazards, narrow tunnels, moving minecarts, and Grumbles.'
    },
    {
      kind: 'Main floor', name: 'Floor 3 — The Castle / Dungeon', live: false,
      desc: 'A dark medieval castle above the dam area. In development at the time of writing.'
    },
    {
      kind: 'Subfloor', name: 'The Backdoor', live: true,
      desc: '50 backwards-numbered rooms, −50 to −01, on a strict countdown you refill by pulling levers.'
    },
    {
      kind: 'Subfloor', name: 'The Rooms', live: false,
      desc: 'A 1,000-room retro office labyrinth with A-60, A-90 and A-120. The Starlight Jug is at the very end.'
    },
    {
      kind: 'Subfloor', name: 'The Archives', live: false,
      desc: 'Sector-based explore-and-collect: the Botanical Wing, the Structural Anomaly, and special items.'
    },
    {
      kind: 'Subfloor', name: 'The Outdoors', live: false,
      desc: 'Forest and maze. A relentless chase sequence, and the Groundskeeper at the end of it.'
    },
    {
      kind: 'Subfloor', name: 'The Stairwell', live: false,
      desc: 'Endless staircase landings and depot stations. Some of them connect back into The Mines.'
    }
  ];
  G.floorList = function () {
    const host = $('floor-list');
    host.innerHTML = FLOORS.map((f) => (
      '<div class="floor' + (f.live ? ' playable' : '') + '">' +
      '<div><p class="kind">' + f.kind + '</p><h3>' + f.name + '</h3></div>' +
      '<span class="chip ' + (f.live ? 'live">Playable' : 'dev">In development') + '</span>' +
      '<p>' + f.desc + '</p></div>'
    )).join('');
  };

  /* ── menus ────────────────────────────────────────────────────────────── */
  G.wireMenus = function () {
    const start = (mode) => { A.init(); A.setVolume(NS.settings.vol); G.start(mode); };
    $('btn-play').onclick = () => start('hotel');
    $('btn-backdoor').onclick = () => start('backdoor');
    $('btn-floors').onclick = () => G.show('floors');
    $('btn-floors-back').onclick = () => G.show('lobby');
    $('btn-howto').onclick = () => G.show('howto');
    $('btn-howto-back').onclick = () => G.show('lobby');
    $('btn-settings').onclick = () => G.show('settings');
    $('btn-settings-back').onclick = () => G.show(G._fromSettings || 'lobby');
    $('btn-pause').onclick = () => G.togglePause();
    $('btn-resume').onclick = () => G.togglePause(false);
    $('btn-pause-settings').onclick = () => { G._fromSettings = 'pause'; G.show('settings'); };
    $('btn-quit').onclick = () => G.toLobby();
    $('btn-retry').onclick = () => { A.init(); G.start(G.mode, G.retryDoor); };
    $('btn-dead-lobby').onclick = () => G.toLobby();
    $('btn-again').onclick = () => { A.init(); G.start(G.mode); };
    $('btn-won-lobby').onclick = () => G.toLobby();
    window.addEventListener('pointerdown', () => { A.init(); }, { once: true });

    // settings
    const sens = $('s-sens'), vol = $('s-vol'), qual = $('s-quality');
    sens.value = NS.settings.sens; vol.value = NS.settings.vol; qual.value = NS.settings.quality;
    $('o-sens').textContent = NS.settings.sens + '%';
    $('o-vol').textContent = NS.settings.vol + '%';
    $('o-quality').textContent = NS.settings.quality + '%';
    sens.oninput = () => { NS.settings.sens = +sens.value; $('o-sens').textContent = sens.value + '%'; NS.saveSettings(); };
    vol.oninput = () => {
      NS.settings.vol = +vol.value; $('o-vol').textContent = vol.value + '%';
      A.setVolume(NS.settings.vol); NS.saveSettings();
    };
    qual.oninput = () => {
      NS.settings.quality = +qual.value; $('o-quality').textContent = qual.value + '%';
      NS.view.setQuality(NS.settings.quality); NS.saveSettings();
    };
  };

  G.toLobby = function () {
    G.state = 'lobby'; G.paused = false;
    if (document.pointerLockElement) document.exitPointerLock();
    NS.entities.reset();
    NS.hud.show(false);
    G.buildMenuScene();
    G.show('lobby');
    $('vign').style.opacity = 0;
  };

  /* ── start a run ──────────────────────────────────────────────────────── */
  G.start = function (mode, fromDoor) {
    G.mode = mode || 'hotel';
    NS.world.mode = G.mode;
    NS.entities.reset();
    NS.world.clear();
    P.reset();
    G.timers = []; G.elapsed = 0; G.deaths = G.deaths || 0;
    G.powered = false; G.lit = []; G.shakeAmt = 0;
    G.timer = G.mode === 'backdoor' ? 46 : 0;
    G.doorNum = fromDoor || (G.mode === 'backdoor' ? -50 : 1);
    G.cur = G.mode === 'backdoor' ? (fromDoor ? 51 + fromDoor : 1) : (fromDoor || 1);
    G.retryDoor = fromDoor || (G.mode === 'backdoor' ? -50 : 1);
    G.doorsPassed = 0;
    G.hideScreens();
    NS.hud.show(true);
    NS.hud.bars(); NS.hud.items();

    if (G.cur > 1) NS.world.add(G.cur - 1, G.mode);
    const room = NS.world.add(G.cur, G.mode);
    NS.world.add(G.cur + 1, G.mode);
    P.z = room.group.position.z - 1.6; P.x = 0; P.yaw = 0; P.pitch = 0;
    NS.view.camera.position.set(0, 1.62, P.z);
    NS.view.camera.rotation.set(0, 0, 0);
    $('vign').style.opacity = 0;
    G.state = 'playing'; G.paused = false;
    G.enterRoom(room, true);
    // prompt for pointer lock on desktop
    if (!('ontouchstart' in window)) NS.hud.hint('Click to look around', 3.2);
    A.ambienceLevel(0.9);
  };

  /* the Backdoor counts backwards from −50 to −01, so its plaque needs the
     leading zero that a plain number would drop */
  const bdLabel = (n) => '-' + String(Math.abs(n)).padStart(2, '0');

  G.enterRoom = function (room, first) {
    G.room = room;
    NS.hud.door(G.mode === 'backdoor' ? bdLabel(G.doorNum) : G.cur);
    NS.view.scene.fog.density = room.type === 'greenhouse' ? 0.085 : 0.07;
    if (room.type === 'circuit') {
      NS.hud.titleCard('Door 100', 'The Figure', 'it is blind. it is not deaf.', 4.2);
      NS.entities.figureSpawn(room);
      NS.hud.hint('Breakers A, C, E. Crouch, and do not touch B or D.', 5);
    } else if (first && G.mode === 'hotel' && G.cur === 1) {
      NS.hud.titleCard('Floor 1', 'The Hotel', 'one hundred doors', 3.6);
    } else if (first && G.mode === 'backdoor') {
      NS.hud.titleCard('Subfloor', 'The Backdoor', 'the clock is the level', 3.4);
      NS.hud.hint('Pull the levers. The timer is the only thing keeping it shut.', 4.4);
    }
    G.schedule(room);
  };

  /* threats are scheduled per room, deterministically, in game seconds */
  G.schedule = function (room) {
    const idx = room.idx;
    const r = U.rng(idx * 7919 + 17);
    if (G.mode === 'backdoor') {
      if (idx > 2 && r() < 0.4) {
        G.after(2.4 + r() * 2, () => {
          if (!G.playing()) return;
          NS.entities.flicker(1.1);
          NS.hud.hint('Something is walking the corridor behind you.', 2.6);
          if (!NS.entities.chaser) NS.entities.chaserSpawn();
        });
      }
      return;
    }
    if (room.type === 'circuit') return;
    if (idx % 9 === 0 && idx < 100) {
      G.after(2.1, () => {
        if (!G.playing()) return;
        NS.entities.flicker(1.5);
        NS.hud.hint('Hide. Now.', 2.2);
        G.after(1.25, () => { if (G.playing()) NS.entities.spawnRush({ passes: 1 }); });
      });
    } else if (idx % 14 === 0 && idx < 100) {
      G.after(1.9, () => {
        if (!G.playing()) return;
        NS.entities.flicker(1.2);
        NS.hud.hint('It comes more than once.', 2.4);
        G.after(1.1, () => { if (G.playing()) NS.entities.spawnRush({ passes: 3 }); });
      });
    } else if (idx % 23 === 5) {
      G.after(2.6, () => { if (G.playing()) NS.entities.spawnHalt(room); });
    } else if (room.dark && r() < 0.45) {
      G.after(3.2 + r() * 2, () => { if (G.playing()) NS.entities.spawnScreech(); });
    }
  };

  /* ── interaction ──────────────────────────────────────────────────────── */
  function facing(x, z, maxDist, minDot) {
    const dx = x - P.x, dz = z - P.z, d = Math.hypot(dx, dz);
    if (d > maxDist) return 0;
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(NS.view.camera.quaternion);
    const dot = (fwd.x * dx + fwd.z * dz) / (d || 1);
    return dot > (minDot == null ? 0.35 : minDot) ? 1 - d / (maxDist + 1) : 0;
  }

  G.candidates = function () {
    const room = G.room, out = [];
    if (!room) return out;
    if (P.hidden) {
      out.push({ label: 'Step out', act: () => G.unhide(), s: 9 });
      return out;
    }
    // door
    if (room.door && !room.door.open) {
      const s = facing(room.door.hinge.position.x + room.group.position.x, room.door.z, 2.6, 0.25);
      if (s) {
        const locked = room.door.locked;
        let label = 'Open the door';
        if (locked) label = room.door.need === 'key' ? (P.keys > 0 ? 'Unlock with the key' : 'Locked — find the key')
          : (P.picks > 0 ? 'Pick the lock (' + P.picks + ')' : 'Locked — no picks left');
        out.push({ label, act: () => G.openDoor(room), s: s + 0.5 });
      }
    }
    room.items.forEach((it) => {
      if (it.taken) return;
      const s = facing(it.x, it.z, 2.4, 0.3);
      if (s) out.push({
        label: it.kind === 'key' ? 'Take the key' : it.kind === 'battery' ? 'Take the battery' : 'Take it',
        act: () => G.take(it), s: s + 0.4
      });
    });
    (room.levers || []).forEach((lv) => {
      if (lv.on) return;
      const s = facing(lv.x, lv.z, 2.5, 0.3);
      if (s) out.push({
        label: room.type === 'circuit' ? 'Throw breaker ' + lv.id : room.type === 'backdoor' ? 'Pull the lever' : 'Throw the breaker',
        act: () => G.lever(room, lv), s: s + 0.4
      });
    });
    (room.hideSpots || []).forEach((h) => {
      const s = facing(h.x, h.z, 2.5, 0.2);
      if (s) out.push({ label: 'Hide', act: () => G.hide(h), s: s + 0.2 });
    });
    if (room.elevator && G.powered) {
      const s = facing(0, room.elevator.z + 1.2, 3.2, 0.2);
      if (s) out.push({ label: 'Call the elevator', act: () => G.escape(), s: s + 0.8 });
    }
    out.sort((a, b) => b.s - a.s);
    return out;
  };

  G.interact = function () {
    if (!G.playing() || G.paused) return;
    const c = G.candidates();
    if (c.length) c[0].act();
  };

  G.openDoor = function (room) {
    const d = room.door;
    if (d.locked) {
      if (d.need === 'key' && P.keys > 0) { P.keys--; d.locked = false; NS.hud.items(); A.ping(700); NS.hud.hint('The key turns.', 1.6); }
      else if (d.need === 'pick' && P.picks > 0) { P.picks--; d.locked = false; NS.hud.items(); A.lever(); NS.hud.hint('The lock gives.', 1.6); }
      else { A.thud(0.25); NS.hud.hint(d.need === 'key' ? 'It needs a key.' : 'It needs a lockpick.', 2); return; }
    }
    d.open = true;
    A.door(true);
    G.after(0.18, () => {
      const next = NS.world.find(room.idx + 1);
      if (!next) NS.world.add(room.idx + 1, G.mode);
    });
  };

  G.take = function (it) {
    it.taken = true;
    it.obj.visible = false;
    if (it.kind === 'key') { P.keys++; NS.hud.hint('A key. It fits something ahead.', 2); A.ping(1180); }
    else if (it.kind === 'battery') { P.battery = Math.min(100, P.battery + 45); NS.hud.hint('Torch battery +45%.', 1.8); A.ping(880); }
    NS.hud.items();
  };

  G.lever = function (room, lv) {
    if (lv.on) return;
    lv.on = true; lv.obj.rotation.x = -0.6;
    A.lever();
    if (room.type === 'circuit') {
      lv.lamp.material = new THREE.MeshStandardMaterial({ color: 0x1a5a2a, emissive: 0x33ff66, emissiveIntensity: 1.2 });
      const right = ['A', 'C', 'E'].includes(lv.id);
      if (!right) {
        NS.hud.hint('Wrong breaker. It heard that.', 2.6);
        if (NS.entities.figure) {
          NS.entities.figure.target = { x: P.x, z: P.z };
          NS.entities.figure.state = 'chase';
          NS.entities.figure.eye.intensity = 1.2;
        }
        A.screech();
        return;
      }
      G.lit.push(lv.id);
      const need = ['A', 'C', 'E'].filter((x) => !G.lit.includes(x));
      if (need.length === 0) {
        G.powered = true;
        NS.hud.hint('The lift answers. Get in.', 3.4);
        A.ding();
        room.elevator.powered = true;
      } else {
        NS.hud.hint('Power: ' + G.lit.join(' · ') + ' — still need ' + need.join(' · '), 2.6);
      }
    } else if (room.type === 'backdoor') {
      G.timer = Math.min(99, G.timer + (lv.fuel || 22));
      NS.hud.hint('+' + (lv.fuel || 22) + ' seconds.', 1.8);
      A.ping(1320);
    } else {
      NS.hud.hint('Somewhere, a motor starts.', 1.8);
    }
  };

  G.hide = function (h) {
    P.hidden = true;
    G._hideFrom = { x: P.x, z: P.z };
    // stand at the cupboard's opening, not its centre: at the centre the camera
    // sits behind the door panels and the view is a wall of wood
    const nx = (h.out && h.out[0]) || 0;
    const nz = h.out ? h.out[1] : -1;
    P.x = h.x + nx * 0.45; P.z = h.z + nz * 0.45;
    NS.view.camera.position.set(P.x, 1.5, P.z);
    // the cupboard's own doors sit right in front of the eye in here, so they
    // are hidden while you are inside — the opening reads as a doorway instead
    // of a wall of varnished wood
    G._doorPanels = [];
    // Hide the cupboard itself while you are inside it. Its panels sit 30 cm
    // from the eye, so any of them left visible fills the screen with wood.
    if (h.obj) { G._doorPanels.push(h.obj); h.obj.visible = false; }
    P.yaw = Math.atan2(-nx, -nz);
    P.pitch = -0.05;
    NS.hud.hint('Hold still until it passes.', 2.4);
    A.ping(300);
  };
  G.unhide = function () {
    P.hidden = false;
    (G._doorPanels || []).forEach((c) => { c.visible = true; });
    G._doorPanels = [];
    if (G._hideFrom) { P.x = G._hideFrom.x; P.z = G._hideFrom.z; }
    NS.view.camera.position.set(P.x, 1.62, P.z);
  };

  G.escape = function () {
    if (!G.powered) { NS.hud.hint('No power in the building.', 2); return; }
    const ev = G.room.elevator;
    ev.open = true;
    A.ding();
    G.after(0.7, () => A.door(false));
    G.after(1.4, () => G.win());
  };

  /* ── death / win ──────────────────────────────────────────────────────── */
  G.die = function (cause) {
    if (G.state !== 'playing' || G.godmode) return;
    G.state = 'dead';
    G.deaths++;
    P.dead = true;
    if (document.pointerLockElement) document.exitPointerLock();
    NS.hud.show(false);
    $('vign').style.opacity = 0;
    $('dead-at').textContent = G.mode === 'backdoor' ? 'Room ' + G.doorNum : 'Door ' + G.doorNum;
    $('dead-cause').textContent = ({
      RUSH: 'Rush came down the corridor. You were not behind a door.',
      AMBUSH: 'Ambush passes more than once. You were still standing when it came back.',
      SCREECH: 'Screech was behind you. You did not turn to face it.',
      HALT: 'You walked into the sign instead of backing away.',
      'THE FIGURE': 'The Figure is blind. It heard you anyway.',
      'THE BACKDOOR': 'The clock ran out, and the corridor ran out with it.'
    })[cause] || 'Something found you.';
    $('dead-doors').textContent = G.doorsPassed;
    $('dead-time').textContent = U.tsec(G.elapsed);
    $('dead-deaths').textContent = G.deaths;
    G.retryDoor = G.mode === 'backdoor' ? G.doorNum : G.cur;
    G.show('dead');
    A.ambienceLevel(0.3);
  };

  G.win = function () {
    if (G.state !== 'playing') return;
    G.state = 'won';
    if (document.pointerLockElement) document.exitPointerLock();
    NS.hud.show(false);
    NS.entities.reset();
    $('won-doors').textContent = G.mode === 'backdoor' ? 50 : 100;
    $('won-time').textContent = U.tsec(G.elapsed);
    $('won-deaths').textContent = G.deaths;
    $('won-line').textContent = G.mode === 'backdoor'
      ? 'The last room closes behind you. The clock is still running, but not for you.'
      : 'The elevator closes on a hundred doors.';
    G.show('won');
    A.ding();
  };

  G.togglePause = function (force) {
    if (G.state !== 'playing' && !G.paused) return;
    G.paused = force === undefined ? !G.paused : force;
    if (G.paused) {
      G.state = 'paused';
      if (document.pointerLockElement) document.exitPointerLock();
      $('pause-at').textContent = G.mode === 'backdoor' ? 'Room ' + G.doorNum : 'Door ' + G.doorNum;
      G.show('pause');
    } else {
      G.state = 'playing';
      G.hideScreens();
    }
  };

  /* ── the step function (also the QA hook: fixed dt simulation) ────────── */
  G.step = function (dt) {
    if (G.state !== 'playing' || G.paused) {
      if (G.state === 'lobby') G.menuStep(dt);
      return;
    }
    G.elapsed += dt;
    const room = G.room;
    const gz = room ? room.group.position.z : 0;

    // touch axis overrides keyboard when active
    const ta = NS.input.touchAxis && NS.input.touchAxis();
    if (ta) { NS.input.axis.x = ta.x; NS.input.axis.y = ta.y; }

    const hw = (NS.world.HW || 2.6) - 0.34;
    // maxZ reaches a metre into the doorway behind you: Halt asks you to back
    // away, and with a hard wall at the room's edge that was impossible.
    const bounds = { minX: -hw, maxX: hw, minZ: gz - 11 - 1.6, maxZ: gz + 1.0 };
    P.update(dt, NS.input, bounds);
    if (P.torchOn) {
      P.battery = Math.max(0, P.battery - 2.6 * dt);
      NS.view.torch.intensity = 3.4 * (P.battery > 15 ? 1 : 0.35 + Math.random() * 0.4);
      if (P.battery <= 0) { P.torchOn = false; NS.view.torch.intensity = 0; NS.hud.hint('The torch dies.', 2); }
    }
    NS.entities.update(dt);

    // timers
    for (let i = G.timers.length - 1; i >= 0; i--) {
      if (G.elapsed >= G.timers[i].at) { const f = G.timers[i].fn; G.timers.splice(i, 1); f(); }
    }

    // doors swing
    NS.world.rooms.forEach((r) => {
      if (!r.door) return;
      const target = r.door.open ? -1.42 : 0;
      r.door.angle = U.damp(r.door.angle, target, 0.0004, dt);
      r.door.hinge.rotation.y = r.door.angle;
    });
    // items glint
    NS.world.rooms.forEach((r) => r.items.forEach((it) => {
      if (!it.taken) it.obj.rotation.y += dt * 1.3;
    }));
    // the service-room lamp swings
    NS.world.rooms.forEach((r) => {
      if (r.cage) r.cage.rotation.z = Math.sin(G.elapsed * 0.9) * 0.03;
    });
    // elevator doors
    const ev = room && room.elevator;
    if (ev && ev.open && !ev.done) {
      ev.done = true;
      ev.rightLeaf.position.x = U.lerp(ev.rightLeaf.position.x, 1.42, 0.5);
    }

    // backdoor clock
    if (G.mode === 'backdoor') {
      G.timer -= dt;
      if (G.timer <= 0) G.die('THE BACKDOOR');
      if (G.timer < 14 && !NS.entities.chaser) NS.entities.chaserSpawn();
      NS.hud.door(String(G.doorNum));
      const el = document.getElementById('hud-door');
      if (el) el.style.color = G.timer < 12 ? '#e0493c' : '#e8d3a0';
    }

    // doorway crossing → next room
    if (room && room.door && room.door.open && P.z < room.exitZ - 0.55 && !P.hidden) {
      G.advance();
    } else if (room && P.z < room.exitZ - 0.55 && !P.hidden && FLOORS) {
      // door not open but the player is pressed against it: nothing to do
    }

    // stuck-proofing: if the player somehow leaves the corridor, put them back
    if (P.z > gz + 1.5 || P.z < gz - 14) { P.z = gz - 3; P.x = 0; }

    // HUD
    NS.hud.bars(); NS.hud.items();
    const c = G.candidates();
    NS.hud.prompt(c.length ? c[0].label : '');
    NS.hud.cross(!('ontouchstart' in window));

    // camera shake
    if (G.shakeT > 0) {
      G.shakeT -= dt;
      const a = G.shakeAmt * Math.max(0, G.shakeT / 0.5);
      NS.view.camera.position.x += (Math.random() - 0.5) * a * 0.10;
      NS.view.camera.position.y += (Math.random() - 0.5) * a * 0.10;
      NS.view.camera.rotation.z = (Math.random() - 0.5) * a * 0.03;
      if (G.shakeT <= 0) { G.shakeAmt = 0; NS.view.camera.rotation.z = 0; }
    }
  };

  G.menuStep = function (dt) {
    G.menuT = (G.menuT || 0) + dt;
    const cam = NS.view.camera;
    cam.position.z = -2.2 - (G.menuT * 0.28) % 9;
    cam.rotation.y = Math.sin(G.menuT * 0.13) * 0.05;
    cam.position.y = 1.62 + Math.sin(G.menuT * 0.5) * 0.01;
    NS.world.rooms.forEach((r) => r.items.forEach((it) => { if (!it.taken) it.obj.rotation.y += dt; }));
  };

  G.advance = function () {
    const from = G.room;
    G.cur = from.idx + 1;
    if (G.mode === 'backdoor') {
      G.doorNum = -50 + (G.cur - 1);
      if (G.cur > 50) { G.win(); return; }
    } else {
      G.doorNum = G.cur;
      if (G.cur > 100) { G.win(); return; }
    }
    G.doorsPassed++;
    // build ahead, forget behind
    if (!NS.world.find(G.cur + 1)) NS.world.add(G.cur + 1, G.mode);
    const behind = NS.world.find(G.cur - 2);
    if (behind) { NS.world.dispose(behind); NS.world.rooms = NS.world.rooms.filter((r) => r !== behind); }
    NS.world.refreshBlocks();
    G.enterRoom(NS.world.find(G.cur), false);
    NS.hud.door(G.mode === 'backdoor' ? bdLabel(G.doorNum) : G.doorNum);
    A.step(false, false);
  };

  /* ── frame loop ───────────────────────────────────────────────────────── */
  let last = 0;
  G.frame = function (t) {
    requestAnimationFrame(G.frame);
    const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
    last = t;
    G.step(dt);
    if (G.state === 'dead' || G.state === 'won' || G.state === 'paused') {
      // keep the world alive behind the card, but do not simulate rules
      NS.entities.update(0);
    }
    if (NS.view.ready) NS.view.renderer.render(NS.view.scene, NS.view.camera);
  };

  /* ── QA hooks (used by qa/autopilot.py; harmless in play) ─────────────── */
  G.hooks = {
    start(mode, door) { G.start(mode, door); return G.state; },
    snap() {
      return {
        state: G.state, mode: G.mode, door: G.doorNum, cur: G.cur,
        x: +P.x.toFixed(2), z: +P.z.toFixed(2), hp: Math.round(P.hp),
        hidden: P.hidden, keys: P.keys, picks: P.picks, battery: Math.round(P.battery),
        powered: G.powered, lit: G.lit.slice(), timer: G.timer ? +G.timer.toFixed(1) : 0,
        room: G.room ? G.room.type : null, doors: G.doorsPassed,
        entities: NS.entities.list.map((e) => e.kind), figure: !!NS.entities.figure,
        chaser: !!NS.entities.chaser, elapsed: +G.elapsed.toFixed(1)
      };
    },
    step(dt, n) { for (let i = 0; i < (n || 1); i++) G.step(dt || 0.05); return G.hooks.snap(); },
    warp(door, z) {
      G.cur = door; G.doorNum = G.mode === 'backdoor' ? -50 + (door - 1) : door;
      NS.world.clear();
      NS.world.add(Math.max(1, door - 1), G.mode);
      NS.world.add(door, G.mode);
      NS.world.add(door + 1, G.mode);
      const r = NS.world.find(door);
      G.room = r;
      P.x = 0; P.z = z != null ? z : r.group.position.z - 1.4; P.yaw = 0; P.pitch = 0;
      NS.view.camera.position.set(0, 1.62, P.z);
      NS.entities.reset();
      G.timers = []; G.elapsed = 0;
      G.enterRoom(r, false);
      return G.hooks.snap();
    },
    look(yaw, pitch) { P.yaw = yaw; P.pitch = pitch || 0; return G.hooks.snap(); },
    open() { if (G.room) G.openDoor(G.room); return G.hooks.snap(); },
    forward(secs) { const a = NS.input.axis; a.y = 1; G.hooks.step(0.05, Math.round((secs || 1) / 0.05)); a.y = 0; return G.hooks.snap(); },
    back(secs) { const a = NS.input.axis; a.y = -1; G.hooks.step(0.05, Math.round((secs || 1) / 0.05)); a.y = 0; return G.hooks.snap(); },
    rush(passes) { NS.entities.spawnRush({ passes: passes || 1 }); return G.hooks.snap(); },
    screech() { NS.entities.spawnScreech(); return G.hooks.snap(); },
    halt() { NS.entities.spawnHalt(G.room); return G.hooks.snap(); },
    hide() { if (G.room && G.room.hideSpots[0]) G.hide(G.room.hideSpots[0]); return G.hooks.snap(); },
    unhide() { G.unhide(); return G.hooks.snap(); },
    god(on) { G.godmode = !!on; return G.godmode; },
    kill(cause) { G.die(cause || 'RUSH'); return G.hooks.snap(); },
    figure() { if (G.room) NS.entities.figureSpawn(G.room); return G.hooks.snap(); },
    hear() { NS.entities.hear(P.x, P.z, 1); return G.hooks.snap(); },
    win() { G.win(); return G.hooks.snap(); },
    rooms() { return NS.world.rooms.map((r) => ({ idx: r.idx, type: r.type, y: +r.group.position.z.toFixed(1), hides: r.hideSpots.length })); },
    use() { G.interact(); return G.hooks.snap(); },
    prompt() { const e = document.getElementById('prompt'); return e && e.classList.contains('on') ? e.textContent : ''; },
    info() {
      const r = G.room; if (!r) return null;
      return {
        type: r.type, locked: !!r.door.locked, need: r.door.need || null, open: !!r.door.open,
        items: r.items.filter((i) => !i.taken).map((i) => i.kind),
        levers: (r.levers || []).map((l) => ({ id: l.id, on: !!l.on })),
        hides: r.hideSpots.length, elevator: !!r.elevator, dark: !!r.dark, powered: G.powered
      };
    },
    giveKey(n) { NS.player.keys += (n || 1); return NS.player.keys; },
    teleport(x, z) { NS.player.x = x; NS.player.z = z; return G.hooks.snap(); },
    setTimer(v) { G.timer = v; return G.timer; },
    doorEl() { return document.getElementById('hud-door').textContent; }
  };

  /* boot once the DOM is ready */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', G.boot);
  else G.boot();
})(window.DOORS);
