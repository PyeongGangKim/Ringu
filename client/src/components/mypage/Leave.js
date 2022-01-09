import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Cookies from 'js-cookie';

import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Leave extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            description: '',
            email: '',
        }
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.member.get)

        if (res.status === 200) {
            state.user = res.data.user;
            this.setState(state);
        } else {
            alert("잠시 후 다시 시도하세요.")
        }
    }

    handleDescriptionChange = (evt) => {
        var state = this.state;
        state.description = evt.target.value;
        this.setState(state)
    }

    handleEmailChange = (evt) => {
        var state = this.state;
        state.email = evt.target.value;
        this.setState(state)
    }

    handleSubmit = async() => {
        var state = this.state;
        if (state.description === '') {
            alert("탈퇴 사유를 작성해주세요")
            return;
        }
        if (state.email === '' ) {
            alert("가입하신 이메일을 적어주세요")
            return;
        }

        if (state.email !== state.user.email) {
            alert("이메일이 일치하지 않습니다")
            return;
        }

        const res = await API.sendDelete(URL.api.member.delete)

        if (res.status === 200) {
            alert("회원 탈퇴가 성공적으로 완료되었습니다")
            Cookies.remove('RINGU_JWT');
            Cookies.remove('RINGU_JWT', { path: '/'});
            Cookies.remove('RINGU_JWT', { path: '/detail' });
            window.location = URL.service.home;
        }
        else {
            alert("회원 탈퇴가 완료되지 못했습니다. 잠시 후 다시 시도해주세요")
        }


        this.setState(state)
    }

    render() {
        var state = this.state;

        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">회원 탈퇴</h2>
                </div>

                <hr/>

                <div className="container">
                    <div className="content">
                        <div id="leave-area">
                            <div id="leave-box">
                                <div className="label-wrap">
                                    <p className="label">탈퇴 사유</p>
                                    <p className="sublabel">향후 RINGU의 발전에 적극 반영하기 위해 피드백을 자세히 적어주세요.</p>
                                    <em>* 필수</em>
                                </div>

                                <textarea cols={50} rows={3} value={state.description} onChange={this.handleDescriptionChange}/>

                                <div className="label-wrap">
                                    <p className="label">이메일 확인</p>
                                </div>

                                <input placeholder="RINGU에 가입하신 이메일을 적어주세요" value={state.email} onChange={this.handleEmailChange}/>
                            </div>

                            <div className="btn-wrap">
                                <button className="btn btn-color-2" onClick={this.handleSubmit}>
                                    탈퇴하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Leave;
