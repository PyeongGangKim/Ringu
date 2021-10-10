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
            name: {val: "", msg: "", clear: false, class: "input"},
            phone: {val: "", msg: "", clear: false, class: "input"},
            bank: {val: "", msg: "", clear: false, class: "input"},
            account: {val: "", msg: "", clear: false, class: "input"},
            tax_term: "",
            promotion_term: "",
            certificated: false,
            accountCertificated: false,
            agree: false,
            sign: false,
        }
    }

    handleAgree = evt => {
        var state = this.state;
        state.agree = evt.target.checked;

        this.setState(state);
    }

    handleSign = evt => {
        var state = this.state;
        state.sign = evt.target.checked;

        this.setState(state);
    }

    handleNameChange = (e) => {
        var state = this.state;
        state.name.class = "input";
        state.name.msg = ""
        state.name.clear = true;
        state.name.val = e.target.value;


        this.setState(state)
    }

    handlePhoneChange = (e) => {
        var state = this.state;
        if(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/.test(e.target.value) === false) {
            state.phone.class = "input error";
            state.phone.msg = "휴대폰 번호를 입력해주세요."
            state.phone.clear = false;
        } else {
            state.phone.class = "input";
            state.phone.msg = ""
            state.phone.clear = true;
        }

        state.phone.val = e.target.value;

        this.setState(state)
    }

    handleBankChange = (e) => {
        var state = this.state;
        if(/^[a-zA-Z가-힣]*$/.test(e.target.value) === true || e.target.value === "") {
            state.bank.msg = ""
            state.bank.clear = true;
            state.bank.class = "input";
        } else {
            state.bank.class = "input error";
            state.bank.msg = "은행명을 올바르게 입력해주세요"
            state.bank.clear = false;
        }
        state.bank.val = e.target.value;

        this.setState(state)
    }

    handleAccountChange = (e) => {
        var state = this.state;

        if(/^[0-9]*$/.test(e.target.value) === true || e.target.value === "") {
            state.account.msg = ""
            state.account.clear = true;
            state.account.class = "input";
        } else {
            state.account.class = "input error";
            state.account.msg = "숫자만 입력해주세요"
            state.account.clear = false;
        }

        state.account.val = e.target.value;

        this.setState(state)
    }

    onCertificationClick = async(e) => {
        var state = this.state;
        e.preventDefault();

        if(/^[가-힣]*$/.test(state.name.val) === false) {
            state.name.class = "input error";
            state.name.msg = "이름을 올바르게 입력해주세요."
            this.setState(state)
            alert("이름을 올바르게 입력해주세요")
            return;
        }

        if(state.phone.msg !== "" || state.phone.val === "") {
            state.phone.class = "input error";
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
                    if(rsp.success) {
                        state.certificated = true;
                        this.setState(state)

                        alert("인증이 완료되었습니다.")
                    }
                    else {
                        alert("인증이 실패하였습니다.")
                    }
            });

        } catch(err) {
            console.log(err)
            alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
        }
    }

    handleSubmit = async() => {
        var state = this.state;
        if(state.certificated === false) {
            alert("본인 인증을 완료해주세요.")
            return;
        }

        if(state.bank.val === "") {
            state.bank.class = "input error";
            state.bank.msg = "은행명을 입력해주세요."
            this.setState(state)
            alert("은행명을 입력해주세요.")
            return;
        }

        if(state.account.val === "") {
            state.account.class = "input error";
            state.account.msg = "계좌 번호를 입력해주세요."
            this.setState(state)
            alert("계좌 번호를 입력해주세요.")
            return;
        }

        if(state.agree === false) {
            alert("약관에 동의해주세요")
            return;
        }

        if(state.sign === false) {
            alert("약관에 동의해주세요")
            return;
        }
        var params = {
            name: state.name.val,
            bank: state.bank.val,
            account: state.account.val,
            tel: state.phone.val,
            tax_agreement: true,
            promotion_agency_agreement: true,
        }
        const res = await API.sendPost(URL.api.author.create, params)
        if(res.status === 201) {
            var token = res.data.token;
            if( token ) {
                Cookies.remove('RINGU_JWT');
                Cookies.remove('RINGU_JWT', { path: '/'});
                Cookies.remove('RINGU_JWT', { path: '/detail' });
                Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
            }

            alert("인증이 완료되었습니다.")
            window.location.href = URL.service.author + User.getInfo().id
        }
    }

    render() {
        let state = this.state

        return (
            this.user.type === 0 &&
            <div id="register-author" className="page3">
                <div className="title-wrap">
                    <h2 className="title">본인 인증</h2>
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
                            <button className="btn btn-auth" disabled={state.certificated} onClick={this.onCertificationClick}>
                                {(state.certificated) ? "인증 완료"  : "본인 인증"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="title-wrap">
                    <h2 className="title">계좌 정보</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="row">
                        <div className="input-box">
                            <h3 className="header"> 은행명 </h3>
                            <div className="form-group">
                                <input type="text" className={state.bank.class} onChange={this.handleBankChange}/>
                                {
                                    state.bank.msg &&
                                    <div className="error-wrap">
                                        <span>{state.bank.msg}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="input-box">
                            <h3 className="header"> 계좌번호 </h3>
                            <div className="form-group">
                                <input type="number" className={state.account.class} onChange={this.handleAccountChange} value={state.account.val}/>
                                {
                                    state.account.msg &&
                                    <div className="error-wrap">
                                        <span>{state.account.msg}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>

                <div className="title-wrap">
                    <h2 className="title">약관 동의 및 서명</h2>
                </div>

                <hr/>
                <div className="content">

                    <div className="input-box">
                        <h3 className="header"> 서비스 판매시 '세금' 관련 유의사항 </h3>
                        <div>
                            <textarea rows={7} value={state.tax_term} style={{"overflow":"auto"}}/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> Ringu 판매홍보 대행 약관 </h3>
                        <div>
                            <textarea rows={7} value={state.promotion_term}/>
                        </div>
                    </div>

                    <div className="term-box">
                        <span className="term">
                            본인은 위 약관의 내용을 모두 확인하였으며, Ringu 전문가로서 약관에 따라 성실히 활동할 것에 동의합니다.
                        </span>
                        <span className="check">
                            <input type="checkbox" id="agree-tax" onClick={this.handleAgree} checked={state.agree}/>
                            <label htmlFor="agree-tax">
                                동의함
                            </label>
                        </span>
                    </div>

                    <div className="term-box">
                        <span className="term">
                            본인은 본 약관에 서명을 등록함으로써 종이 문서의 서명과 동일한 효력을 갖는데 동의합니다.
                        </span>
                        <span className="check">
                            <input type="checkbox" id="agree-promotion" onClick={this.handleSign} checked={state.sign}/>
                            <label htmlFor="agree-promotion">
                                동의함
                            </label>
                        </span>
                    </div>

                </div>

                <div className="btn-wrap">
                    <button className="btn btn-color-2" onClick={this.handleSubmit}>
                        완료
                    </button>
                </div>
            </div>
        )
    }
}

export default RegisterAuthorDetail;
