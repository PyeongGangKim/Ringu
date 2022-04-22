import React, { Component, Fragment } from 'react';
import ChangePasswordComplete from '../components/accounts/ChangePasswordComplete';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Helmet from 'react-helmet';
import string from '../config/str';

class ChangePasswordCompletePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.base}/>
                <Header searchVisible={false} history={this.props.history}></Header>
                <ChangePasswordComplete/>
            </Fragment>
        )
    }
}

export default ChangePasswordCompletePage;
