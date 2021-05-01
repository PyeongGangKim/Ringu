import React, { Component, Fragment } from 'react';
import Login from '../components/accounts/Login';
import Header from '../components/common/Header';

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <Login/>
                </div>
            </Fragment>
        )
    }
}

export default LoginPage;
