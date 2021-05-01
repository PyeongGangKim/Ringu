import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import SignupSelect from './SignupSelect'
import SignupDetail from './SignupDetail'

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/signup.scss'

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        const signup = this.props.signup;
        const welcome = this.props.welcome;

        return (
            <div id="signup">                
                {
                    welcome ?
                    <div className="signup-box">
                        <div className="welcome-wrap">
                            <div className="welcome-text">
                                {"OO"}님!<br/>
                                회원 가입을 환영합니다.
                            </div>
                            <div className="content-wrap">
                                <button className="btn btn-block btn-transparent btn-full content-btn">나의 관심사</button>
                                <button className="btn btn-block btn-color-1 btn-full content-btn">지금 바로 보러가기</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="signup-box">
                        {
                            signup ?
                                <SignupSelect />
                                :
                                <SignupDetail />
                        }
                    </div>
                }
            </div>

        );
    }
}

export default Signup;
