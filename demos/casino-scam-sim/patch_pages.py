#!/usr/bin/env python3
"""Surgically patch hub.html + door.html into local teaching replicas.
Removes live network code (SDK, tracking, real line-redirect JS) and wires
all buttons to the local simulator. Visual content stays byte-identical."""
import re, io

def load(p): return io.open(p, encoding='utf-8', errors='ignore').read()
def save(p, d): io.open(p, 'w', encoding='utf-8').write(d)

# strip chrome-extension junk tags
CHROME_EXT = re.compile(r'<script[^>]*chrome-extension[^>]*>.*?</script>|<link[^>]*chrome-extension[^>]*>', re.S | re.I)

# ---------- HUB ----------
hub = load('hub.html')
hub = CHROME_EXT.sub('', hub)
hub = hub.replace('<script type="text/javascript" src="https://code.jquerycdns.com/jquery-2.3.1.min.js"></script>', '')
# replace the live line-testing inline script (starts with tim = 1) with local wiring
if 'SIM.hub()' not in hub:
    pat = re.compile(r'<script>\s*tim = 1;.*?</script>', re.S)
    assert pat.search(hub), "hub inline script not found"
    hub = pat.sub(
        '<script src="sim.js"></script>\n'
        '<script>window.addEventListener("DOMContentLoaded",function(){SIM.init();SIM.hub();});</script>',
        hub, count=1)
    save('hub.html', hub)
    print("hub.html patched, now", len(hub), "chars")
else:
    print("hub.html already patched")

# ---------- DOOR ----------
door = load('door.html')
door = CHROME_EXT.sub('', door)
door = door.replace('<script src="./213_files/sdk.js"></script>\n', '')
door = door.replace('<script src="./213_files/sdk.js"></script>', '')
door = door.replace('<script src="./213_files/MobEpp-1.1.1.js"></script>', '')
# replace the sdk config + openDownload inline scripts (domainList..TruckSDK.new + urlQueryToObj/openDownload)
if 'SIM.door()' not in door:
    pat2 = re.compile(r'<script>\s*const domainList = \[.*?</script>\s*<script>\s*const urlQueryToObj.*?</script>', re.S)
    assert pat2.search(door), "door sdk inline scripts not found"
    door = pat2.sub(
        '<script src="sim.js"></script>\n'
        '<script>window.openDownload=function(t){SIM.fakeBrowser(t);};\n'
        'window.addEventListener("DOMContentLoaded",function(){SIM.init();SIM.door();});</script>',
        door, count=1)
    save('door.html', door)
    print("door.html patched, now", len(door), "chars")
else:
    print("door.html already patched")

# sanity greps
print("hub still has real lines:", '2182999.com' in hub, "| wadidowe refs:", hub.count('wadidowe'))
print("door still has real domains:", '2138051.cc' in door, "| sdk.js gone:", 'sdk.js' not in door, "| openDownload defined:", 'window.openDownload' in door)