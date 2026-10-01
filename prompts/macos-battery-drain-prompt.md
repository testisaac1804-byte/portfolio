# macOS Battery Drain Mode — build spec

Build an interactive single-file HTML reference guide (light theme, self-contained, no CDN deps) explaining how to make a MacBook stay fully awake on battery — lid closed or open — until it drains to ~0% and powers itself off.

## Context (real session)
Isaac ran this live on his own Apple Silicon MacBook: battery at 40%, lid-close sleep defeated, drained to ~1% over ~1.5 h with a per-minute battery log as proof, then restored normal sleep. The guide teaches the same trick safely.

## Required sections (tabbed)
1. **How it works** — 3-layer model: pmset settings (changeable) → powerd daemon (applies them) → battery/SMC firmware cut-off at ~1–2% (NOT changeable — the safety net). Include a playable drain simulator (40% → 0% with live log lines and a POWER OFF step).
2. **The settings** — table of `disablesleep`, `sleep`, `hibernatemode`, `displaysleep` with normal vs drain value and plain-English meaning.
3. **Run it** — 6 steps: unplug at any %, enable (`sudo pmset -a disablesleep 1 sleep 0 hibernatemode 0`), optional logger one-liner, close lid, wait for auto power-off, restore (`sudo pmset -a disablesleep 0 sleep 10 displaysleep 5 hibernatemode 3 standby 1`). Copy buttons on every command.
4. **The log** — sample `~/battery-drain.log` output (timestamp + %), read start vs end.
5. **Quiz** — 6 questions with instant scoring.
6. **Warnings/FAQ** — bag/overheating, battery lifespan (full drain once every few months, not daily), what "0%" means, Apple Silicon works, why password needed.

## Verification
- Inline JS passes `node --check` (extract between `<script>` tags).
- Runtime smoke test in Node with a DOM stub: quiz renders 6 questions / 24 options, correct/wrong answers score right, tab switching works, simulator update() sets pct text.