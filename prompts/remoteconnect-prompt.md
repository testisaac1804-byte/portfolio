# RemoteConnect — one-click remote control of Macs and Android phones

A single Mac app that lists machines I'm allowed to reach, and opens the screen when I
click a name. Mac targets are driven by the screen sharing macOS already ships; Android
targets are mirrored and controlled with scrcpy. There is no relay server, no account, no
subscription, and no third-party software on the far end.

## Where it came from

I wanted to be able to help friends and family with their computers without walking
through it over the phone: "click the Apple menu… no, the other one." Instead of a
screensharing link, they install one file, and after that I only ever have to click their
name.

## The two halves

**RemoteConnect.pkg — the server, run on the *other* machine.** A standard macOS installer
whose `postinstall` runs as root, which is what makes the silent part possible: it enables
the `com.apple.screensharing` launchd service, then calls ARD's `kickstart` to set a shared
VNC password and grant anyone holding that password full control. No dialog, no
"System Settings › General › Sharing", nothing for the other person to configure. The same
package ships a password-rotation app and a proper uninstaller that turns sharing back off,
because a one-way installer is a bad thing to hand a non-technical friend.

**RemoteConnect Controller — my side.** A `pywebview` window over a small Flask API, listing
saved targets. Click one and it either opens `vnc://IP` in macOS Screen Sharing (the app
that's already installed) or runs `scrcpy --tcpip=IP:PORT`, which performs its own adb
connection and mirrors the phone screen. Friends live in `~/.remoteconnect/friends.json` —
deliberately outside the app bundle, so rebuilding or reinstalling the app never loses the
list.

## What it does

- **One click, one viewer.** Mac names open Screen Sharing; Android names open scrcpy.
- **Wireless Android, handled.** `scrcpy --tcpip=` owns the whole adb handshake, so the app
  never has to manage the tunnel itself.
- **Self-diagnosing.** `ping`, ARP, an mDNS lookup and a 254-address parallel subnet sweep
  are exposed at `/api/scan`, and every failed connect returns a **step log** naming what
  went wrong and what to do — instead of a button that silently does nothing.
- **Reconnects itself.** If the phone only presents a TLS/pairing transport (typical right
  after a reboot), the app runs `tcpip 5555` and reconnects on the classic port first.
- **USB fallback.** A cabled device is detected and used directly, skipping WiFi and ports
  entirely.
- **Survives reinstall.** The friend list is stored outside the bundle.
- **Universal binaries.** Every `osacompile`d launcher is x86_64 + arm64; macOS 26 refuses
  script-based `.app` executables, so the target is a real Mach-O binary.

## Stack

Python, pywebview + Flask, `pkgbuild` / `productbuild`, macOS ARD (`kickstart`),
Screen Sharing.app, scrcpy, adb, AppleScript launchers via `osacompile`.

## Things that bit me

- **`adb disconnect` before launching scrcpy kills the wireless tunnel scrcpy is about to
  use.** The mirror window appears for about one second and exits with code 2. The fix was
  to delete every adb call of my own and let `scrcpy --tcpip=` do the whole connection.
- **Android 11+ wireless debugging uses random ports**, and the pairing port is not the
  connect port. Neither is 5555 until `adb tcpip 5555` has been run once over the TLS
  transport.
- **Without `--always-on-top` the mirror opens behind the controller** — which the user
  reports, entirely reasonably, as "the screen doesn't open".
- **An app installed by a `.pkg` into `/Applications` is root-owned** and cannot be
  replaced without admin auth, so iteration has to happen against a user-owned copy.
- **`kickstart -help` requires root**, so the only way to confirm a flag still exists on the
  current macOS is to read the binary: `strings -a <kickstart> | grep vncpw`.

## The lesson

The code was almost never the bug. I rebuilt the client eleven times against a phone that
had quietly left the WiFi and taken a new IP address — every attempt was aimed at a dead
address, and no amount of rebuilding could have fixed that. **Diagnose the environment
before changing the program**, and make the program say out loud what it sees.
