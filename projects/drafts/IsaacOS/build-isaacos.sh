#!/bin/bash
# =============================================================================
# IsaacOS ISO Builder
# Creates custom Debian-based ISOs for ARM64 and x86_64
# Combines features from: macOS, Windows, Linux, Android, iPad
# =============================================================================

set -euo pipefail

# --- Configuration ---
ARCH="${1:-arm64}"   # arm64 or amd64
OUTPUT_DIR="/build/output"
BUILD_DIR="/build/iso-build-${ARCH}"
ISO_NAME="IsaacOS-${ARCH}-$(date +%Y%m%d).iso"

echo "============================================"
echo "  Building IsaacOS for ${ARCH}"
echo "============================================"

# Validate architecture
if [[ "$ARCH" != "arm64" && "$ARCH" != "amd64" ]]; then
    echo "ERROR: Architecture must be 'arm64' or 'amd64'"
    exit 1
fi

# Clean previous build
rm -rf "$BUILD_DIR"
mkdir -p "$OUTPUT_DIR"

# --- Step 1: Initialize live-build config ---
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

# Ensure all required directories exist
mkdir -p config/package-lists config/hooks/live config/includes.chroot/usr/local/bin
mkdir -p config/includes.chroot/usr/share/applications
mkdir -p config/includes.chroot/usr/share/plasma/look-and-feel
mkdir -p config/includes.chroot/etc/skel/.config
mkdir -p config/includes.chroot/etc/skel/.config/plank/dock1
mkdir -p config/includes.chroot/etc/skel/.config/touchegg
mkdir -p config/includes.chroot/etc/skel/.config/rofi
mkdir -p config/includes.chroot/etc/skel/.config/gtk-3.0

lb config \
    --distribution bookworm \
    --architectures "$ARCH" \
    --binary-images iso-hybrid \
    --debian-installer false \
    --archive-areas "main contrib non-free non-free-firmware" \
    --bootappend-live "boot=live components quiet splash username=isaac hostname=IsaacOS" \
    --bootappend-live-failsafe "boot=live components memtest noapic noapm nodma nomce nolapic nomodeset nosmp nosplash vga=normal" \
    --linux-flavours "generic" \
    --memtest none \
    --bootloaders "grub-efi" \
    --iso-volume "IsaacOS ${ARCH}" \
    --iso-publisher "IsaacOS Project" \
    --iso-application "IsaacOS - The Hybrid Operating System" \
    --firmware-binary true \
    --firmware-chroot true \
    --updates true \
    --backports true

# --- Step 2: Configure packages ---

# Remove unnecessary packages
echo "task-laptop
task-desktop
firmware-linux
firmware-brcm80211
firmware-iwlwifi
firmware-realtek
firmware-atheros
firmware-qcom-media
printer-driver-all
cups
cups-bsd
cups-client
cups-filters
libreoffice*
thunderbird*
" > config/package-lists/remove.list.chroot

# Browser
echo "falkon
firefox-esr
" > config/package-lists/browser.list.chroot

# Core system packages
echo "task-kde-desktop
plasma-desktop
plasma-workspace
plasma-nm
plasma-pa
plasma-systemmonitor
sddm
dolphin
kate
konsole
kwrite
gwenview
okular
kcalc
kcharselect
ksystemlog
partitionmanager
kde-spectacle
krdc
krfb
ark
filelight
kfind
kgpg
khelpcenter
print-manager
kde-config-gtk-style
kdeconnect
plasma-widgets-addons
plasma-discover
flatpak
snapd
" > config/package-lists/desktop.list.chroot

# macOS-like features
echo "plank
rofi
gnome-sushi
xdg-desktop-portal
xdg-desktop-portal-kde
libreoffice-style-sifr
papirus-icon-theme
gtk3-engines-breeze
" > config/package-lists/macos-features.list.chroot

# Windows compatibility
echo "wine
wine64
libwine
libwine-dev
winetricks
lutris
gamemode
" > config/package-lists/windows-compat.list.chroot

# Android features
# waydroid is not in Debian Bookworm - install manually after boot
echo "weston
" > config/package-lists/android.list.chroot

# Touch / iPad-like features
# touchegg not in Debian Bookworm - install from GitHub releases
echo "maliit-keyboard
libinput-tools
celluloid
" > config/package-lists/ipad-features.list.chroot

# Development tools
echo "build-essential
gcc
g++
make
cmake
python3
python3-pip
python3-venv
nodejs
npm
git
curl
wget
htop
neofetch
btop
tmux
vim
nano
fish
zsh
bash-completion
openssh-client
openssh-server
net-tools
network-manager
rsync
p7zip-full
unzip
zip
gpg
" > config/package-lists/dev-tools.list.chroot

# Extra utilities
echo "kdenlive
audacity
vlc
mpv
gimp
inkscape
obs-studio
terminator
kitty
micro
grub-customizer
krename
krusader
kdiff3
meld
" > config/package-lists/extras.list.chroot

# --- Step 3: Create hooks for customizations ---

# Hook: Set up macOS-like global menu for KDE
cat > config/hooks/live/99-global-menu.hook.chroot << 'HOOK'
#!/bin/bash
# Enable global menu for all GTK applications
cat > /etc/profile.d/appmenu.sh << 'EOF'
export GTK_MODULES="${GTK_MODULES}:appmenu-gtk-module"
EOF
chmod +x /etc/profile.d/appmenu.sh

# Configure KDE global menu widget in default panel
mkdir -p /etc/skel/.config/
cat > /etc/skel/.config/plasma-org.kde.plasma.desktop-appletsrc << 'APPLE'
[Containments][1]
activityId=
formFactor=2
location=4
plugin=org.kde.panel
screen=0

[Containments][1][Applets][1]
immutability=1
plugin=org.kde.plasma.kicker
wallpaperPlugin=org.kde.image
configContainment=1

[Containments][1][Applets][2]
immutability=1
plugin=org.kde.plasma.appmenu

[Containments][1][Applets][3]
immutability=1
plugin=org.kde.plasma.systemtray

[Containments][1][Applets][4]
immutability=1
plugin=org.kde.plasma.digitalclock

[Containments][2]
activityId=
formFactor=0
location=0
plugin=org.kde.plasma.containment.desktop
wallpaperPlugin=org.kde.image

[Containments][3]
activityId=
formFactor=2
location=3
plugin=org.kde.plasma.containment.panel
screen=0

[Containments][3][Applets][1]
immutability=1
plugin=plank
APPLE
HOOK
chmod +x config/hooks/live/99-global-menu.hook.chroot

# Hook: Configure Plank dock
cat > config/hooks/live/98-plank-config.hook.chroot << 'HOOK'
#!/bin/bash
# Configure Plank dock to look like macOS dock
mkdir -p /etc/skel/.config/plank/dock1/
cat > /etc/skel/.config/plank/dock1/settings << 'PLANK'
[PlankDockItemPreferences]
LauncherDir=file:///usr/share/applications/

[PlankDockPreferences]
Alignment=Center
AutoHide=false
DockItems=dolphin.desktop;konsole.desktop;firefox-esr.desktop;org.kde.kate.desktop;systemsettings.desktop;discover.desktop
IconSize=48
ItemsAlignment=Center
LockItems=false
Monitor=0
Offset=0
PinnedOnly=false
Position=Bottom
ShowDockItem=false
Theme=Gtk+
TooltipsEnabled=true
ZoomEnabled=true
ZoomPercent=150
PLANK
HOOK
chmod +x config/hooks/live/98-plank-config.hook.chroot

# Hook: Configure touchegg for iPad-like gestures
cat > config/hooks/live/97-touchegg.hook.chroot << 'HOOK'
#!/bin/bash
mkdir -p /etc/skel/.config/touchegg/
cat > /etc/skel/.config/touchegg/touchegg.conf << 'TOUCHEGG'
<touchégg>
    <settings>
        <property name="animation_delay">50</property>
        <property name="animation_duration">200</property>
        <property name="color">255,255,255,50</property>
        <property name="gradient">true</property>
        <property name="smooth">true</property>
        <property name="minimize_on_close">true</property>
    </settings>

    <!-- Four finger swipe left/right - Switch desktop (like macOS) -->
    <application name="All">
        <gesture type="SWIPE" fingers="4" direction="LEFT">
            <action type="SWITCH_TO_DESKTOP">
                <desktop>RIGHT</desktop>
            </action>
        </gesture>
        <gesture type="SWIPE" fingers="4" direction="RIGHT">
            <action type="SWITCH_TO_DESKTOP">
                <desktop>LEFT</desktop>
            </action>
        </gesture>
        <!-- Four finger swipe up - Show all windows (Mission Control) -->
        <gesture type="SWIPE" fingers="4" direction="UP">
            <action type="SHOW_WINDOWS_PICKER"/>
        </gesture>
        <!-- Four finger swipe down - Show desktop -->
        <gesture type="SWIPE" fingers="4" direction="DOWN">
            <action type="SHOW_DESKTOP"/>
        </gesture>
        <!-- Three finger swipe - Switch windows (like macOS app switcher) -->
        <gesture type="SWIPE" fingers="3" direction="LEFT">
            <action type="SEND_KEYS">
                <keys>Alt+Tab</keys>
            </action>
        </gesture>
        <gesture type="SWIPE" fingers="3" direction="RIGHT">
            <action type="SEND_KEYS">
                <keys>Alt+Shift+Tab</keys>
            </action>
        </gesture>
        <!-- Three finger pinch - Launchpad/App drawer -->
        <gesture type="PINCH" fingers="3" direction="IN">
            <action type="SEND_KEYS">
                <keys>Super+A</keys>
            </action>
        </gesture>
        <!-- Three finger spread - App picker (like iPad) -->
        <gesture type="PINCH" fingers="3" direction="OUT">
            <action type="SEND_KEYS">
                <keys>Alt+Space</keys>
            </action>
        </gesture>
        <!-- Two finger swipe from edges (like iPad control center) -->
        <gesture type="SWIPE" fingers="2" direction="UP">
            <action type="MAXIMIZE_WINDOW"/>
        </gesture>
    </application>
</touchégg>
TOUCHEGG
HOOK
chmod +x config/hooks/live/97-touchegg.hook.chroot

# Hook: Configure Waydroid for Android
cat > config/hooks/live/96-waydroid.hook.chroot << 'HOOK'
#!/bin/bash
# Enable Waydroid service
systemctl enable waydroid-container.service 2>/dev/null || true

# Add user to waydroid group
groupadd -f waydroid

# Waydroid configuration
mkdir -p /etc/waydroid/
cat > /etc/waydroid/waydroid.cfg << 'WAYDROID'
[waydroid]
rom_setup_script = /usr/lib/waydroid/data/scripts/lineage_setup.sh

[properties]
persist.waydroid.multi_windows = true
persist.waydroid.stream_app = true
ro.surface_flinger.max_frame_buffer_acquired_buffers = 3
WAYDROID

# Create launcher script
cat > /usr/local/bin/start-android << 'LAUNCH'
#!/bin/bash
echo "Starting Android (Waydroid)..."
sudo systemctl start waydroid-container.service
sleep 2
waydroid session start &
sleep 3
waydroid show-full-ui
echo "Android running in window mode"
LAUNCH
chmod +x /usr/local/bin/start-android

# Desktop entry for Android
cat > /usr/share/applications/start-android.desktop << 'DESK'
[Desktop Entry]
Name=IsaacOS Android
Comment=Run Android apps inside IsaacOS
Exec=/usr/local/bin/start-android
Icon=phone
Terminal=false
Type=Application
Categories=System;
DESK
HOOK
chmod +x config/hooks/live/96-waydroid.hook.chroot

# Hook: Rofi as Spotlight replacement
cat > config/hooks/live/95-rofi-spotlight.hook.chroot << 'HOOK'
#!/bin/bash
# Configure rofi as macOS Spotlight replacement
mkdir -p /etc/skel/.config/rofi/

# Create rofi config
cat > /etc/skel/.config/rofi/config.rasi << 'ROFI'
configuration {
    modi: "window,run,drun,filebrowser";
    show-icons: true;
    display-drun: "Apps";
    display-run: "Run";
    display-window: "Windows";
    display-filebrowser: "Files";
    sidebar-mode: true;
    font: "sans-serif 12";
}
ROFI

# Create spotlight-like launcher script
cat > /usr/local/bin/isaac-spotlight << 'LAUNCH'
#!/bin/bash
# macOS Spotlight-style launcher
rofi -show drun -modes "window,drun,run" -theme-str 'window {width: 40%;}' -location 0 -lines 8 -matching fuzzy
LAUNCH
chmod +x /usr/local/bin/isaac-spotlight

# Create desktop entry
cat > /usr/share/applications/isaac-spotlight.desktop << 'DESK'
[Desktop Entry]
Name=Spotlight Search
Comment=macOS-like spotlight search
Exec=/usr/local/bin/isaac-spotlight
Icon=system-search
Terminal=false
Type=Application
Categories=Utility;
DESK
HOOK
chmod +x config/hooks/live/95-rofi-spotlight.hook.chroot

# Hook: Wine auto-configuration
cat > config/hooks/live/94-wine-setup.hook.chroot << 'HOOK'
#!/bin/bash
# Configure Wine for better Windows compatibility
cat > /etc/skel/.config/wine_settings.sh << 'WINE'
#!/bin/bash
# First run Wine configuration
export WINEPREFIX="$HOME/.wine"
export WINEARCH=win64
echo "Setting up Wine for IsaacOS..."
winecfg -v win10 2>/dev/null || true
# Install core Windows components
winetricks -q corefonts vcrun2022 dxvk 2>/dev/null || true
echo "Wine configured for Windows compatibility"
WINE
chmod +x /etc/skel/.config/wine_settings.sh

# Desktop entry for Windows App Browser
cat > /usr/share/applications/wine-apps.desktop << 'DESK'
[Desktop Entry]
Name=Windows Apps
Comment=Browse and run Windows applications
Exec=bash -c "cd ~ && wine explorer"
Icon=wine
Terminal=false
Type=Application
Categories=Wine;
DESK
HOOK
chmod +x config/hooks/live/94-wine-setup.hook.chroot

# Hook: KDE Plasma customizations
cat > config/hooks/live/93-plasma-customize.hook.chroot << 'HOOK'
#!/bin/bash
# KDE Plasma global defaults - IsaacOS edition
mkdir -p /etc/skel/.config/

# KDE keyboard shortcuts (macOS-like)
cat > /etc/skel/.config/khotkeysrc << 'KEYS'
[Data]
DataCount=1

[Data_1]
Comment=Spotlight Search (Super+Space)
DataCount=1
Enabled=true
Name=IsaacOS Spotlight
Systemgroup=0

[Data_1][Actions][0]
CommandURL=/usr/local/bin/isaac-spotlight
Type=CommandURL

[Data_1][Conditions][0]
Key=Space+64
Type=Simple
KEYS

# Default KDE settings
cat > /etc/skel/.config/kdeglobals << 'KDEG'
[General]
ColorScheme=BreezeDark
TerminalApplication=konsole
TerminalService=konsole.desktop
fixed=Hack,10,-1,5,50,0,0,0,0,0
font=Noto Sans,10,-1,5,50,0,0,0,0,0
menuFont=Noto Sans,10,-1,5,50,0,0,0,0,0
smallestReadableFont=Noto Sans,8,-1,5,50,0,0,0,0,0
toolBarFont=Noto Sans,10,-1,5,50,0,0,0,0,0

[KDE]
AnimationDurationFactor=0.5
LookAndFeelPackage=org.kde.breezedark.desktop
ShowDeleteCommand=true
ShowRenameCommand=true
SingleClick=false
widgetStyle=Breeze

[Shortcuts]
Ctrl+Alt+T=konsole
Meta+Space=_launch
Meta+A=org.kde.plasma.kicker
Print=kate
KEYS

# KWin window rules
cat > /etc/skel/.config/kwinrc << 'KWIN'
[Compositing]
Backend=OpenGL
OpenGLIsUnsafe=false
WindowsUseOverlayWindow=true

[Desktops]
Id_1=
Id_2=
Id_3=
Id_4=
Number=4
Rows=1

[Effect-Blur]
BlurStrength=8
BlurType=3

[Effect-wobblywindows]
BorderFrequency=2
Deceleration=4
EnableDrag=true
KeepRatio=false
MoveEffect=1
PressDuration=150
Stiffness=6
WobbleFrequency=2

[MouseBindings]
CmdAllKey=Meta
CommandAllKey=Meta
CommandAllKeyAlt=false
CommandAllKeyMeta=true
CommandAllKeyShift=false
Cursor1=2
Cursor2=1

[NightColor]
Active=true
Mode=Automatic
TemperatureDay=6500
TemperatureNight=3500

[TabBox]
LayoutName=compact
KWIN

# Shortcuts for macOS-like behavior
cat > /etc/skel/.config/kglobalshortcutsrc << 'SHORTCUTS'
[AppLauncher]
_launch=Meta+F1,Meta+F1,Launch Application

[Discover]
_launch=Meta+I,Meta+I,null

[Kill]
_launch=Ctrl+Alt+Esc,Ctrl+Alt+Esc,Kill Window

[Konsole]
_launch=Ctrl+Alt+T,Ctrl+Alt+T,Terminal

[org.kde.krunner]
_launch=Alt+Space\tMeta+Space,Alt+Space,Run Command

[org.kde.plasma.systemmonitor]
_launch=Ctrl+Escape,Ctrl+Escape,System Monitor

[org.kde.spectacle]
_launch=Print,Print,Take Screenshot
SHORTCUTS

# Default applications
cat > /etc/skel/.config/mimeapps.list << 'MIME'
[Default Applications]
application/pdf=okular.desktop
image/png=gwenview.desktop
image/jpeg=gwenview.desktop
text/plain=kate.desktop
text/html=falkon.desktop
x-scheme-handler/http=falkon.desktop
x-scheme-handler/https=falkon.desktop
inode/directory=dolphin.desktop
MIME
HOOK
chmod +x config/hooks/live/93-plasma-customize.hook.chroot

# Hook: System tweaks and branding
cat > config/hooks/live/92-isaacos-branding.hook.chroot << 'HOOK'
#!/bin/bash
# IsaacOS branding and system tweaks

# Set hostname
echo "IsaacOS" > /etc/hostname

# Issue banner
cat > /etc/issue << 'ISSUE'
  ___                  ___  ___   ___
 / _ \  ___ __ __ _   / __|/ _ \ / __|
| (_) |/ _ \ V  V /   \__ \ (_) | (__
 \___/ \___/\_/\_/    |___/\___/ \___|

  IsaacOS - The Hybrid Operating System
  Combining the best of macOS, Windows, Linux, Android & iPad

ISSUE

# MOTD
cat > /etc/motd << 'MOTD'

Welcome to IsaacOS!
  • macOS: Plank Dock, Spotlight Search, Global Menu
  • Windows: Wine/Proton compatibility
  • Linux: KDE Plasma, apt packages, full dev tools
  • Android: Waydroid subsystem
  • iPad: Touch gestures, on-screen keyboard

Type 'neofetch' for system info.
MOTD

# OS Release file
cat > /etc/os-release << 'OSREL'
PRETTY_NAME="IsaacOS 1.0 (Bookworm)"
NAME="IsaacOS"
VERSION_ID="1.0"
VERSION="1.0 (Bookworm)"
VERSION_CODENAME=bookworm
ID=isaacos
ID_LIKE=debian
HOME_URL="https://github.com/isaac/isaacos"
SUPPORT_URL="https://github.com/isaac/isaacos"
BUG_REPORT_URL="https://github.com/isaac/isaacos/issues"
OSREL

# Add /usr/local/bin to default PATH
echo 'export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"' >> /etc/skel/.bashrc
echo 'export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"' >> /etc/skel/.zshrc

# Create IsaacOS welcome script
cat > /usr/local/bin/isaac-welcome << 'WELCOME'
#!/bin/bash
echo "╔══════════════════════════════════════════╗"
echo "║         Welcome to IsaacOS!              ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Features at your fingertips:            ║"
echo "║  ⌘ Super+Space - Spotlight Search        ║"
echo "║  ⌘ Super+A    - App Launcher             ║"
echo "║  ⌘ Ctrl+Alt+T - Terminal                 ║"
echo "║  ⌘ Alt+Tab   - Window Switcher           ║"
echo "║  ⌘ 4-finger  - Gesture controls          ║"
echo "║                                           ║"
echo "║  Android: waydroid session start          ║"
echo "║  Windows: wine --version                  ║"
echo "║  Dev: gcc, python3, node, git             ║"
echo "╚══════════════════════════════════════════╝"
WELCOME
chmod +x /usr/local/bin/isaac-welcome

# Add to bashrc
echo 'isaac-welcome' >> /etc/skel/.bashrc
HOOK
chmod +x config/hooks/live/92-isaacos-branding.hook.chroot

# Hook: Install custom fonts and themes
cat > config/hooks/live/91-themes.hook.chroot << 'HOOK'
#!/bin/bash
# Download and install macOS-like themes
mkdir -p /tmp/themes
cd /tmp/themes

# Download macOS-inspired themes for KDE
wget -q "https://github.com/vinceliuice/WhiteSur-kde/archive/refs/tags/v2.0.0.tar.gz" -O whitesur.tar.gz 2>/dev/null || true
if [ -f whitesur.tar.gz ]; then
    tar xzf whitesur.tar.gz 2>/dev/null || true
    cd WhiteSur-kde-* 2>/dev/null && ./install.sh 2>/dev/null || true
    cd /tmp
fi

# Download macOS cursors
wget -q "https://github.com/vinceliuice/McMojave-cursors/archive/refs/tags/v1.0.0.tar.gz" -O cursors.tar.gz 2>/dev/null || true
if [ -f cursors.tar.gz ]; then
    tar xzf cursors.tar.gz 2>/dev/null || true
    cd McMojave-cursors-* 2>/dev/null && ./install.sh 2>/dev/null || true
    cd /tmp
fi

# Download WhiteSur icons
wget -q "https://github.com/vinceliuice/WhiteSur-icon-theme/archive/refs/tags/v2.1.0.tar.gz" -O icons.tar.gz 2>/dev/null || true
if [ -f icons.tar.gz ]; then
    tar xzf icons.tar.gz 2>/dev/null || true
    cd WhiteSur-icon-theme-* 2>/dev/null && ./install.sh 2>/dev/null || true
    cd /tmp
fi

# Cleanup
rm -rf /tmp/themes 2>/dev/null || true

# Set default cursor
update-alternatives --set x-cursor-theme /usr/share/icons/McMojave-cursors/ 2>/dev/null || true

# Make these themes available globally
mkdir -p /etc/skel/.config/gtk-3.0/
cat > /etc/skel/.config/gtk-3.0/settings.ini << 'GTK'
[Settings]
gtk-theme-name=WhiteSur
gtk-icon-theme-name=WhiteSur
gtk-cursor-theme-name=McMojave-cursors
gtk-font-name=Noto Sans 10
gtk-application-prefer-dark-theme=true
GTK
HOOK
chmod +x config/hooks/live/91-themes.hook.chroot

# --- Step 4: Arch-specific configurations ---

# ARM64 specific packages
if [[ "$ARCH" == "arm64" ]]; then
    echo "linux-image-arm64
grub-efi-arm64
" > config/package-lists/arch-specific.list.chroot
else
    # x86_64 specific packages
    echo "linux-image-amd64
grub-efi-amd64
grub-pc
shim-signed-amd64
virtualbox-guest-x11
virtualbox-guest-utils
" > config/package-lists/arch-specific.list.chroot
fi

# --- Step 5: Create user persistence config ---
cat > config/includes.chroot/usr/share/plasma/look-and-feel/org.isaac.os.desktop << 'LAF'
[KScreen]
ScaleFactor=1

[KLookAndFeel]
name=IsaacOS Hybrid Desktop
LAF

# --- Step 6: Build! ---
echo "============================================"
echo "  Starting live-build for ${ARCH}..."
echo "  This will take 15-60 minutes"
echo "============================================"

sudo lb build 2>&1 | tee /build/build-${ARCH}.log

# Check if build succeeded
if [[ -f "live-image-${ARCH}.hybrid.iso" ]]; then
    cp "live-image-${ARCH}.hybrid.iso" "$OUTPUT_DIR/$ISO_NAME"
    echo "============================================"
    echo "  SUCCESS! ISO created:"
    echo "  $OUTPUT_DIR/$ISO_NAME"
    ls -lh "$OUTPUT_DIR/$ISO_NAME"
    echo "============================================"
else
    echo "============================================"
    echo "  BUILD FAILED. Check build log:"
    echo "  /build/build-${ARCH}.log"
    echo "============================================"
    exit 1
fi
