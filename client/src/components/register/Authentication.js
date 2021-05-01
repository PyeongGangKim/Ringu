import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/author.scss';

class Authentication extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
        this.state = {
            display: this.props.display === 1 ? true : false,
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            display: nextProps.display === 1 ? true : false,
        })
    }

    moveNext = () => {
        var state = this.state;
        state.display = false;
        this.setState(state);
        this.props.moveNext();
    }

    render() {
        let state = this.state

        return (
            <div id="auth-reg-section" className="page3" style={{display: state.display ? "" : "none"}}>
                <div className="title-wrap">
                    <h2 className="title">기본 인증 및 정보</h2>
                </div>

                <hr/>

                <div className="input-area">
                    <div className="input-row">
                        <div className="input-box input-half">
                            <h3 className="header"> 성명 </h3>
                            <input className="textbox"/>
                        </div>

                        <div className="input-box input-half">
                            <h3 className="header"> 주민등록번호 </h3>
                            <input className="textbox"/>
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-box input-half">
                            <h3 className="header"> 수익금 송금 은행 </h3>
                            <input className="textbox"/>
                        </div>

                        <div className="input-box input-half">
                            <h3 className="header"> 계좌번호 </h3>
                            <input className="textbox"/>
                        </div>
                    </div>
                </div>

                <div className="title-wrap">
                    <h2 className="title">약관 동의 및 서명</h2>
                </div>

                <hr/>

                <div className="input-area">
                    <div className="input-box">
                        <h3 className="header"> 서비스 판매시 '세금' 관련 유의사항</h3>
                        <textarea rows="8" disabled type="text"/>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> RINGU 판매 홍보 대행 약관</h3>
                        <textarea rows="8" disabled type="text"/>
                    </div>
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
        )
    }
}

export default Authentication;
