import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import User from '../../utils/user';
import '../../scss/mypage/mypage.scss';
import '../../scss/common/button.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class PasswordChange extends Component {
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
        try {
            const res = await API.sendPost(URL.api.member.passwordCheck, params)
            var status = res.data.status;

            if(status === "ok") {
                var params = {
                    password: state.data.newPassword,
                }
                try {
                    const res = await API.sendPut(URL.api.member.password, params)

                    var status = res.data.status;
                    if(status === "ok") {
                        alert("비밀번호를 변경하였습니다.")
                        window.location.href = URL.service.home
                    }
                } catch(e) {
                    console.log(e)
                }

            } else {

            }
        } catch(e) {
            console.log(e)
        }

    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">비밀번호 변경</h2>
                </div>

                <hr/>

                <div className="container">
                    <h2 className="subtitle"> 현재 비밀번호</h2>

                    <div className="content">
                        <div className="input-box">
                            <h3 className="header"> 현재 비밀번호 </h3>
                            <input className="textbox" type="password" name="oldPassword" autoComplete="off" value={this.state.data.oldPassword} onChange={this.handleOldPasswordChange} placeholder="현재 비밀번호를 입력해주세요."/>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <h2 className="subtitle"> 새 비밀번호</h2>

                    <div className="content">
                        <div className="input-box">
                            <h3 className="header"> 새 비밀번호 </h3>
                            <input className="textbox" type="password" name="newPassword" autoComplete="off" value={this.state.data.newPassword} onChange={this.handleNewPasswordChange} placeholder="새 비밀번호를 입력해주세요." />
                        </div>
                        <div className="input-box">
                            <h3 className="header"> 새 비밀번호 확인 </h3>
                            <input className="textbox" type="password" name="newPasswordCheck" autoComplete="off" value={this.state.data.newPasswordCheck} onChange={this.handleNewPasswordCheckChange} placeholder="새 비밀번호를 한 번 더 입력해주세요."/>
                        </div>
                    </div>

                    <div className="btn-wrap">
                        <div>
                        </div>
                        <button className="btn btn-color-2" onClick={this.handleClick}>
                                변경하기
                        </button>
                    </div>
                </div>
            </div>

        )
    }
}

export default PasswordChange;
