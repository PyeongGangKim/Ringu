import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import MyInfo from '../components/mypage/MyInfo';
import Header from '../components/common/Header';

class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/mypage" ? true : false;

        return (
            <Fragment>
                <Header></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author="false"/>
                        <SideNav display1={display} path={this.props.location.pathname}/>
                    </div>
                    <MyInfo/>
                </div>
            </Fragment>
        )
    }
}

export default MyPage;
