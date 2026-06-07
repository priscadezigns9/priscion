// Priscion MUSE Wallet Core v7.0.0
// High-Fidelity Sovereign Identity Logic (Pure Web3 restoration)

let walletVisible = false;

function toggleSidebar() {
    const s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    s.classList.toggle('active', walletVisible);
    if(walletVisible) renderWallet();
}

async function renderWallet() {
    const c = document.getElementById('sidebar');
    if(!c) return;

    // Fetch live ledger data
    let assets = [];
    try {
        const response = await fetch('ledger/transactions.json');
        const transactions = await response.json();
        assets = transactions.filter(tx => tx.type === 'PROVISION' && tx.status === 'SECURED_IN_VAULT');
    } catch (e) {
        console.error("Ledger offline", e);
    }

    c.innerHTML = `
        <div style="padding:50px; height:100%; display:flex; flex-direction:column; background:#FFFFFF; color:#1A1A1A; font-family:'Inter', sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:50px;">
                <span style="font-weight:900; letter-spacing:5px; font-size:0.8rem; color:#7B35D4;">MUSE</span>
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#DDD; font-size:1.8rem; cursor:pointer; font-weight:300;">&times;</button>
            </div>
            
            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                <div style="margin-bottom:60px;">
                    <h2 style="font-family:'Playfair Display', serif; font-size:2.8rem; margin:0; line-height:1;">The Vault.</h2>
                    <p style="color:#666; font-size:0.7rem; font-weight:900; letter-spacing:3px; text-transform:uppercase; margin-top:10px;">Sovereign Assets Secured</p>
                </div>

                <div style="background:#F9F9F9; padding:35px; border-radius:30px; border:1px solid #EEE; margin-bottom:40px;">
                    <div style="font-size:0.65rem; color:#666; font-weight:900; letter-spacing:2px; margin-bottom:15px;">MASTER RESERVE</div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                        <span style="font-size:2.5rem; font-weight:900; font-family:'Playfair Display', serif;">$PRN</span>
                        <span style="font-size:1.8rem; font-weight:900; color:#7B35D4;">12,500.00</span>
                    </div>
                </div>

                <div style="margin-bottom:40px;">
                    <div style="font-size:0.65rem; color:#666; font-weight:900; letter-spacing:2px; margin-bottom:20px; text-transform:uppercase;">Provisioned Handles (.pri)</div>
                    <div style="display:grid; gap:10px;">
                        ${assets.length > 0 ? assets.map(asset => `
                            <div style="background:#FFF; border:1px solid #EEE; padding:20px; border-radius:15px; display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:900; font-size:0.9rem;">${asset.asset}</span>
                                <span style="font-size:0.6rem; font-weight:900; color:#7B35D4; text-transform:uppercase; letter-spacing:1px;">SECURED</span>
                            </div>
                        `).join('') : '<p style="color:#DDD; font-size:0.8rem;">No assets detected.</p>'}
                    </div>
                </div>
            </div>

            <div style="margin-top:auto; padding-top:40px; border-top:1px solid #EEE;">
                <button style="width:100%; padding:20px; background:#1A1A1A; color:#FFF; border:none; border-radius:100px; font-weight:900; font-size:0.7rem; letter-spacing:2px; cursor:pointer; text-transform:uppercase; transition:0.3s;" onmouseover="this.style.background='#7B35D4'" onmouseout="this.style.background='#1A1A1A'">Manage Identity</button>
            </div>
        </div>
    `;
}
