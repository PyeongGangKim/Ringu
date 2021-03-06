var axios = require('axios');
var Cookies = require('js-cookie');
var url = require('../config/url')[process.env.REACT_APP_ENV];

var apiHost = url.API_URL;

if( process.env.REACT_APP_APIHOST ) apiHost = process.env.REACT_APP_APIHOST;
var headers = {
    'Content-Type': 'application/json',
}

module.exports = {
    sendPost(url, params) {
        var token = Cookies.get('RINGU_JWT')
        if (!!token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        url = apiHost + url

        try {
            var ret = axios.post(url, JSON.stringify(params), { headers: headers })
                .then(res => {
                    var status = res.status;
                    var data = res.data;
                    var reason = "";

                    if (status === 200 || status === 201) {
                        return { status: status, data: data, reason: reason };
                    } else {
                        if (!!res.data.reason) reason = res.data.reason;
                        return { status: "error", data: "", reason: reason };
                    }
                })
                .catch(err => {
                    var resp = err.response;
                    return { status: resp.status, data: resp.data, reason: resp.statusText };
                })
            return ret;
        }
        catch(err) {
            console.log(err)
            alert('error')
        }
    },

    sendData(url, data) {
        var headers = {
            'Content-Type': 'multipart/form-data',
        }
        var token = Cookies.get('RINGU_JWT')
        if (!!token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        url = apiHost + url

        var ret = axios.post(url, data, { headers: headers })
            .then(res => {
                var status = res.status;
                var data = res.data;
                var reason = "";

                if (status === 200 || status === 201) {
                    return { status: status, data: data, reason: reason };
                } else {
                    if (!!res.data.reason) reason = res.data.reason;
                    return { status: "error", data: "", reason: reason };
                }
            })
            .catch(err => {
                console.log(err)
                var resp = err.response;
                return { status: resp.status, data: resp.data, reason: resp.statusText };
            })
        return ret;
    },

    sendGet(url, params = {} ) {
        var token = Cookies.get('RINGU_JWT')
        if (!!token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        url = apiHost + url
        var ret = axios.get(url, { params:params, headers: headers }).then(res => {
            return res;
        })
        return ret;
    },

    sendPut(url, params = {}, content=null) {
        url = apiHost + url
        var token = Cookies.get('RINGU_JWT')
        if (!!content) {
            headers['Content-Type'] = content
        }
        if (!!token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        var ret = axios.put(url, params, { headers: headers }).then(res => {
            var status = res.status;
            var data = res.data;
            var reason = "";

            if (status === 200) {
                return { status: status, data: data, reason: reason };
            } else {
                if (!!res.data.reason) reason = res.data.reason;
                return { status: "error", data: "", reason: reason };
            }
        })

        return ret;
    },


    sendDelete(url, params = {}) {
        url = apiHost + url

        var token = Cookies.get('RINGU_JWT')
        if (!!token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        var ret = axios.delete(url, {params: params, headers: headers} )
            .then(res => {
                var status = res.status;
                var data = res.data;
                var reason = "";

                if (status === 200) {
                    return { status: status, data: data, reason: reason };
                } else {
                    if (!!res.data.reason) reason = res.data.reason;
                    return { status: "error", data: "", reason: reason };
                }
            })
        return ret
    }

}
