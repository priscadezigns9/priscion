// Priscion MUSE Wallet Core v7.2.0
// High-Fidelity Sovereign Identity Logic + Full Functional Restoration

let walletVisible = false;
let currentTab = 'vault';

function toggleSidebar() {
    const s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    s.classList.toggle('active', walletVisible);
    if(walletVisible) renderWallet();
}

function switchTab(tab) {
    currentTab = tab;
    renderWallet();
}

async function renderWallet() {
    const c = document.getElementById('sidebar');
    if(!c) return;

    // Fetch live ledger data for Vault
    let assets = [];
    try {
        const response = await fetch('ledger/transactions.json');
        const transactions = await response.json();
        assets = transactions.filter(tx => tx.type === 'PROVISION' && tx.status === 'SECURED_IN_VAULT');
    } catch (e) { console.error("Ledger offline", e); }

    c.innerHTML = `
        <div style="padding:40px; height:100%; display:flex; flex-direction:column; background:#FFFFFF; color:#1A1A1A; font-family:'Inter', sans-serif;">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <span style="font-weight:900; letter-spacing:5px; font-size:0.8rem; color:#7B35D4;">MUSE</span>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#DDD; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>
            
            <!-- Sovereign Identity Section -->
            <div style="margin-bottom:30px;">
                <h2 style="font-family:'Playfair Display', serif; font-size:2.2rem; margin:0;">The Wallet.</h2>
                <div style="display:flex; gap:15px; margin-top:20px; border-bottom:1px solid #EEE; padding-bottom:10px;">
                    <button onclick="switchTab('vault')" style="background:none; border:none; font-weight:900; font-size:0.65rem; letter-spacing:2px; color:${currentTab==='vault'?'#7B35D4':'#CCC'}; cursor:pointer; text-transform:uppercase;">Vault</button>
                    <button onclick="switchTab('swap')" style="background:none; border:none; font-weight:900; font-size:0.65rem; letter-spacing:2px; color:${currentTab==='swap'?'#7B35D4':'#CCC'}; cursor:pointer; text-transform:uppercase;">Swap</button>
                    <button onclick="switchTab('send')" style="background:none; border:none; font-weight:900; font-size:0.65rem; letter-spacing:2px; color:${currentTab==='send'?'#7B35D4':'#CCC'}; cursor:pointer; text-transform:uppercase;">Send</button>
                    <button onclick="switchTab('settings')" style="background:none; border:none; font-weight:900; font-size:0.65rem; letter-spacing:2px; color:${currentTab==='settings'?'#7B35D4':'#CCC'}; cursor:pointer; text-transform:uppercase;">Identity</button>
                </div>
            </div>

            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                ${currentTab === 'vault' ? renderVaultView(assets) : 
                  currentTab === 'swap' ? renderSwapView() : 
                  currentTab === 'send' ? renderSendView() : renderIdentityView()}
            </div>

            <!-- Footer Action -->
            <div style="margin-top:auto; padding-top:30px; border-top:1px solid #EEE;">
                <button style="width:100%; padding:18px; background:#1A1A1A; color:#FFF; border:none; border-radius:100px; font-weight:900; font-size:0.7rem; letter-spacing:2px; cursor:pointer; text-transform:uppercase;">Secure Session</button>
            </div>
        </div>
    `;
}

function renderVaultView(assets) {
    return `
        <div style="background:#F9F9F9; padding:30px; border-radius:25px; border:1px solid #EEE; margin-bottom:30px;">
            <div style="font-size:0.6rem; color:#999; font-weight:900; letter-spacing:2px; margin-bottom:10px;">BALANCE</div>
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-size:2rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN</span>
                <span style="font-size:1.6rem; font-weight:900; color:#7B35D4;">12,500.00</span>
            </div>
        </div>
        <div style="font-size:0.65rem; color:#666; font-weight:900; letter-spacing:2px; margin-bottom:15px; text-transform:uppercase;">Sovereign Handles</div>
        <div style="display:grid; gap:10px;">
            ${assets.map(a => `
                <div style="background:#FFF; border:1px solid #EEE; padding:15px 20px; border-radius:15px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:700; font-size:0.85rem;">${a.asset}</span>
                    <span style="font-size:0.55rem; font-weight:900; color:#7B35D4; letter-spacing:1px;">LOCKED</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSwapView() {
    return `
        <div style="background:#F9F9F9; padding:25px; border-radius:20px; border:1px solid #EEE; margin-bottom:10px;">
            <div style="font-size:0.6rem; color:#999; font-weight:900;">FROM</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <span style="font-weight:900;">$PRN</span>
                <span style="font-weight:900;">100.00</span>
            </div>
        </div>
        <div style="text-align:center; margin:-15px 0; position:relative; z-index:1;">
            <div style="background:#7B35D4; width:30px; height:30px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#FFF; font-weight:900; border:4px solid #FFF;">↓</div>
        </div>
        <div style="background:#F9F9F9; padding:25px; border-radius:20px; border:1px solid #EEE; margin-top:10px;">
            <div style="font-size:0.6rem; color:#999; font-weight:900;">TO</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <span style="font-weight:900;">$MUSD</span>
                <span style="font-weight:900;">250.00</span>
            </div>
        </div>
        <button style="width:100%; padding:15px; background:#7B35D4; color:#FFF; border:none; border-radius:15px; font-weight:900; margin-top:30px; cursor:pointer; font-size:0.7rem; letter-spacing:1px;">EXECUTE SWAP</button>
    `;
}

function renderSendView() {
    return `
        <div style="background:#F9F9F9; padding:25px; border-radius:20px; border:1px solid #EEE;">
            <div style="font-size:0.6rem; color:#999; font-weight:900; margin-bottom:15px;">RECIPIENT ADDRESS / HANDLE</div>
            <input type="text" placeholder="$username.pri" style="width:100%; background:none; border:none; border-bottom:1px solid #DDD; padding:10px 0; font-family:inherit; font-weight:700; outline:none;">
            <div style="font-size:0.6rem; color:#999; font-weight:900; margin-top:25px; margin-bottom:15px;">AMOUNT ($PRN)</div>
            <input type="number" placeholder="0.00" style="width:100%; background:none; border:none; border-bottom:1px solid #DDD; padding:10px 0; font-family:inherit; font-weight:700; outline:none; font-size:1.5rem;">
        </div>
        <button style="width:100%; padding:15px; background:#1A1A1A; color:#FFF; border:none; border-radius:15px; font-weight:900; margin-top:30px; cursor:pointer;">CONFIRM SEND</button>
    `;
}

function renderIdentityView() {
    return `
        <div style="text-align:center; padding:20px 0;">
            <div style="width:80px; height:80px; background:#F0F0F0; border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:2rem;">👤</div>
            <h3 style="font-weight:900; margin:0;">$prisca.pri</h3>
            <p style="color:#999; font-size:0.7rem;">Main Sovereign Node</p>
        </div>
        <div style="margin-top:30px;">
            <div style="padding:15px; border-bottom:1px solid #EEE; font-size:0.8rem; font-weight:600; display:flex; justify-content:space-between;">
                <span>Security</span><span>Vault Key</span>
            </div>
            <div style="padding:15px; border-bottom:1px solid #EEE; font-size:0.8rem; font-weight:600; display:flex; justify-content:space-between;">
                <span>Network</span><span>Priscion L1</span>
            </div>
            <div style="padding:15px; border-bottom:1px solid #EEE; font-size:0.8rem; font-weight:600; display:flex; justify-content:space-between;">
                <span>Recovery</span><span>Seed Secure</span>
            </div>
        </div>
    `;
}
