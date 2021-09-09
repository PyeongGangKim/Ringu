import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select'

import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import iamport from '../../config/iamport';

import Cookies from 'js-cookie';

class RegisterAuthorDetail extends Component {
    user = User.getInfo();
    constructor(props) {
        super(props)


        if(this.user.type === 1) {
            alert("이미 작가로 등록하였습니다.")
            window.location.href = URL.service.home
        }


        this.state = {
            name: {val: "", msg: "", clear: false, class: "form-control"},
            phone: {val: "", msg: "", clear: false, class: "form-control"},
            bank: {val: "", msg: "", clear: false, class: "form-control"},
            account: {val: "", msg: "", clear: false, class: "form-control"},
            certificated: false,
            accountCertificated: false,
        }
    }

    handleNameChange = (e) => {
        var state = this.state;
        if(/([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i.test(e.target.value)) {
            state.name.class = "form-control error";
            state.name.msg = "한글만 입력해주세요."
        } else {

            state.name.class = "form-control";
            state.name.msg = ""
            state.name.clear = true;
        }

        state.name.val = e.target.value;
        state.name.clear = false;

        this.setState(state)
    }

    handlePhoneChange = (e) => {
        var state = this.state;
        if(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/.test(e.target.value) === false) {
            state.phone.class = "form-control error";
            state.phone.msg = "휴대폰 번호를 입력해주세요."
        } else {

            state.phone.class = "form-control";
            state.phone.msg = ""
            state.phone.clear = true;

        }
        state.phone.val = e.target.value;
        state.phone.clear = false;

        this.setState(state)
    }

    handleBankChange = (e) => {
        var state = this.state;
        state.bank.val = e.target.value;
        state.bank.clear = false;

        this.setState(state)
    }

    handleAccountChange = (e) => {
        var state = this.state;
        state.account.val = e.target.value;
        state.account.clear = false;

        this.setState(state)
    }

    onCertificationClick = async(e) => {
        var state = this.state;
        e.preventDefault();

        if(state.name.msg !== "" || state.name.val === "") {
            state.name.class = "form-control error";
            state.name.msg = "이름을 입력해주세요."
            this.setState(state)
            alert("이름을 올바르게 입력해주세요")
            return;
        }


        if(state.phone.msg !== "" || state.phone.val === "") {
            state.phone.class = "form-control error";
            state.phone.msg = "휴대폰 번호를 입력해주세요."
            this.setState(state)
            alert("휴대폰 번호를 올바르게 입력해주세요")
            return;
        }

        var state = this.state;

        try {
            const { IMP } = window;
            IMP.init(iamport.IMP_CERTIFICATION_CODE)

            IMP.certification({
                merchant_uid: "min_1231231",
                name: state.name.val,
                phone: state.phone.val,
            },
                async(rsp) => {
                    console.log(rsp)
                    if(rsp.success) {
                        //state.certificated = true;
                        var params = {
                            type: 1,
                        }

                        const res = await API.sendPut(URL.api.member.update, params)

                        if(res.status === 200) {
                            // TODO
                            var token = res.data.token;
                            if( token ) {
                                Cookies.remove('RINGU_JWT');
                                Cookies.remove('RINGU_JWT', { path: '/'});
                                Cookies.remove('RINGU_JWT', { path: '/detail' });
                                Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
                            }

                            alert("인증이 완료되었습니다")
                            window.location.href = URL.service.author + User.getInfo().id
                        }

                    }
                    else {
                        console.log('fail')
                    }
            });

        } catch(err) {
            console.log(err)
            alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    }

    handleSubmit = () => {

    }

    render() {
        let state = this.state

        return (
            this.user.type === 0 &&
            <div id="register-author" className="page3">
                <div className="title-wrap">
                    <h2 className="title">기본 인증 및 정보</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="row">
                        <div className="input-box">
                            <h3 className="header"> 이름 </h3>
                            <div className="form-group">
                                <input type="text" className={state.name.class} disabled={state.certificated} onChange={this.handleNameChange}/>
                                {
                                    !!state.name.msg &&
                                    <div className="error-wrap">
                                        <span>{state.name.msg}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 휴대폰 번호 </h3>
                            <div className="form-group">
                                <input type="number" className={state.phone.class} placeholder={"예) 01012345678"} disabled={state.certificated} onChange={this.handlePhoneChange}/>
                                {
                                    !!state.phone.msg &&
                                    <div className="error-wrap">
                                        <span>{state.phone.msg}</span>
                                    </div>
                                }
                            </div>
                            <button className="btn btn-auth" disabled={state.name.certificated} onClick={this.onCertificationClick}>
                                {(state.certificated) ? "인증 완료"  : "본인 인증"}
                            </button>
                        </div>
                    </div>
                    {/*<div className="row">
                        <div className="input-box">
                            <h3 className="header"> 은행 </h3>
                            <div className="form-group">
                                <input type="text" className={state.bank.class} onChange={this.handleBankChange}/>
                            </div>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 계좌번호 </h3>
                            <div className="form-group">
                                <input type="number" className={state.account.class} onChange={this.handleAccountChange}/>
                            </div>
                            <button className="btn btn-auth">
                                계좌 인증
                            </button>
                            {
                                state.account.msg &&
                                <div className="error-wrap">
                                    <span>{state.account.msg}</span>
                                </div>
                            }
                        </div>
                    </div>*/}
                </div>
                {/*<div className="title-wrap">
                    <h2 className="title">약관 동의 및 서명</h2>
                </div>

                <hr/>
                <div className="content">
                </div>
                <div className="btn-wrap">
                    <button/>
                    <button className="btn btn-color btn-color-2" disabled={state.name.clear && state.phone.clear && state.bank.clear && state.account.clear} onClick={this.handleSubmit}> 완료</button>
                </div>*/}
            </div>
        )
    }
}

export default RegisterAuthorDetail;
