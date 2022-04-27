var jwt = require('jsonwebtoken');
var Cookies = require('js-cookie');

module.exports = {
    getInfo() {
        var token = Cookies.get('RINGU_JWT')
        if (token) {
            var userInfo = jwt.decode(token);
            var now = Math.floor(Date.now() / 1000);
            if( userInfo.exp < now ) {
                Cookies.remove('RINGU_JWT');
                return null;
            } else {
                return userInfo;
            }

        } else {
            return null;
        }
    }
}
