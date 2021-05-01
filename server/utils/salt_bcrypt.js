let bcrypt = require('bcrypt');

module.exports = {
    hash: (string, salt) => {
        const hash = bcrypt.hashSync(string, salt);

        return hash
    },
    compare: (string, hash) => {
        const result = bcrypt.compareSync(string, hash)

        return result
    }
