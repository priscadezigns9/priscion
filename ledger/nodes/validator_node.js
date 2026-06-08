const crypto = require('crypto');

/**
 * PRISCION NEURAL VALIDATOR v1.4.0
 * Phase 2: Block Minting & State Persistence
 */
class NeuralValidator {
    constructor() {
        this.nodeId = "PRISCION_CORE_01";
        this.state = "SOVEREIGN";
        this.mempool = [];
    }

    // Mint a new block once the state reaches consensus
    mintBlock(data, previousHash) {
        const timestamp = Date.now();
        const block = {
            index: Date.now(),
            timestamp,
            data,
            previousHash,
            hash: this.calculateHash(timestamp, data, previousHash)
        };
        console.log(`[SOVEREIGN] Block Minted: ${block.hash}`);
        return block;
    }

    calculateHash(timestamp, data, previousHash) {
        return crypto.createHash('sha256')
            .update(timestamp + JSON.stringify(data) + previousHash)
            .digest('hex');
    }

    verifyChain(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const prevBlock = chain[i - 1];
            if (currentBlock.hash !== this.calculateHash(currentBlock.timestamp, currentBlock.data, currentBlock.previousHash)) return false;
            if (currentBlock.previousHash !== prevBlock.hash) return false;
        }
        return true;
    }
}

module.exports = new NeuralValidator();