var ADMIN_PASS='isaac2026',editMode=false;
// Theme toggle
function toggleTheme(){
 var h=document.documentElement;
 var isDark=h.getAttribute('data-theme')!=='light';
 h.setAttribute('data-theme',isDark?'light':'dark');
 document.getElementById('themeBtn').textContent=isDark?'☀️':'🌙';
 try{localStorage.setItem('isaac-theme',isDark?'light':'dark')}catch(e){}
}
try{var th=localStorage.getItem('isaac-theme');if(th){document.documentElement.setAttribute('data-theme',th);document.getElementById('themeBtn').textContent=th==='light'?'☀️':'🌙'}}catch(e){}
function showAdmin(){document.getElementById('aOverlay').classList.add('show');document.getElementById('aPanel').classList.add('show');document.getElementById('aPass').focus()}
function hideAdmin(){document.getElementById('aOverlay').classList.remove('show');document.getElementById('aPanel').classList.remove('show');document.getElementById('aErr').textContent=''}
function login(){var p=document.getElementById('aPass').value;if(p===ADMIN_PASS){editMode=true;hideAdmin();rebuild();document.getElementById('aPass').value=''}else{document.getElementById('aErr').textContent='Wrong password'}}

function F(c){
 var b=document.querySelectorAll(".fbtn");for(var i=0;i<b.length;i++)b[i].classList.remove("active");
 var a=document.querySelector(".fbtn[onclick=\"F('"+c+"')\"]");if(a)a.classList.add("active");
 var s=document.querySelectorAll(".cat-section");for(var j=0;j<s.length;j++)s[j].classList.toggle("hidden",c!=="all"&&s[j].dataset.cat!==c);
}
function toggleV(btn){btn.classList.toggle("open");btn.nextElementSibling.classList.toggle("expanded")}
function W(u){window.open(u,"_blank")}

var D={sw:[
{t:"MacAdBlock",s:"done",d:"macOS DNS ad-blocker daemon on :8053.",a:[{l:"Open Folder",o:1,u:"./projects/adblockers/"}],g:[{c:"ac",l:"macOS"},{l:"DNS"},{l:"Python"},{l:"launchd"}],v:[{n:"V1",i:"Basic hosts file."},{n:"V2",i:"Daemon mode: launchd, auto-start."},{n:"V3",L:1,i:"System-wide: blocks ads in EVERY app."}]},
{t:"ESP32-C3 AdBlock",s:"done",d:"Network DNS sinkhole on ESP32. Blocks ads for all WiFi devices.",a:[{l:"Open Folder",o:1,u:"./projects/adblockers/"}],g:[{c:"ac",l:"ESP32"},{l:"C"},{l:"DNS"},{l:"IoT"}],v:[{n:"Note",i:"C3 incompatible with RT-AC58U WPA2. Used WROOM-32D."}]},
{t:"FrostSolve",s:"done",d:"macOS desktop app with manifest structure and full .app bundle.",a:[{l:"Open Folder",o:1,u:"./projects/FrostSolve/"}],g:[{c:"ac",l:"macOS"},{l:"App"},{l:"JavaScript"}],v:[{n:"V1",i:"Standalone script."},{n:"V2",L:1,i:"App bundle: Finder/Dock launchable."}]},
{t:"IsaacNetPkg",s:"done",d:"Password-protected .pkg. AppleScript uninstall.",a:[{l:"Open Folder",o:1,u:"./projects/IsaacNetPkg/"}],g:[{c:"ac",l:"macOS"},{l:"pkgbuild"},{l:"AppleScript"},{l:"launchd"}],v:[{n:"V1",i:"AppleScript in bash heredocs. Broke."},{n:"V2",L:1,i:"Fixed: AppleScript as real file."}]},
{t:"IsaacSecureMessenger",s:"done",d:"E2E encrypted messaging - X3DH + AES-256-GCM.",a:[{l:"Open Folder",o:1,u:"./projects/IsaacSecureMessenger/"}],g:[{c:"ac",l:"macOS"},{l:"Encryption"},{l:"AES-256"},{l:"PyObjC"}],v:[{n:"V1",i:"Browser chat. Manual key exchange."},{n:"V2",i:"Native app: QR code pairing."},{n:"V3",L:1,i:"X3DH protocol. Production grade."}]},
{t:"Multiplayer Game Server",s:"done",d:"WebSocket multiplayer backend - multi-room, sync, spectator.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/game-server.html"}],g:[{c:"ac",l:"WebSocket"},{l:"Python"},{l:"FastAPI"},{l:"Real-time"}],v:[{n:"V1",i:"Single room."},{n:"V2",i:"Multi-room with room codes."},{n:"V3",L:1,i:"Spectator mode + reconnect."}]},
{t:"HKPCBypass",s:"done",d:"Multi-layer school bypass. DoH+SOCKS5+HTTP CONNECT.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/hkc-bypass.html"}],g:[{c:"ac",l:"Networking"},{l:"Proxy"},{l:"DoH"},{l:"Python"}],v:[{n:"V1",i:"Single proxy."},{n:"V2",i:"DoH added: encrypted DNS."},{n:"V3",L:1,i:"Multi-layer fallback."}]},
{t:"WiFi Chat",s:"done",d:"LAN offline chat - no internet needed. WebSocket + DXF sharing.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/wifi-chat.html"}],g:[{c:"ac",l:"WebSocket"},{l:"Flask"},{l:"LAN"},{l:"Offline"}],v:[{n:"V1",i:"Basic text."},{n:"V2",i:"DXF/SVG uploads."},{n:"V3",L:1,i:"Offline-first. Cross-device."}]},
{t:"WiFi Monitor",s:"done",d:"ESP32 WiFi scanner - signal graphs, device tracking.",a:[{l:"Open Folder",o:1,u:"./projects/wifi-monitor/"}],g:[{c:"ac",l:"ESP32"},{l:"WiFi"},{l:"Scanner"},{l:"C"}],v:[{n:"V1",i:"Serial only."},{n:"V2",i:"MAC tracking."},{n:"V3",L:1,i:"Full dashboard."}]},
{t:"326929.pw Mirror",s:"done",d:"Full phishing site mirror - evidence for takedowns.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/scam-mirror.html"}],g:[{c:"gr",l:"Security"},{l:"Phishing"},{l:"Evidence"}],v:[{n:"V1",i:"Manual save."},{n:"V2",L:1,i:"wget mirror: all assets."}]},
{t:"Scam Mirror",s:"done",d:"Automated phishing cloner - registrar takedown reports.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/scam-mirror.html"}],g:[{c:"gr",l:"Security"},{l:"Scraping"},{l:"Python"}],v:[{n:"V1",i:"Manual per-site."},{n:"V2",L:1,i:"Automated: one command."}]},
{t:"IsaacKing Browser",s:"done",d:"Whitelist-only browser. PyObjC + WKWebView .app.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"macOS"},{l:"WKWebView"},{l:"PyObjC"},{l:"Browser"}],v:[{n:"V1",i:"White screen bug."},{n:"V2",L:1,i:"Fixed: HTML string direct load."}]},
{t:"IsaacBrowser",s:"done",d:"Variant browser - category-based whitelist.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"macOS"},{l:"Browser"},{l:"PyObjC"}],v:[{n:"V1",i:"IsaacKing fork."},{n:"V2",L:1,i:"Independent codebase."}]},
{t:"IsaacNet",s:"done",d:"Layered bypass. TLS-wrapped, multi-tunnel auto-fallback.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"Networking"},{l:"Proxy"},{l:"Python"},{l:"Bypass"}],v:[{n:"V1",i:"Single TCP tunnel."},{n:"V2",i:"TLS wrapping."},{n:"V3",L:1,i:"Layered: CONNECT+SOCKS5+WS."}]},
{t:"Manufacturing Explorer",s:"done",d:"200-method 3D manufacturing explorer. Three.js + Flask.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/game-server.html"}],g:[{c:"ac",l:"Three.js"},{l:"Flask"},{l:"3D"},{l:"G-code"}],v:[{n:"V1",i:"112 methods."},{n:"V2",i:"Collapsible panels."},{n:"V3",L:1,i:"200 methods."}]},
{t:"IsaacCombo",s:"done",d:"Multi-app .pkg - user selects apps.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"macOS"},{l:"pkgbuild"},{l:"Installer"}],v:[{n:"V1",i:"All-or-nothing."},{n:"V2",L:1,i:"Fixed: choice dialog."}]},
{t:"Macro Typer",s:"done",d:"Types text char-by-char - bypasses Google Docs history.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"Python"},{l:"pyautogui"},{l:"Tkinter"},{l:"macOS"}],v:[{n:"V1-4",i:"Invisible app."},{n:"V5",L:1,i:"Fixed: launch notification."}]},
{t:"Godzilla AI Chat",s:"done",d:"Godzilla-themed AI roleplay. TUI + GUI. Native .app.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"AI"},{l:"macOS"},{l:"Chat"},{l:"TUI"}],v:[{n:"V1",i:"Terminal TUI."},{n:"V2",i:"GUI with history."},{n:"V3",L:1,i:"Native .app. Themed UI."}]},
{t:"Isaac AI",s:"done",d:"AI chat assistant - native .app. Multi-personality, memory.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"AI"},{l:"macOS"},{l:"Chat"},{l:"App"}],v:[{n:"V1",i:"Single-turn."},{n:"V2",i:"Multi-turn with context."},{n:"V3",L:1,i:"Native .app WKWebView."}]},
{t:"IsaacSuite",s:"wip",d:"Unified launcher - one dock icon for all Isaac apps.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"macOS"},{l:"Launcher"},{l:"PyObjC"}],v:[{n:"V1",i:"Planned: menubar widget."}]},
{t:"IsaacAppLaunchers",s:"done",d:"Quick-launch scripts for the Isaac ecosystem.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"macOS"},{l:"Scripting"},{l:"Automation"}],v:[{n:"V1",i:"Individual scripts."},{n:"V2",L:1,i:"Unified launcher."}]},
{t:"IsaacOS",s:"draft",d:"Custom OS concept - bootable with all Isaac tools.",a:[{l:"Open Folder",o:1,u:"./projects/drafts/"}],g:[{l:"OS"},{l:"Concept"},{l:"System Design"}],v:[{n:"V1",i:"Concept phase."}]},
{t:"IsaacSystem-All",s:"draft",d:"Monolithic tool - all Isaac apps in one binary.",a:[{l:"Open Folder",o:1,u:"./projects/drafts/"}],g:[{l:"System"},{l:"Unified"},{l:"Meta-project"}],v:[{n:"V1",i:"Concept phase."}]},
{t:"Laser Cutting Simulator",s:"done",d:"Browser laser simulator - 9+ versions. G-code export.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/game-server.html"}],g:[{c:"ac",l:"React"},{l:"DXF"},{l:"Simulation"},{l:"Web App"}],v:[{n:"V1-3",i:"Basic canvas."},{n:"V4-6",i:"3D isometric."},{n:"V7-9",L:1,i:"True 3D orbital, G-code."}]}
],hw:[
{t:"Auto-Clamping Vise",s:"wip",d:"Arduino Nano + NEMA 17 + ACS712 sensor. 3D printed. ~$32.",a:[{l:"Open Folder",o:1,u:"./projects/auto-vise/"}],g:[{c:"ac",l:"Arduino"},{l:"Stepper"},{l:"3D Printed"},{l:"Current Sense"}],v:[{n:"V1",i:"Concept."},{n:"V2",i:"ACS712 current detection."},{n:"V3",L:1,i:"Calibrating."}]},
{t:"Clip-On Thermometer",s:"done",d:"ESP32 temp sensor with OpenSCAD enclosure.",a:[{l:"Open Folder",o:1,u:"./projects/clip-thermometer/"}],g:[{c:"ac",l:"ESP32"},{l:"Sensor"},{l:"PlatformIO"},{l:"OpenSCAD"}],v:[{n:"V1",i:"Breadboard."},{n:"V2",i:"Enclosure."},{n:"V3",L:1,i:"Production."}]},
{t:"Optical Center Punch",s:"done",d:"DIY $10 punch vs $30-60 commercial. 3D printed + lens.",g:[{c:"ac",l:"3D Printed"},{l:"Precision"},{l:"Optical"},{l:"Tool"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Desktop/optical-punch-body.stl"}],v:[{n:"V1",i:"Research phase."},{n:"V2",L:1,i:"Built with steel tip."}]},
{t:"Micro RC Car",s:"wip",d:"1/64-1/32 scale high-speed. No-solder Dupont build.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"RC"},{l:"Micro"},{l:"No-solder"},{l:"Speed"}],v:[{n:"V1",i:"Design phase."}]},
{t:"BLE Scanner",s:"wip",d:"ESP32 BLE device scanner - detect, log, dashboard.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"ESP32"},{l:"BLE"},{l:"Scanner"},{l:"IoT"}],v:[{n:"V1",i:"Research phase."}]}
],f3d:[
{t:"F1 Model Block Jig",s:"done",d:"Precision CNC jig. 6 versions, 15+ STL components.",g:[{c:"ac",l:"F1 In Schools"},{l:"CNC"},{l:"Jig"},{l:"Precision"}],a:[{c:"p3d",l:"View 3D (18 combos)",o:3,vs:[
{l:"V3 Left Base",p:"./Documents/Model Block Jig/version bravoprodigy/v3 (click fit bearing)/Left Jig Base.stl"},
{l:"V4 Left Base",p:"./Documents/Model Block Jig/v4/Left Jig Base.stl"},
{l:"V5 Left Base",p:"./Documents/Model Block Jig/version bravoprodigy/v5/Left Jig Base.stl"},
{l:"V6 Left Base",p:"./Documents/Model Block Jig/version bravoprodigy/v6/Left Base.stl"},
{l:"V3 Right Base",p:"./Documents/Model Block Jig/version bravoprodigy/v3 (click fit bearing)/Right Jig Base.stl"},
{l:"V4 Right Base",p:"./Documents/Model Block Jig/v4/Right Jig Base.stl"},
{l:"V5 Right Base",p:"./Documents/Model Block Jig/version bravoprodigy/v5/Right Jig Base.stl"},
{l:"V6 Right Base",p:"./Documents/Model Block Jig/version bravoprodigy/v6/Right Base.stl"},
{l:"V3 Left Insert",p:"./Documents/Model Block Jig/version bravoprodigy/v3 (click fit bearing)/Left Jig Insert.stl"},
{l:"V4 Left Insert",p:"./Documents/Model Block Jig/v4/Left Jig Insert.stl"},
{l:"V5 Left Insert",p:"./Documents/Model Block Jig/version bravoprodigy/v5/Left Jig Insert.stl"},
{l:"V6 Left Insert",p:"./Documents/Model Block Jig/version bravoprodigy/v6/Left Insert.stl"},
{l:"V3 Right Insert",p:"./Documents/Model Block Jig/version bravoprodigy/v3 (click fit bearing)/Right Jig Insert.stl"},
{l:"V4 Right Insert",p:"./Documents/Model Block Jig/v4/Right Jig Insert.stl"},
{l:"V5 Right Insert",p:"./Documents/Model Block Jig/version bravoprodigy/v5/Right Jig Insert.stl"},
{l:"V6 Right Insert",p:"./Documents/Model Block Jig/version bravoprodigy/v6/Right Insert.stl"},
{l:"V6 Left Plug",p:"./Documents/Model Block Jig/version bravoprodigy/v6/Left Plug.stl"},
{l:"V6 Right Plug",p:"./Documents/Model Block Jig/version bravoprodigy/v6/Right Plug.stl"}
]}],v:[{n:"V3",i:"Left/Right Jig v2-5. Basic functional."},{n:"V4",i:"BravoProdigy: Base v1-2. Modular."},{n:"V5",i:"Refined: Insert v1-2. Tighter."},{n:"V6",L:1,i:"Latest: circular insert + plug system."}]},
{t:"F1 Car Net",s:"done",d:"46 DXF versions + 9 measured + 7 re-measured.",g:[{c:"ac",l:"F1 In Schools"},{l:"Laser Cut"},{l:"DXF"},{l:"46 Versions"}],a:[{c:"p2d",l:"View DXF (8 vers)",o:4,vs:[
{l:"V1",p:"./Documents/f1/f1 folding/bought v1.dxf"},{l:"V5",p:"./Documents/f1/f1 folding/car net v5.dxf"},
{l:"V10",p:"./Documents/f1/f1 folding/car net v10.dxf"},{l:"V20",p:"./Documents/f1/f1 folding/car net v20.dxf"},
{l:"V30",p:"./Documents/f1/f1 folding/car net v30.dxf"},{l:"V40",p:"./Documents/f1/f1 folding/car net v40.dxf"},
{l:"V45",p:"./Documents/f1/f1 folding/car net v45 final.dxf"},{l:"V46 Final",p:"./Documents/f1/f1 folding/very good (final).dxf"}
]}],v:[{n:"V1-10",i:"Early shapes."},{n:"V11-25",i:"4mm variants."},{n:"V26-38",i:"Re-measured: correct holes."},{n:"V39-46",L:1,i:"Final: V45 final, V46 tweaks."}]},
{t:"F1 Engine Net",s:"done",d:"Laser-cut engine housing net - optimised.",g:[{c:"ac",l:"F1 In Schools"},{l:"Engine"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/f1/f1 folding/f1 engine net optimised.dxf"}],v:[{n:"V1",i:"Single axle hole."},{n:"V2",L:1,i:"Optimised cutouts."}]},
{t:"F1 Car Body Net",s:"done",d:"Laser-cut car body shell net - axle holes corrected.",g:[{c:"ac",l:"F1 In Schools"},{l:"Body"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/f1/f1 folding/car body axle holes correct.dxf"}],v:[{n:"V1",i:"Initial body shell."},{n:"V2",L:1,i:"Axle holes corrected."}]},
{t:"Halo 2025 + SR Logo",s:"done",d:"4-stage: helmet - halo - spigot - drilling jig.",g:[{c:"ac",l:"F1 In Schools"},{l:"Safety"},{l:"Halo"},{l:"3D Print"}],a:[{c:"p3d",l:"View 3D (4 vers)",o:3,vs:[
{l:"V1 Helmet",p:"./Documents/f1/f1 print/2025_helmet__with_6mm_dia_spigot_final.stl"},
{l:"V2 Halo",p:"./Documents/f1/f1 print/Self Modified/halo_v2.stl"},
{l:"V3 Spigot",p:"./Documents/f1/f1 print/halo_2025_with_6mm_hole_and_sr_logo.stl"},
{l:"V4 Jig",p:"./Documents/f1/f1 print/final_entry_class_halo_spigot_drilling_jig.stl"}
]}],v:[{n:"V1",i:"Helmet shape."},{n:"V2",i:"Halo geometry."},{n:"V3",i:"Spigot hole."},{n:"V4",L:1,i:"Drilling jig."}]},
{t:"F1 Self-Modified Parts",s:"done",d:"Axle bushes V2-V4, bearing holders, wings, tether.",g:[{c:"ac",l:"F1 In Schools"},{l:"Modified"},{l:"STL"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/f1/f1 print/Self Modified/axle bush v4.stl"}],v:[{n:"V2",i:"Basic bush."},{n:"V3",i:"Refined."},{n:"V4",L:1,i:"Final: chamfered."}]},
{t:"F1 Car Chassis",s:"done",d:"Complete F1 chassis - aero body, competition spec.",g:[{c:"ac",l:"F1 In Schools"},{l:"Chassis"},{l:"Aero"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/f1/f1 print/new f1 car model.stl"}]},
{t:"VEX IQ Box Inserts",s:"done",d:"34 DXF iterations to perfect. Laser-cut acrylic organizer.",g:[{c:"ac",l:"VEX"},{l:"Organization"},{l:"34 Versions"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/VEX IQ BOX INSERTS/finished.dxf"}],v:[{n:"V1",i:"Full size - didnt fit."},{n:"V2-10",i:"40%-30% scaling."},{n:"V11-20",i:"Measured cad 2.0-4.0."},{n:"V21-30",i:"Perfect 2.0 fixed."},{n:"V31-34",L:1,i:"Final!!!! Production."}]},
{t:"BravoProdigy CNC Bit Case",s:"done",d:"Parametric CNC bit storage. Calibrated.",g:[{c:"ac",l:"CNC"},{l:"Storage"},{l:"Parametric"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/bravoprodigy cnc bit case.stl"}],v:[{n:"Test",i:"Tight/loose."},{n:"Final",L:1,i:"Calibrated."}]},
{t:"Drill Bit Box",s:"done",d:"Friction-fit bit storage. Snap lid. Labeled.",g:[{l:"Storage"},{l:"Organization"},{l:"Tools"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/bit-storage-box-base.stl"}],v:[{n:"V1",i:"Bits fell out."},{n:"Final",L:1,i:"Friction-fit + labels."}]},
{t:"CNC Mill Tool Head Box",s:"done",d:"Single to dual slot. Improved latch.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Downloads/cnc drill bit case.stl"}],g:[{c:"ac",l:"CNC"},{l:"Storage"}],v:[{n:"V1",i:"Single slot."},{n:"V2",L:1,i:"Dual slot."}]},
{t:"Hex Drill Adapter",s:"done",d:"Magnetic quick-change. V2-V4 magnet + concentricity.",g:[{c:"ac",l:"Tools"},{l:"Magnetic"},{l:"Adapter"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/hex adapter v4.stl"}],v:[{n:"V2",i:"Weak magnet."},{n:"V3",i:"3mm hex."},{n:"V4",L:1,i:"Final: zero wobble."}]},
{t:"80 Vise Jaw",s:"done",d:"Magnetic jaw - test + final. Press-fit magnet.",g:[{c:"ac",l:"Vise"},{l:"Magnetic"},{l:"Workshop"}],a:[{c:"p3d",l:"View 3D (2 vers)",o:3,vs:[{l:"V1 Test",p:"./Documents/common stl/80 vise jaw good.stl"},{l:"V2 Final",p:"./Documents/common stl/80 vise jaw good.stl"}]}],v:[{n:"V1",i:"Loose magnet."},{n:"V2",L:1,i:"Press-fit, 2mm thinner."}]},
{t:"USB Dust Cover",s:"done",d:"Protective USB cover. V2 tighter fit + grip.",g:[{l:"USB"},{l:"Protection"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/usb dust cover v2.stl"}],v:[{n:"V1",i:"Too loose."},{n:"V2",L:1,i:"Tighter + grip ridge."}]},
{t:"Type-C to USB Adapter",s:"done",d:"Custom adapter housing. V2 snap-fit.",g:[{c:"ac",l:"USB"},{l:"Adapter"},{l:"Type-C"}],a:[{c:"p3d",l:"View 3D (2 vers)",o:3,vs:[{l:"V1",p:"./Documents/common stl/type c to usb adapter.stl"},{l:"V2",p:"./Documents/common stl/v2 type c to usb adapter.stl"}]}],v:[{n:"V1",i:"Too tight."},{n:"V2",L:1,i:"+0.3mm, snap-fit."}]},
{t:"1205 Bearing Plug",s:"done",d:"Standard and tight-fit variants.",g:[{l:"Bearings"},{l:"Plug"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/tight 1205 plug.stl"}]},
{t:"Inner Hex Screws",s:"done",d:"M6 and M8 inner hex screw designs.",g:[{l:"Screws"},{l:"Hex"},{l:"Fasteners"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/inner hex screw.stl"}]},
{t:"Big Bowl Clicker",s:"done",d:"Tactile mechanism. V3 sharper click.",g:[{l:"Mechanism"},{l:"Clicker"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/big bowl clicker v3 base.stl"}],v:[{n:"V1",i:"Not crisp."},{n:"V3",L:1,i:"Sharper click."}]},
{t:"Rocket Flour Sifter",s:"done",d:"5 iterations. Recovered after crash.",a:[{l:"Open Folder",o:1,u:"./Downloads/"}],g:[{c:"ac",l:"Kitchen"},{l:"Mechanism"},{l:"Rocket"}],v:[{n:"V1",i:"Mesh clogged."},{n:"V6",L:1,i:"Recovered: 5 refinements."}]},
{t:"Yin Mechanism",s:"done",d:"Compliant yin-yang - 4.9 MB. Mechanical art.",g:[{c:"ac",l:"Compliant"},{l:"Mechanism"},{l:"Art"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/yin.stl"}]},
{t:"Knurl Bearing",s:"done",d:"Heaviest at 16.7 MB. Knurled raceways.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Downloads/knurl bearing in out.stl"}],g:[{c:"ac",l:"Bearings"},{l:"Knurling"},{l:"Complex"}]},
{t:"VEX IQ Acrylic Box",s:"done",d:"V1-V3: vents, cutouts, standoffs.",a:[{l:"Open Folder",o:1,u:"./Documents/VEX IQ BOX INSERTS/"}],g:[{c:"ac",l:"VEX"},{l:"Enclosure"},{l:"Acrylic"}],v:[{n:"V1",i:"No ventilation."},{n:"V3",L:1,i:"Added vents + cutouts."}]},
{t:"VEX IQ Storage Box",s:"done",d:"3D-printed: IQ BIN + Lid + Tray.",g:[{c:"ac",l:"3D Print"},{l:"VEX"},{l:"Storage"}],a:[{c:"p3d",l:"View 3D (3 parts)",o:3,vs:[
{l:"Tray",p:"./Downloads/40% vex iq storage box/Tray.stl"},
{l:"IQ BIN",p:"./Downloads/40% vex iq storage box/228-2929 IQ BIN.stl"},
{l:"Lid",p:"./Downloads/40% vex iq storage box/Storage Lid.stl"}
]}],v:[{n:"30%",i:"Test scale."},{n:"40%",L:1,i:"Production."}]},
{t:"VEX PIN TWEEZER V5",s:"done",d:"Specialized VEX pin tool.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"VEX"},{l:"Tool"}]},
{t:"VEX EDR Box Inserts",s:"done",d:"Laser-cut inserts for VEX EDR metal kit.",g:[{c:"ac",l:"VEX EDR"},{l:"AI"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Downloads/VEX EDR Box Inserts.dxf"}]},
{t:"Masterball",s:"done",d:"Pokemon Masterball replica. 2-part printable.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Downloads/masterball new.stl"}],g:[{c:"ac",l:"Pokemon"},{l:"Replica"}]},
{t:"Halo Helmet V2",s:"done",d:"Wearable. V2 dowels for assembly.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/f1/f1 print/Self Modified/Halo Helmet f1 car.stl"}],g:[{c:"ac",l:"Halo"},{l:"Helmet"},{l:"Cosplay"}],v:[{n:"V1",i:"Too big."},{n:"V2",L:1,i:"Split with dowels."}]},
{t:"Family Keychain Set",s:"done",d:"Laser-cut keychains - Arcadi + individual.",g:[{l:"Keychain"},{l:"Laser"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/family keychain/family keychain.dxf"}]},
{t:"Dura Block",s:"done",d:"Sanding block replica. Text + plain.",a:[{l:"Open Folder",o:1,u:"./Downloads/Dura+Block+Hand+Sanding+Block/"}],g:[{l:"Sanding"},{l:"Tool"}],v:[{n:"Text",i:"Branded."},{n:"Plain",L:1,i:"Cleaner."}]},
{t:"Isaac Chan Atom",s:"done",d:"Laser engraving - name with orbital rings.",g:[{l:"Laser"},{l:"DXF"},{l:"Personal"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/family keychain/isaac.dxf"}]},
{t:"Chill Out Sign",s:"done",d:"Laser-cut cardboard sign.",g:[{l:"Laser"},{l:"DXF"},{l:"Sign"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/chill out resized on cardboard.dxf"}]},
{t:"Music Sheet Holder",s:"done",d:"100% scale - 6 iterations.",g:[{l:"Music"},{l:"Stand"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Downloads/100 music sheet holder 0.6.dxf"}],v:[{n:"V1-5",i:"Fit iterations."},{n:"V6",L:1,i:"Production."}]},
{t:"Honeycomb Laser Bed Clip",s:"done",d:"Clip for honeycomb laser bed.",g:[{l:"Laser"},{l:"Clip"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Desktop/honeycomb laser bed clip.dxf"}]}
],des:[
{t:"F1 Design Portfolio",s:"done",d:"Official F1 design portfolio - CAD, CFD. 5.5 MB.",g:[{c:"ac",l:"F1"},{l:"Portfolio"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/Design portfolio.pdf"}]},
{t:"F1 Enterprise Portfolio",s:"done",d:"F1 business - branding, budget. 6.5 MB.",g:[{c:"ac",l:"F1"},{l:"Business"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/Enterprise portfolio.pdf"}]},
{t:"F1 Verbal Presentation",s:"done",d:"Nationals pitch. 3.9 MB.",g:[{c:"ac",l:"F1"},{l:"Presentation"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/Verbal Presentation Nationals.pdf"}]},
{t:"F1 Car Renders",s:"done",d:"Studio-quality 3D renders. 10 MB.",g:[{c:"ac",l:"F1"},{l:"Renders"},{l:"3D"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/renders.pdf"}]},
{t:"VEX IQ Kit Layout",s:"done",d:"Parts organization poster. 3 MB.",g:[{c:"ac",l:"VEX"},{l:"Poster"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/228-8899-KitLayout.pdf"}]},
{t:"VEX IQ Gen 1 Poster",s:"done",d:"Gen 1 parts org poster. 2.8 MB.",g:[{c:"ac",l:"VEX"},{l:"Poster"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Documents/vex organise gen 1.pdf"}]},
{t:"P2S Clog Guide",s:"done",d:"Bambu Lab P2S extruder cleaning. 6.6 MB.",g:[{c:"ac",l:"Bambu"},{l:"3D Printer"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/P2S Extruder Clog Cleaning Guide.pdf"}]},
{t:"Daja A6 Pro Guide",s:"done",d:"Complete Daja laser reference. 13.5 MB.",g:[{c:"gr",l:"Laser"},{l:"Daja"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/daja a6 pro tutorial.pdf"}]},
{t:"Laser Reference Library",s:"done",d:"30+ files: LightBurn, LaserGRBL, Sheets.",g:[{c:"gr",l:"Laser"},{l:"Reference"},{l:"Sheets"}],a:[{l:"Open Folder",o:1,u:"./Desktop/Parametrers/"}]},
{t:"Barrier Reef Poster",s:"done",d:"A3 science/geography poster.",g:[{c:"gr",l:"Poster"},{l:"Science"}],a:[{l:"Open PDF",o:6,p:"./Downloads/Barrier Reef.pdf"}]},
{t:"VIQRC Notebook",s:"done",d:"VEX IQ engineering notebook. 14 MB.",g:[{c:"ac",l:"VEX"},{l:"Robotics"}],a:[{l:"Open PDF",o:6,p:"./Downloads/Copy of VIQRC Digital Notebook - Template v4.0.pdf"}]},
{t:"Mega Tours Presentation",s:"done",d:"87 MB final presentation.",g:[{c:"gr",l:"Presentation"}],a:[{l:"Open PDF",o:6,p:"./Downloads/Mega Tours Final Presentation.pdf"}]},
{t:"Canva Designs",s:"wip",d:"Canva via school Google. DAHIIX_Dw0Q. 57 MB.",a:[{c:"ac",l:"Open Canva",o:1,u:"https://www.canva.com/"}],g:[{c:"gr",l:"Canva"},{l:"Cloud"},{l:"Design"}]},
{t:"Google Drive Portfolio",s:"wip",d:"Docs + Slides. isaac_cs.chan@online.island.edu.hk.",a:[{c:"ac",l:"Open Drive",o:1,u:"https://drive.google.com/"}],g:[{c:"ac",l:"Google"},{l:"Cloud"}]},
{t:"Family Keychain AI/SVG",s:"done",d:"Illustrator art - Arcadi, Isaac, Ivan.",g:[{c:"ac",l:"AI"},{l:"SVG"},{l:"Typography"}],a:[{l:"Open Folder",o:1,u:"./Documents/family%20keychain/"}]},
{t:"VEX IQ Vector Masters",s:"done",d:"Production AI/SVG - Perfect.ai, finished.ai.",g:[{c:"ac",l:"AI"},{l:"SVG"},{l:"VEX"}],a:[{l:"Open Folder",o:1,u:"./Documents/VEX%20IQ%20BOX%20INSERTS/"}]},
{t:"Kinetic Industries",s:"done",d:"Branding/logo. 1.5 MB PNG.",g:[{c:"gr",l:"Branding"},{l:"Logo"}],a:[{l:"View Image",o:6,p:"./Downloads/Kinetic Industries.png"}]},
{t:"Storyboard",s:"done",d:"2.2 MB visual plan.",g:[{c:"gr",l:"Storyboard"}],a:[{l:"View Image",o:6,p:"./Downloads/Storyboard.png"}]},
{t:"Humanities Essay",s:"done",d:"26 MB Industrial Revolution research.",g:[{l:"Humanities"},{l:"History"}],a:[{l:"Open PDF",o:6,p:"./Downloads/humanities industrial revolution.pdf"}]},
{t:"Photo Holder V3",s:"done",d:"3-version photo display stand.",g:[{l:"Design"},{l:"Holder"}],a:[{l:"Open PDF",o:6,p:"./Documents/family keychain/"}]}
]};

function rebuild(){
 var map={sw:'software',hw:'hardware',f3d:'fusion',des:'design'};
 var cats={sw:'Software &amp; Apps',hw:'Hardware &amp; Electronics',f3d:'Fusion 360 CAD',des:'Design &amp; Documents'};
 var subs={sw:'24 applications from network bypass to AI chat',hw:'5 projects from micro RC to auto-clamping vises',f3d:'60+ original designs from F1 parts to practical tools',des:'20+ posters, presentations, portfolios, and graphic design'};
 var html='';
 for(var k in cats){
  var p3d=0,p2d=0,pdf=0,live=0;
  D[k].forEach(function(p){p.a&&p.a.forEach(function(a){if(a.o===2||a.o===3)p3d++;else if(a.o===4||a.o===5)p2d++;else if(a.o===6)pdf++;else if(a.o===7)live++})});
  var badges='';
  if(p3d)badges+='<span class="secbadge p3d">🔍 '+p3d+' 3D</span>';
  if(p2d)badges+='<span class="secbadge p2d">📐 '+p2d+' DXF</span>';
  if(pdf)badges+='<span class="secbadge">📖 '+pdf+' PDF</span>';
  if(live)badges+='<span class="secbadge">▶ '+live+' Demo</span>';
  html+='<div class="container cat-section" data-cat="'+map[k]+'" id="'+k+'"><div class="stitle">'+cats[k]+'</div><div class="ssub">'+subs[k]+'</div>'+(badges?'<div class="secbadges">'+badges+'</div>':'')+'<div class="grid">';
  D[k].forEach(function(p,i){html+=R(p,k,i)});
  html+='</div></div>';
 }
 document.getElementById('app').innerHTML=html;
 // Update filter counts
 var counts={all:0,software:D.sw.length,hardware:D.hw.length,fusion:D.f3d.length,design:D.des.length};
 for(var k2 in counts)counts.all+=counts[k2];
 document.querySelectorAll('.fbtn').forEach(function(b){
  var m=b.getAttribute('onclick').match(/F\('(\w+)'\)/);
  if(m&&counts[m[1]]!==undefined)b.textContent=b.textContent.replace(/\s*\(\d+\)/,'')+' ('+counts[m[1]]+')';
 });
}
function R(p,cat,idx){
 var emojis={sw:'💻',hw:'🔧',f3d:'📐',des:'📄'};
 var em=emojis[cat]||'📦';
 var h='<div class="card'+(editMode?' editing':'')+'" data-cat="'+cat+'" data-idx="'+idx+'"><div class="ch"><div class="ctitle">'+em+' '+p.t+'</div><span class="status '+p.s+'">'+p.s+'</span></div>';
 h+='<div class="cdesc">'+p.d+'</div>';
 if(p.g){h+='<div class="tags">';p.g.forEach(function(x){h+='<span class="tag'+(x.c?' '+x.c:'')+'">'+x.l+'</span>'});h+='</div>'}
 if(p.v&&p.v.length){h+='<button class="vtoggle" onclick="toggleV(this)"><span class="arr">\u25b6</span> Version history ('+p.v.length+' steps)</button><div class="versions">';p.v.forEach(function(x){h+='<div class="vitem"><span class="vbadge'+(x.L?' latest':'')+'">'+x.n+'</span><div class="vinfo">'+x.i+'</div></div>'});h+='</div>'}
 if(p.a&&p.a.length){h+='<div class="actions">';p.a.forEach(function(x,i){h+='<button class="abtn'+(x.c?' '+x.c:'')+'" data-t="'+p.t.replace(/"/g,'&quot;')+'" data-i="'+i+'">'+x.l+'</button>'});h+='</div>'}
 if(editMode){h+='<div style="margin-top:8px"><input class="edit-input show" value="'+p.t.replace(/"/g,'&quot;')+'" onchange="editCard(\''+cat+'\','+idx+',\'t\',this.value)"><input class="edit-input show" value="'+p.d.replace(/"/g,'&quot;')+'" onchange="editCard(\''+cat+'\','+idx+',\'d\',this.value)"><select class="edit-input show" onchange="editCard(\''+cat+'\','+idx+',\'s\',this.value)" style="color:var(--t1)"><option value="done"'+(p.s==='done'?' selected':'')+'>Done</option><option value="wip"'+(p.s==='wip'?' selected':'')+'>WIP</option><option value="draft"'+(p.s==='draft'?' selected':'')+'>Draft</option></select></div>'}
 h+='</div>';return h
}
function editCard(cat,idx,field,val){D[cat][idx][field]=val;rebuild();saveData()}
function saveData(){try{localStorage.setItem('isaac-projects',JSON.stringify({sw:D.sw,hw:D.hw,f3d:D.f3d,des:D.des}))}catch(e){}}
// Load saved edits (after D defined)
try{var saved=localStorage.getItem('isaac-projects');if(saved){var sd=JSON.parse(saved);for(var k in sd)for(var i=0;i<sd[k].length;i++)if(D[k]&&D[k][i]){D[k][i].t=sd[k][i].t||D[k][i].t;D[k][i].d=sd[k][i].d||D[k][i].d;D[k][i].s=sd[k][i].s||D[k][i].s}}}catch(e){}
rebuild();
function search(q){q=q.toLowerCase();document.querySelectorAll('.card').forEach(function(c){var t=c.querySelector('.ctitle'),d=c.querySelector('.cdesc');c.style.display=(!q||(t&&t.textContent.toLowerCase().indexOf(q)>=0)||(d&&d.textContent.toLowerCase().indexOf(q)>=0))?'':'none'})}
window.addEventListener('scroll',function(){document.getElementById('btt').classList.toggle('show',window.scrollY>500)});
// Scroll reveal + stat count-up
(function(){
 var els=document.querySelectorAll('.stitle,.ssub');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.1});
 els.forEach(function(el){el.classList.add('reveal');io.observe(el)});
 var nums=document.querySelectorAll('.stat .num');
 var targets=[120,24,5,60,20];
 var io2=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){
   var idx=[].indexOf.call(nums,e.target),target=targets[idx]||0,dur=1200,t0=null;
   function tick(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1);e.target.textContent=Math.floor(target*p)+'+';if(p<1)requestAnimationFrame(tick)}
   requestAnimationFrame(tick);
   io2.unobserve(e.target);
  }
 })},{threshold:0.5});
 nums.forEach(function(n){io2.observe(n)});
})();

document.addEventListener('click',function(e){
 var btn=e.target.closest('.abtn');if(!btn)return;
 var title=btn.dataset.t,idx=parseInt(btn.dataset.i),found=null,all=[D.sw,D.hw,D.f3d,D.des];
 for(var a=0;a<all.length;a++)for(var b=0;b<all[a].length;b++)if(all[a][b].t===title){found=all[a][b];break}
 if(!found||!found.a||!found.a[idx])return;
 var act=found.a[idx];
 if(act.o===1)W(act.u);else if(act.o===2)open3D(act.p);else if(act.o===3)open3DM(found.t,act.vs);else if(act.o===4)openDXFM(found.t,act.vs);else if(act.o===5)openDXF(act.p);else if(act.o===6)W(act.p);else if(act.o===7)showIframe(found.t,act.u);
});

var cv=[],_scene,_cam,_rend,_ctrl,_mesh,_anim;
function open3D(p){cv=[{l:'Model',p:p}];show3D('3D Preview')}
function open3DM(t,arr){cv=arr;show3D(t)}
function show3D(t){
 var th='<span>'+t+'</span>';
 if(cv.length>1){th+=' <span style="color:var(--t3);font-size:11px">Version:</span> <select id="vs_" onchange="swV(this.value)" style="padding:6px 12px;border-radius:6px;border:1px solid var(--ab);background:var(--sf);color:var(--t2);font-size:13px;cursor:pointer;min-width:140px;font-weight:500">'+cv.map(function(x,i){return'<option value="'+i+'">'+x.l+'</option>'}).join('')+'</select>'}
 var m=document.createElement('div');m.className='modal active';m.id='_3d';
 m.innerHTML='<div class="modal-inner"><div class="modal-h"><h3>'+th+'</h3><div style="display:flex;gap:4px;align-items:center">'+
  '<button class="vctrl" onclick="toggleWire()" title="Wireframe">⬚</button>'+
  '<button class="vctrl" onclick="toggleRotate()" title="Auto-rotate">⟳</button>'+
  '<button class="vctrl" onclick="toggleFull()" title="Fullscreen">⛶</button>'+
  '<button class="vctrl" onclick="downloadSTL()" title="Download STL">⬇</button>'+
  '<button class="modal-close" onclick="closeM(\'_3d\')">X</button></div></div>'+
  '<div class="modal-body" id="_3db"><div class="modal-loading" id="_3dl">Loading 3D engine...</div><div class="modal-hint">Drag to rotate | Scroll to zoom | Click model to pause rotation</div></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_3d')});
 load3D(cv[0].p)
}
function toggleWire(){if(_mesh){_mesh.material.wireframe=!_mesh.material.wireframe}}
function toggleRotate(){if(_ctrl){_ctrl.autoRotate=!_ctrl.autoRotate}}
function toggleFull(){var m=document.getElementById('_3d');if(!m)return;if(document.fullscreenElement){document.exitFullscreen()}else{m.querySelector('.modal-inner').requestFullscreen().catch(function(){})}}
function downloadSTL(){var a=document.createElement('a');a.href=EP(cv[0].p);a.download=cv[0].p.split('/').pop().split('%20').join('_');document.body.appendChild(a);a.click();a.remove()}
function load3D(p){
 var vl=document.getElementById('_3dl'),vb=document.getElementById('_3db');
 if(!_scene){
  try{
   _scene=new THREE.Scene();_scene.background=new THREE.Color(0x191a1b);
   _cam=new THREE.PerspectiveCamera(45,vb.clientWidth/vb.clientHeight,0.1,1000);_cam.position.set(5,3,5);
   _rend=new THREE.WebGLRenderer({antialias:true});_rend.setPixelRatio(Math.min(window.devicePixelRatio,2));
   _scene.add(new THREE.AmbientLight(0x606070,2.5));
   var d=new THREE.DirectionalLight(0xffffff,3);d.position.set(5,10,5);_scene.add(d);
   var d2=new THREE.DirectionalLight(0x7170ff,1.5);d2.position.set(-3,2,-3);_scene.add(d2);
   _scene.add(new THREE.GridHelper(6,20,0x333340,0x222228));
   _ctrl=new THREE.OrbitControls(_cam,_rend.domElement);_ctrl.enableDamping=true;_ctrl.autoRotate=true;
  }catch(e){vl.innerHTML='<p style="color:var(--red)">3D engine failed</p>';return}
 }
 _rend.setSize(vb.clientWidth,vb.clientHeight);vb.appendChild(_rend.domElement);
 loadSTL(p,vl);
 function a(){_anim=requestAnimationFrame(a);_ctrl.update();_rend.render(_scene,_cam)}a()
}
// Encode path keeping / and . intact
function EP(p){return p.split('/').map(function(s){return encodeURIComponent(s).replace(/%2E/g,'.').replace(/%25/g,'%')}).join('/')}

function loadSTL(p,vl){
 p=EP(p);
 if(_mesh){_scene.remove(_mesh);_mesh=null}
 vl.style.display='flex';vl.innerHTML='<span>Loading model...</span><div style="width:200px;height:4px;background:var(--bd);border-radius:2px;margin-top:8px"><div id="_prog" style="width:0%;height:100%;background:var(--ab);border-radius:2px;transition:width 0.3s"></div></div>';
 new THREE.STLLoader().load(p,function(g){
  vl.style.display='none';
  g.computeBoundingBox();var b=g.boundingBox,c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3()),sc=4/Math.max(s.x,s.y,s.z,1);
  _mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x7170ff,metalness:0.3,roughness:0.5}));
  _mesh.scale.set(sc,sc,sc);_mesh.position.set(-c.x*sc,-c.y*sc,-c.z*sc);_scene.add(_mesh);
  _ctrl.target.set(0,0,0);_ctrl.update()
 },function(x){var pct=Math.round(x.loaded/x.total*100);var prog=document.getElementById('_prog');if(prog)prog.style.width=pct+'%'},
 function(e){vl.innerHTML='<p style="color:var(--red)">Model not found</p><p style="font-size:11px;color:var(--t4)">'+p.split('/').pop()+'</p>'}
 );
}
function swV(i){var vl=document.getElementById('_3dl');vl.style.display='flex';vl.innerHTML='<span>Switching...</span><div style="width:200px;height:4px;background:var(--bd);border-radius:2px;margin-top:8px"><div id="_prog" style="width:0%;height:100%;background:var(--ab);border-radius:2px"></div></div>';loadSTL(cv[i].p,vl)}
function closeM(id){var m=document.getElementById(id);if(m)m.remove();if(id==='_3d'&&_anim){cancelAnimationFrame(_anim);_anim=null}}
function showIframe(t,u){
 var m=document.createElement('div');m.className='modal active';m.id='_if';
 m.innerHTML='<div class="modal-inner"><div class="modal-h"><h3><span>'+t+'</span></h3><button class="modal-close" onclick="closeM(\'_if\')">X</button></div><div class="modal-body" style="padding:0"><iframe src="'+u+'" style="width:100%;height:100%;border:none"></iframe></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_if')});
}

var dxfV=[];
function openDXF(p){dxfV=[{l:'DXF',p:p}];showDXF('DXF Preview')}
function openDXFM(t,arr){dxfV=arr;showDXF(t)}
function showDXF(t){
 var th='<span>'+t+'</span>';
 if(dxfV.length>1){th+=' <span style="color:var(--t3);font-size:11px">Version:</span> <select id="dxf_vs" onchange="dxfSw(this.value)" style="padding:6px 12px;border-radius:6px;border:1px solid var(--gn);background:var(--sf);color:var(--t2);font-size:13px;cursor:pointer;min-width:140px;font-weight:500">'+dxfV.map(function(x,i){return'<option value="'+i+'">'+x.l+'</option>'}).join('')+'</select>'}
 var m=document.createElement('div');m.className='modal active';m.id='_dxf';
 m.innerHTML='<div class="modal-inner"><div class="modal-h"><h3>'+th+'</h3><div style="display:flex;gap:4px;align-items:center"><button class="vctrl" onclick="downloadDXF()" title="Download DXF">⬇</button><button class="modal-close" onclick="closeM(\'_dxf\')">X</button></div></div><div class="modal-body" id="_dxfb"><div class="modal-loading" id="_dxfl">Loading DXF...</div></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_dxf')});
 drawDXF(dxfV[0].p)
}
function parseDXFEntity(lines,i){
 var d={};i+=2;
 while(i<lines.length-1){
  var c2=parseInt(lines[i].trim()),v2=lines[i+1]?lines[i+1].trim():'';
  if(isNaN(c2)||c2===0)break;
  d[c2]=v2;i+=2;
 }
 return {data:d,next:i};
}
async function drawDXF(p){
 p=EP(p);
 var vl=document.getElementById('_dxfl'),vb=document.getElementById('_dxfb');
 try{
  var r=await fetch(p),tx=await r.text();vl.style.display='none';
  var cv=document.createElement('canvas'),ctx=cv.getContext('2d');
  cv.width=vb.clientWidth;cv.height=vb.clientHeight;vb.appendChild(cv);
  ctx.fillStyle='#191a1b';ctx.fillRect(0,0,cv.width,cv.height);
  var lines=tx.split(/\r?\n/),i=0,dc=[],minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  while(i<lines.length&&lines[i].trim().toUpperCase()!=='ENTITIES')i++;i++;
  while(i<lines.length-1){
   var ln=lines[i].trim();
   if(ln.toUpperCase()==='ENDSEC')break;
   if(ln==='0'){
    var etype=(lines[i+1]||'').trim(),res=parseDXFEntity(lines,i),d=res.data;i=res.next;
    if(etype==='LINE'){var x1=parseFloat(d[10]),y1=parseFloat(d[20]),x2=parseFloat(d[11]),y2=parseFloat(d[21]);if(!isNaN(x1)){dc.push({x1:x1,y1:y1,x2:x2,y2:y2});minX=Math.min(minX,x1,x2);maxX=Math.max(maxX,x1,x2);minY=Math.min(minY,y1,y2);maxY=Math.max(maxY,y1,y2)}}
    else if(etype==='CIRCLE'){var cx=parseFloat(d[10]),cy=parseFloat(d[20]),cr=parseFloat(d[40]);if(!isNaN(cx)){dc.push({cx:cx,cy:cy,r:cr});minX=Math.min(minX,cx-cr);maxX=Math.max(maxX,cx+cr);minY=Math.min(minY,cy-cr);maxY=Math.max(maxY,cy+cr)}}
    else if(etype==='POLYLINE'){var verts=[];while(i<lines.length-1){if(lines[i].trim()==='0'){var vt=(lines[i+1]||'').trim();if(vt==='VERTEX'){var vr=parseDXFEntity(lines,i),vd=vr.data;i=vr.next;var vx=parseFloat(vd[10]),vy=parseFloat(vd[20]);if(!isNaN(vx))verts.push({x:vx,y:vy})}else if(vt==='SEQEND'){i+=2;break}else{i+=2}}else{i++}}for(var vi=1;vi<verts.length;vi++){dc.push({x1:verts[vi-1].x,y1:verts[vi-1].y,x2:verts[vi].x,y2:verts[vi].y});minX=Math.min(minX,verts[vi].x);maxX=Math.max(maxX,verts[vi].x);minY=Math.min(minY,verts[vi].y);maxY=Math.max(maxY,verts[vi].y)}}
    else if(etype==='SPLINE'){var ctrl=[],nk=parseInt(d[74])||0;for(var si=0;si<nk;si++){var sx=parseFloat(d[10+si]),sy=parseFloat(d[20+si]);if(!isNaN(sx)){ctrl.push({x:sx,y:sy});minX=Math.min(minX,sx);maxX=Math.max(maxX,sx);minY=Math.min(minY,sy);maxY=Math.max(maxY,sy)}}for(var si=1;si<ctrl.length;si++)dc.push({x1:ctrl[si-1].x,y1:ctrl[si-1].y,x2:ctrl[si].x,y2:ctrl[si].y})}
   }else{i++}
  }
  if(dc.length>0){
   var pd=50,w=cv.width-pd*2,h=cv.height-pd*2,sc=Math.min(w/((maxX-minX)||1),h/((maxY-minY)||1));
   var ox=pd+(w-(maxX-minX)*sc)/2,oy=pd+(h-(maxY-minY)*sc)/2;
   ctx.strokeStyle='#7170ff';ctx.lineWidth=1;
   for(var k=0;k<dc.length;k++){ctx.beginPath();var c=dc[k];if(c.x1!==undefined){ctx.moveTo(ox+(c.x1-minX)*sc,cv.height-(oy+(c.y1-minY)*sc));ctx.lineTo(ox+(c.x2-minX)*sc,cv.height-(oy+(c.y2-minY)*sc))}else{ctx.arc(ox+(c.cx-minX)*sc,cv.height-(oy+(c.cy-minY)*sc),c.r*sc,0,Math.PI*2)}ctx.stroke()}
   ctx.fillStyle='#62666d';ctx.font='11px Inter,sans-serif';ctx.fillText(dc.length+' entities',12,cv.height-12)
  }else{ctx.fillStyle='#8a8f98';ctx.font='13px Inter,sans-serif';ctx.textAlign='center';ctx.fillText((tx.length/1024).toFixed(0)+'KB - 0 entities',cv.width/2,cv.height/2)}
 }catch(e){vl.innerHTML='<p style="color:var(--red)">DXF failed</p><p style="font-size:11px;color:var(--t4)">'+e.message+'</p>'}
}
function dxfSw(i){var vl=document.getElementById('_dxfl');vl.style.display='flex';document.getElementById('_dxfb').querySelectorAll('canvas').forEach(function(c){c.remove()});drawDXF(dxfV[i].p)}
function downloadDXF(){var a=document.createElement('a');a.href=EP(dxfV[0].p);a.download=dxfV[0].p.split('/').pop();document.body.appendChild(a);a.click();a.remove()}
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){closeM('_3d');closeM('_dxf');return}
 // Arrow keys switch versions when viewer is open
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
  var s=document.getElementById('vs_');
  if(s){var idx=parseInt(s.value)+(e.key==='ArrowRight'?1:-1);if(idx>=0&&idx<cv.length){s.value=idx;swV(idx)}}
  var d=document.getElementById('dxf_vs');
  if(d){var di=parseInt(d.value)+(e.key==='ArrowRight'?1:-1);if(di>=0&&di<dxfV.length){d.value=di;dxfSw(di)}}
 }
});
