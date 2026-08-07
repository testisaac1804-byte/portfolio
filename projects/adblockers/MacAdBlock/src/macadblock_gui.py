#!/usr/bin/env python3
"""
MacAdBlock GUI v2 — macOS floating control panel.
Auto-installs daemon on first run. No terminal needed.
"""
import os
import sys
import json
import subprocess
import threading
import time
import urllib.request

PROJECT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), '..'))
PLIST_PATH = '/Library/LaunchDaemons/com.isaac.macadblock.plist'
DASHBOARD_URL = 'http://127.0.0.1:8053'
API_URL = 'http://127.0.0.1:8053/api'

from Foundation import *
from AppKit import *
import objc

class MacAdBlockAppDelegate(NSObject):
    running = False
    window = None

    def init(self):
        self = objc.super(MacAdBlockAppDelegate, self).init()
        if self:
            self.running = False
        return self

    def applicationDidFinishLaunching_(self, notification):
        self.createWindow()
        # Check if daemon is installed
        threading.Thread(target=self.checkDaemon, daemon=True).start()
        # Status check fires immediately, then every 3s
        self.checkStatus_(None)
        self.statusTimer = NSTimer.scheduledTimerWithTimeInterval_selector_userInfo_repeats_(
            3.0, self.checkStatus_, None, True
        )

    def checkDaemon(self):
        """Check if daemon is installed, install if not."""
        if os.path.exists(PLIST_PATH):
            # Daemon is installed, update button to show "Uninstall"
            self.performSelectorOnMainThread_withObject_waitUntilDone_(
                self.updateInstallStatus_, True, False)
        else:
            # Daemon not installed, show install prompt
            self.performSelectorOnMainThread_withObject_waitUntilDone_(
                self.showInstallPrompt, None, False)

    def showInstallPrompt(self):
        """Show dialog to install daemon."""
        alert = NSAlert.alloc().init()
        alert.setMessageText_("Install MacAdBlock Daemon")
        alert.setInformativeText_(
            "MacAdBlock needs to install a system daemon to block ads system-wide.\n\n"
            "This requires your admin password once. After installation, MacAdBlock will:\n"
            "• Start automatically on login\n"
            "• Block ads at the DNS level\n"
            "• Work for all apps and browsers\n\n"
            "You can uninstall anytime from the GUI."
        )
        alert.addButtonWithTitle_("Install")
        alert.addButtonWithTitle_("Cancel")

        response = alert.runModal()
        if response == NSAlertFirstButtonReturn:
            threading.Thread(target=self.installDaemon, daemon=True).start()

    def installDaemon(self):
        """Install the launchd daemon."""
        # Get password
        p = subprocess.run(['osascript', '-e',
            'Tell application "System Events" to display dialog "Enter your admin password to install MacAdBlock daemon:" default answer "" with hidden answer with icon caution with title "MacAdBlock" buttons {"Cancel","OK"} default button 2',
            '-e', 'text returned of result'],
            capture_output=True, text=True)
        pw = p.stdout.strip()
        if not pw:
            return

        # Copy plist to /Library/LaunchDaemons
        src_plist = os.path.join(PROJECT_DIR, 'com.isaac.macadblock.plist')
        try:
            # Use sudo to copy and set permissions
            cmd = f"echo '{pw}' | sudo -S cp '{src_plist}' '{PLIST_PATH}' && echo '{pw}' | sudo -S chown root:wheel '{PLIST_PATH}' && echo '{pw}' | sudo -S chmod 644 '{PLIST_PATH}'"
            subprocess.run(['/bin/bash', '-c', cmd], check=True)

            # Load the daemon
            cmd = f"echo '{pw}' | sudo -S launchctl load '{PLIST_PATH}'"
            subprocess.run(['/bin/bash', '-c', cmd], check=True)

            # Set DNS to local
            result = subprocess.run(['networksetup', '-listallnetworkservices'],
                                    capture_output=True, text=True)
            ifaces = [l.strip() for l in result.stdout.split('\n')[1:]
                      if l.strip() and not l.startswith('*')]
            for iface in ifaces:
                cmd = f"echo '{pw}' | sudo -S networksetup -setdnsservers '{iface}' 127.0.0.1 2>/dev/null"
                subprocess.run(['/bin/bash', '-c', cmd])

            notify_user("MacAdBlock Installed", "Daemon installed and DNS configured")
            self.performSelectorOnMainThread_withObject_waitUntilDone_(
                self.updateInstallStatus, True, False)
        except Exception as e:
            notify_user("Install Failed", str(e))

    def uninstallDaemon(self):
        """Uninstall the launchd daemon."""
        p = subprocess.run(['osascript', '-e',
            'Tell application "System Events" to display dialog "Enter your admin password to uninstall MacAdBlock daemon:" default answer "" with hidden answer with icon caution with title "MacAdBlock" buttons {"Cancel","OK"} default button 2',
            '-e', 'text returned of result'],
            capture_output=True, text=True)
        pw = p.stdout.strip()
        if not pw:
            return

        try:
            # Unload daemon
            cmd = f"echo '{pw}' | sudo -S launchctl unload '{PLIST_PATH}' 2>/dev/null"
            subprocess.run(['/bin/bash', '-c', cmd])

            # Remove plist
            cmd = f"echo '{pw}' | sudo -S rm -f '{PLIST_PATH}'"
            subprocess.run(['/bin/bash', '-c', cmd])

            # Reset DNS to DHCP
            result = subprocess.run(['networksetup', '-listallnetworkservices'],
                                    capture_output=True, text=True)
            ifaces = [l.strip() for l in result.stdout.split('\n')[1:]
                      if l.strip() and not l.startswith('*')]
            for iface in ifaces:
                cmd = f"echo '{pw}' | sudo -S networksetup -setdnsservers '{iface}' empty 2>/dev/null"
                subprocess.run(['/bin/bash', '-c', cmd])

            notify_user("MacAdBlock Uninstalled", "Daemon removed and DNS reset")
            self.performSelectorOnMainThread_withObject_waitUntilDone_(
                self.updateInstallStatus, False, False)
        except Exception as e:
            notify_user("Uninstall Failed", str(e))

    def updateInstallStatus_(self, installed):
        """Update the install button state."""
        if installed:
            self.installBtn.setTitle_("Uninstall Daemon")
            self.installBtn.setAction_("uninstallDaemon:")
            self.statusLabel.setStringValue_("✅ Daemon installed")
            self.statusLabel.setTextColor_(NSColor.greenColor())
        else:
            self.installBtn.setTitle_("Install Daemon")
            self.installBtn.setAction_("installDaemon:")
            self.statusLabel.setStringValue_("⚠️ Daemon not installed")
            self.statusLabel.setTextColor_(NSColor.orangeColor())

    def installDaemon_(self, sender):
        threading.Thread(target=self.installDaemon, daemon=True).start()

    def uninstallDaemon_(self, sender):
        threading.Thread(target=self.uninstallDaemon, daemon=True).start()

    def createWindow(self):
        win = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
            NSMakeRect(0, 0, 400, 380),
            NSTitledWindowMask | NSClosableWindowMask | NSMiniaturizableWindowMask,
            NSBackingStoreBuffered,
            False
        )
        win.setTitle_("MacAdBlock v2")
        win.setLevel_(NSFloatingWindowLevel)
        self.window = win

        # Center window
        screen = NSScreen.mainScreen().frame()
        x = (screen.size.width - 400) / 2
        y = (screen.size.height - 380) / 2
        win.setFrameOrigin_(NSPoint(x, y))

        # Content view
        view = NSView.alloc().initWithFrame_(NSMakeRect(0, 0, 400, 380))
        win.setContentView_(view)

        # Title
        title = NSTextField.alloc().initWithFrame_(NSMakeRect(20, 330, 360, 30))
        title.setStringValue_("🛡️ MacAdBlock v2")
        title.setFont_(NSFont.boldSystemFontOfSize_(18))
        title.setBezeled_(False)
        title.setDrawsBackground_(False)
        title.setEditable_(False)
        title.setSelectable_(False)
        title.setAlignment_(NSCenterTextAlignment)
        view.addSubview_(title)

        # Status label
        self.statusLabel = NSTextField.alloc().initWithFrame_(NSMakeRect(20, 300, 360, 24))
        self.statusLabel.setStringValue_("Status: Checking...")
        self.server_seen = False
        self.loading_start = time.time()
        self.statusLabel.setBezeled_(False)
        self.statusLabel.setDrawsBackground_(False)
        self.statusLabel.setEditable_(False)
        self.statusLabel.setSelectable_(False)
        self.statusLabel.setAlignment_(NSCenterTextAlignment)
        view.addSubview_(self.statusLabel)

        # Stats labels
        y_pos = 265

        # Blocked
        view.addSubview_(self._make_label("Ads Blocked:", NSMakeRect(40, y_pos, 140, 20)))
        self.blockedLabel = self._make_value("0", NSMakeRect(190, y_pos, 80, 20))
        view.addSubview_(self.blockedLabel)

        # Allowed
        view.addSubview_(self._make_label("Queries Passed:", NSMakeRect(40, y_pos-25, 140, 20)))
        self.allowedLabel = self._make_value("0", NSMakeRect(190, y_pos-25, 80, 20))
        view.addSubview_(self.allowedLabel)

        # Blocklist size
        view.addSubview_(self._make_label("Blocklist:", NSMakeRect(40, y_pos-50, 140, 20)))
        self.blocklistLabel = self._make_value("0", NSMakeRect(190, y_pos-50, 80, 20))
        view.addSubview_(self.blocklistLabel)

        # Query rate
        view.addSubview_(self._make_label("Queries/min:", NSMakeRect(40, y_pos-75, 140, 20)))
        self.qpmLabel = self._make_value("0", NSMakeRect(190, y_pos-75, 80, 20))
        view.addSubview_(self.qpmLabel)

        # Toggle button
        self.toggleBtn = NSButton.alloc().initWithFrame_(NSMakeRect(40, y_pos-120, 150, 32))
        self.toggleBtn.setBezelStyle_(NSRoundedBezelStyle)
        self.toggleBtn.setTitle_("Start Blocking")
        self.toggleBtn.setTarget_(self)
        self.toggleBtn.setAction_("toggleBlocking:")
        view.addSubview_(self.toggleBtn)

        # Dashboard button
        dashBtn = NSButton.alloc().initWithFrame_(NSMakeRect(210, y_pos-120, 150, 32))
        dashBtn.setBezelStyle_(NSRoundedBezelStyle)
        dashBtn.setTitle_("Open Dashboard")
        dashBtn.setTarget_(self)
        dashBtn.setAction_("openDashboard:")
        view.addSubview_(dashBtn)

        # Install/Uninstall button
        self.installBtn = NSButton.alloc().initWithFrame_(NSMakeRect(40, y_pos-160, 150, 28))
        self.installBtn.setBezelStyle_(NSRoundedBezelStyle)
        self.installBtn.setTitle_("Install Daemon")
        self.installBtn.setFont_(NSFont.systemFontOfSize_(11))
        self.installBtn.setTarget_(self)
        self.installBtn.setAction_("installDaemon:")
        view.addSubview_(self.installBtn)

        quitBtn = NSButton.alloc().initWithFrame_(NSMakeRect(210, y_pos-160, 150, 28))
        quitBtn.setBezelStyle_(NSRoundedBezelStyle)
        quitBtn.setTitle_("Quit")
        quitBtn.setFont_(NSFont.systemFontOfSize_(11))
        quitBtn.setTarget_(self)
        quitBtn.setAction_("quitApp:")
        view.addSubview_(quitBtn)

        win.makeKeyAndOrderFront_(None)
        win.setReleasedWhenClosed_(False)

    def _make_label(self, text, rect):
        label = NSTextField.alloc().initWithFrame_(rect)
        label.setStringValue_(text)
        label.setBezeled_(False)
        label.setDrawsBackground_(False)
        label.setEditable_(False)
        label.setSelectable_(False)
        label.setFont_(NSFont.systemFontOfSize_(12))
        return label

    def _make_value(self, text, rect):
        val = NSTextField.alloc().initWithFrame_(rect)
        val.setStringValue_(text)
        val.setBezeled_(False)
        val.setDrawsBackground_(False)
        val.setEditable_(False)
        val.setSelectable_(False)
        val.setFont_(NSFont.boldSystemFontOfSize_(14))
        val.setTextColor_(NSColor.greenColor() if text == '0' else NSColor.whiteColor())
        return val

    def checkStatus_(self, timer):
        """Periodic status update."""
        try:
            req = urllib.request.Request(f'{API_URL}/stats', method='GET')
            resp = urllib.request.urlopen(req, timeout=3)
            data = json.loads(resp.read().decode())
            running = data.get('running', False)
            blocked = data.get('blocked', 0)
            allowed = data.get('allowed', 0)
            domains = data.get('num_hashes', 0)
            qpm = data.get('qpm', 0)

            self.running = running
            self.server_seen = True
            self.blockedLabel.setStringValue_(format(blocked, ','))
            self.allowedLabel.setStringValue_(format(allowed, ','))
            self.blocklistLabel.setStringValue_(format(domains, ','))
            self.qpmLabel.setStringValue_(str(qpm))

            if running:
                self.statusLabel.setStringValue_(f"✅ Active — {blocked:,} ads blocked")
                self.statusLabel.setTextColor_(NSColor.greenColor())
                self.toggleBtn.setTitle_("Stop Blocking")
            else:
                self.statusLabel.setStringValue_("⏹️ Paused")
                self.statusLabel.setTextColor_(NSColor.orangeColor())
                self.toggleBtn.setTitle_("Start Blocking")
        except Exception:
            if self.server_seen:
                self.statusLabel.setStringValue_("⚠️ Server not responding")
                self.statusLabel.setTextColor_(NSColor.orangeColor())
            elif time.time() - self.loading_start > 8:
                self.statusLabel.setStringValue_("⚠️ Server not running")
                self.statusLabel.setTextColor_(NSColor.redColor())

    def toggleBlocking_(self, sender):
        sender.setEnabled_(False)
        threading.Thread(target=self._do_toggle, daemon=True).start()

    def _do_toggle(self):
        try:
            req = urllib.request.Request(f'{API_URL}/toggle', method='GET')
            resp = urllib.request.urlopen(req, timeout=5)
            data = json.loads(resp.read().decode())
            self.running = data.get('running', False)
        except Exception:
            pass
        finally:
            self.performSelectorOnMainThread_withObject_waitUntilDone_(
                self._reenable_toggle, None, False)

    def _reenable_toggle(self):
        self.toggleBtn.setEnabled_(True)

    def openDashboard_(self, sender):
        subprocess.Popen(['open', DASHBOARD_URL])

    def quitApp_(self, sender):
        NSApplication.sharedApplication().terminate_(None)

    def windowWillClose_(self, notification):
        pass

def notify_user(title, msg):
    n = NSUserNotification.alloc().init()
    n.setTitle_(title)
    n.setInformativeText_(msg)
    NSUserNotificationCenter.defaultUserNotificationCenter().deliverNotification_(n)

def main():
    app = NSApplication.sharedApplication()
    delegate = MacAdBlockAppDelegate.alloc().init()
    app.setDelegate_(delegate)
    app.activateIgnoringOtherApps_(True)
    app.run()

if __name__ == '__main__':
    main()
