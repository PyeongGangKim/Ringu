var rn = require('random-number');

module.exports = {
    generate : (length) => {
        var rand_num = "";
        for (var i = 0; i < length; i++) {
            var gen = rn.generator({ min: 0, max:  9, integer: true });
            var code = gen();
            rand_num = rand_num + "" + code;
        }
        return rand_num;
    }
};
