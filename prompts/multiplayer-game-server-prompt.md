# Multiplayer Game Server

**Category:** Software & Apps · **Status:** Done

WebSocket multiplayer backend - multi-room, sync, spectator.

**Stack / Tools:** WebSocket, Python, FastAPI, Real-time

**Build path:**
- V1 — Single room.
- V2 — Multi-room with room codes.
- V3 — Spectator mode + reconnect.

**Location:** `~/demos/game-server.html`

Full build spec already in this prompt file (FastAPI + WebSocket ECS game server + host/client .pkg).

## Where it lives
- Source folder: `~/Documents/projects/apps/multiplayer-game-server`
- Artefacts on the site: 18 files · 1,892 lines of text · 63 KB

## Stack
- Python ×16 · .txt ×1 · HTML ×1 · requirements.txt

## What's in the code
- `client/index.html` — 660 lines (HTML)
- `server/game/physics/physics_system.py` — 338 lines (Python)
- `server/main.py` — 259 lines (Python)
- `server/game/game_manager.py` — 159 lines (Python)
- `server/game/ecs/world.py` — 154 lines (Python)
- `server/game/ecs/component.py` — 87 lines (Python)
- `server/game/networking/websocket_manager.py` — 76 lines (Python)
- `server/game/networking/protocol.py` — 67 lines (Python)
- `server/game/physics/collision.py` — 33 lines (Python)
- `server/config.py` — 25 lines (Python)
- `server/game/ecs/system.py` — 25 lines (Python)
- `server/game/ecs/entity.py` — 9 lines (Python)

## Verified in the Python source
- routes: `get /`, `get /health`, `get /status`, `get /admin`, `get /admin/players`, `post /admin/kill/{entity_id}`
- classes: `AABB`, `CollisionDamage`, `CollisionSystem`, `Component`, `ComponentStore`, `GameManager`, `Health`, `ItemPickup`, `ItemSpawnerSystem`, `Lifetime`, `LifetimeSystem`, `MovementSystem`, `NetworkOwned`, `PlayerInput`
- functions: `aabb_collision_info`, `aabb_vs_aabb`, `clamp_to_world`, `error_msg`, `make_destroyed`, `make_pong`, `make_state`, `make_welcome`, `new_entity_id`, `parse_input`, `parse_join`, `parse_ping`

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
