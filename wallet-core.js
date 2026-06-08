// Priscion MUSE Wallet Core v15.0.0
// THE SOVEREIGN OS: High-Fidelity Smoothness | Persistent Lynx | Fixed Receive Layout

var walletVisible = false;
var currentTab = 'vault';
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// Persistent Chat History (Survives tab switches within session)
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
    } catch (e) {}

    var activeWallet = userWallets[currentWalletIndex];
    
    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; background:#FFF; color:#1A1A1A; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
            <!-- VESPA HEADER -->
            <div style="padding:15px 20px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; background:#FFF; z-index:10;">
                <div style="display:flex; align-items:center; gap:12px; cursor:pointer;" onclick="toggleDropdown()">
                    <div style="width:38px; height:38px; border-radius:50%; background:url('${activeWallet.avatar}') center/cover; border:1px solid #EEE; position:relative; transition: 0.3s;">
                        <input type="file" id="pfp-upload" style="display:none;" onchange="updatePFP(this)">
                        <div onclick="document.getElementById('pfp-upload').click()" style="position:absolute; bottom:0; right:0; background:rgba(0,0,0,0.6); color:#FFF; font-size:9px; padding:3px; border-radius:50%; width:16px; height:16px; display:flex; align-items:center; justify-content:center;">✎</div>
                    </div>
                    <div>
                        <div style="font-weight:900; font-size:0.9rem; display:flex; align-items:center; gap:6px;">
                            ${activeWallet.handle} <span style="font-size:0.6rem; opacity:0.4;">▼</span>
                        </div>
                    </div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#999; font-size:2rem; cursor:pointer; line-height:1;">&times;</button>
            </div>

            <!-- WALLET DROP_DOWN -->
            <div id="wallet-dropdown" style="display:none; background:#F9F9F9; border-bottom:1px solid #EEE; padding:10px; animation: slideDown 0.3s ease-out;">
                <div onclick="alert('Creating Node...')" style="padding:12px 15px; font-weight:700; font-size:0.8rem; cursor:pointer; border-radius:8px; transition:0.2s;" onmouseover="this.style.background='#EEE'" onmouseout="this.style.background='transparent'">Create New Wallet</div>
                <div onclick="alert('Restoring...')" style="padding:12px 15px; font-weight:700; font-size:0.8rem; cursor:pointer; border-radius:8px; transition:0.2s;" onmouseover="this.style.background='#EEE'" onmouseout="this.style.background='transparent'">Restore Wallet</div>
                <div onclick="alert('Connecting Ledger...')" style="padding:12px 15px; font-weight:700; font-size:0.8rem; cursor:pointer; border-radius:8px; transition:0.2s;" onmouseover="this.style.background='#EEE'" onmouseout="this.style.background='transparent'">Connect Ledger</div>
            </div>

            <!-- TABS (Smooth Navigation) -->
            <div style="display:flex; border-bottom:1px solid #EEE; background:#FFF; overflow-x:auto; scrollbar-width:none; z-index:5;">
                ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; min-width:75px; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?'#7B35D4':'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.65rem; letter-spacing:1px; color:${currentTab===tab?'#7B35D4':'#888'}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; position:relative; scroll-behavior:smooth;">
                ${renderView(currentTab, ledger, activeWallet)}
            </div>
        </div>
        <style>
            @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            #wallet-content::-webkit-scrollbar { width: 0; }
        </style>
    `;
}

function toggleDropdown() {
    var d = document.getElementById('wallet-dropdown');
    d.style.display = d.style.display === 'none' ? 'block' : 'none';
}

function updatePFP(input) {
    if(input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            userWallets[0].avatar = e.target.result;
            renderWallet();
        };
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
    return `
        <div style="padding:35px; text-align:center;">
            <div style="font-size:0.7rem; font-weight:900; color:#888; letter-spacing:4px; margin-bottom:12px;">NET RESERVE</div>
            <div style="font-size:2.8rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN ${wallet.balance}</div>
            <div style="font-size:0.65rem; font-weight:900; margin-top:50px; text-align:left; letter-spacing:2px; color:#999; text-transform:uppercase; border-bottom:1px solid #EEE; padding-bottom:10px;">Anchored Assets</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:20px;">
                ${assets.map(a => `<div style="background:#FBFBFB; border:1px solid #EEE; padding:22px; border-radius:18px; font-weight:900; font-size:0.8rem; transition:0.3s;" onmouseover="this.style.borderColor='#7B35D4'">${a.asset || a.handle}</div>`).join('')}
            </div>
        </div>
    `;
}

function renderSwap() {
    return `
        <div style="padding:40px;">
            <div style="background:#F9F9F9; border:1px solid #EEE; padding:25px; border-radius:20px; margin-bottom:10px;">
                <label style="font-size:0.65rem; font-weight:900; color:#888;">FROM</label>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                    <select id="swap-from" style="background:none; border:none; font-weight:900; font-size:1.3rem; outline:none; cursor:pointer;"><option>$PRN</option><option>$MUSD</option></select>
                    <input type="number" value="100.00" style="background:none; border:none; text-align:right; font-weight:900; font-size:1.3rem; width:120px; outline:none;">
                </div>
            </div>
            <div style="text-align:center; margin:-22px 0; position:relative; z-index:2;"><div style="background:#7B35D4; width:44px; height:44px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#FFF; border:6px solid #FFF; box-shadow:0 2px 8px rgba(0,0,0,0.1);">↓</div></div>
            <div style="background:#F9F9F9; border:1px solid #EEE; padding:25px; border-radius:20px;">
                <label style="font-size:0.65rem; font-weight:900; color:#888;">TO</label>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                    <select id="swap-to" style="background:none; border:none; font-weight:900; font-size:1.3rem; outline:none; cursor:pointer;"><option>$MUSD</option><option>$ADA</option><option>$PRN</option></select>
                    <span style="font-weight:900; font-size:1.3rem;">250.00</span>
                </div>
            </div>
            <button onclick="alert('Settling on Chillata...')" style="width:100%; padding:22px; background:#7B35D4; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:35px; cursor:pointer; letter-spacing:2px; font-size:0.8rem; transition:0.3s;" onmouseover="this.style.transform='scale(1.02)'">EXECUTE SWAP</button>
        </div>
    `;
}

function renderReceive(wallet) {
    return `
        <div style="padding:50px 40px; text-align:center; display:flex; flex-direction:column; align-items:center;">
            <div style="background:#000; padding:30px; border-radius:30px; margin-bottom:40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallet.address}" style="width:180px; border-radius:10px;">
            </div>
            <div style="width:100%; background:#F9F9F9; padding:25px; border-radius:20px; border:1px solid #EEE;">
                <div style="font-size:0.6rem; font-weight:900; color:#888; letter-spacing:2px; margin-bottom:12px; text-transform:uppercase;">Wallet Address</div>
                <div style="font-size:0.8rem; font-weight:900; word-break:break-all; line-height:1.4; margin-bottom:20px; color:#333;">${wallet.address}</div>
                <button onclick="navigator.clipboard.writeText('${wallet.address}');alert('Address Copied to Ledger')" style="width:100%; background:#1A1A1A; color:#FFF; border:none; padding:15px; border-radius:100px; font-size:0.75rem; font-weight:900; cursor:pointer; letter-spacing:1px; transition:0.3s;" onmouseover="this.style.background='#7B35D4'">COPY ADDRESS</button>
            </div>
        </div>
    `;
}

function renderSend() {
    return `
        <div style="padding:45px;">
            <div style="margin-bottom:25px;">
                <label style="font-size:0.65rem; font-weight:900; color:#888; margin-bottom:8px; display:block; letter-spacing:1px;">RECIPIENT</label>
                <input type="text" placeholder="@handle.pri" style="width:100%; padding:20px; border-radius:15px; border:1px solid #EEE; outline:none; font-weight:700; font-size:1rem; transition:0.3s;" onfocus="this.style.borderColor='#7B35D4'">
            </div>
            <div style="margin-bottom:25px;">
                <label style="font-size:0.65rem; font-weight:900; color:#888; margin-bottom:8px; display:block; letter-spacing:1px;">AMOUNT ($PRN)</label>
                <input type="number" placeholder="0.00" style="width:100%; padding:20px; border-radius:15px; border:1px solid #EEE; outline:none; font-weight:700; font-size:1rem; transition:0.3s;" onfocus="this.style.borderColor='#7B35D4'">
            </div>
            <button onclick="alert('Atomic Send Authorized')" style="width:100%; padding:22px; background:#1A1A1A; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:20px; cursor:pointer; letter-spacing:2px; font-size:0.8rem; transition:0.3s;" onmouseover="this.style.background='#7B35D4'">CONFIRM SEND</button>
        </div>
    `;
}

function renderDapps() {
    var dapps = [{n:'LEGGO', i:'🌐', u:'leggo.html'}, {n:'PULSE', i:'📈', u:'pulse/'}, {n:'PEANUTS', i:'📊', u:'peanuts/'}, {n:'MYNT', i:'🎨', u:'mynt/'}];
    return `
        <div style="padding:30px; display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            ${dapps.map(d => `<div onclick="window.open('${d.u}')" style="background:#F9F9F9; border:1px solid #EEE; padding:30px 20px; border-radius:25px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='#7B35D4'; this.style.transform='translateY(-5px)'">
                <div style="font-size:2.5rem; margin-bottom:12px;">${d.i}</div>
                <div style="font-weight:900; font-size:0.75rem; letter-spacing:1px; color:#333;">${d.n}</div>
            </div>`).join('')}
        </div>
    `;
}

function renderLynx() {
    if(lynxChatMode === 'list') {
        return `
            <div style="display:flex; flex-direction:column; height:100%; animation: fadeIn 0.3s;">
                <div style="background:#075E54; color:#FFF; padding:18px 25px; display:flex; justify-content:space-between; align-items:center; z-index:10;">
                    <span style="font-weight:700; font-size:1.3rem;">Lynx</span>
                    <div style="display:flex; gap:25px; align-items:center;">
                        <span onclick="toggleSearch()" style="cursor:pointer; opacity:0.8;">${MUSE_ICONS.search}</span>
                        <span style="cursor:pointer; opacity:0.8;">⋮</span>
                    </div>
                </div>
                <div id="lynx-search-bar" style="display:none; padding:12px 20px; background:#F0F0F0; border-bottom:1px solid #DDD; animation: slideDown 0.2s;">
                    <input type="text" placeholder="Search handles..." style="width:100%; padding:12px 18px; border-radius:25px; border:1px solid #DDD; outline:none; font-size:0.9rem;">
                </div>
                <div style="flex:1; overflow-y:auto;">
                    ${lynxChats.map(chat => `
                        <div onclick="openChat('${chat.handle}')" style="padding:18px 20px; display:flex; gap:15px; align-items:center; cursor:pointer; border-bottom:1px solid #F5F5F5; transition:0.2s;" onmouseover="this.style.background='#F9F9F9'" onmouseout="this.style.background='transparent'">
                            <div style="width:54px; height:54px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; color:#FFF; font-size:1.2rem;">${chat.avatar}</div>
                            <div style="flex:1;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="font-weight:700; font-size:1.05rem;">${chat.handle}</span><span style="font-size:0.75rem; color:#888;">${chat.time}</span></div>
                                <div style="font-size:0.9rem; color:#777; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;">${chat.lastMsg}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="promptHandshake()" style="position:absolute; bottom:35px; right:30px; background:#128C7E; color:#FFF; width:60px; height:60px; border-radius:50%; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.25); z-index:100; transition:0.3s;" onmouseover="this.style.transform='scale(1.1)'">${MUSE_ICONS.plus}</button>
            </div>
        `;
    } else {
        return `
            <div style="display:flex; flex-direction:column; height:100%; background:#E5DDD5; animation: fadeIn 0.3s;">
                <div style="background:#075E54; color:#FFF; padding:12px 15px; display:flex; align-items:center; gap:12px;">
                    <div onclick="switchTab('lynx')" style="cursor:pointer;">${MUSE_ICONS.back}</div>
                    <div style="width:42px; height:42px; background:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#075E54; font-weight:900; font-size:1.1rem;">${activeChatHandle[0]}</div>
                    <div style="flex:1;"><div style="font-weight:700; font-size:1rem;">${activeChatHandle}</div><div style="font-size:0.7rem; opacity:0.8;">online</div></div>
                    <div style="display:flex; gap:20px; font-size:1.3rem;"><span>🎥</span><span>📞</span><span>⋮</span></div>
                </div>
                <div id="lynx-messages" style="flex:1; padding:20px; display:flex; flex-direction:column; gap:12px; overflow-y:auto; scroll-behavior:smooth;">
                    ${lynxMessages.map(m => `
                        <div style="align-self:${m.from==='Priscion'?'flex-start':'flex-end'}; background:${m.from==='Priscion'?'#FFF':'#DCF8C6'}; padding:10px 14px; border-radius:${m.from==='Priscion'?'0 12px 12px 12px':'12px 0 12px 12px'}; font-size:0.95rem; box-shadow:0 1px 1px rgba(0,0,0,0.1); max-width:85%; position:relative;">
                            ${m.text}
                            <div style="text-align:right; font-size:0.65rem; color:#999; margin-top:5px;">${m.time} ${m.from==='Priscion'?'':'✓✓'}</div>
                        </div>
                    `).join('')}
                    <div id="msg-anchor"></div>
                </div>
                <div id="lynx-record-status" style="display:none; padding:12px; text-align:center; color:red; font-weight:900; background:#F0F0F0; border-top:1px solid #DDD;">🔴 <span id="timer-val">00:00</span> - VECTOR RECORDING...</div>
                <div id="lynx-attachment-preview" style="display:none; padding:12px; background:#F9F9F9; border-top:1px solid #DDD;"></div>
                <div style="padding:10px; display:flex; gap:10px; background:#F0F0F0; align-items:center;">
                    <label style="cursor:pointer; color:#666;">${MUSE_ICONS.clip}<input type="file" id="lynx-file-input" multiple style="display:none;" onchange="handleAttach(this)"></label>
                    <div style="flex:1; background:#FFF; border-radius:25px; padding:10px 18px; display:flex; align-items:center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        <input id="lynx-input" type="text" placeholder="Type a message" style="flex:1; border:none; outline:none; font-size:1rem;" onkeypress="if(event.key==='Enter')sendLynx()">
                        <span style="color:#666; cursor:pointer; margin-left:10px;" onclick="handleMic()">${MUSE_ICONS.mic}</span>
                    </div>
                    <div onclick="sendLynx()" style="background:#128C7E; color:#FFF; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.1); transition:0.2s;" onmouseover="this.style.transform='scale(1.05)'">${MUSE_ICONS.send}</div>
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
        if(!h.includes('.pri')) h += '.pri';
        lynxChats.push({ handle: h, lastMsg: 'Handshake Pending...', time: 'Now', avatar: h[1].toUpperCase() });
        renderWallet();
    }
}

function handleMic() {
    var s = document.getElementById('lynx-record-status');
    var t = document.getElementById('timer-val');
    if(!isRecording) {
        isRecording = true; s.style.display = 'block'; recordTime = 0;
        recordInterval = setInterval(() => {
            recordTime++;
            var m = Math.floor(recordTime/60).toString().padStart(2,'0');
            var sVal = (recordTime%60).toString().padStart(2,'0');
            t.innerHTML = `${m}:${sVal}`;
        }, 1000);
    } else {
        isRecording = false; clearInterval(recordInterval); s.style.display = 'none'; alert("Voice Vector Captured for Ledger.");
    }
}

function handleAttach(input) {
    if(input.files.length > 0) {
        var p = document.getElementById('lynx-attachment-preview');
        p.style.display = 'block';
        p.innerHTML = Array.from(input.files).map(f => `<span style="font-size:0.7rem; font-weight:900; color:#7B35D4; background:#FFF; padding:4px 10px; border-radius:10px; border:1px solid #EEE; margin-right:8px;">📎 ${f.name}</span>`).join('');
        pendingAttachments = Array.from(input.files);
    }
}

function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && (i.value || pendingAttachments.length > 0)) {
        var now = new Date();
        var timeStr = now.getHours() + ":" + now.getMinutes().toString().padStart(2,'0');
        var text = i.value || (pendingAttachments.length + " Vectors Attached");
        lynxMessages.push({ from: 'User', text: text, time: timeStr });
        renderWallet();
        setTimeout(() => {
            var m = document.getElementById('lynx-messages');
            if(m) m.scrollTop = m.scrollHeight;
        }, 100);
        i.value = ''; pendingAttachments = [];
    }
}
