import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select'

import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/author.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import iamport from '../../config/iamport';


class RegisterAuthor extends Component {
    constructor(props) {
        super(props)
    }

    handleSubmit = (e) => {
        e.preventDefault();

        try {
            const { IMP } = window;
            IMP.init(iamport.IMP_CODE)

            IMP.certification({
                merchant_uid: "min_1231231",
                m_redirect_url: URL.service.register.author_detail,
            },
                function(rsp) {
                    if(rsp.success) {
                        console.log(rsp)
                    }
                    else {
                        console.log('fail')
                    }
            });

        } catch(err) {
            console.log(err)
        }
    }

    render() {
        let state = this.state

        return (
            <div id="register-author" className="page3">
                <div className="title-wrap">
                    <h2 className="title">작가 등록</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="phone-auth-box">
                        <div className="header">
                            휴대폰 본인 인증
                        </div>
                        <div className="subheader">
                            진행을 위해 본인 인증이 필요합니다
                        </div>

                        <div className="btn-box">
                            <button className="btn btn-block btn-color-2 btn-auth" onClick={this.handleSubmit}>
                                인증하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegisterAuthor;
