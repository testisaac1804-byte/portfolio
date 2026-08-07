/**
 * Isaac Secure Messenger — Frontend Logic
 */
// ── State ──
let state = {
    fingerprint: '',
    displayName: 'Anonymous',
    peers: [],
    activePeer: null,
    conversations: {},
    messages: [],
    isRecording: false,
    disappearingTimer: 0,
    proxyEnabled: false,
    pollInterval: null,
};

// DOM refs
const $ = id => document.getElementById(id);
const peersList = $('peersList');
const chatMessages = $('chatMessages');
const chatHeader = $('chatHeader');
const chatInput = $('chatInput');
const noConvo = $('noConvo');
const msgInput = $('msgInput');
const sendBtn = $('sendBtn');
const voiceBtn = $('voiceBtn');
const attachBtn = $('attachBtn');
const fileInput = $('fileInput');
const timerSelect = $('timerSelect');
const timerSelector = $('timerSelector');
const statusFp = $('statusFp');
const proxyStatus = $('proxyStatus');
const statusDot = $('statusDot');
const selfFingerprint = $('selfFingerprint');
const displayNameInput = $('displayNameInput');

// ── Init ──
async function init() {
    // Load self info
    try {
        const info = await api('/api/self-info');
        state.fingerprint = info.fingerprint;
        selfFingerprint.textContent = 'Fingerprint: ' + info.fingerprint.slice(0, 24) + '...';
        $('fpDisplay').textContent = 'Your fingerprint: ' + info.fingerprint;
        statusFp.textContent = info.fingerprint.slice(0, 16) + '...';
        $('popupFingerprint').value = info.fingerprint;
    } catch(e) {
        statusFp.textContent = 'Offline';
    }

    // Check proxy
    checkProxy();

    // Display name from saved
    const savedName = localStorage.getItem('isaac_display_name');
    if (savedName) {
        displayNameInput.value = savedName;
        state.displayName = savedName;
    }

    displayNameInput.addEventListener('change', () => {
        state.displayName = displayNameInput.value || 'Anonymous';
        localStorage.setItem('isaac_display_name', state.displayName);
    });

    // Load conversations
    loadConversations();

    // Start polling
    state.pollInterval = setInterval(poll, 2000);
    poll();

    // Setup input
    setupInput();
}

// ── API helper ──
async function api(url, options = {}) {
    const resp = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    return resp.json();
}

// ── Polling (peers, status, messages) ──
async function poll() {
    try {
        // Status
        const status = await api('/api/status');
        statusDot.className = status.peer_count > 0 ? 'status-dot' : 'status-dot offline';

        // Peers
        const peersData = await api('/api/peers');
        state.peers = peersData.peers || [];
        renderPeers();

        // Conversations
        await loadConversations();

        // Messages for active peer
        if (state.activePeer) {
            const msgs = await api(`/api/messages?fingerprint=${encodeURIComponent(state.activePeer)}`);
            state.messages = msgs.messages || [];
            renderMessages();
            scrollToBottom();
        }

        // Proxy
        checkProxy();
    } catch(e) {
        // Silent fail during polling
    }
}

async function checkProxy() {
    try {
        const proxyData = await api('/api/proxy/status');
        state.proxyEnabled = proxyData.enabled;
        proxyStatus.textContent = 'Proxy: ' + (proxyData.enabled ? 'ON' : 'OFF');
        proxyStatus.className = proxyData.enabled ? 'proxy-indicator' : 'proxy-indicator off';
    } catch(e) {
        proxyStatus.textContent = 'Proxy: Unknown';
    }
}

// ── Peers list ──
function renderPeers() {
    if (state.peers.length === 0) {
        peersList.innerHTML = `<div class="empty-state">No peers found on local network</div>`;
        return;
    }

    peersList.innerHTML = state.peers.map(p => {
        const initial = (p.display_name || p.name || '?')[0].toUpperCase();
        const isActive = state.activePeer === p.fingerprint;
        const isOnline = (Date.now()/1000 - p.last_seen) < 30;
        return `
            <div class="peer-item ${isActive ? 'active' : ''}"
                 onclick="selectPeer('${p.fingerprint}', '${escapeHtml(p.display_name)}', '${p.host}', ${p.port})">
                <div class="peer-avatar">${initial}</div>
                <div class="peer-info">
                    <div class="peer-name">${escapeHtml(p.display_name)}</div>
                    <div class="peer-fp">${p.fingerprint ? p.fingerprint.slice(0,16) + '...' : 'no fp'}</div>
                    <div class="${isOnline ? 'peer-online' : 'peer-offline'}">
                        ${isOnline ? '&#x25cf; Online' : 'Offline'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

// ── Peer selection ──
async function selectPeer(fingerprint, name, host, port) {
    state.activePeer = fingerprint;
    noConvo.style.display = 'none';
    chatHeader.style.display = 'flex';
    chatInput.style.display = 'flex';

    $('chatAvatar').textContent = (name || '?')[0].toUpperCase();
    $('chatPeerName').textContent = name || 'Peer';
    $('chatPeerStatus').textContent = '\u{1f512} End-to-end encrypted';

    // Connect if not already connected
    try {
        const result = await api('/api/connect', {
            method: 'POST',
            body: JSON.stringify({
                fingerprint: fingerprint,
                host: host,
                port: port,
            }),
        });
        if (result.status === 'connected') {
            $('chatPeerStatus').textContent = '\u{1f512} Connected \u2022 X3DH session established';
        }
    } catch(e) {
        // May already be connected
    }

    // Load messages
    const msgs = await api(`/api/messages?fingerprint=${encodeURIComponent(fingerprint)}`);
    state.messages = msgs.messages || [];
    renderMessages();
    setTimeout(scrollToBottom, 100);

    // Update peers list highlight
    renderPeers();
}

// ── Conversations ──
async function loadConversations() {
    try {
        const data = await api('/api/conversations');
        state.conversations = {};
        for (const c of data.conversations || []) {
            state.conversations[c.fingerprint] = c;
        }
    } catch(e) {}
}

// ── Render messages ──
function renderMessages() {
    if (!state.activePeer || state.messages.length === 0) {
        if (state.activePeer) {
            chatMessages.innerHTML = `
                <div class="message system">No messages yet. Say hello!</div>
            `;
        }
        return;
    }

    chatMessages.innerHTML = '';
    let lastSender = '';

    for (const msg of state.messages) {
        const isMe = msg.sender === 'me';
        const cls = isMe ? 'sent' : 'received';
        const time = new Date(msg.timestamp * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

        let contentHtml = '';
        let extraHtml = '';

        if (msg.type === 'voice') {
            contentHtml = `
                <div class="voice-play" onclick="playVoice('${escapeHtml(msg.voice_file || '')}')">
                    &#x25b6; Play Voice Note ${msg.duration ? '(' + msg.duration.toFixed(1) + 's)' : ''}
                </div>
            `;
        } else if (msg.type === 'file') {
            contentHtml = `
                <div class="file-attachment" onclick="downloadFile('${escapeHtml(JSON.stringify(msg.file_meta || {}))}')">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span class="file-icon">&#x1f4c4;</span>
                        <div class="file-info">
                            <span class="file-name">${escapeHtml(msg.content || 'File')}</span>
                            <span class="file-size">Click to download</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            contentHtml = escapeHtml(msg.content);
        }

        if (msg.disappearing && msg.timer) {
            const remaining = Math.max(0, (msg.timestamp + msg.timer) - (Date.now()/1000));
            extraHtml = `<div class="disappear-timer">&#x23f1; ${Math.round(remaining)}s</div>`;
        }

        chatMessages.innerHTML += `
            <div class="message ${cls}">
                ${contentHtml}
                <div class="time">${time}</div>
                ${extraHtml}
            </div>
        `;
    }
}

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 50);
}

// ── Input handling ──
function setupInput() {
    // Send on Enter (Shift+Enter for newline)
    msgInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize
    msgInput.addEventListener('input', () => {
        msgInput.style.height = 'auto';
        msgInput.style.height = Math.min(msgInput.scrollHeight, 120) + 'px';
    });

    sendBtn.addEventListener('click', sendMessage);

    // Timer select
    timerSelect.addEventListener('change', () => {
        state.disappearingTimer = parseInt(timerSelect.value) || 0;
        timerSelector.className = 'timer-selector' + (state.disappearingTimer > 0 ? ' active' : '');
    });

    // Voice button
    voiceBtn.addEventListener('click', toggleRecording);

    // File attachment
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', sendFiles);

    // Display name
    displayNameInput.addEventListener('change', () => {
        state.displayName = displayNameInput.value || 'Anonymous';
    });

    // Settings double-click on fingerprint
    selfFingerprint.addEventListener('dblclick', () => {
        $('infoPopup').classList.add('show');
    });
    statusFp.addEventListener('dblclick', () => {
        $('infoPopup').classList.add('show');
    });
}

async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text || !state.activePeer) return;

    msgInput.value = '';
    msgInput.style.height = 'auto';

    try {
        const result = await api('/api/send', {
            method: 'POST',
            body: JSON.stringify({
                fingerprint: state.activePeer,
                content: text,
                timer: state.disappearingTimer,
            }),
        });

        if (result.status === 'sent') {
            // Refresh messages
            const msgs = await api(`/api/messages?fingerprint=${encodeURIComponent(state.activePeer)}`);
            state.messages = msgs.messages || [];
            renderMessages();
            scrollToBottom();
        }
    } catch(e) {
        console.error('Send failed:', e);
    }
}

// ── Voice recording ──
async function toggleRecording() {
    if (!state.isRecording) {
        state.isRecording = true;
        voiceBtn.classList.add('recording');
        voiceBtn.title = 'Stop recording';
        voiceBtn.textContent = '\u{23f9}';
        // In full app, this triggers backend recording
        try {
            await api('/api/voice/start', { method: 'POST' });
        } catch(e) {}
    } else {
        state.isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.title = 'Voice note';
        voiceBtn.textContent = '\u{1f3a4}';
        try {
            const result = await api('/api/voice/stop', { method: 'POST' });
            if (result.file && state.activePeer) {
                sendVoiceNote(result.file, result.duration || 0);
            }
        } catch(e) {}
    }
}

async function sendVoiceNote(filepath, duration) {
    // In a full implementation, this would encrypt and send the voice note
    // For now, send a placeholder
    await api('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            fingerprint: state.activePeer,
            content: `[Voice Note] ${duration.toFixed(1)}s`,
            timer: state.disappearingTimer,
        }),
    });
    // Refresh messages
    poll();
}

function playVoice(filepath) {
    if (filepath) {
        // In real app, play via Audio element or afplay
        const audio = new Audio();
        audio.src = '/static/' + filepath; // Won't work for temp files
        // In production, use an API endpoint to stream the file
    }
}

// ── File transfer ──
async function sendFiles() {
    const files = fileInput.files;
    if (!files.length || !state.activePeer) return;

    fileInput.value = '';

    for (const file of files) {
        // In full implementation, upload and encrypt
        await api('/api/send', {
            method: 'POST',
            body: JSON.stringify({
                fingerprint: state.activePeer,
                content: `[File] ${file.name} (${formatFileSize(file.size)})`,
                timer: state.disappearingTimer,
            }),
        });
    }

    // Refresh
    poll();
    setTimeout(scrollToBottom, 100);
}

function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    for (const unit of units) {
        if (size < 1024) return `${size.toFixed(1)} ${unit}`;
        size /= 1024;
    }
    return `${size.toFixed(1)} TB`;
}

function downloadFile(metaJson) {
    // Placeholder — real implementation streams decrypted file
    alert('File download: ' + metaJson.slice(0, 100));
}

// ── Popup ──
function closePopup() {
    $('infoPopup').classList.remove('show');
}

async function saveSettings() {
    const name = $('popupName').value || state.displayName;
    state.displayName = name;
    displayNameInput.value = name;
    localStorage.setItem('isaac_display_name', name);

    const proxyMode = $('popupProxy').value;
    if (proxyMode === 'on') {
        await api('/api/proxy/toggle', { method: 'POST', body: JSON.stringify({ enable: true }) });
    } else if (proxyMode === 'off') {
        await api('/api/proxy/toggle', { method: 'POST', body: JSON.stringify({ enable: false }) });
    }

    closePopup();
}

// ── Start ──
document.addEventListener('DOMContentLoaded', init);
