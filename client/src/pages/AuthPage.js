import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import Auth from '../components/mypage/Auth';
import Header from '../components/common/Header';

class AuthPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/auth" ? true : false;

        return (
            <Fragment>
                <Header></Header>
                <div className="content">
                  <div className="side">
                    <SideMemberInfo author="false"/>
                    <SideNav display1={display}/>
                  </div>
                  <Auth/>
                </div>
            </Fragment>
        )
    }
}

export default AuthPage;
