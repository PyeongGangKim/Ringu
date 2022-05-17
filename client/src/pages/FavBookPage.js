import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/common/SideNav';
import FavBook from '../components/mypage/FavBook';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import GuideButton from '../components/home/guide/GuideButton'

class FavBookPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.location.pathname == "/favorite/book" ? true : false;

        return (
            <Fragment>
                <Helmet title={string.favorite + string.postfix}/>
                <Header mypage={true} history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={false}/>
                        <SideNav display2={display} path={this.props.location.pathname}/>
                    </div>
                    <FavBook/>
                </div>
                <GuideButton/>
            </Fragment>
        )
    }
}

export default FavBookPage;
