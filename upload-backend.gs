/**
 * 3D Model Upload — Google Apps Script Backend
 * 
 * Receives form-encoded file uploads from the HTML form,
 * sends email to stlfilereceiver@gmail.com with the file attached.
 * 
 * Returns HTML with postMessage to the parent window (CORS-free).
 */

var CONFIG = {
  RECIPIENT_EMAIL: 'stlfilereceiver@gmail.com',
  MAX_FILE_SIZE: 20 * 1024 * 1024,
  SUBJECT_PREFIX: '[3D Model Upload]'
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
  if (!p.fileName || !p.fileData || !p.senderEmail) {
    return { success: false, error: 'Missing required fields' };
  }
  if (!p.senderName) {
    return { success: false, error: 'Missing sender name' };
  }
  if (!p.tech) {
    return { success: false, error: 'Missing technology type' };
  }

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

  var techName = p.techName || p.tech;
  var body = '📦 NEW 3D MODEL UPLOAD\n\n' +
    '📁 File: ' + p.fileName + '\n' +
    '📏 Size: ' + (p.fileSize || 'Unknown') + '\n' +
    '🔧 Technology: ' + techName + '\n\n' +
    '👤 Sender: ' + p.senderName + '\n' +
    '📧 Email: ' + p.senderEmail + '\n';
  if (p.notes) body += '\n📝 Notes:\n' + p.notes + '\n';
  body += '\n🕐 ' + new Date().toISOString();

  try {
    GmailApp.sendEmail(CONFIG.RECIPIENT_EMAIL,
      CONFIG.SUBJECT_PREFIX + ' ' + techName + ' — ' + p.fileName + ' from ' + p.senderName,
      body,
      { name: p.fileName, attachments: [fileBlob], replyTo: p.senderEmail }
    );
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