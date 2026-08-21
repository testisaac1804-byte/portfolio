const express = require('express');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(express.static(__dirname));

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. 加入 gmail.modify 權限，這樣我們才能幫信件加上星號！
app.get('/login', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.modify', 
    'https://www.googleapis.com/auth/gmail.send'
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('認證失敗');
  }
});

// 2. 獲取郵件列表 (支援透過 req.query.labelId 來切換 Inbox, Sent, Starred)
app.get('/list-messages', async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const labelIds = req.query.labelId ? [req.query.labelId] : ['INBOX'];
    
    const response = await gmail.users.messages.list({ 
        userId: 'me', 
        maxResults: 15,
        labelIds: labelIds 
    });
    
    const messages = response.data.messages || [];

    const messageDetails = await Promise.all(
      messages.map(async (msg) => {
        const msgData = await gmail.users.messages.get({
          userId: 'me', id: msg.id, format: 'metadata', metadataHeaders: ['Subject', 'From', 'Date']
        });
        
        const headers = msgData.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '(無主旨)';
        let from = headers.find(h => h.name === 'From')?.value || '未知寄件者';
        from = from.split('<')[0].replace(/"/g, '').trim();
        const dateRaw = headers.find(h => h.name === 'Date')?.value;
        const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : '';
        
        const isStarred = msgData.data.labelIds.includes('STARRED');

        return { id: msg.id, from, subject, snippet: msgData.data.snippet, date, isStarred };
      })
    );
    res.json(messageDetails);
  } catch (error) {
    res.status(500).json({ error: '無法讀取郵件，請確認是否已授權' });
  }
});

// ==========================================
// 【新增功能】獲取單一封信件詳細內文的路由 
// ==========================================
app.get('/get-message', async (req, res) => {
    const messageId = req.query.id;
    if (!messageId) {
        return res.status(400).json({ error: '缺少信件 ID (Missing message ID)' });
    }

    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // 從 Google API 獲取單封信件的完整資訊 (format: full)
        const response = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full' 
        });

        const message = response.data;
        
        // 解析標頭資訊 (主旨、寄件者、日期)
        const headers = message.payload.headers;
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(無主旨)';
        let from = headers.find(h => h.name.toLowerCase() === 'from')?.value || '未知寄件者';
        const dateRaw = headers.find(h => h.name.toLowerCase() === 'date')?.value;
        const date = dateRaw ? new Date(dateRaw).toLocaleString() : '';

        // 從 Gmail 複雜的巢狀結構 (Payload Parts) 中解析出純文字內文 (Body)
        let body = '';
        if (message.payload.parts) {
            // 優先尋找 text/plain (純文字)，找不到再找 text/html
            const textPart = message.payload.parts.find(p => p.mimeType === 'text/plain') 
                          || message.payload.parts.find(p => p.mimeType === 'text/html');
            if (textPart && textPart.body && textPart.body.data) {
                body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
            }
        } else if (message.payload.body && message.payload.body.data) {
            // 沒有 parts 的簡單信件結構
            body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
        }

        // 如果真的還是解析不出內文，就用大綱 (snippet) 應急頂替
        if (!body) {
            body = message.snippet;
        }

        // 將整理乾淨的資料包成 JSON 回傳給前端
        res.json({
            id: message.id,
            subject: subject,
            from: from,
            date: date,
            body: body,
            snippet: message.snippet
        });

    } catch (error) {
        console.error('後端讀取單封郵件失敗:', error);
        res.status(500).json({ error: '無法自 Google API 讀取詳細信件內容' });
    }
});

// 3. 切換星號 API
app.post('/toggle-star', async (req, res) => {
    try {
        const { messageId, addStar } = req.body;
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        
        await gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: {
                addLabelIds: addStar ? ['STARRED'] : [],
                removeLabelIds: addStar ? [] : ['STARRED']
            }
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// 4. 寄送郵件
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const emailLines = [`To: ${to}`, `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`, 'Content-Type: text/plain; charset="UTF-8"', '', message];
    const email = emailLines.join('\r\n').trim();
    const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw: base64EncodedEmail } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '寄信失敗' });
  }
});

app.listen(3000, () => console.log('伺服器已啟動於 http://localhost:3000'));