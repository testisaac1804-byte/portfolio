// main.js — modified from ha.mr (https://github.com/p2r3/ha.mr, MIT, by p2r3) for
// a1d2.org: branding, generated-link domain, and subdirectory mounting.
import { compress, decompress } from "./compress.js";
import {
  outputAlphabetASCII,
  outputAlphabetQR,
  outputAlphabetEmoji
} from "./alphabets.js";

let qrGenerate, qrMode, qrCorrection;

let domain = window.location.hostname;
// Derived from this module's own URL, so the whole folder can be moved anywhere
// (e.g. /q/ or /tools/) without editing anything.
const mountPath = new URL(import.meta.url).pathname.replace(/\/main\.js$/, "");
const webPort = window.location.port;
if (webPort && webPort !== "80" && webPort !== "443") {
  domain += `:${webPort}`;
}

var settings = {
  emoji: false,
  qr: false
};

const settingsElements = {
  emoji: "#settings-emoji",
  qr: "#settings-qr"
};

for (const setting in settingsElements) {
  const element = document.querySelector(settingsElements[setting]);
  settings[setting] = element.checked;
  element.addEventListener("change", (event) => {
    settings[setting] = element.checked;
    updateOutput();
  });
}

function countSymbols (string, alphabet) {
  let count = 0;
  while (string) {
    const symbol = alphabet.find(c => string.endsWith(c));
    string = string.slice(0, symbol ? -symbol.length : -1);
    count ++;
  }
  return count;
}

const inputLinkElement = document.querySelector("#input-link");
const outputLinkElement = document.querySelector("#output-link");
const outputRatioElement = document.querySelector("#output-ratio");
const queryWarningElement = document.querySelector("#query-warning");

const qrCodeImage = document.querySelector("#qrcode");
const qrCodeCorrectionLevelContainer = document.querySelector("#qr-correct-level-container");
const qrCodeCorrectionLevelElement = document.querySelector("#qr-correct-level");

qrCodeCorrectionLevelElement.addEventListener("input", () => {
  updateOutput();
});

function updateOutput () {
  const input = inputLinkElement.value.trim();
  try {
    const alphabet = settings.emoji ? outputAlphabetEmoji : outputAlphabetASCII;
    const output = compress(input, alphabet);

    // compress.js does not have support for non-http(s) protocols, nor credentials.
    // previously it would silently strip them, but this block makes it reject instead
    // additionally, invalid inputs the compressor would otherwise accept (like "http://") are rejected as well

    // Regex: one or more word [a-zA-Z0-9_] characters, followed by ://. 
    // Underscore is not valid but will get rejected by new URL() anyway
    const hasProtocol = input.match(/\w+:\/\//); 
    const url = new URL(hasProtocol ? input : "http://" + input);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`Invalid protocol: ${url.protocol}. Only http and https are supported.`);
    }

    if (url.username || url.password) {
      throw new Error(`Credentials in URL are not supported`);
    }

    let inputNormalized = input;
    const inputLower = input.toLowerCase();
    if (inputLower.startsWith("https://")) {
      inputNormalized = input.slice(8);
    } else if (inputLower.startsWith("http://")) {
      inputNormalized = input.slice(7);
    }
    let excessiveParams = false;
    if (URL.canParse("http://" + inputNormalized)) {
      const url = new URL("http://" + inputNormalized);
      if (url.searchParams.size > 1) {
        excessiveParams = true;
      }
    }
    if (excessiveParams) {
      queryWarningElement.style.display = "inline";
    } else {
      queryWarningElement.style.display = "none";
    }
    const ratio = (1 - (countSymbols(output, alphabet) + 6) / inputNormalized.length) * 100;
    if (ratio < -300) {
      outputRatioElement.textContent = `Output is much larger than the input`;
      outputRatioElement.style.color = "rgb(255, 50, 50)";
    } else if (ratio < 0) {
      outputRatioElement.textContent = `Output is ${Math.floor(-ratio)}% larger than the input`;
      outputRatioElement.style.color = "rgb(255, 50, 50)";
    } else if (ratio > 0) {
      outputRatioElement.textContent = `Output is ${Math.ceil(ratio)}% smaller than the input`;
      outputRatioElement.style.color = "rgb(15, 190, 15)";
    } else {
      outputRatioElement.textContent = "Output is the same length as the input";
      outputRatioElement.style.color = "gray";
    }
    // Root form, exactly like ha.mr: https://a1d2.org#PAYLOAD
    // Hash rather than a path because the ascii alphabet contains ? # and & which would
    // truncate a path. The page served at "/" carries a lazy decoder for this (see the
    // script at the end of index.html), so no subpath is needed. /q/#PAYLOAD still works
    // too, so previously generated links keep resolving.
    // Root form: a1d2.org#PAYLOAD. The page at "/" shows a confirmation screen with
    // the destination before navigating (see q/decode.js), so the link stays short
    // without hiding where it goes.
    outputLinkElement.textContent = `https://${domain}#${output}`;
    outputLinkElement.href = `https://${domain}#${output}`;
    outputLinkElement.style.color = "";
    if (settings.qr) {
      // Lazyload the qr generator to avoid loading it on a redirect
      if (!qrGenerate) {
        import("./lean-qr/lean-qr.js").then((module) => {
          qrGenerate = module.generate;
          qrMode = module.mode;
          qrCorrection = module.correction;
          updateOutput();
        });
        return;
      }

      const correctionLevels = [qrCorrection.L, qrCorrection.M, qrCorrection.Q, qrCorrection.H];

      qrCodeImage.style.display = "inline";
      qrCodeCorrectionLevelContainer.style.display = "inline";

      const qrCodeDomain = domain.toUpperCase();
      // QR alphanumeric mode is uppercase-only, so the mount path is uppercased
      // here; /Q/* is redirected to /q/* by _redirects.
      const qrCodeLink = `HTTP://${qrCodeDomain}${mountPath.toUpperCase()}/${compress(input, outputAlphabetQR)}`;

      const errorCorrection = correctionLevels[qrCodeCorrectionLevelElement.value];

      const qr = qrGenerate(
        qrMode.alphaNumeric(qrCodeLink),
        {
          minVersion: 1,
          maxVersion: 40,
          minCorrectionLevel: errorCorrection,
          // Lean-qr will choose the highest ECC that will fit in the smallest version, between minCorrectionLevel and maxCorrectionLevel
          maxCorrectionLevel: qrCorrection.H,
        });

      qr.toCanvas(qrCodeImage,
        {
          on:  [0x00, 0x00, 0x00, 0xFF], // black
          off: [0xFF, 0xFF, 0xFF, 0xFF], // white
          pad: 2,
        }
      );
      // Set image width to qr version size + 4px per side padding, scale by 8
      // Otherwise the output will be at 1px scale and impossible to see.
      qrCodeImage.style.width = `${(qr.size + 8) * 8}px`;
      qrCodeImage.style.height = `${(qr.size + 8) * 8}px`;
      qrCodeImage.title = qrCodeLink;

    } else {
      qrCodeImage.style.display = "none";
      qrCodeCorrectionLevelContainer.style.display = "none";
    }
  } catch (e) {
    if (!input.trim()) {
      outputLinkElement.textContent = "Enter a link above to compress";
    } else {
      outputLinkElement.textContent = "Invalid link";
      outputLinkElement.style.color = "rgb(255, 50, 50)";
      console.error(e);
    }
    qrCodeImage.style.display = "none";
    qrCodeCorrectionLevelContainer.style.display = "none";
    outputRatioElement.style.color = "rgba(255, 255, 255, 0)";
    outputLinkElement.removeAttribute("href");
    queryWarningElement.style.display = "none";
  }
}

inputLinkElement.addEventListener("input", () => {
  updateOutput();
});

// ---------- reverse: a compressed link back into the original URL ----------
// Accepts every form the compressor produces, plus a bare payload:
//   https://a1d2.org#PAYLOAD      text links
//   HTTP://A1D2.ORG/Q/PAYLOAD     QR links
//   /q/PAYLOAD, a1d2.org/PAYLOAD  other/older forms
//   PAYLOAD                       just the payload
const reverseInputElement = document.querySelector("#input-reverse");
const reverseOutputElement = document.querySelector("#output-reverse");

const QR_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

function safeDecode (text) {
  try { return decodeURIComponent(text); } catch (e) { return text; }
}

// The format carries no checksum, so decoding with the WRONG alphabet can produce
// convincing-looking nonsense (a random payload once "decoded" to a plausible youtube URL).
// Re-compressing the result is the integrity check: only the correct alphabet reproduces the
// payload exactly, so anything else is rejected.
function decodeWith (payload, alphabets) {
  for (const alphabet of alphabets) {
    try {
      const decoded = decompress(payload, alphabet);
      if (decoded && compress(decoded, alphabet) === payload) return decoded;
    } catch (e) {
      // wrong alphabet for this payload - try the next one
    }
  }
  return null;
}

// Upstream's rule for hash payloads: emoji only when the text uses characters outside the
// ascii alphabet. Keeps the common case a single, unambiguous decode.
function textAlphabets (payload) {
  const usesEmoji = Array.from(payload).some((c) => !outputAlphabetASCII.includes(c));
  return usesEmoji ? [outputAlphabetEmoji] : [outputAlphabetASCII];
}

function reverseLink (text) {
  const input = text.trim();
  if (!input) return null;

  // hash form: everything after the first "#" is the payload
  const hashIndex = input.indexOf("#");
  if (hashIndex !== -1) {
    const payload = safeDecode(input.slice(hashIndex + 1)).replaceAll(" ", "");
    const decoded = payload ? decodeWith(payload, textAlphabets(payload)) : null;
    if (decoded) return decoded;
    // a bare payload may itself contain "#" (the ascii alphabet includes it), so fall
    // through and try the whole input as a payload before giving up
  }

  // path form (QR links), or a bare payload
  let path = input;
  let fromUrl = false;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) {
    try { path = new URL(input).pathname; fromUrl = true; } catch (e) { path = input; }
  }
  path = safeDecode(path).replace(/^\/+/, "").replace(/^[qQ]\//, "").replaceAll(" ", "");
  if (!path) return null;
  // path payloads are QR-encoded; a bare payload could be either, and QR first is only
  // worth trying when every character could actually come from the QR alphabet
  const qrOnly = Array.from(path).every((c) => QR_CHARACTERS.includes(c));
  return decodeWith(path, (fromUrl || qrOnly) ? [outputAlphabetQR].concat(textAlphabets(path)) : textAlphabets(path));
}

function updateReverse () {
  const typed = reverseInputElement.value.trim();
  const decoded = reverseLink(reverseInputElement.value);
  if (decoded) {
    reverseOutputElement.textContent = decoded;
    // only make it clickable when it is an absolute http(s) URL
    if (/^https?:\/\//i.test(decoded)) {
      reverseOutputElement.href = decoded;
    } else {
      reverseOutputElement.removeAttribute("href");
    }
    reverseOutputElement.style.color = "";
  } else {
    reverseOutputElement.removeAttribute("href");
    reverseOutputElement.style.color = typed ? "rgb(255, 50, 50)" : "";
    reverseOutputElement.textContent = typed
      ? "Not a valid compressed link"
      : "Paste a compressed link above";
  }
}

reverseInputElement.addEventListener("input", () => {
  updateReverse();
});

(() => {
  let payload = null;
  let alphabet = outputAlphabetASCII;

  // Get hash value of current address bar
  if (window.location.hash) {
    // Decode hash value in case it's non-ASCII
    payload = decodeURIComponent(window.location.hash.slice(1));
    // Remove all whitespace - we never use whitespace when encoding hash values
    payload = payload.replaceAll(" ", "");
    // Check if input is pure ASCII - potentially unreliable?
    const useEmoji = Array.from(payload).some(c => !outputAlphabetASCII.includes(c));
    alphabet = useEmoji ? outputAlphabetEmoji : outputAlphabetASCII;
  } else {
    // If no hash value, we're likely reading a QR code
    // For that, use the path instead
    // strip the mount path (/q) before decoding the payload
    let path = decodeURIComponent(window.location.pathname);
    if (mountPath && path.startsWith(mountPath)) path = path.slice(mountPath.length);
    payload = path.replace(/^\//, "");
    alphabet = outputAlphabetQR;
  }

  if (payload && payload.trim()) {
    try {
      const target = decompress(payload, alphabet);
      // Redirect straight through - no confirmation screen. The protocol check is not
      // decoration: a payload is opaque data that anyone can craft, so refuse anything
      // that is not http(s) instead of letting it navigate to javascript: or data: here.
      const url = new URL(target);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error(`Refusing to redirect to ${url.protocol}`);
      }
      window.location.replace(url.href);
      return;
    } catch (e) {
      console.warn(`Redirect failed. Could not decode input.`);
      console.error(e);
    }
  }

  updateOutput();

  document.querySelector("#content").style.opacity = 1;
  document.querySelector("#content").style.pointerEvents = "auto";
  document.querySelector("header").style.opacity = 1;
  document.querySelector("header").style.pointerEvents = "auto";

})();
