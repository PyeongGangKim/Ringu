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

class ModifyBookSeries extends Component {
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

        this.state = {
            price: {val: "", msg: "", clear: false, class: "input"},
            title: {val: "", msg: "", clear: false, class: "input"},
            bookDescription: {val: "", msg: "", clear: false, class: "input"},
            day: {val: "", msg: "", clear: false, class: "input"},
            thumbnail: {file:null, clear:false},
            tmp: null,
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            const res = await API.sendGet(URL.api.book.get + this.props.bookId)
            if(res.status === 200){
                var book = res.data.book;
                state.price.val = !!book.price ? book.price : 0;
                state.title.val = book.book_title;
                state.bookDescription.val = book.book_description;
                state.thumbnail.file = book.img;
                var day = []
                book.serialization_day.split('').forEach(d =>
                    day.push(this.dayOptions.filter(item => item.label === d)[0])
                )
                state.day.val = day

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }
    }

    handlePriceChange = evt => {
        var state = this.state;
        state.price.val = evt.target.value;

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

    handleThumbnailChange = evt => {
        var state = this.state

        if(!evt.target.files.length) {
            return;
        }
        var reader = new FileReader();
        var file = evt.target.files[0]
        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        var blob = file.slice(0, file.size, file.type)
        var newFile = new File([blob], state.title.val + "_thumbnail." + fieldName, {type: file.type})

        reader.onloadend = (e) => {
            const base64 = reader.result;
            if(base64) {
                state.tmp = base64.toString();
                this.setState(state)
            }
        }
        if (newFile) {
            reader.readAsDataURL(newFile);
            state.thumbnail.file = newFile

            this.setState(state)
        }
    }

    handleDayChange = (value) => {
        var state = this.state

        var selectedDays = Object.entries(value)
            .sort(([, a], [, b]) => a.value - b.value)
            .map(item => {return item[1].label})
            .join('')

        var day = []
        selectedDays.split('').forEach(d =>
            day.push(this.dayOptions.filter(item => item.label === d)[0])
        )
        state.day.val = day

        this.setState(state)
    }

    handleDelete = async() => {
        const res = await API.sendDelete(URL.api.book.delete + this.props.bookId)
        if(res.status === 200) {
            window.location.href = URL.service.author + User.getInfo().id;
        }
    }

    handleModify = async() => {
        var state = this.state
        var book_id = this.props.bookId

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

        if(/^[0-9]*$/.test(state.price.val) === false) {
            alert('가격은 숫자만 입력해주세요.')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(!state.title.val) {
            alert('제목을 입력해주세요')
            state.title.class = "textbox error";
            this.setState(state)
            return;
        }

        if(!state.bookDescription.val) {
            alert('책 소개를 입력해주세요')
            state.bookDescription.class = "error";
            this.setState(state)
            return;
        }

        try {
            const data = new FormData()
            data.append("book_id", this.props.bookId)

            var img = state.thumbnail.file;
            if(typeof img !== 'string') {
                var imgblob = img.slice(0, img.size, img.type);
                var token = img.name.split('.')
                var fieldName = token[token.length - 1]
                var newImg = new File([imgblob], state.title.val.slice(0, 10) + "_thumbnail." + fieldName, {type: img.type})
                data.append("img", newImg)
            }
            data.append("price", state.price.val)
            data.append("book_description", state.bookDescription.val)
            data.append("title", state.title.val)
            var daystrip = Object.entries(state.day.val)
                .sort(([, a], [, b]) => a.value - b.value)
                .map(item => {return item[1].label})
                .join('')
            data.append("day", daystrip)

            const res = await API.sendData(URL.api.book.modify, data)
            if(res.status === 200) {
                alert("수정이 완료되었습니다");
                window.location.href = URL.service.author + User.getInfo().id;
            }
        }
        catch(err) {
            console.log(err)
        }

    }

    render() {
        var state = this.state

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
                <div className="title-wrap">
                    <h2 className="title">수정하기</h2>
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
                                            <img src={!!state.tmp ? state.tmp : state.thumbnail.file}/>
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
                                    <input type="number" className={state.price.class} onChange={this.handlePriceChange} value={state.price.val}/>
                                </div>
                            </div>

                            <div className="input-box">
                                <h3 className="header"> 연재 주기
                                    <span className="small"> (복수선택 가능) </span>
                                </h3>
                                    <Select
                                        value={state.day.val}
                                        options={this.dayOptions}
                                        onChange={value => this.handleDayChange(value)}
                                        styles={selectStyles}
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
                        <button className="btn btn-color-2" onClick={() => this.handleModify()}>
                            수정하기
                        </button>
                        <button className="btn btn-outline" onClick={() => this.handleDelete()}>
                            삭제하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModifyBookSeries;
