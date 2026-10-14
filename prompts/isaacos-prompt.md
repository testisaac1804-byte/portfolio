# IsaacOS v1.0 — build notes

A custom ARM64 operating system that boots straight into a branded desktop, made
as a bootable ISO for Parallels on Apple Silicon.

**Download:** `IsaacOS-v1.0-arm64.iso` — 431 MB · SHA-256 `dab0e68cdbd1937abf685b091265fadb99add847df205b5c58b56c34255dc4af`

---

## What it is

Not a reskin and not a remaster. IsaacOS is assembled from a package list: an
Alpine Linux userland, a downloaded kernel + initramfs, and an XFCE desktop
configured property-by-property through `xfconf`. The desktop deliberately mixes
two conventions — a macOS-style bar along the top (app menu, tray, volume, clock,
power) and a Windows-style dock along the bottom (app launchers, live taskbar).

- **Base:** Alpine Linux, ARM64
- **Desktop:** XFCE 4.18
- **Display:** Xorg + fbdev, libinput for input
- **Boots to:** desktop, no login prompt, no setup wizard
- **First boot:** ~2.5 min (installs the desktop from the disc); instant after
  that, since it runs from RAM

## Boot chain

1. UEFI/GRUB loads the kernel + initramfs from the ISO.
2. Alpine's `nlplug-findfs` scans the boot media, finds `*.apkovl.tar.gz`
   automatically, and unpacks it over the live root as an overlay.
3. The overlay's `/etc/apk/world` tells apk which packages the live system needs;
   they're installed from the local repo on the disc.
4. `firstboot.sh` runs on tty1: brings up udev and dbus, configures the desktop,
   then starts X.
5. `session-setup.sh` runs inside the session and applies the wallpaper and
   desktop config with `xfconf-query` before the panel draws.

## The four bugs that actually cost the time

**1. A wallpaper path that doesn't exist falls back silently.** XFCE doesn't
complain about a missing background image — it shows its default mouse wallpaper.
The fix was to ship the PNG at a real path in the overlay *and* write the
`xfce4-desktop.xml` channel file to point at `file:///usr/share/backgrounds/...`.

**2. `xfce4-panel`'s launcher plugin rendered exactly one icon.** Seven launchers
were declared in a single plugin's `items` array and only the first ever appeared.
Splitting them into **one launcher plugin per icon** made all seven render. Worth
knowing: the config was provably correct the whole time — the settings were
verifiably applied inside the running system.

**3. The mouse didn't work — because udev never started.** Xorg takes its input
devices from libinput, and libinput finds devices *only* through udev. Alpine's
`eudev` package ships `/sbin/udevd` and `/sbin/udevadm` but **no
`/etc/init.d/udev` script**, so the usual `rc-service udev start` fails silently.
The legacy-looking `rc-update add udev default` line looked like it was doing the
job, but it only enables a service that doesn't exist. Launching the daemon
directly fixed it:

```sh
mkdir -p /run/udev
pgrep -x udevd >/dev/null 2>&1 || /sbin/udevd --daemon
/sbin/udevadm trigger --action=add
/sbin/udevadm settle --timeout=15
```

**4. An invisible cursor looks exactly like a broken mouse.** With no cursor theme
or cursor font installed, the pointer can render as nothing at all. `font-cursor-misc`
supplies the core cursor glyphs, so the pointer is guaranteed visible.

## Debugging method

A live VM console isn't readable remotely, and screenshots can't see a hardware
cursor. So the guest was given DHCP and a one-way TCP dump back to the host:
the boot script piped `xfconf-query -lv`, `ls /usr/share/applications/`,
`cat /proc/bus/input/devices` and the tail of `Xorg.0.log` to a listening socket
on the host. That's how the launcher config and the mouse binding were confirmed
from inside the running system rather than guessed at.

## Rebuild

```sh
cd ~/IsaacOS
python3 apkidx/build_apkovl.py     # rebuild the overlay from apkovl-src/
bash build-isaacos-iso.sh          # rebuild the ISO
```

Boot test in Parallels:

```sh
prlctl stop IsaacOS --kill
prlctl set IsaacOS --device-set cdrom0 --image ~/IsaacOS/IsaacOS-v1.0-arm64.iso --connect
prlctl start IsaacOS
```

## Known limitations

- **Live system** — runs from RAM, so changes don't survive a reboot. Installing
  to disk for persistence is the next step.
- **No 3D acceleration** — X.org runs on software rendering (fbdev/swrast).
- **Desktop icons** — app shortcuts placed in `~/Desktop` don't render in this
  setup; every app is in the dock instead.

---

## Earlier draft — auto-generated spec (2026-09-28)

_Kept for provenance. This is the spec generated from the original draft's own files before it was rebuilt as a working live ISO._

# IsaacOS

**Category:** Software & Apps · **Status:** Draft

Custom OS concept - bootable with all Isaac tools.

**Stack / Tools:** OS, Concept, System Design

**Build path:**
- V1 — Concept phase.

**Location:** `~/projects/drafts/`

Custom OS concept — bootable image bundling all Isaac tools. Concept phase.

## Where it lives
- Source folder: `~/Documents/projects/drafts/IsaacOS`
- Artefacts on the site: 9 files · 960 lines of text · 28 KB

## Stack
- Shell ×2 · .embed ×1 · .combined ×1 · .amd64 ×1
- external tools invoked: `node`, `npm`, `python3`

## What's in the code
- `build-isaacos.sh` — 802 lines (Shell)
- `README.md` — 108 lines (Markdown)
- `run-build.sh` — 50 lines (Shell)

## Notes found in the scripts
- =============================================================================
- IsaacOS ISO Builder
- Creates custom Debian-based ISOs for ARM64 and x86_64
- =============================================================================

---
_Spec generated from the project's own files on 2026-09-28 (`gen-project-specs.py`). Everything above was read from the listed files — file counts, line counts, names, routes, headings and script comments. No description was invented._
