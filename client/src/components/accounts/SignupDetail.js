import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Timer from '../common/Timer';

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/signup.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import NAVER from '../../config/naver_auth';

class SignupDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: {val: "22@ss.com", msg: "", clear: false, class: "form-control", btn: false},
            emailCode: {val: "", msg: "", clear: false, class: "form-control", visible: false},
            nickname: {val: "", msg: "", clear: false, class: "form-control", visible: false},
            password: {val: "", msg: "", clear: false, class: "form-control"},
            passwordCheck: {val: "", msg: "", clear: false, class: "form-control"},
            checkAll: false,
            ageCheck: false,
            serviceAgree: false,
            infoAgree: false,
            eventAgree: false,
            activeAgree: false,
            timer: {min: 0, sec:0, active: false, clear: false},
            naver: null,
        };
    }

    componentDidMount() {

    }

    handleEmailChange = evt => {
        var state = JSON.parse(JSON.stringify(this.state));

        state.email.val = evt.target.value;
        state.email.clear = false;
        state.emailCode.visible = false;
        state.timer.active = false;

        if(evt.target.value === "") {
            state.email.btn = false;
            state.email.class = "form-control";
            state.email.msg = "";
            this.setState(state);
            return;
        }

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(evt.target.value)) {  // Regex으로 이메일 형식 맞는지 확인
            state.email.btn = true;
            state.email.class = "form-control";
            state.email.msg = "";
        } else {
            state.email.btn = false;
            state.email.clear = false;
            state.email.class = "form-control error";
            state.email.msg = "이메일을 입력해주세요";
        }

        this.setState(state);
    }

    verifyEmail = async(evt) => {
        
        var state = this.state;
        console.log(state.email.val);
        var params = {
            email: state.email.val,
        }

        const res = await API.sendPost(URL.api.auth.email.duplicate, params)
        console.log(res);
        if(res.status === "ok"){
            const res_email_code = await API.sendPost(URL.api.auth.email.code, params)
            var status = res_email_code.data.status;

            if(status === "ok") {
                this.setState({
                    emailCode: {...state.emailCode, visible: true},
                    email: {...state.email, btn:false},
                    timer: {...state.timer, active:true},
                });
            } else {

            }


        } else {
            if(res.reason === "duplicate email")
            state.email.class = "form-control error";
            state.email.clear = false;
            state.email.btn = false;
            state.email.msg = "이미 가입되어 있는 이메일입니다";

            this.setState(state);
        }
    }

    handleEmailCodeChange = evt => {
        var state = this.state;
        state.emailCode.val = evt.target.value;
        state.emailCode.clear = false;

        if(evt.target.value === "") {
            state.emailCode.btn = false;
            state.emailCode.class = "form-control";
            state.emailCode.msg = "";
            this.setState(state);
            return;
        }

        if (evt.target.value.length === 6) {
            state.emailCode.btn = true;
            state.emailCode.class = "form-control";
            state.emailCode.msg = "";
        } else {
            state.emailCode.btn = false;
            state.emailCode.clear = false;
            state.emailCode.class = "form-control error";
            state.emailCode.msg = "인증 번호는 6자리입니다.";
        }

        this.setState(state);
    }

    handleNicknameChange = evt => {
        var state = this.state;
        state.nickname.val = evt.target.value;
        state.nickname.clear = false;

        if(evt.target.value === "") {
            state.nickname.btn = false;
            state.nickname.class = "form-control";
            state.nickname.msg = "";
            this.setState(state);
            return;
        }

        state.nickname.btn = true;
        state.nickname.class = "form-control";
        state.nickname.msg = "";

        this.setState(state);
    }

    handlePasswordChange = evt => {
        var state = this.state;
        state.password.val = evt.target.value;
        state.password.clear = false;

        if(state.passwordCheck.val !== "") {
            state.passwordCheck.val = ""
        }
        this.setState(state);
    }

    handlePasswordCheckChange = evt => {
        var state = this.state;
        state.passwordCheck.val = evt.target.value;

        if(evt.target.value !== state.password.val) {
            state.passwordCheck.clear = false;
            state.password.clear = false;
            state.passwordCheck.class = "form-control error";
            state.passwordCheck.msg = "비밀번호가 일치하지 않습니다"
        } else {
            state.passwordCheck.clear = true;
            state.password.clear = true;
            state.passwordCheck.class = "form-control";
            state.passwordCheck.msg = ""
        }

        this.setState(state);
    }

    handleCheckAll = evt => {
        var state = this.state;
        var value = evt.target.checked

        state.ageCheck = value;
        state.serviceAgree = value;
        state.infoAgree = value;
        state.eventAgree = value;
        state.activeAgree = value;
        this.setState(state);
    }

    handleAgeCheck = evt => {
        var state = this.state;
        state.ageCheck = evt.target.checked;

        this.setState(state);
    }

    handleServiceAgree = evt => {
        var state = this.state;
        state.serviceAgree = evt.target.checked;

        this.setState(state);
    }

    handleInfoAgree = evt => {
        var state = this.state;
        state.infoAgree = evt.target.checked;

        this.setState(state);
    }

    handleEventAgree = evt => {
        var state = this.state;
        state.eventAgree = evt.target.checked;

        this.setState(state);
    }

    handleActiveAgree = evt => {
        var state = this.state;
        state.activeAgree = evt.target.checked;

        this.setState(state);
    }

    verifyEmailCode = evt => {
        var state = this.state;
        state.emailCode.clear = true;
        state.email.clear = true;
        state.emailCode.btn = false;
        this.setState(state);
    }

    verifyNickname = evt => {
        var state = this.state;

        var params = {
            nickname: state.nickname.val,
        }

        API.sendPost(URL.api.auth.verify_nickname, params).then(res => {
            var status = res.status;

            if(status === "ok") {
                state.nickname.clear = true;
                state.nickname.btn = false;

            } else {
                if(res.reason === "duplicate")
                state.nickname.class = "form-control error";
                state.nickname.clear = false;
                state.nickname.btn = false;
                state.nickname.msg = "이미 존재하는 닉네임입니다";
            }

            this.setState(state);
        })
    }

    handleSubmit = evt => {
        var state = this.state;
        var params = {
            email: state.email.val,
            password: state.password.val,
            nickname: state.nickname.val
        }
        API.sendPost(URL.api.auth.signup, params).then(res => {
            var status = res.data.status;

            if(status === "ok") {
                state.nickname.clear = true;
                state.nickname.btn = false;

            } else {
                if(res.reason === "duplicate")
                state.nickname.class = "form-control error";
                state.nickname.clear = false;
                state.nickname.btn = false;
                state.nickname.msg = "이미 존재하는 닉네임입니다";
            }

            this.setState(state);
        })
    }

    render() {
        return (
            <div className="signup-content">
                <div className="header"> 이메일 </div>
                <div className="email-wrap">
                    <div id="email" className="form-group">
                        <input type="email" name="email" autoComplete="off" className={this.state.email.class} placeholder="이메일을 입력해주세요." value={this.state.email.val} onChange={this.handleEmailChange}/>
                        <button className="btn" disabled={!this.state.email.btn} onClick={this.verifyEmail}>
                            {
                                this.state.email.clear === true ? "인증완료" : "인증하기"
                            }
                        </button>
                        {
                            this.state.email.msg &&
                            <div className="error-wrap">
                                <span>{this.state.email.msg}</span>
                            </div>
                        }

                    </div>
                    {
                        this.state.emailCode.visible &&
                        <div id="email-code" className="form-group">
                            <input type="number" name="email-code" maxLength="6" autoComplete="off" className={this.state.emailCode.class} placeholder="인증 번호를 입력해주세요." value={this.state.emailCode.val} onChange={this.handleEmailCodeChange}/>
                            <button className="btn" disabled={!this.state.emailCode.btn} onClick={this.verifyEmailCode}>
                                {
                                    this.state.emailCode.clear === true ? "인증완료" : "인증하기"
                                }
                            </button>
                            <Timer mm={0} ss={11} active={this.state.timer.active}/>
                            {
                                this.state.emailCode.msg &&
                                <div className="error-wrap">
                                    <span>{this.state.emailCode.msg}</span>
                                </div>
                            }
                        </div>
                    }

                </div>

                <div className="header"> 닉네임 </div>
                <div className="nickname-wrap">
                    <div id="nickname" className="form-group">
                        <input type="text" name="nickname" autoComplete="off" className="form-control" placeholder="닉네임을 입력해주세요." value={this.state.nickname.val} onChange={this.handleNicknameChange}/>
                        <button className="btn"  disabled={!this.state.nickname.btn} onClick={this.verifyNickname}>
                            {
                                this.state.nickname.clear === true ? "확인완료" : "중복확인"
                            }
                        </button>
                        {
                            this.state.nickname.msg &&
                            <div className="error-wrap">
                                <span>{this.state.nickname.msg}</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="header"> 비밀번호 </div>
                <div className="password-wrap">
                    <div id="password" className="form-group">
                        <input type="password" name="password" autoComplete="off" className="form-control" placeholder="비밀 번호를 입력해주세요." value={this.state.password.val} onChange={this.handlePasswordChange}/>
                        {
                            this.state.password.msg &&
                            <div className="error-wrap">
                                <span>{this.state.password.msg}</span>
                            </div>
                        }
                    </div>
                    <div id="password-confirm" className="form-group">
                        <input type="password" name="password-check" autoComplete="off" className="form-control" placeholder="비밀 번호를 한 번 더 입력해주세요." value={this.state.passwordCheck.val} onChange={this.handlePasswordCheckChange}/>
                        {
                            this.state.passwordCheck.msg &&
                            <div className="error-wrap">
                                <span>{this.state.passwordCheck.msg}</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="header"> 약관동의 </div>
                <div className="terms-wrap">
                    <div className="terms-box">
                        <div className="checkbox-wrap all">
                            <input type="checkbox" id="agree-all" onClick={this.handleCheckAll} checked={this.state.ageCheck && this.state.serviceAgree && this.state.eventAgree && this.state.infoAgree && this.state.activeAgree }/>
                            <label htmlFor="agree-all" >
                                <div className="checkbox-text">
                                    모두 동의합니다.
                                </div>
                            </label>
                        </div>

                        <hr/>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-age" onClick={this.handleAgeCheck} checked={this.state.ageCheck}/>
                            <label htmlFor="agree-age" >
                                <div className="checkbox-text">
                                    만 14세 이상입니다.
                                    <span className="red">(필수)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-service" onClick={this.handleServiceAgree} checked={this.state.serviceAgree}/>
                            <label htmlFor="agree-service">
                                <div className="checkbox-text">
                                    <a href=""><u>서비스 이용약관</u></a>에 동의합니다.
                                    <span className="red">(필수)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-info" onClick={this.handleInfoAgree} checked={this.state.infoAgree}/>
                            <label htmlFor="agree-info">
                                <div className="checkbox-text">
                                    <a href=""><u>개인정보 수집/이용</u></a>에 동의합니다.
                                    <span className="red">(필수)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-event" onClick={this.handleEventAgree} checked={this.state.eventAgree}/>
                            <label htmlFor="agree-event">
                                <div className="checkbox-text">
                                    이벤트 할인 혜택 수신에 동의합니다.(선택)
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-active" onClick={this.handleActiveAgree} checked={this.state.activeAgree}/>
                            <label htmlFor="agree-active">
                                <div className="checkbox-text">
                                    장기 미접속 시 계정 활성 상태 유지합니다.(선택)
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <a href="/welcome">
                    {/*<button className="btn signup-btn" disabled={!(this.state.email.clear && this.state.emailCode.clear && this.state.password.clear && this.state.passwordCheck.clear && this.state.nickname.clear && this.state.ageCheck && this.state.serviceAgree && this.state.infoAgree)} onClick={this.handleSubmit}>*/}
                    <button className="btn signup-btn" disabled={!(this.state.password.clear && this.state.passwordCheck.clear && this.state.nickname.clear && this.state.ageCheck && this.state.serviceAgree && this.state.infoAgree)} onClick={this.handleSubmit}>
                        가입완료!
                    </button>
                </a>
            </div>
        );
    }
}

export default SignupDetail;
