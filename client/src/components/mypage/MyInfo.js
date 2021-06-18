import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import User from '../../utils/user';
import '../../scss/mypage/mypage.scss';
import '../../scss/common/button.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class MyInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ui: {

            },
            data: {
                email:"",
                nickname: "",
            },
            msg: {

            }
        };
    }

    componentDidMount() {
        var state = this.state;

        API.sendGet(URL.api.member.get).then(res => {
            if(res.status === 200){
                var user = res.data.user;
                state.data.email = user.email;
                state.data.nickname = user.nickname;

                this.setState(state)
            }

        });
    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">나의 정보</h2>
                    <button className="modify-btn">
                        <em/>
                        수정
                    </button>
                </div>

                <hr/>

                <div className="container">
                    <h2 className="subtitle"> 계정 정보</h2>

                    <div className="content">
                        <div className="input-box">
                            <h3 className="header"> 이메일 </h3>
                            <input className="textbox" type="email" name="email" autoComplete="off" value={this.state.data.email} disabled/>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 닉네임 </h3>
                            <input className="textbox" type="text" name="nickname" autoComplete="off" value={this.state.data.nickname}/>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default MyInfo;
