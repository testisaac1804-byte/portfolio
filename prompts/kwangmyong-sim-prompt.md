# Kwangmyong Network 3.0 — the DPRK intranet, network only

**Prompt:**

> Build a single-file, offline, educational simulator of the DPRK national intranet
> (Kwangmyong) — and build **only the network**: the browser, the catalogue, the shops,
> the mail, the search, the blocked pages and the surveillance log. No desktop, no
> login, no terminal, no settings: the machine is someone else's project. It has to run
> from one HTML file with no server and no network calls, and every screen has to be in
> English with no residual Korean anywhere a player can reach.

**What it is:**

| part | what it is |
|---|---|
| the portal | opens directly on `www.sciteco.aca.kp` — no boot sequence, no login gate |
| service strip | 42 px across the top: browser, search, mail, shop, Manbang, catalogue, log, About |
| 《Naenara Explorer》 | the only browser. The address bar resolves `.kp` hosts, internal IPs (`10.76.1.11`), Korean names and shortcuts |
| site catalogue | **136 sites** transcribed from the Wikipedia article *Kwangmyong (network)* — the 2016 portal list plus sites reported after 2016 |
| 30 hand-built sites | shops with a working basket + Central Bank e-payment, intranet mail, search, dictionary, encyclopaedia, KCNA and Rodong Sinmun news, tele-education **with a graded exam**, two playable arcade games, a symptom checker, device registration, an editable filter list, an antivirus scan |
| 106 generated pages | each remaining catalogue entry renders a plausible database page built from its own row (name, domain, IP, holdings, cross-links) |
| blocked pages | any outside address (`google.com`, …) returns a "connection forbidden" page explaining the air gap, and writes an entry into the log |
| Help → Contents | what is **real** (documented) vs what is **invented**, with sources, plus a line saying the machine is deliberately absent |

**What was cut, and what is asserted absent:**

boot splash · login gate and its three accounts · Windows-style desktop · wallpaper ·
desktop icons · dock · start menus · settings panel · document store · command terminal.

The cut lives in one appended module, `parts/net_shell.js`, and three applications are
deleted from the registry rather than hidden. The self-test asserts the absence: no boot
screen, no login screen, no icons, no dock, no start menu, and three apps that must not
exist.

**Skills used:**
- `kwangmyong-sim-en-build` — the build-time translation layer, the render-then-scan loop, and the network-only shell.

**How the English build works:**

The simulator is written as 20+ source modules under `parts/` and assembled into one
self-contained HTML file. The English build keeps that structure and adds a
**translation layer**: 13 key→value batches (`fix3.tsv`–`fix15.tsv`, 421 rows) applied at
build time, longest key first, plus a render-time dictionary for anything generated after
the build. Anything both miss is caught by a render-then-scan loop — headless Chrome opens
the built file, walks all 136 sites and the Help tabs, and dumps their visible text; the
Hangul residue is then found **in Python**, not by eyeballing screenshots.

**Verified outcome:**

- The simulator ships **its own self-test**: 41 checks, all green, including the
  assertions that the desktop is gone.
- Render sweeps report **0 Hangul** on the portal, the Help tabs, the catalogue and the
  news pages.
- Nothing in the sim calls the network: it is one HTML file, offline, no server.
- **Every article, price and page in it is invented for the simulation** — the pages say
  so themselves, and the Help screen separates the documented parts (the catalogue, from
  Wikipedia) from the invented ones.
