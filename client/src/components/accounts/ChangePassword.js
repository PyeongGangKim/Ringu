import React, { Component} from 'react';
import { withRouter } from 'react-router-dom';

import '../../scss/main/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/pwd.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

const {Kakao} = window;

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.ref2 = React.createRef();

        this.state = {
            password1: false,
            password2: false,
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

    handlePasswordChange = (evt) => {
        var state = this.state;
        state.password = false;
        state.password2 = false;
        this.setState(state);
    }

    handlePassword2Change = (evt) => {
        var state = this.state;
        state.password2 = false;
        this.setState(state);
    }

    changePassword = async(e) => {
        var state = this.state;
        var passRule = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        e.preventDefault();
        e.returnValue = false;
        
        var password = this.ref.current.value;
        var password2 = this.ref2.current.value;

        if(password === '') {
            alert("변경할 비밀번호를 입력해주세요")
            state.password = true;
            this.setState(state);
            return;
        }

        if(password2 === '') {
            alert("비밀번호를 한 번 더 입력해주세요")
            state.password2 = true;
            this.setState(state);
            return;
        }
        
        if(!passRule.test(password)) {
            alert("비밀번호 조건을 확인해주세요")
            state.password = true;
            this.setState(state);
            return;
        }

        if(password != password2) {
            alert("비밀번호가 일치하지 않습니다.")
            state.password2 = true;
            this.setState(state);
            return;
        }

        try {
            var params = {
                password: password,
                token: this.props.token
            }

            const res = await API.sendPut(URL.api.auth.reset_password, params)
            if(res.status == 200) {
                window.location.href = URL.service.accounts.change_pwd_complete;
            }
        } catch(e) {
            alert("에러가 발생하였습니다. 잠시 후에 다시 시도해주세요.")
        }        
    }

    render() {
        var state = this.state;

        return (
            <div className="page3">
                <div className="title-wrap">
                    <h2 className="title">비밀번호 재설정</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="id-pwd-wrap">
                        <form onSubmit={this.changePassword}>
                            <div id="password-form" className="form-group">
                                <div className="header">새로운 비밀번호</div>
                                <input type={state.passwordType1.type} 
                                    name="password" 
                                    autoComplete="off" 
                                    className={state.password ? "input error" : "input"} 
                                    ref={this.ref} 
                                    onChange={this.handlePasswordChange}/>
                                <em className={state.passwordType1.visible ? "eye-off" : "eye"} onClick={this.handlePasswordType1}/>
                                {
                                    state.password &&
                                    <div className="info info-error">
                                        <span>특수문자, 영어, 숫자 포함 8글자 이상</span>
                                    </div>
                                }
                            </div>

                            <div id="password2-form" className="form-group">
                                <div className="header">새로운 비밀번호 확인</div>
                                <input type={state.passwordType2.type}
                                    name="password2" 
                                    autoComplete="off" 
                                    className={state.password2 ? "input error" : "input"} 
                                    ref={this.ref2} 
                                    onChange={this.handlePassword2Change}/> 
                                <em className={state.passwordType2.visible ? "eye-off" : "eye"} onClick={this.handlePasswordType2}/>
                                {
                                    state.password2 &&
                                    <div className="info info-error">
                                        <span>비밀번호가 일치하지 않습니다</span>
                                    </div>
                                }
                            </div>

                            <button className="btn btn-block">
                                비밀번호 변경
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ChangePassword);
