# tripo3d.uk — archived front-end, made runnable

An offline copy of the public front-end of `https://tripo3d.uk`, captured **2026-10-21**, kept so
the analysis in `../tripo3d-uk-teardown.html` can be checked against the real thing.

**This is not a working model service.** Every request the copy would make to the operator's API is
answered locally by `mirror-guard.js`; nothing leaves the page. The one job you can start "completes"
after ~7 s into a **sample model** (`duck.glb`, a Khronos glTF sample) — not something generated from
your picture, and labelled as such on the stage and in the bottom bar. It is **not affiliated** with
Tripo3D and not an official copy of their product — see the teardown for what it actually is.

## What is byte-faithful

| | |
|---|---|
| JS chunks | 49 files, 1,320,125 B — every `sha256` matches the origin manifest in `../tripo3d-uk-evidence/bundles.sha256` |
| CSS | 36 files: 14 named in the shell or by `/login` / `/register`, plus 22 per-route sheets the router injects on demand, all as served |
| Shell | the origin's 3,396 B document, `sha256 09c0734a9755e6ed…`, kept verbatim in `../tripo3d-uk-evidence/served-shell.html.txt` |
| 3D env | `studio.hdr` (1,609,438 B), the three.js lighting probe the workspace fetches at runtime |
| Viewer swatches | `viewer/images/*.png` — the material presets the viewport shows once a model is on the stage |
| Total | 3.2 MB, no image or font dependencies otherwise — the app ships its own inline SVG/icons |

## The seven deltas applied to the shell (no JS or CSS is edited)

1. `"/_nuxt/…` → `"./_nuxt/…` on **36** asset URLs — the copy lives under `/portfolio/demos/`, and
   root-absolute URLs would resolve outside it.
2. `baseURL:"/"` → derived from `location.pathname` — a Nuxt router pinned to `/` never matches a
   route when the document is served from a subdirectory (symptom: every URL renders their 404 page).
3. `<link rel="icon" … href="/favicon.svg">` dropped — the origin answers that path with this same
   SPA shell, not an icon.
4. `<script src="./mirror-guard.js?v=3">` injected as the first script, plus
   `<meta name="robots" content="noindex,nofollow">`. The `?v=` is a cache-buster: a bare filename is
   edge-cached, so an updated guard would never reach a returning browser.
5. `<link rel="icon" href="/portfolio/demos/tripo3d-uk-mirror/favicon.ico">` added, with the full
   deploy path — with no icon link Chrome probes the **origin root**, and with a *relative* one it
   re-probes against the current route (`/workspace/favicon.ico` after the router moves); both 404.
6. Nothing else in the document. Result: 3,745 B (+349 B on 3,396).
7. Files *added* beside the shell, none of them from the origin's shell:
   `favicon.ico` (100 B) so the browser's automatic `/favicon.ico` request does not 404;

## What the guard does

`mirror-guard.js` (~19 KB, the only file written by me) reimplements the backend away. It is a fake
API that answers in-process, so the real screens render with fabricated data:

| route | what comes back |
|---|---|
| `POST /api/auth/login`, `/api/auth/register` | `200` with a token and a user — **any username, any password** |
| `GET /api/auth/me`, `/api/user/balance` | the same fabricated user: `role: admin`, `balance: 128`, `total_consumed: 42` |
| `POST /api/auth/refresh` | `401`, as an anonymous visitor gets — so the copy always opens on the real login screen |
| `GET /api/announcement` | the body **captured from the live origin** (`updated_at 2026-09-16 23:19:35`) |
| `GET /api/gen-models` | a model catalogue with the real shape (`v3.1` 20 credits, `P1` 5) so the pickers populate |
| `POST /api/upload[/image]` | `200 {image_token}` — accepted locally so the file you pick previews in the panel; the bytes never leave the page |
| `POST /api/upload/model` | `400` with the demo line — imports are not simulated |
| `POST /api/task` | `200 {task_id}` — starts a **local demo job** |
| `GET /api/task/<id>`, `GET /api/user/tasks/poll` | elapsed-time progress: `queued` → `running` 4…96 % → `success` at 7 s |
| `GET /api/user/tasks` | the job list, including one permanent `demo-seed` entry so the asset panel is not empty on arrival |
| `/api/task/<id>/thumbnail` | served from the local `demo-thumb.png` |
| `/admin/*`, `/api/admin/*` | empty-but-correct shapes: stats counters, `{users: []}`, `{logs: []}`, `{series: []}` |
| anything else under `/api` or `/admin` | `200 {}`, recorded in `window.__mirrorUnstubbed` |

Blocked outright: `WebSocket`, `EventSource`, `sendBeacon`, service-worker registration, form
submits. Every intercepted URL is recorded in `window.__mirrorBlocked`; the capture metadata is in
`window.__MIRROR__`. A fixed bottom bar labels the frame, in Chinese and English, and links back to
the teardown.

Each fake payload is returned with its fields **both** at the top level and under `data`
(a shallow copy, so no cycles) because the bundle's `$api` wrapper is minified and I cannot tell from
outside whether it unwraps `.data`. Sending both satisfies either.

## The demo job, and why the guard drives it

The app's own "task started" signal goes over an internal event bus that, under this mirror, never
reaches the right-hand asset panel — so a submitted job would sit invisible while `POST /api/task`
returned a perfectly good id. The guard therefore imports the bundle's bus module **by URL**
(`_nuxt/C8rqidu5.js`; the same URL the app imports, so it is the same module instance) and, when a job
finishes, calls `emitLoadModel` with `demo-model.glb`. That is what puts the model on the stage and
makes the viewer's material swatches appear.

Two files exist only for this: `demo-model.glb` (Khronos glTF sample "Duck", 118 KB, CC0) and
`demo-thumb.png` (2 KB, drawn by me). Both are labelled **DEMO** in the UI; nothing claims they were
generated from the image you uploaded.

## Poking at it

Type anything into the sign-in form. The credential check never leaves the page, so you land in the
real workspace: the 5 / 10 / 15-credit meter, the eight `/admin` screens, the batch-key table, the
sub-server mode switch. All of it is running on stubs — `128` credits is a constant, the tables are
empty by construction.

1. **Upload** any picture (the preview is real, the file never moves).
2. Press **生成模型**. It says the job is queued; ~7 s later the stage loads the sample model, the
   right panel offers material presets, and 导出 / 下载 serve the same local `.glb`.
3. Everything else — 拆分 / 补全 / 重拓扑 / 纹理 / 动画, the admin tables — renders from stubs.

The one thing that does not work, by design: **reloading a deep route**. The router keeps its state
in `history`, and there is no server here to answer
`/portfolio/demos/tripo3d-uk-mirror/workspace/generate`, so a reload 404s. Use the in-app nav or
**open full screen ↗** from the teardown.

Logged-in state persists in `localStorage` the way the real app does it, so a reload returns you to
the workspace you were on (route permitting). Clearing site data or signing out returns the login
screen.

## Not from the capture

`mirror-guard.js` (mine, above), `favicon.ico` (100 B placeholder), `demo-model.glb`,
`demo-thumb.png`, and `viewer/images/*.png` (the viewer's own preset swatches, re-fetched from the
origin because the app requests them root-absolute and they 404 under `/portfolio/`). `_nuxt/index.html`
is emitted by this site's deploy tooling, which drops a folder index into every directory — it is not
referenced by the app and not part of the origin.
