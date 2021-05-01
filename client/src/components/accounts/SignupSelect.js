import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import helper_url from '../../helper/helper_url';
import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/signup.scss'

class SignupSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {

        return (
            <div className="signup-content">
                <div className="signup-text">
                    빠르고 쉽게 <br/>
                    링구에 가입하세요!
                </div>

                <div className="sns-wrap">
                    <div className="sns-btn">
                        <a href="">
                            <div id="sns-naver" className="sns-content">
                                <img src="/naver.png"/>
                                <span className="sns-text"> 네이버 간편 가입하기 </span>
                            </div>
                        </a>
                    </div>
                    <div className="sns-btn">
                        <a href="">
                            <div id="sns-kakao" className="sns-content">
                                <img src="/kakao.jpg"/>
                                <span className="sns-text"> 카카오 간편 가입하기 </span>
                            </div>
                        </a>
                    </div>
                    <div className="sns-btn">
                        <a href="">
                            <div id="sns-facebook" className="sns-content">
                                <img src="/facebook.jpg"/>
                                <span className="sns-text"> 페이스북 간편 가입하기 </span>
                            </div>
                        </a>
                    </div>
                    <div className="sns-btn">
                        <a href="">
                            <div id="sns-google" className="sns-content">
                                <img src="/google.png"/>
                                <span className="sns-text"> 구글 간편 가입하기 </span>
                            </div>
                        </a>
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
