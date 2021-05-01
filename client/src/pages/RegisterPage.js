import React, { Component, Fragment } from 'react';

import RegisterBook from '../components/register/RegisterBook';
import Header from '../components/common/Header';

class RegisterPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <RegisterBook/>
                </div>
            </Fragment>
        )
    }
}

export default RegisterPage;
