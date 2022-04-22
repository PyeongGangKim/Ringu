import React, { Component, Fragment } from 'react';

import Payment from '../components/author/Payment';

import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class PaymentPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.payment + string.postfix}/>
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
