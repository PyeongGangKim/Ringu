import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/common/SideNav';
import NotificationChange from '../components/mypage/NotificationChange';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class NotificationChangePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/mypage/notification/update" ? true : false;

        return (
            <Fragment>
                <Helmet title={string.notification + string.postfix}/>
                <Header history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={false}/>
                        <SideNav display1={display} path={this.props.location.pathname}/>
                    </div>
                    <NotificationChange/>
                </div>
                <Footer></Footer>
            </Fragment>
        )
    }
}

export default NotificationChangePage;
