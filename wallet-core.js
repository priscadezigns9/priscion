/* 
 * PRISCION CORE v5.0 - UNIFIED ARCHITECTURE
 * Manage: Security, Storage, and P2P
 */

class PriscionSovereign {
    constructor() {
        this.storageKey = 'priscion_data_v5';
        this.state = this.load();
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {
            password: 'password123', // Default for now
            balance: 6450.00,
            mints: [],
            handles: ['.pri/prisca'],
            history: []
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    checkPassword(pass) {
        return pass === this.state.password;
    }

    sendCoins(to, amount) {
        amount = parseFloat(amount);
        if (this.state.balance >= amount) {
            this.state.balance -= amount;
            this.state.history.push({ type: 'SEND', to, amount, date: new Date().toISOString() });
            this.save();
            return true;
        }
        return false;
    }

    getMints() { return this.state.mints; }
    getHistory() { return this.state.history; }
}

const PRN = new PriscionSovereign();

// Sidebar Injection Logic to prevent "Blank Sidebar"
function injectWalletUI(targetId, isStandalone = false) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const ui = `
    <div class="wallet-container ${isStandalone ? 'standalone' : 'sidebar-view'}">
        <div class="wallet-header">
            <img src="assets/muse_icon.png" style="width:30px">
            <span style="font-weight:900">MUSE WALLET</span>
        </div>
        <div class="wallet-tabs">
            <div class="tab active" onclick="switchTab('coins')">Coins</div>
            <div class="tab" onclick="switchTab('nfts')">Things</div>
            <div class="tab" onclick="switchTab('swap')">Trade</div>
        </div>
        <div id="wallet-content" style="padding:20px">
            <!-- Dynamic Content -->
            <div id="view-coins">
                <div class="balance-card">
                    <small>Balance</small>
                    <div style="font-size:2rem; font-weight:900">${PRN.state.balance.toFixed(2)} $PRN</div>
                </div>
                <div style="margin-top:20px">
                    <input type="text" id="send-to" placeholder="Recipient (.pri/name)" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #eee; border-radius:8px">
                    <input type="number" id="send-amount" placeholder="Amount" style="width:100%; padding:10px; border:1px solid #eee; border-radius:8px">
                    <button onclick="handleSend()" style="width:100%; padding:15px; background:#000; color:#fff; border:none; border-radius:12px; font-weight:bold; margin-top:10px; cursor:pointer">Send Coins</button>
                </div>
            </div>
        </div>
    </div>`;
    
    target.innerHTML = ui;
}

function handleSend() {
    const to = document.getElementById('send-to').value;
    const amount = document.getElementById('send-amount').value;
    if (PRN.sendCoins(to, amount)) {
        alert('Transaction Anchored to Ledger!');
        location.reload();
    } else {
        alert('Insufficient $PRN');
    }
}
