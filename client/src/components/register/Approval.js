import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';

class Approval extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
        this.state = {
            display: this.props.display === 0 ? true : false,
        }

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
            <div className="page3" style={{display: state.display ? "" : "none"}}>
                <div className="title-wrap">
                    <h2 className="title">작가 등록</h2>
                </div>

                <hr/>

                <div className="container">
                    <div id="approval-box">
                        <h3>휴대폰 본인 인증</h3>
                        <p style={{marginBottom: "80px"}}>진행을 위해 본인 인증이 필요합니다.</p>

                        <div className="check-area">
                            <img src="" className="checkbox"/>
                            <p>
                                <span className="color-1">이용 약관</span> &nbsp;및 &nbsp;
                                <span className="color-1">개인 정보 처리 방침</span>에 동의합니다.
                            </p>
                        </div>

                        <div className="check-area">
                            <img src="" className="checkbox"/>
                            만 14세 이상입니다.
                        </div>

                        <div className="btn btn-block btn-color-2" onClick={this.moveNext} style={{marginTop: "100px", padding: "10px 15px", width: "100%", fontSize:"20px"}}>
                            인증하기
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Approval;
