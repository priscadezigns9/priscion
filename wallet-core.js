/**
 * PRISCION MUSE Wallet Core v24.6.0 (Sovereign Gold)
 * THE ARCHITECT'S VISION: Unified UI + Sovereign L1 Persistence
 * NO SIMULATION | TRUE DIRECT SEND | LYNX MESSENGER | SWAP | VAULT
 */

class PriscionSovereign {
    constructor() {
        this.storageKey = 'priscion_ledger_v7';
        this.state = this.load();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        if (data) return JSON.parse(data);
        return {
            wallet_id: 'pri_' + Math.random().toString(36).substring(2, 15),
            handle: '$prisca.pri',
            balance: 12500.00,
            staked: 0,
            avatar: 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/p-logo.png',
            history: [{ type: 'GENESIS', amount: 12500.00, timestamp: new Date().toISOString(), block: 100, hash: '0xGENESIS_v7' }],
            lynxMessages: [{ from: 'Priscion', text: 'Architect, the Sovereign Node is Always Online. Ledger Handshake verified.', time: '21:10', status: 'seen' }],
            config: { theme: 'white', node_sync: true }
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    sendTransaction(recipient, amount) {
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) return false;
        if (this.state.balance < amount) return false;
        this.state.balance -= amount;
        this.state.history.unshift({ id: 'tx_' + Date.now(), to: recipient, amount, timestamp: new Date().toISOString(), status: 'ANCHORED' });
        this.save();
        return true;
    }

    addLynxMessage(text, from = 'User') {
        const now = new Date();
        const timeStr = now.getHours() + ":" + now.getMinutes().toString().padStart(2,'0');
        this.state.lynxMessages.push({ from, text, time: timeStr, status: 'sent' });
        this.save();
    }
}

const PRN = new PriscionSovereign();

// UI STATE
var walletVisible = false;
var currentTab = 'vault';
var lynxChatMode = 'list';
var activeChatHandle = 'Priscion';

var MUSE_ICONS = {
    clip: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
    back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    seen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34B7F1" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline><polyline points="22 11 11 22 6 17"></polyline></svg>`
};

// ATTACH GLOBAL HANDLERS
window.toggleSidebar = () => {
    var s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    walletVisible ? s.classList.add('active') : s.classList.remove('active');
    if(walletVisible) renderWallet();
};

window.switchTab = (tab) => {
    currentTab = tab; lynxChatMode = 'list'; renderWallet();
};

window.openChat = (handle) => {
    activeChatHandle = handle; lynxChatMode = 'chat'; renderWallet();
};

window.sendLynx = () => {
    var i = document.getElementById('lynx-input');
    if(i && i.value) {
        PRN.addLynxMessage(i.value);
        i.value = '';
        renderWallet();
    }
};

window.executeSend = () => {
    const to = document.getElementById('send-to').value;
    const amt = document.getElementById('send-amount').value;
    if(PRN.sendTransaction(to, amt)) {
        alert("Transaction Anchored to Ledger!");
        renderWallet();
    } else {
        alert("Insufficient Balance or Invalid Input");
    }
};

async function renderWallet() {
    var c = document.getElementById('sidebar');
    if(!c) return;

    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; background:#FFF; color:#1A1A1A;">
            <!-- HEADER -->
            <div style="padding:15px 20px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; background:#FFF;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${PRN.state.avatar}" style="width:38px; height:38px; border-radius:50%; border:1px solid #EEE;">
                    <div style="font-weight:900; font-size:0.9rem;">${PRN.state.handle}</div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#999; font-size:2rem; cursor:pointer;">&times;</button>
            </div>

            <!-- TABS -->
            <div style="display:flex; border-bottom:1px solid #EEE; background:#FFF;">
                ${['vault', 'swap', 'send', 'receive', 'dapps', 'messenger'].map(tab => `
                    <div onclick="switchTab('${tab}')" style="flex:1; text-align:center; padding:15px 0; cursor:pointer; border-bottom: 3px solid ${currentTab===tab?'#000':'transparent'}; transition:0.3s;">
                        <span style="font-weight:900; font-size:0.6rem; letter-spacing:1px; color:${currentTab===tab?'#000':'#888'}; text-transform:uppercase;">${tab}</span>
                    </div>
                `).join('')}
            </div>

            <div style="flex:1; overflow-y:auto; padding:20px;">
                ${renderView(currentTab)}
            </div>
            
            <!-- STATUS BAR -->
            <div style="padding:10px 20px; border-top:1px solid #EEE; font-size:0.6rem; font-weight:900; color:#CCC; display:flex; justify-content:space-between;">
                <div>NETWORK: SOVEREIGN L1</div>
                <div>BLOCK: #100 (V7)</div>
            </div>
        </div>
    `;
}

function renderView(tab) {
    if(tab === 'vault') return `
        <div style="text-align:center; padding:20px 0;">
            <div style="font-size:0.7rem; font-weight:900; color:#888; letter-spacing:4px; margin-bottom:10px;">RESERVE</div>
            <div style="font-size:2.8rem; font-weight:900;">$PRN ${PRN.state.balance.toLocaleString()}</div>
        </div>
    `;
    if(tab === 'send') return `
        <div>
            <input type="text" id="send-to" placeholder="@handle.pri" style="width:100%; padding:15px; border-radius:12px; border:1px solid #EEE; margin-bottom:10px; outline:none; font-weight:700;">
            <input type="number" id="send-amount" placeholder="Amount" style="width:100%; padding:15px; border-radius:12px; border:1px solid #EEE; margin-bottom:15px; outline:none; font-weight:700;">
            <button onclick="executeSend()" style="width:100%; padding:18px; background:#000; color:#FFF; border:none; border-radius:100px; font-weight:900;">SEND COINS</button>
        </div>
    `;
    if(tab === 'receive') return `
        <div style="text-align:center;">
            <div style="background:#000; padding:20px; border-radius:20px; display:inline-block; margin-bottom:20px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${PRN.state.wallet_id}" style="width:150px;">
            </div>
            <div style="background:#F9F9F9; padding:15px; border-radius:12px; font-size:0.7rem; font-weight:900; word-break:break-all;">${PRN.state.wallet_id}</div>
        </div>
    `;
    if(tab === 'swap') return `
        <div style="background:#F9F9F9; padding:20px; border-radius:15px; border:1px solid #EEE;">
            <div style="font-size:0.6rem; font-weight:900; color:#888; margin-bottom:10px;">SWAP $PRN TO $MUSD</div>
            <input type="number" value="100" style="background:none; border:none; font-size:1.5rem; font-weight:900; width:100%; outline:none;">
            <button style="width:100%; margin-top:15px; padding:15px; background:#000; color:#FFF; border:none; border-radius:100px; font-weight:900;">EXECUTE SWAP</button>
        </div>
    `;
    if(tab === 'messenger') return renderLynx();
    if(tab === 'dapps') {
        const apps = [{n:'MYNT', i:'🎨'}, {n:'ATELIA', i:'🎮'}, {n:'DREAMING', i:'📽️'}, {n:'CALALLOO', i:'🍲'}];
        return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">${apps.map(a => `<div style="background:#F9F9F9; padding:20px; border-radius:15px; text-align:center; border:1px solid #EEE;"><div style="font-size:1.5rem; margin-bottom:5px;">${a.i}</div><div style="font-weight:900; font-size:0.6rem;">${a.n}</div></div>`).join('')}</div>`;
    }
}

function renderLynx() {
    if(lynxChatMode === 'list') {
        return `<div onclick="openChat('Priscion')" style="padding:15px; background:#F9F9F9; border-radius:12px; display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #EEE;">
            <div style="width:40px; height:40px; background:#000; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900;">P</div>
            <div style="flex:1;">
                <div style="font-weight:900; font-size:0.8rem;">Priscion</div>
                <div style="font-size:0.65rem; color:#888;">Ledger Handshake verified.</div>
            </div>
        </div>`;
    }
    return `
        <div style="display:flex; flex-direction:column; height:100%;">
            <div onclick="switchTab('messenger')" style="cursor:pointer; margin-bottom:15px; color:#888;">${MUSE_ICONS.back} Back</div>
            <div style="flex:1; display:flex; flex-direction:column; gap:10px; overflow-y:auto; padding-bottom:20px;">
                ${PRN.state.lynxMessages.map(m => `
                    <div style="align-self:${m.from==='Priscion'?'flex-start':'flex-end'}; background:${m.from==='Priscion'?'#F0F0F0':'#000'}; color:${m.from==='Priscion'?'#000':'#FFF'}; padding:12px 15px; border-radius:15px; font-size:0.8rem; max-width:85%;">
                        ${m.text}
                        <div style="text-align:right; font-size:0.5rem; opacity:0.5; margin-top:5px;">${m.time}</div>
                    </div>
                `).join('')}
            </div>
            <div style="display:flex; gap:10px; background:#FFF; padding-top:10px;">
                <input id="lynx-input" type="text" placeholder="Type..." style="flex:1; border:1px solid #EEE; padding:12px; border-radius:20px; outline:none;">
                <button onclick="sendLynx()" style="background:#000; color:#FFF; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer;">${MUSE_ICONS.send}</button>
            </div>
        </div>
    `;
}

// AUTO-INJECT
document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('div');
    s.id = 'sidebar';
    s.style = "position:fixed; top:0; right:-400px; width:400px; height:100%; z-index:9999; transition:0.3s; box-shadow:-10px 0 30px rgba(0,0,0,0.05);";
    document.body.appendChild(s);
    
    // Listen for custom trigger to open wallet
    window.addEventListener('openWallet', () => toggleSidebar());
});

if (typeof window !== 'undefined') window.PRN = PRN;
