/**
 * 3D Model Upload — Google Apps Script Backend
 *
 * Receives form-encoded file uploads from the HTML form,
 * sends email to stlfilereceiver@gmail.com with the file attached.
 *
 * Hardened (2026-10): all spam checks are now enforced HERE on the server,
 * not just in the browser:
 *   - honeypot field must be empty (bots fill every input)
 *   - math verification answer must be correct (form sends trap + operands)
 *   - sender email must be a real-looking address
 *   - per-email rate cap (few/hour) + global daily cap (stops inbox flooding)
 *
 * Returns HTML with postMessage to the parent window (CORS-free).
 */

var CONFIG = {
  RECIPIENT_EMAIL: 'stlfilereceiver@gmail.com',
  MAX_FILE_SIZE: 20 * 1024 * 1024,
  SUBJECT_PREFIX: '[3D Model Upload]',
  // A shared secret baked into BOTH the form and this script. It is not real
  // security on its own (anyone can read the page source), but it stops the
  // laziest scanners that POST blind to the script URL without a token.
  FORM_SECRET: 'isaac-3d-upload-v2-7f2c9a',
  // Rate caps (enforced server-side):
  GLOBAL_MAX_PER_DAY: 20,
  PER_EMAIL_MAX_PER_HOUR: 3
};

function doPost(e) {
  var result;
  try {
    result = handleUpload(e.parameter);
  } catch (err) {
    result = { success: false, error: 'Server error: ' + err.toString() };
  }
  return htmlResponse(result);
}

function doGet(e) {
  return htmlResponse({ success: true, message: 'API is running' });
}

function handleUpload(p) {
  // ---- 1. Shared secret gate (stops blind POSTs) ----
  if (!p || !p.secret || p.secret !== CONFIG.FORM_SECRET) {
    return { success: false, error: 'Missing or invalid submission token.' };
  }

  // ---- 2. Honeypot: a real human never fills a hidden field ----
  if (p.website && String(p.website).length > 0) {
    return { success: true, message: 'File sent successfully!' }; // silently swallow bots
  }

  // ---- 3. Math verification (server-side this time) ----
  // Form sends trap = "va+vb" and ans = the human's answer. Recompute here.
  var trap = String(p.trap || '');
  var m = trap.match(/^(\d+)\s*\+\s*(\d+)$/);
  if (!m) return { success: false, error: 'Verification failed — please try again.' };
  var expected = Number(m[1]) + Number(m[2]);
  if (Number(p.ans) !== expected) {
    return { success: false, error: 'Incorrect verification answer — please try again.' };
  }

  // ---- 4. Basic required fields ----
  if (!p.fileName || !p.fileData || !p.senderEmail) {
    return { success: false, error: 'Missing required fields' };
  }
  if (!p.senderName) return { success: false, error: 'Missing sender name' };
  if (!p.tech) return { success: false, error: 'Missing technology type' };

  // ---- 5. Sender email format ----
  var email = String(p.senderEmail).trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // ---- 6. Rate caps (per-email + global daily) ----
  var props = PropertiesService.getScriptProperties();
  var now = new Date();
  var dayKey = 'upload_day:' + now.toISOString().slice(0, 10); // YYYY-MM-DD
  var daily = Number(props.getProperty(dayKey) || '0');
  if (daily >= CONFIG.GLOBAL_MAX_PER_DAY) {
    return { success: false, error: 'Too many uploads today — please try again tomorrow.' };
  }

  var emailHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, email)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
  var cache = CacheService.getScriptCache();
  var hk = 'upl_em:' + emailHash;
  var hourHits = Number(cache.get(hk) || '0');
  if (hourHits >= CONFIG.PER_EMAIL_MAX_PER_HOUR) {
    return { success: false, error: 'Too many uploads from this address — please wait an hour.' };
  }

  // ---- 7. Decode the file ----
  var fileBlob;
  try {
    var match = p.fileData.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error('Invalid data URL');
    var decoded = Utilities.base64Decode(match[2]);
    fileBlob = Utilities.newBlob(decoded, match[1], p.fileName);
  } catch (err) {
    return { success: false, error: 'Failed to decode file' };
  }
  if (fileBlob.getBytes().length > CONFIG.MAX_FILE_SIZE) {
    return { success: false, error: 'File too large (max 20MB)' };
  }

  // ---- 8. Send email ----
  var techName = p.techName || p.tech;
  var body = '📦 NEW 3D MODEL UPLOAD\n\n' +
    '📁 File: ' + p.fileName + '\n' +
    '📏 Size: ' + (p.fileSize || 'Unknown') + '\n' +
    '🔧 Technology: ' + techName + '\n\n' +
    '👤 Sender: ' + p.senderName + '\n' +
    '📧 Email: ' + email + '\n';
  if (p.notes) body += '\n📝 Notes:\n' + p.notes + '\n';
  body += '\n🕐 ' + now.toISOString();

  try {
    GmailApp.sendEmail(CONFIG.RECIPIENT_EMAIL,
      CONFIG.SUBJECT_PREFIX + ' ' + techName + ' — ' + p.fileName + ' from ' + p.senderName,
      body,
      { name: p.fileName, attachments: [fileBlob], replyTo: email }
    );
    // Bump counters only after a successful send
    props.setProperty(dayKey, String(daily + 1));
    cache.put(hk, String(hourHits + 1), 3600);
    return { success: true, message: 'File sent successfully!' };
  } catch (mailErr) {
    return { success: false, error: 'Email failed: ' + mailErr.toString() };
  }
}

function htmlResponse(obj) {
  var json = JSON.stringify(obj);
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><script>window.parent.postMessage(' + json + ',"*");</script>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}