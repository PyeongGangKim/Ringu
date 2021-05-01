let crypto = require('crypto');

module.exports = (password, salt) => { // Salt must be length 16 string.
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};
