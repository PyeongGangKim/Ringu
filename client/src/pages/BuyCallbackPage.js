import React, { Component, Fragment } from 'react';

import URL from '../helper/helper_url';
import API from '../utils/apiutils';
import parse from '../helper/parse';

class BuyCallbackPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount(){
        var data = new URLSearchParams(this.props.location.search)
        var params = parse.paramsToObject(data.entries())
        
        try {
            const res = await API.sendPost(URL.api.payment.create, params)
            if(res.status === 200) {
                alert("결제가 완료되었습니다!")
                this.props.history.replace({
                    pathname:   URL.service.buy.complete,
                    state: {
                        pay_method: res.data.method,
                        amount: res.data.amount,
                        fn: res.data.fn,
                        user: res.data.user,
                    }
                });
            } 
            else if (res.status === 400) {
                alert("이미 결제되었습니다")
                this.props.history.replace({
                    pathname:   URL.service.buy.complete,
                    state: {
                        pay_method: res.data.method,
                        amount: res.data.amount,
                        fn: res.data.fn,
                        user: res.data.user,
                    }
                });
            } 
            else {
                alert("결제가 실패하였습니다.")
                this.props.history.goBack()
            }
        } catch(e) {
            alert("결제가 실패하였습니다.")
            this.props.history.goBack()
        }
    }

    render() {
        return (
            <div/>
        )
    }
}

export default BuyCallbackPage;
