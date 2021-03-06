import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Timer from '../common/Timer';
import Cookies from 'js-cookie';

import '../../scss/main/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/signup.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

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
            passwordType1: {
                type: 'password',
                visible: false
            },
            passwordType2: {
                type: 'password',
                visible: false
            }
        };
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

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(evt.target.value)) {  // Regex?????? ????????? ?????? ????????? ??????
            state.email.btn = true;
            state.email.class = "input";
            state.email.msg = "";
        } else {
            state.email.btn = false;
            state.email.clear = false;
            state.email.class = "input error";
            state.email.msg = "????????? ????????? ???????????? ????????????.";
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
            alert("???????????? ?????????????????????. ?????? ??? ?????? ??????????????????")
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
                    state.email.msg = "?????? ???????????? ?????? ??????????????????";
                    this.setState(state);
                }
            }
        } catch(e) {
            var error = e.response
            state.email.class = "input error";
            state.email.clear = false;
            state.email.btn = false;
            state.email.msg = "?????? ?????? ????????? ?????????????????????. ????????? ?????? ??????????????????.";

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
            state.emailCode.msg = "?????? ????????? 6???????????????.";
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

        if (passRule.test(evt.target.value)) {  // Regex?????? ???????????? ?????? ????????? ??????
            state.password.class = "input";
            state.password.msg = "";
            state.password.success = true;
        } else {
            state.password.clear = false;
            state.password.class = "input error";
            state.password.msg = "??????????????? 8??? ????????? ??????/??????/?????? ?????? ???????????? ??????????????? ?????????.";
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
            state.passwordCheck.msg = "??????????????? ???????????? ????????????"
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
            state.emailCode.msg = "????????? ?????????????????????.";
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
                    alert("?????? ????????? ??????????????????.")
                    this.setState(state);
                }
                else if(duplicate.data.message === 'duplicate') {
                    state.nickname.class = "input error";
                    state.nickname.clear = false;
                    state.nickname.btn = false;
                    state.nickname.msg = "?????? ???????????? ??????????????????";
                    this.setState(state);
                }
            }
        }
        catch(e) {
            var error = e.response;
            state.nickname.class = "input error";
            state.nickname.clear = false;
            state.nickname.btn = false;
            state.nickname.msg = "?????? ????????? ?????????????????????. ?????? ??? ?????? ??????????????????.";
            this.setState(state);
        }
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

    handlePasswordType1 = () => {
        var state = this.state;        

        if(!state.passwordType1.visible) {
            state.passwordType1.type = 'text'
            state.passwordType1.visible = true
        } else {
            state.passwordType1.type = 'password'
            state.passwordType1.visible = false
        }

        this.setState(state)
    }

    handlePasswordType2 = () => {
        var state = this.state;        

        if(!state.passwordType2.visible) {
            state.passwordType2.type = 'text'
            state.passwordType2.visible = true
        } else {
            state.passwordType2.type = 'password'
            state.passwordType2.visible = false
        }

        this.setState(state)
    }

    render() {
        var state = this.state;

        return (
            <div className="signup-content">
                <div className="header"> ????????? </div>
                <div className="email-wrap">
                    <div id="email" className="form-group">
                        <input type="email" name="email" autoComplete="off" className={state.email.class} placeholder="???????????? ??????????????????." value={state.email.val} onChange={this.handleEmailChange} pattern="[^\s]+"/>
                        <button className="btn" disabled={!state.email.btn} onClick={this.verifyEmail}>
                            {
                                state.email.clear === true ? "????????????" : "????????????"
                            }
                        </button>
                        {
                            state.email.msg &&
                            <div className="info info-error">
                                <span>{state.email.msg}</span>
                            </div>
                        }

                    </div>
                    {
                        state.emailCode.visible &&
                        <div id="email-code" className="form-group">
                            <input type="number" name="email-code" disabled={state.timeout} maxLength="6" autoComplete="off" className={state.emailCode.class} placeholder="?????? ????????? ??????????????????." value={state.emailCode.val} onChange={this.handleEmailCodeChange}/>
                            {
                                state.timeout === true ?
                                <button className="btn">?????????</button>
                                :
                                <button className="btn" disabled={!state.emailCode.btn} onClick={this.verifyEmailCode}>
                                    {
                                        state.emailCode.clear === true ?
                                        "????????????"
                                        :
                                        "????????????"
                                    }
                                </button>
                            }
                            {
                                state.timer.active &&
                                <Timer mm={5} ss={0} active={state.timer.active} setTimeout={this.handleChangeTimeout} />
                            }

                            {
                                state.emailCode.msg &&
                                <div className="info info-error">
                                    <span>{state.emailCode.msg}</span>
                                </div>
                            }
                        </div>
                    }

                </div>

                <div className="header"> ????????? </div>
                <div className="nickname-wrap">
                    <div id="nickname" className="form-group">
                        <input type="text" name="nickname" autoComplete="off" className="input" placeholder="???????????? ??????????????????." value={state.nickname.val} onChange={this.handleNicknameChange}/>
                        <button className="btn"  disabled={!state.nickname.btn} onClick={this.verifyNickname}>
                            {
                                state.nickname.clear === true ? "????????????" : "????????????"
                            }
                        </button>
                        {
                            state.nickname.msg &&
                            <div className="info info-error">
                                <span>{state.nickname.msg}</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="header"> ???????????? </div>
                <div className="password-wrap">
                    <div id="password" className="form-group">
                        <input type={state.passwordType1.type} name="password" autoComplete="off" className="input" placeholder="?????? ????????? ??????????????????." value={state.password.val} onChange={this.handlePasswordChange}/>
                        {
                            state.password.msg &&
                            <div className="info info-error">
                                <span>{state.password.msg}</span>
                            </div>
                        }
                        <em className={state.passwordType1.visible ? "eye-off" : "eye"} onClick={this.handlePasswordType1}/>
                    </div>
                    <div id="password-confirm" className="form-group">
                        <input type={state.passwordType2.type} name="password-check" autoComplete="off" className="input" placeholder="?????? ????????? ??? ??? ??? ??????????????????." value={state.passwordCheck.val} onChange={this.handlePasswordCheckChange}/>
                        {
                            state.passwordCheck.msg &&
                            <div className="info info-error">
                                <span>{state.passwordCheck.msg}</span>
                            </div>
                        }
                        <em className={state.passwordType2.visible ? "eye-off" : "eye"} onClick={this.handlePasswordType2}/>
                    </div>
                </div>

                <div className="header"> ???????????? </div>
                <div className="terms-wrap">
                    <div className="terms-box">
                        <div className="checkbox-wrap all">
                            <label htmlFor="agree-all" className="cb-container" >
                                <input type="checkbox" id="agree-all" onClick={this.handleCheckAll} checked={state.ageCheck && state.serviceAgree && state.eventAgree && state.infoAgree && state.activeAgree }/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    ?????? ???????????????.
                                </div>
                            </label>
                        </div>

                        <hr/>

                        <div className="checkbox-wrap">
                            <label htmlFor="agree-age" className="cb-container">
                                <input type="checkbox" id="agree-age" onClick={this.handleAgeCheck} checked={state.ageCheck}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    ??? 14??? ???????????????.
                                    <span className="red">(??????)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <label htmlFor="agree-service" className="cb-container" >
                                <input type="checkbox" id="agree-service" onClick={this.handleServiceAgree} checked={state.serviceAgree}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    <Link to={URL.service.terms + 'using'} target="_blank" rel="noopener noreferrer"><u>????????? ????????????</u></Link>??? ???????????????.
                                    <span className="red">(??????)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <label htmlFor="agree-info" className="cb-container" >
                                <input type="checkbox" id="agree-info" onClick={this.handleInfoAgree} checked={state.infoAgree}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    <Link to={URL.service.terms + 'personal'} target="_blank" rel="noopener noreferrer"><u>???????????? ??????/??????</u></Link>??? ???????????????.
                                    <span className="red">(??????)</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <label htmlFor="agree-event" className="cb-container">
                                <input type="checkbox" id="agree-event" onClick={this.handleEventAgree} checked={state.eventAgree}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    ????????? ?????? ?????? ????????? ???????????????.(??????)
                                </div>
                            </label>
                        </div>

                        <div className="checkbox-wrap">
                            <label htmlFor="agree-active" className="cb-container" >
                                <input type="checkbox" id="agree-active" onClick={this.handleActiveAgree} checked={state.activeAgree}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    ?????? ????????? ??? ?????? ?????? ?????? ???????????????.(??????)
                                </div>
                            </label>
                        </div>
                    </div>
                </div>


                {/*<button className="btn signup-btn" disabled={!(this.state.email.clear && this.state.emailCode.clear && this.state.password.clear && this.state.passwordCheck.clear && this.state.nickname.clear && this.state.ageCheck && this.state.serviceAgree && this.state.infoAgree)} onClick={this.handleSubmit}>*/}
                <button className="btn signup-btn" disabled={!(state.password.clear && state.passwordCheck.clear && state.nickname.clear && state.ageCheck && state.serviceAgree && state.infoAgree && state.emailCode.success && state.email.success && state.nickname.success && state.password.success && state.passwordCheck.success )} onClick={this.handleSubmit}>
                    ????????????!
                </button>

            </div>
        );
    }
}

export default withRouter(SignupDetail);
