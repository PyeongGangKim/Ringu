import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';


import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/login.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import FACEBOOK from '../../config/facebook_auth';


var url = require('../../config/url')[process.env.REACT_APP_ENV];
var NAVER = require('../../config/naver_auth')[process.env.REACT_APP_ENV];
var KAKAO = require('../../config/kakao_auth')[process.env.REACT_APP_ENV];
let GOOGLE = require('../../config/google_auth')[process.env.REACT_APP_ENV];

const {Kakao} = window;

class Login extends Component {
    constructor(props) {
        super(props);
        Kakao.init(KAKAO.JAVASCRIPT_KEY)

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
        this.initializeNaverLogin();
    }

    initializeNaverLogin = () => {
        var naver_id_login = new window.naver_id_login(NAVER.CLIENT_ID, url.BASE_URL + NAVER.CALLBACK_URL);
        var state = naver_id_login.getUniqState();

        naver_id_login.setButton("green", 1, 65);
        naver_id_login.setDomain(url.BASE_URL);
        naver_id_login.setState(state);
        naver_id_login.init_naver_id_login();
    }

    handleKaKaoLogin = () => {
        Kakao.Auth.authorize({
            redirectUri: url.BASE_URL + KAKAO.CALLBACK_URL,
        })
    }
    handleGoogleLogin = async () => {
        await window.gapi.load('auth2', async () => {
            await window.gapi.auth2.init({
                client_id: GOOGLE.CLIENT_ID,
                scope: 'email'
            });
            let gauth = window.gapi.auth2.getAuthInstance();

        // console.log(gauth.currentUser.get());
            gauth.signIn({
                scope: "profile",
                ux_mode : "redirect",
                redirect_uri: GOOGLE.BASE_URL + GOOGLE.CALLBACK_URL,
            });
        });
    }

    handleLogin = (event) => {
        event.preventDefault();
        event.returnValue = false;

        var email = ReactDOM.findDOMNode(this.refs.email).value;
        var password = ReactDOM.findDOMNode(this.refs.password).value;
        const params = {
            "email": email,
            "password": password
        }

        API.sendPost(URL.api.auth.login, params).then(res => {
            var status = res.status;
            if(status === 200) {
                var token = res.data.token;
                if( token ) {
                    Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
                }
                window.location.href = URL.service.home;
            } else if (status === 400){
                alert(res.data.message);
            } else {
                alert('회원정보가 일치하지 않습니다.');
            }
        })
    }

    handleFacebook = (response) => {

    }

    inPreparation = () => {
        alert("준비 중입니다.")
    }

    render() {

        return (
            <div className="page3">
                <div id="login-area">
                    <div className="login-wrap">
                        <form onSubmit={this.handleLogin}>
                            <div id="email-form" className="form-group">
                                <input type="email" name="email" autoComplete="off" className="input" ref="email" placeholder="이메일을 입력해주세요."/>
                            </div>

                            <div id="password-form" className="form-group">
                                <input type="password" name="password" autoComplete="off" className="input" ref="password" placeholder="비밀번호를 입력해주세요."/>
                            </div>

                            <button className="btn btn-block btn-login">
                                로그인
                            </button>
                        </form>

                        <div className="login-settings">
                            <div className="checkbox-wrap">
                                <input type="checkbox" id="remember"/>
                                <label htmlFor="remember">
                                    <span className="checkbox-text">
                                        로그인 상태 유지
                                    </span>
                                </label>
                            </div>

                            <a>
                                아이디/비밀번호 찾기
                            </a>
                        </div>
                        {/* login-settings */}

                        <div className="sns-wrap">
                            <p className="sns-text">SNS계정으로 간단히 로그인하세요.</p>
                            <div className="sns-login-btn-wrap">
                                <div id="naver_id_login" className="btn-sns"/>
                                <div id="kakao-login" className="btn-sns" onClick={this.handleKaKaoLogin}>
                                    <em/>
                                </div>
                                {/*<FacebookLogin
                                    appId={FACEBOOK.APP_ID}
                                    autoLoad={false}
                                    fields="email"
                                    disableMobileRedirect={true}
                                    redirectUri={"/signup/facebook/callback"}
                                    render={(renderProps) => (
                                        <div id="facebook-login" className="btn-sns" onClick={renderProps.onClick}>
                                            <em/>
                                        </div>
                                    )}
                                />*/}

                                <div id="facebook-login" className="btn-sns" onClick={this.inPreparation}>
                                    <em/>
                                </div>

                                <div id="google-login" className="btn-sns"  onClick={this.handleGoogleLogin}>
                                    <em/>
                                </div>
                            </div>
                        </div>
                        {/* sns-wrap */}

                        <Link to={URL.service.accounts.signup}>
                            <button className="btn btn-signup">
                                회원가입하기
                            </button>
                        </Link>
                    </div>
                    {/* login-wrap */}

                    <div className="login-bg-wrap">
                        <em/>
                    </div>
                    {/* login-bg-wrap */}

                </div>
                {/* login-area */}



            </div>

        );
    }
}

export default Login;
