import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import SideNav from '../components/common/SideNav';
import MyInfo from '../components/mypage/MyInfo';
import Header from '../components/common/Header';

import GuideButton from '../components/home/guide/GuideButton'

class MyInfoPage extends Component {
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
        return (
            <Fragment>
                <Header mypage={true}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={false} nickname={this.state.nickname}/>
                        <SideNav path={this.props.location.pathname}/>
                    </div>
                    <MyInfo handleNicknameChange={this.hnadleNicknameChange}/>
                </div>
                <GuideButton/>
            </Fragment>
        )
    }
}

export default MyInfoPage;
