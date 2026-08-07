╔══════════════════════════════════════════════╗
║         ISAAC SYSTEM — ALL PLATFORMS        ║
║           Prank Installer Suite             ║
╚══════════════════════════════════════════════╝

WHAT IT DOES:
• Changes computer name to "Isaac's HackBook" variant for your OS
• Creates Isaac.Haha files in EVERY directory on the system
• Installs a watchdog that restores files every 60 seconds
• Shows scary "hacked" popups at every login
• Opens terminals with fake "encryption" displays
• Plays voice messages: "You have been hacked by Isaac"
• Shows a ransomware-style scare page in the browser
• Repeats scare messages every 30 minutes

PASSWORD:
  Uninstall password: Isaac_DogPlanet
  (NOT revealed to the victim — they must ask you)

NOTE: This is a prank. No files are actually encrypted or deleted.
      The "encryption" terminal windows are purely cosmetic ASCII art.
      Isaac.Haha files are empty marker files (immutable, hidden).
      Remove anytime with the password.

───────────────────────────────────────────────
  macOS  │  IsaacSystem.pkg
───────────────────────────────────────────────
Double-click → Customize → choose Install or Uninstall.
Or run /Applications/Uninstall Isaac System.app from Finder.

✅ Compatible: macOS 10.10+ (Yosemite through Sequoia)
   Intel (x86_64) and Apple Silicon (arm64)
❌ Not compatible: macOS 10.9 and earlier

⚠️ Note: The installer requires admin privileges.
         SIP (System Integrity Protection) may block some
         file writes to /System/ — these are harmless failures.

───────────────────────────────────────────────
  Windows  │  install.bat + install.ps1
───────────────────────────────────────────────
Right-click install.bat → Run as Administrator.
Auto-elevates and runs install.ps1.
To uninstall: Run C:\Windows\IsaacSystem-Uninstall.ps1 as Admin.

✅ Compatible: Windows 7 SP1, 8, 8.1, 10, 11
   Requires: PowerShell 3.0+ (pre-installed on 8+, 
   available as update for Windows 7 SP1)
❌ Not compatible: Windows XP, Vista, Windows RT

⚠️ Note: Windows Defender may flag the installer as suspicious.
         This is expected — it's a prank tool, not malware.
         You may need to allow execution via defender exclusion.
         On Windows 7, ensure PowerShell 3.0+ is installed.

───────────────────────────────────────────────
  Linux  │  install.sh
───────────────────────────────────────────────
sudo bash install.sh
To uninstall: sudo bash /opt/IsaacSystem/uninstall.sh

✅ Compatible: Ubuntu 16.04+, Debian 9+, Fedora 28+,
   RHEL 7+, CentOS 7+, Arch Linux, openSUSE 15+
   Works with systemd (uses systemd timers) AND
   non-systemd (uses cron as fallback)
✅ Terminal support: GNOME Terminal, xterm, Konsole,
   LXTerminal, MATE Terminal, Terminator, URxvt, Rxvt
✅ Popup support: Zenity, Xmessage, or notify-send
✅ Voice support: espeak-ng, espeak, festival, or flite
❌ Not compatible: Server/headless installs (no GUI),
   BusyBox-based systems (Alpine default)

⚠️ Note: chattr +i requires ext4/btrfs/xfs filesystem.
         Other filesystems skip immutable flag silently.
         Install espeak-ng or zenity for full effect:
         sudo apt install espeak-ng zenity  (Debian/Ubuntu)
         sudo dnf install espeak-ng zenity  (Fedora)
