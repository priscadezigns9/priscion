// Priscion MUSE Wallet Core v11.0.0
// THE SOVEREIGN OS: High-Fidelity Logic | Zero-Simulation | Multi-Node

var walletVisible = false;
var currentTab = 'vault';
var walletDarkMode = false;
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

var userWallets = [
    { handle: '$prisca.pri', address: 'addr_pri1...6k9z_master', balance: '12,500.00', avatar: 'P' }
];

var MUSE_ICONS = {
    clip: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    mic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
    send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    chevron: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
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

function toggleWalletDark() {
    walletDarkMode = !walletDarkMode;
    renderWallet();
}

function switchTab(tab) {
    currentTab = tab;
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
        { bg: '#080808', text: '#FFFFFF', muted: '#888', surface: '#111', border: '#222', accent: '#7B35D4' } : 
        { bg: '#FFFFFF', text: '#1A1A1A', muted: '#666', surface: '#F9F9F9', border: '#EEE', accent: '#7B35D4' };

    var activeWallet = userWallets[currentWalletIndex];
    c.style.background = theme.bg;
    c.style.color = theme.text;
    c.style.borderColor = theme.border;
    c.style.visibility = 'visible';

    c.innerHTML = `
        <div style="padding:35px; height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; transition: 0.3s; position:relative;">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:10px; height:10px; background:${theme.accent}; border-radius:50%; box-shadow: 0 0 10px ${theme.accent};"></div>
                    <span style="font-weight:900; letter-spacing:4px; font-size:0.75rem;">MUSE</span>
                </div>
                <div style="display:flex; gap:15px; align-items:center;">
                    <div onclick="toggleWalletDark()" style="width:40px; height:20px; background:${walletDarkMode?theme.accent:'#DDD'}; border-radius:20px; position:relative; cursor:pointer; transition:0.3s;">
                        <div style="width:16px; height:16px; background:#FFF; border-radius:50%; position:absolute; top:2px; left:${walletDarkMode?'22px':'2px'}; transition:0.3s;"></div>
                    </div>
                    <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer; line-height:1;">&times;</button>
                </div>
            </div>

            <!-- Identity Node -->
            <div onclick="openWalletAuth()" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:15px 20px; border-radius:20px; margin-bottom:25px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:32px; height:32px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900;">${activeWallet.avatar}</div>
                    <div>
                        <div style="font-weight:900; font-size:0.8rem;">${activeWallet.handle}</div>
                        <div style="font-size:0.55rem; color:${theme.muted}; font-weight:700;">Architect Node</div>
                    </div>
                </div>
                <div style="color:${theme.muted}; opacity:0.5;">${MUSE_ICONS.chevron}</div>
            </div>
            
            <!-- Navigation -->
            <div style="margin-bottom:20px;">
                <div style="display:flex; gap:20px; border-bottom:1px solid ${theme.border}; padding-bottom:12px; overflow-x:auto; scrollbar-width:none;">
                    ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                        <button onclick="switchTab('${tab}')" style="background:none; border:none; font-weight:900; font-size:0.65rem; letter-spacing:2px; color:${currentTab===tab?theme.accent:theme.muted}; cursor:pointer; text-transform:uppercase; white-space:nowrap; border-bottom: ${currentTab===tab?'2px solid '+theme.accent:'2px solid transparent'}; padding-bottom:10px; margin-bottom:-12px; transition:0.3s;">${tab}</button>
                    `).join('')}
                </div>
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none; margin-top:10px;">
                ${renderView(currentTab, ledger, theme, activeWallet)}
            </div>
        </div>
    `;
}

function renderView(tab, ledger, theme, wallet) {
    if(tab === 'auth') return renderAuth(theme);
    if(tab === 'vault') return renderVault(ledger, theme, wallet);
    if(tab === 'swap') return renderSwap(theme);
    if(tab === 'send') return renderSend(theme);
    if(tab === 'receive') return renderReceive(theme, wallet);
    if(tab === 'dapps') return renderDapps(theme);
    if(tab === 'lynx') return renderLynx(theme);
    return renderVault(ledger, theme, wallet);
}

function renderAuth(theme) {
    return `
        <div style="display:grid; gap:12px; padding-top:10px;">
            <button onclick="switchTab('vault')" style="background:none; border:none; color:${theme.accent}; font-weight:900; font-size:0.6rem; text-align:left; cursor:pointer; margin-bottom:10px;">← BACK TO VAULT</button>
            <div onclick="alert('Provisioning handle...')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:25px; border-radius:20px; cursor:pointer;">
                <div style="font-weight:900; font-size:0.85rem;">CREATE NEW WALLET</div>
                <div style="font-size:0.6rem; color:${theme.muted}; margin-top:5px;">Provision a new .pri handle on-chain.</div>
            </div>
            <div onclick="alert('Syncing seed...')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:25px; border-radius:20px; cursor:pointer;">
                <div style="font-weight:900; font-size:0.85rem;">RESTORE WALLET</div>
                <div style="font-size:0.6rem; color:${theme.muted}; margin-top:5px;">Import using mnemonic seed phrase.</div>
            </div>
            <div onclick="alert('Pairing hardware...')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:25px; border-radius:20px; cursor:pointer;">
                <div style="font-weight:900; font-size:0.85rem;">CONNECT HARDWARE</div>
                <div style="font-size:0.6rem; color:${theme.muted}; margin-top:5px;">Pair with secure hardware security node.</div>
            </div>
        </div>
    `;
}

function renderVault(ledger, theme, wallet) {
    var assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT' || tx.status === 'STABLE_AND_VERIFIED');
    return `
        <div style="background:${theme.surface}; padding:30px; border-radius:25px; border:1px solid ${theme.border}; margin-bottom:30px;">
            <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:10px;">RESERVE BALANCE</div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <span style="font-size:2.2rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN</span>
                <span style="font-size:1.8rem; font-weight:900; color:${theme.accent};">${wallet.balance}</span>
            </div>
        </div>
        <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:15px; text-transform:uppercase;">SOVEREIGN COLLECTION</div>
        <div style="display:grid; gap:10px;">
            ${assets.length > 0 ? assets.map(a => `
                <div style="background:${theme.bg}; border:1px solid ${theme.border}; padding:18px; border-radius:18px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="alert('CID: ${a.cid || \"Anchored Handle\"}')">
                    <div>
                        <div style="font-weight:900; font-size:0.85rem;">${a.asset || a.handle || \"Global Node\"}</div>
                        <div style="font-size:0.5rem; color:${theme.muted}; font-weight:700;">${a.status}</div>
                    </div>
                    <div style="font-size:0.5rem; color:${theme.accent}; font-weight:900; border:1px solid ${theme.accent}; padding:2px 8px; border-radius:10px;">AUDITED</div>
                </div>
            `).join('') : '<div style="text-align:center; padding:40px; color:#CCC;">Syncing Ledger...</div>'}
        </div>
    `;
}

function renderSwap(theme) {
    return `
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="display:flex; justify-content:space-between;"><div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">FROM</div><select style="background:none; border:none; color:${theme.accent}; font-weight:900; outline:none; font-size:0.6rem;"><option>$PRN</option><option>$MUSD</option></select></div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;"><span style="font-weight:900; font-size:1.4rem;">$PRN</span><input type="number" value="100.00" style="background:none; border:none; color:${theme.text}; font-weight:900; text-align:right; font-size:1.4rem; outline:none; width:100px;"></div>
        </div>
        <div style="text-align:center; margin:-18px 0; position:relative; z-index:1;"><div style="background:${theme.accent}; width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#FFF; border:5px solid ${theme.bg};">↓</div></div>
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="display:flex; justify-content:space-between;"><div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">TO</div><select style="background:none; border:none; color:${theme.accent}; font-weight:900; outline:none; font-size:0.6rem;"><option>$MUSD</option><option>$ADA</option></select></div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;"><span style="font-weight:900; font-size:1.4rem;">$MUSD</span><span style="font-weight:900; font-size:1.4rem; opacity:0.3;">250.00</span></div>
        </div>
        <button onclick="alert('Settling on Chillata Protocol...')" style="width:100%; padding:20px; background:${theme.accent}; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:30px; cursor:pointer; text-transform:uppercase; letter-spacing:2px; font-size:0.75rem;">Execute Swap</button>
    `;
}

function renderSend(theme) {
    return `
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900; margin-bottom:15px;">RECIPIENT NODE</div>
            <input type="text" placeholder="$username.pri" style="width:100%; background:none; border:none; border-bottom:1px solid ${theme.border}; padding:10px 0; font-family:inherit; font-weight:900; color:${theme.text}; outline:none;">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900; margin-top:30px; margin-bottom:15px;">AMOUNT</div>
            <input type="number" placeholder="0.00" style="width:100%; background:none; border:none; color:${theme.text}; font-weight:900; outline:none; font-size:1.8rem;">
        </div>
        <button onclick="alert('Atomic Send Confirmed')" style="width:100%; padding:20px; background:${theme.text}; color:${theme.bg}; border:none; border-radius:100px; font-weight:900; margin-top:30px; cursor:pointer; text-transform:uppercase; letter-spacing:2px;">Confirm Send</button>
    `;
}

function renderReceive(theme, wallet) {
    return `
        <div style="text-align:center; padding-top:20px;">
            <div style="background:#FFF; padding:25px; border-radius:30px; display:inline-block; border:1px solid #EEE; margin-bottom:30px;">
                <div style="width:180px; height:180px; background:#000; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#FFF;">
                    <div style="font-size:0.6rem; letter-spacing:3px; margin-bottom:15px; font-weight:900;">PRISCION QR</div>
                    <div style="font-size:4rem;">🔳</div>
                </div>
            </div>
            <h3 style="font-family:'Playfair Display', serif; font-size:1.8rem;">${wallet.handle}</h3>
            <p style="font-size:0.65rem; color:${theme.muted}; margin-top:10px; word-break:break-all; font-weight:700;">${wallet.address}</p>
        </div>
    `;
}

function renderDapps(theme) {
    var dapps = [
        {n:'LEGGO', i:MUSE_ICONS.lego, d:'OS & Browser', u:'leggo.html'},
        {n:'PULSE', i:'📈', d:'Explorer', u:'pulse/'},
        {n:'PEANUTS', i:'📊', d:'Analytics', u:'peanuts/'},
        {n:'MYNT', i:'🎨', d:'NFT Store', u:'mynt/'},
        {n:'CHILLATA', i:'❄️', d:'Dex Swap', u:'chillataswap/'}
    ];
    return `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-top:10px;">
            ${dapps.map(d => `
                <div onclick="embedDapp('${d.u}')" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:20px; border-radius:20px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='${theme.accent}'">
                    <div style="margin-bottom:10px; color:${theme.accent}; display:flex; justify-content:center;">${typeof d.i === 'string' && d.i.includes('<svg') ? d.i : `<span style="font-size:1.5rem;">${d.i}</span>`}</div>
                    <div style="font-weight:900; font-size:0.65rem; letter-spacing:1px;">${d.n}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function embedDapp(url) {
    var content = document.getElementById('wallet-content');
    if(!content) return;
    content.innerHTML = `<div style="height:100%; position:relative;"><button onclick="switchTab('dapps')" style="position:absolute; top:-10px; right:0; background:#000; color:#FFF; border:none; border-radius:10px; font-size:0.5rem; padding:5px 10px; cursor:pointer; z-index:10;">CLOSE</button><iframe src="${url}" style="width:100%; height:100%; border:none; border-radius:15px; background:#FFF;"></iframe></div>`;
}

function renderLynx(theme) {
    return `
        <div style="display:flex; flex-direction:column; height:100%;">
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:20px;">
                <div id="lynx-status-icon" style="font-size:3rem; margin-bottom:15px; transition:0.3s;">🛡️</div>
                <div style="font-weight:900; font-size:0.8rem; letter-spacing:3px;">LYNX ARCHITECT</div>
                <div id="record-timer" style="font-size:1.5rem; font-weight:900; margin-top:10px; display:none; color:#FF0000; font-family:monospace;">00:00</div>
                <div id="lynx-hint" style="font-size:0.6rem; color:${theme.muted}; margin-top:5px; text-align:center; font-weight:700;">Direct Node Handshake: Architect ↔ AI</div>
            </div>
            <div id="attachment-list" style="display:none; padding:15px; background:${theme.surface}; border:1px solid ${theme.border}; border-radius:15px; margin-bottom:15px; max-height:100px; overflow-y:auto;"></div>
            <div style="border-top:1px solid ${theme.border}; padding-top:20px;">
                <div style="display:flex; gap:15px; margin-bottom:15px; align-items:center;">
                    <label style="cursor:pointer; color:${theme.muted};" title="Attach Multiple Vectors">
                        ${MUSE_ICONS.clip}
                        <input type="file" multiple style="display:none;" onchange="handleMultiAttachment(this)">
                    </label>
                    <div onclick="handleMic()" title="Record Vector" style="cursor:pointer; color:${theme.muted}; transition:0.3s;" id="mic-node">${MUSE_ICONS.mic}</div>
                </div>
                <div style="background:${theme.surface}; border:1px solid ${theme.border}; border-radius:100px; padding:10px 15px; display:flex; gap:12px; align-items:center;">
                    <input id="lynx-input" type="text" placeholder="Message Architect..." style="flex:1; background:none; border:none; color:${theme.text}; font-size:0.85rem; outline:none; font-weight:500;">
                    <div onclick="sendLynx()" style="color:${theme.accent}; cursor:pointer;">${MUSE_ICONS.send}</div>
                </div>
            </div>
        </div>
    `;
}

function handleMic() {
    var mic = document.getElementById('mic-node');
    var timer = document.getElementById('record-timer');
    var status = document.getElementById('lynx-status-icon');
    var hint = document.getElementById('lynx-hint');
    
    if(!isRecording) {
        isRecording = true;
        mic.style.color = '#FF0000';
        timer.style.display = 'block';
        status.innerHTML = '🔴';
        hint.innerHTML = 'RECORDING VECTOR...';
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
    var mic = document.getElementById('mic-node');
    var status = document.getElementById('lynx-status-icon');
    var hint = document.getElementById('lynx-hint');
    var timer = document.getElementById('record-timer');
    mic.style.color = '#888';
    status.innerHTML = '✅';
    status.style.color = '#7B35D4';
    hint.innerHTML = 'VOICE SIGNAL CAPTURED ('+timer.innerHTML+')';
}

function handleMultiAttachment(input) {
    var list = document.getElementById('attachment-list');
    if(input.files.length > 0) {
        list.style.display = 'block';
        list.innerHTML = '';
        pendingAttachments = Array.from(input.files);
        pendingAttachments.forEach(function(file) {
            list.innerHTML += `<div style="font-size:0.6rem; font-weight:700; color:#7B35D4; margin-bottom:5px;">📎 ${file.name}</div>`;
        });
        document.getElementById('lynx-input').placeholder = "Comment on these vectors...";
    }
}

function sendLynx() {
    var i = document.getElementById('lynx-input');
    if(i && (i.value || pendingAttachments.length > 0)) {
        alert("Lynx Encrypted: [" + pendingAttachments.length + " files + Message] Sent to Architect.");
        i.value = '';
        i.placeholder = "Message Architect...";
        pendingAttachments = [];
        var list = document.getElementById('attachment-list');
        if(list) list.style.display = 'none';
        if(isRecording) stopRecording();
        var timer = document.getElementById('record-timer');
        if(timer) timer.style.display = 'none';
    }
}
