// WiFi Monitor — portable scanner on ESP32-C3
// Creates an AP, scans nearby networks, shows live stats on a web page.
// Walk around with it plugged into a power bank, view on your phone.

#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <LittleFS.h>

WebServer web(80);
bool apMode = true;

const char PAGE[] PROGMEM = R"HTML(<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>WiFi Monitor</title><style>
body{font:14px system-ui,sans-serif;margin:0;background:#0d1117;color:#c9d1d9}
header{background:#161b22;padding:12px 18px;border-bottom:1px solid #30363d;display:flex;justify-content:space-between;align-items:center}
h1{margin:0;font-size:16px}h1 span{color:#3fb950}
button{background:#21262d;color:#c9d1d9;border:1px solid #30363d;border-radius:5px;padding:6px 12px;cursor:pointer;font-size:13px}
.wrap{padding:14px;max-width:700px;margin:auto}
table{width:100%;border-collapse:collapse;background:#161b22;border-radius:8px;overflow:hidden}
th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #21262d;font-size:13px}
th{background:#21262d;color:#8b949e;position:sticky;top:0}
.bar{height:4px;border-radius:2px;transition:width .3s}
.bar.good{background:#3fb950}.bar.ok{background:#d29922}.bar.bad{background:#f85149}
.mono{font-family:monospace;font-size:12px}.dim{color:#8b949e;font-size:12px}
.spin{display:inline-block;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
#time{color:#8b949e;font-size:12px}
</style></head><body>
<header><h1>&#x1f4f6; WiFi Monitor <span id=time></span></h1>
<button onclick=toggle() id=btn>Auto &#x25b6;</button></header>
<div class=wrap><table id=tbl><thead><tr><th>Network</th><th>CH</th><th>Signal</th><th>Strength</th><th>MAC</th></tr></thead><tbody></tbody></table></div>
<script>
let running=true;
async function scan(){
  if(!running)return;
  document.getElementById('time').innerHTML='<span class=spin>&#x21bb;</span>';
  try{
    let r=await fetch('/scan.json');
    if(!r.ok)throw new Error('fail');
    let d=await r.json();
    render(d);
    document.getElementById('time').textContent='just now';
  }catch(e){document.getElementById('time').textContent='scan failed';}
}
function render(nets){
  let t=document.getElementById('tbl').tBodies[0];
  let rows=nets.map((n,i)=>{
    let cls=n.rssi>-60?'good':n.rssi>-75?'ok':'bad';
    return '<tr><td>'+h(n.ssid)+(n.open?' <span class=dim>open</span>':'')+'</td><td class=mono>'+n.ch+'</td>'+
    '<td><div class="bar '+cls+'" style="width:'+Math.max(5,100-(-n.rssi-30)*3)+'%"></div></td>'+
    '<td class=mono>'+n.rssi+' dBm</td><td class=mono>'+n.mac+'</td></tr>';
  }).join('');
  t.innerHTML=rows||'<tr><td colspan=5 class=dim>no networks found</td></tr>';
}
function h(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function toggle(){
  running=!running;
  document.getElementById('btn').innerHTML=running?'Auto &#x25a0;':'Auto &#x25b6;';
  if(running)scan();
}
scan();setInterval(scan,2000);
</script></body></html>)HTML";

void setup() {
  Serial.begin(115200); delay(300);
  Serial.println("\nWiFi Monitor");

  // AP mode — connect your phone to see the scanner
  WiFi.mode(WIFI_AP);
  uint8_t mac[6]; esp_read_mac(mac, ESP_MAC_WIFI_SOFTAP);
  char apName[32]; snprintf(apName, sizeof(apName), "WiFi-Mon-%02X%02X", mac[4], mac[5]);
  WiFi.softAP(apName, nullptr, 6, 0, 4);
  Serial.printf("AP: %s -> http://192.168.4.1\n", apName);

  web.on("/", []() { web.send_P(200, "text/html", PAGE); });
  web.on("/scan.json", []() {
    int n = WiFi.scanNetworks(false, true);  // async=false, show_hidden=true
    String j = "[";
    for (int i = 0; i < n; i++) {
      if (i) j += ",";
      String ssid = WiFi.SSID(i);
      ssid.replace("\\", "\\\\"); ssid.replace("\"", "\\\"");
      if (ssid.length() == 0) ssid = "(hidden)";
      char macStr[18];
      uint8_t* bssid = WiFi.BSSID(i);
      snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
               bssid[0], bssid[1], bssid[2], bssid[3], bssid[4], bssid[5]);
      j += "{\"ssid\":\"" + ssid + "\",\"ch\":" + WiFi.channel(i) +
           ",\"rssi\":" + WiFi.RSSI(i) +
           ",\"open\":" + (WiFi.encryptionType(i) == WIFI_AUTH_OPEN ? "true" : "false") +
           ",\"mac\":\"" + String(macStr) + "\"}";
    }
    j += "]";
    WiFi.scanDelete();
    web.send(200, "application/json", j);
  });
  web.begin();
  Serial.println("ready — open http://192.168.4.1 on your phone");
}

void loop() {
  web.handleClient();
  delay(1);
}
