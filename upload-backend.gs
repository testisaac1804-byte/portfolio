/**
 * 3D Model Upload — Google Apps Script Backend
 * 
 * Receives file uploads from the HTML form, sends email to stlfilereceiver@gmail.com
 * with the file attached.
 * 
 * DEPLOYMENT:
 * 1. Go to https://script.google.com/
 * 2. Create a new project, paste this code
 * 3. Click Deploy → New Deployment → Web App
 * 4. Execute as: "Me", Who has access: "Anyone"
 * 5. Copy the web app URL and paste it into upload.html as U.API_URL
 */

// ===== CONFIGURATION =====
var CONFIG = {
  RECIPIENT_EMAIL: 'stlfilereceiver@gmail.com',
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
  SUBJECT_PREFIX: '[3D Model Upload]',
  REPLY_TO: null // Will be set to sender's email dynamically
};

// ===== Web App Entry Point =====
function doPost(e) {
  try {
    // Parse the JSON body
    var payload = JSON.parse(e.postData.contents);
    return handleUpload(payload);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Invalid request: ' + err.toString() });
  }
}

// Allow GET for CORS preflight / health check
function doGet(e) {
  return jsonResponse({ success: true, message: '3D Model Upload API is running', version: '1.0' });
}

// ===== Main Handler =====
function handleUpload(payload) {
  // Validate required fields
  if (!payload.fileName || !payload.fileData || !payload.senderEmail) {
    return jsonResponse({ success: false, error: 'Missing required fields (fileName, fileData, senderEmail)' });
  }

  if (!payload.senderName) {
    return jsonResponse({ success: false, error: 'Missing sender name' });
  }

  if (!payload.tech) {
    return jsonResponse({ success: false, error: 'Missing technology type' });
  }

  // Validate email format
  if (!isValidEmail(payload.senderEmail)) {
    return jsonResponse({ success: false, error: 'Invalid email address' });
  }

  // Parse the data URL to get the file blob
  var fileBlob;
  try {
    fileBlob = dataUrlToBlob(payload.fileData);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Failed to decode file: ' + err.toString() });
  }

  // Check file size
  if (fileBlob.getBytes().length > CONFIG.MAX_FILE_SIZE) {
    return jsonResponse({ success: false, error: 'File exceeds maximum size of 20MB' });
  }

  // Build email body
  var techName = payload.techName || payload.tech;
  var emailBody = buildEmailBody(payload);

  // Send email
  try {
    GmailApp.sendEmail(
      CONFIG.RECIPIENT_EMAIL,
      CONFIG.SUBJECT_PREFIX + ' ' + techName + ' — ' + payload.fileName + ' from ' + payload.senderName,
      emailBody,
      {
        name: payload.fileName,
        attachments: [fileBlob],
        replyTo: payload.senderEmail
      }
    );

    // Log the submission
    logSubmission(payload);

    return jsonResponse({ success: true, message: 'File received and forwarded successfully.' });
  } catch (mailErr) {
    // Check for attachment size limit
    if (mailErr.toString().indexOf('attachment') > -1 || mailErr.toString().indexOf('size') > -1) {
      return jsonResponse({ success: false, error: 'File too large for email (max 25MB with encoding). Please use a smaller file.' });
    }
    return jsonResponse({ success: false, error: 'Failed to send email: ' + mailErr.toString() });
  }
}

// ===== Helpers =====

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function dataUrlToBlob(dataUrl) {
  // dataUrl format: "data:mime/type;base64,XXXXX"
  var match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL format');
  }
  var mimeType = match[1];
  var base64 = match[2];
  var decoded = Utilities.base64Decode(base64);
  return Utilities.newBlob(decoded, mimeType, '');
}

function buildEmailBody(payload) {
  var lines = [];
  lines.push('📦 NEW 3D MODEL UPLOAD');
  lines.push('');
  lines.push('──────────────────────────────');
  lines.push('');

  lines.push('📁 File: ' + payload.fileName);
  lines.push('📏 Size: ' + formatBytes(payload.fileSize || 0));
  lines.push('🔧 Technology: ' + (payload.techName || payload.tech));
  lines.push('');

  lines.push('👤 Sender: ' + payload.senderName);
  lines.push('📧 Email: ' + payload.senderEmail);
  lines.push('');

  if (payload.notes && payload.notes.trim()) {
    lines.push('📝 Notes:');
    lines.push(payload.notes);
    lines.push('');
  }

  lines.push('🕐 Submitted: ' + (payload.timestamp || new Date().toISOString()));
  lines.push('');
  lines.push('──────────────────────────────');
  lines.push('Sent via Isaac\'s 3D Model Upload Service');

  return lines.join('\n');
}

function formatBytes(bytes) {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function logSubmission(payload) {
  // Log to a sheet if available, otherwise just log
  var sheet;
  try {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
  } catch (e) {
    // No spreadsheet attached — just use Logger
    Logger.log('Upload: %s (%s) from %s <%s> — %s',
      payload.fileName,
      formatBytes(payload.fileSize),
      payload.senderName,
      payload.senderEmail,
      payload.techName || payload.tech
    );
    return;
  }

  if (!sheet) {
    try {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Submissions');
      sheet.appendRow(['Timestamp', 'File Name', 'File Size', 'Technology', 'Sender Name', 'Sender Email', 'Notes', 'Status']);
    } catch (e2) {
      Logger.log('Could not create sheet: ' + e2);
      return;
    }
  }

  sheet.appendRow([
    payload.timestamp || new Date().toISOString(),
    payload.fileName,
    formatBytes(payload.fileSize),
    payload.techName || payload.tech,
    payload.senderName,
    payload.senderEmail,
    payload.notes || '',
    'Received'
  ]);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}