import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Timer from '../common/Timer';
import Cookies from 'js-cookie';

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
            email: {val: "", msg: "", clear: false, class: "input", btn: false, success: false,},
            emailCode: {val: "", msg: "", clear: false, class: "input", visible: false, success: false},
            nickname: {val: "", msg: "", clear: false, class: "input", visible: false, success: false},
            password: {val: "", msg: "", clear: false, class: "input", success: false},
            passwordCheck: {val: "", msg: "", clear: false, class: "input", success: false},
            checkAll: false,
            ageCheck: false,
            serviceAgree: false,
            infoAgree: false,
            eventAgree: false,
            activeAgree: false,
            timer: {min: 0, sec:0, active: false, clear: false},
            timeout: false,
            naver: null,
        };
    }

    componentDidMount() {

    }

    handleEmailChange = (evt) => {
        var state = JSON.parse(JSON.stringify(this.state));

        state.email.val = evt.target.value.trim();
        state.email.clear = false;
        state.emailCode.visible = false;
        state.timer.active = false;

        if(evt.target.value === "") {
            state.email.btn = false;
            state.email.class = "input";
            state.email.msg = "";
            this.setState(state);
            return;
        }

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(evt.target.value)) {  // Regex으로 이메일 형식 맞는지 확인
            state.email.btn = true;
            state.email.class = "input";
            state.email.msg = "";
        } else {
            state.email.btn = false;
            state.email.clear = false;
            state.email.class = "input error";
            state.email.msg = "이메일 형식이 유효하지 않습니다.";
        }

        this.setState(state);
    }

    handleChangeTimeout = (value) => {
        var state = this.state;
        state.timeout = value;
        state.emailCode.val = "";
        this.setState(state);
    }

    handleResend = async() => {
        var state = this.state;
        var params = {
            email: state.email.val,
        }

        const res = await API.sendPost(URL.api.auth.email.code, params)
        var status = res.status;

        if(status === 200) {
            this.setState({
                timer: {...state.timer, active:true},
            });
        } else {
            alert("재전송에 실패하였습니다. 잠시 후 다시 시도해주세요")
        }
    }

    verifyEmail = async(evt) => {
        var state = this.state;
        var params = {
            email: state.email.val,
        }

        try {
            const duplicate = await API.sendGet(URL.api.auth.email.duplicate, params)
            if(duplicate.status === 200){
                if (duplicate.data.message === 'OK') {
                    const res = await API.sendPost(URL.api.auth.email.code, params)
                    var status = res.status;

                    if(status === 201) {
                        this.setState({
                            emailCode: {...state.emailCode, visible: true,},
                            email: {...state.email, btn:false, },
                            timer: {...state.timer, active:true},
                        });
                    }
                }
                else if(duplicate.data.message === 'duplicate') {
                    state.email.class = "input error";
                    state.email.clear = false;
                    state.email.btn = false;
                    state.email.msg = "이미 가입되어 있는 이메일입니다";
                    this.setState(state);
                }
            }
        } catch(e) {
            var error = e.response
            state.email.class = "input error";
            state.email.clear = false;
            state.email.btn = false;
            state.email.msg = "인증 코드 발송에 실패하였습니다. 다음에 다시 시도해주세요.";

            this.setState(state);
        }
    }

    handleEmailCodeChange = evt => {
        var state = this.state;
        state.emailCode.val = evt.target.value;
        state.emailCode.clear = false;

        if(evt.target.value === "") {
            state.emailCode.btn = false;
            state.emailCode.class = "input";
            state.emailCode.msg = "";
            this.setState(state);
            return;
        }

        if (evt.target.value.length === 6) {
            state.emailCode.btn = true;
            state.emailCode.class = "input";
            state.emailCode.msg = "";
        } else {
            state.emailCode.btn = false;
            state.emailCode.clear = false;
            state.emailCode.class = "input error";
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
            state.nickname.class = "input";
            state.nickname.msg = "";
            this.setState(state);
            return;
        }

        state.nickname.btn = true;
        state.nickname.class = "input";
        state.nickname.msg = "";

        this.setState(state);
    }

    handlePasswordChange = evt => {
        var state = this.state;
        let passRule = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        state.password.val = evt.target.value;
        state.password.clear = false;

        if (passRule.test(evt.target.value)) {  // Regex으로 비밀번호 형식 맞는지 확인
            state.password.class = "input";
            state.password.msg = "";
            state.password.success = true;
        } else {
            state.password.clear = false;
            state.password.class = "input error";
            state.password.msg = "비밀번호는 8자 이상의 영문/숫자/특수 문자 조합으로 구성되어야 합니다.";
        }

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
            state.passwordCheck.class = "input error";
            state.passwordCheck.msg = "비밀번호가 일치하지 않습니다"
        } else {
            state.password.success = true;
            state.passwordCheck.success = true;
            state.passwordCheck.clear = true;
            state.password.clear = true;
            state.passwordCheck.class = "input";
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

    handleAgeCheck = evt => {var state = this.state;state.ageCheck = evt.target.checked;this.setState(state);}

    handleServiceAgree = evt => {var state = this.state;state.serviceAgree = evt.target.checked;this.setState(state);}

    handleInfoAgree = evt => {var state = this.state;state.infoAgree = evt.target.checked;this.setState(state);}

    handleEventAgree = evt => {var state = this.state;state.eventAgree = evt.target.checked;this.setState(state);}

    handleActiveAgree = evt => {var state = this.state;state.activeAgree = evt.target.checked;this.setState(state);}

    verifyEmailCode = async(evt) => {
        var state = this.state;
        var params = {
            number: state.emailCode.val,
            email: state.email.val,
        }

        try {
            const res = await API.sendGet(URL.api.auth.email.identification, params)
            if(res.status === 200) {
                state.emailCode.success = true;
                state.email.success = true;
                state.emailCode.clear = true;
                state.email.clear = true;
                state.emailCode.btn = false;
                state.timer.active = false;
            }

        } catch(e) {
            state.emailCode.class = "input error";
            state.emailCode.clear = false;
            state.emailCode.msg = "인증에 실패하였습니다.";
        }

        this.setState(state);
    }

    verifyNickname = async(evt) => {
        var state = this.state;

        var params = {
            nickname: state.nickname.val,
        }

        try {
            const duplicate = await API.sendGet(URL.api.auth.nickname_duplicate, params)
            if(duplicate.status === 200) {
                if(duplicate.data.message === 'OK') {
                    state.nickname.clear = true;
                    state.nickname.success = true;
                    state.nickname.btn = false;
                    alert("사용 가능한 닉네임입니다.")
                }
                else if(duplicate.data.message === 'duplicate') {
                    state.nickname.class = "input error";
                    state.nickname.clear = false;
                    state.nickname.btn = false;
                    state.nickname.msg = "이미 존재하는 닉네임입니다";
                }
            }
        }
        catch(e) {
            var error = e.response;
            state.nickname.class = "input error";
            state.nickname.clear = false;
            state.nickname.btn = false;
            state.nickname.msg = "중복 확인이 실패하였습니다. 잠시 후 다시 이용해주세요.";
        }

        this.setState(state);
    }

    handleSubmit = async(evt) => {
        try {
            var state = this.state;
            var params = {
                email: state.email.val,
                password: state.password.val,
                nickname: state.nickname.val,
                age_terms_agreement: state.ageCheck,
                service_terms_agreement: state.serviceAgree,
                privacy_terms_agreement: state.infoAgree,
                notice_terms_agreement: state.eventAgree,
                account_active_terms_agreement: state.activeAgree,
            }

            const res = await API.sendPost(URL.api.auth.signup, params)

            var status = res.status;
            if(status === 201) {
                var token = res.data.token;
                if( token ) {
                    Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'})
                }

                this.props.history.push({
                    pathname: URL.service.accounts.welcome,
                    state: {
                        nickname: state.nickname.val,
                    }
                })
            }
        } catch(e) {
            console.log(e)
        }
    }

    render() {
        var state = this.state;

        return (
            <div className="signup-content">
                <div className="header"> 이메일 </div>
                <div className="email-wrap">
                    <div id="email" className="form-group">
                        <input type="email" name="email" autoComplete="off" className={state.email.class} placeholder="이메일을 입력해주세요." value={state.email.val} onChange={this.handleEmailChange} pattern="[^\s]+"/>
                        <button className="btn" disabled={!state.email.btn} onClick={this.verifyEmail}>
                            {
                                state.email.clear === true ? "인증완료" : "인증하기"
                            }
                        </button>
                        {
                            state.email.msg &&
                            <div className="error-wrap">
                                <span>{state.email.msg}</span>
                            </div>
                        }

                    </div>
                    {
                        state.emailCode.visible &&
                        <div id="email-code" className="form-group">
                            <input type="number" name="email-code" disabled={state.timeout} maxLength="6" autoComplete="off" className={state.emailCode.class} placeholder="인증 번호를 입력해주세요." value={state.emailCode.val} onChange={this.handleEmailCodeChange}/>
                            {
                                state.timeout === true ?
                                <button className="btn">재전송</button>
                                :
                                <button className="btn" disabled={!state.emailCode.btn} onClick={this.verifyEmailCode}>
                                    {
                                        state.emailCode.clear === true ?
                                        "인증완료"
                                        :
                                        "인증하기"
                                    }
                                </button>
                            }
                            {
                                state.timer.active &&
                                <Timer mm={5} ss={0} active={state.timer.active} setTimeout={this.handleChangeTimeout} />
                            }

                            {
                                state.emailCode.msg &&
                                <div className="error-wrap">
                                    <span>{state.emailCode.msg}</span>
                                </div>
                            }
                        </div>
                    }

                </div>

                <div className="header"> 닉네임 </div>
                <div className="nickname-wrap">
                    <div id="nickname" className="form-group">
                        <input type="text" name="nickname" autoComplete="off" className="input" placeholder="닉네임을 입력해주세요." value={state.nickname.val} onChange={this.handleNicknameChange}/>
                        <button className="btn"  disabled={!state.nickname.btn} onClick={this.verifyNickname}>
                            {
                                state.nickname.clear === true ? "확인완료" : "중복확인"
                            }
                        </button>
                        {
                            state.nickname.msg &&
                            <div className="error-wrap">
                                <span>{state.nickname.msg}</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="header"> 비밀번호 </div>
                <div className="password-wrap">
                    <div id="password" className="form-group">
                        <input type="password" name="password" autoComplete="off" className="input" placeholder="비밀 번호를 입력해주세요." value={state.password.val} onChange={this.handlePasswordChange}/>
                        {
                            state.password.msg &&
                            <div className="error-wrap">
                                <span>{state.password.msg}</span>
                            </div>
                        }
                    </div>
                    <div id="password-confirm" className="form-group">
                        <input type="password" name="password-check" autoComplete="off" className="input" placeholder="비밀 번호를 한 번 더 입력해주세요." value={state.passwordCheck.val} onChange={this.handlePasswordCheckChange}/>
                        {
                            state.passwordCheck.msg &&
                            <div className="error-wrap">
                                <span>{state.passwordCheck.msg}</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="header"> 약관동의 </div>
                <div className="terms-wrap">
                    <div className="terms-box">
                        <div className="checkbox-wrap all">
                            <input type="checkbox" id="agree-all" onClick={this.handleCheckAll} checked={state.ageCheck && state.serviceAgree && state.eventAgree && state.infoAgree && state.activeAgree }/>
                            <label htmlFor="agree-all" >
                                <div className="checkbox-text">
                                    모두 동의합니다.
                                </div>
                            </label>
                        </div>

                        <hr/>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-age" onClick={this.handleAgeCheck} checked={state.ageCheck}/>
                            <label htmlFor="agree-age" >
                                <div className="checkbox-text">
                                    만 14세 이상입니다.
                                    <span className="red">(필수)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-service" onClick={this.handleServiceAgree} checked={state.serviceAgree}/>
                            <label htmlFor="agree-service">
                                <div className="checkbox-text">
                                    <Link to={URL.service.terms + 'using'} target="_blank" rel="noopener noreferrer"><u>서비스 이용약관</u></Link>에 동의합니다.
                                    <span className="red">(필수)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-info" onClick={this.handleInfoAgree} checked={state.infoAgree}/>
                            <label htmlFor="agree-info">
                                <div className="checkbox-text">
                                    <Link to={URL.service.terms + 'personal'} target="_blank" rel="noopener noreferrer"><u>개인정보 수집/이용</u></Link>에 동의합니다.
                                    <span className="red">(필수)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-event" onClick={this.handleEventAgree} checked={state.eventAgree}/>
                            <label htmlFor="agree-event">
                                <div className="checkbox-text">
                                    이벤트 할인 혜택 수신에 동의합니다.(선택)
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <input type="checkbox" id="agree-active" onClick={this.handleActiveAgree} checked={state.activeAgree}/>
                            <label htmlFor="agree-active">
                                <div className="checkbox-text">
                                    장기 미접속 시 계정 활성 상태 유지합니다.(선택)
                                </div>
                            </label>
                        </div>
                    </div>
                </div>


                {/*<button className="btn signup-btn" disabled={!(this.state.email.clear && this.state.emailCode.clear && this.state.password.clear && this.state.passwordCheck.clear && this.state.nickname.clear && this.state.ageCheck && this.state.serviceAgree && this.state.infoAgree)} onClick={this.handleSubmit}>*/}
                <button className="btn signup-btn" disabled={!(state.password.clear && state.passwordCheck.clear && state.nickname.clear && state.ageCheck && state.serviceAgree && state.infoAgree && state.emailCode.success && state.email.success && state.nickname.success && state.password.success && state.passwordCheck.success )} onClick={this.handleSubmit}>
                    가입완료!
                </button>

            </div>
        );
    }
}

export default SignupDetail;
