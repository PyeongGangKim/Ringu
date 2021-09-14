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

class RegisterBook1 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            thumbnail: {file:null, clear:false},
            price: {val: "", msg: "", clear: false, class: "form-control"},
            page_count: {val: "", msg: "", clear: false, class: "form-control"},
            title: {val: "", msg: "", clear: false, class: "form-control"},
            bookDescription: {val: "", msg: "", clear: false, class: "form-control"},
            contents: {val: "", msg: "", clear: false, class: "form-control"},
            authorDescription: {val: "", msg: "", clear: false, class: "form-control", disabled:false},
            preview: {name:"", file:null, clear: false},
            book: {name:"", file:null, clear:false},
            tmp: null,
            dayOptions: [
                {value: 1, label: "월"},
                {value: 2, label: "화"},
                {value: 3, label: "수"},
                {value: 4, label: "목"},
                {value: 5, label: "금"},
                {value: 6, label: "토"},
                {value: 7, label: "일"},
            ],
            day: ""
        }
    }

    handlePriceChange = evt => {
        var state = this.state;
        state.price.val = evt.target.value;

        this.setState(state);
    }

    handlePageCountChange = evt => {
        var state = this.state;
        state.page_count.val = evt.target.value;

        this.setState(state);
    }

    handleTitleChange = evt => {
        var state = this.state;
        state.title.val = evt.target.value;

        this.setState(state);
    }

    handleBookDescriptionChange = evt => {
        var state = this.state;
        state.bookDescription.val = evt.target.value;

        this.setState(state);
    }

    handleContentsChange = evt => {
        var state = this.state;
        state.contents.val = evt.target.value;

        this.setState(state);
    }

    handleAuthorDescriptionChange = evt => {
        var state = this.state;
        state.authorDescription.val = evt.target.value;

        this.setState(state);
    }

    handleThumbnailChange = evt => {
        var state = this.state

        if(!evt.target.files.length) {
            return;
        }
        var reader = new FileReader();
        var file = evt.target.files[0]


        reader.onloadend = (e) => {
            const base64 = reader.result;
            if(base64) {
                state.tmp = base64.toString();
                this.setState(state)
            }
        }
        if (file) {
            reader.readAsDataURL(file);
            state.thumbnail.file = file

            this.setState(state)
        }
    }

    handlePreviewFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]
        state.preview.name = file.name
        state.preview.file = file

        this.setState(state)
    }

    handleBookFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]
        state.book.name = file.name
        state.book.file = file

        this.setState(state)
    }

    handleDayChange = (evt) => {
        var state = this.state
        state.day = evt.value;
        this.setState(state)
    }

    handleRegister = async() => {
        var state = this.state
        const data = new FormData()
        data.append("file", state.book.file)
        data.append("img", state.thumbnail.file)
        data.append("preview", state.preview.file)
        data.append("price", state.price.val)
        data.append("page_count", state.page_count.val)
        data.append("content", state.contents.val)
        data.append("book_description", state.bookDescription.val)
        data.append("title", state.title.val)
        data.append("type", 2)

        const res = await API.sendData(URL.api.register.book, data)
    }

    render() {
        let state = this.state

        return (
            <div id="register-book" className="page3">
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
                                <input type="file" id="thumbnail" accept="image/*" onChange={this.handleThumbnailChange}/>
                                <label htmlFor="thumbnail">
                                    <div className="thumbnail-box">
                                        {
                                            state.thumbnail.file ?
                                            <img src={state.tmp}/>
                                            :
                                            <div className="thumbnail-text">
                                                (이미지 업로드)
                                            </div>
                                        }
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div style={{flex:"1 0 auto"}}>
                            <div className="input-box">
                                <h3 className="header"> 회차 당 가격 </h3>
                                <div className="input-wrap">
                                    <input type="number" className="textbox" onChange={this.handlePriceChange} value={state.price.val}/>
                                </div>
                            </div>

                            <div className="input-box">
                                <h3 className="header"> 연재 주기
                                    <span className="small"> (복수선택 가능) </span>
                                </h3>

                                    <Select
                                        options={state.dayOptions}
                                        onChange={evt => this.handleDayChange(evt)}
                                        isMulti
                                        isSearchable={false}
                                        placeholder={""}/>

                            </div>
                        </div>
                    </div>
                    <div className="input-box">
                        <h3 className="header"> 제목 </h3>
                        <div className="input-wrap">
                            <input type="text" name="title" autoComplete="off" className="textbox" onChange={this.handleTitleChange} value={state.title.val}/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> 책 소개 </h3>
                        <div>
                            <textarea rows={7} onChange={this.handleBookDescriptionChange} value={state.bookDescription.val}/>
                        </div>
                    </div>

                    <div className="btn-wrap">
                        <button className="btn btn-color-2" onClick={this.handleRegister}>
                            등록하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegisterBook1;
