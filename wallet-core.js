// Priscion MUSE Wallet Core v7.5.0
// Pure Web3 Hybrid: Vault (NFTs) | Swap | Send | Receive | dApps | Lynx Messenger

let walletVisible = false;
let currentTab = 'vault';
let darkMode = false;

function toggleSidebar() {
    const s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    s.classList.toggle('active', walletVisible);
    if(walletVisible) renderWallet();
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    renderWallet();
}

function switchTab(tab) {
    currentTab = tab;
    renderWallet();
}

async function renderWallet() {
    const c = document.getElementById('sidebar');
    if(!c) return;

    // Fetch live ledger data
    let assets = [];
    try {
        const response = await fetch('ledger/transactions.json');
        assets = await response.json();
    } catch (e) { console.error("Ledger offline", e); }

    const theme = darkMode ? { bg: '#000', text: '#FFF', muted: '#888', surface: '#0A0A0A', border: '#333' } : { bg: '#FFF', text: '#1A1A1A', muted: '#666', surface: '#F9F9F9', border: '#EEE' };

    c.innerHTML = `
        <div style="padding:40px; height:100%; display:flex; flex-direction:column; background:${theme.bg}; color:${theme.text}; font-family:'Inter', sans-serif; transition: 0.3s;">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:900; letter-spacing:5px; font-size:0.8rem; color:#7B35D4;">MUSE</span>
                    <button onclick="toggleDarkMode()" style="background:none; border:1px solid ${theme.border}; border-radius:50%; width:24px; height:24px; font-size:0.7rem; cursor:pointer; color:${theme.text}; display:flex; align-items:center; justify-content:center;">${darkMode?'☀️':'🌙'}</button>
                </div>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer;">&times;</button>
            </div>
            
            <!-- Navigation -->
            <div style="margin-bottom:25px;">
                <h2 style="font-family:'Playfair Display', serif; font-size:2.2rem; margin:0; line-height:1;">${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}.</h2>
                <div style="display:flex; gap:12px; margin-top:20px; border-bottom:1px solid ${theme.border}; padding-bottom:10px; overflow-x:auto; scrollbar-width:none;">
                    ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                        <button onclick="switchTab('${tab}')" style="background:none; border:none; font-weight:900; font-size:0.6rem; letter-spacing:2px; color:${currentTab===tab?'#7B35D4':theme.muted}; cursor:pointer; text-transform:uppercase; white-space:nowrap;">${tab==='lynx'?'Lynx':tab}</button>
                    `).join('')}
                </div>
            </div>

            <!-- Content Area -->
            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                ${currentTab === 'vault' ? renderVaultView(assets, theme) : 
                  currentTab === 'swap' ? renderSwapView(theme) : 
                  currentTab === 'send' ? renderSendView(theme) : 
                  currentTab === 'receive' ? renderReceiveView(theme) :
                  currentTab === 'dapps' ? renderDappsView(theme) : renderLynxView(theme)}
            </div>

            <!-- Footer Action -->
            <div style="margin-top:auto; padding-top:25px; border-top:1px solid ${theme.border}; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:32px; height:32px; background:#EEE; border-radius:50%; overflow:hidden;">
                        <img src="https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/p-logo.png" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <span style="font-weight:900; font-size:0.7rem;">$prisca.pri</span>
                </div>
                <button style="background:none; border:none; color:#7B35D4; font-weight:900; font-size:0.6rem; letter-spacing:1px; cursor:pointer; text-transform:uppercase;">Identity Settings</button>
            </div>
        </div>
    `;
}

function renderVaultView(ledger, theme) {
    const handles = ledger.filter(tx => tx.type === 'PROVISION' || tx.type === 'INTEGRATION');
    return `
        <div style="background:${theme.surface}; padding:30px; border-radius:25px; border:1px solid ${theme.border}; margin-bottom:30px;">
            <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:10px;">TOTAL BALANCE</div>
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-size:2rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN</span>
                <span style="font-size:1.6rem; font-weight:900; color:#7B35D4;">12,500.00</span>
            </div>
        </div>
        
        <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:15px; text-transform:uppercase;">Collection & Handles</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:30px;">
            ${handles.slice(0, 4).map(h => `
                <div style="background:${theme.bg}; border:1px solid ${theme.border}; padding:15px; border-radius:15px; text-align:center;">
                    <div style="font-weight:900; font-size:0.7rem; margin-bottom:5px; overflow:hidden; text-overflow:ellipsis;">${h.asset || h.handle}</div>
                    <div style="font-size:0.5rem; color:#7B35D4; font-weight:900;">SECURED</div>
                </div>
            `).join('')}
        </div>
        <button style="width:100%; padding:15px; background:none; border:1px solid ${theme.border}; border-radius:15px; color:${theme.text}; font-weight:900; font-size:0.6rem; letter-spacing:1px; cursor:pointer;">VIEW ALL ASSETS</button>
    `;
}

function renderSwapView(theme) {
    return `
        <p style="font-size:0.7rem; color:${theme.muted}; margin-bottom:20px;">Direct asset exchange on the Chillata Protocol. No simulations—atomic settlement only.</p>
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">FROM</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                <span style="font-weight:900; font-size:1.2rem;">$PRN</span>
                <input type="number" placeholder="0.00" style="background:none; border:none; color:${theme.text}; font-weight:900; text-align:right; font-size:1.2rem; outline:none; width:120px;">
            </div>
        </div>
        <div style="text-align:center; margin:-15px 0; position:relative; z-index:1;">
            <div style="background:#7B35D4; width:34px; height:34px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#FFF; border:4px solid ${theme.bg};">↓</div>
        </div>
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border}; margin-top:0px;">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">TO (ESTIMATED)</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                <span style="font-weight:900; font-size:1.2rem;">$MUSD</span>
                <span style="font-weight:900; font-size:1.2rem; opacity:0.5;">0.00</span>
            </div>
        </div>
        <button style="width:100%; padding:20px; background:#7B35D4; color:#FFF; border:none; border-radius:20px; font-weight:900; margin-top:30px; font-size:0.75rem; letter-spacing:1px; cursor:pointer;">SWAP ASSETS</button>
    `;
}

function renderReceiveView(theme) {
    return `
        <div style="text-align:center; padding-top:20px;">
            <div style="background:#FFF; padding:20px; border-radius:25px; display:inline-block; border:1px solid #EEE; margin-bottom:30px;">
                <div style="width:200px; height:200px; background:#F0F0F0; display:flex; align-items:center; justify-content:center; font-weight:900; color:#CCC;">QR_GEN_NODE</div>
            </div>
            <h3 style="font-weight:900; margin:0;">$prisca.pri</h3>
            <p style="font-size:0.7rem; color:${theme.muted}; margin-top:5px; word-break:break-all;">addr_pri1...6k9z</p>
            <button style="margin-top:20px; background:none; border:1px solid ${theme.border}; padding:10px 20px; border-radius:100px; font-weight:900; font-size:0.6rem; color:${theme.text}; cursor:pointer; letter-spacing:1px;">COPY ADDRESS</button>
        </div>
    `;
}

function renderDappsView(theme) {
    const dapps = [
        { name: 'LEGGO', icon: '🌐', desc: 'Sovereign OS & Browser' },
        { name: 'PULSE', icon: '📈', desc: 'L1 Block Explorer' },
        { name: 'PEANUTS', icon: '🥜', desc: 'Sovereign Office Suite' },
        { name: 'MYNT', icon: '🎨', desc: 'NFT Minting Factory' },
        { name: 'CHILLATA', icon: '❄️', desc: 'Decentralized Swap' }
    ];
    return `
        <div style="display:grid; gap:15px; padding-top:10px;">
            ${dapps.map(d => `
                <div style="background:${theme.surface}; border:1px solid ${theme.border}; padding:20px; border-radius:20px; display:flex; align-items:center; gap:20px; cursor:pointer; transition:0.2s;" onmouseover="this.style.borderColor='#7B35D4'">
                    <div style="font-size:1.5rem;">${d.icon}</div>
                    <div>
                        <div style="font-weight:900; font-size:0.9rem;">${d.name}</div>
                        <div style="font-size:0.65rem; color:${theme.muted};">${d.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderLynxView(theme) {
    return `
        <div style="display:flex; flex-direction:column; height:100%;">
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; opacity:0.5;">
                <div style="font-size:3rem; margin-bottom:20px;">🛰️</div>
                <div style="font-weight:900; font-size:0.8rem; letter-spacing:2px;">LYNX MESSENGER</div>
                <div style="font-size:0.6rem; margin-top:10px;">Secure, Jello-Layer Encryption</div>
            </div>
            <div style="padding:20px 0;">
                <div style="background:${theme.surface}; border:1px solid ${theme.border}; border-radius:20px; padding:15px; display:flex; gap:10px; align-items:center;">
                    <input type="text" placeholder="Start secure chat..." style="flex:1; background:none; border:none; color:${theme.text}; font-family:inherit; font-size:0.8rem; outline:none;">
                    <button style="background:#7B35D4; color:#FFF; border:none; width:36px; height:36px; border-radius:50%; cursor:pointer;">&rarr;</button>
                </div>
            </div>
        </div>
    `;
}

function renderSendView(theme) {
    return `
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900; margin-bottom:15px;">RECIPIENT ADDRESS / .PRI HANDLE</div>
            <input type="text" placeholder="$username.pri" style="width:100%; background:none; border:none; border-bottom:1px solid ${theme.border}; padding:10px 0; font-family:inherit; font-weight:900; color:${theme.text}; outline:none;">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900; margin-top:30px; margin-bottom:15px;">AMOUNT ($PRN)</div>
            <input type="number" placeholder="0.00" style="width:100%; background:none; border:none; border-bottom:1px solid ${theme.border}; padding:10px 0; font-family:inherit; font-weight:900; color:${theme.text}; outline:none; font-size:1.8rem;">
        </div>
        <button style="width:100%; padding:20px; background:${theme.text}; color:${theme.bg}; border:none; border-radius:20px; font-weight:900; margin-top:30px; font-size:0.75rem; letter-spacing:1px; cursor:pointer;">CONFIRM TRANSACTION</button>
    `;
}
