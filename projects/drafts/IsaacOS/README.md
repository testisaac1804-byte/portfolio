# IsaacOS - The Hybrid Operating System

Combining the best features from **macOS**, **Windows**, **Linux**, **Android**, and **iPadOS** into a single bootable ISO.

## Architecture

- **ARM64 ISO** → For Apple Silicon Macs (Parallels Desktop, UTM)
- **x86_64 ISO** → For Intel Macs (Parallels Desktop, VMware, VirtualBox)

## Features

### 🍎 macOS-Inspired
- **Plank Dock** — macOS-style dock with app launchers
- **Spotlight Search** (Super+Space) — Rofi-powered universal search
- **Global Menu Bar** — Share menu across apps
- **Quick Look** — Space to preview files (gnome-sushi)
- **Mission Control** — 4-finger swipe up

### 🪟 Windows Compatibility
- **Wine + Winetricks** — Run Windows applications
- **Proton** — Steam/Game compatibility
- **Windows theme** option in KDE

### 🐧 Linux Power
- **KDE Plasma Desktop** — Most flexible DE in Linux
- **apt package manager** — 50,000+ packages
- **Full dev tools** — GCC, Python, Node.js, Git, CMake
- **Terminals** — Konsole, Kitty, Tilix

### 📱 Android Subsystem
- **Waydroid** — Full Android environment in a container
- Run APKs natively alongside desktop apps
- Start via "IsaacOS Android" app launcher

### 🎯 iPad Gestures
- **4-finger swipe** — Switch desktops / Mission Control
- **3-finger gestures** — App switching / Launchpad
- **On-screen keyboard** — Maliit keyboard
- **Touch support** — touchegg gesture engine

### ⚡ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Super+Space` | Spotlight Search |
| `Super+A` | App Launcher |
| `Ctrl+Alt+T` | Terminal |
| `Alt+Tab` | Window Switcher |
| `Print` | Screenshot |
| `Ctrl+Esc` | System Monitor |

## Building from Source

### Prerequisites
- Docker (or Docker-compatible runtime)
- On macOS: `brew install colima && colima start`

### Quick Build
```bash
cd IsaacOS
chmod +x run-build.sh build-isaacos.sh

# Build both architectures
./run-build.sh

# Or build individually
make arm64
make amd64
```

ISOs are output to `./output/`.

## Running in Parallels Desktop

1. **Parallels Desktop → File → New**
2. Choose "Install Windows or Linux from DVD or image"
3. Select the IsaacOS `.iso` file
4. Configure:
   - **OS type**: Linux → Debian 12 Bookworm
   - **RAM**: 4GB minimum (8GB recommended)
   - **CPU**: 2+ cores
   - **Disk**: 20GB+
5. Boot the VM
6. **Login**: `isaac` / `isaac`

### First Boot
- The desktop will load KDE Plasma
- Plank dock appears at the bottom
- Try `Super+Space` for Spotlight search
- Open "IsaacOS Android" to start the Android subsystem
- Run `isaac-welcome` in terminal for quick tips

## Default Credentials
- **Username**: `isaac`
- **Password**: `isaac`
- **Root password**: `root`
- **Auto-login**: Enabled

## Building Your Own

### Customize Packages
Edit `build-isaacos.sh` — add/remove packages in the `config/package-lists/` sections.

### Customize Hooks
Edit the hook scripts in `build-isaacos.sh` under the hooks section.

## License
MIT — Do whatever you want with it.
