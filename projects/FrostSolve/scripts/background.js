let config = { cookieName: "_df_session", version: 1 };
chrome.storage.local.get(["extensionConfig", "configTimestamp"], (result) => {
  if (result.extensionConfig) {
    config = result.extensionConfig;
    console.log("Loaded config from storage:", config);
  }
  fetchConfig();
});
function fetchConfig() {
  fetch("https://api.slikc.me/api/ext/config", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to fetch config: ${response.status}`);
    })
    .then((serverConfig) => {
      config = {
        cookieName: serverConfig.cookieName || config.cookieName,
        version: serverConfig.version || config.version,
      };
      chrome.storage.local.set({
        extensionConfig: config,
        configTimestamp: Date.now(),
      });
      console.log("Config updated:", config);
    })
    .catch((error) => {
      console.error("Error fetching config, using fallback:", error);
    });
}
setInterval(() => {
  fetchConfig();
}, 10 * 60 * 1000);
chrome.runtime.onMessage.addListener((e, o, t) => {
  if ("getCookie" === e.message) {
    chrome.cookies.getAll({ url: "https://www.drfrost.org" }).then((e) => {
      console.log(e);
      const o = e.filter((e) => config.cookieName === e.name);
      o.length > 0 ? t({ cookie: o[0].value }) : t({ cookie: null });
    });
    return true;
  }
  if ("fetchInjectScript" === e.message) {
    fetch("https://api.slikc.me/api/ext/inject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        }
        throw new Error(`Failed to fetch inject script: ${response.status}`);
      })
      .then((scriptContent) => {
        t({ success: true, scriptContent: scriptContent });
      })
      .catch((error) => {
        console.error("Error fetching inject script:", error);
        t({ success: false, error: error.message });
      });
    return true;
  }
  if ("proxyFetch" === e.message) {
    fetch(e.url, {
      method: e.method || "GET",
      headers: e.headers || {},
      body: e.body,
    })
      .then((response) => {
        return response.text().then((text) => {
          let jsonData = null;
          try {
            jsonData = JSON.parse(text);
          } catch (err) {}
          return {
            success: true,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            text: text,
            headers: Object.fromEntries(response.headers.entries()),
            json: jsonData,
          };
        });
      })
      .then((data) => {
        t(data);
      })
      .catch((error) => {
        console.error("Error in proxy fetch:", error);
        t({ success: false, error: error.message });
      });
    return true;
  }
  return true;
});
