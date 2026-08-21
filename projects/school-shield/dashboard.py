"""School Shield Dashboard — live status page."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from detector import get_network_info, get_current_wifi, get_current_dns, is_school_network
from firewall import status as fw_status

DASHBOARD_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>School Shield</title>
    <style>
        :root {
            --bg: #0d1117; --card: #161b22; --border: #30363d;
            --text: #c9d1d9; --muted: #8b949e; --accent: #58a6ff;
            --green: #3fb950; --red: #f85149; --yellow: #d2991d;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg); color: var(--text);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .container { max-width: 500px; width: 100%; padding: 2rem; }
        .status-badge {
            text-align: center; padding: 3rem 2rem; border-radius: 16px;
            margin-bottom: 2rem; transition: all 0.3s;
        }
        .protected { background: linear-gradient(135deg, #0a2e0a 0%, #0d1117 100%); border: 2px solid var(--green); }
        .exposed { background: linear-gradient(135deg, #2e0a0a 0%, #0d1117 100%); border: 2px solid var(--red); }
        .status-icon { font-size: 4rem; margin-bottom: 1rem; }
        .status-text { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
        .status-sub { color: var(--muted); font-size: 1rem; }
        .info-card {
            background: var(--card); border: 1px solid var(--border);
            border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem;
            display: flex; justify-content: space-between; align-items: center;
        }
        .info-label { color: var(--muted); font-size: 0.9rem; }
        .info-value { font-weight: 600; font-size: 0.95rem; }
        .green { color: var(--green); } .red { color: var(--red); } .yellow { color: var(--yellow); }
        .actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        .btn {
            flex: 1; padding: 0.75rem; border: none; border-radius: 8px;
            font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
            text-align: center; text-decoration: none;
        }
        .btn-protect { background: var(--green); color: #000; }
        .btn-expose { background: var(--red); color: #fff; }
        .btn:hover { opacity: 0.85; }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .footer { text-align: center; color: var(--muted); font-size: 0.75rem; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-badge" id="status-badge">
            <div class="status-icon" id="status-icon">⏳</div>
            <div class="status-text" id="status-text">Checking...</div>
            <div class="status-sub" id="status-sub"></div>
        </div>

        <div class="info-card">
            <span class="info-label">📡 WiFi</span>
            <span class="info-value" id="wifi">—</span>
        </div>
        <div class="info-card">
            <span class="info-label">🏫 School Network</span>
            <span class="info-value" id="school">—</span>
        </div>
        <div class="info-card">
            <span class="info-label">🔐 DoH</span>
            <span class="info-value" id="doh">—</span>
        </div>
        <div class="info-card">
            <span class="info-label">🔑 DNS</span>
            <span class="info-value" id="dns">—</span>
        </div>
        <div class="info-card">
            <span class="info-label">🛡️ Firewall</span>
            <span class="info-value" id="fw">—</span>
        </div>
    </div>
    <div class="footer">School Shield v0.1 · Auto-refresh 3s</div>

    <script>
        async function update() {
            try {
                const resp = await fetch("/status");
                const data = await resp.json();
                const protected = data.protection === "PROTECTED";

                const badge = document.getElementById("status-badge");
                badge.className = "status-badge " + (protected ? "protected" : "exposed");

                document.getElementById("status-icon").textContent = protected ? "🛡️" : "⚠️";
                document.getElementById("status-text").textContent = protected ? "PROTECTED" : "EXPOSED";
                document.getElementById("status-text").className = "status-text " + (protected ? "green" : "red");
                document.getElementById("status-sub").textContent = protected
                    ? "School can't see your traffic"
                    : "School can monitor your activity";

                document.getElementById("wifi").textContent = data.wifi_ssid || "—";
                document.getElementById("school").textContent = data.is_school ? "✅ Yes" : "❌ No";
                document.getElementById("school").className = "info-value " + (data.is_school ? "yellow" : "");
                document.getElementById("doh").textContent = data.doh_active ? "✅ Active" : "❌ Off";
                document.getElementById("doh").className = "info-value " + (data.doh_active ? "green" : "red");
                document.getElementById("dns").textContent = data.dns_servers?.join(", ") || "Default";
                const fwActive = data.firewall_active;
                document.getElementById("fw").textContent = fwActive ? `✅ Active (${data.firewall_rules} rules)` : "❌ Off";
                document.getElementById("fw").className = "info-value " + (fwActive ? "green" : "red");
            } catch (e) {
                document.getElementById("status-text").textContent = "OFFLINE";
            }
        }
        update();
        setInterval(update, 3000);
    </script>
</body>
</html>"""


def create_app() -> FastAPI:
    app = FastAPI(title="School Shield")

    @app.get("/", response_class=HTMLResponse)
    async def index():
        return DASHBOARD_HTML

    @app.get("/status")
    async def status():
        info = get_network_info()
        fw = fw_status()
        info["firewall_active"] = fw["enabled"]
        info["firewall_rules"] = fw["rule_count"]
        return info

    return app
