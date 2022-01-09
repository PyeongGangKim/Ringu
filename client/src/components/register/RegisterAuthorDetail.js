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

        this.bankOptions = []

        if(this.user === null) {
            alert("로그인이 필요합니다.")
            window.location.href = URL.service.accounts.login
            return;
        }

        if(this.user.type === 1) {
            alert("이미 작가로 등록하였습니다.")
            window.location.href = URL.service.home
            return;
        }

        this.state = {
            name: {val: "임유빈", msg: "", clear: false, class: "input"},
            phone: {val: "01020618506", msg: "", clear: false, class: "input"},
            bank: {val: {}, msg: "", clear: false, class: "input"},
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
        state.bank.val = e;
        state.bank.clear = true;
        state.bank.msg = ""
        this.setState(state);
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

    onCertificationClick = (e) => {
        var state = this.state;
        e.preventDefault();

        if(state.name.val === '' || /^[가-힣]*$/.test(state.name.val) === false) {
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

        const { IMP } = window;
        IMP.init(iamport.IMP_CODE)        

        IMP.certification({
            name: state.name.val,
            phone: state.phone.val,
        },
            (rsp) => {
                console.log(rsp)
                if(rsp.success) {
                    state.certificated = true;
                    this.setState(state)

                    alert("인증이 완료되었습니다.")
                }
                else {
                    alert("인증이 실패하였습니다.")
                }
        });
        console.log(3333333)
    }

    handleSubmit = async() => {
        var state = this.state;
        if(state.certificated === false) {
            alert("본인 인증을 완료해주세요.")
            return;
        }

        if(!state.bank.val) {
            state.bank.class = "input error";
            state.bank.msg = "은행을 선택해주세요."
            this.setState(state)
            alert("은행을 선택해주세요.")
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
            bank: state.bank.val.value,
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

    async componentDidMount() {
        try {
            const res = await API.sendGet(URL.api.bank.get)
            console.log(res)
            if(res.status === 200){
                this.bankOptions = res.data.bank
                this.setState(this.state)
            }
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        const selectStyles = {
            control: (styles, {}) => ({
                ...styles,
                "&:hover": {
                    borderColor: 'var(--color-1)',
                },
                "&:focus": {
                    borderColor: 'var(--color-1)',
                    boxShadow: 0,
                },
                height: '60px',
                boxShadow: 0,
                borderWidth: '2px',
            }),
            container: (styles, {}) => ({
                ...styles,
            }),
            valueContainer: (styles, {  }) => ({
                ...styles,
                fontSize: '16px',
                height: '100%',
                padding: '10px 20px',
                fontWeight: '500',
            }),
        }

        var state = this.state

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
                                <Select
                                    value={state.bank.val}
                                    options={this.bankOptions}
                                    onChange={this.handleBankChange}
                                    isSearchable={false}
                                    placeholder={""}
                                    styles={selectStyles}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary: 'var(--color-1)',
                                        }
                                    })}
                                    maxMenuHeight="150px"/>
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
                                <input type="number" placeholder={"-빼고 입력해주세요"} className={state.account.class} onChange={this.handleAccountChange} value={state.account.val}/>
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
                            <textarea rows={7} value={state.tax_term} style={{"overflow":"auto"}} disabled/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> Ringu 판매홍보 대행 약관 </h3>
                        <div>
                            <textarea rows={7} value={state.promotion_term} disabled/>
                        </div>
                    </div>

                    <div className="term-box">
                        <span className="term">
                            본인은 위 약관의 내용을 모두 확인하였으며, Ringu 전문가로서 약관에 따라 성실히 활동할 것에 동의합니다.
                        </span>
                        <span className="check">
                            <label htmlFor="agree-tax" className="cb-container" >
                                <input type="checkbox" id="agree-tax" onClick={this.handleAgree} checked={state.agree}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    동의함
                                </div>
                            </label>
                        </span>
                    </div>

                    <div className="term-box">
                        <span className="term">
                            본인은 본 약관에 서명을 등록함으로써 종이 문서의 서명과 동일한 효력을 갖는데 동의합니다.
                        </span>
                        <span className="check">
                            <label htmlFor="agree-promotion" className="cb-container" >
                                <input type="checkbox" id="agree-promotion" onClick={this.handleSign} checked={state.sign}/>
                                <span className="checkmark"/>
                                <div className="checkbox-text">
                                    동의함
                                </div>
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
