// Priscion Sovereign Core - Phase 3 Finality
const CHAIN_ID = "priscion-l1-mainnet";
const EXPLORER_URL = "pulse.html";

var userWallets = [
    { name: 'Primary Muse', address: 'addr1_prn...m9zk', balance: 1450.00, asset: '$PRN', avatar: 'assets/muse_icon.png' },
    { name: 'Savings Vault', address: 'addr1_prn...v8xp', balance: 5000.00, asset: '$PRN', avatar: 'assets/muse_icon.png' }
];

var dapps = [
    { n: 'MUSE', i: 'assets/muse_icon.png', u: 'wallet.html', desc: 'Sovereign Wallet' },
    { n: 'CHILLATA', i: 'assets/chillata_icon.png', u: 'swap.html', desc: 'DEX / Swap' },
    { n: 'PULSE', i: 'assets/pulse_icon.png', u: 'pulse.html', desc: 'Sovereign Explorer' },
    { n: 'LYNX', i: 'assets/lynx_icon.png', u: 'lynx.html', desc: 'Neural Messenger' },
    { n: 'MYNT', i: 'assets/mynt_icon.png', u: 'mynt.html', desc: 'NFT Marketplace' },
    { n: 'LEGGO', i: 'assets/leggo_icon.png', u: 'leggo.html', desc: 'Sovereign Browser' }
];

function initWallet() {
    console.log("MUSE Wallet Core Initialized...");
}

// Function to handle the Muse Icon animation on startup
function playStartupAnimation() {
    const splash = document.createElement('div');
    splash.id = 'muse-splash';
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;justify-content:center;align-items:center;z-index:9999;transition: opacity 0.5s;";
    splash.innerHTML = `<img src="assets/muse_icon.png" style="width:150px;animation: pulse-muse 2s infinite;">`;
    document.body.appendChild(splash);
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
    }, 2000);
}

// CSS for the pulse animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulse-muse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
    }
`;
document.head.appendChild(style);
