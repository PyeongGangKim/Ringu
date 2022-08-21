import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/common/SideNav';
import My from '../components/mypage/My';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import GuideButton from '../components/home/guide/GuideButton'

class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.mypage + string.postfix}/>
                <Header mypage={true}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo />
                        <SideNav/>
                    </div>
                    <My/>
                </div>
                <GuideButton/>
            </Fragment>
        )
    }
}

export default MyPage;
