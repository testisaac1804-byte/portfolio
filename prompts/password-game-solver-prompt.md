# Password Game Solver

**Prompt:**
> Build a solver for neal.fun's Password Game that beats all 36 rules. Don't screen-scrape or OCR — read the game's own runtime state instead (it's a Vue app; pull `currCaptcha`, `currPlace`, `currChessPuzzle`, `currYoutubeDuration`, `ruleReached` straight out of the live component), then compose a password that satisfies every active rule at once and write it back into the editor. It has to survive the YouTube rule (random target duration — find a real video matching within a second whose ID also passes the roman-numeral, digit and letter-cap rules), the shared 25-point digit budget, and Paul eating a bug every 15 seconds. Verify against the game's own ruleset, not a screenshot.

**Skills used:**
- `password-game-solver` — rule semantics extracted from the game bundle, the composer's constraint model, and the state-driven driver
- `playwright-web-automation` — browser bridge, injecting the state snapshot, and driving the editor
- `systematic-debugging` — tracking down the three stall modes (empty state read, mislabelled digit overflow, sacrifice-letter collision) instead of guessing

**Outcome:** all 36 rules cleared, 211-character password, verified against the game's own ruleset (prime self-encoding length, digit sum 25, element sum 200, roman product 35).
