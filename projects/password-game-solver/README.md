# Password Game Solver

An automated solver for [neal.fun's The Password Game](https://neal.fun/password-game/) that completes all 36 rules without OCR or guessing.

## How it works

Most solvers screen-scrape. This one doesn't:

1. **Reads the game's own state.** The solver injects a snapshot function into the page and pulls the live component state straight out of the running app — `currCaptcha`, `currPlace`, `currChessPuzzle`, `currYoutubeDuration`, `ruleReached`, the active rule list. No pixel reading, no OCR, no stale DOM.
2. **Composes offline.** `composer.py` builds a candidate password that satisfies every active rule simultaneously as a constraint problem: a prime length that also encodes its own digits, a digit-sum budget of exactly 25 shared between the hex colour, chess move, video ID and clock, roman numerals whose product is 35, element symbols summing to 200, and a letter-frequency cap imposed by the game's 14 allowed font sizes.
3. **Writes and verifies.** Each iteration compares the composed password against the game's own count, learns the constant offset between them, and rewrites the editor only when something actually changed.

## The parts that were actually hard

- **The YouTube rule.** The game picks a random target duration; the solver needs a real video whose duration matches to within one second *and* whose 11-character ID survives the roman-numeral, digit-budget and letter-cap rules. The ID constraints mean only about one in five matching-duration videos is usable, so a cache of tens of thousands of videos is kept and grown in the background.
- **The digit budget is contended.** The clock, hex colour, chess move, captcha and video ID all spend from the same 25-point pool. At an expensive minute the rule is provably unsatisfiable, so the solver must recognise that (rather than misreport it as a length failure), refresh the captcha, and wait for the minute to roll over.
- **Paul.** The game feeds a chick that eats one bug emoji every 15 seconds and ends the run if the count hits zero — so the solver must keep writing a valid password even while it is stalled waiting on something else.
- **The sacrifice rule.** The player names two letters the password may never use again; those letters must be absent from the *finished* password, including the padding the solver adds itself.

## Result

All 36 rules, 211-character password, verified against the game's own ruleset:

| Invariant | Value |
|---|---|
| Length (prime, self-encoding) | 211 |
| Digit sum | 25 |
| Element symbol sum | 200 |
| Roman numeral product | 35 |

## Files

| File | Purpose |
|---|---|
| `solve.py` | State-driven driver (Playwright) |
| `composer.py` | Constraint composer |
| `solver/browser_control.py` | Browser bridge |
| `diag.py` | Offline composer test harness |
| `run.sh` | Clean launcher (kills stale runs first) |
| `elements.json`, `geo_countries.json`, `chess_fen_sol.json` | Answer/data tables |
