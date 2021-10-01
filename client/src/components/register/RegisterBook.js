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

import Modal from '../../components/modal/Modal';

// type 1: 연재본
// type 2: 단행본
class RegisterBook extends Component {
    constructor(props) {
        super(props)

        this.dayOptions = [
            {value: 1, label: "월"},
            {value: 2, label: "화"},
            {value: 3, label: "수"},
            {value: 4, label: "목"},
            {value: 5, label: "금"},
            {value: 6, label: "토"},
            {value: 7, label: "일"},
        ]

        var location = props.location;

        this.type = ("type" in location.state && typeof location.state.type !== 'undefined') ? location.state.type : null;
        this.category = ("category" in location.state && typeof location.state.category !== 'undefined') ? location.state.category : null;

        if(this.type === null || this.category === null) {
            alert('잘못된 접근입니다')
            window.location.href = URL.service.home;
        }

        this.state = {
            thumbnail: {file:null},
            price: {val: "", class: "textbox"},
            page_count: {val: "", class: "textbox"},
            title: {val: "", class: "textbox"},
            bookDescription: {val: "", class: ""},
            contents: {val: "", class: ""},
            preview: {name:"", file:null},
            book: {name:"", file:null},
            tmp: null,
            day: {val: "", class: ""},
            modal: false,
            author: User.getInfo(),
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            const userRes = await API.sendGet(URL.api.member.getById + state.author.id)
            if(userRes.status === 200) {
                state.author = userRes.data.user
                this.setState(state)
            }
        } catch (e) {
            console.log(e)
        }
    }

    handlePriceChange = evt => {
        var state = this.state;
        state.price.val = evt.target.value;
        state.price.class = "textbox";

        this.setState(state);
    }

    handlePageCountChange = evt => {
        var state = this.state;
        state.page_count.val = evt.target.value;
        state.page_count.class = "textbox";

        this.setState(state);
    }

    handleTitleChange = evt => {
        var state = this.state;
        state.title.val = evt.target.value;
        state.title.class = "textbox";

        this.setState(state);
    }

    handleBookDescriptionChange = evt => {
        var state = this.state;
        state.bookDescription.val = evt.target.value;
        state.bookDescription.class = "";

        this.setState(state);
    }

    handleContentsChange = evt => {
        var state = this.state;
        state.contents.val = evt.target.value;
        state.contents.class = "";

        this.setState(state);
    }

    handleThumbnailChange = evt => {
        var state = this.state
        var file = evt.target.files[0];
        if(!file) {
            state.tmp = null
            state.thumbnail.file = null
            this.setState(state)
            return;
        }

        var reader = new FileReader();

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
        var file = evt.target.files[0];

        if(!file) {
            state.preview.name = ""
            state.preview.file = null
            this.setState(state)
            return;
        }
        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF 파일만 업로드 해주세요.')
            return;
        }

        state.preview.name = file.name
        state.preview.file = file

        this.setState(state)
    }

    handleBookFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]
        if(!file) {
            state.book.name = ""
            state.book.file = null
            this.setState(state)
            return;
        }
        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF 파일만 업로드 해주세요.')
            return;
        }

        //var blob = file.slice(0, file.size, file.type)
        //var newFile = new File([blob], state.title.val + "." + fieldName, {type: file.type})

        state.book.name = file.name
        state.book.file = file

        this.setState(state)
    }

    handleDayChange = (value) => {
        var state = this.state

        state.day.val = Object.entries(value)
            .sort(([, a], [, b]) => a.value - b.value)
            .map(item => {return item[1].label})
            .join('')

        this.setState(state)
    }

    handleRegister = async() => {
        var state = this.state

        if(!state.price.val) {
            alert('가격을 입력해주세요')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(state.price.val < 100) {
            alert('최소 가격은 100원입니다.')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(/^[0-9]*$/.test(state.day.val) === true) {
            alert('가격은 숫자만 입력해주세요.')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(this.type === 1) {
            if(!state.day.val) {
                alert('연재 주기를 입력해주세요')
                state.day.class = "textbox error";
                this.setState(state)
                return;
            }
        } else {
            if(!state.page_count.val) {
                alert('페이지 수를 입력해주세요')
                state.page_count.class = "textbox error";
                this.setState(state)
                return;
            }

            if(state.page_count.val < 100) {
                alert('최소 페이지는 100페이지입니다.')
                state.page_count.class = "textbox error";
                this.setState(state)
                return;
            }

            if(/^[0-9]*$/.test(state.page_count.val) === true) {
                alert('페이지는 숫자만 입력해주세요.')
                state.page_count.class = "textbox error";
                this.setState(state)
                return;
            }
        }

        if(!state.title.val) {
            alert('제목을 입력해주세요')
            state.title.class = "textbox error";
            this.setState(state)
            return;
        }

        if(this.type === 2) {
            if(!state.contents.val) {
                alert('목차를 입력해주세요')
                state.contents.class = "error";
                this.setState(state)
                return;
            }
        }

        if(!state.bookDescription.val) {
            alert('책 소개를 입력해주세요')
            state.bookDescription.class = "error";
            this.setState(state)
            return;
        }

        if(this.type === 2) {
            if(!state.preview.file) {
                alert('미리보기 파일을 선택해주세요.')
                this.setState(state)
                return;
            }

            if(!state.book.file) {
                alert('등록할 파일을 선택해주세요.')
                this.setState(state)
                return;
            }
        }

        const data = new FormData()
        data.append("price", state.price.val)
        data.append("book_description", state.bookDescription.val)
        data.append("title", state.title.val)
        data.append("category_id", this.category)
        data.append("type", this.type)

        var file = state.thumbnail.file;
        if(file) {
            var blob = file.slice(0, file.size, file.type);
            var token = file.name.split('.')
            var fieldName = token[token.length - 1]
            var newFile = new File([blob], state.title.val.slice(0, 10) + "_thumbnail." + fieldName, {type: file.type})
        }

        data.append("img", newFile)

        if(this.type === 2) {
            var book = state.book.file
            var blob1 = book.slice(0, book.size, book.type)
            var newBook = new File([blob1], state.title.val.slice(0, 10) + ".pdf", {type: book.type})

            var preview = state.preview.file
            var blob2 = preview.slice(0, preview.size, preview.type)
            var newPreview = new File([blob2], state.title.val.slice(0, 10) + "_preview.pdf", {type: preview.type})

            data.append("content", state.contents.val)
            data.append("preview", newPreview)
            data.append("file", newBook)
            data.append("page_number", state.page_count.val)
        } else {
            data.append("serialization_day", state.day.val)
        }

        try {
            const res = await API.sendData(URL.api.register.book, data)
            if(res.status === 201) {
                state.modal = true;
                this.setState(state);
                window.scrollTo(0,0);
            }
        } catch(e) {
            console.error(e)
        }
    }

    render() {
        let state = this.state

        const selectStyles = {
            control: (styles, { isFocused }) => ({
                ...styles,
                border: isFocused ? '2px solid var(--color-1)' : '2px solid #ddd',
                transition: '0.5s',
                boxShadow: '0',
                ':hover': {
                    border: '2px solid var(--color-1)',
                },
            }),
            valueContainer: (styles, {  }) => ({
                ...styles,
                height: '36px',
            }),
        }

        return (
            <div id="register-book" className="page3">
                {
                    state.modal === true &&
                    <Modal
                        overlay={true}
                    >
                        <div className="modal register">
                            <div className="header">
                                <span className="em">{state.author.nickname}</span>작가님의 새 작품이 등록되셨습니다!
                            </div>
                            <div className="content">
                                <p>등록일 기준으로 2~3일 내에 <strong>작품승인</strong>이 완료되며</p>
                                <p>불건전한 내용일시 <strong>임의삭제</strong>될 수 있다는 점을 말씀드립니다.</p>

                                {
                                    this.type === 1 &&
                                    <p> 연재본 업로드는 승인 완료 후 작가 공간에서 가능합니다</p>
                                }
                            </div>

                            <Link to={URL.service.author + state.author.id}>
                                <button className="btn btn-block btn-color-2">
                                    완료
                                </button>
                            </Link>
                        </div>
                    </Modal>
                }
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
                                <h3 className="header"> {this.type === 1 ? "회차 당 가격": "가격"} </h3>
                                <div className="input-wrap">
                                    <input type="number" className={state.price.class} onChange={this.handlePriceChange} value={state.price.val}/>
                                </div>
                            </div>

                            {
                                this.type === 1 ?
                                <div className="input-box">
                                    <h3 className="header"> 연재 주기
                                        <span className="small"> (복수선택 가능) </span>
                                    </h3>
                                        <Select
                                            options={this.dayOptions}
                                            onChange={value => this.handleDayChange(value)}
                                            styles={selectStyles}
                                            isMulti
                                            isSearchable={false}
                                            placeholder={""}/>
                                </div>
                                :
                                <div className="input-box">
                                    <h3 className="header"> 페이지수 </h3>
                                    <div className="input-wrap">
                                        <input type="number" className={state.page_count.class} onChange={this.handlePageCountChange} value={state.page_count.val}/>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="input-box">
                        <h3 className="header"> 제목 </h3>
                        <div className="input-wrap">
                            <input type="text" name="title" autoComplete="off" className={state.title.class} onChange={this.handleTitleChange} value={state.title.val}/>
                        </div>
                    </div>


                    {
                        this.type === 2 &&
                        <div className="input-box">
                            <h3 className="header"> 목차 </h3>
                            <div>
                                <textarea rows={5} cols={5} className={state.contents.class} onChange={this.handleContentsChange} value={state.contents.val} wrap="hard"/>
                            </div>
                        </div>
                    }

                    <div className="input-box">
                        <h3 className="header"> 책 소개 </h3>
                        <div>
                            <textarea rows={5} cols={5} className={state.bookDescription.class}  onChange={this.handleBookDescriptionChange} value={state.bookDescription.val} wrap="hard"/>
                        </div>
                    </div>

                    {
                        this.type === 2 &&
                        <div className="upload-wrap">
                            <div className="upload">
                                <div className="btn btn-outline header">미리보기 </div>
                                <div className="filename">
                                    {state.preview.name}
                                </div>
                                <input type="file" id="preview" onChange={this.handlePreviewFileChange} accept=".pdf"/>
                                <label htmlFor="preview">
                                    <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                </label>
                                <span className="upload-text"> 파일형식: PDF, 파일이름:(제목/작가)</span>
                            </div>
                            <div className="upload">
                                <div className="btn btn-outline header">작품등록 </div>
                                <div className="filename">
                                    {state.book.name}
                                </div>
                                <input type="file" id="book" onChange={this.handleBookFileChange} accept=".pdf"/>
                                <label htmlFor="book">
                                    <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                </label>
                                <span className="upload-text"> 파일형식: PDF, 파일이름:(제목/작가)</span>
                            </div>
                        </div>
                    }

                    <div className="btn-wrap">
                        <button className="btn btn-color-2" onClick={this.handleRegister}>
                            등록하기
                        </button>
                        <button className="btn ">
                            취소하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegisterBook;
