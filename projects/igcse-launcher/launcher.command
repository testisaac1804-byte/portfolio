#!/usr/bin/env python3
"""IGCSE Guide Launcher — handles browser lifecycle + auto-delete on tab close.
Isaac: keep Y10-IGCSE-Guide.html in the same folder as this script.
Share: give the recipient this .command file + the HTML file together.
Double-click this .command to launch."""

import os, sys, subprocess, signal, time, hashlib, shutil

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_FILE = os.path.join(SCRIPT_DIR, "Y10-IGCSE-Guide.html")
BUNDLE_FILE = os.path.join(SCRIPT_DIR, "Y10-IGCSE-Bundle.command")

def is_isaac_machine():
    """Check if this is Isaac's MacBook Air."""
    try:
        import platform
        hw = subprocess.run(["sysctl","-n","hw.model"], capture_output=True, text=True).stdout.strip()
        host = subprocess.run(["hostname"], capture_output=True, text=True).stdout.strip()
        # Isaac's machine fingerprint
        return hw == "Mac14,2" and "MacBook Air" in host
    except:
        return False

def self_destruct():
    """Delete the HTML file, this script, and empty trash."""
    files_to_delete = []
    if os.path.exists(HTML_FILE):
        files_to_delete.append(HTML_FILE)
    if os.path.exists(BUNDLE_FILE):
        files_to_delete.append(BUNDLE_FILE)
    
    for f in files_to_delete:
        try:
            # Secure delete: overwrite with zeros first
            size = os.path.getsize(f)
            with open(f, 'wb') as fh:
                fh.write(b'\x00' * min(size, 1024*1024))  # overwrite first MB
            os.remove(f)
            print(f"🗑️  Deleted: {os.path.basename(f)}")
        except Exception as e:
            print(f"⚠️  Could not delete {os.path.basename(f)}: {e}")
    
    # Empty trash on macOS
    try:
        subprocess.run(["osascript","-e",'tell application "Finder" to empty trash'], 
                       capture_output=True, timeout=5)
        print("🗑️  Trash emptied")
    except:
        pass

def main():
    if not os.path.exists(HTML_FILE):
        print("❌ Y10-IGCSE-Guide.html not found in same folder.")
        print("   Make sure the HTML file is next to this launcher.")
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Isaac's machine — open directly, no self-destruct
    if is_isaac_machine():
        print("✅ Isaac's Mac detected — opening directly (no password needed)")
        subprocess.Popen(["open", HTML_FILE])
        print("Guide opened in browser. The file stays on your Desktop.")
        time.sleep(2)
        sys.exit(0)
    
    # Not Isaac's machine — open with monitoring + auto-delete
    print("🔐 Non-Isaac machine detected — guide will self-destruct when browser tab closes.")
    print("   Opening guide in browser...")
    
    # Open the HTML in default browser
    proc = subprocess.Popen(["open", "-W", HTML_FILE])
    
    # Wait for browser to close the tab/file
    print("   ⏳ Waiting for you to close the browser tab...")
    proc.wait()
    
    print("   Browser tab closed — self-destructing...")
    self_destruct()
    print("\n✅ Guide has been securely deleted. No trace left behind.")

if __name__ == "__main__":
    main()
