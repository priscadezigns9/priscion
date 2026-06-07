// Priscion Sovereign Wallet Core v6.2.0
// Unified Web2/Web3 Checkout & Sovereign Identity Logic

let walletVisible = false;

function toggleSidebar() {
    const s = document.getElementById('sidebar');
    if(!s) return;
    walletVisible = !walletVisible;
    s.classList.toggle('active', walletVisible);
    if(walletVisible) renderWallet();
}

function renderWallet() {
    const c = document.getElementById('sidebar');
    if(!c) return;
    c.innerHTML = `
        <div style="padding:40px; height:100%; display:flex; flex-direction:column; background:#000; color:#fff; font-family:'Inter', sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <img src="../assets/p-logo.png" style="height:24px;">
                <button onclick="toggleSidebar()" style="background:none; border:none; color:#444; font-size:1.5rem; cursor:pointer;">✕</button>
            </div>
            
            <div id="wallet-content" style="flex:1; overflow-y:auto; scrollbar-width:none;">
                <div style="animation:fadeIn 0.5s">
                    <h2 style="font-weight:900; letter-spacing:3px; font-size:1.5rem; margin-bottom:5px;">MUSE WALLET</h2>
                    <p style="color:#444; font-size:0.6rem; font-weight:900; letter-spacing:2px; text-transform:uppercase;">Connected to Priscion Ledger</p>
                    
                    <div style="background:linear-gradient(145deg, #111, #050505); padding:30px; border-radius:30px; border:1px solid #222; margin-top:30px;">
                        <div style="color:#555; font-size:0.6rem; font-weight:900; letter-spacing:2px;">TOTAL ASSETS (USD)</div>
                        <div style="font-size:2.5rem; font-weight:900; margin-top:10px;">$4,290.00</div>
                        <div style="display:flex; gap:15px; margin-top:20px;">
                            <div style="background:rgba(123,53,212,0.1); padding:10px 15px; border-radius:10px;">
                                <div style="color:var(--accent); font-size:0.5rem; font-weight:900;">$PRN</div>
                                <div style="font-size:0.8rem; font-weight:900;">1,200.50</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.05); padding:10px 15px; border-radius:10px;">
                                <div style="color:#666; font-size:0.5rem; font-weight:900;">$MUSD</div>
                                <div style="font-size:0.8rem; font-weight:900;">2,500.00</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:40px;">
                        <div style="font-weight:900; font-size:0.7rem; letter-spacing:2px; color:#333; margin-bottom:20px;">QUICK ACTIONS</div>
                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px;">
                            <div onclick="renderStake()" style="background:#080808; border:1px solid #111; padding:20px 10px; border-radius:20px; text-align:center; cursor:pointer;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent);"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <div onclick="renderVault()" style="background:#080808; border:1px solid #111; padding:20px 10px; border-radius:20px; text-align:center; cursor:pointer;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#444;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <div onclick="renderSwap()" style="background:#080808; border:1px solid #111; padding:20px 10px; border-radius:20px; text-align:center; cursor:pointer;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#444;"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top:auto; padding-top:20px; border-top:1px solid #111; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:900; font-size:0.6rem; letter-spacing:2px; color:#222;">v6.2.0 UTILITY</div>
                <div style="width:8px; height:8px; background:#00FF00; border-radius:50%; box-shadow:0 0 10px #00FF00;"></div>
            </div>
        </div>
    `;
}

function buy(service, price) {
    if(!walletVisible) toggleSidebar();
    renderPayment(service, price);
}

function renderPayment(name, basePrice) {
    const c = document.getElementById('wallet-content');
    const price = parseFloat(basePrice) || 299.00;
    const prnPrice = (price * 0.9).toFixed(2);
    
    c.innerHTML = `
        <div style="animation:fadeIn 0.5s">
            <h2 style="font-weight:900; letter-spacing:3px; font-size:1.5rem;">CHECKOUT</h2>
            <div style="background:#080808; border:1px solid #111; padding:25px; border-radius:30px; margin-top:20px;">
                <div style="font-size:0.6rem; font-weight:900; color:var(--accent); letter-spacing:2px;">${name.toUpperCase()}</div>
                <div style="display:flex; justify-content:space-between; margin-top:20px; border-bottom:1px solid #111; padding-bottom:15px;">
                    <span style="color:#555; font-size:0.8rem;">Standard Price</span>
                    <span style="font-weight:900;">$${price.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:20px;">
                    <span style="color:var(--accent); font-size:0.8rem; font-weight:900;">Sovereign Price</span>
                    <span style="font-weight:900; color:var(--accent);">-10% OFF</span>
                </div>
                <div style="font-size:2rem; font-weight:900; margin-top:5px; text-align:right;">${prnPrice} $PRN</div>
            </div>

            <div style="margin-top:40px;">
                <div style="font-size:0.5rem; font-weight:900; color:#333; letter-spacing:3px; margin-bottom:15px; text-transform:uppercase;">Select Payment Method</div>
                <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                    <button onclick="alert('PayPal Secured Hub Opening...')" style="background:#0070BA; color:#fff; border:none; padding:18px; border-radius:20px; font-weight:900; cursor:pointer; font-size:0.7rem; display:flex; align-items:center; justify-content:center; gap:10px;">PAYPAL</button>
                    <button onclick="alert('Encrypted Card Terminal Active...')" style="background:#fff; color:#000; border:none; padding:18px; border-radius:20px; font-weight:900; cursor:pointer; font-size:0.7rem;">CREDIT CARD</button>
                    <button onclick="alert('US ACH Settlement Initiated...')" style="background:#111; color:#fff; border:1px solid #222; padding:18px; border-radius:20px; font-weight:900; cursor:pointer; font-size:0.7rem;">US BANK ACCOUNT</button>
                    <button onclick="alert('Ledger Handshake: $PRN Payment Received')" style="background:var(--accent); color:#fff; border:none; padding:18px; border-radius:20px; font-weight:900; cursor:pointer; font-size:0.7rem;">SOVEREIGN ($PRN)</button>
                </div>
            </div>

            <div style="margin-top:40px; padding:25px; border-radius:30px; border:1px solid #222; background:rgba(123,53,212,0.05);">
                <div style="font-size:0.6rem; font-weight:900; color:var(--accent); letter-spacing:2px; margin-bottom:15px;">BUNDLE SELECTION</div>
                <div style="display:flex; flex-direction:column; gap:15px;">
                    <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                        <input type="radio" name="pkg" checked style="accent-color:var(--accent);">
                        <span style="font-size:0.75rem; font-weight:900; color:#666;">WEB2 BASIC (Site + App)</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                        <input type="radio" name="pkg" style="accent-color:var(--accent);">
                        <span style="font-size:0.75rem; font-weight:900; color:var(--accent);">WEB3 SOVEREIGN (+Handle)</span>
                    </label>
                </div>
            </div>
            
            <p style="margin-top:30px; color:#333; font-size:0.6rem; line-height:1.5; text-align:center;">All purchases include a High-Fidelity Guarantee. <br> Sovereign Handles issued upon verification.</p>
        </div>
    `;
}

function renderStake() {
    const c = document.getElementById('wallet-content');
    c.innerHTML = `
        <div style="animation:fadeIn 0.5s">
            <h2 style="font-weight:900; letter-spacing:3px; font-size:1.5rem;">STAKING</h2>
            <div style="background:#080808; border:1px solid #111; padding:30px; border-radius:30px; margin-top:20px;">
                <div style="color:#555; font-size:0.6rem; font-weight:900; letter-spacing:2px;">ESTIMATED YIELD</div>
                <div style="font-size:3rem; font-weight:900; color:var(--accent); margin-top:10px;">12.5% <span style="font-size:0.8rem; color:#333;">APY</span></div>
                <p style="color:#444; font-size:0.75rem; margin-top:20px; line-height:1.6;">Commit your $PRN to secure the Sovereign Ledger and earn passive neural rewards.</p>
                <button class="w-btn" style="background:var(--accent); width:100%; padding:18px; border-radius:20px; margin-top:30px; border:none; color:#fff; font-weight:900; cursor:pointer;" onclick="alert('Stake Sign-Off Initiated...')">STAKE $PRN</button>
            </div>
        </div>
    `;
}

function renderVault() {
    const c = document.getElementById('wallet-content');
    const items = [
        { n: 'Heritage NFT', i: '🏺', id: 'CL-01' },
        { n: 'Alpha Handle', i: '🏷️', id: '$prisca.pri' }
    ];
    c.innerHTML = `
        <div style="animation:fadeIn 0.5s">
            <h2 style="font-weight:900; letter-spacing:3px; font-size:1.5rem;">VAULT</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:20px;">
                ${items.map(item => `
                    <div onclick="renameNFT('${item.n}')" style="background:#080808; border:1px solid #111; padding:25px; border-radius:25px; text-align:center; cursor:pointer;">
                        <div style="font-size:2rem; margin-bottom:10px;">${item.i}</div>
                        <div style="font-size:0.7rem; font-weight:900;">${item.n}</div>
                        <div style="font-size:0.5rem; color:#444;">${item.id}</div>
                    </div>
                `).join('')}
            </div>
            <button style="width:100%; padding:18px; border:1px solid #111; background:none; border-radius:20px; color:#333; font-weight:900; margin-top:30px; cursor:pointer; font-size:0.6rem; letter-spacing:2px;">SYNC EXTERNAL ASSETS</button>
        </div>
    `;
}

function renameNFT(name) {
    const n = prompt("Enter new name for " + name + " (Fee: 0.05 $PRN)");
    if(n) alert("Renaming to " + n + ". Fee deducted from Treasury.");
}

function renderSwap() {
    const c = document.getElementById('wallet-content');
    c.innerHTML = `
        <div style="animation:fadeIn 0.5s">
            <h2 style="font-weight:900; letter-spacing:3px; font-size:1.5rem;">DEX SWAP</h2>
            <div style="background:#080808; border:1px solid #111; padding:30px; border-radius:30px; margin-top:20px;">
                <div style="background:#000; padding:20px; border-radius:20px; border:1px solid #111;">
                    <div style="font-size:0.6rem; color:#444;">FROM</div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px;">
                        <span style="font-weight:900;">$PRN</span>
                        <input type="number" value="100" style="background:none; border:none; color:#fff; text-align:right; font-weight:900; width:80px; outline:none;">
                    </div>
                </div>
                <div style="text-align:center; margin:-10px 0;">
                    <div style="background:var(--accent); width:30px; height:30px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; border:5px solid #080808;">↓</div>
                </div>
                <div style="background:#000; padding:20px; border-radius:20px; border:1px solid #111;">
                    <div style="font-size:0.6rem; color:#444;">TO</div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px;">
                        <span style="font-weight:900;">$MUSD</span>
                        <span style="font-weight:900; color:#555;">250.00</span>
                    </div>
                </div>
                <button style="width:100%; padding:18px; background:var(--accent); border:none; border-radius:20px; color:#fff; font-weight:900; margin-top:30px; cursor:pointer;">SWAP ASSETS</button>
            </div>
        </div>
    `;
}


