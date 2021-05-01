import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import FavAuthor from '../components/mypage/FavAuthor';
import Header from '../components/common/Header';

class FavAuthorPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/favorite/author" ? true : false;

        return (
            <Fragment>
                <Header></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author="false"/>
                        <SideNav display2={display} path={this.props.location.pathname}/>
                    </div>
                    <FavAuthor/>
                </div>
            </Fragment>
        )
    }
}

export default FavAuthorPage;
