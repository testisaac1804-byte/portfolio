# Doors — a hundred hotel doors, and the things that walk the halls

**Live:** https://isaac1804.com/demos/doors/
**Source:** `~/Desktop/doors` — `index.html`, `js/core.js`, `js/world.js`, `js/entities.js`, `js/game.js`, `assets/three.min.js`, `qa/full.py`

**Ask:** "can you make a doors game" — followed by the official floor list: Floor 1 The Hotel, Floor 2 The Mines, Floor 3 The Castle, and the subfloors (Backdoor, The Rooms, The Archives, The Outdoors, The Stairwell).

---

## What it is

A first-person horror run through 100 numbered hotel doors, in one browser tab, with no assets. Every wall texture, carpet pattern, book spine and face is drawn onto a canvas at load time; every sound — footsteps, the door latch, the heartbeat when something is close, the lift bell — is oscillators and filtered noise. 124 KB of game code and 612 KB of three.js is the entire download. No images, no audio files, no CDN.

The loop is the one from the game: walk to the door, open it with E, get through, and survive whatever the room sends. Speed is the only defence on the hotel floor — Rush comes down the corridor and the only thing that saves you is being behind a door or inside a wardrobe when it arrives.

**Floor 1 — The Hotel** is complete and playable end to end:

| Band | Archetype | What it asks of you |
|---|---|---|
| 1–20 | Hotel hallway | sconces, a leaking ceiling, the first Rush |
| 21–40 | Guest room | bedside lamp, made bed, a wardrobe you can hide in |
| 41–60 | Library | bookshelf aisles, a brass chandelier, Screech |
| 61–80 | Greenhouse | glass, wet stone, dying lamps, hanging vines |
| 81–96 | Boiler room | pipes, a tank, crates, Halt |
| 97–99 | Hallway | the last three doors before the finale |
| 100 | Circuit room | five breakers, one lift, The Figure |

**Door 100** is the electrical finale: five breaker panels labelled A–E, only A, C and E are the live circuit, and a clue board on the wall spells that out. Throw B or D and the lights die and The Figure stands up — it is blind, it is not deaf, so you crouch and hold still. Power the three correct breakers and the lift answers.

**The Backdoor** is playable as a separate run: 50 rooms numbered −50 to −01, a countdown that only refills when you pull the levers, and something in the dark that starts walking when the clock runs low.

Floor 2 (The Mines), Floor 3 (The Castle), The Rooms, The Archives, The Outdoors and The Stairwell are listed on the lobby with the official descriptions, marked **locked**. They are not in this build. The lobby says so, the win screen says so, and this page says so.

---

## The systems

**Streaming.** Rooms are built on demand at `z = -(idx − 1) × 11`, three at a time, and disposed behind you. The generator is seeded per door (`idx * 2654435761 + mode`), so door 57 is the same room every run — a horror game where the map reshuffles is a horror game you cannot learn.

**Doors.** Each has a number plaque on the wall beside it, a hinge that swings, a latch sound, and a state: closed, open, locked. Locked doors need the key that room is hiding; picks bypass one lock and are spent when they do.

**Light.** A hand-crank torch with a battery that drains when it is on and refills slowly when it is not, plus room lamps that are sometimes dead and sometimes not. `room.dark` room types (greenhouse, boiler room, circuit room) punish leaving it on: light is how things find you.

**Hiding.** Wardrobes, planters, shelving, a water tank, the clue board. Step in and the camera moves inside, the frame sits at the edges of your view, and Rush passes.

**Entities.** Rush (a shroud that crosses the room and kills you if you are standing in the open), Screech (a face behind you if you do not look), Halt (walks backwards at you until you retreat), The Figure (blind, hunts sound, only in the circuit room), and the Backdoor's chaser.

---

## Verified, not claimed

`qa/full.py` drives the real game in headless Chromium — a fresh browser per section, evaluating against the game's own state — and asserts **48 facts**, all passing, exit 0:

- door advance, the exit door starting closed, E opening it, walking through incrementing the door
- every archetype by band (1, 30, 50, 70, 85, 100), keys, picks, locked doors
- Rush: kills you in the open, does nothing while you are hidden
- Screech: 45 damage if ignored, nothing if you look
- Halt: retreat clears it
- the circuit: A, C, E power the lift, B and D wake The Figure, the win fires
- the player's own path to an interaction — walk to a wardrobe, read the prompt, press E
- the Backdoor end to end: −50 numbering, lever refill, −01 as `-01`, the exit winning
- pause/resume, death → retry on the same door
- 390×844: no horizontal scroll, touch controls present, zero console errors

Screenshots for every room type, every entity, the win screen and both phone screens were rendered and read back — not assumed.

---

## Seven things that were wrong

1. **Hiding was silently broken from door 2 onward.** Every builder registered hiding spots, keys and breakers in *room-local* coordinates while every distance check ran in *world* coordinates. The prompt appeared, E did nothing. No state-level test caught it; only a test that walks up and presses E did. Builders now emit world coordinates and the harness does exactly that.

2. **The wardrobe was a solid box.** Hiding put the camera inside a sealed mesh, so the screen went black — you could not see the corridor you were hiding from. It is now hollow, the doors are hidden while you are inside, and the eye sits at the opening.

3. **The finale room was 16 m deep in an 11 m grid.** Door 101's plaque poked through the far wall and the lift sat outside the room you were standing in. It is 11 m now, with a solid far wall: the lift really is the only way out.

4. **Metals rendered black.** Three.js metals need an environment map; without one the lift's steel leaves and the chandelier were near-black. Painted steel with low metalness and no env map reads correctly.

5. **Legacy colour management** was rendering every texture about 1.8× brighter than authored, which is why dark wood looked like pale plastic. Three r140 still defaults to it.

6. **Rush looked like a black card.** A flat plane with a hard edge sliding down a corridor reads as a UI element. It has a soft radial shroud now.

7. **The phone HUD sat under your thumb.** Health, breath and the item slots were in the joystick's corner. They are top-left and top-right on touch, and the interaction prompt drops the `[E]` because there is no E.

---

## Honest limits

- **Floors 2 and 3 do not exist here.** The Mines and the Castle are described, not built. Neither are The Rooms (1,000 rooms), The Archives, The Outdoors or The Stairwell.
- **The entities are approximations.** They follow the rules that make them survivable — approach speed, hide-to-pass, look-to-dismiss, retreat-to-clear — but not the original's exact timings, spawn tables or audio.
- **No save file.** A run lives in the tab; closing it loses the run. Progress is not persisted.
- **The lift is one room.** There is no-between-floor sequence; the win is a card.
- **This is a fan tribute.** The name, the door-numbering and the entity names belong to LSPLASH's DOORS. All geometry, textures and audio here are original.
