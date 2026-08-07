@echo off
:: Isaac System — Windows Installer Launcher
:: Auto-elevates to Administrator

setlocal enabledelayedexpansion
cd /d "%~dp0"

:: Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Run the PowerShell installer
echo Installing Isaac System...
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1"
pause
