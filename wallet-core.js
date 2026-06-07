// Priscion MUSE Wallet Core v8.0.0
// THE SOVEREIGN ENGINE: Lynx Messenger | Vault (NFTs) | Swap | Receive | dApps

let walletVisible = false;
let currentTab = 'vault';
let walletDarkMode = false; // Isolated to wallet

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

    c.style.background = theme.bg;
    c.style.color = theme.text;
    c.style.borderColor = theme.border;

    c.innerHTML = `
        <div style="padding:35px; height:100%; display:flex; flex-direction:column; font-family:'Inter', sans-serif; transition: 0.3s;">
            <!-- Modern Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:10px; height:10px; background:${theme.accent}; border-radius:50%; box-shadow: 0 0 10px ${theme.accent};"></div>
                    <span style="font-weight:900; letter-spacing:4px; font-size:0.75rem;">MUSE</span>
                </div>
                <div style="display:flex; gap:15px; align-items:center;">
                    <!-- Modern Toggle Switch -->
                    <div onclick="toggleWalletDark()" style="width:40px; height:20px; background:${walletDarkMode?theme.accent:'#DDD'}; border-radius:20px; position:relative; cursor:pointer; transition:0.3s;">
                        <div style="width:16px; height:16px; background:#FFF; border-radius:50%; position:absolute; top:2px; left:${walletDarkMode?'22px':'2px'}; transition:0.3s; box-shadow:0 2px 5px rgba(0,0,0,0.2);"></div>
                    </div>
                    <button onclick="toggleSidebar()" style="background:none; border:none; color:${theme.muted}; font-size:1.8rem; cursor:pointer; line-height:1;">&times;</button>
                </div>
            </div>
            
            <!-- Navigation Tabs (Modern Scroll) -->
            <div style="margin-bottom:25px;">
                <div style="display:flex; gap:20px; border-bottom:1px solid ${theme.border}; padding-bottom:12px; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none;">
                    ${['vault', 'swap', 'send', 'receive', 'dapps', 'lynx'].map(tab => `
                        <button onclick="switchTab('${tab}')" style="background:none; border:none; font-weight:900; font-size:0.6rem; letter-spacing:2px; color:${currentTab===tab?theme.accent:theme.muted}; cursor:pointer; text-transform:uppercase; white-space:nowrap; transition:0.3s; border-bottom: ${currentTab===tab?'2px solid '+theme.accent:'2px solid transparent'}; padding-bottom:10px; margin-bottom:-12px;">${tab==='lynx'?'Lynx':tab}</button>
                    `).join('')}
                </div>
            </div>

            <!-- Content Area -->
            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none; margin-top:10px;">
                ${renderView(currentTab, ledger, theme)}
            </div>

            <!-- Identity Footer (Interactive) -->
            <div style="margin-top:auto; padding-top:25px; border-top:1px solid ${theme.border}; display:flex; justify-content:space-between; align-items:center;">
                <div onclick="switchTab('settings')" style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                    <div style="width:36px; height:36px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:900; font-size:0.8rem;">P</div>
                    <div>
                        <div style="font-weight:900; font-size:0.75rem;">$prisca.pri</div>
                        <div style="font-size:0.55rem; color:${theme.muted}; font-weight:700;">Priscion L1 Node</div>
                    </div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button style="width:8px; height:8px; background:#4CAF50; border-radius:50%; border:none;"></button>
                </div>
            </div>
        </div>
    `;
}

function renderView(tab, ledger, theme) {
    switch(tab) {
        case 'vault': return renderVault(ledger, theme);
        case 'swap': return renderSwap(theme);
        case 'send': return renderSend(theme);
        case 'receive': return renderReceive(theme);
        case 'dapps': return renderDapps(theme);
        case 'lynx': return renderLynx(theme);
        case 'settings': return renderSettings(theme);
        default: return '';
    }
}

function renderVault(ledger, theme) {
    const assets = ledger.filter(tx => tx.status === 'SECURED_IN_VAULT');
    return `
        <div style="background:${theme.surface}; padding:30px; border-radius:25px; border:1px solid ${theme.border}; margin-bottom:30px;">
            <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:10px;">VAULT RESERVE</div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <span style="font-size:2.2rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN</span>
                <span style="font-size:1.8rem; font-weight:900; color:${theme.accent};">12,500.00</span>
            </div>
        </div>
        
        <div style="font-size:0.6rem; color:${theme.muted}; font-weight:900; letter-spacing:2px; margin-bottom:15px; text-transform:uppercase;">Collections (.pri)</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px;">
            ${assets.length > 0 ? assets.slice(0, 6).map(a => `
                <div style="background:${theme.bg}; border:1px solid ${theme.border}; padding:15px; border-radius:18px; text-align:center; transition:0.3s; cursor:pointer;" onmouseover="this.style.borderColor='${theme.accent}'">
                    <div style="font-weight:900; font-size:0.7rem; margin-bottom:5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${a.asset}</div>
                    <div style="font-size:0.5rem; color:${theme.accent}; font-weight:900;">ANCHORED</div>
                </div>
            `).join('') : '<div style="grid-column:1/-1; padding:40px; text-align:center; color:#CCC;">Syncing Ledger...</div>'}
        </div>
        <button style="width:100%; padding:15px; background:none; border:1px solid ${theme.border}; border-radius:15px; color:${theme.text}; font-weight:900; font-size:0.6rem; letter-spacing:1px; cursor:pointer;">VIEW ALL ASSETS</button>
    `;
}

function renderSwap(theme) {
    return `
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">PAYING</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                <span style="font-weight:900; font-size:1.4rem;">$PRN</span>
                <input type="number" placeholder="0.00" style="background:none; border:none; color:${theme.text}; font-weight:900; text-align:right; font-size:1.4rem; outline:none; width:120px;">
            </div>
        </div>
        <div style="text-align:center; margin:-18px 0; position:relative; z-index:1;">
            <div style="background:${theme.accent}; width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:#FFF; border:5px solid ${theme.bg}; font-size:1.2rem;">↓</div>
        </div>
        <div style="background:${theme.surface}; padding:25px; border-radius:20px; border:1px solid ${theme.border};">
            <div style="font-size:0.55rem; color:${theme.muted}; font-weight:900;">RECEIVING</div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                <span style="font-weight:900; font-size:1.4rem;">$MUSD</span>
                <span style="font-weight:900; font-size:1.4rem; opacity:0.3;">0.00</span>
            </div>
        </div>
        <button style="width:100%; padding:20px; background:${theme.accent}; color:#FFF; border:none; border-radius:100px; font-weight:900; margin-top:30px; font-size:0.8rem; letter-spacing:2px; cursor:pointer;">SWAP ASSETS</button>
    `;
}

function renderReceive(theme) {
    return `
        <div style="text-align:center; padding-top:20px;">
            <div style="background:#FFF; padding:25px; border-radius:30px; display:inline-block; border:1px solid #EEE; margin-bottom:30px;">
                <div style="width:180px; height:180px; background:#F0F0F0; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#CCC;">$prisca.pri</div>
            </div>
            <h3 style="font-family:'Playfair Display', serif; font-size:2rem; margin:0;">$prisca.pri</h3>
            <p style="font-size:0.7rem; color:${theme.muted}; margin-top:10px; word-break:break-all;">addr_pri1...6k9z_restored</p>
            <button style="margin-top:25px; background:none; border:1px solid ${theme.border}; padding:12px 25px; border-radius:100px; font-weight:900; font-size:0.6rem; color:${theme.text}; cursor:pointer; letter-spacing:1px;">COPY SOVEREIGN KEY</button>
        </div>
    `;
}

function renderDappsView(theme) {
    const dapps = [
        { name: 'LEGGO', icon: '🌐', desc: 'Sovereign OS & Browser' },
        { name: 'PULSE', icon: '📉', desc: 'L1 Block Explorer' },
        { name: 'PEANUTS', icon: '🛒', desc: 'Ecosystem Commerce' },
        { name: 'MYNT', icon: '🎨', desc: 'Sovereign Artifact Store' },
        { name: 'CHILLATA', icon: '❄️', desc: 'Decentralized Swap' }
    ];
    return `
        <div style="display:grid; gap:12px;">
            ${dapps.map(d => `
                <div style="background:${theme.surface}; border:1px solid ${theme.border}; padding:18px; border-radius:20px; display:flex; align-items:center; gap:15px; cursor:pointer;" onclick="window.location.href='#'">
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

function renderLynx(theme) {
    return `
        <div style="display:flex; flex-direction:column; height:100%;">
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:0 20px; text-align:center;">
                <div style="font-size:2.5rem; margin-bottom:20px;">🛡️</div>
                <div style="font-weight:900; font-size:0.9rem; letter-spacing:3px;">LYNX ENCRYPTED</div>
                <div style="font-size:0.65rem; color:${theme.muted}; margin-top:10px;">Secure peer-to-peer messaging via the Jello privacy layer.</div>
                <div style="margin-top:30px; padding:15px 25px; background:${theme.surface}; border:1px solid ${theme.border}; border-radius:15px; font-size:0.7rem; font-weight:700;">
                    <span style="color:#4CAF50;">●</span> Architect Online
                </div>
            </div>
            <div style="padding:20px 0;">
                <div style="background:${theme.surface}; border:1px solid ${theme.border}; border-radius:100px; padding:12px 20px; display:flex; gap:10px; align-items:center;">
                    <input id="lynx-input" type="text" placeholder="Message $prisca.pri..." style="flex:1; background:none; border:none; color:${theme.text}; font-family:inherit; font-size:0.8rem; outline:none;">
                    <button onclick="sendLynx()" style="background:${theme.accent}; color:#FFF; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:900;">&uarr;</button>
                </div>
            </div>
        </div>
    `;
}

function renderSettings(theme) {
    return `
        <div style="text-align:center; padding:30px 0;">
            <div style="width:100px; height:100px; background:linear-gradient(45deg, #7B35D4, #444); border-radius:25px; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:2.5rem; font-weight:900;">P</div>
            <h3 style="font-family:'Playfair Display', serif; font-size:1.8rem;">$prisca.pri</h3>
            <button style="margin-top:10px; background:none; border:1px solid ${theme.border}; padding:6px 15px; border-radius:50px; font-size:0.6rem; color:${theme.muted}; font-weight:900;">CHANGE AVATAR</button>
        </div>
        <div style="margin-top:30px; display:grid; gap:10px;">
            <button style="width:100%; text-align:left; padding:20px; background:${theme.surface}; border:1px solid ${theme.border}; border-radius:15px; font-weight:700; font-size:0.75rem; color:${theme.text}; cursor:pointer;">RESTORE WALLET</button>
            <button style="width:100%; text-align:left; padding:20px; background:${theme.surface}; border:1px solid ${theme.border}; border-radius:15px; font-weight:700; font-size:0.75rem; color:${theme.text}; cursor:pointer;">CONNECT HARDWARE LEDGER</button>
            <button style="width:100%; text-align:left; padding:20px; background:${theme.surface}; border:1px solid ${theme.border}; border-radius:15px; font-weight:700; font-size:0.75rem; color:${theme.text}; cursor:pointer;">GENERATE NEW IDENTITY</button>
        </div>
    `;
}

function sendLynx() {
    const input = document.getElementById('lynx-input');
    if(input && input.value) {
        alert("Lynx: Message Encrypted & Sent to Architect Node.");
        input.value = '';
    }
}
