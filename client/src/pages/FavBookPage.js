import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import FavBook from '../components/mypage/FavBook';
import Header from '../components/common/Header';

class FavBookPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/favorite/book" ? true : false;

        return (
            <Fragment>
                <Header></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author="false"/>
                        <SideNav display2={display} path={this.props.location.pathname}/>
                    </div>
                    <FavBook/>
                </div>
            </Fragment>
        )
    }
}

export default FavBookPage;
