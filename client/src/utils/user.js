let decode = require('jwt-decode');
var Cookies = require('js-cookie');

module.exports = {
    getInfo() {
        var token = Cookies.get('token')        
        if (token) {
            var userInfo = decode(token);
            var now = Math.floor(Date.now() / 1000);
            if( userInfo.exp < now ) {
                // console.log( 'leave' )
                Cookies.remove('token');
                return null;
            } else {
                // console.log( 'stay' )
                return userInfo;
            }

        } else {
            return null;
        }
    }
}
