const Cryptr = require('cryptr');
const argon2 = require('argon2');

module.exports = {
    encrypt: (string_val) => {
        const cryptr = new Cryptr('dkl23123ndjn3421343sdnv*$*(#@jdsnvs#$@dv');
        var encryptedString = cryptr.encrypt(string_val);
        return encryptedString;
    },
    decrypt: (string_val) => {
        const cryptr = new Cryptr('dkl23123ndjn3421343sdnv*$*(#@jdsnvs#$@dv');
        const decryptedString = cryptr.decrypt(string_val);
        return decryptedString;
    }
};
