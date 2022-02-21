import React, { Component, Fragment } from 'react';

import Buy from '../components/buy/Buy';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class Carts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.buy + string.postfix}/>
                <Header history={this.props.history}></Header>
                <div id="wrap">
                    <Buy history={this.props.history}/>
                </div>
                <Footer></Footer>
            </Fragment>
        )
    }
}

export default Carts;
