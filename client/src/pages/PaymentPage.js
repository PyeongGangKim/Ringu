import React, { Component, Fragment } from 'react';

import Payment from '../components/author/Payment';

import Header from '../components/common/Header';

class PaymentPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Fragment>
                <Header history={this.props.history}></Header>
                <div id="wrap">
                    {
                        <Payment/>
                    }
                </div>
            </Fragment>
        )
    }
}

export default PaymentPage;
