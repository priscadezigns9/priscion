// Priscion MUSE Wallet Core v8.5.0
// THE SOVEREIGN ENGINE: Lynx Messenger (V8 Logic) | Vault (Multi-Asset) | Swap | Send | Receive | dApps

let walletVisible = false;
let currentTab = 'vault';
let walletDarkMode = false;
let currentWalletIndex = 0;
let userWallets = [
    { handle: '$prisca.pri', address: 'addr_pri1...6k9z_master', balance: '12,500.00', avatar: 'P' },
    { handle: '$architect.pri', address: 'addr_pri2...7y8x_dev', balance: '1,200.00', avatar: 'A' }
];

function toggleSidebar() {
    const s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    s.classList.toggle('active', walletVisible);
    if(walletVisible) renderWallet();
}

function toggleWalletDark() {
    walletDarkMode = !walletDarkMode;
    renderWallet();
}

function switchTab(tab) {
    currentTab = tab;
    renderWallet();
}

function switchWallet() {
    currentWalletIndex = (currentWalletIndex + 1) % userWallets.length;
    renderWallet();
}

async function renderWallet() {
    const c = document.getElementById('sidebar');
    if(!c) return;

    let ledger = [];
    try {
        const response = await fetch('ledger/transactions.json');
        ledger = await response.json();
    } catch (e) { console.error("Ledger offline", e); }

    const theme = walletDarkMode ? 
        { bg: '#080808', text: '#FFFFFF', muted: '#888', surface: '#111', border: '#222', accent: '#7B35D4' } : 
        { bg: '#FFFFFF', text: '#1A1A1A', muted: '#666', surface: '#F9F9F9', border: '#EEE', accent: '#7B35D4' };

    const activeWallet = userWallets[currentWalletIndex];

    c.style.background = theme.bg;
    c.style.color = theme.text;
    c.style.borderColor = theme.border;

    c.innerHTML = `
        <div style="padding:35px; height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; transition: 0.3s;">
            <!-- Modern Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:10px; height:10px; background:${theme.accent}; border-radius:50%; box-shadow: 0 0 10px ${theme.accent};"></div>
                    <span style="font-weight:900; letter-spacing:4px; font-size:0.75rem;">MUSE</span>
                </div>
                <div style="display:flex; gap:15px; align-items:center;">
                    <div onclick="toggleWalletDark()" style="width:40px; height:20px; background:${walletDarkMode?theme.accent:'#DDD'}; border-radius:20px; position:relative; cursor:pointer; transition:0.3s;">
                        <div style="width:16px; height:16px; background:#FFF; border-radius:50%; position:absolute; top:2px; left:${walletDarkMode?'22px':'2px'}; transition:0.3s; box-shadow:0 2px 5px rgba(0,0,0,0.2);"></div>
                    </div>
                    <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer; line-height:1;">&times;</button>
                </div>
            </div>

            <!-- Wallet Selector (Vespa Inspired) -->
            <div onclick="switchWallet()" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:15px 20px; border-radius:20px; margin-bottom:25px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:32px; height:32px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900; font-size:0.8rem;">${activeWallet.avatar}</div>
                    <div>
                        <div style="font-weight:900; font-size:0.8rem;">${activeWallet.handle}</div>
                        <div style="font-size:0.55rem; color:${theme.muted}; font-weight:700;">Priscion L1 Node</div>
                    </div>
                </div>
                <div style="color:${theme.muted}; font-size:0.8rem;">🔄</div>
            </div>
            
            <!-- Navigation Tabs -->
            <div style="margin-bottom:25px;">
                <div style="display:flex; gap:20px; border-bottom:1px solid ${theme.border}; padding-bottom:12px; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none;">
                    ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                        <button onclick="switchTab('${tab}')" style="background:none; border:none; font-weight:900; font-size:0.6rem; letter-spacing:2px; color:${currentTab===tab?theme.accent:theme.muted}; cursor:pointer; text-transform:uppercase; white-space:nowrap; transition:0.3s; border-bottom: ${currentTab===tab?'2px solid '+theme.accent:'2px solid transparent'}; padding-bottom:10px; margin-bottom:-12px;">${tab}</button>
                    `).join('')}
                </div>
            </div>

            <!-- Content Area -->
            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none; margin-top:10px;">
                ${renderView(currentTab, ledger, theme, activeWallet)}
            </div>
        </div>
    `;
}

function renderView(tab, ledger, theme, wallet) {
    switch(tab) {
        case 'vault': return renderVault(ledger, theme, wallet);
        case 'swap': return renderSwap(theme);
        case 'send': return renderSend(theme);
        case 'receive': return renderReceive(theme, wallet);
        case 'dapps': return renderDapps(theme);
        case 'lynx': return renderLynx(theme, wallet);
        default: return '';
    }
}

function renderVault(ledger, theme, wallet) {
    const assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT');
    return `
        <div style="background:${theme.surface}; padding:30px; border-radius:25px; border:1px solid ${theme.border}; margin-bottom:30px;">
            <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:10px;">AVAILABLE RESERVE</div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <span style="font-size:2.2rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN</span>
                <span style="font-size:1.8rem; font-weight:900; color:${theme.accent};">${wallet.balance}</span>
            </div>
        </div>
        
        <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:15px; text-transform:uppercase;">Collections & Identity</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px;">
            ${assets.length > 0 ? assets.slice(0, 4).map(a => `
                <div style="background:${theme.bg}; border:1px solid ${theme.border}; padding:15px; border-radius:18px; text-align:center;">
                    <div style="font-weight:900; font-size:0.7rem; margin-bottom:5px;">${a.asset}</div>
                    <div style="font-size:0.5rem; color:${theme.accent}; font-weight:900;">SECURED</div>
                </div>
            `).join('') : '<div style="grid-column:1/-1; padding:40px; text-align:center; color:#CCC;">Syncing Ledger...</div>'}
        </div>
        <button style="width:100%; padding:15px; background:none; border:1px solid ${theme.border}; border-radius:15px; color:${theme.text}; font-weight:900; font-size:0.6rem; letter-spacing:1px; cursor:pointer;">VIEW ALL ASSETS</button>
    `;
}

function renderSwap(theme) {
    return `
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">FROM</div>
                <select style="background:none; border:none; color:${theme.accent}; font-weight:900; font-size:0.6rem; outline:none; cursor:pointer;"><option>$PRN</option><option>$MUSD</option><option>$NRL</option></select>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                <span style="font-weight:900; font-size:1.4rem;">$PRN</span>
                <input type="number" value="100.00" style="background:none; border:none; color:${theme.text}; font-weight:900; text-align:right; font-size:1.4rem; outline:none; width:120px;">
            </div>
        </div>
        <div style="text-align:center; margin:-18px 0; position:relative; z-index:1;">
            <div style="background:${theme.accent}; width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#FFF; border:5px solid ${theme.bg}; font-size:1.2rem; cursor:pointer;">↓</div>
        </div>
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">TO</div>
                <select style="background:none; border:none; color:${theme.accent}; font-weight:900; font-size:0.6rem; outline:none; cursor:pointer;"><option>$MUSD</option><option>$PRN</option><option>$ADA</option></select>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                <span style="font-weight:900; font-size:1.4rem;">$MUSD</span>
                <span style="font-weight:900; font-size:1.4rem; opacity:0.3;">250.00</span>
            </div>
        </div>
        <button style="width:100%; padding:20px; background:${theme.accent}; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:30px; font-size:0.8rem; letter-spacing:2px; cursor:pointer;">SWAP ASSETS</button>
    `;
}

function renderSend(theme) {
    return `
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900; margin-bottom:15px;">RECIPIENT ADDRESS / .PRI HANDLE</div>
            <input type="text" placeholder="$username.pri" style="width:100%; background:none; border:none; border-bottom:1px solid ${theme.border}; padding:10px 0; font-family:inherit; font-weight:900; color:${theme.text}; outline:none;">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900; margin-top:30px; margin-bottom:15px;">AMOUNT</div>
            <div style="display:flex; align-items:center;">
                <input type="number" placeholder="0.00" style="flex:1; background:none; border:none; color:${theme.text}; font-weight:900; outline:none; font-size:1.8rem;">
                <span style="font-weight:900; color:${theme.accent};">$PRN</span>
            </div>
        </div>
        <button onclick="alert('Transaction Anchored to Ledger')" style="width:100%; padding:20px; background:${theme.text}; color:${theme.bg}; border:none; border-radius:100px; font-weight:900; margin-top:30px; font-size:0.75rem; letter-spacing:2px; cursor:pointer;">CONFIRM TRANSACTION</button>
    `;
}

function renderReceive(theme, wallet) {
    return `
        <div style="text-align:center; padding-top:20px;">
            <div style="background:#FFF; padding:25px; border-radius:30px; display:inline-block; border:1px solid #EEE; margin-bottom:30px;">
                <!-- QR Placeholder with Identity -->
                <div style="width:180px; height:180px; background:#000; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:900; color:#FFF;">
                    <div style="font-size:0.5rem; letter-spacing:2px; margin-bottom:10px;">PRISCION QR</div>
                    <div style="font-size:2rem;">🔳</div>
                </div>
            </div>
            <h3 style="font-family:'Playfair Display', serif; font-size:2rem; margin:0;">${wallet.handle}</h3>
            <p style="font-size:0.7rem; color:${theme.muted}; margin-top:10px; word-break:break-all;">${wallet.address}</p>
            <button style="margin-top:25px; background:none; border:1px solid ${theme.border}; padding:12px 25px; border-radius:100px; font-weight:900; font-size:0.6rem; color:${theme.text}; cursor:pointer; letter-spacing:1px;">COPY SOVEREIGN KEY</button>
        </div>
    `;
}

function renderDapps(theme) {
    const dapps = [
        { name: 'LEGGO', icon: '🌐', desc: 'Sovereign OS & Browser', url: 'leggo.html' },
        { name: 'PULSE', icon: '📈', desc: 'L1 Block Explorer', url: 'pulse/' },
        { name: 'PEANUTS', icon: '📊', desc: 'Sovereign Analytics', url: 'peanuts/' },
        { name: 'MYNT', icon: '🎨', desc: 'NFT Factory & Store', url: 'mynt/' },
        { name: 'CHILLATA', icon: '❄️', desc: 'Decentralized Swap', url: 'chillataswap/' }
    ];
    return `
        <div style="display:grid; gap:12px;">
            ${dapps.map(d => `
                <div onclick="window.location.href='${d.url}'" style="background:${theme.surface}; border:1px solid ${theme.border}; padding:18px; border-radius:20px; display:flex; align-items:center; gap:15px; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='${theme.accent}'">
                    <div style="font-size:1.4rem;">${d.icon}</div>
                    <div>
                        <div style="font-weight:900; font-size:0.85rem;">${d.name}</div>
                        <div style="font-size:0.6rem; color:${theme.muted};">${d.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderLynx(theme, wallet) {
    return `
        <div style="display:flex; flex-direction:column; height:100%;">
            <div style="flex:1; overflow-y:auto; scrollbar-width:none; padding-bottom:20px;">
                <div style="background:${theme.surface}; padding:15px 20px; border-radius:20px; margin-bottom:15px; max-width:80%;">
                    <div style="font-size:0.5rem; font-weight:900; color:${theme.accent}; margin-bottom:5px;">ARCHITECT NODE</div>
                    <div style="font-size:0.8rem;">Sovereign session active. How can I assist the Empire today, Architect?</div>
                </div>
            </div>
            <div style="border-top:1px solid ${theme.border}; padding:20px 0;">
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button style="background:none; border:1px solid ${theme.border}; color:${theme.muted}; font-size:1rem; width:40px; height:40px; border-radius:50%; cursor:pointer;">📎</button>
                    <button style="background:none; border:1px solid ${theme.border}; color:${theme.muted}; font-size:1rem; width:40px; height:40px; border-radius:50%; cursor:pointer;">🎤</button>
                </div>
                <div style="background:${theme.surface}; border:1px solid ${theme.border}; border-radius:100px; padding:12px 20px; display:flex; gap:10px; align-items:center;">
                    <input id="lynx-input" type="text" placeholder="Message Architect..." style="flex:1; background:none; border:none; color:${theme.text}; font-family:inherit; font-size:0.8rem; outline:none;">
                    <button onclick="sendLynx()" style="background:${theme.accent}; color:#FFF; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:900;">&uarr;</button>
                </div>
            </div>
        </div>
    `;
}

function sendLynx() {
    const i = document.getElementById('lynx-input');
    if(i && i.value) {
        alert("Lynx Encrypted: Message Sent to Architect Node.");
        i.value = '';
    }
}
