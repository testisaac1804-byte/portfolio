"use strict";
let b = document.createElement("style");
b.type = "text/css";
b.innerText = `@font-face {font-family: 'FrostSans';src: url('${chrome.runtime.getURL(
  "static/frostsans.ttf"
)}') format('truetype')}`;
let c;
document.body.appendChild(b);
if (window.location.hostname.endsWith("drfrost.org")) {
  let a = document.createElement("script");
  a.src = chrome.runtime.getURL("scripts/injector.js");
  (document.head || document.documentElement).appendChild(a);
  a.onload = function () {
    a.parentNode.removeChild(a);
  };
  chrome.runtime.sendMessage({ message: "getCookie" }, (d) => {
    c = d.cookie;
  });
}
window.addEventListener(
  "message",
  (a) => {
    if (a.data && a.data.type === "fetchInjectScript") {
      chrome.runtime.sendMessage(
        { message: "fetchInjectScript" },
        (response) => {
          window.postMessage(
            {
              type: "injectScriptResponse",
              success: response?.success || false,
              scriptContent: response?.scriptContent,
              error: response?.error,
            },
            "*"
          );
        }
      );
    }
    if (a.data && a.data.type === "fetchRequest") {
      chrome.runtime.sendMessage(
        {
          message: "proxyFetch",
          id: a.data.id,
          url: a.data.url,
          method: a.data.options?.method || "GET",
          headers: a.data.options?.headers || {},
          body: a.data.options?.body,
        },
        (response) => {
          window.postMessage(
            {
              type: "fetchResponse",
              id: a.data.id,
              success: response?.success || false,
              ok: response?.ok,
              status: response?.status,
              statusText: response?.statusText,
              text: response?.text,
              headers: response?.headers,
              error: response?.error,
            },
            "*"
          );
        }
      );
    }
    "addedEL" === a.data &&
      (console.log("got request"),
      c
        ? (document.getElementById("SESSION-HERE").value = c)
        : console.log("Cookie not available yet"));
  },
  !1
);
