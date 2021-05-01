import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/book.scss';

class RegisterBook extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        let state = this.state

        return (
            <div id="register-area" className="page3">
                <div className="title-wrap">
                    <h2 className="title">새 작품 등록하기</h2>
                </div>

                <hr/>
                <div className="content">
                    <div style={{display:"flex"}}>
                        <div className="img-area">
                            <div className="input-box">
                                <h3 className="header">
                                    이미지
                                    <span className="small"> (jpg, png 형식만 업로드 가능)</span>
                                </h3>
                                <div className="thumbnail-box">
                                    <div className="thumbnail-text">
                                        (이미지 업로드)
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{flex:"1 0 auto"}}>
                            <div className="input-box">
                                <h3 className="header"> 가격 </h3>
                                <div className="input-wrap">
                                    <input type="text" className="textbox"/>
                                </div>
                            </div>

                            <div className="input-box">
                                <h3 className="header"> 페이지수 </h3>
                                <div className="input-wrap">
                                    <input type="text" className="textbox"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-box">
                        <h3 className="header"> 제목 </h3>
                        <div className="input-wrap">
                            <input type="text" className="textbox"/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> 책 소개 </h3>
                        <div>
                            <textarea rows={7}/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> 목차 </h3>
                        <div>
                            <textarea rows={7}/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> 작가 소개 </h3>
                        <p>기존 작가 소개 그대로 사용하기 </p>
                        <div>
                            <textarea rows={7}/>
                        </div>
                    </div>

                    <div className="upload-wrap">
                        <div className="upload">
                            <div className="btn btn-outline header">미리보기 </div>
                            <input className="upload-input" type="text" autoComplete="off"/>
                            <button className="btn btn-color-2 upload-btn">파일 업로드</button>
                            <span className="upload-text"> 파일형식: PDF, 파일이름:(제목/작가)</span>
                        </div>
                        <div className="upload">
                            <div className="btn btn-outline header">작품등록 </div>
                            <input className="upload-input" type="text" autoComplete="off"/>
                            <button className="btn btn-color-2 upload-btn">파일 업로드</button>
                            <span className="upload-text"> 파일형식: PDF, 파일이름:(제목/작가)</span>
                        </div>
                    </div>

                    <div className="btn-wrap">
                        <button className="btn btn-outline">
                            임시저장
                        </button>
                        <button className="btn btn-color-2">
                            등록하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegisterBook;
