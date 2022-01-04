import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/signup.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class SignupDetailSNS extends Component {
    constructor(props) {
        super(props);

        var search = props.location.search;
        search = search.substring(1, search.length);

        var query = search.split("&").map(function(el) {
            return el.trim()
        }).map(function(el) {
            return el.split('=')
        }).reduce(function(res, pair) {
            res[pair[0].trim()] = pair[1].trim();
            return res
        }, {});

        this.state = {
            email: query.email,
            id: query.id,
            sns: query.sns,
            nickname: {val: "", msg: "", clear: false, class: "input", visible: false},
            checkAll: false,
            ageCheck: false,
            serviceAgree: false,
            infoAgree: false,
            eventAgree: false,
            activeAgree: false,
        };


    }

    componentDidMount() {

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
                    state.nickname.btn = false;
                    alert("사용 가능한 닉네임입니다.")
                    this.setState(state);
                }
                else if(duplicate.data.message === 'duplicate') {
                    state.nickname.class = "input error";
                    state.nickname.clear = false;
                    state.nickname.btn = false;
                    state.nickname.msg = "이미 존재하는 닉네임입니다";
                    this.setState(state);
                }
            }
        } catch(e) {
            var error = e.response;
            state.nickname.class = "input error";
            state.nickname.clear = false;
            state.nickname.btn = false;
            state.nickname.msg = "중복확인에 실패하였습니다. 잠시 후 다시 시도해주세요.";
            this.setState(state)
        }
    }

    handleSubmit = evt => {
        var state = this.state;
        var params = {
            email: state.email,
            nickname: state.nickname.val,
            sns: state.sns,
            id: state.id,
            age_terms_agreement: state.ageCheck,
            service_terms_agreement: state.serviceAgree,
            privacy_terms_agreement: state.infoAgree,
            notice_terms_agreement: state.eventAgree,
            account_active_terms_agreement: state.activeAgree,
        }

        API.sendPost(URL.api.auth.sns.signup, params).then(res => {
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
        })
    }

    render() {
        return (
            <div className="signup-content">
                <div className="header"> 이메일 </div>
                <div className="email-wrap">
                    <div id="email" className="form-group">
                        <input type="email" name="email" autoComplete="off" value={this.state.email} className="input" disabled/>

                    </div>
                </div>

                <div className="header"> 닉네임 </div>
                <div className="nickname-wrap">
                    <div id="nickname" className="form-group">
                        <input type="text" name="nickname" autoComplete="off" className="input" placeholder="닉네임을 입력해주세요." value={this.state.nickname.val} onChange={this.handleNicknameChange}/>
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


                <button className="btn signup-btn" disabled={!(this.state.nickname.clear && this.state.ageCheck && this.state.serviceAgree && this.state.infoAgree)} onClick={this.handleSubmit}>
                    가입완료!
                </button>

            </div>
        );
    }
}

export default SignupDetailSNS;
