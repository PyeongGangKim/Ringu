import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import User from '../../utils/user';
import '../../scss/mypage/mypage.scss';
import '../../scss/common/button.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class MyInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ui: {

            },
            data: {
                id:"",
                password:""
            },
            msg: {

            }
        };
    }

    componentDidMount() {
        var userInfo = User.getInfo();

        API.sendGet(URL.api.member.get).then(res => {
            console.log(res)
        });

    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">나의 정보</h2>
                    <button className="modify-btn">
                        <em/>
                        수정
                    </button>
                </div>

                <hr/>

                <div className="container">
                    <h2 className="subtitle"> 계정 정보</h2>

                    <div className="content">
                        <div className="input-box">
                            <h3 className="header"> 이메일 </h3>
                            <input className="textbox" type="email" name="email" autoComplete="off" value="trop100@naver.com"/>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 닉네임 </h3>
                            <input className="textbox" type="text" name="nickname" autoComplete="off" value="trop100"/>
                        </div>
                    </div>
                </div>


                <div className="container">
                    <h2 className="subtitle"> 알림 설정</h2>

                    <div className="noti-check">
                        <div className="noti-box">
                            <span> </span>
                            <span className="noti-header"> SMS</span>
                            <span className="noti-header"> 이메일</span>
                        </div>

                        <div className="noti-box">
                            <span> 찜한 목록/작가 새소식 알림</span>
                            <Switch checked color="primary"/>
                            <Switch checked color="primary"/>
                        </div>

                        <div className="noti-box">
                            <span> 판매 완료 알림</span>
                            <Switch checked color="primary"/>
                            <Switch checked color="primary"/>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

export default MyInfo;
