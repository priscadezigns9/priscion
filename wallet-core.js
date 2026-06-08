// Priscion MUSE Wallet Core v12.0.0
// LYNX MESSENGER: WhatsApp-Fidelity Clone | Vault & Collections RESTORED | Multi-Wallet Auth

var walletVisible = false;
var currentTab = 'vault';
var walletDarkMode = false;
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// Lynx State
var lynxChatMode = 'list'; 
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
    status: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    calls: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2v3a2 2 0 0 1 1.72 2.03 12.5 12.5 0 0 0 5.85 5.85 2 2 0 0 1 2.03 1.72z"/></svg>`
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

function openWalletAuth() {
    currentTab = 'auth';
    renderWallet();
}

async function renderWallet() {
    var c = document.getElementById('sidebar');
    if(!c) return;

    var ledger = [];
    try {
        var response = await fetch('ledger/transactions.json');
        if(response.ok) ledger = await response.json();
    } catch (e) { console.error("Ledger offline", e); }

    var theme = walletDarkMode ? 
        { bg: '#080808', text: '#FFFFFF', muted: '#888', surface: '#111', border: '#222', accent: '#25D366' } : 
        { bg: '#FFFFFF', text: '#1A1A1A', muted: '#666', surface: '#F9F9F9', border: '#EEE', accent: '#25D366' };

    var activeWallet = userWallets[currentWalletIndex];
    c.style.background = theme.bg;

    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; position:relative;">
            <!-- Persistent Top Header -->
            <div style="padding:15px 25px; border-bottom:1px solid ${theme.border}; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:900; letter-spacing:4px; font-size:0.75rem; color:#7B35D4;">MUSE</span>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <!-- TAB SELECTOR (Top Navbar) -->
            <div style="display:flex; padding:0 20px; border-bottom:1px solid ${theme.border};">
                ${['vault', 'swap', 'send', 'lynx', 'dapps'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?'#7B35D4':'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.6rem; letter-spacing:1px; color:${currentTab===tab?'#7B35D4':theme.muted}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                ${renderCurrentView(ledger, theme, activeWallet)}
            </div>
        </div>
    `;
}

function renderCurrentView(ledger, theme, wallet) {
    if(currentTab === 'lynx') return renderLynxUI(theme);
    if(currentTab === 'auth') return renderAuthUI(theme);
    if(currentTab === 'vault') return renderVaultUI(ledger, theme, wallet);
    if(currentTab === 'swap') return renderSwapUI(theme);
    if(currentTab === 'send') return renderSendUI(theme);
    if(currentTab === 'dapps') return renderDappsUI(theme);
    return renderVaultUI(ledger, theme, wallet);
}

function renderVaultUI(ledger, theme, wallet) {
    var assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT' || tx.status === 'STABLE_AND_VERIFIED');
    return `
        <div style="padding:30px;">
            <div onclick="openWalletAuth()" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:15px 20px; border-radius:15px; margin-bottom:25px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:32px; height:32px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900;">P</div>
                    <span style="font-weight:900; font-size:0.8rem;">$prisca.pri</span>
                </div>
                <div style="color:${theme.muted};">▼</div>
            </div>

            <div style="background:${theme.surface}; padding:30px; border-radius:25px; border:1px solid ${theme.border}; margin-bottom:30px;">
                <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:10px;">RESERVE</div>
                <div style="font-size:2.2rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN 12,500.00</div>
            </div>

            <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:15px; text-transform:uppercase;">COLLECTIONS</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                ${assets.map(a => `
                    <div style="background:${theme.bg}; border:1px solid ${theme.border}; padding:18px; border-radius:18px; text-align:center; cursor:pointer;">
                        <div style="font-weight:900; font-size:0.75rem; margin-bottom:5px;">${a.asset || a.handle}</div>
                        <div style="font-size:0.5rem; color:#7B35D4; font-weight:900;">ANCHORED</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLynxUI(theme) {
    if(lynxChatMode === 'list') {
        return `
            <div style="display:flex; flex-direction:column; height:100%; background:${theme.bg};">
                <div style="padding:20px 25px; display:flex; justify-content:space-between; align-items:center; background:#075E54; color:#FFF;">
                    <h2 style="font-weight:700; font-size:1.3rem; margin:0;">WhatsApp</h2>
                    <div style="display:flex; gap:20px;">
                        <span style="cursor:pointer;">🔍</span>
                        <span onclick="alert('Handshake Request Node')" style="cursor:pointer;">⋮</span>
                    </div>
                </div>
                <div style="flex:1; overflow-y:auto;">
                    ${lynxChats.map(chat => `
                        <div onclick="openChat('${chat.handle}')" style="padding:15px 20px; display:flex; gap:15px; align-items:center; cursor:pointer; border-bottom:1px solid ${theme.border};">
                            <div style="width:55px; height:50px; background:#DDD; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; background:linear-gradient(45deg, #7B35D4, #444); color:#FFF;">${chat.avatar}</div>
                            <div style="flex:1; border-bottom: 0px solid #EEE;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <span style="font-weight:700; font-size:1rem; color:${theme.text};">${chat.handle}</span>
                                    <span style="font-size:0.7rem; color:${chat.unread ? '#25D366' : theme.muted};">${chat.time}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-size:0.85rem; color:${theme.muted}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;">${chat.lastMsg}</span>
                                    ${chat.unread ? `<div style="background:#25D366; color:#FFF; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700;">${chat.unread}</div>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        return `
            <div style="display:flex; flex-direction:column; height:100%; background:#E5DDD5;">
                <div style="background:#075E54; color:#FFF; padding:10px 15px; display:flex; align-items:center; gap:10px;">
                    <div onclick="switchTab('lynx')" style="cursor:pointer; display:flex; align-items:center;">${MUSE_ICONS.back}</div>
                    <div style="width:40px; height:40px; background:#DDD; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; background:#FFF; color:#075E54;">${activeChatHandle[0]}</div>
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:1rem;">${activeChatHandle}</div>
                        <div style="font-size:0.7rem; opacity:0.8;">online</div>
                    </div>
                    <div style="display:flex; gap:20px; font-size:1.2rem;"><span>🎥</span><span>📞</span><span>⋮</span></div>
                </div>
                <div style="flex:1; padding:15px; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                    <div style="align-self:flex-start; background:#FFF; padding:8px 12px; border-radius:0 10px 10px 10px; max-width:85%; font-size:0.9rem; box-shadow:0 1px 1px rgba(0,0,0,0.1); position:relative;">
                        Architect, I have established the Sovereign Jello Layer for this session.
                        <div style="text-align:right; font-size:0.65rem; color:#999; margin-top:4px;">20:30</div>
                    </div>
                    <div id="lynx-msg-node"></div>
                </div>
                <div id="record-timer-bar" style="display:none; background:#F0F0F0; padding:10px 20px; color:red; font-weight:900; font-family:monospace; font-size:1.1rem; text-align:center;">🔴 00:00</div>
                <div style="padding:8px; display:flex; align-items:center; gap:8px; background:#F0F0F0;">
                    <div style="display:flex; gap:15px; padding:0 10px;">
                        <label style="cursor:pointer; color:#777;">${MUSE_ICONS.clip}<input type="file" multiple style="display:none;" onchange="handleMultiAttachment(this)"></label>
                    </div>
                    <div style="flex:1; background:#FFF; border-radius:25px; padding:8px 15px; display:flex; align-items:center;">
                        <input id="lynx-input" type="text" placeholder="Type a message" style="flex:1; border:none; outline:none; font-size:1rem;">
                        <div id="mic-node" onclick="handleMic()" style="cursor:pointer; color:#777; margin-left:10px;">${MUSE_ICONS.mic}</div>
                    </div>
                    <div onclick="sendLynx()" style="background:#128C7E; color:#FFF; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">${MUSE_ICONS.send}</div>
                </div>
            </div>
        `;
    }
}

function renderAuthUI(theme) {
    return `
        <div style="padding:30px; display:grid; gap:15px;">
            <button onclick="switchTab('vault')" style="background:none; border:none; color:${theme.accent}; font-weight:900; font-size:0.65rem; text-align:left; cursor:pointer; margin-bottom:10px;">← BACK</button>
            <div onclick="alert('Creating Node...')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:25px; border-radius:20px; cursor:pointer;">
                <div style="font-weight:900; font-size:0.9rem;">CREATE NEW WALLET</div>
                <div style="font-size:0.65rem; color:${theme.muted}; margin-top:5px;">Provision a new .pri identity.</div>
            </div>
            <div onclick="alert('Importing...')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:25px; border-radius:20px; cursor:pointer;">
                <div style="font-weight:900; font-size:0.9rem;">RESTORE WALLET</div>
                <div style="font-size:0.65rem; color:${theme.muted}; margin-top:5px;">Import using seed phrase.</div>
            </div>
            <div onclick="alert('Pairing...')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:25px; border-radius:20px; cursor:pointer;">
                <div style="font-weight:900; font-size:0.9rem;">CONNECT LEDGER</div>
                <div style="font-size:0.65rem; color:${theme.muted}; margin-top:5px;">Pair with hardware node.</div>
            </div>
        </div>
    `;
}

function renderSwapUI(theme) {
    return `<div style="padding:30px; color:${theme.muted};">Swap Protocol Ready. Change assets via dropdowns.</div>`;
}
function renderSendUI(theme) {
    return `<div style="padding:30px; color:${theme.muted};">Atomic Send Active. Enter handle above.</div>`;
}
function renderDappsUI(theme) {
    return `<div style="padding:30px; color:${theme.muted};">Embedded Gateway Node Active.</div>`;
}

function handleMic() {
    var timerBar = document.getElementById('record-timer-bar');
    if(!isRecording) {
        isRecording = true;
        timerBar.style.display = 'block';
        recordTime = 0;
        recordInterval = setInterval(() => {
            recordTime++;
            var m = Math.floor(recordTime/60).toString().padStart(2,'0');
            var s = (recordTime%60).toString().padStart(2,'0');
            timerBar.innerHTML = `🔴 ${m}:${s}`;
        }, 1000);
    } else {
        stopRecording();
    }
}

function stopRecording() {
    isRecording = false;
    clearInterval(recordInterval);
    document.getElementById('record-timer-bar').style.display = 'none';
    alert("Voice Vector Captured for Ledger.");
}

function handleMultiAttachment(input) {
    if(input.files.length > 0) alert(input.files.length + " vectors ready for handshake.");
}

function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && i.value) {
        var node = document.getElementById('lynx-msg-node');
        var now = new Date();
        var time = now.getHours() + ":" + now.getMinutes().toString().padStart(2,'0');
        node.innerHTML += `
            <div style="align-self:flex-end; background:#DCF8C6; padding:8px 12px; border-radius:10px 0 10px 10px; max-width:85%; font-size:0.9rem; box-shadow:0 1px 1px rgba(0,0,0,0.1); margin-top:10px; position:relative;">
                ${i.value}
                <div style="text-align:right; font-size:0.65rem; color:#999; margin-top:4px;">${time} ✓✓</div>
            </div>
        `;
        i.value = '';
    }
}
