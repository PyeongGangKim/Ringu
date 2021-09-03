import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import RegisterAuthor from '../components/register/RegisterAuthor';
import Header from '../components/common/Header';

class AuthorRegisterPage extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <Fragment>
                <Header ></Header>
                <div id="wrap">                    
                    <RegisterAuthor/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorRegisterPage;
