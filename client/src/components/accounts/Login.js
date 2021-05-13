import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/login.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Login extends Component {
    constructor(props) {
        super(props);

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
            var status = res.data.status;
            if(status === "ok") {
                var token = res.data.token;
                if( token ) Cookies.set('token', token, {expires: 7, path: '/'});
                window.location.href = "/home";
            } else {
                alert('회원정보가 일치하지 않습니다.');
            }
        })
    }

    render() {

        return (
            <div className="page3">
                <div className="title-wrap">
                    <h2 className="title">로그인</h2>
                </div>

                <div id="login-area">
                    <div className="login-wrap">
                        <div id="email-form" className="form-group">
                            <input type="email" name="email" autoComplete="off" className="form-control" ref="email" placeholder="이메일을 입력해주세요."/>
                        </div>

                        <div id="password-form" className="form-group">
                            <input type="password" name="password" autoComplete="off" className="form-control" ref="password" placeholder="비밀번호를 입력해주세요."/>
                        </div>

                        <button className="btn btn-block btn-login" onClick={this.handleLogin}>
                            로그인
                        </button>

                        <div className="login-settings">
                            <div className="checkbox-wrap">
                                <input type="checkbox" id="remember"/>
                                <label htmlFor="remember">
                                    <div className="checkbox-text">
                                        로그인 상태 유지
                                    </div>
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
                                <a href="" id="naver-login" className="btn-sns">
                                    <img src="/naver.png"/>
                                </a>
                                <a href="" id="kakao-login" className="btn-sns">
                                    <img src="/kakao.jpg"/>
                                </a>
                                <a href="" id="facebook-login" className="btn-sns">
                                    <img src="/facebook.jpg"/>
                                </a>
                                <a href="" id="google-login" className="btn-sns">
                                    <img src="/google.png"/>
                                </a>
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
                        <img src="/login-img.png"/>
                    </div>
                    {/* login-bg-wrap */}

                </div>
                {/* login-area */}



            </div>

        );
    }
}

export default Login;
