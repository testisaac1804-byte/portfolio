# Escape House — build spec

**Deliverable:** `EscapeHouse.html` — one self-contained HTML file (no network, no assets, no install) that
plays as a first-person point-and-click escape game. Source lives in `~/Desktop/escape-house/` and is
concatenated by `python3 build.py` into the single file.

**Origin:** a Desmos activity whose entire game — rooms, codes, items, flags — lives in the expression list.
Fidelity target is that graph, not the screenshots.

---

## 1 · Constraints

1. **Single file.** No `<script src>`, no `<img src>`, no fonts, no fetch. `grep -oiE 'src="[^"]*"|href="[^"]*"'`
   must return only `xmlns` URLs.
2. **Fixed logical room space.** Every hotspot and prop is positioned in percent of the room box, so one set of
   coordinates works at 390 px and at 2560 px. Props are SVGs (`viewBox="0 0 100 100"`,
   `preserveAspectRatio="none"`) stretched into their box — do not add `meet`, it re-composes every room.
3. **No text inputs.** All codes are dials, keypads, wheels or clocks.
4. **State in one object.** `G = {level, room, inv[], sel, f{}, unlocked[], hard}`; every puzzle gate is a flag in
   `G.f`, every save is `JSON.stringify(G)` into `localStorage`. Anything a hint needs must be derivable from `G`.
5. **Mobile is a first-class target** (Isaac plays on a phone and on a Mac). Under 560 px the room becomes a
   fixed-aspect band; nothing may overflow horizontally.

## 2 · Reading the original

- Export the activity state, walk `expressions.list` (794 entries: 576 `expression`, 175 `image`, 42 `folder`,
  1 `text`), and collect every entry carrying `clickableInfo`.
- Flags are brace-named in LaTeX — `u_{lightsOn}`, `u_{iceKey}`, `u_{sedDart}` — so strip `_{}` before searching.
- Codes appear as literal arrays in the graph (e.g. `DrawerClicked = [1,3,1]`); read them there, never guess.
- Rooms are identified by `P_{centerScene}` clusters on a 3×3 grid; each room also names its own art folder.

## 3 · The chain (level 1, must be preserved exactly)

```
fridge → ice ─┐
              ├→ hot tap → ice key → trapdoor → basement landing
light switch → basements ─→ slice wheel → dart ─→ balloon → rope → stairs → bedroom + office
bedroom: gloves · nightstand → screwdriver · keypad (screwdriver) 962 → greenhouse
greenhouse: cactus (gloves) → gold key → glass case → magnifier
office: lamp + magnifier → fire → library exit opens
kitchen: drawer 131 → tape → bookcase panel 4·5·19·13·15·19 → UV light
clock: hands (library) + 7:30 (UV, basement) → opens → bike chain → bike
office computer: screwdriver → 4 nodes → power → lights-out → disk
```

Codes: drawer `131`, keypad `962`, bookcase `4 5 19 13 15 19` (A1Z26 "DESMOS"), clock `7:30`.

## 4 · The hint system (the actual feature request)

> “add a hit button on the top that helps poeple who are doing the thing and they dont know how to do”

```
HINTS[level] = [ { id, room, done(G), need(G), t:[rung1, rung2, rung3] } , … ]
```

- **Rung 1** direction only · **rung 2** the move, in order · **rung 3** the answer and the room.
- Escalation: new beat → rung 1; same beat re-asked → rung 2; again → rung 3 (capped, never loops).
- `resolveStep()`: open lock panel wins (a panel sets `activeHint`); otherwise the first beat with
  `!done(G) && need(G)`; otherwise "all done, head for the exit".
- Surfaces: header `💡 Hint`, the `H` key, and a `💡 Stuck?` button inside **every** lock panel.
  The hint card sits at `z-index:25` — above `.lock` (20), below `.menu` (30).
- Idle: 55 s without a click makes the button pulse; any click clears it.
- Progress is shown as `n / total` plus one dot per beat. 18 beats in the house, 7 in the lab, 7 in the vault.

**Pitfall:** `showHint()` and `paintHint()` must share one resolver. When they resolved separately, the context
set by an open panel was silently discarded and every hint fell back to the earliest unsolved beat.

## 5 · Verification (do this every build)

1. `node --check` every source file, then `python3 build.py`.
2. Headless Chrome over CDP, viewport 1440×900 **and** 390×844:
   - click through the whole level-1 chain with real `MouseEvent`s (SVG elements have no `.click()`);
   - assert each `HINTS` beat flips to `done` and the ladder ends on the exit beat;
   - screenshot: menu, a hint at each rung, a lock with the hint card open, the win card, plus 390 px.
3. Assert no console errors, no horizontal overflow (`document.documentElement.scrollWidth <= innerWidth`).
4. After publishing: `shasum -a 256` the artifact against `/demos/escape-house/index.html` and
   `/demos/escape-house-mirror/index.html` — all three must be identical.

## 6 · Known deviations (state them, do not hide them)

- Props are redrawn SVG; the original's 175 images are the activity author's artwork and are not shipped.
- The four UV clue graphics are polygons in the graph, so which wall shows which code cannot be read from the
  state dump — codes exact, room placement inferred so the chain stays solvable.
- Lights-out is 5×5 for phone-sized modals (original: 8×8).
- The original's `hardMode` switch is not wired up.
