import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/common/SideNav';
import Cart from '../components/mypage/Cart';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class Carts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.cart + string.postfix}/>
                <Header mypage={true} history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={false}/>
                        <SideNav path={this.props.location.pathname}/>
                    </div>
                    <Cart history={this.props.history}/>
                </div>
                <Footer></Footer>
            </Fragment>
        )
    }
}

export default Carts;
