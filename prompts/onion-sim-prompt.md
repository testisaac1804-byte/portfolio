# Red Star 暗網模擬器 · ONION SIM

**Category:** Software & Apps · **Status:** Done

用 Mac 上真實的 Red Star Browser 介面包住一個虛構 `.onion` 網絡的教育模擬器 — 所有商品、店鋪、交易 100% 虛構，只重現有文獻紀錄的詐騙手法。

**Stack / Tools:** Cloudflare Worker + KV（免費，無卡）、單檔內嵌 SPA、Playwright 驗收、Wikimedia Commons 圖片（公有領域）、Red Star Browser UI 規格抽取

**Build path:**
- V1 — Tor 引導日誌、3 跳電路、Hidden Wiki、26 件市集（託管／無託管）、PGP 指紋、三個詐騙站、TorMail 故事、DarkLeaks＋red room 密碼題、ONION NEWS＋查封頁、Checkpoint、KV 真論壇（可發帖、管理員刪帖）。
- V2 — 換成 Red Star Browser 介面：palette `#e8112d`、工具列（H54，圖示 x=10/50/90/130）、分頁列（H36，180×26，stride 186，點右側 20px 或中鍵關閉）、★ PROTECTED 盾牌、選單與快捷鍵照抄；加 Lockdown Mode（⇧⌘L）、Tor/SOCKS 開關（⇧⌘P）、Burn All Data Now、clearnet 頁、WebKit 錯誤頁；57 項自動驗收。

**Location:** https://onion-sim.isaac1804.workers.dev · `~/Documents/projects/apps/onion-sim`

**Build notes:**
- 架構：Worker 同源服務 SPA（`build.js` 把 `client/*.js` 內嵌成 `dist/worker.js`，一定要用 function replacer，否則 `$$` 會被吃掉）+ `/api/forum*` KV 後端。`./deploy.sh` 會 build → `node --check` 兩個產物 → deploy。
- 56 字 v3 onion 地址用 FNV-1a + LCG 生成，**必須用 `Math.imul`**：`seed * 1103515245` 超過 2^53 會令低位全變 0，每個站都出 `aaaa…`。
- **Worker 每個 route 必須回 Response**：回傳普通 object 會在 KV 寫入之後才丟 `error code: 1101`，資料入庫但客戶端見到 500。build gate：`if (/return\s*\{/.test(src)) fail`。
- 真實 app 規格抽取：`/Applications/RedStarBrowser/redstar_app.py`（PyObjC）。重點陷阱 — AppKit 大寫 `keyEquivalent` 代表 Shift（`"L"`=⌘⇧L、`"l"`=⌘L，容易裝反）；toolbar 在 tab strip **上面**；單鍵 NSAlert 會令「唔要」這個選擇消失（買單／錢包騙局一定要有 Cancel）；控制項不可靠 dialog callback 才 re-enable（會永久卡在 WORKING…）。
- UI 版權／安全：站內每個假頁都有 SIMULATION 橫幅，視窗下方長註聲明虛構；管理密碼只放 Worker secret（`ADMIN_PW`），源碼與 API 都不回傳。
- 驗收：`ADMIN_PW=<pw> python3 scripts/acceptance_ui.py` → 57/57、0 console error、0 page error、~43 張圖 200。截圖：`python3 scripts/shots.py`。
