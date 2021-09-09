import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import PasswordChange from '../components/mypage/PasswordChange';
import Header from '../components/common/Header';

class PasswordChangePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/mypage/password/update" ? true : false;

        return (
            <Fragment>
                <Header history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={false}/>
                        <SideNav display1={display} path={this.props.location.pathname}/>
                    </div>
                    <PasswordChange/>
                </div>
            </Fragment>
        )
    }
}

export default PasswordChangePage;
