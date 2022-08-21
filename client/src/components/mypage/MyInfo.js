import React, { Component, Fragment } from 'react';
import Select from 'react-select'
import Helmet from 'react-helmet';

import User from '../../utils/user';
import '../../scss/mypage/mypage.scss';
import '../../scss/common/button.scss';

import string from '../../config/str';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class MyInfo extends Component {
    constructor(props) {
        super(props)
        this.bankOptions = []

        this.state = {
            ui: {

            },
            data: {
                email:"",
                originalNickname: "",
                nickname: {value:"", isModifying: false, clear: false},
                bank: {value:0, isModifying: false, clear: false},
                account: {value:"", isModifying: false, clear: false},
                originalBank: {},
                originalAccount: "",
                user: {},
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

    handleBankChange = (evt) => {
        var state = this.state;
        state.data.bank.value = evt;
        state.data.bank.clear = true;
        this.setState(state);
    }

    handleAccountChange = (evt) => {
        var state = this.state;
        state.data.account.value = evt.target.value;
        state.data.account.clear = false;
        this.setState(state);
    }

    handleAccountModifyClick = (evt) => {
        var state = this.state;
        state.data.bank.isModifying = true;
        this.setState(state);
    }

    handleAccountModifyComplete = async(evt) => {
        var state = this.state;

        if((state.data.account.value === state.data.originalAccount) && (state.data.bank.value === state.data.originalBank)) {
            state.data.bank.isModifying = false;
            state.data.account.isModifying = false;
            this.setState(state);
            return;
        }

        if(!!state.data.bank.value && state.data.account.value !== '') {
            state.data.bank.isModifying = false;
            state.data.account.isModifying = false;

            try {
                const res = await API.sendPut(URL.api.author.update, {bank: state.data.bank.value.value, account: state.data.account.value})
                if(res.status === 200){
                    alert("계좌가 변경되었습니다.")
                } else {
                    alert("계좌 변경에 실패하였습니다.")
                }
            } catch(e) {
                console.error(e)
            }
        } else {
            alert("계좌 변경에 실패하였습니다.")
        }

        this.setState(state);
    }

    handleAccountModifyCancel = (evt) => {
        var state = this.state;
        state.data.bank.isModifying = false;
        state.data.bank.clear = false;
        state.data.bank.value = state.data.originalBank;
        state.data.account.value = state.data.originalAccount;

        this.setState(state);
    }

    handleNicknameDuplicateCheck = async(evt) => {
        var state = this.state;
        var params = {
            nickname: this.state.data.nickname.value,
        }

        try {
            const res = await API.sendGet(URL.api.member.nickname_duplicate, params)
            if(res.status === 200){
                if(res.data.message === 'OK') {
                    state.data.nickname.clear = true;
                    this.setState(state)
                    alert("변경 가능한 닉네임입니다.")
                }
                else if(res.data.message === 'duplicate') {
                    alert("이미  사용 중인 닉네임입니다.")
                }
            }
        }
        catch(e) {
            var error = e.response
            if(error.status === 401) {
                alert("로그인이 필요합니다.")
                window.location = URL.service.accounts.login;
            }            
            else {
                alert("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
            }
        }
    }

    async componentDidMount() {
        var state = this.state;
        var params = {
            id: User.getInfo().id,
        }

        try {
            const res = await API.sendGet(URL.api.member.get, params)
            if(res.status === 200){
                var user = res.data.user;
                state.data.user = user;
                state.data.email = user.email;
                state.data.nickname.value = user.nickname;
                state.data.originalNickname = user.nickname;

                this.setState(state)

                if(user.type === 1) {
                    const authorRes = await API.sendGet(URL.api.author.get, {id: user.id})
                    if(authorRes.status === 200) {
                        var author = authorRes.data.author;
                        state.data.bank.value = author.bank_bank;
                        state.data.account.value = author.account;
                        state.data.originalBank = author.bank_bank;
                        state.data.originalAccount = author.account;

                        this.setState(state)
                    }
                }
            };
        } catch(e) {
            console.error(e);
        }

        try {
            const res = await API.sendGet(URL.api.bank.get)
            if(res.status === 200){
                this.bankOptions = res.data.bank
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
                boxShadow: 0,
                borderWidth: '2px',
            }),
            container: (styles, {}) => ({
                ...styles,
                width: '300px',
                marginRight: '30px',
            }),
            valueContainer: (styles, {  }) => ({
                ...styles,
                height: '40px',
                padding: '10px 20px',
                fontWeight: '500',
            }),
        }

        var state = this.state;

        return (
            <>
                <Helmet title={string.mypage + string.postfix}/>
                <div className="title-wrap">
                    <h2 className="title">나의 정보</h2>
                </div>

                <hr/>

                <div className="container">
                    <h2 className="subtitle"> 계정 정보</h2>

                    <div className="content">
                        <div className="input-box">
                            <h3 className="header"> 이메일 </h3>
                            <input className="textbox" type="email" name="email" autoComplete="off" value={state.data.email} disabled/>
                        </div>

                        <div className="input-box">
                            <h3 className="header">
                                닉네임
                                {
                                    state.data.nickname.isModifying === true ?
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

                            <input className="textbox" type="text" name="nickname" disabled={state.data.nickname.isModifying === false} autoComplete="off" value={state.data.nickname.value} onChange={this.handleNicknameChange}/>
                            {
                                (state.data.nickname.isModifying === true) &&
                                (
                                    state.data.nickname.clear === false ?
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
                    {
                        state.data.user.type === 1 &&
                        <div>
                            <h2 className="subtitle"> 계좌 정보</h2>

                            <div className="content">
                                <div className="input-box">
                                    <h3 className="header">
                                        계좌
                                        {
                                            state.data.bank.isModifying === true ?
                                            <div className="sub-wrap">
                                                <button className="modify-btn" onClick={this.handleAccountModifyComplete}>
                                                    <em/>
                                                    완료
                                                </button>
                                                <button className="modify-btn" onClick={this.handleAccountModifyCancel}>
                                                    <em/>
                                                    취소
                                                </button>
                                            </div>
                                            :
                                            <div className="sub-wrap">
                                                <button className="modify-btn" onClick={this.handleAccountModifyClick}>
                                                    <em/>
                                                    수정
                                                </button>
                                            </div>
                                        }

                                    </h3>
                                    <div className="row">
                                        <Select
                                            value={state.data.bank.value}
                                            options={this.bankOptions}
                                            onChange={this.handleBankChange}
                                            isSearchable={false}
                                            defaultValue={0}
                                            isDisabled={state.data.bank.isModifying === false}
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

                                        <input className="textbox" type="number" name="account" placeholder={"-빼고 입력해주세요"} disabled={state.data.bank.isModifying === false} autoComplete="off" value={state.data.account.value} onChange={this.handleAccountChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </>

        )
    }
}

export default MyInfo;
