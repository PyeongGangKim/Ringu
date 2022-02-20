import React, { Component, Fragment } from 'react';

import URL from '../helper/helper_url';
import API from '../utils/apiutils';
import parse from '../helper/parse';

const BuyCallbackPage = async({... props}) => {
    console.log(props)
    var data = new URLSearchParams(props.location.search)
    var params = parse.paramsToObject(data.entries())
    
    try {
        const res = await API.sendPost(URL.api.payment.create, params)
        if(res.status === 200) {
            alert("결제가 완료되었습니다!")
            props.history.replace({
                pathname:   URL.service.buy.complete,
                state: {
                    pay_method: res.data.method,
                    amount: res.data.amount,
                    fn: res.data.fn,
                    user: res.data.user,
                }
            });
        }

    } catch(e) {
        alert("결제가 실패하였습니다.")
    }
    
    return null
}

export default BuyCallbackPage;
