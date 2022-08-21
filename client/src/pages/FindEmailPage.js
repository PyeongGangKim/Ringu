import React, { Component, Fragment } from 'react';
import FindEmail from '../components/accounts/FindEmail';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Helmet from 'react-helmet';
import string from '../config/str';

class FindEmailPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.base}/>
                <Header searchVisible={false}/>
                <div id="wrap">
                    <FindEmail/>
                </div>
            </Fragment>
        )
    }
}

export default FindEmailPage;
