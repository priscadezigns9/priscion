// Priscion MUSE Wallet Core v13.0.0
// THE SOVEREIGN OS: Full Feature Restoration | Fixed UI Sharding | Permanent Tabs

var walletVisible = false;
var currentTab = 'vault';
var walletDarkMode = false;
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// Lynx State (WhatsApp UI Clone)
var lynxChatMode = 'list'; 
var activeChatHandle = null;
var lynxChats = [
    { handle: 'Priscion', lastMsg: 'Architect, the ledger is secure.', time: '20:45', avatar: 'P', unread: 1, type: 'architect' },
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

    var ledger = [];
    try {
        var response = await fetch('ledger/transactions.json');
        if(response.ok) ledger = await response.json();
    } catch (e) { console.error("Ledger offline", e); }

    var theme = { bg: '#FFFFFF', text: '#1A1A1A', muted: '#666', surface: '#F9F9F9', border: '#EEE', accent: '#7B35D4' };
    var activeWallet = userWallets[currentWalletIndex];
    c.style.background = theme.bg;

    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif;">
            <!-- Header -->
            <div style="padding:15px 25px; border-bottom:1px solid ${theme.border}; display:flex; justify-content:space-between; align-items:center; background:#fff;">
                <span style="font-weight:900; letter-spacing:4px; font-size:0.75rem; color:${theme.accent};">MUSE</span>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <!-- ALL TABS RESTORED (Never disappear) -->
            <div style="display:flex; border-bottom:1px solid ${theme.border}; background:#fff; overflow-x:auto; scrollbar-width:none;">
                ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; min-width:80px; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?theme.accent:'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.6rem; letter-spacing:1px; color:${currentTab===tab?theme.accent:theme.muted}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                ${renderView(tab=currentTab, ledger, theme, activeWallet)}
            </div>
        </div>
    `;
}

function renderView(tab, ledger, theme, wallet) {
    if(tab === 'vault') return renderVault(ledger, theme, wallet);
    if(tab === 'swap') return renderSwap(theme);
    if(tab === 'send') return renderSend(theme);
    if(tab === 'receive') return renderReceive(theme, wallet);
    if(tab === 'dapps') return renderDapps(theme);
    if(tab === 'lynx') return renderLynxUI(theme);
    if(tab === 'auth') return renderAuth(theme);
    return renderVault(ledger, theme, wallet);
}

function renderVault(ledger, theme, wallet) {
    var assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT' || tx.status === 'STABLE_AND_VERIFIED');
    return `
        <div style="padding:25px;">
            <div onclick="currentTab='auth';renderWallet();" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:15px; border-radius:12px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:28px; height:28px; background:${theme.accent}; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900;">P</div>
                    <span style="font-weight:900; font-size:0.8rem;">${wallet.handle}</span>
                </div>
                <span>▼</span>
            </div>
            <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border}; text-align:center;">
                <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; margin-bottom:10px;">TOTAL BALANCE</div>
                <div style="font-size:1.8rem; font-weight:900;">$PRN ${wallet.balance}</div>
            </div>
            <div style="font-size:0.6rem; font-weight:900; margin:20px 0 10px;">ASSETS</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${assets.map(a => `<div style="background:${theme.bg}; border:1px solid ${theme.border}; padding:15px; border-radius:12px; text-align:center; font-weight:900; font-size:0.7rem;">${a.asset || a.handle}</div>`).join('')}
            </div>
        </div>
    `;
}

function renderSwap(theme) {
    return `<div style="padding:40px; text-align:center;">
        <h3 style="font-weight:900; font-size:1rem; margin-bottom:15px;">SWAP PROTOCOL</h3>
        <div style="background:${theme.surface}; padding:20px; border-radius:15px; border:1px solid ${theme.border}; margin-bottom:10px; text-align:left;">
            <label style="font-size:0.6rem; font-weight:900; color:${theme.muted};">FROM</label>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                <span style="font-weight:900;">$PRN</span>
                <input type="number" value="100" style="background:none; border:none; text-align:right; font-weight:900; width:80px; outline:none;">
            </div>
        </div>
        <div style="font-size:1.5rem; margin:10px 0;">↓</div>
        <div style="background:${theme.surface}; padding:20px; border-radius:15px; border:1px solid ${theme.border}; text-align:left;">
            <label style="font-size:0.6rem; font-weight:900; color:${theme.muted};">TO</label>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                <span style="font-weight:900;">$MUSD</span>
                <span style="font-weight:900;">250.00</span>
            </div>
        </div>
        <button onclick="alert('Swap Executed')" style="width:100%; padding:15px; background:${theme.accent}; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:20px; cursor:pointer;">EXCUTE SWAP</button>
    </div>`;
}

function renderSend(theme) {
    return `<div style="padding:40px; text-align:center;">
        <h3 style="font-weight:900; font-size:1rem; margin-bottom:20px;">SEND ASSETS</h3>
        <input type="text" placeholder="Recipient @handle.pri" style="width:100%; padding:15px; border-radius:12px; border:1px solid ${theme.border}; margin-bottom:15px; outline:none; font-family:inherit;">
        <input type="number" placeholder="Amount" style="width:100%; padding:15px; border-radius:12px; border:1px solid ${theme.border}; outline:none; font-family:inherit;">
        <button onclick="alert('Sent')" style="width:100%; padding:15px; background:${theme.text}; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:20px; cursor:pointer;">CONFIRM SEND</button>
    </div>`;
}

function renderReceive(theme, wallet) {
    return `<div style="padding:40px; text-align:center;">
        <h3 style="font-weight:900; font-size:1rem; margin-bottom:20px;">RECEIVE</h3>
        <div style="background:#000; width:180px; height:180px; margin:0 auto; border-radius:15px; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:4rem;">🔳</div>
        <div style="margin-top:20px; font-weight:900; font-size:0.8rem;">${wallet.address}</div>
    </div>`;
}

function renderDapps(theme) {
    var dapps = [
        {n:'LEGGO', i:MUSE_ICONS.lego, u:'leggo.html'},
        {n:'PULSE', i:'📈', u:'pulse/'},
        {n:'PEANUTS', i:'📊', u:'peanuts/'},
        {n:'MYNT', i:'🎨', u:'mynt/'}
    ];
    return `<div style="padding:25px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
        ${dapps.map(d => `<div onclick="window.open('${d.u}')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:20px; border-radius:15px; text-align:center; cursor:pointer;">
            <div style="font-size:1.5rem; margin-bottom:10px; color:${theme.accent};">${typeof d.i === 'string' && d.i.includes('<svg') ? d.i : d.i}</div>
            <div style="font-weight:900; font-size:0.6rem; letter-spacing:1px;">${d.n}</div>
        </div>`).join('')}
    </div>`;
}

function renderLynxUI(theme) {
    if(lynxChatMode === 'list') {
        return `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="background:#075E54; color:#FFF; padding:15px 25px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; font-size:1.2rem;">WhatsApp</span>
                    <div style="display:flex; gap:20px;"><span>🔍</span><span>⋮</span></div>
                </div>
                <div style="flex:1; overflow-y:auto;">
                    ${lynxChats.map(chat => `
                        <div onclick="openChat('${chat.handle}')" style="padding:15px 20px; display:flex; gap:15px; align-items:center; cursor:pointer; border-bottom:1px solid ${theme.border};">
                            <div style="width:50px; height:50px; background:#DDD; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; color:#FFF; background:linear-gradient(45deg, ${theme.accent}, #444);">${chat.avatar}</div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <span style="font-weight:700; font-size:1rem;">${chat.handle}</span>
                                    <span style="font-size:0.7rem; color:${theme.muted};">${chat.time}</span>
                                </div>
                                <div style="font-size:0.85rem; color:${theme.muted}; display:flex; justify-content:space-between;">
                                    <span>${chat.lastMsg}</span>
                                    ${chat.unread ? `<div style="background:#25D366; color:#FFF; border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-size:0.65rem;">${chat.unread}</div>` : ''}
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
                    <div onclick="switchTab('lynx')" style="cursor:pointer;">${MUSE_ICONS.back}</div>
                    <div style="width:35px; height:35px; background:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#075E54; font-weight:900;">${activeChatHandle[0]}</div>
                    <div style="flex:1;"><div style="font-weight:700; font-size:0.9rem;">${activeChatHandle}</div><div style="font-size:0.6rem; opacity:0.8;">online</div></div>
                </div>
                <div style="flex:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:10px;">
                    <div style="align-self:flex-start; background:#FFF; padding:10px; border-radius:0 10px 10px 10px; font-size:0.85rem; box-shadow:0 1px 1px rgba(0,0,0,0.1);">Architect, the ledger is secure.</div>
                    <div id="lynx-msg-node"></div>
                </div>
                <div style="padding:10px; display:flex; gap:10px; background:#F0F0F0; align-items:center;">
                    <div style="flex:1; background:#FFF; border-radius:25px; padding:8px 15px; display:flex; align-items:center;">
                        <input id="lynx-input" type="text" placeholder="Type a message" style="flex:1; border:none; outline:none;">
                        <span style="color:#777; cursor:pointer;" onclick="handleMic()">${MUSE_ICONS.mic}</span>
                    </div>
                    <div onclick="sendLynx()" style="background:#128C7E; color:#FFF; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">${MUSE_ICONS.send}</div>
                </div>
            </div>
        `;
    }
}

function handleMic() { alert("Mic Active"); }
function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && i.value) {
        document.getElementById('lynx-msg-node').innerHTML += `<div style="align-self:flex-end; background:#DCF8C6; padding:10px; border-radius:10px 0 10px 10px; font-size:0.85rem; margin-top:5px;">${i.value}</div>`;
        i.value = '';
    }
}
