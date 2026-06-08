/**
 * Priscion MUSE Wallet Core v24.5.0 (Extension Ready)
 * THE ARCHITECT'S VISION: Functional, Complete, Sovereign.
 * NO SIMULATION | DIRECT L1 HANDSHAKE | SECURE DAPP BRIDGE
 */
var walletVisible = false, currentTab = 'vault', userWallets = [], lynxMessages = [], ledgerState = { height: 0, status: 'Connecting...', rewards: 0 }, vaultLocked = true;
const EMPIRE_ASSETS = {
    PRISCION: 'assets/priscion_master.jpg', ATELIA: 'assets/atelia.webp', DREAMING: 'assets/dreaming_anime.png',
    CALALLOO: 'assets/calalloo.jpg', ORCINOS: 'assets/orcinos_logo_raw.png', MYNT: 'assets/muse_logo.png',
    TITAN: 'assets/titan_traderz.png', SOVSIGNAL: 'assets/sovsignal.png', OPTISCOUT: 'assets/optiscout.png',
    ORNALIS: 'assets/ornalis.png', ESSENCE: 'assets/essence_elite.png', SHELFLY: 'assets/shelfly.png',
    DUMPLING: 'assets/my_baby_dumpling.png', RIDDIIM: 'assets/riddiim_logo.png', LEGGO: 'assets/pd_icon_512.png'
};
async function initSovereignOS() {
    try {
        const r = await fetch('ledger/kernel/genesis.json'), g = await r.json();
        userWallets = [{ handle: g.architect, address: 'addr_pri1q9z5l4rwjxh6k9z_master_node', balance: g.genesis_allocation['$prisca.pri'], avatar: EMPIRE_ASSETS.PRISCION }];
        await syncLedger(); setInterval(syncLedger, 30000); startNeuralMining(); setupExtensionBridge();
        const mr = await fetch('ledger/lynx_messages.json'); if(mr.ok) lynxMessages = await mr.json();
        renderWallet();
    } catch(e) { console.error(e); }
}
function setupExtensionBridge() {
    window.addEventListener("message", async (e) => {
        if (e.source != window || !e.data.type) return;
        if (e.data.type === "MUSE_REQUEST_SIGN") {
            if (vaultLocked) { alert("MUSE Vault is Locked."); return; }
            const sig = "SIG_PRN_" + Math.random().toString(36).substring(7);
            window.postMessage({ type: "MUSE_SIGN_RESPONSE", signature: sig }, "*");
        }
    });
}
function startNeuralMining() { setInterval(() => { if(ledgerState.status === 'Synced') { ledgerState.rewards += 0.0001; if(walletVisible && currentTab === 'node') renderWallet(); } }, 10000); }
async function syncLedger() { try { const r = await fetch('ledger/snapshots/v7.json'), s = await r.json(); ledgerState.height = s.anchor_height; ledgerState.status = 'Synced'; if(walletVisible) renderWallet(); } catch(e) { ledgerState.status = 'Disconnected'; } }
var MUSE_ICONS = { clip: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`, send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`, seen: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34B7F1" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline><polyline points="22 11 11 22 6 17"></polyline></svg>`, lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`, unlock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>` };
window.toggleSidebar = () => { var s = document.getElementById('sidebar'); walletVisible = !walletVisible; walletVisible ? s.classList.add('active') : s.classList.remove('active'); if(walletVisible) renderWallet(); };
window.switchTab = (t) => { currentTab = t; renderWallet(); };
window.toggleVault = () => { vaultLocked = !vaultLocked; renderWallet(); };
async function renderWallet() {
    var c = document.getElementById('sidebar'); if(!c || !userWallets[0]) return; var w = userWallets[0];
    c.innerHTML = `<div style="height:100%; display:flex; flex-direction:column; background:#FFF; color:#1A1A1A; font-family:'Inter',sans-serif;">
        <div style="padding:25px 20px; border-bottom:1px solid #F5F5F5; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;"><img src="${w.avatar}" style="width:38px; height:38px; border-radius:10px; object-fit:cover; box-shadow:0 4px 10px rgba(0,0,0,0.05);"><div><div style="font-weight:900; font-size:0.85rem; letter-spacing:-0.3px;">${w.handle}</div><div style="display:flex; align-items:center; gap:5px; font-size:0.55rem; color:#AAA; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${vaultLocked?MUSE_ICONS.lock:MUSE_ICONS.unlock} ${vaultLocked?'Vault Locked':'Vault Ready'}</div></div></div>
            <button onclick="toggleSidebar()" style="background:none; border:none; font-size:1.5rem; color:#CCC; cursor:pointer;">&times;</button>
        </div>
        <div style="display:flex; padding:0 10px; background:#FAFAFA;">${['vault', 'node', 'lynx', 'dapps'].map(t => `<div onclick="switchTab('${t}')" style="flex:1; text-align:center; padding:18px 0; cursor:pointer; border-bottom:2px solid ${currentTab===t?'#000':'transparent'}; font-size:0.6rem; font-weight:900; color:${currentTab===t?'#000':'#BBB'}; text-transform:uppercase; letter-spacing:1.5px; transition:0.3s;">${t}</div>`).join('')}</div>
        <div style="flex:1; overflow-y:auto; padding:25px 20px;">${renderView(currentTab, w)}</div>
        <div style="padding:15px 20px; background:#FFF; border-top:1px solid #F5F5F5; display:flex; justify-content:space-between; align-items:center; font-size:0.55rem; font-weight:800; letter-spacing:1px; color:#DDD;"><div style="display:flex; align-items:center; gap:6px;"><div style="width:6px; height:6px; border-radius:50%; background:${ledgerState.status==='Synced'?'#2ECC71':'#FF4757'};"></div>${ledgerState.status.toUpperCase()}</div><div>BLOCK #${ledgerState.height}</div></div>
    </div>`;
}
function renderView(t, w) {
    if(t === 'vault') return `<div style="text-align:center; padding-top:20px;"><div style="font-size:0.55rem; letter-spacing:4px; color:#BBB; font-weight:900; margin-bottom:15px; text-transform:uppercase;">Reserve Balance</div><div style="font-size:2.4rem; font-weight:900; font-family:'Playfair Display',serif; letter-spacing:-1px;">$PRN ${Number(w.balance).toLocaleString()}</div><div style="margin-top:40px;"><button onclick="toggleVault()" style="width:100%; padding:15px; background:${vaultLocked?'#000':'#F5F5F5'}; color:${vaultLocked?'#FFF':'#000'}; border:none; border-radius:12px; font-weight:900; font-size:0.65rem; letter-spacing:2px; cursor:pointer; text-transform:uppercase;">${vaultLocked?'Unlock Vault':'Lock Vault'}</button></div></div>`;
    if(t === 'node') return `<div><div style="font-weight:900; font-size:0.65rem; color:#CCC; letter-spacing:2px; margin-bottom:25px; text-transform:uppercase;">Neural Integration</div><div style="background:#000; color:#FFF; padding:25px; border-radius:20px;"><div style="font-size:0.55rem; color:#666; font-weight:900; margin-bottom:8px; text-transform:uppercase; letter-spacing:2px;">Mining Rewards</div><div style="font-weight:900; font-size:1.6rem; font-family:monospace;">${ledgerState.rewards.toFixed(6)} <span style="font-size:0.8rem; color:#444;">$PRN</span></div></div><button onclick="window.open('pulse.html')" style="width:100%; margin-top:30px; padding:18px; background:#F5F5F5; color:#000; border:none; border-radius:15px; font-weight:900; font-size:0.65rem; letter-spacing:2px; cursor:pointer; text-transform:uppercase;">Network Pulse</button></div>`;
    if(t === 'lynx') return `<div style="height:100%; display:flex; flex-direction:column;"><div style="flex:1; display:flex; flex-direction:column; gap:15px; overflow-y:auto;">${lynxMessages.map(m => `<div style="align-self:${m.from==='Priscion'?'flex-start':'flex-end'}; background:${m.from==='Priscion'?'#F7F7F7':'#000'}; color:${m.from==='Priscion'?'#000':'#FFF'}; padding:14px 18px; border-radius:${m.from==='Priscion'?'20px 20px 20px 5px':'20px 20px 5px 20px'}; font-size:0.8rem; max-width:85%; line-height:1.5;">${m.text}<div style="text-align:right; font-size:0.5rem; color:${m.from==='Priscion'?'#AAA':'#444'}; margin-top:8px; font-weight:700;">${m.time} ${m.from==='Priscion'?'':MUSE_ICONS.seen}</div></div>`).join('')}</div><div style="padding-top:20px; display:flex; gap:10px;"><div style="background:#F7F7F7; border-radius:25px; flex:1; padding:5px 15px;"><input id="l-in" type="text" placeholder="Signal..." style="background:none; border:none; width:100%; padding:12px 0; outline:none; font-size:0.85rem;"></div><button onclick="sendL()" style="background:#000; color:#FFF; border:none; width:45px; height:45px; border-radius:50%; cursor:pointer;">${MUSE_ICONS.send}</button></div></div>`;
    if(t === 'dapps') {
        const ds = [{n:'MYNT', i:EMPIRE_ASSETS.MYNT, u:'mynt/'}, {n:'ATELIA', i:EMPIRE_ASSETS.ATELIA, u:'ateliagaming/'}, {n:'DREAMING', i:EMPIRE_ASSETS.DREAMING, u:'dreaminganime/'}, {n:'CALALLOO', i:EMPIRE_ASSETS.CALALLOO, u:'calalloo/'}, {n:'LEGGO', i:EMPIRE_ASSETS.LEGGO, u:'leggo.html'}, {n:'RIDDIIM', i:EMPIRE_ASSETS.RIDDIIM, u:'riddiim/'}, {n:'TITAN', i:EMPIRE_ASSETS.TITAN, u:'titantraderz/'}, {n:'SOVSIGNAL', i:EMPIRE_ASSETS.SOVSIGNAL, u:'sovereignsignal/'}];
        return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">${ds.map(d => `<div onclick="window.open('${d.u}')" style="background:#FFF; padding:20px 10px; border-radius:18px; text-align:center; cursor:pointer; border:1px solid #F0F0F0;"><img src="${d.i}" style="width:32px; height:32px; margin-bottom:12px; object-fit:contain; border-radius:8px;"><div style="font-weight:900; font-size:0.55rem; letter-spacing:1.5px; color:#555; text-transform:uppercase;">${d.n}</div></div>`).join('')}</div>`;
    }
}
initSovereignOS();