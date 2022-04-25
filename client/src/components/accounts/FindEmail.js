import React, { Component} from 'react';

import '../../scss/main/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/pwd.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class FindEmail extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            
        };
    }

    componentDidMount() {

    }

    handleEmailChange = (evt) => {
        var state = JSON.parse(JSON.stringify(this.state));

        state.email.val = evt.target.value.trim();
        state.email.clear = false;

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

    findEmail = async(e) => {
        e.preventDefault();
        e.returnValue = false;
        
        var email = this.ref.current.value;

        if(email === '') {
            alert("이메일을 입력해주세요.")
            return
        }

        const params = {
            "email" : email
        }

        

        try {
            const res = await API.sendPost(URL.api.auth.email.change_pwd, params)
            if(res.status === 200) {
                var msg = res.data.message
                if(msg === 'not found') {
                    alert("해당 이메일은 가입되어 있지 않습니다.")
                    return;
                }

                if(msg === 'naver') {
                    alert("이미 네이버로 가입된 계정입니다.")
                    return;
                }

                if(msg === 'kakao') {
                    alert("이미 카카오로 가입된 계정입니다.")
                    return;
                }

                if(msg === 'google') {
                    alert("이미 구글로 가입된 계정입니다.")
                    return;
                }
            } else if(res.status === 201) {
                alert("입력하신 이메일 주소로 메일을 전송하였습니다.")
                return;
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
                    <h2 className="title">비밀번호 찾기</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="id-pwd-wrap">

                        <form onSubmit={this.findEmail}>
                            <div id="email-form" className="form-group">
                                <div className="header">가입한 이메일 주소를 입력해주세요</div>
                                <input type="email" name="email" autoComplete="off" className="input" placeholder="example@ringu.com" pattern="[^\s]+" ref={this.ref}/>

                                <div className="info">
                                    가입하신 이메일 주소를 입력해주시면 <br/>
                                    새로운 비밀번호를 설정 가능한 링크를 보내드립니다.
                                </div>
                            </div>

                            <button className="btn btn-block">
                                이메일 전송하기
                            </button>
                        </form>
                    </div>
                </div>

            </div>

        );
    }
}

export default FindEmail;
