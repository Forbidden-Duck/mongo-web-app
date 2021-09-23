const supermongo = require("@forbidden_duck/super-mongo");
const cryptojs = require("crypto-js");

module.exports.options = {
    cfg: {
        keySize: 512 / 32,
        iterations: 10000,
        mode: cryptojs.mode.OFB,
    },
    jwtkey: process.env.JWTKEY || "1234567890qwertyuiopasdfghjklzxcvbnm",
};

module.exports.base64 = supermongo.Utils.Base64;

module.exports.hash = {
    /**
     * Create a nw Salt+Hash
     * @param {string} str
     * @returns {string}
     */
    create: (str) => {
        return supermongo.Utils.Hash.create(str, this.options.cfg);
    },
    /**
     * Compare a Salt+Hash
     * @param {string} str
     * @param {string} salthash
     * @returns {boolean}
     */
    compare: (str, salthash) => {
        return supermongo.Utils.Hash.compare(str, salthash, this.options.cfg);
    },
};

module.exports.refreshtoken = {
    /**
     * Create a new SHA512 refresh token
     * @param {string} str
     * @returns {string}
     */
    create: (str) => {
        return supermongo.Utils.Token.create("SHA512", str);
    },
};
