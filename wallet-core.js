// Priscion MUSE Wallet Core v11.5.0
// LYNX MESSENGER: WhatsApp-Fidelity UI | Handshake Protocol | Sovereign Architect Node

var walletVisible = false;
var currentTab = 'vault';
var walletDarkMode = false;
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// New Lynx State
var lynxChatMode = 'list'; // 'list' or 'chat'
var activeChatHandle = null;
var lynxChats = [
    { handle: 'Priscion', lastMsg: 'Architect, the ledger is secure.', time: '20:30', avatar: 'P', unread: 1, type: 'architect' },
    { handle: '$vogue.pri', lastMsg: 'Provisioning confirmed.', time: '18:45', avatar: 'V', unread: 0, type: 'node' }
];

var userWallets = [
    { handle: '$prisca.pri', address: 'addr_pri1...6k9z_master', balance: '12,500.00', avatar: 'P' }
];

var MUSE_ICONS = {
    clip: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    mic: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
    back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    lego: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>`
};

function toggleSidebar() {
    var s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    if(walletVisible) {
        s.classList.add('active');
        renderWallet();
    } else {
        s.classList.remove('active');
    }
}

function switchTab(tab) {
    currentTab = tab;
    lynxChatMode = 'list';
    renderWallet();
}

function openChat(handle) {
    activeChatHandle = handle;
    lynxChatMode = 'chat';
    renderWallet();
}

async function renderWallet() {
    var c = document.getElementById('sidebar');
    if(!c) return;

    var theme = walletDarkMode ? 
        { bg: '#080808', text: '#FFFFFF', muted: '#888', surface: '#111', border: '#222', accent: '#25D366' } : 
        { bg: '#FFFFFF', text: '#1A1A1A', muted: '#666', surface: '#F9F9F9', border: '#EEE', accent: '#25D366' };

    var activeWallet = userWallets[currentWalletIndex];
    c.style.background = theme.bg;
    c.style.visibility = 'visible';

    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif;">
            <!-- Persistent Header -->
            <div style="padding:20px 25px; border-bottom:1px solid ${theme.border}; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:900; letter-spacing:4px; font-size:0.75rem; color:#7B35D4;">MUSE</span>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <!-- Tab Navigation (Purged UX preserved) -->
            <div style="display:flex; padding:10px 25px; gap:20px; border-bottom:1px solid ${theme.border}; overflow-x:auto; scrollbar-width:none;">
                ${['vault', 'swap', 'send', 'lynx', 'dapps'].map(tab => `
                    <button onclick="switchTab('${tab}')" style="background:none; border:none; font-weight:900; font-size:0.6rem; letter-spacing:2px; color:${currentTab===tab?'#7B35D4':theme.muted}; cursor:pointer; text-transform:uppercase; border-bottom: ${currentTab===tab?'2px solid #7B35D4':'2px solid transparent'}; padding-bottom:5px;">${tab}</button>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                ${currentTab === 'lynx' ? renderLynxUI(theme) : renderVaultView(theme, activeWallet)}
            </div>
        </div>
    `;
}

function renderLynxUI(theme) {
    if(lynxChatMode === 'list') {
        return `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="padding:20px 25px; display:flex; justify-content:space-between; align-items:center;">
                    <h2 style="font-weight:900; font-size:1.5rem; margin:0;">Lynx</h2>
                    <button onclick="alert('Enter .pri handle to request handshake')" style="background:#25D366; color:#FFF; border:none; border-radius:50%; width:35px; height:35px; font-size:1.2rem; cursor:pointer;">+</button>
                </div>
                <div style="flex:1;">
                    ${lynxChats.map(chat => `
                        <div onclick="openChat('${chat.handle}')" style="padding:15px 25px; display:flex; gap:15px; align-items:center; cursor:pointer; border-bottom:1px solid ${theme.border};">
                            <div style="width:50px; height:50px; background:#DDD; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem; color:#FFF; background:linear-gradient(45deg, #7B35D4, #444);">${chat.avatar}</div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <span style="font-weight:900; font-size:0.9rem;">${chat.handle}</span>
                                    <span style="font-size:0.6rem; color:${theme.muted};">${chat.time}</span>
                                </div>
                                <div style="font-size:0.75rem; color:${theme.muted}; display:flex; justify-content:space-between;">
                                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;">${chat.lastMsg}</span>
                                    ${chat.unread ? `<span style="background:#25D366; color:#FFF; border-radius:50%; width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:900;">${chat.unread}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        // Chat Window (WhatsApp UI)
        return `
            <div style="display:flex; flex-direction:column; height:100%; background:#E5DDD5;">
                <!-- Chat Header -->
                <div style="background:#075E54; color:#FFF; padding:10px 20px; display:flex; align-items:center; gap:15px;">
                    <div onclick="switchTab('lynx')" style="cursor:pointer;">${MUSE_ICONS.back}</div>
                    <div style="width:40px; height:40px; background:#DDD; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; background:#FFF; color:#075E54;">${activeChatHandle[0]}</div>
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:0.9rem;">${activeChatHandle}</div>
                        <div style="font-size:0.6rem; opacity:0.8;">Sovereign Handshake Active</div>
                    </div>
                </div>
                <!-- Chat Messages -->
                <div style="flex:1; padding:20px; display:flex; flex-direction:column; gap:10px; overflow-y:auto;">
                    <div style="align-self:flex-start; background:#FFF; padding:10px 15px; border-radius:0 15px 15px 15px; max-width:80%; font-size:0.8rem; box-shadow:0 1px 2px rgba(0,0,0,0.1);">
                        Architect, I have established the Sovereign Jello Layer for this session.
                        <div style="text-align:right; font-size:0.6rem; color:#999; margin-top:5px;">20:30</div>
                    </div>
                    <div id="lynx-msg-node"></div>
                </div>
                <!-- Chat Input -->
                <div style="padding:10px; display:flex; align-items:center; gap:10px; background:#F0F0F0;">
                    <label style="cursor:pointer; color:#777;">${MUSE_ICONS.clip}<input type="file" multiple style="display:none;" onchange="handleMultiAttachment(this)"></label>
                    <div style="flex:1; background:#FFF; border-radius:25px; padding:10px 15px; display:flex; align-items:center;">
                        <input id="lynx-input" type="text" placeholder="Type a message" style="flex:1; border:none; outline:none; font-size:0.9rem;">
                        <div id="mic-node" onclick="handleMic()" style="cursor:pointer; color:#777;">${MUSE_ICONS.mic}</div>
                    </div>
                    <div onclick="sendLynx()" style="background:#128C7E; color:#FFF; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">${MUSE_ICONS.send}</div>
                </div>
                <div id="record-overlay" style="display:none; position:absolute; bottom:80px; right:20px; background:#FFF; padding:15px; border-radius:20px; box-shadow:0 5px 15px rgba(0,0,0,0.2); align-items:center; gap:10px;">
                    <div style="color:red; font-weight:900;">🔴 <span id="record-timer">00:00</span></div>
                </div>
            </div>
        `;
    }
}

function renderVaultView(theme, wallet) {
    return `<div style="padding:25px; text-align:center; color:${theme.muted};">Restoring High-Fidelity Vault...</div>`;
}

function handleMic() {
    var overlay = document.getElementById('record-overlay');
    var timer = document.getElementById('record-timer');
    if(!isRecording) {
        isRecording = true;
        overlay.style.display = 'flex';
        recordTime = 0;
        recordInterval = setInterval(() => {
            recordTime++;
            var m = Math.floor(recordTime/60).toString().padStart(2,'0');
            var s = (recordTime%60).toString().padStart(2,'0');
            timer.innerHTML = `${m}:${s}`;
        }, 1000);
    } else {
        stopRecording();
    }
}

function stopRecording() {
    isRecording = false;
    clearInterval(recordInterval);
    document.getElementById('record-overlay').style.display = 'none';
    alert("Voice Vector Captured.");
}

function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && i.value) {
        var node = document.getElementById('lynx-msg-node');
        var now = new Date();
        var time = now.getHours() + ":" + now.getMinutes().toString().padStart(2,'0');
        node.innerHTML += `
            <div style="align-self:flex-end; background:#DCF8C6; padding:10px 15px; border-radius:15px 0 15px 15px; max-width:80%; font-size:0.8rem; box-shadow:0 1px 2px rgba(0,0,0,0.1); margin-top:10px;">
                ${i.value}
                <div style="text-align:right; font-size:0.6rem; color:#999; margin-top:5px;">${time}</div>
            </div>
        `;
        i.value = '';
    }
}
