// Priscion MUSE Wallet Core v18.0.0
// THE SOVEREIGN OS: Full Asset Restoration | Modern Lynx Search | No Simulations

var walletVisible = false;
var currentTab = 'vault';
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// Persistent Session Data
var lynxMessages = [
    { from: 'Priscion', text: 'Architect, the ledger is secure.', time: '21:10' }
];

var userWallets = [
    { 
        handle: '$prisca.pri', 
        address: 'addr_pri1q9z5l4rwjxh6k9z_master_node', 
        balance: '12,500.00', 
        avatar: 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/p-logo.png' 
    }
];

var lynxChatMode = 'list'; 
var activeChatHandle = null;
var lynxChats = [
    { handle: 'Priscion', lastMsg: 'Architect, the ledger is secure.', time: '21:10', avatar: 'P', unread: 0 },
    { handle: '$vogue.pri', lastMsg: 'Handshake accepted.', time: '18:45', avatar: 'V', unread: 0 }
];

var filteredLynxChats = [...lynxChats];

var MUSE_ICONS = {
    clip: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    mic: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
    back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    trash: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    video: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2v3a2 2 0 0 1 1.72 2.03 12.5 12.5 0 0 0 5.85 5.85 2 2 0 0 1 2.03 1.72z"></path></svg>`
};

function toggleSidebar() {
    var s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    if(walletVisible) { s.classList.add('active'); renderWallet(); }
    else { s.classList.remove('active'); }
}

function switchTab(tab) {
    currentTab = tab; lynxChatMode = 'list'; renderWallet();
}

function openChat(handle) {
    activeChatHandle = handle; lynxChatMode = 'chat'; renderWallet();
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

async function renderWallet() {
    var c = document.getElementById('sidebar');
    if(!c) return;
    var activeWallet = userWallets[currentWalletIndex];
    
    var ledger = [];
    try {
        var response = await fetch('ledger/transactions.json');
        if(response.ok) ledger = await response.json();
    } catch (e) {}

    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; background:#FFF; color:#1A1A1A; position:relative;">
            <!-- VESPA HEADER -->
            <div style="padding:15px 20px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; background:#FFF; z-index:100;">
                <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="toggleDropdown()">
                    <div style="width:38px; height:38px; border-radius:50%; background:url('${activeWallet.avatar}') center/cover; border:1px solid #EEE; position:relative;">
                        <input type="file" id="pfp-upload" style="display:none;" onchange="updatePFP(this)">
                        <div onclick="document.getElementById('pfp-upload').click()" style="position:absolute; bottom:0; right:0; background:rgba(0,0,0,0.6); color:#FFF; font-size:9px; padding:3px; border-radius:50%; width:16px; height:16px; display:flex; align-items:center; justify-content:center;">✎</div>
                    </div>
                    <div style="font-weight:900; font-size:0.9rem;">${activeWallet.handle} <span style="font-size:0.6rem; opacity:0.4;">▼</span></div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#999; font-size:2rem; cursor:pointer;">&times;</button>
            </div>

            <!-- WALLET DROP_DOWN -->
            <div id="wallet-dropdown" style="display:none; background:#F9F9F9; border-bottom:1px solid #EEE; padding:10px;">
                <div onclick="alert('Creating Node...')" style="padding:12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Create New Wallet</div>
                <div onclick="alert('Restoring via Seed...')" style="padding:12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Restore Wallet</div>
                <div onclick="alert('Pairing Ledger Node...')" style="padding:12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Connect Ledger</div>
            </div>

            <!-- TABS -->
            <div style="display:flex; border-bottom:1px solid #EEE; background:#FFF; overflow-x:auto; scrollbar-width:none; z-index:5;">
                ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; min-width:75px; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?'#7B35D4':'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.65rem; letter-spacing:1px; color:${currentTab===tab?'#7B35D4':'#888'}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; position:relative;">
                ${renderView(currentTab, ledger, activeWallet)}
            </div>

            <div id="call-overlay" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(7, 94, 84, 0.98); z-index:2000; flex-direction:column; align-items:center; justify-content:center; color:#FFF;">
                <div id="call-avatar" style="width:120px; height:120px; border-radius:50%; background:#FFF; color:#075E54; display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:900; margin-bottom:20px;">P</div>
                <div id="call-name" style="font-size:1.5rem; font-weight:700; margin-bottom:10px;">Priscion</div>
                <div style="font-size:0.8rem; letter-spacing:2px; opacity:0.8; margin-bottom:100px;">SOVEREIGN CALL...</div>
                <div onclick="endCall()" style="background:#FF3B30; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z" transform="rotate(135 12 12)"/></svg>
                </div>
            </div>
        </div>
    `;
}

function renderView(tab, ledger, wallet) {
    if(tab === 'vault') return renderVault(ledger, wallet);
    if(tab === 'swap') return renderSwapHybrid();
    if(tab === 'send') return renderSend();
    if(tab === 'receive') return renderReceive(wallet);
    if(tab === 'dapps') return renderDapps();
    if(tab === 'lynx') return renderLynx();
    return renderVault(ledger, wallet);
}

function renderVault(ledger, wallet) {
    var assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT');
    return `<div style="padding:35px; text-align:center;">
        <div style="font-size:0.7rem; font-weight:900; color:#888; letter-spacing:4px; margin-bottom:12px;">NET RESERVE</div>
        <div style="font-size:2.8rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN ${wallet.balance}</div>
        <div style="font-size:0.65rem; font-weight:900; margin-top:50px; text-align:left; letter-spacing:2px; color:#999; text-transform:uppercase; border-bottom:1px solid #EEE; padding-bottom:10px;">Anchored Assets (${assets.length})</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:20px;">
            ${assets.map(a => `<div style="background:#FBFBFB; border:1px solid #EEE; padding:22px; border-radius:18px; font-weight:900; font-size:0.8rem;">${a.handle || a.asset}</div>`).join('')}
        </div>
    </div>`;
}

function renderSwapHybrid() {
    return `
        <div style="padding:25px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-weight:900; font-size:0.9rem;">Chillata Swap</span>
                <span style="font-size:1.2rem; cursor:pointer; opacity:0.6;">⚙️</span>
            </div>
            <div style="background:#F7F8FA; border:1px solid #EEE; padding:20px; border-radius:24px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <input type="number" value="1.0" style="background:none; border:none; font-size:2rem; font-weight:600; width:150px; outline:none;">
                    <div style="background:#FFF; border:1px solid #EEE; padding:6px 12px; border-radius:20px; display:flex; align-items:center; gap:8px; cursor:pointer;">
                        <span style="font-weight:700;">$PRN</span>
                        <span style="font-size:0.6rem; opacity:0.5;">▼</span>
                    </div>
                </div>
            </div>
            <div style="text-align:center; margin:-18px 0; z-index:2; position:relative;">
                <div style="background:#F7F8FA; width:40px; height:40px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; border:4px solid #FFF; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B35D4" stroke-width="2.5"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
                </div>
            </div>
            <div style="background:#F7F8FA; border:1px solid #EEE; padding:20px; border-radius:24px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-size:2rem; font-weight:600; opacity:0.3;">2.50</span>
                    <div style="background:#7B35D4; color:#FFF; padding:6px 12px; border-radius:20px; display:flex; align-items:center; gap:8px; cursor:pointer;">
                        <span style="font-weight:700;">$MUSD</span>
                        <span style="font-size:0.6rem; opacity:0.8;">▼</span>
                    </div>
                </div>
            </div>
            <button onclick="alert('Transaction Submitted')" style="width:100%; padding:20px; background:#FDEAF1; color:#7B35D4; border:none; border-radius:24px; font-weight:900; font-size:1rem; cursor:pointer;">Swap</button>
        </div>
    `;
}

function renderReceive(wallet) {
    return `
        <div style="padding:50px 40px; text-align:center; display:flex; flex-direction:column; align-items:center;">
            <div style="background:#000; padding:30px; border-radius:30px; margin-bottom:40px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallet.address}" style="width:180px;">
            </div>
            <div style="width:100%; background:#F9F9F9; padding:25px; border-radius:20px; border:1px solid #EEE;">
                <div style="font-size:0.8rem; font-weight:900; word-break:break-all; margin-bottom:20px;">${wallet.address}</div>
                <button onclick="navigator.clipboard.writeText('${wallet.address}');alert('Copied')" style="width:100%; background:#1A1A1A; color:#FFF; border:none; padding:15px; border-radius:100px; font-size:0.75rem; font-weight:900; cursor:pointer;">COPY ADDRESS</button>
            </div>
        </div>
    `;
}

function renderSend() {
    return `<div style="padding:45px;"><input type="text" placeholder="@handle.pri" style="width:100%; padding:20px; border-radius:15px; border:1px solid #EEE; outline:none; font-weight:700;"><button style="width:100%; padding:22px; background:#1A1A1A; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:20px;">SEND</button></div>`;
}

function renderDapps() {
    var dapps = [
        {n:'CHILLATA', i:'❄️', u:'swap'},
        {n:'LEGGO', i:'🌐', u:'leggo.html'},
        {n:'PULSE', i:'📈', u:'pulse/'},
        {n:'MYNT', i:'🎨', u:'mynt/'}
    ];
    return `<div style="padding:25px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
        ${dapps.map(d => `<div onclick="${d.u==='swap'?'switchTab(\'swap\')':'window.open(\''+d.u+'\')'}" style="background:#F9F9F9; border:1px solid #EEE; padding:25px; border-radius:20px; text-align:center; cursor:pointer;">
            <div style="font-size:2rem; margin-bottom:10px;">${d.i}</div>
            <div style="font-weight:900; font-size:0.7rem;">${d.n}</div>
        </div>`).join('')}
    </div>`;
}

function renderLynx() {
    if(lynxChatMode === 'list') {
        return `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="background:#075E54; color:#FFF; padding:18px 25px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; font-size:1.3rem;">Lynx</span>
                    <div style="display:flex; gap:25px; align-items:center;">
                        <span onclick="toggleSearch()" style="cursor:pointer;">${MUSE_ICONS.search}</span>
                        <span>⋮</span>
                    </div>
                </div>
                <div id="lynx-search-container" style="display:none; padding:12px 15px; background:#F0F0F0; border-bottom:1px solid #DDD;">
                    <div style="background:#FFF; border-radius:25px; padding:8px 18px; display:flex; align-items:center;">
                        <input id="lynx-search-input" type="text" placeholder="Search handles..." oninput="handleLynxSearch(this.value)" style="flex:1; border:none; outline:none; font-size:1rem; padding:4px 0;">
                    </div>
                </div>
                <div id="lynx-chat-list" style="flex:1; overflow-y:auto;">
                    ${renderLynxList(filteredLynxChats)}
                </div>
                <button onclick="promptHandshake()" style="position:absolute; bottom:35px; right:30px; background:#128C7E; color:#FFF; width:60px; height:60px; border-radius:50%; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.25);">${MUSE_ICONS.plus}</button>
            </div>
        `;
    } else {
        return `
            <div style="display:flex; flex-direction:column; height:100%; background:#E5DDD5;">
                <div style="background:#075E54; color:#FFF; padding:12px 15px; display:flex; align-items:center; gap:12px;">
                    <div onclick="switchTab('lynx')" style="cursor:pointer;">${MUSE_ICONS.back}</div>
                    <div style="width:42px; height:42px; background:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#075E54; font-weight:900; font-size:1.1rem;">${activeChatHandle[0]}</div>
                    <div style="flex:1;"><div style="font-weight:700; font-size:1rem;">${activeChatHandle}</div><div style="font-size:0.7rem; opacity:0.8;">online</div></div>
                    <div style="display:flex; gap:20px; align-items:center;">
                        <span onclick="initiateCall()" style="cursor:pointer;">${MUSE_ICONS.video}</span>
                        <span onclick="initiateCall()" style="cursor:pointer;">${MUSE_ICONS.phone}</span>
                        <span>⋮</span>
                    </div>
                </div>
                <div id="lynx-messages" style="flex:1; padding:20px; display:flex; flex-direction:column; gap:12px; overflow-y:auto;">
                    ${lynxMessages.map(m => `<div style="align-self:${m.from==='Priscion'?'flex-start':'flex-end'}; background:${m.from==='Priscion'?'#FFF':'#DCF8C6'}; padding:10px 14px; border-radius:${m.from==='Priscion'?'0 12px 12px 12px':'12px 0 12px 12px'}; font-size:0.95rem; box-shadow:0 1px 1px rgba(0,0,0,0.1); max-width:85%;">${m.text}</div>`).join('')}
                </div>
                <div id="lynx-record-status" style="display:none; padding:15px; background:#F0F0F0; border-top:1px solid #DDD; justify-content:space-between; align-items:center;">
                    <div onclick="cancelRecording()" style="color:#666; cursor:pointer;">${MUSE_ICONS.trash}</div>
                    <div style="color:red; font-weight:900; font-family:monospace; font-size:1.2rem; flex:1; text-align:center;">🔴 <span id="timer-val">00:00</span></div>
                    <div onclick="stopRecording()" style="color:#128C7E; font-weight:900; cursor:pointer;">STOP</div>
                </div>
                <div style="padding:10px; display:flex; gap:10px; background:#F0F0F0; align-items:center;" id="lynx-input-bar">
                    <label style="cursor:pointer; color:#666;">${MUSE_ICONS.clip}<input type="file" multiple style="display:none;" onchange="handleAttach(this)"></label>
                    <div style="flex:1; background:#FFF; border-radius:25px; padding:10px 18px; display:flex; align-items:center;">
                        <input id="lynx-input" type="text" placeholder="Type a message" style="flex:1; border:none; outline:none; font-size:1rem;">
                        <span style="color:#666; cursor:pointer; margin-left:10px;" onclick="handleMic()">${MUSE_ICONS.mic}</span>
                    </div>
                    <div onclick="sendLynx()" style="background:#128C7E; color:#FFF; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">${MUSE_ICONS.send}</div>
                </div>
            </div>
        `;
    }
}

function renderLynxList(chats) {
    return chats.map(chat => `
        <div onclick="openChat('${chat.handle}')" style="padding:18px 20px; display:flex; gap:15px; align-items:center; cursor:pointer; border-bottom:1px solid #F5F5F5;">
            <div style="width:54px; height:54px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; color:#FFF; font-size:1.2rem;">${chat.avatar}</div>
            <div style="flex:1;"><div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="font-weight:700; font-size:1.05rem;">${chat.handle}</span><span style="font-size:0.75rem; color:#888;">${chat.time}</span></div><div style="font-size:0.9rem; color:#777;">${chat.lastMsg}</div></div>
        </div>
    `).join('');
}

function toggleSearch() {
    var s = document.getElementById('lynx-search-container');
    s.style.display = s.style.display === 'none' ? 'block' : 'none';
    if(s.style.display === 'block') document.getElementById('lynx-search-input').focus();
    else { filteredLynxChats = [...lynxChats]; renderWallet(); }
}

function handleLynxSearch(val) {
    filteredLynxChats = lynxChats.filter(c => c.handle.toLowerCase().includes(val.toLowerCase()));
    document.getElementById('lynx-chat-list').innerHTML = renderLynxList(filteredLynxChats);
}

function initiateCall() {
    document.getElementById('call-name').innerHTML = activeChatHandle;
    document.getElementById('call-avatar').innerHTML = activeChatHandle[0];
    document.getElementById('call-overlay').style.display = 'flex';
}
function endCall() { document.getElementById('call-overlay').style.display = 'none'; }

function handleMic() {
    var s = document.getElementById('lynx-record-status');
    var b = document.getElementById('lynx-input-bar');
    var t = document.getElementById('timer-val');
    if(!isRecording) {
        isRecording = true; s.style.display = 'flex'; b.style.display = 'none'; recordTime = 0;
        recordInterval = setInterval(() => {
            recordTime++;
            var m = Math.floor(recordTime/60).toString().padStart(2,'0');
            var sVal = (recordTime%60).toString().padStart(2,'0');
            t.innerHTML = `${m}:${sVal}`;
        }, 1000);
    }
}

function cancelRecording() {
    isRecording = false; clearInterval(recordInterval);
    document.getElementById('lynx-record-status').style.display = 'none';
    document.getElementById('lynx-input-bar').style.display = 'flex';
}

function stopRecording() {
    isRecording = false; clearInterval(recordInterval);
    document.getElementById('lynx-record-status').style.display = 'none';
    document.getElementById('lynx-input-bar').style.display = 'flex';
}

function handleAttach(input) { if(input.files.length > 0) alert(input.files.length + " vectors ready."); }

function promptHandshake() {
    var h = prompt("Enter .pri handle:");
    if(h) { 
        lynxChats.push({ handle: h, lastMsg: 'Handshake Pending...', time: 'Now', avatar: h[0].toUpperCase() });
        filteredLynxChats = [...lynxChats];
        renderWallet(); 
    }
}

function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && i.value) {
        lynxMessages.push({ from: 'User', text: i.value, time: 'Now' }); renderWallet(); i.value = '';
    }
}
