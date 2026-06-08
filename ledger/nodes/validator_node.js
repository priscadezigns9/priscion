const crypto = require('crypto');
const ValidatorNode = {
    state: "ACTIVE",
    version: "1.2.0",
    validateBlock: (block) => {
        const hash = crypto.createHash('sha256').update(JSON.stringify(block.data)).digest('hex');
        return block.hash === hash;
    },
    sync: (cid) => console.log(`Neural Sync: ${cid}`)
};
module.exports = ValidatorNode;