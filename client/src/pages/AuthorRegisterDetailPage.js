import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import RegisterAuthorDetail from '../components/register/RegisterAuthorDetail';
import Header from '../components/common/Header';

class AuthorRegisterDetailPage extends Component {
    constructor(props) {
        super(props);
        console.log(233)
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <RegisterAuthorDetail/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorRegisterDetailPage;
