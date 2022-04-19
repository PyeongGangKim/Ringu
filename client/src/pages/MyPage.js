import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/common/SideNav';
import MyInfo from '../components/mypage/MyInfo';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class MyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickname: null,
        }

        this.handleNicknameChange = (value) => {
            this.setState({nickname:value})
        }
    }

    render() {
        const display = this.props.location.pathname == "/mypage" ? true : false;

        return (
            <Fragment>
                <Helmet title={string.mypage + string.postfix}/>
                <Header mypage={true} history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={false} nickname={this.state.nickname}/>
                        <SideNav display1={display} path={this.props.location.pathname}/>
                    </div>
                    <MyInfo handleNicknameChange={this.handleNicknameChange}/>
                </div>
            </Fragment>
        )
    }
}

export default MyPage;
