import React, { Component, Fragment } from 'react';

import RegisterAuthor from '../components/register/RegisterAuthor';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class AuthorRegisterPage extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <Fragment>
                <Helmet title={string.register + string.postfix}/>
                <Header searchVisible={false}></Header>
                <div id="wrap">
                    <RegisterAuthor/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorRegisterPage;
