import React, { Component, Fragment } from 'react';

import RegisterAuthor from '../components/register/RegisterAuthor';
import Header from '../components/common/Header';

class AuthorRegisterPage extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <Fragment>
                <Header searchVisible={false}></Header>
                <div id="wrap">
                    <RegisterAuthor/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorRegisterPage;
