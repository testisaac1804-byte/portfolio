# Kwangmyong Network 3.0 — DPRK Intranet Simulator

**Prompt:**

> Build a single-file, offline, educational simulator of the DPRK national intranet
> (Kwangmyong) — the browser, the shops, the mail, the terminal, the surveillance log,
> all of it. It has to run from one HTML file with no server and no network calls.
> Then produce an **English** build of it: every screen, menu, page, table, tutorial,
> article and terminal reply in English, with no residual Korean anywhere a player can
> reach.

**What it is:**

| part | what it is |
|---|---|
| login | 3 accounts — two standard users and one read-only visitor who cannot buy or send mail |
| desktop | Windows-style desktop, dock, start menus, clock, and a ◉ surveillance tray icon |
| 《My Country Explorer》 | the only browser. The address bar resolves `.kp` hosts, internal IPs (`10.76.1.11`), Korean names and shortcuts |
| site catalogue | **136 sites** transcribed from the Wikipedia article *Kwangmyong (network)* — the 2016 portal list plus sites reported after 2016 |
| 30 hand-built sites | shops with a working basket + Central Bank e-payment, intranet mail, search, dictionary, encyclopaedia, KCNA and Rodong Sinmun news, tele-education **with a graded exam**, two playable arcade games, a symptom checker, device registration, an editable filter list, an antivirus scan |
| 106 generated pages | each remaining catalogue entry renders a plausible database page built from its own row (name, domain, IP, holdings, cross-links) |
| blocked pages | any outside address (`google.com`, …) returns a "connection forbidden" page explaining the air gap, and writes an entry into the surveillance log |
| terminal | `help`, `list`, `radar`, `ping`, `netstat`, `sysinfo`, `log` — real replies computed from the sim's own state |
| Help → Contents | what is **real** (documented) vs what is **invented**, with sources |

**Skills used:**
- `kwangmyong-sim-en-build` — the build-time translation layer and the render-then-scan verification loop.

**How the English build works:**

The simulator is written as 20+ source modules under `parts/` and assembled into one
self-contained HTML file. The English build keeps that structure and adds a
**translation layer applied at build time**: 13 key→value batches (`fix5.tsv`–`fix15.tsv`),
in which each row is a literal string from the source and its English replacement.
Anything the batches miss is caught by a render-then-scan loop — headless Chrome opens
the built file, walks the terminal, all 30 sites and the tutorial/About/news surfaces,
and dumps their visible text; the Hangul residue is then found **in Python**, not by
eyeballing screenshots.

**Verified outcome:**

- The simulator ships **its own self-test** (36 checks). The original scores **72/72**,
  and the English build scores **72/72** as well — parity, not a lower bar.
- Terminal sweep, all-apps sweep and the site-pages sweep each report **0 lines
  containing Hangul**.
- Nothing in the sim calls the network: it is one HTML file, offline, no server.
- **Every article, price and page in it is invented for the simulation** — the pages say
  so themselves, and the Help screen separates the documented parts (the catalogue, from
  Wikipedia) from the invented ones.
