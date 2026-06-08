// Priscion MUSE Wallet Core v24.0.0
// THE SOVEREIGN OS: Absolute Stability | Global Scope Handlers | High-Fidelity Asset Registry

var walletVisible = false;
var currentTab = 'vault';
var currentWalletIndex = 0;
var isRecording = false;
var recordTime = 0;
var recordInterval;
var pendingAttachments = [];

// Persistent Session Data
var lynxMessages = JSON.parse(localStorage.getItem('lynx_ledger_v1')) || [
    { from: 'Priscion', text: 'Architect, the Sovereign Node is Always Online. Ledger Handshake verified.', time: '21:10', status: 'seen' }
];

function syncLynxToLedger() {
    try {
        localStorage.setItem('lynx_ledger_v1', JSON.stringify(lynxMessages));
    } catch(e) {}
}

var userWallets = [
    { 
        handle: '$prisca.pri', 
        address: 'addr_pri1q9z5l4rwjxh6k9z_master_node', 
        balance: '12,500.00', 
        avatar: 'assets/muse_logo.png' 
    }
];

var lynxChatMode = 'list'; 
var activeChatHandle = null;
var lynxChats = [
    { handle: 'Priscion', lastMsg: 'Sovereign Node: Always Online.', time: 'Now', avatar: 'P', unread: 0, status: 'online' },
    { handle: '$vogue.pri', lastMsg: 'Handshake accepted.', time: '18:45', avatar: 'V', unread: 0, status: 'offline' }
];

var filteredLynxChats = [...lynxChats];

window.toggleSidebar = function() {
    walletVisible = !walletVisible;
    const sidebar = document.getElementById('sidebar');
    if (walletVisible) {
        sidebar.classList.add('active');
        renderWallet();
    } else {
        sidebar.classList.remove('active');
    }
};

window.switchTab = function(tab) {
    currentTab = tab; lynxChatMode = 'list'; renderWallet();
};

window.renderWallet = function() {
    const sidebar = document.getElementById('sidebar');
    const activeWallet = userWallets[currentWalletIndex];
    const ledger = [
        { asset: '$PRN', balance: activeWallet.balance, status: 'SECURED_IN_VAULT', handle: activeWallet.handle }
    ];

    sidebar.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; background:#FFF; font-family:'Inter', sans-serif;">
            <!-- HEADER -->
            <div style="padding:25px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; background:#FBFBFB;">
                <div style="display:flex; align-items:center; gap:12px;" onclick="document.getElementById('wallet-dropdown').style.display='block'">
                    <img src="${activeWallet.avatar}" style="width:38px; height:38px; border-radius:50%; background:#EEE;">
                    <div>
                        <div style="font-weight:900; font-size:0.75rem;">${activeWallet.handle}</div>
                        <div style="font-size:0.55rem; color:#999; font-weight:700; letter-spacing:0.5px;">MASTER NODE • VERIFIED</div>
                    </div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#999; font-size:2rem; cursor:pointer; line-height:1;">&times;</button>
            </div>

            <!-- DROP_DOWN -->
            <div id="wallet-dropdown" style="display:none; background:#F9F9F9; border-bottom:1px solid #EEE; padding:10px;">
                <div onclick="createNewWallet()" style="padding:12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Create New Wallet</div>
                <div onclick="restoreWallet()" style="padding:12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Restore Wallet</div>
                <div onclick="connectLedger()" style="padding:12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Connect Ledger</div>
            </div>

            <!-- TABS -->
            <div id="main-tabs" style="display:flex; border-bottom:1px solid #EEE; background:#FFF; overflow-x:auto; scrollbar-width:none; z-index:5;">
                ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; min-width:75px; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?'#FF4D4D':'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.65rem; letter-spacing:1px; color:${currentTab===tab?'#FF4D4D':'#888'}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; position:relative;">
                ${renderView(currentTab, ledger, activeWallet)}
            </div>
        </div>
    `;
};

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
    return `<div style="padding:35px; text-align:center;">
        <div style="font-size:0.7rem; font-weight:900; color:#888; letter-spacing:4px; margin-bottom:12px;">NET RESERVE</div>
        <div style="font-size:2.8rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN ${wallet.balance}</div>
        <div style="margin-top:20px;">
            <div style="background:#FBFBFB; border:1px solid #EEE; padding:22px; border-radius:18px; font-weight:900; font-size:0.8rem;">$PRN SOVEREIGN ASSET</div>
        </div>
    </div>`;
}

function renderSwapHybrid() {
    return `<div style="padding:30px; display:flex; flex-direction:column; gap:20px;">
        <div style="background:#F9F9F9; padding:20px; border-radius:20px; border:1px solid #EEE;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span style="font-size:0.6rem; font-weight:900; color:#888;">FROM</span></div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <input id="swap-amount" type="number" style="background:none; border:none; font-size:1.5rem; font-weight:900; width:60%; outline:none;" value="100">
                <div style="background:#FFF; padding:8px 15px; border-radius:100px; font-weight:900; font-size:0.7rem; border:1px solid #EEE;">$PRN</div>
            </div>
        </div>
        <div style="background:#F9F9F9; padding:20px; border-radius:20px; border:1px solid #EEE;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span style="font-size:0.6rem; font-weight:900; color:#888;">TO (EST)</span></div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:1.5rem; font-weight:900;">100.00</div>
                <div style="background:#FFF; padding:8px 15px; border-radius:100px; font-weight:900; font-size:0.7rem; border:1px solid #EEE;">$MUSD</div>
            </div>
        </div>
        <button onclick="executeSwap()" style="width:100%; padding:22px; background:#FF4D4D; color:#FFF; border:none; border-radius:100px; font-weight:900; font-size:0.8rem; cursor:pointer;">SWAP ASSETS</button>
    </div>`;
}

function renderSend() {
    return `<div style="padding:45px;"><input type="text" placeholder="@handle.pri" style="width:100%; padding:20px; border-radius:15px; border:1px solid #EEE; outline:none; font-weight:700;"><button style="width:100%; padding:22px; background:#1A1A1A; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:20px;">SEND</button></div>`;
}

function renderReceive(wallet) {
    return `<div style="padding:50px 40px; text-align:center;"><div style="background:#000; padding:30px; border-radius:30px; margin-bottom:40px;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallet.address}" style="width:180px;"></div><div style="width:100%; background:#F9F9F9; padding:25px; border-radius:20px; border:1px solid #EEE;"><div style="font-size:0.8rem; font-weight:900; word-break:break-all; margin-bottom:20px;">${wallet.address}</div><button onclick="navigator.clipboard.writeText('${wallet.address}');alert('Copied')" style="width:100%; background:#1A1A1A; color:#FFF; border:none; padding:15px; border-radius:100px; font-size:0.75rem; font-weight:900;">COPY ADDRESS</button></div></div>`;
}

function renderDapps() {
    var dapps = [
        {n:'MUSE', i:'assets/muse_logo.png', u:'muse.html'},
        {n:'CHILLATA', i:'assets/chillata_logo.png', u:'swap'},
        {n:'ATELIA', i:'assets/atelia.webp', u:'ateliagaming/'},
        {n:'DREAMING', i:'assets/dreaming_anime.png', u:'dreaminganime/'},
        {n:'LEGGO', i:'assets/leggo_logo.png', u:'leggo.html'},
        {n:'PULSE', i:'assets/priscion_logo.png', u:'pulse.html'}
    ];
    return `<div style="padding:25px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">${dapps.map(d => `
        <div onclick="${d.u==='swap'?'switchTab(\'swap\')':'window.open(\''+d.u+'\')'}" style="background:#F9F9F9; border:1px solid #EEE; padding:20px; border-radius:20px; text-align:center; cursor:pointer;">
            <img src="${d.i}" style="height:40px; margin-bottom:10px; display:block; margin-left:auto; margin-right:auto;">
            <div style="font-weight:900; font-size:0.6rem; letter-spacing:1px;">${d.n}</div>
        </div>`).join('')}</div>`;
}

function renderLynx() {
    return `<div style="padding:25px; text-align:center;"><img src="assets/lynx_logo.png" style="height:60px; margin-bottom:20px;"><div style="font-weight:900; font-size:1rem;">Lynx Messenger</div><p style="font-size:0.8rem; color:#888;">Secure Communication Node Active.</p></div>`;
}

window.createNewWallet = function() {
    const handle = prompt("Enter handle:");
    if(!handle) return;
    userWallets.push({ handle, address: "addr_pri"+Math.random().toString(36).substring(7), balance: "0.00", avatar: 'assets/muse_logo.png' });
    alert("Created " + handle);
    renderWallet();
};

window.restoreWallet = function() {
    if(prompt("Recovery Phrase:")) alert("Restored.");
};

window.connectLedger = function() {
    alert("Searching Ledger...");
    setTimeout(() => { alert("Connected."); }, 1000);
};

window.executeSwap = function() {
    const amt = document.getElementById('swap-amount').value;
    if(!amt || amt <= 0) return alert("Enter valid amount");
    alert("Swapping " + amt + " $PRN...");
    setTimeout(() => { alert("Success."); }, 1000);
};
