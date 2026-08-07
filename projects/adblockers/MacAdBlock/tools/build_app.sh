#!/bin/bash
# Build MacAdBlock.app bundle

APP_NAME="MacAdBlock"
APP_PATH="$HOME/Desktop/$APP_NAME.app"
PROJECT_DIR="$HOME/Desktop/MacAdBlock"

echo "[bundle] Building $APP_PATH ..."

# Remove old app if exists
rm -rf "$APP_PATH"

# Create .app structure
mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"

# Launcher script
cat > "$APP_PATH/Contents/MacOS/$APP_NAME" << 'LAUNCHER'
#!/bin/bash
# MacAdBlock Launcher
cd "$HOME/Desktop/MacAdBlock" || exit 1
exec /usr/local/bin/python3 src/macadblock_gui.py
LAUNCHER
chmod +x "$APP_PATH/Contents/MacOS/$APP_NAME"

# Info.plist
cat > "$APP_PATH/Contents/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>$APP_NAME</string>
    <key>CFBundleIdentifier</key>
    <string>com.isaac.macadblock</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleDisplayName</key>
    <string>MacAdBlock</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSUIElement</key>
    <true/>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
PLIST

# Create an app icon placeholder using a simple script
# Generate a simple icon (or we can use the shield emoji as icon)
cat > "$APP_PATH/Contents/Resources/icon.sh" << 'ICON'
# No icon file needed — rumps uses the title text
ICON

echo "[bundle] ✅ App created at $APP_PATH"
echo "[bundle] Run it: open $APP_PATH"
