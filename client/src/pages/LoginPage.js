import React, { Component, Fragment } from 'react';
import Login from '../components/accounts/Login';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.login + string.postfix}/>
                <Header></Header>
                <div id="wrap">
                    <Login/>
                </div>
            </Fragment>
        )
    }
}

export default LoginPage;
