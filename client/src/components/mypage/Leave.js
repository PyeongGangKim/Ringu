import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';

class Leave extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
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

                                <textarea cols={50} rows={3}/>

                                <div className="label-wrap">
                                    <p className="label">이메일 확인</p>
                                </div>

                                <input placeholder="RINGU에 가입하신 이메일을 적어주세요"/>
                            </div>

                            <div className="btn-wrap">
                                <button className="btn btn-outline">
                                    취소
                                </button>
                                <button className="btn btn-color-2">
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
