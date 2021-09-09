import React, { Component, Fragment } from 'react';

import RegisterAuthorDetail from '../components/register/RegisterAuthorDetail';
import Header from '../components/common/Header';

class AuthorRegisterDetailPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header searchVisible={false} author={true}></Header>
                <div id="wrap">
                    <RegisterAuthorDetail/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorRegisterDetailPage;
