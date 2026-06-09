const NETWORK_VERSION = '4.4.0-GOSSIP';
class P2PGossipNetwork {
    constructor() {
        this.state = JSON.parse(localStorage.getItem('priscion_state') || '{"rewards": 0}');
        setInterval(() => {
            this.state.rewards += 0.01;
            localStorage.setItem('priscion_state', JSON.stringify(this.state));
            console.log('Gossip: Sharing ledger state...');
        }, 5000);
    }
}
const MUSE = new P2PGossipNetwork();