import React, { Component, Fragment } from 'react';

import RegisterAuthorDetail from '../components/register/RegisterAuthorDetail';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class AuthorRegisterDetailPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.register + string.postfix}/>
                <Header searchVisible={false} author={true}></Header>
                <div id="wrap">
                    <RegisterAuthorDetail/>
                </div>
                <Footer></Footer>
            </Fragment>
        )
    }
}

export default AuthorRegisterDetailPage;
