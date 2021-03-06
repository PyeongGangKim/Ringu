import React, { Component, Fragment } from 'react';

import Buy from '../components/buy/Buy';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';

class BuyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.buy + string.postfix}/>
                <Header></Header>
                <div id="wrap">
                    <Buy/>
                </div>
            </Fragment>
        )
    }
}

export default BuyPage;
