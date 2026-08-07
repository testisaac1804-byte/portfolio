#!/bin/bash
# Isaac Secure Messenger — Dependency Installer
# Double-click this file to install everything needed.
# Requires macOS and an internet connection.

echo "╔══════════════════════════════════════════╗"
echo "║   Isaac Secure Messenger — Setup        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check for Python 3
if ! command -v python3 &>/dev/null; then
    echo ""
    echo "❌ Python 3 not found."
    echo ""
    echo "Options:"
    echo "  1. Install from python.org:"
    echo "     https://www.python.org/downloads/"
    echo ""
    echo "  2. Or with Homebrew (if you have it):"
    echo "     brew install python"
    echo ""
    echo "Install Python 3 first, then run this script again."
    echo ""
    read -p "Press Enter to open python.org..."
    open "https://www.python.org/downloads/"
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Install pip packages
echo ""
echo "📦 Installing dependencies..."
python3 -m pip install --user --quiet flask cryptography pynacl zeroconf pyobjc pywebview 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed"
else
    echo "⚠ Some packages had issues. Trying without pyobjc..."
    python3 -m pip install --user --quiet flask cryptography pynacl zeroconf pywebview 2>&1
fi

# Copy the .app
echo ""
echo "📁 Installing app..."
APP_SOURCE="$(cd "$(dirname "$0")" && pwd)/IsaacSecureMessenger.app"
if [ -d "$APP_SOURCE" ]; then
    sudo cp -R "$APP_SOURCE" /Applications/
    sudo chmod -R 755 /Applications/IsaacSecureMessenger.app
    sudo xattr -dr com.apple.quarantine /Applications/IsaacSecureMessenger.app
    echo "✓ App installed to /Applications/"
else
    echo "⚠ IsaacSecureMessenger.app not found next to this script."
    echo "  Make sure both files are in the same folder."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Open Isaac Secure Messenger from your Applications folder."
echo ""
read -p "Press Enter to open the app..."
open /Applications/IsaacSecureMessenger.app
