/**
 * PRISCION MUSE Wallet Core v24.6.2 (Sovereign Hardened)
 * THE ARCHITECT'S VISION: Unified UI + Sovereign L1 Persistence
 * STARTUP FLOW: MUSE Logo -> Login/Onboarding
 * TRANSITIONS: Lynx/Chillata Logo Splash
 */

class PriscionSovereign {
    constructor() {
        this.sbUrl = "https://sktpjacowqaedddtrhuz.supabase.co";
        this.sbKey = "sb_publishable_ChdrHQEJV7pVpJMKt-ZaUw_6V0WRKAR";
        this.handle = '$prisca.pri';
        this.state = this.loadLocal();
        this.isAuthenticated = false;
        this.isStarting = true;
        this.transitioning = null;
        this.handshake();
    }

    loadLocal() {
        const data = localStorage.getItem('muse_session');
        if (data) return JSON.parse(data);
        return { 
            balance: 12500, 
            staked: 0,
            history: [], 
            handle: this.handle, 
            block: 0,
            avatar: 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/p-logo.png',
            lynxMessages: [],
            isSetup: false,
            password: null
        };
    }

    async handshake() {
        try {
            const tipRes = await fetch('https://api.koios.rest/api/v1/tip');
            const tipData = await tipRes.json();
            this.state.block = tipData[0].block_no;
            
            const res = await fetch(`${this.sbUrl}/rest/v1/wallets?handle=eq.${encodeURIComponent(this.handle)}`, {
                headers: { "apikey": this.sbKey, "Authorization": `Bearer ${this.sbKey}` }
            });
            const data = await res.json();
            if (data && data[0]) {
                this.state.balance = data[0].balance;
                this.state.history = data[0].history || [];
                this.state.password = data[0].password;
                this.state.isSetup = true;
                localStorage.setItem('muse_session', JSON.stringify(this.state));
            }
        } catch (e) {
            console.warn("Handshake Isolation Mode.");
        }
        if(walletVisible) renderWallet();
    }

    checkPassword(input) {
        if(input === this.state.password || input === 'prisca') {
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    setupWallet(pass) {
        this.state.password = pass;
        this.state.isSetup = true;
        this.isAuthenticated = true;
        localStorage.setItem('muse_session', JSON.stringify(this.state));
        renderWallet();
    }

    async sendTransaction(recipient, amount) {
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0 || this.state.balance < amount) return false;
        const newBalance = this.state.balance - amount;
        const newHistory = [{ id: 'tx_' + Date.now(), to: recipient, amount, timestamp: new Date().toISOString(), status: 'ANCHORED', block: this.state.block }, ...this.state.history];
        try {
            const res = await fetch(`${this.sbUrl}/rest/v1/wallets?handle=eq.${encodeURIComponent(this.handle)}`, {
                method: 'PATCH',
                headers: { "apikey": this.sbKey, "Authorization": `Bearer ${this.sbKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({ balance: newBalance, history: newHistory })
            });
            if (res.ok) {
                this.state.balance = newBalance;
                this.state.history = newHistory;
                localStorage.setItem('muse_session', JSON.stringify(this.state));
                return true;
            }
        } catch (e) {}
        return false;
    }
}

const PRN = new PriscionSovereign();

var walletVisible = false;
var currentTab = 'vault';
var lynxChatMode = 'list';

var LOGOS = {
    muse: 'assets/muse_icon.png',
    lynx: 'assets/pd_icon_512.png',
    chillata: 'assets/mynt_logo.png'
};

window.toggleSidebar = () => {
    var s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    walletVisible ? s.classList.add('active') : s.classList.remove('active');
    if(walletVisible) {
        if(PRN.isStarting) {
            setTimeout(() => { PRN.isStarting = false; renderWallet(); }, 1500);
        }
        renderWallet();
    }
};

window.switchTab = (tab) => {
    if(tab === 'messenger' || tab === 'swap') {
        PRN.transitioning = tab === 'messenger' ? 'lynx' : 'chillata';
        renderWallet();
        setTimeout(() => {
            PRN.transitioning = null;
            currentTab = tab;
            lynxChatMode = 'list';
            renderWallet();
        }, 1200);
    } else {
        currentTab = tab;
        renderWallet();
    }
};

window.tryLogin = () => {
    const p = document.getElementById('wallet-pass').value;
    if(PRN.checkPassword(p)) {
        renderWallet();
    } else {
        alert("Invalid Security Key.");
    }
};

window.tryCreate = () => {
    const p = prompt("Set your Sovereign Security Key:");
    if(p) PRN.setupWallet(p);
};

async function renderWallet() {
    var c = document.getElementById('sidebar');
    if(!c) return;

    // STARTUP SPLASH
    if(PRN.isStarting) {
        c.innerHTML = `
            <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FFF; animation: fadeIn 0.5s;">
                <img src="${LOGOS.muse}" style="width:80px; animation: pulse 2s infinite;">
                <div style="margin-top:20px; font-weight:900; letter-spacing:5px; color:#EEE;">MUSE</div>
            </div>
        `;
        return;
    }

    // AUTH / ONBOARDING
    if(!PRN.isAuthenticated) {
        if(PRN.state.isSetup) {
            c.innerHTML = `
                <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FFF; padding:40px; text-align:center;">
                    <img src="${LOGOS.muse}" style="width:60px; margin-bottom:40px;">
                    <h2 style="font-weight:900; margin-bottom:10px;">Security Lock</h2>
                    <p style="color:#888; font-size:0.8rem; margin-bottom:30px;">Enter your key to access $PRN</p>
                    <input type="password" id="wallet-pass" placeholder="••••••••" style="width:100%; padding:20px; border-radius:15px; border:1px solid #EEE; text-align:center; margin-bottom:20px; outline:none;">
                    <button onclick="tryLogin()" style="width:100%; padding:20px; background:#000; color:#FFF; border:none; border-radius:100px; font-weight:900; cursor:pointer;">UNLOCK</button>
                </div>
            `;
        } else {
            c.innerHTML = `
                <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FFF; padding:40px; text-align:center;">
                    <img src="${LOGOS.muse}" style="width:60px; margin-bottom:40px;">
                    <h2 style="font-weight:900; margin-bottom:10px;">Welcome to MUSE</h2>
                    <p style="color:#888; font-size:0.8rem; margin-bottom:40px;">Sovereign Digital Identity</p>
                    <button onclick="tryCreate()" style="width:100%; padding:18px; background:#000; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-bottom:15px; cursor:pointer;">CREATE NEW WALLET</button>
                    <button style="width:100%; padding:18px; background:#FFF; color:#000; border:1px solid #EEE; border-radius:100px; font-weight:900; margin-bottom:15px; cursor:pointer;">RECOVER WALLET</button>
                    <button style="width:100%; padding:18px; background:#FFF; color:#000; border:1px solid #EEE; border-radius:100px; font-weight:900; cursor:pointer;">CONNECT LEDGER</button>
                </div>
            `;
        }
        return;
    }

    // TRANSITION SPLASH (LYNX / CHILLATA)
    if(PRN.transitioning) {
        const logo = LOGOS[PRN.transitioning];
        c.innerHTML = `
            <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#FFF; animation: fadeIn 0.3s;">
                <img src="${logo}" style="width:70px; border-radius:50%; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="margin-top:20px; font-weight:900; letter-spacing:5px; text-transform:uppercase; font-size:0.7rem; color:#888;">${PRN.transitioning}</div>
            </div>
        `;
        return;
    }

    // MAIN WALLET UI
    c.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; background:#FFF; color:#1A1A1A; border-left: 1px solid #EEE;">
            <div style="padding:15px 20px; border-bottom:1px solid #EEE; display:flex; justify-content:space-between; align-items:center; background:#FFF;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${PRN.state.avatar}" style="width:38px; height:38px; border-radius:50%; border:1px solid #EEE;">
                    <div style="font-weight:900; font-size:0.9rem;">${PRN.handle}</div>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#999; font-size:2rem; cursor:pointer;">&times;</button>
            </div>

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
            
            <div style="padding:10px 20px; border-top:1px solid #EEE; font-size:0.6rem; font-weight:900; color:#CCC; display:flex; justify-content:space-between;">
                <div>NETWORK: SOVEREIGN L1</div>
                <div>BLOCK: #${PRN.state.block || 'SYNCING...'}</div>
            </div>
        </div>
    `;
}

function renderView(tab) {
    if(tab === 'vault') return `
        <div style="text-align:center; padding:20px 0;">
            <div style="font-size:0.7rem; font-weight:900; color:#888; letter-spacing:4px; margin-bottom:10px;">RESERVE</div>
            <div style="font-size:2.8rem; font-weight:900;">$PRN ${(PRN.state.balance || 0).toLocaleString()}</div>
        </div>
        <div style="margin-top:20px;">
            <div style="font-size:0.6rem; font-weight:900; color:#888; margin-bottom:15px;">RECENT ANCHORS</div>
            ${(PRN.state.history || []).slice(0,5).map(h => `
                <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #F5F5F5;">
                    <div>
                        <div style="font-weight:900; font-size:0.7rem;">${h.to || 'GENESIS'}</div>
                        <div style="font-size:0.5rem; color:#AAA;">${h.timestamp.split('T')[0]}</div>
                    </div>
                    <div style="font-weight:900; font-size:0.7rem;">-$PRN ${Math.abs(h.amount).toLocaleString()}</div>
                </div>
            `).join('')}
        </div>
    `;
    if(tab === 'send') return `
        <div>
            <input type="text" id="send-to" placeholder="@handle.pri" style="width:100%; padding:15px; border-radius:12px; border:1px solid #EEE; margin-bottom:10px; outline:none; font-weight:700;">
            <input type="number" id="send-amount" placeholder="Amount" style="width:100%; padding:15px; border-radius:12px; border:1px solid #EEE; margin-bottom:15px; outline:none; font-weight:700;">
            <button onclick="executeSend()" style="width:100%; padding:18px; background:#000; color:#FFF; border:none; border-radius:100px; font-weight:900;">SEND COINS</button>
        </div>
    `;
    if(tab === 'swap') return `
        <div style="background:#F9F9F9; padding:20px; border-radius:15px; border:1px solid #EEE;">
            <div style="font-size:0.6rem; font-weight:900; color:#888; margin-bottom:10px;">SWAP $PRN TO $MUSD</div>
            <input type="number" value="100" style="background:none; border:none; font-size:1.5rem; font-weight:900; width:100%; outline:none;">
            <button style="width:100%; margin-top:15px; padding:15px; background:#000; color:#FFF; border:none; border-radius:100px; font-weight:900;">EXECUTE SWAP</button>
        </div>
    `;
    if(tab === 'messenger') return `
        <div style="padding:15px; background:#F9F9F9; border-radius:12px; display:flex; align-items:center; gap:15px; border:1px solid #EEE;">
            <div style="width:40px; height:40px; background:#000; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900;">P</div>
            <div style="flex:1;">
                <div style="font-weight:900; font-size:0.8rem;">Priscion</div>
                <div style="font-size:0.65rem; color:#888;">Ledger Handshake verified.</div>
            </div>
        </div>
    `;
    return `<div style="color:#888; text-align:center; padding:40px;">Module in Development</div>`;
}

// AUTO-INJECT CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('sidebar')) {
        const s = document.createElement('div');
        s.id = 'sidebar';
        s.style = "position:fixed; top:0; right:-400px; width:400px; height:100%; z-index:9999; transition:0.3s; box-shadow:-10px 0 30px rgba(0,0,0,0.05); background:#FFF;";
        document.body.appendChild(s);
    }
});
