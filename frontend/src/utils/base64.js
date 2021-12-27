const cryptojs = require("crypto-js");

/**
 * Encode a string to base64
 * @param {string} str
 * @returns {string}
 */
module.exports.encode = (str) => {
    const strToWordArray = cryptojs.enc.Utf8.parse(str);
    return cryptojs.enc.Base64.stringify(strToWordArray);
};

/**
 * Decode a base64 string
 * @param {string} encoded
 * @returns {string}
 */
module.exports.decode = (encoded) => {
    const base64ToWordArray = cryptojs.enc.Base64.parse(encoded);
    return cryptojs.enc.Utf8.stringify(base64ToWordArray);
};
