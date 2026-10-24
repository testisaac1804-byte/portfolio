# Box, Box — a pit stop you run against the clock

**Category:** Games & 3D · **Status:** Done · **Built:** October 2026

## The ask

The first game shipped a harbour circuit with a pit lane in it, and the pit lane
was scenery — a place you drove past. The second game had to be *another* game
that kept it. So the pit lane stops being scenery and becomes the arena: one car,
six crew, twelve controls, and a clock that starts the instant the car stops.

## What it is

A pit-stop game in five rounds. You are the chief on the wall. The car arrives
under the lights, you lift it on the jacks, four crews change four wheels in
parallel, the fuel rig runs on its own crew, and then you call it away.

A stop is a pipeline, not a reflex test. The crew are **station-locked** — the
front-left crew can only touch the front-left wheel — so the game is about
ordering and overlap. A job can be dispatched *before* its prerequisite is
satisfied: guns go on the hubs while the jack is still rising, a new tyre queues
behind the old one coming off, and the job stalls at 0 % until the prerequisite
lands. Playing it well means filling every crew's queue and keeping the fuel rig
running underneath.

## Controls

| Action | Touch | Key |
|---|---|---|
| Wheel off / on (FL, FR, RL, RR) | station buttons | 1–4 off, 5–8 on |
| Jack up | Crew panel | 9 |
| Jack down | Crew panel | Q |
| Fuel | Crew panel | W |
| Release | Crew panel | Space |

## The five rounds

| Round | Fuel | Cross-thread | Gold | Twist |
|---|---|---|---|---|
| 1 | 3.0 s | — | 4.30 | Standard stop |
| 2 | 3.0 s | — | 4.10 | Same car, tighter clock |
| 3 | 3.2 s | one corner | 5.20 | That corner's wheel-off takes 1.8 s |
| 4 | 5.0 s | one corner | 5.50 | Fuel now runs longer than the wheels |
| 5 | 5.0 s | one corner | 5.45 | Tightest targets of the championship |

The floor is arithmetic, not vibes: jack 0.8 + wheel (0.9 off + 1.5 on) + jack
down 0.6 = **3.8 s**, with the four corners running in parallel and a
cross-threaded nut adding 0.9 s to one of them. Gold sits 0.5 s above the floor,
which is roughly what a human loses to reaction time.

## The only way to lose

**Release is always available.** Call the car away with a wheel off, the rig still
attached, or the car on the jacks and it is an unsafe release: five seconds
penalty, no medal, and the results card names exactly what was wrong. Everything
else in the game is a matter of speed; this is the one decision with a real cost,
and the menu says so instead of hiding it behind a disabled button.

## Built in Blender

One Python script inside Blender builds the whole box: pit lane asphalt with
painted box markings, the garage bay with tool chest and tyre stacks, the pit
wall, the car, and six crew figures. The critical decision was naming: every part
the game touches is its own node in the GLB —

```
Car · CarBody · Wheel_FL/FR/RL/RR · Jack_F · Jack_R · FuelRig · Crew_FL/FR/RL/RR/JACK/FUEL
```

— so the browser animates the *real* geometry rather than proxies: the wheels
slide off their hubs along the car's X axis, the body lifts 11 cm on the jacks,
the crew lean into the corner they are working. 2,139 faces, 0.27 MB, no textures.

## Bugs worth keeping

1. **The void.** The environment was built into the `GEOM` accumulator and
   `finish()` was never called, so the export contained 17 objects: a car, six
   crew and some props floating in nothing. Every test passed — the render did not.
2. **Cameras inside the wall.** The hero and gameplay cameras sat behind the
   garage's side wall, so the first "does it read as a pit box" render was a grey
   rectangle. Moving them into the lane fixed the framing; the geometry was fine.
3. **The floating shelf.** An overhead gantry directly above the car projected
   onto the car's silhouette from a high camera. Moved to the pit entry, it still
   crossed the frame, so it was cut and the start lights went into the HUD — where
   they were more legible anyway.
4. **Crew facing the wrong way.** The figure's front is −Y, so a mechanic on the
   car's right needs −90°, not 180°. All six were staring at the wall.
5. **Exposure.** Three lights at full chat plus `toneMappingExposure = 1.05`
   turned 0.11 asphalt into white paper and erased the car's livery. Halving the
   rig restored the contrast the Blender render had.
6. **The wheel state that meant two things.** The "on" state was both the initial
   condition and the completion of a wheel change, so all four "Wheel on" buttons
   read *done* at the start of every stop and `wheelsDone` could never reach four.
   Replaced with an explicit stage: `on → off → fitted`.
7. **Dispatch refused during the jack.** The harness caught it: tapping a wheel
   before the car was up returned false, so a player had to wait for the jack
   before touching anything — which is neither fast nor what a real crew does. The
   fix is the stalled-job model described above.
8. **A round that lied in its own briefing.** Round 4's note claimed "fuel becomes
   the gate" while its 4.2 s fill finished before the 4.7 s wheel floor. The
   numbers were changed to make the claim true rather than the copy weakened.

## Verified by playing it

`qa/autopilot.py` drives the real dispatch path the buttons use: jack, fuel, both
stages on all four corners, jack down, release. It finishes in **3.83 s** — the
arithmetic floor — takes gold, writes the best stop, and asserts zero page errors
and zero failed requests. A second pass taps release immediately after the jack
and asserts the +5.00 s penalty, `unsafe: true` and no medal.

`qa/playthrough.py` runs all five rounds and reports each medal — 3.87, 3.96,
4.77, 5.65 and 5.48 s — confirming the cross-thread and fuel changes actually bite.

`qa/shots.py` checks the phone layout: all twelve controls on-screen at 390×844,
none under 38 px, no page scroll. That check earned its keep twice — the
status chips were eating the middle of the 3D view, and the briefing text was
dark grey on a bright garage until it got its own panel.

## Honest limits

No tyre compounds, no damage, no rival chief to race. The crew *lean* into their
work rather than performing a motion-captured stop, and the fuel rig is a static
prop with a progress bar. Sound is synthesised in the browser (WebAudio), not
authored. The best stop lives in localStorage, so it is per-browser rather than
per-player, and the five rounds loop rather than ending in a championship table.

## Where the files are

```
~/Desktop/pit-stop
├── index.html          HUD, job panel, results, mobile layout
├── game.js             scheduler, crew, rounds, synth audio, QA hook
├── assets/pitbox.glb   0.27 MB, 2,139 faces
├── assets/pitbox.json  anchors in three.js space (wheels, jacks, crew)
├── blender/build_pitbox.py
├── blender/render_views.py
└── qa/                 autopilot.py · playthrough.py · shots.py
```
