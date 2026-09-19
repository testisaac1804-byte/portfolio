# BetterTerminal — build spec

A real macOS terminal emulator that's genuinely better than Terminal.app:
tabs, split panes, search, themes, a command-history rail with exit codes,
jump-to-prompt, and a **plain-English bar** for people who have never used a
terminal. **Real PTY login shells** — job control, vim/htop/ssh all work.

- **App:** `~/Applications/BetterTerminal.app` (double-click) · fallback `~/Documents/BetterTerminal.command`
- **Source:** `~/Documents/projects/apps/BetterTerminal/`
- **Version 1.1.0** · Python 3.11 (uv venv) + aiohttp + ptyprocess + pywebview (Cocoa/WKWebView)

## Plain-English layer (v1.1)

`web/plain.js` is a pure, offline resolver: `resolve(text, ctx) -> {ok, cmd, explain, danger}`.

- **48 intents** in one ordered array, each `{id, group, label, match(n, ctx), build(m, ctx), preview}`.
  Order matters — first match wins, so specific phrases come before generic verbs.
- **Path resolution** (`resolvePath`) is the heart: `{cwd, listing}` context from
  `/api/ls` lets it match real folder names fuzzily (score by exact/flat/prefix/
  substring/token overlap), map synonyms ("desktop" → `~/Desktop`), and refuse to
  invent paths — it returns candidates for a "did you mean" chip instead.
  Unambiguous home folders win immediately; loose words (photos/music/videos)
  only map to the system folder when no local folder of that name exists.
- **Teaching**: every translation shows the command plus a glossary explanation
  (`cd = change folder`); the History rail keeps the real command.
- **Safety**: `danger` results (delete/move/copy/kill/install/git push) open a
  confirm dialog showing the exact command; the UI never runs them silently.
- **Guide tab**: the same intents rendered as a searchable cheat sheet, with the
  resolved command or a `<placeholder>` pattern under each phrase.
- **Rescue**: exit code 127 + `command not found: X` in the buffer → Levenshtein
  suggestion toast with one-click "Run grep" buttons.
- **Never blocks shell users**: `looksLikeShell()` runs first — flags, pipes,
  paths, quotes, globs and bare known commands pass through untouched.

## Architecture

Python owns the terminals; the UI is a web front-end in a native window.

1. `pty_session.py` — `PtySession` spawns a real login shell via `ptyprocess`
   (own session + controlling tty) and registers the master fd on the asyncio
   loop with `loop.add_reader`. Non-blocking read/write with an output buffer,
   incremental UTF-8 decoding, `TIOCSWINSZ` resize, `killpg` for signals.
2. `server.py` — aiohttp on 127.0.0.1 with a **per-launch random token** required
   on `/ws` and `/api/*` (no other local page can drive your shell). `/ws`
   bridges bytes to a PTY; the first frame carries the real terminal geometry so
   the prompt never reflows. Also `/api/ls` (folder listings for the resolver),
   `/api/git`, `/api/clipboard`, `/api/open`, `/api/title`, `/api/stats`.
3. `web/` — xterm.js (vendored locally) + `app.js`: tab tree, split-pane tree,
   search (addon-search), WebLinks, OSC hooks, sidebar, palette, English bar.
4. `main.py` — picks a free port, runs the server in a thread, opens a pywebview
   window at `http://127.0.0.1:PORT/?t=TOKEN`. Flags: `--command`, `--cwd`,
   `--shell`, `--no-window` (headless tests), `--port`, `--token`.

## Shell integration (the clever bit)

`shell/` is a `ZDOTDIR` shim. zsh reads `.zshenv/.zprofile/.zshrc/.zlogin` from
there; each shim re-sources the user's real file, then `.zshrc` installs OSC
hooks: `OSC 7` = cwd, `OSC 133;A/B/C/D` = prompt start / input start / output
start / command finished + exit code. The UI parses these to drive the status
bar, the history rail (command text is read back out of the xterm buffer between
the B and C marks), and jump-to-prompt markers. OSC 52 (remote clipboard write)
is swallowed for security.

## Pitfalls learned

- `(( ${+functions[add-zsh-hook]} ))` silently evaluated false in this shell →
  the hooks never installed. Use `autoload -Uz add-zsh-hook` then
  `add-zsh-hook precmd/preexec`, with an array-append fallback.
- **Do not default to the xterm WebGL renderer** — it painted a blank pane.
  Default is the DOM renderer; WebGL is an opt-in setting.
- macOS menu bar steals shortcuts: clear `keyEquivalent` on conflicting menu
  items (⌘D dictation, ⌘F fullscreen) after `webview.start`.
- The launcher execs Python, so set `processName` + `setApplicationIconImage_`
  at runtime to brand the Dock/menu.
- Restarting a shell must invalidate the old WebSocket's handlers (generation
  counter) or its `onclose` re-marks the new session as dead.
- `ZDOTDIR` also moves zsh's default `HISTFILE` to `$ZDOTDIR/.zsh_history`, which
  hides the user's real history. Re-export `HISTFILE="$HOME/.zsh_history"` from
  the shim's `.zshenv` unless the user set one.
- **A `match` that returns a boolean throws away regex capture groups.** Use the
  `rx(re, guard)` helper so `build()` always gets a match array; a bare
  `const m = ...; if (m === true) m = null` pattern crashes on `.replace`.
- **`.hidden` is both an attribute and a class name.** The bar is hidden with a
  CSS class (`classList.toggle('hidden')`), so test probes must use
  `classList.contains('hidden')` — reading `el.hidden` silently returns false.
- **Test the guide against itself**: resolve every guide label and assert it
  lands on its own intent id. That caught 5 mislabelled/misrouted phrases
  (get/move stolen by the navigation verb, "go back to the last folder" not
  matching its own regex).
- `⌘` does not always render in terminal fonts — write "Cmd-E" in text sent to
  the terminal, keep `⌘` for the UI chrome.

## Rebuild / test

```bash
python3 tools/make_icon.py    # icon HTML -> PNG -> AppIcon.icns
python3 tools/build_app.py    # ~/Applications/BetterTerminal.app + .command
tools/run_tests.sh            # both Playwright suites (103 checks) on a temp server
```

`tests/debug.py`, `tests/debug2.py`, `tests/debug_keys.py`, `tests/pty_hooks.py`,
`tests/shim_check.py` = targeted debuggers.
`BT_SNAPSHOT=/tmp/x.png` + `BT_SNAPSHOT_DELAY=7` saves a PNG of the real
WKWebView's pixels (in-process snapshot, no screen-recording permission).

