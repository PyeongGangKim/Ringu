import React, { Component, Fragment } from 'react';

import Buy from '../components/buy/Buy';
import Header from '../components/common/Header';

class Carts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <Buy/>
                </div>
            </Fragment>
        )
    }
}

export default Carts;
