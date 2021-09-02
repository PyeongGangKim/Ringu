import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import User from '../../utils/user';
import '../../scss/mypage/mypage.scss';
import '../../scss/common/button.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class NotificationChange extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ui: {

            },
            data: {
                oldPassword:"",
                newPassword: "",
                newPasswordCheck: "",
            },
            msg: {

            }
        };
    }

    handleOldPasswordChange = (evt) => {var state = this.state; state.data.oldPassword = evt.target.value; this.setState(state);}
    handleNewPasswordChange = (evt) => {var state = this.state; state.data.newPassword = evt.target.value; this.setState(state);}
    handleNewPasswordCheckChange = (evt) => {var state = this.state; state.data.newPasswordCheck = evt.target.value; this.setState(state);}

    handleClick = async() => {
        var state = this.state;
        var params = {
            password: state.data.oldPassword
        }

        if(state.data.newPassword !== state.data.newPasswordCheck) {
            alert("비밀번호가 일치하지 않습니다.")
            return
        }

        const res = await API.sendPost(URL.api.member.passwordCheck, params)

        var status = res.status;

        if(status === 200) {
            var params = {
                password: state.data.newPassword,
            }
            const res = await API.sendPut(URL.api.member.password, params)
            var status = res.status;
            if(status === 200) {
                alert("비밀번호를 변경하였습니다.")
            }
        } else {

        }

    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">알림 설정 변경</h2>
                </div>

                <hr/>

                <div className="container">
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

export default NotificationChange;
