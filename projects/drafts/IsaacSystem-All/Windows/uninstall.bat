@echo off
:: Isaac System — Windows Uninstaller Launcher
cd /d "%~dp0"
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)
powershell -ExecutionPolicy Bypass -File "C:\Windows\IsaacSystem-Uninstall.ps1"
pause
