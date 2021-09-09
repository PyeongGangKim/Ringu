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
                originalNickname: "",
                nickname: {value:"", isModifying: false, clear: false},
            },
            msg: {

            }
        };
    }

    handleNicknameChange = (evt) => {
        var state = this.state;
        state.data.nickname.value = evt.target.value;
        state.data.nickname.clear = false;
        this.setState(state);
    }

    handleNickNameModifyClick = (evt) => {
        var state = this.state;
        state.data.nickname.isModifying = true;
        this.setState(state);
    }

    handleNickNameModifyComplete = (evt) => {
        var state = this.state;
        if(state.data.nickname.clear === true) {
            state.data.nickname.isModifying = false;
            state.data.nickname.clear = false;

            API.sendPut(URL.api.member.update, {nickname: state.data.nickname.value}).then(res => {
                if(res.status === 200){
                    alert("닉네임이 변경되었습니다.")
                    this.props.handleNicknameChange(state.data.nickname.value)
                } else {
                    alert("닉네임 변경에 실패하였습니다.")
                }
            });
        } else {
            alert("닉네임 중복 여부를 확인해주세요")
        }

        this.setState(state);
    }

    handleNickNameModifyCancel = (evt) => {
        var state = this.state;
        state.data.nickname.isModifying = false;
        state.data.nickname.clear = false;
        state.data.nickname.value = state.data.originalNickname;

        this.setState(state);
    }

    handleNicknameDuplicateCheck = (evt) => {
        var state = this.state;
        var params = {
            nickname: this.state.data.nickname.value,
        }

        API.sendPost(URL.api.member.verify_nickname, params).then(res => {
            if(res.status === 200){
                alert("변경 가능한 닉네임입니다.")
                state.data.nickname.clear = true;
                this.setState(state)
            } else {
                alert("이미  사용 중인 닉네임입니다.")
            }
        });
    }

    componentDidMount() {
        var state = this.state;
        var params = {
            id: User.getInfo().id,
        }

        API.sendGet(URL.api.member.get, params).then(res => {
            if(res.status === 200){
                var user = res.data.user;
                state.data.email = user.email;
                state.data.nickname.value = user.nickname;
                state.data.originalNickname = user.nickname;

                this.setState(state)
            }
        });
    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">나의 정보</h2>
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
                            <h3 className="header">
                                닉네임
                                {
                                    this.state.data.nickname.isModifying === true ?
                                    <div className="sub-wrap">
                                        <button className="modify-btn" onClick={this.handleNickNameModifyComplete}>
                                            <em/>
                                            완료
                                        </button>
                                        <button className="modify-btn" onClick={this.handleNickNameModifyCancel}>
                                            <em/>
                                            취소
                                        </button>
                                    </div>
                                    :
                                    <div className="sub-wrap">
                                        <button className="modify-btn" onClick={this.handleNickNameModifyClick}>
                                            <em/>
                                            수정
                                        </button>
                                    </div>
                                }

                            </h3>

                            <input className="textbox" type="text" name="nickname" disabled={this.state.data.nickname.isModifying === false} autoComplete="off" value={this.state.data.nickname.value} onChange={this.handleNicknameChange}/>
                            {
                                (this.state.data.nickname.isModifying === true) &&
                                (
                                    this.state.data.nickname.clear === false ?
                                    <button className="btn sub" onClick={this.handleNicknameDuplicateCheck}>
                                        중복 확인
                                    </button>
                                    :
                                    <button className="btn sub" disabled>
                                        확인 완료
                                    </button>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default MyInfo;
