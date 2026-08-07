window.postMessage({ type: "fetchInjectScript" }, "*");
window.addEventListener("message", function (e) {
  if (e.data && e.data.type === "injectScriptResponse") {
    if (e.data.success && e.data.scriptContent) {
      let s = document.createElement("script");
      s.textContent = e.data.scriptContent;
      document.body.appendChild(s);
      s.onload = function () {
        s.parentNode.removeChild(s);
      };
    } else {
      console.error(
        "failed to fetch inject script:",
        e.data.error || "idk error"
      );
    }
  }
});
