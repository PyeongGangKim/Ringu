import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import helper_url from '../../helper/helper_url';
import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/signup.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import NAVER from '../../config/naver_auth';
import KAKAO from '../../config/kakao_auth';
import FACEBOOK from '../../config/facebook_auth';
import GOOGLE from '../../config/google_auth';

const {Kakao} = window;

class SignupSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location : props.location,
            history : props.history
        };
    }

    inPreparation = () => {
        alert("준비 중입니다.")
    }

    componentDidMount() {
        this.initializeNaverLogin();
        //this.googleSDK();
    }
    
    initializeNaverLogin =  () => {
        var naver_id_login = new window.naver_id_login(NAVER.CLIENT_ID, NAVER.BASE_URL + NAVER.CALLBACK_URL);
        var state = naver_id_login.getUniqState();
        naver_id_login.setButton("green", 1, 65);
        naver_id_login.setDomain(NAVER.BASE_URL);
        naver_id_login.setState(state);
        naver_id_login.init_naver_id_login();
    }

    handleKaKaoLogin = () => {
        Kakao.Auth.authorize({
            redirectUri: KAKAO.CALLBACK_URL,
        })
    }
    /*googleSDK = () =>{
        
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: GOOGLE.CLIENT_ID,
                scope: 'email'
            });
        });
    }
    
        /*(function(d,s,id){
            let js, fjs = d.getElementsByTagName(s)[0];
            if(d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js,fjs);
        }(document, 'script', 'google-jssdk'))
    }*/

    handleGoogleLogin = async () => {
        let gauth = window.gapi.auth2.getAuthInstance();
        console.log(window.gapi);
        console.log(gauth);
        // console.log(gauth.currentUser.get());
        gauth.signIn({
            scope: "profile",
            ux_mode : "redirect",
            redirect_uri: GOOGLE.CALLBACK_URL,
        });
        
    }
    
    

    handleNaverLogin = () => {
        if (
            document &&
            document.querySelector("#naver_id_login").firstChild &&
            window !== undefined
        ) {
            const loginBtn = document.getElementById("naver_id_login").firstChild;
            loginBtn.click();
        }
    }

    render() {

        return (
            <div className="signup-content">
                <div className="signup-text">
                    빠르고 쉽게 <br/>
                    링구에 가입하세요!
                </div>

                <div className="sns-wrap">
                    <div className="sns">
                        <div className="sns-btn" onClick={this.handleNaverLogin}>
                            <div id="naver_id_login" style={{"display": "none"}}/>
                            <div id="sns-naver" className="sns-content">
                                <em/>
                                <span className="sns-text"> 네이버 간편 가입하기 </span>
                            </div>
                        </div>

                    </div>
                    <div className="sns">
                        <div id="kakao-login" className="sns-btn" onClick={this.handleKaKaoLogin}>
                            <div id="sns-kakao" className="sns-content">
                                <em/>
                                <span className="sns-text"> 카카오 간편 가입하기 </span>
                            </div>
                        </div>
                    </div>
                    <div className="sns">
                        <div className="sns-btn">
                            <div id="sns-facebook" className="sns-content" onClick={this.inPreparation}>
                                <em/>
                                <span className="sns-text"> 페이스북 간편 가입하기 </span>
                            </div>
                        </div>
                    </div>
                    <div className="sns">
                        <div className="sns-btn">
                            <div id="sns-google" className="sns-content" onClick={this.handleGoogleLogin}>
                                <img src="/google.png"/>
                                <span className="sns-text"> 구글 간편 가입하기 </span>
                            </div>
                        </div>
                    </div>

                </div>
                {/*sns-wrap*/}

                <hr/>

                <a href={helper_url.service.accounts.signup_step} className="btn signup-btn">
                    이메일로 가입하기
                </a>
            </div>
        );
    }
}

export default SignupSelect;
