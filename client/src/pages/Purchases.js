import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import Purchase from '../components/mypage/Purchase';
import Header from '../components/common/Header';

class Purchases extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author="false"/>
                        <SideNav path={this.props.location.pathname}/>
                    </div>
                    <Purchase/>
                </div>
            </Fragment>
        )
    }
}

export default Purchases;
