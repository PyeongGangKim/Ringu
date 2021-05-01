import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import Leave from '../components/mypage/Leave';
import Header from '../components/common/Header';

class LeavePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/leave" ? true : false;

        return (
            <Fragment>
                <Header></Header>
                <div id="wrap" style={{display:"flex"}}>
                  <div className="side">
                    <SideMemberInfo author="false"/>
                    <SideNav display1={display} path={this.props.location.pathname}/>
                  </div>
                  <Leave/>
                </div>
            </Fragment>
        )
    }
}

export default LeavePage;
