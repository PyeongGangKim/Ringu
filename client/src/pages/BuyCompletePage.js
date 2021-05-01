import React, { Component, Fragment } from 'react';

import BuyComplete from '../components/buy/BuyComplete';
import Header from '../components/common/Header';

class BuyCompletePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <BuyComplete/>
                </div>
            </Fragment>
        )
    }
}

export default BuyCompletePage;
