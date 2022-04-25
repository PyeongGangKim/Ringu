import React, { Component} from 'react';
import { Link } from 'react-router-dom';

import '../../scss/main/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/accounts/pwd.scss'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

const {Kakao} = window;

class ChangePasswordComplete extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        var state = this.state;

        return (
            <div className="page3">
                <div className="content">
                    <div className="id-pwd-wrap">
                        <div className="complete">
                            비밀번호 변경이 <br/>
                            완료되었습니다
                        </div>
                        <Link to={URL.service.accounts.login}>
                            <button className="btn btn-block">
                                    로그인 하러가기
                            </button>
                        </Link>
                    </div>
                </div>

            </div>

        );
    }
}

export default ChangePasswordComplete;
