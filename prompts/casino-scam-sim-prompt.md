# 218/213 騙局複刻模擬器 (Casino Scam Replica Simulator)

**Category:** Software & Apps · **Status:** Done

逐頁複刻兩個真實非法賭博網站 —— **218.com（永誠貴賓會，BBIN 白標）** 與 **213.com（PG娛樂 / TruckSDK 門戶農場）** —— 的反詐教學工具。外觀與原站一致，但**所有按鈕只連到本地模擬**：不會連上賭場、不下載任何東西、不收集任何資料。

**Stack / Tools:** HTML · CSS · Vanilla JS · Security · Anti-scam education

**Location:** `demos/casino-scam-sim/`

## 頁面

| 檔案 | 內容 |
|---|---|
| `sim.html` | 首頁 / 總覽 —— 入口頁、備用網址、門戶、遊戲、客服、導覽、App、後台、調查檔案 |
| `loading.html` | 218.com 入口頁複刻：畫面只有「Loading...」，真正工作是 base64 隱藏跳轉 |
| `hub.html` | 218yc.com 官方備用網址資訊站複刻（5 條線路 + 延時數字） |
| `door.html` | 213.com 歡迎回家門戶複刻（商戶 FNQ2、在線客服、97聊天、假瀏覽器下載列） |
| `lobby.html` | 遊戲大廳模擬：百家樂 / 輪盤 / 龍虎鬥 / 老虎機 / 體育，虛擬籌碼 + 真實莊家優勢，「提款」永遠審核中 |
| `chat.html` | 在線客服「小美」練功房：模擬詐騙話術與「解鎖費」表演 |
| `app.html` | 218 App 啟動頁複刻 + AES-256-ECB 三次加密握手解密教學 |
| `backoffice.html` | 代理後台示意（ag.218920.com，Vue3 管理面板）：會員、注單、佣金、IP 白名單、2FA |
| `tour.html` | 深度導覽：10 課講完整條詐騙產業鏈 + 12 條黑話術語表 + 10 題測驗 |
| `investigation-file.md` | 完整調查檔案：網域池、伺服器、加密破解、舉報渠道 |

## 建構方式

1. 由真實網站存檔（HTTrack / 手動 wget）取得頁面結構與素材，存為 `hub_files/`、`213_files/`。
2. 逐頁重寫為本地模擬頁：保留原站視覺與流程，但把每個連外按鈕改為 `sim.js` 的本地動作。
3. `sim.js` 負責：頁面名稱、詐騙手法收集（🚩 X/8）、術語表、測驗評分 —— 全部純前端，無任何網路請求。
4. 素材與頁面皆為自帶資源（self-contained），可直接以 `python3 -m http.server` 開啟。

## 驗證

- 內部連結全部指向本地頁（`index.html` → `sim.html`），無外部依賴。
- `sim.js` 內無 `fetch` / `XMLHttpRequest` —— 確認不會對外連線。
- 無障礙：所有「開啟」按鈕導向本地模擬頁，不會觸發真實賭場網址。
