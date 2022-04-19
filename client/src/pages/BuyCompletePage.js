import React, { Component, Fragment } from 'react';

import BuyComplete from '../components/buy/BuyComplete';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class BuyCompletePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.buy + string.postfix}/>
                <Header history={this.props.history}></Header>
                <div id="wrap">
                    <BuyComplete history={this.props.history} search={this.props.location.search}/>
                </div>
            </Fragment>
        )
    }
}

export default BuyCompletePage;
