/* ═══════════════════════════════════════════════════════════════════════════
   DOORS — world: the rooms behind the doors.
   A room is a box 6.4 m wide, 11 m deep, 3.3 m high, with a door at the far end.
   Rooms are generated from the door number (seeded), built two at a time and
   disposed behind you so a 100-door run never holds more than ~600 meshes.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (NS) {
  'use strict';
  const U = NS.util;

  const W = 5.2, HW = W / 2, H = 3.3, L = 11;
  const DOOR_W = 1.12, DOOR_H = 2.14;

  const world = NS.world = {
    rooms: [], mode: 'hotel', blocks: [], menu: false,
    W: W, HW: HW, L: L
  };

  /* ── small builders ───────────────────────────────────────────────────── */
  function box(parent, w, h, d, mat, x, y, z, ry) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (ry) m.rotation.y = ry;
    parent.add(m);
    return m;
  }
  function plane(parent, w, h, mat, x, y, z, rx, ry) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    if (rx) m.rotation.x = rx;
    if (ry) m.rotation.y = ry;
    parent.add(m);
    return m;
  }
  function cyl(parent, r1, r2, h, mat, x, y, z, seg) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg || 10), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function block(room, minX, maxX, minZ, maxZ) {
    room.blocks.push({ minX, maxX, minZ, maxZ });
  }

  /* A wall with a door-shaped hole in it. Four boxes instead of a CSG op —
     cheap, and the hole lands exactly where the frame is. */
  function wallWithHole(parent, z, mat, hole) {
    const side = (HW - hole / 2);
    box(parent, side, H, 0.12, mat, -(hole / 2 + side / 2), H / 2, z);
    box(parent, side, H, 0.12, mat, (hole / 2 + side / 2), H / 2, z);
    box(parent, hole, H - DOOR_H, 0.12, mat, 0, DOOR_H + (H - DOOR_H) / 2, z);
  }

  function doorFrame(parent, z, mat) {
    const jamb = 0.09;
    box(parent, jamb, DOOR_H + 0.1, 0.20, mat, -(DOOR_W / 2 + jamb / 2), (DOOR_H + 0.1) / 2, z);
    box(parent, jamb, DOOR_H + 0.1, 0.20, mat, (DOOR_W / 2 + jamb / 2), (DOOR_H + 0.1) / 2, z);
    box(parent, DOOR_W + jamb * 2, jamb, 0.20, mat, 0, DOOR_H + jamb / 2, z);
  }

  /* The door itself: a hinged slab with a brass plate. `hinge` is a group at the
     left edge so rotating it swings the whole door, which is how a real one moves. */
  function makeDoor(parent, z, label, mat) {
    const hinge = new THREE.Group();
    hinge.position.set(-DOOR_W / 2, 0, z);
    parent.add(hinge);
    const slab = box(hinge, DOOR_W, DOOR_H, 0.07, mat, DOOR_W / 2, DOOR_H / 2, 0);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), NS.mat.brass());
    knob.position.set(DOOR_W - 0.16, 1.02, 0.07); hinge.add(knob);
    const plate = box(hinge, 0.20, 0.13, 0.02, NS.mat.brass(), DOOR_W / 2, 1.72, 0.05);
    if (label != null) {
      const c = document.createElement('canvas'); c.width = 128; c.height = 80;
      const x = c.getContext('2d');
      x.fillStyle = '#1a1206'; x.fillRect(0, 0, 128, 80);
      x.fillStyle = '#d8b978'; x.font = 'bold 54px Georgia'; x.textAlign = 'center';
      x.fillText(String(label), 64, 60);
      const t = new THREE.CanvasTexture(c);
      if ('colorSpace' in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
      const face = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.12),
        new THREE.MeshBasicMaterial({ map: t }));
      face.position.set(DOOR_W / 2, 1.72, 0.065); hinge.add(face);
      plate.visible = false;
    }
    hinge.rotation.y = 0;
    return { hinge, slab };
  }

  function ceilingLamp(parent, x, z, on, tint, inten) {
    const g = new THREE.Group(); g.position.set(x, H - 0.02, z); parent.add(g);
    cyl(g, 0.16, 0.10, 0.10, NS.mat.brass(), 0, -0.02, 0, 12);
    const shade = cyl(g, 0.26, 0.30, 0.16, NS.mat.brass(), 0, -0.14, 0, 14);
    shade.material = shade.material.clone();
    const bulb = cyl(g, 0.13, 0.13, 0.05, on ? NS.mat.lampOn() : NS.mat.dark(), 0, -0.22, 0, 12);
    let light = null;
    if (on) {
      light = new THREE.PointLight(tint || 0xffcf9a, inten || 2.4, 13, 1.05);
      light.position.set(0, -0.3, 0); g.add(light);
    }
    return { group: g, light, bulb };
  }

  function sconce(parent, x, z, side, on) {
    const g = new THREE.Group(); g.position.set(x, 2.05, z); g.rotation.y = side; parent.add(g);
    cyl(g, 0.05, 0.07, 0.22, NS.mat.brass(), 0, 0, 0, 8);
    const cup = cyl(g, 0.13, 0.06, 0.16, NS.mat.brass(), 0, 0.14, 0, 10);
    cup.material = cup.material.clone();
    const glow = box(g, 0.14, 0.10, 0.14, on ? NS.mat.lampOn() : NS.mat.dark(), 0, 0.22, 0);
    if (on) {
      const l = new THREE.PointLight(0xffb877, 1.5, 7.5, 1.1);
      l.position.set(0, 0.2, 0.1); g.add(l);
    }
    return g;
  }

  function painting(parent, x, z, side, r) {
    const g = new THREE.Group(); g.position.set(x, 1.75, z); g.rotation.y = side; parent.add(g);
    box(g, 0.86, 1.12, 0.05, NS.mat.brass(), 0, 0, 0);
    const c = document.createElement('canvas'); c.width = 128; c.height = 160;
    const ctx = c.getContext('2d');
    // A hotel painting, not a placeholder: a lit doorway with someone standing in it.
    const hue = 16 + r() * 26;
    const grd = ctx.createLinearGradient(0, 0, 0, 160);
    grd.addColorStop(0, 'hsl(' + hue + ',14%,9%)');
    grd.addColorStop(1, 'hsl(' + hue + ',18%,5%)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 128, 160);
    ctx.fillStyle = 'hsl(' + (hue + 8) + ',22%,' + (16 + r() * 8) + '%)';
    ctx.fillRect(34, 40, 60, 100);
    ctx.fillStyle = 'hsl(' + (hue + 12) + ',26%,' + (26 + r() * 10) + '%)';
    ctx.fillRect(40, 48, 48, 84);
    ctx.fillStyle = 'rgba(6,5,4,.86)';
    ctx.beginPath();        // the figure in the doorway
    ctx.ellipse(64, 96, 13, 30, 0, 0, 6.3); ctx.fill();
    ctx.beginPath(); ctx.ellipse(64, 66, 7.5, 9, 0, 0, 6.3); ctx.fill();
    const vg = ctx.createRadialGradient(64, 90, 20, 64, 90, 90);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.72)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, 128, 160);
    ctx.strokeStyle = 'rgba(220,200,170,.10)'; ctx.lineWidth = 2; ctx.strokeRect(30, 36, 68, 108);
    const t = new THREE.CanvasTexture(c);
    if ('colorSpace' in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    const pic = plane(g, 0.74, 1.0, new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }), 0, 0, 0.03);
    return g;
  }

  /* A wardrobe you can actually stand inside. It is hollow — back, sides, top,
     bottom and a rail — with the two doors swung open on their outer hinges.
     The solid box version put the camera inside geometry, so hiding in it
     rendered a black screen instead of a sliver of the room. */
  function wardrobe(parent, x, z, ry) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry || 0; parent.add(g);
    const w = 1.0, d = 0.62, h = 2.16;
    box(g, w, h, 0.04, NS.mat.wood(), 0, h / 2, -d / 2 + 0.02);          // back
    box(g, 0.05, h, d, NS.mat.wood(), -w / 2 + 0.025, h / 2, 0);          // sides
    box(g, 0.05, h, d, NS.mat.wood(), w / 2 - 0.025, h / 2, 0);
    box(g, w, 0.05, d, NS.mat.wood(), 0, h - 0.02, 0);                    // top
    box(g, w, 0.07, d, NS.mat.wood(), 0, 0.035, 0);                       // floor
    box(g, 0.10, 0.06, d - 0.06, NS.mat.wood(), 0, h - 0.10, 0);           // crown
    cyl(g, 0.018, 0.018, w - 0.14, NS.mat.brass(), 0, h - 0.42, -0.02, 6);  // rail
    [-1, 1].forEach((s) => {
      const hinge = new THREE.Group();
      hinge.position.set(s * (w / 2 - 0.01), 0, d / 2 - 0.01);
      hinge.rotation.y = s * 1.28;      // both doors swung well open
      g.add(hinge);
      box(hinge, w / 2 - 0.02, h - 0.10, 0.03, NS.mat.wood(), -s * (w / 4), (h - 0.10) / 2, 0);
      box(hinge, 0.03, 0.16, 0.03, NS.mat.brass(), -s * (w / 2 - 0.10), 1.02, 0.03);
    });
    return g;
  }

  function table(parent, x, z, w, d, h) {
    const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
    const top = box(g, w, 0.07, d, NS.mat.wood(), 0, h, 0);
    const legX = w / 2 - 0.08, legZ = d / 2 - 0.08;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      box(g, 0.07, h, 0.07, NS.mat.wood(), sx * legX, h / 2, sz * legZ);
    });
    return g;
  }

  function chair(parent, x, z, ry) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry || 0; parent.add(g);
    box(g, 0.44, 0.06, 0.44, NS.mat.wood(), 0, 0.46, 0);
    box(g, 0.44, 0.52, 0.05, NS.mat.wood(), 0, 0.72, -0.19);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      box(g, 0.045, 0.46, 0.045, NS.mat.wood(), sx * 0.17, 0.23, sz * 0.17);
    });
    return g;
  }

  function bookshelf(parent, x, z, ry, hgt) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
    const h = hgt || 2.6, d = 0.42, w = 1.6;
    box(g, w, h, d, NS.mat.wood(), 0, h / 2, 0);
    for (let i = 1; i <= 3; i++) box(g, w - 0.08, 0.05, d + 0.02, NS.mat.wood(), 0, h * i / 4, 0);
    // spines: one textured plane per shelf bay reads as dozens of books
    const bm = new THREE.MeshStandardMaterial({ map: NS.tex.get('books'), roughness: 0.95 });
    bm.map = bm.map.clone(); bm.map.needsUpdate = true; bm.map.repeat.set(1.2, 0.5);
    for (let i = 0; i < 4; i++) {
      plane(g, w - 0.14, h / 4 - 0.12, bm, 0, h * (i / 4) + h / 8 + 0.02, d / 2 + 0.01);
    }
    return g;
  }

  function plant(parent, x, z, s, r) {
    const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
    const potH = 0.34 * s;
    cyl(g, 0.22 * s, 0.17 * s, potH, NS.mat.metal(), 0, potH / 2, 0, 10);
    const lm = NS.mat.leaf();
    for (let i = 0; i < 5; i++) {
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.10 * s, 0.9 * s * (0.7 + r() * 0.7), 6), lm);
      b.position.set((r() - 0.5) * 0.24 * s, potH + 0.4 * s, (r() - 0.5) * 0.24 * s);
      b.rotation.set((r() - 0.5) * 0.7, r() * 6.3, (r() - 0.5) * 0.7);
      g.add(b);
    }
    return g;
  }

  function crate(parent, x, z, s, r) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r() * 1.6; parent.add(g);
    box(g, s, s * 0.8, s, NS.mat.wood(), 0, s * 0.4, 0);
    box(g, s + 0.02, 0.05, 0.05, NS.mat.metal(), 0, s * 0.62, s / 2);
    return g;
  }

  function pipes(parent, z, r, n) {
    for (let i = 0; i < n; i++) {
      const p = cyl(parent, 0.07 + r() * 0.05, 0.07 + r() * 0.05, L, NS.mat.metal(),
        -HW + 0.18 + i * 0.34, H - 0.22 - r() * 0.18, z, 8);
      p.rotation.x = Math.PI / 2;
    }
  }

  /* ── room shell ───────────────────────────────────────────────────────── */
  function shell(room, opts) {
    const g = room.group;
    const wallMat = opts.wall || NS.mat.wall();
    const floorMat = opts.floor || NS.mat.carpet();
    const ceilMat = opts.ceil || NS.mat.ceil();
    // floor & ceiling
    plane(g, W, L, floorMat, 0, 0, -L / 2, -Math.PI / 2);
    plane(g, W, L, ceilMat, 0, H, -L / 2, Math.PI / 2);
    // side walls
    box(g, 0.12, H, L, wallMat, -HW, H / 2, -L / 2, 0);
    box(g, 0.12, H, L, wallMat, HW, H / 2, -L / 2, 0);
    // far wall with the exit door, near wall with the entry doorway
    wallWithHole(g, -L + 0.06, wallMat, DOOR_W);
    if (!opts.openBack) wallWithHole(g, -0.06, wallMat, DOOR_W);
    doorFrame(g, -L + 0.06, NS.mat.doorTrim());
    doorFrame(g, -0.06, NS.mat.doorTrim());
    // A lamp over the exit door. The doorway is the only thing the player is
    // ever looking for, so it gets its own small pool of light and the corridor
    // reads as a sequence of doorways rather than one long tunnel.
    const dl = new THREE.PointLight(0xffc98a, 1.0, 6, 1.2);
    dl.position.set(0, 2.42, -L + 0.5);
    g.add(dl);
    box(g, 0.36, 0.05, 0.14, NS.mat.brass(), 0, 2.34, -L + 0.18);
    if (opts.skirting !== false) {
      box(g, 0.06, 0.14, L, NS.mat.wood(), -HW + 0.09, 0.07, -L / 2);
      box(g, 0.06, 0.14, L, NS.mat.wood(), HW - 0.09, 0.07, -L / 2);
    }
  }

  /* ── archetypes ───────────────────────────────────────────────────────── */
  const BUILD = {};

  BUILD.hallway = function (room, r) {
    shell(room, {});
    // runner carpet down the middle
    const run = new THREE.MeshStandardMaterial({ map: NS.tex.get('carpet'), roughness: 1 });
    run.map = run.map.clone(); run.map.needsUpdate = true; run.map.repeat.set(1.1, 3.4);
    plane(room.group, 2.2, L - 0.4, run, 0, 0.012, -L / 2, -Math.PI / 2);

    for (let i = 0; i < 3; i++) {
      const z = -1.6 - i * 3.4;
      // fake doors on both walls, so the hallway reads as a hotel, not a tunnel
      [-1, 1].forEach((s) => {
        const x = s * (HW - 0.06);
        box(room.group, 0.06, 2.08, 0.94, NS.mat.wood(), x, 1.04, z, 0);
        box(room.group, 0.03, 0.09, 0.03, NS.mat.brass(), x - s * 0.05, 1.02, z - 0.34);
        // a real door case: two jambs, a lintel and a dark reveal — the trim is
        // what makes a slab read as a door instead of a panel screwed to a wall
        box(room.group, 0.08, 2.20, 0.07, NS.mat.doorTrim(), x - s * 0.03, 1.10, z - 0.50);
        box(room.group, 0.08, 2.20, 0.07, NS.mat.doorTrim(), x - s * 0.03, 1.10, z + 0.50);
        box(room.group, 0.08, 0.09, 1.07, NS.mat.doorTrim(), x - s * 0.03, 2.24, z);
        box(room.group, 0.05, 2.08, 0.99, NS.mat.dark(), x + s * 0.02, 1.04, z);
      });
      if (i < 2) { sconce(room.group, -(HW - 0.2), z - 1.7, Math.PI / 2, true); sconce(room.group, HW - 0.2, z - 1.7, -Math.PI / 2, true); }
      if (i === 2) { sconce(room.group, -(HW - 0.2), z - 1.5, Math.PI / 2, true); sconce(room.group, HW - 0.2, z - 1.5, -Math.PI / 2, true); }
      // hang the art in the middle of the bay, centred under a sconce — anything
      // closer to a doorway and the frame reads as part of the door case
      if (r() < 0.6) painting(room.group, -(HW - 0.13), z - 1.7, Math.PI / 2, r);
      if (r() < 0.6) painting(room.group, HW - 0.13, z - 1.7, -Math.PI / 2, r);
    }
    ceilingLamp(room.group, 0, -3.0, true);
    ceilingLamp(room.group, 0, -7.6, true);

    // a console table for the key to sit on
    if (r() < 0.6) {
      const side = r() < 0.5 ? -1 : 1;
      table(room.group, side * (HW - 0.7), -6.2, 1.0, 0.5, 0.78);
      block(room, side * (HW - 0.7) - 0.5, side * (HW - 0.7) + 0.5, -6.45, -5.95);
      room.surfaces = room.surfaces || [];
      room.surfaces.push({ x: side * (HW - 0.7), z: -6.2, y: 0.82 });
    }
    if (r() < 0.5) { const wg = wardrobe(room.group, HW - 0.55, -2.4, -Math.PI / 2); block(room, HW - 0.9, HW, -3.0, -1.8); room.hideSpots.push({ x: HW - 0.55, z: -2.4, label: 'wardrobe', obj: wg }); }
    else { const wg = wardrobe(room.group, -(HW - 0.55), -8.4, Math.PI / 2); block(room, -HW, -HW + 0.9, -9.0, -7.8); room.hideSpots.push({ x: -(HW - 0.55), z: -8.4, label: 'wardrobe', obj: wg }); }
  };

  BUILD.guest = function (room, r) {
    shell(room, { floor: NS.mat.wood() });
    // bed
    const bx = -1.7, bz = -5.4;
    box(room.group, 2.0, 0.42, 2.5, NS.mat.wood(), bx, 0.21, bz);
    box(room.group, 1.9, 0.22, 2.36, NS.mat.snow(), bx, 0.52, bz);
    box(room.group, 1.9, 0.12, 0.5, NS.mat.snow(), bx, 0.66, bz + 0.9);
    box(room.group, 2.0, 1.0, 0.10, NS.mat.wood(), bx, 0.5, bz - 1.26);
    block(room, bx - 1.0, bx + 1.0, bz - 1.3, bz + 1.3);
    // nightstand + lamp
    box(room.group, 0.5, 0.55, 0.5, NS.mat.wood(), bx + 1.35, 0.28, bz - 1.0);
    cyl(room.group, 0.11, 0.08, 0.26, NS.mat.brass(), bx + 1.35, 0.68, bz - 1.0, 10);
    const shade = cyl(room.group, 0.19, 0.15, 0.2, NS.mat.lampOn(), bx + 1.35, 0.86, bz - 1.0, 12);
    const lampLight = new THREE.PointLight(0xffc48a, 1.9, 6.5, 1.1);
    lampLight.position.set(bx + 1.35, 1.0, bz - 1.0); room.group.add(lampLight);
    block(room, bx + 1.1, bx + 1.6, bz - 1.25, bz - 0.75);
    // wardrobe (the hiding spot) + a chair + luggage
    const wg = wardrobe(room.group, HW - 0.6, -3.0, -Math.PI / 2);
    block(room, HW - 0.95, HW, -3.55, -2.45);
    room.hideSpots.push({ x: HW - 0.6, z: -3.0, label: 'wardrobe', obj: wg });
    chair(room.group, 1.4, -3.4, 2.2);
    box(room.group, 0.6, 0.4, 0.9, NS.mat.wood(), 1.9, 0.2, -9.0);
    block(room, 1.6, 2.2, -9.45, -8.55);
    ceilingLamp(room.group, 0, -2.4, r() < 0.75);
    ceilingLamp(room.group, 0, -8.6, true);
    room.surfaces.push({ x: bx + 1.35, z: bz - 1.0, y: 0.56 });
  };

  BUILD.library = function (room, r) {
    shell(room, { floor: NS.mat.wood(), wall: NS.mat.wood() });
    // shelves along both walls + a free-standing run, leaving a walking lane
    for (let i = 0; i < 4; i++) {
      const z = -1.4 - i * 2.6;
      bookshelf(room.group, -(HW - 0.24), z, Math.PI / 2, 2.6 + (i % 2) * 0.4);
      block(room, -HW, -HW + 0.5, z - 0.85, z + 0.85);
      if (i !== 2) {
        bookshelf(room.group, HW - 0.24, z, -Math.PI / 2, 2.4 + (i % 2) * 0.5);
        block(room, HW - 0.5, HW, z - 0.85, z + 0.85);
      }
    }
    bookshelf(room.group, 0.9, -7.2, 0, 2.5);
    block(room, 0.05, 1.75, -7.55, -6.85);
    // reading table under a chandelier
    table(room.group, -0.9, -4.2, 1.5, 0.9, 0.78);
    block(room, -1.65, -0.15, -4.65, -3.75);
    chair(room.group, -0.9, -3.4, 0);
    chair(room.group, -0.9, -5.0, Math.PI);
    room.surfaces.push({ x: -0.9, z: -4.2, y: 0.82 });
    // chandelier
    const ch = new THREE.Group(); ch.position.set(-0.9, H - 0.55, -4.2); room.group.add(ch);
    cyl(ch, 0.42, 0.42, 0.05, NS.mat.brass(), 0, 0, 0, 12);
    const bulbs = NS.mat.lampOn();
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * 6.283;
      const b = box(ch, 0.07, 0.16, 0.07, bulbs, Math.cos(a) * 0.38, 0.08, Math.sin(a) * 0.38);
      if (i < 3) { const l = new THREE.PointLight(0xffc98f, 1.6, 11, 1.1); l.position.set(Math.cos(a) * 0.38, 0.2, Math.sin(a) * 0.38); ch.add(l); }
    }
    cyl(room.group, 0.02, 0.02, 0.5, NS.mat.brass(), -0.9, H - 0.28, -4.2, 6);
    // stacked books on the floor
    for (let i = 0; i < 4; i++) {
      const s = 0.22 + r() * 0.12;
      box(room.group, s, 0.05, s * 1.35, NS.mat.book(), 1.9 + r() * 0.5, 0.03 + i * 0.05, -2.2 - r() * 0.4, r() * 0.6);
    }
    room.hideSpots.push({ x: -HW + 0.62, z: -9.6, label: 'behind the shelf', out: [1, 0] });
  };

  BUILD.greenhouse = function (room, r) {
    const glass = NS.mat.glass(), frameM = NS.mat.metal();
    // stone floor + glass walls instead of wallpaper
    const gfloor = NS.mat.tile().clone();
    gfloor.color = new THREE.Color(0x6d7a71);   // mossy, wet stone — not a hotel floor
    plane(room.group, W, L, gfloor, 0, 0, -L / 2, -Math.PI / 2);
    plane(room.group, W, L, new THREE.MeshStandardMaterial({ color: 0x161f1c, roughness: 1, side: THREE.DoubleSide }),
      0, H, -L / 2, Math.PI / 2);
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 5; i++) {
        const z = -0.2 - i * 2.2;
        plane(room.group, 2.1, H - 0.2, glass, s * HW, H / 2, z - 1.1, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2);
        box(room.group, 0.08, H, 0.08, frameM, s * HW, H / 2, z);
      }
      box(room.group, 0.10, 0.10, L, frameM, s * HW, H - 0.12, -L / 2);
      box(room.group, 0.10, 0.10, L, frameM, s * HW, 0.10, -L / 2);
    });
    wallWithHole(room.group, -L + 0.06, NS.mat.wall2(), DOOR_W);
    wallWithHole(room.group, -0.06, NS.mat.wall2(), DOOR_W);
    doorFrame(room.group, -L + 0.06, frameM);
    doorFrame(room.group, -0.06, frameM);
    // planters along both walls, plants crowded in
    for (let i = 0; i < 5; i++) {
      const z = -1.2 - i * 2.1;
      [-1, 1].forEach((s) => {
        const x = s * (HW - 0.75);
        box(room.group, 1.1, 0.5, 1.5, NS.mat.wall2(), x, 0.25, z);
        block(room, x - 0.55, x + 0.55, z - 0.75, z + 0.75);
        plant(room.group, x, z, 1.5 + r() * 0.8, r);
      });
    }
    // hanging vines
    for (let i = 0; i < 7; i++) {
      const x = -2.4 + r() * 5.0, z = -1 - r() * 9;
      const v = cyl(room.group, 0.02, 0.02, 1.1 + r() * 1.4, NS.mat.leaf(), x, H - 0.7, z, 5);
      v.rotation.z = (r() - 0.5) * 0.25;
    }
    // standing water
    plane(room.group, 2.6, 3.4, new THREE.MeshStandardMaterial({ color: 0x0d1a16, roughness: 0.52, metalness: 0.12 }),
      0.4, 0.015, -8.2, -Math.PI / 2);
    // one dying lamp, one dead; the light that matters comes through the glass
    ceilingLamp(room.group, 0, -3.6, true, 0xbcd6c6, 1.15);
    ceilingLamp(room.group, 0, -8.4, r() < 0.3, 0xbcd6c6, 0.9);
    const moon = new THREE.PointLight(0x8fb2c6, 1.5, 15, 1.15);
    moon.position.set(0, H - 0.35, -5.6); room.group.add(moon);
    room.dark = r() < 0.6;
    room.hideSpots.push({ x: HW - 0.8, z: -9.4, label: 'the planters', out: [-1, 0] });
    NS.view.scene.fog.density = 0.076;
  };

  BUILD.service = function (room, r) {
    shell(room, { floor: NS.mat.wall2(), wall: NS.mat.wall2(), ceil: NS.mat.dark() });
    pipes(room.group, -L / 2, r, 3);
    // boiler tank
    const t = cyl(room.group, 0.9, 0.9, 2.2, NS.mat.metal(), -1.8, 1.1, -8.0, 14);
    block(room, -2.7, -0.9, -8.9, -7.1);
    for (let i = 0; i < 3; i++) cyl(room.group, 0.06, 0.06, 1.6, NS.mat.metal(), -1.8, 2.4, -8.0 - 0.4 + i * 0.4, 6);
    // breaker cabinet (lever) on the right wall
    const cab = new THREE.Group(); cab.position.set(HW - 0.2, 1.4, -5.6); cab.rotation.y = -Math.PI / 2; room.group.add(cab);
    box(cab, 1.0, 1.4, 0.34, NS.mat.metal(), 0, 0, 0);
    box(cab, 0.86, 1.24, 0.03, NS.mat.dark(), 0, 0, 0.19);
    const arm = box(cab, 0.10, 0.42, 0.10, NS.mat.red(), 0, 0.1, 0.26);
    arm.rotation.x = -0.5;
    box(cab, 0.14, 0.14, 0.06, NS.mat.brass(), 0, 0.32, 0.26);
    room.levers.push({ x: HW - 0.45, z: -5.6, obj: arm, on: false, id: 'L' + room.idx });
    block(room, HW - 0.55, HW, -6.25, -4.95);
    // crates
    crate(room.group, 1.9, -2.6, 0.8, r); block(room, 1.4, 2.4, -3.1, -2.1);
    crate(room.group, 2.2, -3.9, 0.6, r); block(room, 1.85, 2.55, -4.25, -3.55);
    crate(room.group, -2.0, -3.2, 0.7, r); block(room, -2.45, -1.55, -3.65, -2.75);
    // cage lamp, swinging slightly
    const cage = new THREE.Group(); cage.position.set(0.2, H - 0.9, -6.4); room.group.add(cage);
    cyl(cage, 0.02, 0.02, 0.9, NS.mat.metal(), 0, 0.55, 0, 5);
    cyl(cage, 0.22, 0.22, 0.30, NS.mat.metal(), 0, 0, 0, 8);
    box(cage, 0.16, 0.16, 0.16, NS.mat.lampOn(), 0, 0, 0);
    const cl = new THREE.PointLight(0xffb46a, 2.6, 8.5, 1.1); cl.position.set(0, 0, 0); cage.add(cl);
    room.cage = cage;
    room.surfaces.push({ x: 1.9, z: -2.6, y: 0.85 });
    room.hideSpots.push({ x: -1.2, z: -6.0, label: 'behind the tank', out: [0, 1] });
  };

  BUILD.circuit = function (room, r) {
    // Door 100: a wide room with five breakers and an elevator at the far end.
    const g = room.group;
    // NOTE: the streaming grid advances by L=11 per door, so this room has to
    // be 11 deep. At 16 it overlapped rooms 101–102 and the next door's plaque
    // poked through the far wall while the lift sat beyond it.
    plane(g, W, L, NS.mat.tile(), 0, 0, -L / 2, -Math.PI / 2);
    plane(g, W, L, NS.mat.dark(), 0, H, -L / 2, Math.PI / 2);
    box(g, 0.12, H, L, NS.mat.wall2(), -HW, H / 2, -L / 2);
    box(g, 0.12, H, L, NS.mat.wall2(), HW, H / 2, -L / 2);
    // the far end is a solid wall — the lift is the only way out of Door 100
    box(g, W, H, 0.12, NS.mat.wall2(), 0, H / 2, -L + 0.06);
    wallWithHole(g, -0.06, NS.mat.wall2(), DOOR_W);
    doorFrame(g, -0.06, NS.mat.metal());
    room.levers = [];
    // five breaker panels, A–E, alternating walls
    const letters = ['A', 'B', 'C', 'D', 'E'];
    letters.forEach((L2, i) => {
      const s = i % 2 === 0 ? -1 : 1;
      const z = -2.8 - Math.floor(i / 2) * 3.0;
      const cab = new THREE.Group();
      cab.position.set(s * (HW - 0.2), 1.45, z); cab.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2;
      g.add(cab);
      box(cab, 0.95, 1.25, 0.30, NS.mat.metal(), 0, 0, 0);
      box(cab, 0.82, 1.10, 0.03, NS.mat.dark(), 0, 0, 0.17);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x401210, emissive: 0xff2a1a, emissiveIntensity: 0.6 }));
      lamp.position.set(0, 0.44, 0.19); cab.add(lamp);
      const arm = box(cab, 0.09, 0.36, 0.09, NS.mat.red(), 0, 0.04, 0.22);
      arm.rotation.x = 0.5;
      // label plate
      const c = document.createElement('canvas'); c.width = 64; c.height = 64;
      const cx = c.getContext('2d');
      cx.fillStyle = '#0d0d10'; cx.fillRect(0, 0, 64, 64);
      cx.fillStyle = '#d9c089'; cx.font = 'bold 44px Georgia'; cx.textAlign = 'center';
      cx.fillText(L2, 32, 48);
      const tex = new THREE.CanvasTexture(c);
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      plane(cab, 0.18, 0.18, new THREE.MeshBasicMaterial({ map: tex }), 0, -0.34, 0.18);
      room.levers.push({ x: s * (HW - 0.5), z, obj: arm, on: false, id: L2, lamp, cab });
      block(room, s > 0 ? HW - 0.6 : -HW, s > 0 ? HW : -HW + 0.6, z - 0.6, z + 0.6);
    });
    // elevator on the far wall
    const ev = new THREE.Group(); ev.position.set(0, 0, -L + 0.7); g.add(ev);
    // a lit steel box you actually want to step into, not a black slab
    const steel = NS.mat.metal().clone();
    steel.color = new THREE.Color(0xb8bec4); steel.metalness = 0.08; steel.roughness = 0.55;
    box(ev, 2.30, 2.70, 0.30, NS.mat.dark(), 0, 1.35, -0.02);      // recess
    box(ev, 2.20, 2.44, 0.10, steel, 0, 1.22, 0.10);               // car back
    const bronze = NS.mat.brass().clone();
    bronze.color = new THREE.Color(0x6f5936); bronze.metalness = 0.25; bronze.roughness = 0.6;
    box(ev, 0.06, 2.44, 0.16, bronze, -1.10, 1.22, 0.16);  // jamb
    box(ev, 0.06, 2.44, 0.16, bronze, 1.10, 1.22, 0.16);
    box(ev, 2.26, 0.06, 0.16, bronze, 0, 2.44, 0.16);      // head
    box(ev, 2.26, 0.05, 0.16, bronze, 0, 0.02, 0.16);      // sill
    box(ev, 2.10, 2.36, 0.04, NS.mat.dark(), 0, 1.20, 0.155);      // dark behind the seam
    box(ev, 0.98, 2.30, 0.05, steel, -0.50, 1.20, 0.165);          // leaves
    const rightLeaf = box(ev, 0.98, 2.30, 0.05, steel, 0.50, 1.20, 0.165);
    rightLeaf.position.x = 0.50;
    const glow = new THREE.MeshBasicMaterial({ color: 0xffd2a0 });
    box(ev, 1.96, 0.025, 0.10, glow, 0, 0.06, 0.22);               // strip light at the door
    const evLight = new THREE.PointLight(0xffd9a8, 2.3, 9.5, 1.1);
    evLight.position.set(0, 2.30, 1.15); ev.add(evLight);
    const dot = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    box(ev, 0.10, 0.10, 0.02, dot, -0.96, 2.93, 0.17);
    const c = document.createElement('canvas'); c.width = 256; c.height = 64;
    const cx = c.getContext('2d');
    cx.fillStyle = '#0b0b0e'; cx.fillRect(0, 0, 256, 64);
    cx.fillStyle = '#e8c98a'; cx.font = 'bold 30px Georgia'; cx.textAlign = 'center';
    cx.fillText('ELEVATOR', 128, 43);
    const tex = new THREE.CanvasTexture(c);
    if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    plane(ev, 1.72, 0.38, new THREE.MeshBasicMaterial({ map: tex }), 0, 2.93, 0.16);
    const callBtn = box(ev, 0.14, 0.14, 0.06, dot, 1.36, 1.18, 0.20);
    room.elevator = { group: ev, rightLeaf, open: false, button: callBtn, x: 0, z: -L + 1.0 };
    block(room, -1.1, 1.1, -L + 0.4, -L + 1.0);
    // clue board between the panels: which three breakers, and the order
    const bc = document.createElement('canvas'); bc.width = 320; bc.height = 200;
    const bx = bc.getContext('2d');
    bx.fillStyle = '#141211'; bx.fillRect(0, 0, 320, 200);
    bx.strokeStyle = '#6b5a35'; bx.lineWidth = 4; bx.strokeRect(6, 6, 308, 188);
    bx.fillStyle = '#d9c089'; bx.font = 'bold 22px Georgia'; bx.fillText('MAIN CIRCUIT', 22, 44);
    bx.font = '15px Georgia'; bx.fillStyle = '#a89878';
    bx.fillText('restore power before the lift will answer', 22, 70);
    bx.fillStyle = '#e8c98a'; bx.font = 'bold 26px Georgia';
    bx.fillText('A  ·  C  ·  E', 22, 118);
    bx.font = '13px Georgia'; bx.fillStyle = '#8b7d63';
    bx.fillText('B and D stay down. Trip one and it hears you.', 22, 152);
    const btex = new THREE.CanvasTexture(bc);
    if ('colorSpace' in btex && THREE.SRGBColorSpace) btex.colorSpace = THREE.SRGBColorSpace;
    const board = plane(g, 1.5, 0.94, new THREE.MeshBasicMaterial({ map: btex }), -HW + 0.1, 1.6, -8.9, 0, Math.PI / 2);
    // red emergency light
    const em = new THREE.PointLight(0xff2a18, 1.6, 14, 1.2);
    em.position.set(0, H - 0.5, -7.6); g.add(em);
    room.emergency = em;
    room.dark = true;
    room.hideSpots.push({ x: -1.4, z: -8.1, label: 'behind the board', out: [0, 1] });
  };

  BUILD.backdoor = function (room, r) {
    const g = room.group;
    plane(g, W, L, NS.mat.wall2(), 0, 0, -L / 2, -Math.PI / 2);
    plane(g, W, L, NS.mat.dark(), 0, H, -L / 2, Math.PI / 2);
    box(g, 0.12, H, L, NS.mat.wall2(), -HW, H / 2, -L / 2);
    box(g, 0.12, H, L, NS.mat.wall2(), HW, H / 2, -L / 2);
    wallWithHole(g, -L + 0.06, NS.mat.wall2(), DOOR_W);
    wallWithHole(g, -0.06, NS.mat.wall2(), DOOR_W);
    doorFrame(g, -L + 0.06, NS.mat.metal());
    doorFrame(g, -0.06, NS.mat.metal());
    pipes(g, -L / 2, r, 4);
    // emergency strip lights along the ceiling
    for (let i = 0; i < 3; i++) {
      const z = -1.6 - i * 3.4;
      box(g, 0.12, 0.06, 1.5, new THREE.MeshStandardMaterial({ color: 0xff6a4a, emissive: 0xff3a1a, emissiveIntensity: 1.4 }), -HW + 0.2, H - 0.18, z);
      box(g, 0.12, 0.06, 1.5, new THREE.MeshStandardMaterial({ color: 0xff6a4a, emissive: 0xff3a1a, emissiveIntensity: 1.4 }), HW - 0.2, H - 0.18, z);
      if (i < 2) { const l = new THREE.PointLight(0xff4a24, 1.7, 11, 1.15); l.position.set(0, H - 0.4, z); g.add(l); }
    }
    // timer lever on the right wall
    const cab = new THREE.Group(); cab.position.set(HW - 0.2, 1.3, -5.4); cab.rotation.y = -Math.PI / 2; g.add(cab);
    box(cab, 0.7, 0.9, 0.28, NS.mat.metal(), 0, 0, 0);
    const arm = box(cab, 0.08, 0.34, 0.08, NS.mat.red(), 0, 0.05, 0.2);
    arm.rotation.x = 0.5;
    room.levers.push({ x: HW - 0.45, z: -5.4, obj: arm, on: false, id: 'BD' + room.idx, fuel: 22 });
    block(room, HW - 0.5, HW, -5.75, -5.05);
    // chains + crates for silhouette
    for (let i = 0; i < 4; i++) {
      const z = -2.2 - i * 2.3;
      cyl(g, 0.03, 0.03, 1.4 + r() * 0.8, NS.mat.metal(), -HW + 0.35, H - 0.9, z, 5);
    }
    crate(g, 1.9, -8.6, 0.8, r); block(room, 1.4, 2.4, -9.1, -8.1);
    room.dark = true;
    room.surfaces = [{ x: 1.9, z: -8.6, y: 0.85 }];
  };

  /* ── spec: which archetype is behind which door ───────────────────────── */
  function spec(idx, mode) {
    if (mode === 'backdoor') return { type: 'backdoor', dark: true };
    if (idx >= 100) return { type: 'circuit', dark: true };
    if (idx === 1) return { type: 'hallway' };
    if (idx <= 24) return { type: 'hallway' };
    if (idx <= 42) return { type: 'guest' };
    if (idx <= 62) return { type: 'library' };
    if (idx <= 80) return { type: 'greenhouse' };
    if (idx <= 96) return { type: 'service' };
    return { type: 'hallway' };
  }
  world.spec = spec;

  /* ── assemble one room ────────────────────────────────────────────────── */
  world.build = function (idx, mode) {
    mode = mode || world.mode;
    const r = U.rng(idx * 2654435761 + (mode === 'backdoor' ? 77 : 13));
    const sp = spec(idx, mode);
    const room = {
      idx, type: sp.type, blocks: [], hideSpots: [], levers: [], items: [], surfaces: [],
      dark: !!sp.dark, open: false, door: null, built: Date.now()
    };
    const g = room.group = new THREE.Group();
    g.position.z = -(idx - 1) * L;
    NS.view.scene.add(g);
    (BUILD[sp.type] || BUILD.hallway)(room, r);

    // the exit door: locked sometimes, key hidden somewhere in the room
    const dm = room.type === 'circuit' ? NS.mat.metal() : NS.mat.wood();
    const d = makeDoor(g, -L + 0.06, mode === 'backdoor' ? idx : idx + 1, dm);
    room.door = {
      hinge: d.hinge, mesh: d.slab, open: false, locked: false, need: null,
      z: g.position.z - L + 0.06, angle: 0
    };
    /* Locked doors are the pacing device: every 8th door needs a key that is
       physically in the room, which forces you to walk the whole space (and
       past the thing that may be waiting in it) instead of running the lane. */
    if (mode !== 'backdoor' && idx > 3 && idx < 100 && idx % 8 === 3) {
      room.door.locked = true;
      room.door.need = 'key';
      room.items.push(world.addItem(room, 'key', g.position.z, r));
    } else if (mode === 'hotel' && idx > 10 && idx % 17 === 0) {
      room.door.locked = true;
      room.door.need = 'pick';
    }
    // a torch battery now and then, once the torch exists
    if (mode !== 'backdoor' && idx % 11 === 5) {
      room.items.push(world.addItem(room, 'battery', g.position.z, r));
    }
    // guarantee at least one hiding place per room
    if (!room.hideSpots.length) {
      const s = r() < 0.5 ? -1 : 1;
      const wg = wardrobe(g, s * (HW - 0.55), -1.8, s > 0 ? -Math.PI / 2 : Math.PI / 2);
      room.hideSpots.push({ x: s * (HW - 0.55), z: -1.8, label: 'wardrobe', obj: wg });
    }
    /* Everything a builder registers is in room-local coordinates, but every
       distance check, prompt and teleport works in world space. Normalising
       once here is what makes hiding spots, keys and breakers reachable on
       doors 2..100 instead of silently sitting in room 1. */
    const gz = g.position.z;
    room.hideSpots.forEach((h) => {
      h.z += gz;
      // take the cupboard's own facing instead of guessing from its position:
      // a wardrobe rotated the other way has its doors against the wall
      if (h.obj) {
        const q = new THREE.Quaternion(); h.obj.getWorldQuaternion(q);
        const v = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
        h.out = [v.x, v.z];
      }
      if (!h.out) h.out = [0, 1];
    });
    room.levers.forEach((l) => { l.z += gz; });
    room.items.forEach((it) => { it.z += gz; });
    room.surfaces.forEach((s) => { s.z += gz; });
    if (room.elevator) room.elevator.z += gz;
    room.entryZ = g.position.z - 0.6;
    room.exitZ = g.position.z - L + 0.4;
    room.L = L; room.W = W;
    return room;
  };

  /* items are placed on whatever surface the room reported, so a key is never
     floating in mid-air */
  world.addItem = function (room, kind, gz, r) {
    const s = room.surfaces.length ? room.surfaces[Math.floor(r() * room.surfaces.length) % room.surfaces.length]
      : { x: 0, z: -6, y: 0 };
    const y = (s.y || 0) + 0.10;
    const g = new THREE.Group();
    g.position.set(s.x, y, s.z);
    room.group.add(g);
    let mesh;
    if (kind === 'key') {
      const m = new THREE.MeshStandardMaterial({ color: 0xd8b25c, emissive: 0xffc860, emissiveIntensity: 0.55, metalness: 0.8, roughness: 0.3 });
      mesh = box(g, 0.05, 0.05, 0.26, m, 0, 0, 0);
      box(g, 0.13, 0.04, 0.05, m, 0.06, 0, 0.11);
      box(g, 0.04, 0.11, 0.05, m, 0.11, -0.04, 0.11);
    } else if (kind === 'battery') {
      const m = new THREE.MeshStandardMaterial({ color: 0x2e3a2e, emissive: 0x4a7a4a, emissiveIntensity: 0.3, roughness: 0.6 });
      mesh = box(g, 0.10, 0.20, 0.10, m, 0, 0.06, 0);
      box(g, 0.05, 0.03, 0.05, NS.mat.brass(), 0, 0.18, 0);
    } else {
      mesh = box(g, 0.14, 0.03, 0.03, NS.mat.brass(), 0, 0, 0);
    }
    const glint = new THREE.PointLight(0xffc060, 0.35, 2.2, 2);
    glint.position.set(0, 0.15, 0); g.add(glint);
    return { kind, x: s.x, z: s.z, obj: g, taken: false, spin: r() * 6.3 };
  };

  /* ── room lifecycle ───────────────────────────────────────────────────── */
  world.add = function (idx, mode) {
    const room = world.build(idx, mode || world.mode);
    world.rooms.push(room);
    world.rooms.sort((a, b) => a.idx - b.idx);
    world.refreshBlocks();
    return room;
  };
  world.find = function (idx) {
    for (const r of world.rooms) if (r.idx === idx) return r;
    return null;
  };
  world.refreshBlocks = function () {
    const blocks = [];
    for (const r of world.rooms) for (const b of r.blocks) blocks.push(b);
    world.blocks = blocks;
  };
  world.dispose = function (room) {
    if (!room) return;
    room.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { if (m.map && m.map.__shared !== true) { /* textures are cached */ } });
      }
    });
    NS.view.scene.remove(room.group);
  };
  world.clear = function () {
    world.rooms.forEach((r) => world.dispose(r));
    world.rooms = []; world.blocks = [];
    if (NS.view.scene) NS.view.scene.fog.density = 0.07;
  };

  /* Movement noise is the only channel the entities share with the player.
     Sprinting is 1.0, walking 0.42, crouching 0.06 — the whole stealth layer
     is that one number. */
  world.noiseEvent = function (x, z, amount) {
    if (NS.entities && NS.entities.hear) NS.entities.hear(x, z, amount);
  };
})(window.DOORS);
