import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/mypage/SideNav';
import Cart from '../components/mypage/Cart';
import Header from '../components/common/Header';

class Carts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header mypage={true} history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author={false}/>
                        <SideNav path={this.props.location.pathname}/>
                    </div>
                    <Cart history={this.props.history}/>
                </div>
            </Fragment>
        )
    }
}

export default Carts;
