// Priscion MUSE Wallet Core v24.2.0 (Pulse Integrated)
// NO SIMULATION | DIRECT LEDGER HANDSHAKE | REAL-TIME BLOCK MONITORING

var walletVisible = false;
var currentTab = 'vault';
var userWallets = [];
var lynxMessages = [];
var ledgerState = { height: 0, snapshot: 'N/A', status: 'Connecting...' };

// Initialize Sovereign State from L1 Kernel
async function initSovereignOS() {
    try {
        const genResp = await fetch('ledger/kernel/genesis.json');
        const genesis = await genResp.json();
        
        userWallets = [{ 
            handle: genesis.architect, 
            address: 'addr_pri1q9z5l4rwjxh6k9z_master_node', 
            balance: genesis.genesis_allocation['$prisca.pri'], 
            avatar: 'assets/muse_logo.png' 
        }];
        
        // Initial Ledger Sync
        await syncLedger();
        setInterval(syncLedger, 30000); // Pulse heartbeat every 30s
        
        // Load messages from Lynx Ledger (Content-Addressed)
        const msgResp = await fetch('ledger/lynx_messages.json');
        if(msgResp.ok) { lynxMessages = await msgResp.json(); }
        
        renderWallet();
        console.log("MUSE: Sovereign L1 Handshake Complete.");
    } catch(e) {
        console.error("MUSE: L1 Connection Error", e);
        ledgerState.status = 'Disconnected';
    }
}

async function syncLedger() {
    try {
        const mapResp = await fetch('ledger/network/ipfs_mapping.json');
        const mapping = await mapResp.json();
        const snapResp = await fetch('ledger/snapshots/v7.json');
        const snap = await snapResp.json();
        
        ledgerState = {
            height: snap.anchor_height,
            snapshot: snap.snapshot_id,
            cid: mapping.global_state_cid,
            status: 'Synced'
        };
        if(walletVisible) renderWallet();
    } catch(e) {
        ledgerState.status = 'Sync Error';
    }
}

var MUSE_ICONS = {
    clip: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
    seen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34B7F1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline><polyline points="22 11 11 22 6 17"></polyline></svg>`
};

window.toggleSidebar = function() {
    var s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    walletVisible ? s.classList.add('active') : s.classList.remove('active');
    if(walletVisible) renderWallet();
};

window.switchTab = (tab) => { currentTab = tab; renderWallet(); };

async function renderWallet() {
    var c = document.getElementById('sidebar');
    if(!c || userWallets.length === 0) return;
    var w = userWallets[0];

    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; background:#FFF; color:#1A1A1A; font-family: 'Inter', sans-serif;">
            <div style="padding:20px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${w.avatar}" style="width:35px; height:35px; border-radius:50%; object-fit:contain; border:1px solid #EEE;">
                    <div style="font-weight:900; font-size:0.9rem;">${w.handle}</div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
            </div>
            <div style="display:flex; border-bottom:1px solid #EEE;">
                ${['vault', 'pulse', 'lynx', 'dapps'].map(t => `
                    <div onclick="switchTab('${t}')" style="flex:1; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 2px solid ${currentTab===t?'#7B35D4':'transparent'}; font-size:0.6rem; font-weight:900; color:${currentTab===t?'#7B35D4':'#888'}; text-transform:uppercase; letter-spacing:1px;">${t}</div>
                `).join('')}
            </div>
            <div style="flex:1; overflow-y:auto; padding:20px;">
                ${renderView(currentTab, w)}
            </div>
            <div style="padding:10px 20px; background:#F9F9F9; border-top:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; font-size:0.6rem; font-weight:700;">
                <div style="color:${ledgerState.status==='Synced'?'#2ECC71':'#E74C3C'}; text-transform:uppercase; letter-spacing:1px;">${ledgerState.status}</div>
                <div style="color:#888;">BLOCK #${ledgerState.height}</div>
            </div>
        </div>
    `;
}

function renderView(t, w) {
    if(t === 'vault') return `
        <div style="text-align:center; padding-top:40px;">
            <div style="font-size:0.6rem; letter-spacing:3px; color:#888; font-weight:900; margin-bottom:10px; text-transform:uppercase;">SOVEREIGN BALANCE</div>
            <div style="font-size:2.8rem; font-weight:900; font-family: 'Playfair Display', serif;">$PRN ${Number(w.balance).toLocaleString()}</div>
            <div style="margin-top:30px; font-size:0.7rem; color:#AAA; font-family:monospace; word-break:break-all; background:#F9F9F9; padding:15px; border-radius:10px;">${w.address}</div>
        </div>
    `;
    if(t === 'pulse') return `
        <div style="padding:10px;">
            <div style="font-weight:900; font-size:0.7rem; color:#888; letter-spacing:2px; margin-bottom:20px; text-transform:uppercase;">NETWORK METRICS</div>
            <div style="display:flex; flex-direction:column; gap:15px;">
                <div style="background:#F9F9F9; padding:15px; border-radius:12px; border-left:4px solid #7B35D4;">
                    <div style="font-size:0.6rem; color:#AAA; font-weight:900; margin-bottom:5px;">STATE SNAPSHOT</div>
                    <div style="font-weight:900; font-size:0.8rem;">${ledgerState.snapshot}</div>
                </div>
                <div style="background:#F9F9F9; padding:15px; border-radius:12px; border-left:4px solid #34B7F1;">
                    <div style="font-size:0.6rem; color:#AAA; font-weight:900; margin-bottom:5px;">IPFS ANCHOR (CID)</div>
                    <div style="font-weight:900; font-size:0.65rem; font-family:monospace; word-break:break-all;">${ledgerState.cid}</div>
                </div>
            </div>
            <button onclick="window.open('pulse.html')" style="width:100%; margin-top:30px; padding:15px; background:#1A1A1A; color:#FFF; border:none; border-radius:12px; font-weight:900; font-size:0.7rem; letter-spacing:1px; cursor:pointer;">OPEN FULL EXPLORER</button>
        </div>
    `;
    if(t === 'lynx') return renderLynx();
    if(t === 'dapps') return renderDapps();
}

function renderDapps() {
    var ds = [{n:'MYNT', i:'assets/muse_logo.png', u:'mynt/'}, {n:'LEGGO', i:'assets/leggo_logo.png', u:'leggo.html'}];
    return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
        ${ds.map(d => `<div onclick="window.open('${d.u}')" style="background:#F9F9F9; padding:20px; border-radius:15px; text-align:center; cursor:pointer; border:1px solid #EEE;">
            <img src="${d.i}" style="width:30px; height:30px; margin-bottom:10px; object-fit:contain;">
            <div style="font-weight:900; font-size:0.6rem; letter-spacing:1px;">${d.n}</div>
        </div>`).join('')}
    </div>`;
}

function renderLynx() {
    return `<div style="height:100%; display:flex; flex-direction:column;">
        <div style="flex:1; display:flex; flex-direction:column; gap:15px; overflow-y:auto;">
            ${lynxMessages.map(m => `
                <div style="align-self:${m.from==='Priscion'?'flex-start':'flex-end'}; background:${m.from==='Priscion'?'#F0F0F0':'#DCF8C6'}; padding:12px 16px; border-radius:15px; font-size:0.85rem; max-width:85%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    ${m.text}
                    <div style="text-align:right; font-size:0.6rem; color:#999; margin-top:5px;">${m.time} ${m.from==='Priscion'?'':MUSE_ICONS.seen}</div>
                </div>
            `).join('')}
        </div>
        <div style="padding-top:20px; display:flex; gap:10px; align-items:center;">
            <input id="l-in" type="text" placeholder="Sovereign Message..." style="flex:1; border:1px solid #EEE; padding:12px 18px; border-radius:25px; outline:none; font-size:0.9rem;">
            <button onclick="sendL()" style="background:#7B35D4; color:#FFF; border:none; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">${MUSE_ICONS.send}</button>
        </div>
    </div>`;
}

initSovereignOS();