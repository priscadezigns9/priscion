// Priscion MUSE Wallet Core v14.5.0
// LYNX MESSENGER: Branding Evolution | Functional Search & Add | Legacy OS Integration

var walletVisible = false;
var currentTab = 'vault';
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// High-Fidelity Identities
var userWallets = [
    { handle: '$prisca.pri', address: 'addr_pri1q9z...master_node', balance: '12,500.00', avatar: 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/p-logo.png' }
];

var lynxChatMode = 'list'; 
var activeChatHandle = null;
var lynxChats = [
    { handle: 'Priscion', lastMsg: 'Architect, the ledger is secure.', time: '21:15', avatar: 'P', unread: 1, type: 'architect' },
    { handle: '$vogue.pri', lastMsg: 'Handshake accepted.', time: '18:45', avatar: 'V', unread: 0, type: 'node' }
];

var MUSE_ICONS = {
    clip: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    mic: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
    back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
};

function toggleSidebar() {
    var s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    walletVisible ? s.classList.add('active') : s.classList.remove('active');
    if(walletVisible) renderWallet();
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
    } catch (e) {}

    var activeWallet = userWallets[currentWalletIndex];
    
    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; background:#FFF; color:#1A1A1A;">
            <!-- VESPA HEADER -->
            <div style="padding:15px 20px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; background:#FFF;">
                <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="toggleDropdown()">
                    <div style="width:35px; height:35px; border-radius:50%; background:url('${activeWallet.avatar}') center/cover; border:1px solid #EEE; position:relative;">
                        <input type="file" id="pfp-upload" style="display:none;" onchange="updatePFP(this)">
                        <div onclick="document.getElementById('pfp-upload').click()" style="position:absolute; bottom:0; right:0; background:rgba(0,0,0,0.5); color:#FFF; font-size:8px; padding:2px; border-radius:50%;">✎</div>
                    </div>
                    <div style="font-weight:900; font-size:0.85rem;">${activeWallet.handle} <span style="font-size:0.6rem; opacity:0.5;">▼</span></div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#666; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>

            <!-- WALLET DROP_DOWN -->
            <div id="wallet-dropdown" style="display:none; background:#F9F9F9; border-bottom:1px solid #EEE; padding:15px;">
                <div onclick="alert('Creating Node...')" style="padding:12px; font-weight:700; font-size:0.75rem; cursor:pointer; border-bottom:1px solid #EEE;">Create New Wallet</div>
                <div onclick="alert('Restoring via Seed...')" style="padding:12px; font-weight:700; font-size:0.75rem; cursor:pointer; border-bottom:1px solid #EEE;">Restore Wallet</div>
                <div onclick="alert('Pairing Ledger...')" style="padding:12px; font-weight:700; font-size:0.75rem; cursor:pointer;">Connect Ledger</div>
            </div>

            <!-- TABS -->
            <div style="display:flex; border-bottom:1px solid #EEE; background:#FFF; overflow-x:auto; scrollbar-width:none;">
                ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; min-width:70px; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?'#7B35D4':'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.6rem; letter-spacing:1px; color:${currentTab===tab?'#7B35D4':'#666'}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; position:relative;">
                ${renderView(currentTab, ledger, activeWallet)}
            </div>
        </div>
    `;
}

function toggleDropdown() {
    var d = document.getElementById('wallet-dropdown');
    d.style.display = d.style.display === 'none' ? 'block' : 'none';
}

function updatePFP(input) {
    if(input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) { userWallets[0].avatar = e.target.result; renderWallet(); };
        reader.readAsDataURL(input.files[0]);
    }
}

function renderView(tab, ledger, wallet) {
    if(tab === 'vault') return renderVault(ledger, wallet);
    if(tab === 'swap') return renderSwap();
    if(tab === 'send') return renderSend();
    if(tab === 'receive') return renderReceive(wallet);
    if(tab === 'dapps') return renderDapps();
    if(tab === 'lynx') return renderLynx();
    return renderVault(ledger, wallet);
}

function renderVault(ledger, wallet) {
    var assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT');
    return `<div style="padding:30px; text-align:center;">
        <div style="font-size:0.65rem; font-weight:900; color:#666; letter-spacing:3px; margin-bottom:10px;">TOTAL RESERVE</div>
        <div style="font-size:2.5rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN ${wallet.balance}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:40px;">
            ${assets.map(a => `<div style="background:#F9F9F9; border:1px solid #EEE; padding:20px; border-radius:15px; font-weight:900; font-size:0.75rem;">${a.asset || a.handle}</div>`).join('')}
        </div>
    </div>`;
}

function renderSwap() {
    return `<div style="padding:35px;">
        <div style="background:#F9F9F9; border:1px solid #EEE; padding:20px; border-radius:20px; margin-bottom:10px;">
            <select style="background:none; border:none; font-weight:900; outline:none;"><option>$PRN</option></select>
            <input type="number" value="100" style="background:none; border:none; text-align:right; font-weight:900; outline:none; width:100%;">
        </div>
        <button onclick="alert('Swap...')" style="width:100%; padding:20px; background:#7B35D4; color:#FFF; border:none; border-radius:100px; font-weight:900;">EXECUTE SWAP</button>
    </div>`;
}

function renderReceive(wallet) {
    return `<div style="padding:40px; text-align:center;">
        <div style="background:#000; padding:25px; border-radius:25px; display:inline-block; margin-bottom:30px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${wallet.address}" style="width:150px;">
        </div>
        <button onclick="navigator.clipboard.writeText('${wallet.address}');alert('Copied')" style="background:#1A1A1A; color:#FFF; border:none; padding:10px 25px; border-radius:100px; font-weight:900;">COPY ADDRESS</button>
    </div>`;
}

function renderSend() {
    return `<div style="padding:40px;">
        <input type="text" placeholder="Recipient @handle.pri" style="width:100%; padding:18px; border-radius:15px; border:1px solid #EEE; margin-bottom:15px; outline:none; font-weight:700;">
        <button onclick="alert('Sent')" style="width:100%; padding:20px; background:#1A1A1A; color:#FFF; border:none; border-radius:100px; font-weight:900;">CONFIRM SEND</button>
    </div>`;
}

function renderDapps() {
    var dapps = [{n:'LEGGO', i:'🌐', u:'leggo.html'}, {n:'PULSE', i:'📈', u:'pulse/'}];
    return `<div style="padding:25px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
        ${dapps.map(d => `<div onclick="window.open('${d.u}')" style="background:#F9F9F9; border:1px solid #EEE; padding:25px; border-radius:20px; text-align:center; cursor:pointer;">
            <div style="font-size:2rem; margin-bottom:10px;">${d.i}</div>
            <div style="font-weight:900; font-size:0.7rem;">${d.n}</div>
        </div>`).join('')}
    </div>`;
}

function renderLynx() {
    if(lynxChatMode === 'list') {
        return `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="background:#075E54; color:#FFF; padding:15px 25px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; font-size:1.2rem;">Lynx</span>
                    <div style="display:flex; gap:20px; align-items:center;">
                        <span onclick="toggleSearch()" style="cursor:pointer;">${MUSE_ICONS.search}</span>
                        <span style="cursor:pointer;">⋮</span>
                    </div>
                </div>
                <div id="lynx-search-bar" style="display:none; padding:10px 20px; background:#F0F0F0; border-bottom:1px solid #DDD;">
                    <input type="text" placeholder="Search handles..." style="width:100%; padding:10px; border-radius:20px; border:1px solid #CCC; outline:none;">
                </div>
                <div style="flex:1; overflow-y:auto;">
                    ${lynxChats.map(chat => `
                        <div onclick="openChat('${chat.handle}')" style="padding:15px 20px; display:flex; gap:15px; align-items:center; cursor:pointer; border-bottom:1px solid #EEE;">
                            <div style="width:50px; height:50px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; color:#FFF;">${chat.avatar}</div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between;"><span style="font-weight:700;">${chat.handle}</span><span style="font-size:0.7rem; color:#666;">${chat.time}</span></div>
                                <div style="font-size:0.85rem; color:#666;">${chat.lastMsg}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <!-- ADD BUTTON (Floating Action) -->
                <button onclick="promptHandshake()" style="position:absolute; bottom:30px; right:30px; background:#128C7E; color:#FFF; width:55px; height:55px; border-radius:50%; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index:100;">${MUSE_ICONS.plus}</button>
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
                <div id="lynx-messages" style="flex:1; padding:15px; display:flex; flex-direction:column; gap:10px; overflow-y:auto;">
                    <div style="align-self:flex-start; background:#FFF; padding:10px; border-radius:0 10px 10px 10px; font-size:0.9rem; box-shadow:0 1px 1px rgba(0,0,0,0.1);">Architect, the ledger is secure.</div>
                </div>
                <div id="lynx-record-status" style="display:none; padding:10px; text-align:center; color:red; font-weight:900; background:#F0F0F0;">🔴 00:00 - VECTOR RECORDING...</div>
                <div id="lynx-attachment-preview" style="display:none; padding:10px; background:#F9F9F9; border-top:1px solid #EEE;"></div>
                <div style="padding:10px; display:flex; gap:10px; background:#F0F0F0; align-items:center;">
                    <label style="cursor:pointer; color:#777;">${MUSE_ICONS.clip}<input type="file" multiple style="display:none;" onchange="handleAttach(this)"></label>
                    <div style="flex:1; background:#FFF; border-radius:25px; padding:10px 15px; display:flex; align-items:center;">
                        <input id="lynx-input" type="text" placeholder="Type a message" style="flex:1; border:none; outline:none;">
                        <span style="color:#777; cursor:pointer;" onclick="handleMic()">${MUSE_ICONS.mic}</span>
                    </div>
                    <div onclick="sendLynx()" style="background:#128C7E; color:#FFF; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">${MUSE_ICONS.send}</div>
                </div>
            </div>
        `;
    }
}

function toggleSearch() {
    var s = document.getElementById('lynx-search-bar');
    s.style.display = s.style.display === 'none' ? 'block' : 'none';
}

function promptHandshake() {
    var h = prompt("Enter .pri handle to request handshake:");
    if(h) {
        lynxChats.push({ handle: h, lastMsg: 'Handshake Pending...', time: 'Now', avatar: h[0].toUpperCase() });
        renderWallet();
    }
}

function handleMic() {
    var s = document.getElementById('lynx-record-status');
    if(!isRecording) {
        isRecording = true; s.style.display = 'block'; recordTime = 0;
        recordInterval = setInterval(() => {
            recordTime++;
            var m = Math.floor(recordTime/60).toString().padStart(2,'0');
            var sVal = (recordTime%60).toString().padStart(2,'0');
            s.innerHTML = `🔴 ${m}:${sVal} - VECTOR RECORDING...`;
        }, 1000);
    } else {
        isRecording = false; clearInterval(recordInterval); s.style.display = 'none'; alert("Voice Vector Captured.");
    }
}

function handleAttach(input) {
    if(input.files.length > 0) {
        var p = document.getElementById('lynx-attachment-preview');
        p.style.display = 'block';
        p.innerHTML = Array.from(input.files).map(f => `<span style="font-size:0.6rem; font-weight:900; color:#7B35D4; margin-right:10px;">📎 ${f.name}</span>`).join('');
        pendingAttachments = Array.from(input.files);
    }
}

function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && (i.value || pendingAttachments.length > 0)) {
        var m = document.getElementById('lynx-messages');
        m.innerHTML += `<div style="align-self:flex-end; background:#DCF8C6; padding:10px; border-radius:10px 0 10px 10px; font-size:0.9rem; margin-top:5px;">${i.value || 'Shared Vectors'}</div>`;
        i.value = ''; pendingAttachments = [];
        document.getElementById('lynx-attachment-preview').style.display = 'none';
        m.scrollTop = m.scrollHeight;
    }
}
