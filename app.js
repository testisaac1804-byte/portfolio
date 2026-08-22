var ADMIN_PASS='Isaac1804',editMode=false;
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
function exportData(){var a=document.createElement('a');a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(D,null,2));a.download='isaac-projects.json';document.body.appendChild(a);a.click();a.remove()}

function F(c){
 var b=document.querySelectorAll(".fbtn");for(var i=0;i<b.length;i++)b[i].classList.remove("active");
 var a=document.querySelector(".fbtn[onclick=\"F('"+c+"')\"]");if(a)a.classList.add("active");
 var s=document.querySelectorAll(".cat-section");for(var j=0;j<s.length;j++)s[j].classList.toggle("hidden",c!=="all"&&s[j].dataset.cat!==c);
}
function toggleV(btn){btn.classList.toggle("open");btn.nextElementSibling.classList.toggle("expanded")}
function W(u){window.open(u,"_blank")}
function copyLink(cat,idx,btn){
 var qs='?p='+cat+'-'+idx;
 var url=location.origin+location.pathname+qs;
 try{navigator.clipboard.writeText(url)}catch(e){}
 var old=btn.textContent;btn.textContent='✓';setTimeout(function(){btn.textContent=old},1500);
}
function randomProj(){
 var all=[];for(var k in D)D[k].forEach(function(p,i){all.push({cat:k,idx:i})});
 var pick=all[Math.floor(Math.random()*all.length)];
 var sec=document.getElementById(pick.cat);
 if(sec){F({sw:'software',hw:'hardware',f3d:'fusion',des:'design'}[pick.cat]);
  var card=sec.querySelector('.card[data-idx="'+pick.idx+'"]');
  if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.style.boxShadow='0 0 0 2px var(--ab),0 8px 24px rgba(99,102,241,0.3)';setTimeout(function(){card.style.boxShadow=''},2500)}}
}

var D={sw:[

{t:"macOS Simulator",s:"done",pt:"prompts/macos-simulator-prompt.md",d:"Full interactive macOS desktop simulator with menubar, dock, windows, and dark/light theme.",a:[{c:"ac",l:"Live Demo",o:7,u:"./projects/mac-simulator.html"}],g:[{c:"ac",l:"HTML"},{l:"CSS"},{l:"JS"},{l:"Simulator"}],v:[{n:"V1",i:"Menubar, dock, windows, themes."}]},
{t:"DT Site Copy",s:"done",pt:"prompts/dt-site-copy-prompt.md",d:"Full 74-page copy of the DT Google Site, rebranded to Isaac.",a:[{c:"ac",l:"Live Site",o:7,u:"https://testisaac1804-byte.github.io/isaac-dt/"}],g:[{c:"ac",l:"Web"},{l:"Google Sites"},{l:"Static"},{l:"Python"}],v:[{n:"V1",i:"Finishing page copy."},{n:"V2",i:"Full site: 49 nav pages."},{n:"V3",i:"74 pages incl. hidden IGCSE coursework section."}]},
{t:"MacAdBlock",s:"done",pt:"prompts/macadblock-prompt.md",d:"macOS DNS ad-blocker daemon on :8053.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/macadblock.html"}],g:[{c:"ac",l:"macOS"},{l:"DNS"},{l:"Python"},{l:"launchd"}],v:[{n:"V1",i:"Basic hosts file."},{n:"V2",i:"Daemon mode: launchd, auto-start."},{n:"V3",L:1,i:"System-wide: blocks ads in EVERY app."}]},
{t:"ESP32-C3 AdBlock",s:"done",pt:"prompts/esp32-c3-adblock-prompt.md",d:"Network DNS sinkhole on ESP32. Blocks ads for all WiFi devices.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/esp32-c3-adblock.html"}],g:[{c:"ac",l:"ESP32"},{l:"C"},{l:"DNS"},{l:"IoT"}],v:[{n:"Note",i:"C3 incompatible with RT-AC58U WPA2. Used WROOM-32D."}]},
{t:"FrostSolve",s:"done",pt:"prompts/frostsolve-prompt.md",d:"macOS desktop app with manifest structure and full .app bundle.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/frostsolve.html"}],g:[{c:"ac",l:"macOS"},{l:"App"},{l:"JavaScript"}],v:[{n:"V1",i:"Standalone script."},{n:"V2",L:1,i:"App bundle: Finder/Dock launchable."}]},
{t:"IsaacNetPkg",s:"done",pt:"prompts/isaacnetpkg-prompt.md",d:"Password-protected .pkg. AppleScript uninstall.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacnetpkg.html"}],g:[{c:"ac",l:"macOS"},{l:"pkgbuild"},{l:"AppleScript"},{l:"launchd"}],v:[{n:"V1",i:"AppleScript in bash heredocs. Broke."},{n:"V2",L:1,i:"Fixed: AppleScript as real file."}]},
{t:"IsaacSecureMessenger",s:"done",pt:"prompts/isaacsecuremessenger-prompt.md",d:"E2E encrypted messaging - X3DH + AES-256-GCM.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacsecuremessenger.html"}],g:[{c:"ac",l:"macOS"},{l:"Encryption"},{l:"AES-256"},{l:"PyObjC"}],v:[{n:"V1",i:"Browser chat. Manual key exchange."},{n:"V2",i:"Native app: QR code pairing."},{n:"V3",L:1,i:"X3DH protocol. Production grade."}]},
{t:"Multiplayer Game Server",s:"done",pt:"prompts/multiplayer-game-server-prompt.md",d:"WebSocket multiplayer backend - multi-room, sync, spectator.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/game-server.html"}],g:[{c:"ac",l:"WebSocket"},{l:"Python"},{l:"FastAPI"},{l:"Real-time"}],v:[{n:"V1",i:"Single room."},{n:"V2",i:"Multi-room with room codes."},{n:"V3",L:1,i:"Spectator mode + reconnect."}]},
{t:"HKPCBypass",s:"done",pt:"prompts/hkpcbypass-prompt.md",d:"Multi-layer school bypass. DoH+SOCKS5+HTTP CONNECT.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/hkc-bypass.html"}],g:[{c:"ac",l:"Networking"},{l:"Proxy"},{l:"DoH"},{l:"Python"}],v:[{n:"V1",i:"Single proxy."},{n:"V2",i:"DoH added: encrypted DNS."},{n:"V3",L:1,i:"Multi-layer fallback."}]},
{t:"WiFi Chat",s:"done",pt:"prompts/wifi-chat-prompt.md",d:"LAN offline chat - no internet needed. WebSocket + DXF sharing.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/wifi-chat.html"}],g:[{c:"ac",l:"WebSocket"},{l:"Flask"},{l:"LAN"},{l:"Offline"}],v:[{n:"V1",i:"Basic text."},{n:"V2",i:"DXF/SVG uploads."},{n:"V3",L:1,i:"Offline-first. Cross-device."}]},
{t:"WiFi Monitor",s:"done",pt:"prompts/wifi-monitor-prompt.md",d:"ESP32 WiFi scanner - signal graphs, device tracking.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/wifi-monitor.html"}],g:[{c:"ac",l:"ESP32"},{l:"WiFi"},{l:"Scanner"},{l:"C"}],v:[{n:"V1",i:"Serial only."},{n:"V2",i:"MAC tracking."},{n:"V3",L:1,i:"Full dashboard."}]},
{t:"326929.pw Mirror",s:"done",pt:"prompts/326929-pw-mirror-prompt.md",d:"Full phishing site mirror - evidence for takedowns.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/scam-mirror.html"}],g:[{c:"gr",l:"Security"},{l:"Phishing"},{l:"Evidence"}],v:[{n:"V1",i:"Manual save."},{n:"V2",L:1,i:"wget mirror: all assets."}]},
{t:"Scam Mirror",s:"done",pt:"prompts/scam-mirror-prompt.md",d:"Automated phishing cloner - registrar takedown reports.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/scam-mirror.html"}],g:[{c:"gr",l:"Security"},{l:"Scraping"},{l:"Python"}],v:[{n:"V1",i:"Manual per-site."},{n:"V2",L:1,i:"Automated: one command."}]},
{t:"IsaacKing Browser",s:"done",pt:"prompts/isaacking-browser-prompt.md",d:"Whitelist-only browser. PyObjC + WKWebView .app.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacking-browser.html"}],g:[{c:"ac",l:"macOS"},{l:"WKWebView"},{l:"PyObjC"},{l:"Browser"}],v:[{n:"V1",i:"White screen bug."},{n:"V2",L:1,i:"Fixed: HTML string direct load."}]},
{t:"IsaacBrowser",s:"done",pt:"prompts/isaacbrowser-prompt.md",d:"Variant browser - category-based whitelist.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacbrowser.html"}],g:[{c:"ac",l:"macOS"},{l:"Browser"},{l:"PyObjC"}],v:[{n:"V1",i:"IsaacKing fork."},{n:"V2",L:1,i:"Independent codebase."}]},
{t:"IsaacNet",s:"done",pt:"prompts/isaacnet-prompt.md",d:"Layered bypass. TLS-wrapped, multi-tunnel auto-fallback.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacnet.html"}],g:[{c:"ac",l:"Networking"},{l:"Proxy"},{l:"Python"},{l:"Bypass"}],v:[{n:"V1",i:"Single TCP tunnel."},{n:"V2",i:"TLS wrapping."},{n:"V3",L:1,i:"Layered: CONNECT+SOCKS5+WS."}]},
{t:"Manufacturing Explorer",s:"done",pt:"prompts/manufacturing-explorer-prompt.md",d:"200-method 3D manufacturing explorer. Three.js + Flask.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/manufacturing-explorer.html"}],g:[{c:"ac",l:"Three.js"},{l:"Flask"},{l:"3D"},{l:"G-code"}],v:[{n:"V1",i:"112 methods."},{n:"V2",i:"Collapsible panels."},{n:"V3",L:1,i:"200 methods."}]},
{t:"IsaacCombo",s:"done",pt:"prompts/isaaccombo-prompt.md",d:"Multi-app .pkg - user selects apps.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaaccombo.html"}],g:[{c:"ac",l:"macOS"},{l:"pkgbuild"},{l:"Installer"}],v:[{n:"V1",i:"All-or-nothing."},{n:"V2",L:1,i:"Fixed: choice dialog."}]},
{t:"Macro Typer",s:"done",pt:"prompts/macro-typer-prompt.md",d:"Types text char-by-char - bypasses Google Docs history.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/macro-typer.html"}],g:[{c:"ac",l:"Python"},{l:"pyautogui"},{l:"Tkinter"},{l:"macOS"}],v:[{n:"V1-4",i:"Invisible app."},{n:"V5",L:1,i:"Fixed: launch notification."}]},
{t:"Godzilla AI Chat",s:"done",pt:"prompts/godzilla-ai-chat-prompt.md",d:"Godzilla-themed AI roleplay. TUI + GUI. Native .app.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/godzilla-ai-chat.html"}],g:[{c:"ac",l:"AI"},{l:"macOS"},{l:"Chat"},{l:"TUI"}],v:[{n:"V1",i:"Terminal TUI."},{n:"V2",i:"GUI with history."},{n:"V3",L:1,i:"Native .app. Themed UI."}]},
{t:"Isaac AI",s:"done",pt:"prompts/isaac-ai-prompt.md",d:"AI chat assistant - native .app. Multi-personality, memory.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaac-ai.html"}],g:[{c:"ac",l:"AI"},{l:"macOS"},{l:"Chat"},{l:"App"}],v:[{n:"V1",i:"Single-turn."},{n:"V2",i:"Multi-turn with context."},{n:"V3",L:1,i:"Native .app WKWebView."}]},
{t:"IsaacSuite",s:"wip",pt:"prompts/isaacsuite-prompt.md",d:"Unified launcher - one dock icon for all Isaac apps.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacsuite.html"}],g:[{c:"ac",l:"macOS"},{l:"Launcher"},{l:"PyObjC"}],v:[{n:"V1",i:"Planned: menubar widget."}]},
{t:"IsaacAppLaunchers",s:"done",pt:"prompts/isaacapplaunchers-prompt.md",d:"Quick-launch scripts for the Isaac ecosystem.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacapplaunchers.html"}],g:[{c:"ac",l:"macOS"},{l:"Scripting"},{l:"Automation"}],v:[{n:"V1",i:"Individual scripts."},{n:"V2",L:1,i:"Unified launcher."}]},
{t:"IsaacOS",s:"draft",pt:"prompts/isaacos-prompt.md",d:"Custom OS concept - bootable with all Isaac tools.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacos.html"}],g:[{l:"OS"},{l:"Concept"},{l:"System Design"}],v:[{n:"V1",i:"Concept phase."}]},
{t:"IsaacSystem-All",s:"draft",pt:"prompts/isaacsystem-all-prompt.md",d:"Monolithic tool - all Isaac apps in one binary.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacsystem-all.html"}],g:[{l:"System"},{l:"Unified"},{l:"Meta-project"}],v:[{n:"V1",i:"Concept phase."}]},
{t:"Laser Cutting Simulator",s:"done",pt:"prompts/laser-cutting-simulator-prompt.md",d:"Browser laser simulator - 9+ versions. G-code export.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/laser-cutting-simulator.html"}],g:[{c:"ac",l:"React"},{l:"DXF"},{l:"Simulation"},{l:"Web App"}],v:[{n:"V1-3",i:"Basic canvas."},{n:"V4-6",i:"3D isometric."},{n:"V7-9",L:1,i:"True 3D orbital, G-code."}]},
{t:"Library Kiosk",s:"done",pt:"prompts/library-kiosk-prompt.md",d:"Locked-down public-library kiosk sim — ticket/HKID auth, guest browsers, session timer, data wipe on logout.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/library-kiosk.html"}],g:[{c:"ac",l:"Kiosk"},{l:"HTML"},{l:"JS"},{l:"Auth"}]},
{t:"IGCSE Tutor",s:"done",pt:"prompts/igcse-tutor-prompt.md",d:"Interactive personal tutor for IGCSE revision — quizzes and guided explanations.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/igcse-tutor.html"}],g:[{c:"ac",l:"Education"},{l:"HTML"},{l:"JS"},{l:"IGCSE"}]},
{t:"QuickCAM Pro",s:"done",pt:"prompts/quickcam-pro-prompt.md",d:"Advanced milling CAM simulation — toolpaths, workholding, G-code preview.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/quickcam-pro.html"}],g:[{c:"ac",l:"CAM"},{l:"CNC"},{l:"Simulation"},{l:"HTML"}]},
{t:"VR CNC Milling",s:"done",pt:"prompts/vr-cnc-milling-prompt.md",d:"Denford-style VR CNC milling simulation for DT practice.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/vr-cnc-milling.html"}],g:[{c:"ac",l:"CNC"},{l:"VR"},{l:"Simulation"},{l:"DT"}]},
{t:"ISLE Dashboard",s:"done",pt:"prompts/isle-dashboard-prompt.md",d:"Personal dashboard (ISLE) — widgets, links and shortcuts in one page.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isle-dashboard.html"}],g:[{c:"ac",l:"Dashboard"},{l:"HTML"},{l:"Widgets"}]},
{t:"Gateway Dashboard",s:"done",pt:"prompts/gateway-dashboard-prompt.md",d:"Gateway start-page dashboard with quick links and tools.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/gateway-dashboard.html"}],g:[{c:"ac",l:"Dashboard"},{l:"HTML"},{l:"Start page"}]},
{t:"Cemini Workspace",s:"done",pt:"prompts/cemeni-prompt.md",d:"Cemini workspace web app — notes and task interface.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/cemini.html"}],g:[{c:"ac",l:"Web App"},{l:"HTML"},{l:"Workspace"}]},
{t:"326929.pw Scam Flow Replica",s:"done",pt:"prompts/scam-flow-replica-prompt.md",d:"Step-by-step replica of the 326929.pw scam flow (Chinese) for evidence and education.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/scam-flow-replica.html"}],g:[{c:"gr",l:"Security"},{l:"Phishing"},{l:"Evidence"}]},
{t:"SF Express Scam Evidence Bundle",s:"done",pt:"prompts/scam-evidence-bundle-prompt.md",d:"Complete evidence bundle for an SF Express scam — timeline, screenshots, contacts.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/scam-evidence-bundle.html"}],g:[{c:"gr",l:"Security"},{l:"Scam"},{l:"Evidence"}]},
{t:"CC Chat Admin",s:"done",pt:"prompts/cc-chat-admin-prompt.md",d:"Scam chat admin panel reconstruction for takedown research.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/cc-chat-admin.html"}],g:[{c:"gr",l:"Security"},{l:"Scam"},{l:"Research"}]},
{t:"CMail",s:"wip",pt:"prompts/cmail-prompt.md",d:"Full-stack email client (Node.js + Google OAuth) — server + web UI.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/cmail.html"}],g:[{c:"ac",l:"Full-stack"},{l:"Node.js"},{l:"OAuth"},{l:"Email"}]},
{t:"OS Kernel (from scratch)",s:"draft",pt:"prompts/os-kernel-prompt.md",d:"x86 OS kernel from scratch — bootloader, kernel, lib.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/os-kernel.html"}],g:[{c:"gr",l:"OS"},{l:"x86"},{l:"Assembly"},{l:"C"}]},
{t:"CNC Drill Box",s:"draft",pt:"prompts/cnc-drill-box-prompt.md",d:"CNC drill bit storage box (v1–v3). By Man Cheuk (Ronin).",how:"Designed by Man Cheuk (Ronin).",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/cnc-drill-box.html"}],g:[{c:"gr",l:"CNC"},{l:"Storage"},{l:"Man Cheuk"}]},
{t:"F1 Canvas",s:"draft",pt:"prompts/f1-canvas-prompt.md",d:"F1 canvas experiment.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/f1-canvas.html"}],g:[{c:"gr",l:"F1"},{l:"Canvas"},{l:"Draft"}]},
{t:"IsaacNet Browser",s:"done",pt:"prompts/isaacnet-browser-prompt.md",d:"Browser frontend for the IsaacNet proxy.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/isaacnet-browser.html"}],g:[{c:"gr",l:"Networking"},{l:"Browser"},{l:"Proxy"}]},
{t:"School Shield",s:"done",pt:"prompts/school-shield-prompt.md",d:"Network shield — toggles school-filter DNS blocking.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/school-shield.html"}],g:[{c:"gr",l:"Networking"},{l:"DNS"},{l:"Bypass"}]},
{t:"Red Star Browser",s:"done",pt:"prompts/red-star-browser-prompt.md",d:"Red Star browser app (macOS).",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/red-star-browser.html"}],g:[{c:"gr",l:"macOS"},{l:"Browser"},{l:"App"}]},
{t:"Y10 IGCSE Launcher",s:"done",pt:"prompts/igcse-launcher-prompt.md",d:"Launcher that opens the IGCSE study guide.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/igcse-launcher.html"}],g:[{c:"gr",l:"macOS"},{l:"Launcher"},{l:"IGCSE"}]},
{t:"Y10 IGCSE OTP Generator",s:"done",pt:"prompts/igcse-otp-prompt.md",d:"One-time-password generator for IGCSE access.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/igcse-otp.html"}],g:[{c:"gr",l:"Security"},{l:"OTP"},{l:"IGCSE"}]},
{t:"WiFi Toggle",s:"done",pt:"prompts/wifi-toggle-prompt.md",d:"One-click WiFi on/off toggle.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/wifi-toggle.html"}],g:[{c:"gr",l:"macOS"},{l:"WiFi"},{l:"Automation"}]}
],hw:[
{t:"Auto-Clamping Vise",s:"wip",pt:"prompts/auto-clamping-vise-prompt.md",d:"Arduino Nano + NEMA 17 + ACS712 sensor. 3D printed. ~$32.",a:[{l:"Open Folder",o:1,u:"./projects/auto-vise/"}],g:[{c:"ac",l:"Arduino"},{l:"Stepper"},{l:"3D Printed"},{l:"Current Sense"}],v:[{n:"V1",i:"Concept."},{n:"V2",i:"ACS712 current detection."},{n:"V3",L:1,i:"Calibrating."}]},
{t:"Clip-On Thermometer",s:"done",pt:"prompts/clip-thermometer-prompt.md",d:"ESP32-C3 hot wire cutter temp sensor. MAX6675 K-type probe + OLED + WiFi dashboard.",a:[{l:"Open Folder",o:1,u:"./projects/clip-thermometer/"}],g:[{c:"ac",l:"ESP32-C3"},{l:"Sensor"},{l:"PlatformIO"},{l:"MAX6675"},{l:"OLED"},{l:"WiFi"}],v:[{n:"V1",i:"Breadboard + OLED."},{n:"V2",i:"WiFi AP dashboard."},{n:"V3",L:1,i:"°C/°F, graph, buzzer, targets."}]},
{t:"Optical Center Punch",s:"done",pt:"prompts/optical-center-punch-prompt.md",d:"DIY $10 punch vs $30-60 commercial. 3D printed + lens.",g:[{c:"ac",l:"3D Printed"},{l:"Precision"},{l:"Optical"},{l:"Tool"}],v:[{n:"V1",i:"Research phase."},{n:"V2",L:1,i:"Built with steel tip."}]},
{t:"Micro RC Car",s:"wip",pt:"prompts/micro-rc-car-prompt.md",d:"1/64-1/32 scale high-speed. No-solder Dupont build.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"RC"},{l:"Micro"},{l:"No-solder"},{l:"Speed"}],v:[{n:"V1",i:"Design phase."}]},
{t:"BLE Scanner",s:"wip",pt:"prompts/ble-scanner-prompt.md",d:"ESP32 BLE device scanner - detect, log, dashboard.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"ESP32"},{l:"BLE"},{l:"Scanner"},{l:"IoT"}],v:[{n:"V1",i:"Research phase."}]}
],f3d:[

{t:"Robot Arm (3D Print)",s:"done",d:"6-axis robot arm STL models — modern body, legs, arms, and head. 3D printed hobby project.",a:[{c:"ac",l:"View 3D",o:1,u:"./hobby/prints/robot-arm/modern-body.stl"},{c:"ac",l:"📂 Files",o:2,u:"./hobby/prints/robot-arm/"}],g:[{c:"ac",l:"3D Print"},{l:"STL"},{l:"Robot"}],v:[{n:"V1",i:"5 parts: body, arms, legs, head, limb."}]},
{t:"Doraemon 3D Prints",s:"done",d:"Doraemon (哆啦A梦) 3D printable STL models — 2 multi-part assemblies.",a:[{c:"ac",l:"View 3D",o:1,u:"./hobby/prints/doraemon/obj_1_组合体.stl"},{c:"ac",l:"📂 Files",o:2,u:"./hobby/prints/doraemon/"}],g:[{c:"ac",l:"3D Print"},{l:"STL"},{l:"Hobby"}],v:[{n:"V1",i:"2 Doraemon assemblies."}]},
{t:"F1 Model Block Jig",s:"done",pt:"prompts/f1-model-block-jig-prompt.md",d:"Precision CNC jig. 6 versions, 15+ STL components.",g:[{c:"ac",l:"F1 In Schools"},{l:"CNC"},{l:"Jig"},{l:"Precision"}],a:[{c:"p3d",l:"View 3D (18 combos)",o:3,vs:[
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
{t:"F1 Car Net",s:"done",pt:"prompts/f1-car-net-prompt.md",d:"46 DXF versions + 9 measured + 7 re-measured.",g:[{c:"ac",l:"F1 In Schools"},{l:"Laser Cut"},{l:"DXF"},{l:"46 Versions"}],a:[{c:"p2d",l:"View DXF (8 vers)",o:4,vs:[
{l:"V1",p:"./Documents/f1/f1 folding/bought v1.dxf"},{l:"V5",p:"./Documents/f1/f1 folding/car net v5.dxf"},
{l:"V10",p:"./Documents/f1/f1 folding/car net v10.dxf"},{l:"V20",p:"./Documents/f1/f1 folding/car net v20.dxf"},
{l:"V30",p:"./Documents/f1/f1 folding/car net v30.dxf"},{l:"V40",p:"./Documents/f1/f1 folding/car net v40.dxf"},
{l:"V45",p:"./Documents/f1/f1 folding/car net v45 final.dxf"},{l:"V46 Final",p:"./Documents/f1/f1 folding/very good (final).dxf"}
]}],v:[{n:"V1-10",i:"Early shapes."},{n:"V11-25",i:"4mm variants."},{n:"V26-38",i:"Re-measured: correct holes."},{n:"V39-46",L:1,i:"Final: V45 final, V46 tweaks."}]},
{t:"F1 Engine Net",s:"done",pt:"prompts/f1-engine-net-prompt.md",d:"Laser-cut engine housing net - optimised.",g:[{c:"ac",l:"F1 In Schools"},{l:"Engine"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/f1/f1 folding/f1 engine net optimised.dxf"}],v:[{n:"V1",i:"Single axle hole."},{n:"V2",L:1,i:"Optimised cutouts."}]},
{t:"F1 Car Body Net",s:"done",pt:"prompts/f1-car-body-net-prompt.md",d:"Laser-cut car body shell net - axle holes corrected.",g:[{c:"ac",l:"F1 In Schools"},{l:"Body"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/f1/f1 folding/car body axle holes correct.dxf"}],v:[{n:"V1",i:"Initial body shell."},{n:"V2",L:1,i:"Axle holes corrected."}]},
{t:"Halo 2025 + SR Logo",s:"done",pt:"prompts/halo-2025-sr-logo-prompt.md",d:"4-stage: helmet - halo - spigot - drilling jig.",g:[{c:"ac",l:"F1 In Schools"},{l:"Safety"},{l:"Halo"},{l:"3D Print"}],a:[{c:"p3d",l:"View 3D (4 vers)",o:3,vs:[
{l:"V1 Helmet",p:"./Documents/f1/f1 print/2025_helmet__with_6mm_dia_spigot_final.stl"},
{l:"V2 Halo",p:"./Documents/f1/f1 print/Self Modified/halo_v2.stl"},
{l:"V3 Spigot",p:"./Documents/f1/f1 print/halo_2025_with_6mm_hole_and_sr_logo.stl"},
{l:"V4 Jig",p:"./Documents/f1/f1 print/final_entry_class_halo_spigot_drilling_jig.stl"}
]}],v:[{n:"V1",i:"Helmet shape."},{n:"V2",i:"Halo geometry."},{n:"V3",i:"Spigot hole."},{n:"V4",L:1,i:"Drilling jig."}]},
{t:"F1 Self-Modified Parts",s:"done",pt:"prompts/f1-self-modified-parts-prompt.md",d:"Axle bushes V2-V4, bearing holders, wings, tether.",g:[{c:"ac",l:"F1 In Schools"},{l:"Modified"},{l:"STL"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/f1/f1 print/Self Modified/axle bush v4.stl"}],v:[{n:"V2",i:"Basic bush."},{n:"V3",i:"Refined."},{n:"V4",L:1,i:"Final: chamfered."}]},
{t:"F1 Car Chassis",s:"done",pt:"prompts/f1-car-chassis-prompt.md",d:"Complete F1 chassis - aero body, competition spec.",g:[{c:"ac",l:"F1 In Schools"},{l:"Chassis"},{l:"Aero"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/f1/f1 print/new f1 car model.stl"}]},
{t:"VEX IQ Box Inserts",s:"done",pt:"prompts/vex-iq-box-inserts-prompt.md",d:"34 DXF iterations to perfect. Laser-cut acrylic organizer.",g:[{c:"ac",l:"VEX"},{l:"Organization"},{l:"34 Versions"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/VEX IQ BOX INSERTS/finished.dxf"}],v:[{n:"V1",i:"Full size - didnt fit."},{n:"V2-10",i:"40%-30% scaling."},{n:"V11-20",i:"Measured cad 2.0-4.0."},{n:"V21-30",i:"Perfect 2.0 fixed."},{n:"V31-34",L:1,i:"Final!!!! Production."}]},
{t:"BravoProdigy CNC Bit Case",s:"done",pt:"prompts/bravoprodigy-cnc-bit-case-prompt.md",d:"Parametric CNC bit storage. Calibrated.",g:[{c:"ac",l:"CNC"},{l:"Storage"},{l:"Parametric"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/bravoprodigy cnc bit case.stl"}],v:[{n:"Test",i:"Tight/loose."},{n:"Final",L:1,i:"Calibrated."}]},
{t:"Drill Bit Box",s:"done",pt:"prompts/drill-bit-box-prompt.md",d:"Friction-fit bit storage. Snap lid. Labeled.",g:[{l:"Storage"},{l:"Organization"},{l:"Tools"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/bit-storage-box-base.stl"}],v:[{n:"V1",i:"Bits fell out."},{n:"Final",L:1,i:"Friction-fit + labels."}]},
{t:"CNC Mill Tool Head Box",s:"done",pt:"prompts/cnc-mill-tool-head-box-prompt.md",d:"Single to dual slot. Improved latch.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Downloads/cnc drill bit case.stl"}],g:[{c:"ac",l:"CNC"},{l:"Storage"}],v:[{n:"V1",i:"Single slot."},{n:"V2",L:1,i:"Dual slot."}]},
{t:"Hex Drill Adapter",s:"done",pt:"prompts/hex-drill-adapter-prompt.md",d:"Magnetic quick-change. V2-V4 magnet + concentricity.",g:[{c:"ac",l:"Tools"},{l:"Magnetic"},{l:"Adapter"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/hex adapter v4.stl"}],v:[{n:"V2",i:"Weak magnet."},{n:"V3",i:"3mm hex."},{n:"V4",L:1,i:"Final: zero wobble."}]},
{t:"80 Vise Jaw",s:"done",pt:"prompts/80-vise-jaw-prompt.md",d:"Magnetic jaw - test + final. Press-fit magnet.",g:[{c:"ac",l:"Vise"},{l:"Magnetic"},{l:"Workshop"}],a:[{c:"p3d",l:"View 3D (2 vers)",o:3,vs:[{l:"V1 Test",p:"./Documents/common stl/80 vise jaw good.stl"},{l:"V2 Final",p:"./Documents/common stl/80 vise jaw good.stl"}]}],v:[{n:"V1",i:"Loose magnet."},{n:"V2",L:1,i:"Press-fit, 2mm thinner."}]},
{t:"USB Dust Cover",s:"done",pt:"prompts/usb-dust-cover-prompt.md",d:"Protective USB cover. V2 tighter fit + grip.",g:[{l:"USB"},{l:"Protection"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/usb dust cover v2.stl"}],v:[{n:"V1",i:"Too loose."},{n:"V2",L:1,i:"Tighter + grip ridge."}]},
{t:"Type-C to USB Adapter",s:"done",pt:"prompts/type-c-to-usb-adapter-prompt.md",d:"Custom adapter housing. V2 snap-fit.",g:[{c:"ac",l:"USB"},{l:"Adapter"},{l:"Type-C"}],a:[{c:"p3d",l:"View 3D (2 vers)",o:3,vs:[{l:"V1",p:"./Documents/common stl/type c to usb adapter.stl"},{l:"V2",p:"./Documents/common stl/v2 type c to usb adapter.stl"}]}],v:[{n:"V1",i:"Too tight."},{n:"V2",L:1,i:"+0.3mm, snap-fit."}]},
{t:"1205 Bearing Plug",s:"done",pt:"prompts/1205-bearing-plug-prompt.md",d:"Standard and tight-fit variants.",g:[{l:"Bearings"},{l:"Plug"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/tight 1205 plug.stl"}]},
{t:"Inner Hex Screws",s:"done",pt:"prompts/inner-hex-screws-prompt.md",d:"M6 and M8 inner hex screw designs.",g:[{l:"Screws"},{l:"Hex"},{l:"Fasteners"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/inner hex screw.stl"}]},
{t:"Big Bowl Clicker",s:"done",pt:"prompts/big-bowl-clicker-prompt.md",d:"Tactile mechanism. V3 sharper click.",g:[{l:"Mechanism"},{l:"Clicker"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/big bowl clicker v3 base.stl"}],v:[{n:"V1",i:"Not crisp."},{n:"V3",L:1,i:"Sharper click."}]},
{t:"Rocket Flour Sifter",s:"done",pt:"prompts/rocket-flour-sifter-prompt.md",d:"5 iterations. Recovered after crash.",a:[{l:"Open Folder",o:1,u:"./Downloads/"}],g:[{c:"ac",l:"Kitchen"},{l:"Mechanism"},{l:"Rocket"}],v:[{n:"V1",i:"Mesh clogged."},{n:"V6",L:1,i:"Recovered: 5 refinements."}]},
{t:"Yin Mechanism",s:"done",pt:"prompts/yin-mechanism-prompt.md",d:"Compliant yin-yang - 4.9 MB. Mechanical art.",g:[{c:"ac",l:"Compliant"},{l:"Mechanism"},{l:"Art"}],a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/common stl/yin.stl"}]},
{t:"Knurl Bearing",s:"done",pt:"prompts/knurl-bearing-prompt.md",d:"Heaviest at 16.7 MB. Knurled raceways.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Downloads/knurl bearing in out.stl"}],g:[{c:"ac",l:"Bearings"},{l:"Knurling"},{l:"Complex"}]},
{t:"VEX IQ Acrylic Box",s:"done",pt:"prompts/vex-iq-acrylic-box-prompt.md",d:"V1-V3: vents, cutouts, standoffs.",a:[{l:"Open Folder",o:1,u:"./Documents/VEX IQ BOX INSERTS/"}],g:[{c:"ac",l:"VEX"},{l:"Enclosure"},{l:"Acrylic"}],v:[{n:"V1",i:"No ventilation."},{n:"V3",L:1,i:"Added vents + cutouts."}]},
{t:"VEX IQ Storage Box",s:"done",pt:"prompts/vex-iq-storage-box-prompt.md",d:"3D-printed: IQ BIN + Lid + Tray.",g:[{c:"ac",l:"3D Print"},{l:"VEX"},{l:"Storage"}],a:[{c:"p3d",l:"View 3D (3 parts)",o:3,vs:[
{l:"Tray",p:"./Downloads/40% vex iq storage box/Tray.stl"},
{l:"IQ BIN",p:"./Downloads/40% vex iq storage box/228-2929 IQ BIN.stl"},
{l:"Lid",p:"./Downloads/40% vex iq storage box/Storage Lid.stl"}
]}],v:[{n:"30%",i:"Test scale."},{n:"40%",L:1,i:"Production."}]},
{t:"VEX PIN TWEEZER V5",s:"done",pt:"prompts/vex-pin-tweezer-v5-prompt.md",d:"Specialized VEX pin tool.",a:[{l:"Open Folder",o:1,u:"./projects/"}],g:[{c:"ac",l:"VEX"},{l:"Tool"}]},
{t:"VEX EDR Box Inserts",s:"done",pt:"prompts/vex-edr-box-inserts-prompt.md",d:"Laser-cut inserts for VEX EDR metal kit.",g:[{c:"ac",l:"VEX EDR"},{l:"AI"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Downloads/VEX EDR Box Inserts.dxf"}]},
{t:"Masterball",s:"done",pt:"prompts/masterball-prompt.md",d:"Pokemon Masterball replica. 2-part printable.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Downloads/masterball new.stl"}],g:[{c:"ac",l:"Pokemon"},{l:"Replica"}]},
{t:"Halo Helmet V2",s:"done",pt:"prompts/halo-helmet-v2-prompt.md",d:"Wearable. V2 dowels for assembly.",a:[{c:"p3d",l:"View 3D",o:2,p:"./Documents/f1/f1 print/Self Modified/Halo Helmet f1 car.stl"}],g:[{c:"ac",l:"Halo"},{l:"Helmet"},{l:"Cosplay"}],v:[{n:"V1",i:"Too big."},{n:"V2",L:1,i:"Split with dowels."}]},
{t:"Family Keychain Set",s:"done",pt:"prompts/family-keychain-set-prompt.md",d:"Laser-cut keychains - Arcadi + individual.",g:[{l:"Keychain"},{l:"Laser"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/family keychain/family keychain.dxf"}]},
{t:"Dura Block",s:"done",pt:"prompts/dura-block-prompt.md",d:"Sanding block replica. Text + plain.",a:[{l:"Open Folder",o:1,u:"./Downloads/Dura+Block+Hand+Sanding+Block/"}],g:[{l:"Sanding"},{l:"Tool"}],v:[{n:"Text",i:"Branded."},{n:"Plain",L:1,i:"Cleaner."}]},
{t:"Isaac Chan Atom",s:"done",pt:"prompts/isaac-chan-atom-prompt.md",d:"Laser engraving - name with orbital rings.",g:[{l:"Laser"},{l:"DXF"},{l:"Personal"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/family keychain/isaac.dxf"}]},
{t:"Chill Out Sign",s:"done",pt:"prompts/chill-out-sign-prompt.md",d:"Laser-cut cardboard sign.",g:[{l:"Laser"},{l:"DXF"},{l:"Sign"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Documents/chill out resized on cardboard.dxf"}]},
{t:"Music Sheet Holder",s:"done",pt:"prompts/music-sheet-holder-prompt.md",d:"100% scale - 6 iterations.",g:[{l:"Music"},{l:"Stand"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Downloads/100 music sheet holder 0.6.dxf"}],v:[{n:"V1-5",i:"Fit iterations."},{n:"V6",L:1,i:"Production."}]},
{t:"Honeycomb Laser Bed Clip",s:"done",pt:"prompts/honeycomb-laser-bed-clip-prompt.md",d:"Clip for honeycomb laser bed.",g:[{l:"Laser"},{l:"Clip"},{l:"DXF"}],a:[{c:"p2d",l:"View DXF",o:5,p:"./Desktop/honeycomb laser bed clip.dxf"}]},
{t:"NEXAR F1 Car",s:"done",pt:"prompts/f1-nexar-prompt.md",d:"F1 in Schools car design — NEXAR (Fusion 360).",g:[{c:"ac",l:"F1 In Schools"},{l:"Fusion 360"},{l:"Car"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"F1 In Schools Car 10",s:"done",pt:"prompts/f1-car-10-prompt.md",d:"F1 car v10 — final Fusion 360 + STEP export.",g:[{c:"ac",l:"F1 In Schools"},{l:"Fusion 360"},{l:"Car"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Endeavour F1 Assembly",s:"done",pt:"prompts/f1-endeavour-prompt.md",d:"Endeavour F1 car full assembly (STEP).",g:[{c:"ac",l:"F1 In Schools"},{l:"Fusion 360"},{l:"Assembly"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Pit Display 2",s:"done",pt:"prompts/f1-pit-display-prompt.md",d:"F1 pit display design (v2).",g:[{c:"ac",l:"F1 In Schools"},{l:"Fusion 360"},{l:"Pit Display"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Pit Display Radtek",s:"done",pt:"prompts/f1-pit-display-radtek-prompt.md",d:"F1 pit display — Radtek team.",g:[{c:"ac",l:"F1 In Schools"},{l:"Fusion 360"},{l:"Pit Display"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Bearing 625 Model",s:"done",pt:"prompts/f1-bearing-625-prompt.md",d:"625 bearing (5×16×5mm) parametric model.",g:[{c:"ac",l:"Fusion 360"},{l:"Bearing"},{l:"Parametric"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"F1 No-Go Zone",s:"done",pt:"prompts/f1-no-go-zone-prompt.md",d:"F1 no-go-zone platform (entry class).",g:[{c:"ac",l:"F1 In Schools"},{l:"Fusion 360"},{l:"Rules"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Laptop Stand",s:"done",pt:"prompts/laptop-stand-prompt.md",d:"Laptop stand — Fusion 360 design.",g:[{c:"ac",l:"Fusion 360"},{l:"Stand"},{l:"Laptop"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"F1 Axle Bush",s:"done",pt:"prompts/f1-axle-bush-prompt.md",d:"F1 axle bush (v2–v4).",g:[{c:"ac",l:"F1 In Schools"},{l:"Axle"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/f1-axle-bush.stl"}]},
{t:"F1 Helmet with Dowel",s:"done",pt:"prompts/f1-helmet-dowel-prompt.md",d:"F1 helmet with dowel assembly pins.",g:[{c:"ac",l:"F1 In Schools"},{l:"Helmet"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/f1-helmet-dowel.stl"}]},
{t:"Halo 2025 Spigot + SR Logo",s:"done",pt:"prompts/f1-halo-spigot-prompt.md",d:"Halo spigot with SR logo (6mm hole).",g:[{c:"ac",l:"F1 In Schools"},{l:"Halo"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/f1-halo-spigot.stl"}]},
{t:"F1 Wheel",s:"done",pt:"prompts/f1-wheel-prompt.md",d:"F1 in Schools wheel.",g:[{c:"ac",l:"F1 In Schools"},{l:"Wheel"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/f1-wheel.stl"}]},
{t:"REA F1 Tether Guide",s:"done",pt:"prompts/rea-tether-guide-prompt.md",d:"REA F1 racing tether guide.",g:[{c:"ac",l:"F1 In Schools"},{l:"Tether"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/rea-tether-guide.stl"}]},
{t:"REA F1 Wide Wheel",s:"done",pt:"prompts/rea-wheel-wide-prompt.md",d:"REA F1 racing wide wheel.",g:[{c:"ac",l:"F1 In Schools"},{l:"Wheel"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/rea-wheel-wide.stl"}]},
{t:"F1 CO2 Canister",s:"done",pt:"prompts/f1-co2-canister-prompt.md",d:"F1 in Schools CO2 canister.",g:[{c:"ac",l:"F1 In Schools"},{l:"CO2"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/f1-co2-canister.stl"}]},
{t:"Team AIB Final Car Assembly",s:"done",pt:"prompts/car-assembly-prompt.md",d:"F1 final car assembly (Team AIB).",g:[{c:"ac",l:"F1 In Schools"},{l:"Assembly"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/car-assembly.stl"}]},
{t:"Test Car",s:"done",pt:"prompts/test-car-prompt.md",d:"F1 test car print.",g:[{c:"ac",l:"F1 In Schools"},{l:"Car"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/test-car.stl"}]},
{t:"Bell Helmet with Dowel",s:"done",pt:"prompts/bell-helmet-prompt.md",d:"Bell helmet with dowel (pro class).",g:[{c:"ac",l:"F1 In Schools"},{l:"Helmet"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/bell-helmet.stl"}]},
{t:"Grand Gabarit (Jig)",s:"done",pt:"prompts/grand-gabarit-prompt.md",d:"Grand gabarit F1 measurement jig.",g:[{c:"ac",l:"F1 In Schools"},{l:"Jig"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/grand-gabarit.stl"}]},
{t:"F1 Power Unit",s:"done",pt:"prompts/power-unit-prompt.md",d:"F1 power unit (motor housing).",g:[{c:"ac",l:"F1 In Schools"},{l:"Power Unit"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/power-unit.stl"}]},
{t:"F1 Helmet (2025)",s:"done",pt:"prompts/f1-helmet-2025-prompt.md",d:"F1 helmet with 6mm spigot.",g:[{c:"ac",l:"F1 In Schools"},{l:"Helmet"},{l:"STL"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/f1-helmet-2025.stl"}]},
{t:"608 Bearing Plug",s:"done",pt:"prompts/bearing-plug-608-prompt.md",d:"Plug for 608 bearings (tight fit).",g:[{c:"ac",l:"3D Print"},{l:"Bearings"},{l:"Plug"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/bearing-plug-608.stl"}]},
{t:"608 Bearing Plug (standard)",s:"done",pt:"prompts/bearing-plug-608-std-prompt.md",d:"Standard-fit 608 bearing plug.",g:[{c:"ac",l:"3D Print"},{l:"Bearings"},{l:"Plug"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/bearing-plug-608-std.stl"}]},
{t:"Flat Blade Adapter",s:"done",pt:"prompts/flat-blade-adapter-prompt.md",d:"Flat-blade screwdriver bit adapter.",g:[{c:"ac",l:"3D Print"},{l:"Tools"},{l:"Adapter"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/flat-blade-adapter.stl"}]},
{t:"Inner Octagon Screw",s:"done",pt:"prompts/octagon-screw-prompt.md",d:"Inner-octagon screw.",g:[{c:"ac",l:"3D Print"},{l:"Fasteners"},{l:"Screw"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/octagon-screw.stl"}]},
{t:"Octagon Allen Key",s:"done",pt:"prompts/octagon-key-prompt.md",d:"Octagon allen key.",g:[{c:"ac",l:"3D Print"},{l:"Tools"},{l:"Key"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/octagon-key.stl"}]},
{t:"Drill Bit (3D print)",s:"done",pt:"prompts/drill-bit-print-prompt.md",d:"3D-printed drill bit model.",g:[{c:"ac",l:"3D Print"},{l:"Tools"},{l:"Drill"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/drill-bit-print.stl"}]},
{t:"Screw Sizing Gauge",s:"done",pt:"prompts/screw-sizing-gauge-prompt.md",d:"Any-size screw sizing gauge.",g:[{c:"ac",l:"3D Print"},{l:"Tools"},{l:"Gauge"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Yin Mechanism (full size)",s:"done",pt:"prompts/yin-full-prompt.md",d:"Compliant yin-yang, full-size variant.",g:[{c:"ac",l:"3D Print"},{l:"Compliant"},{l:"Mechanism"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/yin-full.stl"}]},
{t:"3mm Hex Adapter",s:"done",pt:"prompts/hex-adapter-3mm-prompt.md",d:"3mm hex drill adapter (v3).",g:[{c:"ac",l:"3D Print"},{l:"Tools"},{l:"Adapter"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/hex-adapter-3mm.stl"}]},
{t:"Hex Adapter V2",s:"done",pt:"prompts/hex-adapter-v2-prompt.md",d:"Hex adapter v2 (magnet pause).",g:[{c:"ac",l:"3D Print"},{l:"Tools"},{l:"Adapter"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/hex-adapter-v2.stl"}]},

{t:"USB Dust Cover (v1)",s:"done",pt:"prompts/usb-dust-cover-v1-prompt.md",d:"USB dust cover v1.",g:[{c:"ac",l:"3D Print"},{l:"USB"},{l:"Cover"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/usb-dust-cover-v1.stl"}]},
{t:"Watch Holder",s:"done",pt:"prompts/watch-holder-prompt.md",d:"3D-printed watch display holder.",g:[{c:"ac",l:"3D Print"},{l:"Holder"},{l:"Watch"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/watch-holder.stl"}]},
{t:"Sphere Mould",s:"done",pt:"prompts/sphere-mould-prompt.md",d:"3D-printed spherical mould.",g:[{c:"ac",l:"3D Print"},{l:"Mould"},{l:"Sphere"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/sphere-mould.stl"}]},
{t:"Impossible Passthrough",s:"done",pt:"prompts/impossible-passthrough-prompt.md",d:"Impossible passthrough fidget (Fede).",g:[{c:"ac",l:"3D Print"},{l:"Fidget"},{l:"Print-in-place"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/impossible-passthrough.stl"}]},
{t:"Paper Roll Holder",s:"done",pt:"prompts/paper-roll-holder-prompt.md",d:"Paper roll holder (卷纸架).",g:[{c:"ac",l:"3D Print"},{l:"Holder"},{l:"Household"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/paper-roll-holder.stl"}]},
{t:"Laser Hot Nozzle",s:"done",pt:"prompts/hot-nozzle-prompt.md",d:"Hot nozzle for 20W laser.",g:[{c:"ac",l:"3D Print"},{l:"Laser"},{l:"Nozzle"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/hot-nozzle.stl"}]},
{t:"Laser Head Washer",s:"done",pt:"prompts/laser-head-washer-prompt.md",d:"Washer for 20W laser head.",g:[{c:"ac",l:"3D Print"},{l:"Laser"},{l:"Washer"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/laser-head-washer.stl"}]},
{t:"Cube Holder",s:"done",pt:"prompts/cube-holder-prompt.md",d:"3D-printed cube holder.",g:[{c:"ac",l:"3D Print"},{l:"Holder"},{l:"Cube"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/cube-holder.stl"}]},
{t:"Pendant",s:"done",pt:"prompts/pendant-prompt.md",d:"3D-printed pendant.",g:[{c:"ac",l:"3D Print"},{l:"Pendant"},{l:"Jewellery"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/pendant.stl"}]},
{t:"Riley Racket",s:"done",pt:"prompts/riley-racket-prompt.md",d:"Riley racket (65mm RED).",g:[{c:"ac",l:"3D Print"},{l:"Racket"},{l:"RED"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/riley-racket.stl"}]},
{t:"Statue (Draft)",s:"done",pt:"prompts/statue-draft-prompt.md",d:"3D-printed statue draft.",g:[{c:"ac",l:"3D Print"},{l:"Statue"},{l:"Sculpture"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/statue-draft.stl"}]},
{t:"20W Laser (5th try)",s:"done",pt:"prompts/20w-laser-prompt.md",d:"20W laser head iteration.",g:[{c:"ac",l:"3D Print"},{l:"Laser"},{l:"20W"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/20w-laser.stl"}]},
{t:"6 Lock",s:"done",pt:"prompts/6-lock-prompt.md",d:"3D-printed 6-lock mechanism.",g:[{c:"ac",l:"3D Print"},{l:"Lock"},{l:"Mechanism"}],a:[{c:"ac",l:"View 3D",o:2,p:"./cad/6-lock.stl"}]},

{t:"Hex Adapter V4",s:"done",pt:"prompts/hex-adapter-v4-prompt.md",d:"Hex adapter v4 (pause print).",g:[{c:"ac",l:"3D Print"},{l:"Variant"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]},
{t:"Big Bowl Clicker V4",s:"done",pt:"prompts/big-bowl-v4-prompt.md",d:"Big bowl clicker v4 base.",g:[{c:"ac",l:"3D Print"},{l:"Variant"}],a:[{l:"Open Folder",o:1,u:"./cad/fusion/"}]}
,{t:"6-Axis Robot Arm (TicStep)",s:"done",pt:"prompts/6-axis-robot-arm-prompt.md",d:"Desktop 6-axis robotic arm - TicStep model with STEP drawings and manual.",how:"Studied the TicStep open-source 6-axis arm kit: joint structure, STEP assembly drawings, and control approach.",src:"TicStep kit (open source), STEP drawings, PDF manual.",fl:"engineering/robot-arm/",g:[{l:"Robotics"},{l:"6-Axis"},{l:"STEP"},{l:"CNC"}]},
{t:"5-Axis CNC Concept (RAPIMA RMX-15)",s:"done",pt:"prompts/5-axis-cnc-concept-prompt.md",d:"Desktop 5-axis CNC machining concept model - RAPIMA RMX-15.",how:"Explored a 5-axis CNC concept model (RAPIMA RMX-15) - full STEP assembly plus renderings.",src:"RAPIMA RMX-15 model, renderings.",fl:"engineering/cnc5/",g:[{l:"CNC"},{l:"5-Axis"},{l:"STEP"},{l:"Machining"}]},
{t:"Gear Mechanism Model Sets",s:"done",pt:"prompts/gear-mechanism-sets-prompt.md",d:"Printable gear mechanism education sets (機構模型プラスセット 1-8) + Gear 40 set.",how:"Worked through Japanese gear-mechanism model sets 1-8 (planetary, scroll, escapement gears) as printable assemblies.",src:"機構模型プラスセット 1-8, 齿轮40 (gears 1-40).",fl:"engineering/gears/",g:[{l:"Gears"},{l:"Mechanisms"},{l:"3D Print"},{l:"Education"}]},
{t:"VEX IQ Parts Library (STEP)",s:"done",pt:"prompts/vex-iq-parts-library-prompt.md",d:"VEX IQ structural parts as STEP - beams, plates, angle beams, anchors.",how:"Collected the official VEX IQ structural part STEP files (beams, plates, angle beams) for assembly reference.",src:"VEX IQ parts (228-2500 series) as STEP.",fl:"engineering/vex-parts/",g:[{l:"VEX"},{l:"STEP"},{l:"Parts"},{l:"CAD"}]},
{t:"3D Chess Set",s:"done",pt:"prompts/3d-chess-set-prompt.md",d:"Full 3D chess set + board - OBJ/STL/FBX/C4D sources.",how:"Sourced a full 3D chessboard + pieces model with textures for printing/rendering.",src:"Vray C4D Chessboard (obj/stl/fbx/c4d + textures).",fl:"hobby/chess/",g:[{l:"Chess"},{l:"3D Print"},{l:"OBJ"},{l:"Board Game"}]},
{t:"3D Print Hobby Collection",s:"done",pt:"prompts/3d-print-hobby-collection-prompt.md",d:"Fun 3D prints - Pokemon, Doraemon, holiday models and desk toys.",how:"Printed a rotating cast of hobby models: Pokemon, Doraemon, halloween cat, floral skull and more.",src:"Bambu Lab X1C + AMS, assorted STL/3MF models.",fl:"hobby/prints/",g:[{l:"3D Print"},{l:"Pokemon"},{l:"Hobby"},{l:"STL"}]},
{t:"Big Mill Box",s:"done",pt:"prompts/big-mill-box-prompt.md",d:"Larger CNC mill tool-head box - multi-slot storage.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/big-mill-box.f3d"}],fl:"cad/fusion/",g:[{l:"CNC"},{l:"Storage"},{l:"Fusion 360"}]},
{t:"Egg Yolk Mixer",s:"done",pt:"prompts/egg-yolk-mixer-prompt.md",d:"Kitchen gadget - egg yolk mixer print.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/egg-yolk-mixer.f3d"}],fl:"cad/fusion/",g:[{l:"Kitchen"},{l:"3D Print"},{l:"Fusion 360"}]},
{t:"Flour Sifter",s:"done",pt:"prompts/flour-sifter-prompt.md",d:"Flour sifter - base design before rocket variant.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/flour-sifter.f3d"}],fl:"cad/fusion/",g:[{l:"Kitchen"},{l:"3D Print"},{l:"Fusion 360"}]},
{t:"Rocket Flour Sifter V6",s:"done",pt:"prompts/rocket-flour-sifter-v6-prompt.md",d:"Rocket-shaped flour sifter - V6 (+ recovered copy).",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/rocket-flour-sifter-v6.f3d"}],fl:"cad/fusion/",g:[{l:"Kitchen"},{l:"3D Print"},{l:"V6"},{l:"Fusion 360"}]},
{t:"Isaac Separator",s:"done",pt:"prompts/isaac-separator-prompt.md",d:"Separator part - Isaac's design.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/isaac-separator.f3d"}],fl:"cad/fusion/",g:[{l:"Fusion 360"},{l:"Part"},{l:"Utility"}]},
{t:"Isaac & Damian Wheel",s:"done",pt:"prompts/isaac-and-damian-wheel-prompt.md",d:"F1 wheel designed with Damian.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/isaac-damian-wheel.f3d"}],fl:"cad/fusion/",g:[{l:"F1"},{l:"Wheel"},{l:"Fusion 360"},{l:"Collab"}]},
{t:"Laptop Stand (Fusion)",s:"done",pt:"prompts/laptop-stand-fusion-prompt.md",d:"Laptop stand - Fusion 360 design.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/laptop-stand.f3d"}],fl:"cad/fusion/",g:[{l:"Stand"},{l:"Fusion 360"},{l:"Desktop"}]},
{t:"Polar Bear Light Design V6",s:"done",pt:"prompts/polar-bear-light-v6-prompt.md",d:"Polar bear night-light design - V6.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/polar-bear-light-v6.f3d"}],fl:"cad/fusion/",g:[{l:"Light"},{l:"3D Print"},{l:"V6"},{l:"Fusion 360"}]},
{t:"VEX Pin Tweezer V5",s:"done",pt:"prompts/vex-pin-tweezer-v5-prompt.md",d:"VEX pin tweezer tool - V5.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/vex-pin-tweezer-v5.f3d"}],fl:"cad/fusion/",g:[{l:"VEX"},{l:"Tool"},{l:"V5"},{l:"Fusion 360"}]},
{t:"Inner Hex M6 Screw",s:"done",pt:"prompts/inner-hex-m6-screw-prompt.md",d:"M6 inner-hex socket screw model.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/inner-hex-m6.f3d"}],fl:"cad/fusion/",g:[{l:"Fastener"},{l:"M6"},{l:"Fusion 360"}]},
{t:"Inner Hex M8 Screw",s:"done",pt:"prompts/inner-hex-m8-screw-prompt.md",d:"M8 inner-hex socket screw model.",how:"Designed in Fusion 360.",src:"Fusion 360 (.f3d).",a:[{l:"Download .f3d",o:1,u:"./cad/fusion/inner-hex-m8.f3d"}],fl:"cad/fusion/",g:[{l:"Fastener"},{l:"M8"},{l:"Fusion 360"}]},
{t:"Pewter Me Mould (Y7)",s:"done",pt:"prompts/pewter-me-mould-y7-prompt.md",d:"Year 7 pewter-casting mould design - laser-cut MDF mould for molten pewter.",a:[{c:"p2d",l:"View DXF (3 vers)",o:4,vs:[{l:"V1",p:"./school/dt-y7/pewter-isaac.dxf"},{l:"V2",p:"./school/dt-y7/mold-isaac.dxf"},{l:"V3",p:"./school/dt-y7/isaac-homeowrk.dxf"}]}],g:[{l:"Pewter"},{l:"Mould"},{l:"DXF"},{l:"DT"},{l:"Y7"}]},
{t:"Acrylic Keyring (Y7)",s:"done",pt:"prompts/acrylic-keyring-y7-prompt.md",d:"Year 7 laser-cut acrylic keyring designs.",a:[{c:"p2d",l:"View DXF (2 vers)",o:4,vs:[{l:"V1",p:"./school/dt-y7/isaac-acrylic.dxf"},{l:"V2",p:"./school/dt-y7/isaac-rook.dxf"}]}],g:[{l:"Acrylic"},{l:"Laser"},{l:"DXF"},{l:"Keyring"},{l:"Y7"}]},
{t:"Vinyl Sticker Design (Y7)",s:"done",pt:"prompts/vinyl-sticker-y7-prompt.md",d:"Year 7 vinyl-cut sticker designs.",a:[{c:"p2d",l:"View DXF (2 vers)",o:4,vs:[{l:"V1",p:"./school/dt-y7/isaac-duck.dxf"},{l:"V2",p:"./school/dt-y7/isaac-chan-darkblue.dxf"}]}],g:[{l:"Vinyl"},{l:"Sticker"},{l:"DXF"},{l:"Y7"}]},
{t:"Organise Me Insert (Y7)",s:"done",pt:"prompts/organise-me-insert-y7-prompt.md",d:"Year 7 CNC router 'Organise Me' insert design.",a:[{c:"p2d",l:"View DXF",o:5,p:"./school/dt-y7/isaac-insert.dxf"}],g:[{l:"CNC"},{l:"Insert"},{l:"DXF"},{l:"Y7"}]},
],des:[
{t:"F1 Design Portfolio",s:"done",pt:"prompts/f1-design-portfolio-prompt.md",d:"Official F1 design portfolio - CAD, CFD. 5.5 MB.",g:[{c:"ac",l:"F1"},{l:"Portfolio"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/Design portfolio.pdf"}]},
{t:"F1 Enterprise Portfolio",s:"done",pt:"prompts/f1-enterprise-portfolio-prompt.md",d:"F1 business - branding, budget. 6.5 MB.",g:[{c:"ac",l:"F1"},{l:"Business"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/Enterprise portfolio.pdf"}]},
{t:"F1 Verbal Presentation",s:"done",pt:"prompts/f1-verbal-presentation-prompt.md",d:"Nationals pitch. 3.9 MB.",g:[{c:"ac",l:"F1"},{l:"Presentation"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/Verbal Presentation Nationals.pdf"}]},
{t:"F1 Car Renders",s:"done",pt:"prompts/f1-car-renders-prompt.md",d:"Studio-quality 3D renders. 10 MB.",g:[{c:"ac",l:"F1"},{l:"Renders"},{l:"3D"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/F1InSchools-main/documents/renders.pdf"}]},
{t:"VEX IQ Kit Layout",s:"done",pt:"prompts/vex-iq-kit-layout-prompt.md",d:"Parts organization poster. 3 MB.",g:[{c:"ac",l:"VEX"},{l:"Poster"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/228-8899-KitLayout.pdf"}]},
{t:"VEX IQ Gen 1 Poster",s:"done",pt:"prompts/vex-iq-gen-1-poster-prompt.md",d:"Gen 1 parts org poster. 2.8 MB.",g:[{c:"ac",l:"VEX"},{l:"Poster"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Documents/vex organise gen 1.pdf"}]},
{t:"P2S Clog Guide",s:"done",pt:"prompts/p2s-clog-guide-prompt.md",d:"Bambu Lab P2S extruder cleaning. 6.6 MB.",g:[{c:"ac",l:"Bambu"},{l:"3D Printer"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/P2S Extruder Clog Cleaning Guide.pdf"}]},
{t:"Daja A6 Pro Guide",s:"done",pt:"prompts/daja-a6-pro-guide-prompt.md",d:"Complete Daja laser reference. 13.5 MB.",g:[{c:"gr",l:"Laser"},{l:"Daja"},{l:"PDF"}],a:[{l:"Open PDF",o:6,p:"./Downloads/daja a6 pro tutorial.pdf"}]},
{t:"Laser Reference Library",s:"done",pt:"prompts/laser-reference-library-prompt.md",d:"30+ files: LightBurn, LaserGRBL, Sheets.",g:[{c:"gr",l:"Laser"},{l:"Reference"},{l:"Sheets"}],a:[{l:"Open Folder",o:1,u:"./Desktop/Parametrers/"}]},
{t:"Barrier Reef Poster",s:"done",pt:"prompts/barrier-reef-poster-prompt.md",d:"A3 science/geography poster.",g:[{c:"gr",l:"Poster"},{l:"Science"}],a:[{l:"Open PDF",o:6,p:"./Downloads/Barrier Reef.pdf"}]},
{t:"VIQRC Notebook",s:"done",pt:"prompts/viqrc-notebook-prompt.md",d:"VEX IQ engineering notebook. 14 MB.",g:[{c:"ac",l:"VEX"},{l:"Robotics"}],a:[{l:"Open PDF",o:6,p:"./Downloads/Copy of VIQRC Digital Notebook - Template v4.0.pdf"}]},
{t:"Mega Tours Presentation",s:"done",pt:"prompts/mega-tours-presentation-prompt.md",d:"87 MB final presentation.",g:[{c:"gr",l:"Presentation"}],a:[{l:"Open PDF",o:6,p:"./Downloads/Mega Tours Final Presentation.pdf"}]},
{t:"Canva Designs",s:"wip",pt:"prompts/canva-designs-prompt.md",d:"Canva via school Google. DAHIIX_Dw0Q. 57 MB.",a:[{c:"ac",l:"Open Canva",o:1,u:"https://www.canva.com/"}],g:[{c:"gr",l:"Canva"},{l:"Cloud"},{l:"Design"}]},
{t:"Google Drive Portfolio",s:"wip",pt:"prompts/google-drive-portfolio-prompt.md",d:"Docs + Slides. isaac_cs.chan@online.island.edu.hk.",a:[{c:"ac",l:"Open Drive",o:1,u:"https://drive.google.com/"}],g:[{c:"ac",l:"Google"},{l:"Cloud"}]},
{t:"Family Keychain AI/SVG",s:"done",pt:"prompts/family-keychain-ai-svg-prompt.md",d:"Illustrator art - Arcadi, Isaac, Ivan.",g:[{c:"ac",l:"AI"},{l:"SVG"},{l:"Typography"}],a:[{l:"Open Folder",o:1,u:"./Documents/family%20keychain/"}]},
{t:"VEX IQ Vector Masters",s:"done",pt:"prompts/vex-iq-vector-masters-prompt.md",d:"Production AI/SVG - Perfect.ai, finished.ai.",g:[{c:"ac",l:"AI"},{l:"SVG"},{l:"VEX"}],a:[{l:"Open Folder",o:1,u:"./Documents/VEX%20IQ%20BOX%20INSERTS/"}]},
{t:"Kinetic Industries",s:"done",pt:"prompts/kinetic-industries-prompt.md",d:"Branding/logo. 1.5 MB PNG.",g:[{c:"gr",l:"Branding"},{l:"Logo"}],a:[{l:"View Image",o:6,p:"./Downloads/Kinetic Industries.png"}]},
{t:"Storyboard",s:"done",pt:"prompts/storyboard-prompt.md",d:"2.2 MB visual plan.",g:[{c:"gr",l:"Storyboard"}],a:[{l:"View Image",o:6,p:"./Downloads/Storyboard.png"}]},
{t:"Humanities Essay",s:"done",pt:"prompts/humanities-essay-prompt.md",d:"26 MB Industrial Revolution research.",g:[{l:"Humanities"},{l:"History"}],a:[{l:"Open PDF",o:6,p:"./Downloads/humanities industrial revolution.pdf"}]},
{t:"Photo Holder V3",s:"done",pt:"prompts/photo-holder-v3-prompt.md",d:"3-version photo display stand.",g:[{l:"Design"},{l:"Holder"}],a:[{l:"View 3D",o:2,p:"./Downloads/photo holder.stl"},{l:"View Render",o:6,p:"./Downloads/photo holder v3 (2).jpg"}]},
{t:"Y10–11 IGCSE Guide",s:"done",pt:"prompts/igcse-guide-prompt.md",d:"Complete Y10–11 IGCSE study guide — DT & Economics, Island School.",a:[{c:"ac",l:"Live Demo",o:7,u:"./demos/igcse-guide.html"}],g:[{c:"gr",l:"Study Guide"},{l:"IGCSE"},{l:"DT"},{l:"Economics"}]},
{t:"Toddle Class Portfolio",s:"done",pt:"prompts/toddle-class-portfolio-prompt.md",d:"Higher Education Class of 2030 portfolio (saved from Toddle LMS).",a:[{l:"Open Folder",o:1,u:"./toddle-class-portfolio/"}],g:[{c:"gr",l:"Portfolio"},{l:"Higher Ed"},{l:"Toddle"}]}
,{t:"VEX IQ Reference Library",s:"done",pt:"prompts/vex-iq-reference-library-prompt.md",d:"Official VEX IQ manuals - game manuals, build instructions, activity series.",how:"Curated official VEX IQ resources: game manuals, basebot/speedbot/clawbot build instructions, activity guides.",src:"VEX Robotics official PDFs.",fl:"reference/vex/",g:[{l:"VEX"},{l:"Reference"},{l:"Manual"},{l:"Robotics"}]},
{t:"F1 in Schools Reference Library",s:"done",pt:"prompts/f1-in-schools-reference-library-prompt.md",d:"F1 in Schools / STEM Racing - regulations, gauges, car parts, portfolios.",how:"Collected F1 in Schools / STEM Racing reference: technical regulations, scrutineering gauges, standard car parts, example portfolios.",src:"REA / STEM Racing / Ethara official resources.",fl:"reference/f1/",g:[{l:"F1 In Schools"},{l:"Reference"},{l:"Regulations"},{l:"STEM"}]},
{t:"Anthropometric Data Reference",s:"done",pt:"prompts/anthropometric-data-reference-prompt.md",d:"Ergonomic body-measurement data (Childata / Adultdata) for design.",how:"Collected anthropometric data tables (child + adult) used for ergonomic sizing in DT projects.",src:"Childata / Adultdata scans, sr11 anthropometric reference.",fl:"reference/ergonomics/",g:[{l:"Ergonomics"},{l:"Anthropometrics"},{l:"Reference"},{l:"Design"}]},
{t:"Laser Cutting Reference",s:"done",pt:"prompts/laser-cutting-reference-prompt.md",d:"Laser cutting guides - materials reference, settings, Sculpteo guide.",how:"Compiled laser cutting reference: material speed/power settings, LightBurn + LaserGRBL materials guides, Sculpteo guide.",src:"LightBurn/LaserGRBL materials reference, Sculpteo laser guide.",fl:"reference/laser/",g:[{l:"Laser"},{l:"Reference"},{l:"Materials"},{l:"Settings"}]},
{t:"3D Printer & Laser Manuals",s:"done",pt:"prompts/3d-printer-laser-manuals-prompt.md",d:"Machine manuals - Weedo Tina2S, Daja A6 Pro laser, Cricut Maker 3, Bambu P2S.",how:"Kept manuals for the workshop machines: Weedo Tina2S, Daja A6 Pro laser engraver, Cricut Maker 3, Bambu P2S.",src:"Official machine manuals (PDF).",fl:"reference/manuals/",g:[{l:"Manual"},{l:"3D Printer"},{l:"Laser"},{l:"Reference"}]},
{t:"Science Booklets (Y7-9)",s:"done",pt:"prompts/science-booklets-y7-9-prompt.md",d:"School science student booklets - biology, chemistry, physics, ecology.",how:"Archived Y7-9 science student booklets across bio/chem/physics/earth-science topics.",src:"Island School science booklets (PDF).",fl:"school/science/",g:[{l:"Science"},{l:"School"},{l:"Biology"},{l:"Physics"}]},
{t:"IGCSE Study Resources",s:"done",pt:"prompts/igcse-study-resources-prompt.md",d:"IGCSE resources - Economics, English, Maths, DT lessons and past papers.",how:"Collected IGCSE subject resources: Economics units, English FLE, Maths booklets, DT materials.",src:"School IGCSE resources, past papers.",fl:"school/igcse/",g:[{l:"IGCSE"},{l:"Study"},{l:"Economics"},{l:"Maths"}]},
]};

// ==== Enrichment: how-it-works, materials/sources, file folder ====
function dirname(p){var i=p.lastIndexOf('/');return i<0?'':p.slice(0,i)}
var EXTRA={
"Clip-On Thermometer":{how:"An ESP32-C3 reads a K-type thermocouple through a MAX6675 amplifier (over SPI) and shows the temperature on an SSD1306 OLED, while also hosting a WiFi access-point dashboard. A buzzer alerts when the hot-wire cutter passes the target temperature.",src:"ESP32-C3 SuperMini, MAX6675 module, SSD1306 OLED, K-type thermocouple, buzzer, TP4056 + LiPo battery. PlatformIO (Arduino framework). No soldering: breadboard + dupont wires."},
"Auto-Clamping Vise":{how:"A NEMA17 stepper (driven by an A4988) turns an M8 threaded rod that acts as the lead screw, pushing the moving jaw forward. An ACS712 current sensor watches motor current: when the jaw grips something the current spikes and the Arduino stops, so it clamps automatically.",src:"Arduino Nano, NEMA17 stepper, A4988 driver, ACS712 current sensor, M8 threaded rod, LM8UU bearings, 3D-printed frame. ~$32."},
"MacAdBlock":{how:"A Python DNS server runs on localhost:8053 as a launchd daemon. It loads a blocklist of ad/tracker domains and answers their lookups with 0.0.0.0, so ads never load system-wide.",src:"Python, launchd (auto-start daemon), custom + banned blocklists, .pkg installer."},
"ESP32-C3 AdBlock":{how:"The ESP32 acts as a network DNS sinkhole. Devices point their DNS at the ESP32, which returns 0.0.0.0 for known ad domains, blocking ads for every device on the WiFi.",src:"ESP32 (WROOM-32D), PlatformIO, C++. Note: the C3 SuperMini was incompatible with the RT-AC58U's WPA2, so the WROOM-32D was used instead."},
"IsaacSecureMessenger":{how:"End-to-end encrypted chat using the X3DH key-agreement protocol and AES-256-GCM for messages, with double-ratchet forward secrecy, QR pairing, disappearing messages, voice notes and file transfer.",src:"Python, PyObjC (native macOS .app), X3DH, AES-256-GCM, double ratchet."},
"Multiplayer Game Server":{how:"A FastAPI backend manages WebSocket rooms. Players join with a room code; the server broadcasts moves, keeps state in sync, and supports spectators plus reconnects.",src:"Python, FastAPI, WebSocket (real-time)."},
"HKPCBypass":{how:"Layered network bypass: DNS-over-HTTPS encrypts lookups, then traffic tunnels through SOCKS5 / HTTP CONNECT with automatic fallback between layers.",src:"Python, DoH, SOCKS5, HTTP CONNECT."},
"WiFi Chat":{how:"A Flask + WebSocket LAN chat that works with no internet. Devices on the same WiFi exchange messages and can share DXF/SVG files.",src:"Flask, WebSocket, JavaScript."},
"WiFi Monitor":{how:"The ESP32 scans surrounding WiFi networks and devices, graphing signal strength and tracking MAC addresses on a live dashboard.",src:"ESP32, C++, WebSocket dashboard."},
"FrostSolve":{how:"A macOS desktop app packaged as a real .app bundle with a manifest structure, so it launches from Finder/Dock like a native app.",src:"JavaScript, macOS .app bundle."},
"IsaacNetPkg":{how:"A password-protected macOS .pkg installer that bundles IsaacNet and includes an AppleScript uninstaller.",src:"pkgbuild, AppleScript, launchd."},
"Laser Cutting Simulator":{how:"A browser simulator that renders laser-cut designs and exports G-code for a real cutter.",src:"React, Canvas, DXF."},
"Manufacturing Explorer":{how:"A Three.js explorer documenting 200 manufacturing methods with an interactive 3D interface.",src:"Three.js, Flask."},
"Scam Mirror":{how:"Clones phishing sites (full wget mirror) to preserve evidence and generates registrar takedown reports.",src:"wget, Python, registrar abuse contacts."},
"326929.pw Mirror":{how:"A full mirror of a phishing site saved as evidence for takedown.",src:"wget mirror (all assets)."},
"Optical Center Punch":{how:"A DIY $10 center punch with a 3D-printed body and lens, versus $30-60 commercial versions.",src:"3D printed body, lens, steel tip."},
"Micro RC Car":{how:"A 1/64-1/32 scale high-speed RC car built no-solder with Dupont wires.",src:"Dupont wires, no-solder build."},
"BLE Scanner":{how:"An ESP32 BLE scanner that detects nearby devices, logs them and shows them on a dashboard.",src:"ESP32, BLE."},
"IsaacKing Browser":{how:"A whitelist-only browser built with PyObjC + WKWebView, packaged as a .app.",src:"PyObjC, WKWebView, macOS .app."},
"IsaacBrowser":{how:"A category-based whitelist browser (independent codebase fork of IsaacKing).",src:"PyObjC, WKWebView, macOS .app."},
"IsaacNet":{how:"Layered bypass with TLS-wrapped tunnels and multi-tunnel automatic fallback.",src:"Python, TLS, SOCKS5, CONNECT, WebSocket."},
"IsaacCombo":{how:"A multi-app .pkg installer where the user selects which apps to install via a choice dialog.",src:"pkgbuild, AppleScript choice dialog."},
"Macro Typer":{how:"Types text character-by-character to bypass Google Docs version history.",src:"Python, pyautogui, Tkinter, macOS."},
"Godzilla AI Chat":{how:"A Godzilla-themed AI roleplay chat, available as a terminal TUI and a native GUI .app.",src:"AI API, macOS .app, TUI + GUI."},
"Isaac AI":{how:"An AI chat assistant with multi-personality and memory, packaged as a native WKWebView .app.",src:"AI API, WKWebView, macOS .app."},
"F1 Car Net":{how:"A laser-cut F1 car net refined across 46 DXF versions, re-measured for correct hole positions.",src:"Fusion 360, laser cutter, balsa/cardboard, DXF."},
"F1 Model Block Jig":{how:"A precision CNC jig for the F1 car, with left/right bases and inserts iterated over 6 versions.",src:"Fusion 360, CNC mill, STL."},
"VEX IQ Box Inserts":{how:"Laser-cut acrylic inserts to organise VEX IQ parts, scaled and refined over 34 DXF iterations.",src:"Fusion 360, laser cutter, acrylic."}
};
function synthHow(p){
 if(p.v&&p.v.length){
  var f=p.v[0],l=p.v[p.v.length-1];
  if(p.v.length===1)return p.t+" is built and refined iteratively. Current version: "+(f.i||"").replace(/\.$/,"")+".";
  return p.t+" was built and refined iteratively. It started as \""+(f.i||"").replace(/\.$/,"")+"\" and evolved to \""+(l.i||"").replace(/\.$/,"")+"\" across "+p.v.length+" iterations.";
 }
 return p.d;
}
function synthSrc(p){
 if(p.g&&p.g.length)return "Built with: "+p.g.map(function(x){return x.l}).join(", ")+".";
 return null;
}
function computeFolder(p){
 if(p.a){
  for(var i=0;i<p.a.length;i++){var a=p.a[i];if(a.o===1&&a.u&&a.u.indexOf('://')<0)return a.u.replace(/\/+$/,'')}
  for(var j=0;j<p.a.length;j++){var b=p.a[j];if(b.p)return dirname(b.p);if(b.vs&&b.vs.length&&b.vs[0].p)return dirname(b.vs[0].p)}
 }
 return null;
}
function enrich(){
 ['sw','hw','f3d','des'].forEach(function(k){D[k].forEach(function(p){
  var ex=EXTRA[p.t];if(ex){if(ex.how){p.how=ex.how;p.howR=1}if(ex.src)p.src=ex.src;}
  if(!p.how)p.how=synthHow(p);
  if(!p.src)p.src=synthSrc(p);
  if(!p.fl)p.fl=computeFolder(p);
  if(p.a)p.a.forEach(function(a){if(a.o===6&&a.p&&/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(a.p))a.o=8});
 })});
}
enrich();

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
  if(editMode)html+='<button class="abtn addbtn" onclick="addProj(\''+k+'\')">＋ Add project</button>';
  html+='</div></div>';
 }
 document.getElementById('app').innerHTML=html;
 updStats();
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
 var h='<div class="card'+(editMode?' editing':'')+'" data-cat="'+cat+'" data-idx="'+idx+'"><div class="ch"><div class="ctitle">'+em+' '+p.t+'</div><div style="display:flex;gap:6px;align-items:center"><button class="copybtn" onclick="copyLink(\''+cat+'\','+idx+',this)" title="Copy link">🔗</button><span class="status '+p.s+'">'+p.s+'</span></div></div>';
 h+='<div class="cdesc">'+p.d+'</div>';
 if(p.howR&&p.how&&p.how!==p.d){h+='<div class="howline" onclick="openDetails(\''+cat+'\','+idx+')" title="How it works / how it was made">'+trunc(p.how,150)+'</div>'}
 if(p.g){h+='<div class="tags">';p.g.forEach(function(x){h+='<span class="tag'+(x.c?' '+x.c:'')+'" onclick="event.stopPropagation();filterTag(this)">'+x.l+'</span>'});h+='</div>'}
 if(p.v&&p.v.length){h+='<button class="vtoggle" onclick="toggleV(this)"><span class="arr">\u25b6</span> Version history ('+p.v.length+' steps)</button><div class="versions">';p.v.forEach(function(x){h+='<div class="vitem"><span class="vbadge'+(x.L?' latest':'')+'">'+x.n+'</span><div class="vinfo">'+x.i+'</div></div>'});h+='</div>'}
 h+='<div class="actions">';
 if(p.a)p.a.forEach(function(x,i){h+='<button class="abtn'+(x.c?' '+x.c:'')+'" data-t="'+p.t.replace(/"/g,'&quot;')+'" data-i="'+i+'">'+x.l+'</button>'});
 h+='<button class="abtn ac" onclick="openDetails(\''+cat+'\','+idx+')">🔍 Details</button>';
 if(p.fl)h+='<button class="abtn" onclick="openFilesFrom(\''+cat+'\','+idx+')">📂 Files</button>';
 h+='</div>';
 if(editMode){h+='<div class="editbox">'+
  '<label>Title</label><input class="edit-input show" value="'+p.t.replace(/"/g,'&quot;')+'" onchange="editCard(\''+cat+'\','+idx+',\'t\',this.value)">'+
  '<label>Description</label><input class="edit-input show" value="'+p.d.replace(/"/g,'&quot;')+'" onchange="editCard(\''+cat+'\','+idx+',\'d\',this.value)">'+
  '<label>How it works / how it was made</label><textarea class="edit-input show" rows="2" onchange="editCard(\''+cat+'\','+idx+',\'how\',this.value)">'+(p.how||'').replace(/</g,'&lt;')+'</textarea>'+
  '<label>Materials / tools / sources</label><input class="edit-input show" value="'+(p.src||'').replace(/"/g,'&quot;')+'" onchange="editCard(\''+cat+'\','+idx+',\'src\',this.value)">'+
  '<label>Tags (comma separated)</label><input class="edit-input show" value="'+(p.g?p.g.map(function(x){return x.l}).join(', '):'')+'" onchange="editCard(\''+cat+'\','+idx+',\'g\',this.value)">'+
  '<div style="display:flex;gap:6px;align-items:center;margin-top:4px"><select class="edit-input show" onchange="editCard(\''+cat+'\','+idx+',\'s\',this.value)" style="color:var(--t1);width:auto"><option value="done"'+(p.s==='done'?' selected':'')+'>Done</option><option value="wip"'+(p.s==='wip'?' selected':'')+'>WIP</option><option value="draft"'+(p.s==='draft'?' selected':'')+'>Draft</option></select>'+
  '<button class="abtn" style="color:var(--ar);border-color:rgba(239,68,68,0.3)" onclick="delProj(\''+cat+'\','+idx+')">🗑 Delete</button></div></div>'}
 h+='</div>';return h
}
function trunc(s,n){s=s||'';return s.length>n?s.slice(0,n-1)+'\u2026':s}
function editCard(cat,idx,field,val){
 var p=D[cat][idx];
 if(field==='g'){val=val.split(',').map(function(x){return{l:x.trim()}}).filter(function(x){return x.l});p.g=val}
 else p[field]=val;
 if(field==='how')p.howR=1;
 rebuild();saveData()
}
function saveData(){try{localStorage.setItem('isaac-projects-v3',JSON.stringify({sw:D.sw,hw:D.hw,f3d:D.f3d,des:D.des}))}catch(e){}}
// Load saved edits (after D defined + enriched)
try{var saved=localStorage.getItem('isaac-projects-v3');if(saved){var sd=JSON.parse(saved);for(var k in sd)for(var i=0;i<sd[k].length;i++)if(D[k]&&D[k][i]){for(var f in sd[k][i])if(sd[k][i][f]!==undefined)D[k][i][f]=sd[k][i][f]}}}catch(e){}
rebuild();
// Deep link support: open ?p=cat-idx
(function(){
 var m=location.search.match(/[?&]p=(\w+)-(\d+)/);
 if(m){
  var cat=m[1],idx=parseInt(m[2]);
  var key={sw:'sw',hw:'hw',f3d:'f3d',des:'des'}[cat]||cat;
  if(D[key]&&D[key][idx]){
   setTimeout(function(){
    F({sw:'software',hw:'hardware',f3d:'fusion',des:'design'}[key]);
    var sec=document.getElementById(key);
    var card=sec?sec.querySelector('.card[data-idx="'+idx+'"]'):null;
    if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.style.boxShadow='0 0 0 2px var(--ab)';setTimeout(function(){card.style.boxShadow=''},3000)}
   },300);
  }
 }
})();
var curTag='';
function filterTag(el){var t=(el.textContent||'').trim().toLowerCase();curTag=(curTag===t)?'':t;applySearch();highlightTags();}
function clearTag(){curTag='';applySearch();highlightTags();}
function applySearch(){
 var q=(document.getElementById('search').value||'').toLowerCase();
 document.querySelectorAll('.card').forEach(function(c){
  var t=c.querySelector('.ctitle'),d=c.querySelector('.cdesc'),tags=c.querySelector('.tags');
  var t2=t?t.textContent.toLowerCase():'',d2=d?d.textContent.toLowerCase():'',g2=tags?tags.textContent.toLowerCase():'';
  var qOk=!q||t2.indexOf(q)>=0||d2.indexOf(q)>=0||g2.indexOf(q)>=0;
  var tagOk=!curTag||g2.indexOf(curTag)>=0;
  c.style.display=(qOk&&tagOk)?'':'none';
 });
}
function highlightTags(){
 document.querySelectorAll('.card .tag').forEach(function(t){
  var on=(t.textContent||'').trim().toLowerCase()===curTag;
  t.classList.toggle('tag-on',!!(on&&curTag));
 });
 var chip=document.getElementById('tagChip');
 if(chip){chip.style.display=curTag?'inline-flex':'none';if(curTag)chip.querySelector('b').textContent=curTag;}
}
function search(q){applySearch();}
window.addEventListener('scroll',function(){document.getElementById('btt').classList.toggle('show',window.scrollY>500)});
// Scroll reveal + stat count-up
(function(){
 var els=document.querySelectorAll('.stitle,.ssub');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.1});
 els.forEach(function(el){el.classList.add('reveal');io.observe(el)});
 var nums=document.querySelectorAll('.stat .num');
 var io2=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){
   var target=parseInt(e.target.getAttribute('data-target'))||0,suffix=e.target.getAttribute('data-suffix')||'+',dur=1200,t0=null;
   function tick(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1);e.target.textContent=Math.floor(target*p)+suffix;if(p<1)requestAnimationFrame(tick)}
   requestAnimationFrame(tick);
   io2.unobserve(e.target);
  }
 })},{threshold:0.5});
 nums.forEach(function(n){io2.observe(n)});
})();

document.addEventListener('click',function(e){
 var pb=e.target.closest('.abtn[data-pt]');if(pb){showPrompt(pb.dataset.ptt,pb.dataset.pt);return}
 var btn=e.target.closest('.abtn');if(!btn)return;
 var title=btn.dataset.t,idx=parseInt(btn.dataset.i),found=null,all=[D.sw,D.hw,D.f3d,D.des];
 for(var a=0;a<all.length;a++)for(var b=0;b<all[a].length;b++)if(all[a][b].t===title){found=all[a][b];break}
 if(!found||!found.a||!found.a[idx])return;
 var act=found.a[idx];
 if(act.o===1)W(act.u);
 else if(act.o===2)open3D(act.p);
 else if(act.o===3)open3DM(found.t,act.vs);
 else if(act.o===4)openDXFM(found.t,act.vs);
 else if(act.o===5)openDXF(act.p);
 else if(act.o===6){if(isImg(act.p))showImage(act.p);else W(act.p)}
 else if(act.o===7)showIframe(found.t,act.u);
 else if(act.o===8)showImage(act.p);
 else if(act.o===9)openFiles(act.u);
});
function isImg(p){return p&&/\.(png|jpe?g|gif|webp|svg|ico|bmp)$/i.test(p)}

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
 m.innerHTML='<div class="modal-inner demo-inner"><div class="modal-h"><h3><span>'+t+'</span></h3><div style="display:flex;gap:6px;align-items:center"><a class="vctrl" href="'+u+'" target="_blank" title="Open full screen">↗</a><button class="modal-close" onclick="closeM(\'_if\')">X</button></div></div><div class="modal-body" style="padding:0"><iframe src="'+u+'" style="width:100%;height:100%;border:none"></iframe></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_if')});
}
function md(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/^#### (.*)$/gm,'<h4>$1</h4>').replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/^# (.*)$/gm,'<h2>$1</h2>').replace(/^> (.*)$/gm,'<blockquote>$1</blockquote>').replace(/^[-*] (.*)$/gm,'<li>$1</li>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}
function showPrompt(t,u){
 var m=document.createElement('div');m.className='modal active';m.id='_pr';
 m.innerHTML='<div class="modal-inner"><div class="modal-h"><h3><span>📄 '+t+' — build spec</span></h3><button class="modal-close" onclick="closeM(\'_pr\')">X</button></div><div class="modal-body prompt-body" id="_prb"><div class="modal-loading">Loading prompt…</div></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_pr')});
 fetch(u).then(function(r){return r.text()}).then(function(txt){document.getElementById('_prb').innerHTML=md(txt)}).catch(function(){document.getElementById('_prb').innerHTML='<p style="color:var(--ar)">Could not load prompt</p>'})
}

var dxfV=[];
function openDXF(p){dxfV=[{l:'DXF',p:p}];showDXF('DXF Preview')}
function openDXFM(t,arr){dxfV=arr;showDXF(t)}
function showDXF(t){
 var th='<span>'+t+'</span>';
 if(dxfV.length>1){th+=' <span style="color:var(--t3);font-size:11px">Version:</span> <select id="dxf_vs" onchange="dxfSw(this.value)" style="padding:6px 12px;border-radius:6px;border:1px solid var(--gn);background:var(--sf);color:var(--t2);font-size:13px;cursor:pointer;min-width:140px;font-weight:500">'+dxfV.map(function(x,i){return'<option value="'+i+'">'+x.l+'</option>'}).join('')+'</select>'}
 var m=document.createElement('div');m.className='modal active';m.id='_dxf';
 m.innerHTML='<div class="modal-inner"><div class="modal-h"><h3>'+th+'</h3><div style="display:flex;gap:4px;align-items:center"><button class="vctrl" onclick="downloadDXF()" title="Download DXF">⬇</button><button class="modal-close" onclick="closeM(\'_dxf\')">X</button></div></div><div class="modal-body" id="_dxfb"></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_dxf')});
 drawDXF(dxfV[0].p)
}
/* ---------- DXF geometry helpers ---------- */
function _d2r(a){return a*Math.PI/180}
function _readPairs(lines,i){var pairs=[];i+=2;while(i<lines.length-1){if(lines[i].trim()==='0')break;var c=parseInt(lines[i].trim()),v=(lines[i+1]||'').trim();if(!isNaN(c))pairs.push([lines[i].trim(),v]);i+=2}return {pairs:pairs,next:i}}
function _gv(pairs,code){for(var i=pairs.length-1;i>=0;i--)if(pairs[i][0]===code)return pairs[i][1];return undefined}
function _gvf(pairs,code){var v=_gv(pairs,code);return v===undefined?NaN:parseFloat(v)}
function _all(pairs,code){var r=[];for(var i=0;i<pairs.length;i++)if(pairs[i][0]===code)r.push(pairs[i][1]);return r}
function _arcPts(cx,cy,r,a0,a1,ccw){
 var total=ccw?((a1<a0?a1+2*Math.PI:a1)-a0):((a0<a1?a0+2*Math.PI:a0)-a1);
 var steps=Math.max(8,Math.ceil(Math.abs(total)/(Math.PI/48)));
 var out=[];
 for(var i=0;i<=steps;i++){var a=a0+(ccw?total:-total)*i/steps;out.push({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)})}
 return out;
}
function _bulgeSeg(p1,p2,b,out){
 if(Math.abs(b)<1e-9){out.push({x:p2.x,y:p2.y});return}
 var c=Math.hypot(p2.x-p1.x,p2.y-p1.y);
 if(c<1e-9){out.push({x:p2.x,y:p2.y});return}
 var R=c*(1+b*b)/(4*Math.abs(b));
 var ap=R-Math.abs(b*c/2),sg=b>0?1:-1;
 var dx=p2.x-p1.x,dy=p2.y-p1.y;
 var cx=(p1.x+p2.x)/2+(-dy/c)*ap*sg,cy=(p1.y+p2.y)/2+(dx/c)*ap*sg;
 var a0=Math.atan2(p1.y-cy,p1.x-cx),a1=Math.atan2(p2.y-cy,p2.x-cx);
 var pts=_arcPts(cx,cy,R,a0,a1,b>0);
 for(var i=1;i<pts.length;i++)out.push(pts[i]);
}
function _ellipsePts(cx,cy,mx,my,ratio,a0,a1){
 var full=Math.abs(a1-a0)>=2*Math.PI-1e-6;
 var a1e=full?2*Math.PI:a1;
 var steps=Math.max(24,Math.ceil(Math.abs(a1e-a0)/(Math.PI/48)));
 var out=[];
 for(var i=0;i<=steps;i++){var t=a0+(a1e-a0)*i/steps,ct=Math.cos(t),st=Math.sin(t);out.push({x:cx+mx*ct-my*ratio*st,y:cy+my*ct+mx*ratio*st})}
 return out;
}
function _deBoor(t,p,kn,c){
 var n=c.length-1;
 if(t<=kn[p])t=kn[p]+1e-9;if(t>=kn[n+1])t=kn[n+1]-1e-9;
 var s=p;while(s<kn.length-1&&!(kn[s]<=t&&t<kn[s+1]))s++;
 var d=[];for(var j=0;j<=p;j++)d.push([c[s-p+j][0],c[s-p+j][1]]);
 for(var r=1;r<=p;r++)for(var j=p;j>=r;j--){var den=kn[s+j-r+1]-kn[s-p+j],al=den?(t-kn[s-p+j])/den:0;d[j][0]=(1-al)*d[j-1][0]+al*d[j][0];d[j][1]=(1-al)*d[j-1][1]+al*d[j][1];}
 return d[p];
}
async function drawDXF(p){
 p=EP(p);
 var vb=document.getElementById('_dxfb');
 var holder=document.createElement('div');holder.style.cssText='position:relative;width:100%;height:100%;overflow:hidden;background:#151617;border-radius:10px;cursor:grab;touch-action:none';
 var cv=document.createElement('canvas');cv.style.cssText='position:absolute;left:0;top:0;display:block';
 holder.appendChild(cv);
 var note=document.createElement('div');note.style.cssText='position:absolute;left:10px;bottom:8px;color:#9aa0a8;font-size:11px;font-family:Inter,sans-serif;pointer-events:none;background:rgba(0,0,0,.45);padding:2px 8px;border-radius:6px';
 holder.appendChild(note);
 vb.innerHTML='';vb.appendChild(holder);
 var ctx=cv.getContext('2d');
 var polys=[],ents=0;
 function addPoly(pts,closed){if(pts.length>1)polys.push({p:pts,c:!!closed})}
 try{
  var r=await fetch(p);if(!r.ok)throw new Error('HTTP '+r.status);
  var tx=await r.text();
  var lines=tx.split(/\r?\n/),i=0;
  while(i<lines.length&&lines[i].trim().toUpperCase()!=='ENTITIES')i++;
  i++;
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  function box(x,y){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}
  while(i<lines.length-1){
   var ln=lines[i].trim();
   if(ln.toUpperCase()==='ENDSEC')break;
   if(ln==='0'){
    var etype=(lines[i+1]||'').trim();
    var rp=_readPairs(lines,i),pairs=rp.pairs;i=rp.next;
    if(etype==='LINE'){
     var x1=_gvf(pairs,'10'),y1=_gvf(pairs,'20'),x2=_gvf(pairs,'11'),y2=_gvf(pairs,'21');
     if(!isNaN(x1)&&!isNaN(x2)){ents++;addPoly([{x:x1,y:y1},{x:x2,y:y2}],false);box(x1,y1);box(x2,y2)}
    }else if(etype==='CIRCLE'){
     var cx=_gvf(pairs,'10'),cy=_gvf(pairs,'20'),cr=_gvf(pairs,'40');
     if(!isNaN(cx)&&!isNaN(cr)){ents++;var pc=_arcPts(cx,cy,cr,0,2*Math.PI,true);addPoly(pc,true);box(cx-cr,cy-cr);box(cx+cr,cy+cr)}
    }else if(etype==='ARC'){
     var ax=_gvf(pairs,'10'),ay=_gvf(pairs,'20'),ar=_gvf(pairs,'40'),a0=_d2r(_gvf(pairs,'50')||0),a1=_d2r(_gvf(pairs,'51')||0);
     if(!isNaN(ax)&&!isNaN(ar)){ents++;var pa=_arcPts(ax,ay,ar,a0,a1,true);addPoly(pa,false);for(var q=0;q<pa.length;q++)box(pa[q].x,pa[q].y)}
    }else if(etype==='ELLIPSE'){
     var ex=_gvf(pairs,'10'),ey=_gvf(pairs,'20'),emx=_gvf(pairs,'11'),emy=_gvf(pairs,'21'),er=_gvf(pairs,'40')||1;
     if(!isNaN(ex)&&!isNaN(emx)){ents++;var pe=_ellipsePts(ex,ey,emx,emy,er,_gvf(pairs,'41')||0,_gvf(pairs,'42')||0);addPoly(pe,true);for(var q=0;q<pe.length;q++)box(pe[q].x,pe[q].y)}
    }else if(etype==='LWPOLYLINE'){
     var closed=(parseInt(_gv(pairs,'70'))||0)&1;
     var xs=_all(pairs,'10'),ys=_all(pairs,'20'),bs=_all(pairs,'42');
     if(xs.length>1){
      var verts=[];for(var j=0;j<xs.length;j++)verts.push({x:parseFloat(xs[j]),y:parseFloat(ys[j])||0,b:parseFloat(bs[j])||0});
      var vpts=[{x:verts[0].x,y:verts[0].y}];
      for(var j=1;j<verts.length;j++)_bulgeSeg(vpts[vpts.length-1],{x:verts[j].x,y:verts[j].y},verts[j].b,vpts);
      if(closed)_bulgeSeg(vpts[vpts.length-1],{x:verts[0].x,y:verts[0].y},verts[0].b,vpts);
      addPoly(vpts,closed);ents++;
     }
    }else if(etype==='POLYLINE'){
     var closedP=(parseInt(_gv(pairs,'70'))||0)&1;
     var pverts=[];
     while(i<lines.length-1&&lines[i].trim()==='0'){
      var vt=(lines[i+1]||'').trim();
      if(vt==='SEQEND'){i+=2;break}
      if(vt==='VERTEX'){var vrp=_readPairs(lines,i),vpairs=vrp.pairs;i=vrp.next;
       var vx=_gvf(vpairs,'10'),vy=_gvf(vpairs,'20');
       if(!isNaN(vx)){pverts.push({x:vx,y:vy,b:_gvf(vpairs,'42')||0});box(vx,vy)}}
      else i+=2;
     }
     if(pverts.length>1){var pvpts=[{x:pverts[0].x,y:pverts[0].y}];for(var j=1;j<pverts.length;j++)_bulgeSeg(pvpts[pvpts.length-1],{x:pverts[j].x,y:pverts[j].y},pverts[j].b,pvpts);if(closedP)_bulgeSeg(pvpts[pvpts.length-1],{x:pverts[0].x,y:pverts[0].y},pverts[0].b,pvpts);addPoly(pvpts,closedP);ents++}
    }else if(etype==='SPLINE'){
     var fitX=_all(pairs,'11'),fitY=_all(pairs,'21'),sp=null;
     if(fitX.length>1){sp=[];for(var j=0;j<fitX.length;j++)sp.push({x:parseFloat(fitX[j]),y:parseFloat(fitY[j])||0})}
     else{
      var ctrlX=_all(pairs,'10'),ctrlY=_all(pairs,'20'),deg=parseInt(_gv(pairs,'71'))||3;
      if(ctrlX.length>deg){
       var ctrl=[];for(var j=0;j<ctrlX.length;j++)ctrl.push([parseFloat(ctrlX[j]),parseFloat(ctrlY[j])||0]);
       var knots=_all(pairs,'40').map(parseFloat);
       if(knots.length>=ctrl.length+deg+1){var pts=[];var lo=knots[deg],hi=knots[ctrl.length];var steps=Math.max(32,ctrl.length*8);for(var s2=0;s2<=steps;s2++){var tt=lo+(hi-lo)*s2/steps;var bp=_deBoor(tt,deg,knots,ctrl);pts.push({x:bp[0],y:bp[1]})}sp=pts}
       else sp=ctrl.map(function(cc){return {x:cc[0],y:cc[1]}});
      }
     }
     if(sp&&sp.length>1){ents++;addPoly(sp,false);for(var q=0;q<sp.length;q++)box(sp[q].x,sp[q].y)}
    }
   }else{i++}
  }
  if(ents===0)throw new Error('No supported entities found');
  var view={px:0,py:0,s:1};
  function layout(){
   var dpr=window.devicePixelRatio||1;
   var W=holder.clientWidth||600,H=holder.clientHeight||420;
   cv.width=Math.max(1,Math.round(W*dpr));cv.height=Math.max(1,Math.round(H*dpr));
   cv.style.width=W+'px';cv.style.height=H+'px';
   var pad=44;
   var s=Math.min((W-pad*2)/((maxX-minX)||1),(H-pad*2)/((maxY-minY)||1));
   view.s=s;view.px=(W-(maxX-minX)*s)/2;view.py=(H-(maxY-minY)*s)/2;
   draw();
  }
  function draw(){
   var dpr=window.devicePixelRatio||1;
   ctx.setTransform(dpr,0,0,dpr,0,0);
   ctx.clearRect(0,0,cv.width/dpr,cv.height/dpr);
   ctx.fillStyle='#151617';ctx.fillRect(0,0,cv.width/dpr,cv.height/dpr);
   ctx.save();
   ctx.translate(view.px,view.py);ctx.scale(view.s,view.s);ctx.translate(-minX,-minY);
   ctx.strokeStyle='#7c7bff';ctx.lineWidth=1.4/view.s;ctx.lineJoin='round';ctx.lineCap='round';
   ctx.beginPath();
   for(var k=0;k<polys.length;k++){var pp=polys[k].p;ctx.moveTo(pp[0].x,pp[0].y);for(var q=1;q<pp.length;q++)ctx.lineTo(pp[q].x,pp[q].y);if(pp.length>2&&polys[k].c)ctx.closePath()}
   ctx.stroke();
   ctx.restore();
   note.textContent=ents+' entities · '+polys.length+' paths · scroll=zoom · drag=pan';
  }
  var dragging=false,lx=0,ly=0;
  holder.addEventListener('wheel',function(e){e.preventDefault();var f=e.deltaY<0?1.1:1/1.1;var mx=e.offsetX,my=e.offsetY;var wx=(mx-view.px)/view.s+minX,wy=(my-view.py)/view.s+minY;view.s*=f;view.px=mx-(wx-minX)*view.s;view.py=my-(wy-minY)*view.s;draw()},{passive:false});
  holder.addEventListener('mousedown',function(e){dragging=true;lx=e.clientX;ly=e.clientY;holder.style.cursor='grabbing'});
  window.addEventListener('mousemove',function(e){if(dragging){view.px+=e.clientX-lx;view.py+=e.clientY-ly;lx=e.clientX;ly=e.clientY;draw()}});
  window.addEventListener('mouseup',function(){dragging=false;holder.style.cursor='grab'});
  holder.addEventListener('touchstart',function(e){if(e.touches.length===1){dragging=true;lx=e.touches[0].clientX;ly=e.touches[0].clientY}});
  holder.addEventListener('touchmove',function(e){if(dragging&&e.touches.length===1){e.preventDefault();view.px+=e.touches[0].clientX-lx;view.py+=e.touches[0].clientY-ly;lx=e.touches[0].clientX;ly=e.touches[0].clientY;draw()}},{passive:false});
  holder.addEventListener('touchend',function(){dragging=false});
  var ro=new ResizeObserver(function(){layout()});ro.observe(holder);
  layout();
 }catch(e){vb.innerHTML='<div class="modal-loading"><p style="color:var(--red)">DXF failed to load</p><p style="font-size:11px;color:var(--t4)">'+e.message+'</p></div>'}
}
function dxfSw(i){drawDXF(dxfV[i].p)}
function downloadDXF(){var a=document.createElement('a');a.href=EP(dxfV[0].p);a.download=dxfV[0].p.split('/').pop();document.body.appendChild(a);a.click();a.remove()}
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){closeM('_3d');closeM('_dxf');closeM('_if');closeM('_fb');closeM('_det');closeM('_img');closeM('_txt');closeM('_pr');return}
 // Arrow keys switch versions when viewer is open
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
  var s=document.getElementById('vs_');
  if(s){var idx=parseInt(s.value)+(e.key==='ArrowRight'?1:-1);if(idx>=0&&idx<cv.length){s.value=idx;swV(idx)}}
  var d=document.getElementById('dxf_vs');
  if(d){var di=parseInt(d.value)+(e.key==='ArrowRight'?1:-1);if(di>=0&&di<dxfV.length){d.value=di;dxfSw(di)}}
 }
});

// ==================== NEW: helpers ====================
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function escAttr(s){return esc(s).replace(/'/g,'&#39;')}
function toast(msg){var t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.classList.add('show')},10);setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove()},300)},2600)}

// ==================== NEW: dynamic stats ====================
function updStats(){
 var c={t:D.sw.length+D.hw.length+D.f3d.length+D.des.length,sw:D.sw.length,hw:D.hw.length,f3d:D.f3d.length,des:D.des.length};
 function set(id,v,suf){var el=document.getElementById(id);if(el){el.setAttribute('data-target',v);el.setAttribute('data-suffix',suf);el.textContent=v+suf}}
 set('statTotal',c.t,'+');set('statSW',c.sw,'');set('statHW',c.hw,'');set('statF3d',c.f3d,'+');set('statDes',c.des,'+');
}

// ==================== NEW: admin add/delete ====================
function addProj(cat){
 var p={t:'New Project',s:'draft',d:'Describe this project...',g:[],v:[],a:[],how:'',src:'',howR:1};
 D[cat].push(p);rebuild();saveData();
 var sec=document.getElementById(cat);
 var card=sec?sec.querySelector('.card[data-idx="'+(D[cat].length-1)+'"]'):null;
 if(card)card.scrollIntoView({behavior:'smooth',block:'center'});
}
function delProj(cat,idx){if(!confirm('Delete "'+D[cat][idx].t+'"?'))return;D[cat].splice(idx,1);rebuild();saveData()}

// ==================== NEW: file browser ====================
var FB=null,FINDEX={},FB_CUR='';
function idxTree(n){if(n.path!==undefined)FINDEX[n.path]=n;(n.children||[]).forEach(idxTree)}
function loadFiles(cb){
 if(FB){cb&&cb();return}
 fetch('files.json').then(function(r){return r.json()}).then(function(j){
  FB=j.root;idxTree(FB);if(cb)cb();
 }).catch(function(){toast('Could not load file index')});
}
function openFilesFrom(cat,idx){var p=D[cat][idx];if(p&&p.fl)openFiles(p.fl);else openFiles('')}
function openFiles(folder){
 folder=(folder||'').replace(/^\.\//,'').replace(/\/+$/,'');
 var m=document.createElement('div');m.className='modal active';m.id='_fb';
 m.innerHTML='<div class="modal-inner fb-inner"><div class="modal-h"><h3>📂 Files</h3>'+
  '<div class="fb-search"><input id="_fbs" placeholder="Search files…" oninput="fbSearch(this.value)"></div>'+
  '<button class="modal-close" onclick="closeM(\'_fb\')">X</button></div>'+
  '<div class="fb-bc" id="_fbbc"></div><div class="modal-body fb-body" id="_fbb"><div class="modal-loading">Loading files…</div></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_fb')});
 loadFiles(function(){fbNav(folder)});
}
function fbNav(path){
 path=path||'';
 var n=FINDEX[path];
 if(!n){document.getElementById('_fbb').innerHTML='<div class="fb-empty">Folder not found in index</div>';return}
 FB_CUR=path;
 var parts=path?path.split('/'):[];
 var bc='<a href="javascript:void(0)" onclick="fbNav(\'\')">🏠 root</a>';
 var acc='';
 parts.forEach(function(seg,i){acc+=(acc?'/':'')+seg;var last=i===parts.length-1;
  bc+=last?'<span class="sep">/</span><span class="cur">'+esc(seg)+'</span>':'<span class="sep">/</span><a href="javascript:void(0)" onclick="fbNav(\''+escAttr(acc)+'\')">'+esc(seg)+'</a>';
 });
 document.getElementById('_fbbc').innerHTML=bc;
 var kids=(n.children||[]).slice();
 kids.sort(function(a,b){if(a.type!==b.type)return a.type==='dir'?-1:1;return a.name.toLowerCase()<b.name.toLowerCase()?-1:1});
 var h='';
 if(path)h+='<div class="fbrow up" onclick="fbNav(\''+escAttr(path.split('/').slice(0,-1).join('/'))+'\')"><span class="fi">⬆</span><span class="fn">Parent folder</span><span class="fz"></span></div>';
 if(!kids.length)h+='<div class="fb-empty">This folder is empty</div>';
 kids.forEach(function(k){
  if(k.type==='dir')h+='<div class="fbrow dir" onclick="fbNav(\''+escAttr(k.path)+'\')"><span class="fi">📁</span><span class="fn">'+esc(k.name)+'</span><span class="fz"></span></div>';
  else{var icon={'image':'🖼','stl':'🧊','dxf':'📐','pdf':'📕','text':'📄','binary':'📦'}[k.kind]||'📄';
   h+='<div class="fbrow file" onclick="fbOpen(\''+escAttr(k.path)+'\',\''+k.kind+'\')"><span class="fi">'+icon+'</span><span class="fn">'+esc(k.name)+'</span><span class="fz">'+(k.sizeH||'')+'</span></div>';}
 });
 document.getElementById('_fbb').innerHTML=h;
}
function fbSearch(q){q=(q||'').toLowerCase();document.querySelectorAll('#_fbb .fbrow').forEach(function(r){var fn=r.querySelector('.fn');var n=fn?fn.textContent.toLowerCase():'';r.style.display=(!q||n.indexOf(q)>=0)?'':'none'})}
function fbOpen(path,kind){
 if(kind==='image'){closeM('_fb');showImage(path)}
 else if(kind==='stl'){closeM('_fb');open3D(path)}
 else if(kind==='dxf'){closeM('_fb');openDXF(path)}
 else if(kind==='pdf'){W(path)}
 else if(kind==='text'){fbViewText(path)}
 else{W(path)}
}
function fbViewText(path){
 var m=document.createElement('div');m.className='modal active';m.id='_txt';
 m.innerHTML='<div class="modal-inner fb-inner"><div class="modal-h"><h3>📄 '+esc(path.split('/').pop())+'</h3><div style="display:flex;gap:6px;align-items:center"><a class="vctrl" href="'+EP(path)+'" target="_blank" title="Open raw">↗</a><a class="vctrl" href="'+EP(path)+'" download title="Download">⬇</a><button class="modal-close" onclick="closeM(\'_txt\')">X</button></div></div><div class="modal-body fb-body"><div class="modal-loading">Loading…</div></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_txt')});
 fetch(EP(path)).then(function(r){return r.text()}).then(function(tx){
  var b=document.querySelector('#_txt .modal-body');
  var isMd=/\.md$/i.test(path);
  if(isMd)b.innerHTML='<div class="mdbody">'+md(tx)+'</div>';
  else b.innerHTML='<pre class="codeview">'+esc(tx)+'</pre>';
 }).catch(function(){var b=document.querySelector('#_txt .modal-body');if(b)b.innerHTML='<div class="fb-empty">Could not read file (maybe binary)</div>'});
}

// ==================== NEW: details modal ====================
function openDetails(cat,idx){
 var p=D[cat][idx];
 var em={'sw':'💻','hw':'🔧','f3d':'📐','des':'📄'}[cat]||'📦';
 var m=document.createElement('div');m.className='modal active';m.id='_det';
 var h='<div class="modal-inner det-inner"><div class="modal-h"><h3>'+em+' '+esc(p.t)+'</h3><div style="display:flex;gap:8px;align-items:center"><span class="status '+p.s+'">'+p.s+'</span><button class="modal-close" onclick="closeM(\'_det\')">X</button></div></div>';
 h+='<div class="det-body">';
 h+='<p class="det-desc">'+esc(p.d)+'</p>';
 if(p.how){h+='<h4>⚙️ How it works / how it was made</h4><p class="det-how">'+esc(p.how)+'</p>'}
 if(p.src){h+='<h4>🧰 Materials, tools &amp; sources</h4><p class="det-src">'+esc(p.src)+'</p>'}
 if(p.v&&p.v.length){h+='<h4>🕰 Version history</h4><div class="det-ver">';p.v.forEach(function(x){h+='<div class="vitem"><span class="vbadge'+(x.L?' latest':'')+'">'+esc(x.n)+'</span><div class="vinfo">'+esc(x.i)+'</div></div>'});h+='</div>'}
 if(p.g&&p.g.length){h+='<h4>🏷 Tags</h4><div class="tags">';p.g.forEach(function(x){h+='<span class="tag'+(x.c?' '+x.c:'')+'">'+esc(x.l)+'</span>'});h+='</div>'}
 h+='<div class="actions" style="margin-top:18px">';
 if(p.a)p.a.forEach(function(x,i){h+='<button class="abtn'+(x.c?' '+x.c:'')+'" data-t="'+escAttr(p.t)+'" data-i="'+i+'">'+esc(x.l)+'</button>'});
 if(p.fl)h+='<button class="abtn" onclick="openFiles(\''+escAttr(p.fl)+'\')">📂 View all files</button>';
 if(p.pt)h+='<button class="abtn ac" data-pt="'+escAttr(p.pt)+'" data-ptt="'+escAttr(p.t)+'">📄 Build spec</button>';
 h+='</div>';
 if(editMode)h+='<p class="det-hint">✏️ Edit mode is on — change fields directly on the card, or delete it there.</p>';
 h+='</div></div>';
 m.innerHTML=h;
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_det')});
}

// ==================== NEW: image lightbox ====================
function showImage(p){
 var m=document.createElement('div');m.className='modal active';m.id='_img';
 m.innerHTML='<div class="modal-inner img-inner"><div class="modal-h"><h3>🖼 '+esc(p.split('/').pop())+'</h3><div style="display:flex;gap:6px;align-items:center"><a class="vctrl" href="'+EP(p)+'" download title="Download">⬇</a><button class="modal-close" onclick="closeM(\'_img\')">X</button></div></div><div class="modal-body img-body"><img src="'+EP(p)+'" alt=""></div></div>';
 document.body.appendChild(m);
 m.addEventListener('click',function(e){if(e.target===m)closeM('_img')});
}
