/* ═══════════════════════════════════════════════════════════════════════════
   DOORS — entities: the things that hunt you.
   Each one is a small state machine with exactly one rule the player can learn.
   Rush: hide. Screech: look at it. Halt: walk backwards. Figure: be silent.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (NS) {
  'use strict';
  const U = NS.util;
  const E = NS.entities = { list: [], figure: null, chaser: null, warned: {} };

  const faceMat = () => new THREE.MeshBasicMaterial({
    map: NS.tex.get('face'), transparent: true, depthWrite: false, opacity: 0.98
  });

  function billboard(obj) {
    const c = NS.view.camera;
    obj.rotation.y = Math.atan2(c.position.x - obj.position.x, c.position.z - obj.position.z);
  }

  E.reset = function () {
    E.list.forEach((e) => { if (e.mesh && e.mesh.parent) e.mesh.parent.remove(e.mesh); });
    E.list = [];
    if (E.figure) { E.figure.group.parent && E.figure.group.parent.remove(E.figure.group); E.figure = null; }
    if (E.chaser) { E.chaser.group.parent && E.chaser.group.parent.remove(E.chaser.group); E.chaser = null; }
    E.warned = {};
  };

  /* ── Rush / Ambush ────────────────────────────────────────────────────────
     Comes down the corridor from ahead. The only counter is being inside a
     hiding spot before it arrives; there is no dodging it in the open. */
  E.spawnRush = function (opts) {
    opts = opts || {};
    const passes = opts.passes || 1;
    const P = NS.player;
    const startZ = P.z - 34;
    const g = new THREE.Group();
    // soft-edged shroud instead of a black rectangle: the rectangle read as a
    // card sliding down the corridor, the gradient reads as a shape in the dark
    const body = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.3),
      new THREE.MeshBasicMaterial({ map: NS.tex.get('shroud'), color: 0xffffff, transparent: true, opacity: 0.99, depthWrite: false }));
    body.position.y = 1.5; g.add(body);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.15), faceMat());
    face.position.set(0, 1.72, 0.02); g.add(face);
    g.position.set(P.x * 0.4, 0, startZ);
    NS.view.scene.add(g);
    const e = {
      kind: 'rush', mesh: g, z: startZ, speed: 25, passes, passIndex: 0,
      state: 'run', gap: 0, resolved: false, hit: false, seen: false
    };
    E.list.push(e);
    NS.audio.rush();
    NS.game.shake(0.9);
    return e;
  };

  /* ── Screech: appears behind you, must be looked at ───────────────────── */
  E.spawnScreech = function () {
    const P = NS.player;
    const g = new THREE.Group();
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), faceMat());
    face.position.y = 0; g.add(face);
    const glow = new THREE.PointLight(0xdfe6ff, 0.8, 3.2, 2);
    g.add(glow);
    // 1.05 m behind the player's head, at eye height
    const bx = P.x + Math.sin(P.yaw) * 1.05, bz = P.z + Math.cos(P.yaw) * 1.05;
    g.position.set(bx, 1.55, bz);
    NS.view.scene.add(g);
    const e = { kind: 'screech', mesh: g, life: 3.4, looked: 0, done: false };
    E.list.push(e);
    NS.audio.screech();
    return e;
  };

  /* ── Halt: a sign you must back away from ─────────────────────────────── */
  E.spawnHalt = function (room) {
    const P = NS.player;
    const z = P.z - 4.4;
    const g = new THREE.Group();
    g.position.set(0, 0, z);
    const body = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.5),
      new THREE.MeshBasicMaterial({ color: 0x07070b, transparent: true, opacity: 0.98, depthWrite: false }));
    body.position.y = 1.25; g.add(body);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.78), faceMat());
    face.position.set(0, 1.85, 0.02); g.add(face);
    // the sign
    const c = document.createElement('canvas'); c.width = 512; c.height = 160;
    const x = c.getContext('2d');
    x.fillStyle = '#0a0a0c'; x.fillRect(0, 0, 512, 160);
    x.strokeStyle = '#b3261e'; x.lineWidth = 8; x.strokeRect(8, 8, 496, 144);
    x.fillStyle = '#f0e6d6'; x.font = 'bold 62px Georgia'; x.textAlign = 'center';
    x.fillText('TURN AROUND', 256, 104);
    const t = new THREE.CanvasTexture(c);
    if ('colorSpace' in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.53),
      new THREE.MeshBasicMaterial({ map: t, transparent: true }));
    sign.position.set(0, 2.5, 0.03); g.add(sign);
    NS.view.scene.add(g);
    const e = { kind: 'halt', mesh: g, z, life: 22, retreat: 0, startZ: P.z, done: false, sign, need: 2.2 };
    E.list.push(e);
    NS.audio.thud(0.5);
    NS.hud.hint('Back away. Do not walk into it.', 3.2);
    return e;
  };

  /* ── The Figure: blind, listens, kills ────────────────────────────────── */
  E.figureSpawn = function (room) {
    const gz = room.group.position.z;
    const g = new THREE.Group();
    g.position.set(0, 0, gz - 11);
    const skin = new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: 0.95 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.22, 1.35, 8), skin);
    torso.position.y = 1.72; g.add(torso);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 10), skin);
    head.position.y = 2.62; g.add(head);
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.22), skin);
    jaw.position.set(0, 2.48, 0.10); g.add(jaw);
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.055, 1.5, 6), skin);
      arm.position.set(s * 0.34, 1.72, 0.02); arm.rotation.z = s * 0.10; g.add(arm);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 1.15, 6), skin);
      leg.position.set(s * 0.13, 0.57, 0); g.add(leg);
    }
    const eye = new THREE.PointLight(0xff2a1a, 0.0, 4, 2);
    eye.position.set(0, 2.62, 0.2); g.add(eye);
    NS.view.scene.add(g);
    E.figure = {
      group: g, x: 0, z: gz - 11, target: null, state: 'patrol',
      speed: 1.15, chaseSpeed: 3.4, waypoints: [
        { x: -1.6, z: gz - 4.0 }, { x: 1.6, z: gz - 8.0 },
        { x: -1.6, z: gz - 12.0 }, { x: 1.6, z: gz - 14.0 }
      ], wp: 0, eye, cool: 0, alert: 0
    };
    return E.figure;
  };

  /* ── The Backdoor's tenant: slow, relentless, cannot be fought ────────── */
  E.chaserSpawn = function () {
    const P = NS.player;
    const g = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 1 });
    const geo = THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.30, 1.1, 4, 8)
      : new THREE.CylinderGeometry(0.30, 0.30, 1.7, 8);
    const body = new THREE.Mesh(geo, skin);
    body.position.y = 1.0; g.add(body);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.5), faceMat());
    face.position.set(0, 1.62, 0.28); g.add(face);
    g.position.set(P.x, 0, P.z + 9);
    NS.view.scene.add(g);
    E.chaser = { group: g, speed: 2.05, alive: true };
    NS.audio.heartbeat();
    return E.chaser;
  };

  E.chaserStop = function () {
    if (E.chaser) { NS.view.scene.remove(E.chaser.group); E.chaser = null; }
  };

  /* ── hearing: the Figure is deaf to crouching ─────────────────────────── */
  E.hear = function (x, z, amount) {
    if (!E.figure) return;
    const F = E.figure;
    const d = Math.hypot(F.x - x, F.z - z);
    if (d > 17) return;
    if (amount < 0.2) return;                 // crouching never registers
    F.target = { x, z };
    F.state = 'chase';
    F.alert = 1;
    F.eye.intensity = 1.1;
    NS.audio.heartbeat();
  };

  /* ── update ───────────────────────────────────────────────────────────── */
  E.update = function (dt) {
    const P = NS.player, cam = NS.view.camera;
    for (let i = E.list.length - 1; i >= 0; i--) {
      const e = E.list[i];
      if (e.kind === 'rush') {
        if (e.state === 'run') {
          e.z += e.speed * dt;
          e.mesh.position.z = e.z;
          e.mesh.position.x = U.lerp(e.mesh.position.x, P.x, 1 - Math.pow(0.02, dt));
          billboard(e.mesh);
          NS.game.shake(0.35 * dt * 60 * 0.1);
          // has it drawn level with the player?
          if (!e.hit && Math.abs(e.z - P.z) < 1.1) {
            e.hit = true;
            if (!P.hidden) {
              NS.game.die(e.passes > 1 ? 'AMBUSH' : 'RUSH');
            } else {
              NS.hud.hint('It passed. Stay still a moment.', 2.4);
              NS.audio.heartbeat();
            }
          }
          if (e.z > P.z + 6) {
            e.passIndex++;
            if (e.passIndex < e.passes) {
              e.state = 'gap'; e.gap = 0.75; e.z = P.z - 30; e.hit = false;
              e.mesh.position.z = e.z;
            } else {
              NS.view.scene.remove(e.mesh); E.list.splice(i, 1); continue;
            }
          }
        } else if (e.state === 'gap') {
          e.gap -= dt;
          if (e.gap <= 0) { e.state = 'run'; NS.audio.rush(); }
        }
      } else if (e.kind === 'screech') {
        billboard(e.mesh);
        e.life -= dt;
        const dx = cam.position.x - e.mesh.position.x;
        const dz = cam.position.z - e.mesh.position.z;
        const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
        const to = new THREE.Vector3(dx, 0, dz).normalize();
        const dot = fwd.dot(to);
        // camera looks AWAY from the thing behind you: dot ~ -1 when you face it
        if (dot < -0.86) e.looked += dt; else e.looked = Math.max(0, e.looked - dt * 0.6);
        const sc = 1 + (3.4 - e.life) * 0.22;
        e.mesh.scale.setScalar(Math.min(sc, 1.7));
        if (e.looked > 0.4) {
          NS.audio.ping(1500);
          NS.hud.hint('It let go.', 1.4);
          NS.view.scene.remove(e.mesh); E.list.splice(i, 1); continue;
        }
        if (e.life <= 0) {
          // Screech takes a chunk of health, it is not an instant death — the
          // punishment is that you now have to survive the next Rush hurt.
          NS.player.damage(45, 'SCREECH');
          NS.view.scene.remove(e.mesh); E.list.splice(i, 1); continue;
        }
      } else if (e.kind === 'halt') {
        billboard(e.mesh);
        e.life -= dt;
        const d = Math.abs(e.z - P.z);
        if (d < 2.6) {
          P.damage(26 * dt, 'HALT');
          // shove the player back out of it
          P.z += 2.2 * dt;
        }
        // backing away is progress: measure distance gained behind the start
        if (P.z > e.startZ + 0.4) e.retreat = P.z - e.startZ;
        if (e.retreat > (e.need || 2.2)) {
          NS.audio.ping(420);
          NS.hud.hint('It is gone.', 1.8);
          NS.view.scene.remove(e.mesh); E.list.splice(i, 1); continue;
        }
        if (e.life <= 0) { NS.view.scene.remove(e.mesh); E.list.splice(i, 1); continue; }
      }
    }

    /* Figure */
    if (E.figure) {
      const F = E.figure;
      F.cool = Math.max(0, F.cool - dt);
      let tx, tz, sp;
      if (F.state === 'chase' && F.target) {
        tx = F.target.x; tz = F.target.z; sp = F.chaseSpeed;
      } else {
        const wp = F.waypoints[F.wp];
        tx = wp.x; tz = wp.z; sp = F.speed;
        if (Math.hypot(F.x - tx, F.z - tz) < 0.5) F.wp = (F.wp + 1) % F.waypoints.length;
      }
      const dx = tx - F.x, dz = tz - F.z, d = Math.hypot(dx, dz) || 1;
      F.x += dx / d * sp * dt; F.z += dz / d * sp * dt;
      F.group.position.set(F.x, 0, F.z);
      F.group.rotation.y = Math.atan2(dx, dz);
      // heavy footfalls
      F.cool -= dt; if (F.cool <= 0) { NS.audio.thud(F.state === 'chase' ? 0.3 : 0.16); F.cool = F.state === 'chase' ? 0.34 : 0.85; }
      if (F.target && Math.hypot(F.x - F.target.x, F.z - F.target.z) < 0.9) {
        F.state = 'patrol'; F.target = null; F.eye.intensity = 0;
      }
      if (Math.hypot(F.x - P.x, F.z - P.z) < 1.05) NS.game.die('THE FIGURE');
    }

    /* Backdoor chaser */
    if (E.chaser && E.chaser.alive) {
      const C = E.chaser;
      const dx = P.x - C.group.position.x, dz = P.z - C.group.position.z, d = Math.hypot(dx, dz) || 1;
      C.group.position.x += dx / d * C.speed * dt;
      C.group.position.z += dz / d * C.speed * dt;
      C.group.rotation.y = Math.atan2(dx, dz);
      if (d < 1.0) NS.game.die('THE BACKDOOR');
    }
  };

  /* lighting tell for Rush: the room stutters for a second before it arrives */
  E.flicker = function (secs) {
    const rooms = NS.world.rooms;
    const lamps = [];
    rooms.forEach((r) => r.group.traverse((o) => {
      if (o.isPointLight) lamps.push(o);
    }));
    let t = 0;
    const iv = setInterval(() => {
      t += 0.08;
      lamps.forEach((l) => { l.userData.base = l.userData.base || l.intensity; l.intensity = Math.random() < 0.5 ? l.userData.base * 0.15 : l.userData.base; });
      if (t > (secs || 1.4)) {
        clearInterval(iv);
        lamps.forEach((l) => { if (l.userData.base) l.intensity = l.userData.base; });
      }
    }, 80);
  };
})(window.DOORS);
