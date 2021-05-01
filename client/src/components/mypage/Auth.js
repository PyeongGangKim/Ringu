import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';

class Auth extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <span>인증 정보</span>
                </div>

                <hr/>

                <div className="content" style={{width:"400px", margin:"50px auto"}}>
                    <h1 style={{textAlign:"center"}}>휴대폰 본인 인증</h1>
                    <h3 style={{textAlign:"center"}}>진행을 위해 본인 인증이 필요합니다.</h3>

                    <div style={{textAlign:"center"}}>
                        <img src='' style={{width:"250px", height:"250px", margin:"30px auto"}}/>
                    </div>

                    <div style={{margin:"30px auto"}}>
                        <img style={{width:"30px", height:"30px", verticalAlign:"middle", marginRight: "15px"}}/>
                        <span>이용 약관</span>
                        및
                        <span>개인 정보 처리 방침</span>
                        에 동의합니다.
                    </div>

                    <div>
                        <img style={{width:"30px", height:"30px", verticalAlign:"middle", marginRight: "15px"}}/>
                        만 14세 이상입니다.
                    </div>

                    <div className="btn btn-block btn-color-2" style={{marginTop: "100px", padding: "10px 15px", width: "100%", fontSize:"20px"}}>
                        인증하기
                    </div>

                </div>



            </div>
        )
    }
}

export default Auth;
