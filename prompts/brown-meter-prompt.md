# The Brown Meter — a live brownness meter on a Cloudflare Worker

A public page that shows exactly how brown something is, on a 0-100 scale: one big
icon, a percentage, and a word that says what that number means. The owner logs in at
`/admin` and pushes the slider — and **every open screen changes by itself**, over a
server-sent-events stream, with no refresh.

## Live

- App: https://brown-meter.isaac1804.workers.dev
- Admin: `/admin` — password-gated (credentials kept out of the repo, 0600 file on disk)
- Backend: Cloudflare Worker `brown-meter` + KV namespace `BROWN`
- Free tier only: no card, no build step, no dependencies — one `worker.js` file.

## Where it came from

The original job was to *find* someone else's Netlify page called "Brown Meter" — a class
in-joke whose exact URL could not be recovered. Rather than keep hunting for a link, the
meter was built properly, on Isaac's own domain, and it came out better than the joke.

## What it does

- **8 bands, 64 words.** Every band has eight phrasings, its own *"as brown as ___"*
  comparator and rotating flavour lines — `nothin brown here` → `a hint of beige` →
  `hmm` → `ohh` → `ohhhh` → **`ouuuu`** → `OUUUUUU` → `MAXIMUM BROWN`. The canonical
  word is biased to the front of the rotation so 75% still reads **ouuuu**.
- **Live, not polled.** `/api/stream` is a real SSE endpoint; a change is pushed to every
  viewer in the same tick. Clients reconnect + fall back to polling if the stream dies.
- **Records.** Today's peak and the all-time peak are tracked in KV. Beat one and a
  "NEW PEAK!" flash drops onto the public page.
- **A public reaction bar.** Visitors tap *ouuuu / meh / i'm dead*; counts push live to
  everyone. One tap per visitor per minute (hashed IP + 60 s cooldown, 429 with a
  countdown), and the client never gets to name the counter.
- **Vibe mode.** Optional hourly cron tick that drifts the meter 1-9% on its own,
  bouncing between 8% and 97% instead of sticking to a wall. Off by default — when it is
  off the cron costs a single read and does nothing.
- **Installable + shareable.** Inline SVG icon, web manifest, `og:` link-preview tags.
- **Honest admin panel.** Slider + presets, nudge buttons, `🎲 surprise me`, undo (a real
  toggle, not a fake stack), a recent-changes list, and a wipe button for the reactions.

## Build path

- **V1** — Worker + KV, password-gated admin, public page, `/api/rate`, live push, logout
  that actually revokes (a KV session generation bump).
- **V2** — admin panel rebuilt (slider, presets, history, stats); a 2-second in-isolate
  micro-cache so N viewers cost one KV read per TTL; screenshot + live verification.
- **V3** — 24 words → 64; "as brown as" comparators; daily + all-time peaks; public
  reactions with live counts; hourly auto-drift; icon + manifest; **173/173 assertions**.

## Verified, not assumed

173/173 offline assertions (fake-KV harness: bands, rotation, sessions, lockout,
undo, records, reactions, vibe ticks, icon/manifest). Live: reaction tap returns 200 then
429 for the repeat, a captured SSE stream really carried the `stats` event, the mode
toggle flipped vibe → manual and the public badge followed, and the admin password appears
zero times in the public HTML.
