import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/book.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import Helmet from 'react-helmet';
import string from '../../config/str';

class ModifyBook extends Component {
    constructor(props) {
        super(props)

        this.state = {
            thumbnail: {file:null, clear:false, modified: false},
            price: {val: "", msg: "", clear: false, class: "input"},
            page_count: {val: 0, msg: "", clear: false, class: "input"},
            title: {val: "", msg: "", clear: false, class: "input"},
            bookDescription: {val: "", msg: "", clear: false, class: "input"},
            content: {val: "", msg: "", clear: false, class: "input"},
            preview: {name:"", file:null, clear: false, modified: false},
            book: {name:"", file:null, clear:false, modified: false},
            bookDetail: {},
            tmp: null,
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            const res = await API.sendGet(URL.api.book.get + this.props.bookId)
            if(res.status === 200){
                var book = res.data.book;
                state.bookDetail = book.book_details[0];

                state.price.val = !!book.price ? book.price : 0;
                state.page_count.val = !!book.page_count ? book.page_count : 0;
                state.title.val = book.book_title;
                state.bookDescription.val = book.book_description;
                state.content.val = book.content;
                state.thumbnail.file = book.img;
                state.preview.name = book.preview;
                state.book.name = book.file;

                this.setState(state)
            }
        }
        catch(e) {
            console.log(e)
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

    handleContentChange = evt => {
        var state = this.state;
        state.content.val = evt.target.value;

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
            state.thumbnail.modified = true;

            this.setState(state)
        }
    }

    handlePreviewFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            state.preview.name = ""
            state.preview.file = null
            this.setState(state)
            return;
        }

        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF ????????? ????????? ????????????.')
            return;
        }

        state.preview.name = file.name
        state.preview.file = file
        state.preview.modified = true;

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
            alert('PDF ????????? ????????? ????????????.')
            return;
        }

        //var blob = file.slice(0, file.size, file.type)
        //var newFile = new File([blob], state.title.val + "." + fieldName, {type: file.type})

        state.book.name = file.name
        state.book.file = file
        state.book.modified = true;

        this.setState(state)
    }

    handleDelete = async() => {
        const res = await API.sendDelete(URL.api.book.delete + this.props.bookId)
        if(res.status === 200) {
            window.location.href = URL.service.author + User.getInfo().id;
        }
    }

    handleModify = async(book_detail_id) => {
        var state = this.state
        var book_id = this.props.bookId

        if(!state.price.val) {
            alert('????????? ??????????????????')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(state.price.val < 100) {
            alert('?????? ????????? 100????????????.')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(/^[0-9]*$/.test(state.price.val) === false) {
            alert('????????? ????????? ??????????????????.')
            state.price.class = "textbox error";
            this.setState(state)
            return;
        }

        if(!state.page_count.val) {
            alert('????????? ?????? ??????????????????')
            state.page_count.class = "textbox error";
            this.setState(state)
            return;
        }

        if(state.page_count.val < 50) {
            alert('?????? ???????????? 50??????????????????.')
            state.page_count.class = "textbox error";
            this.setState(state)
            return;
        }

        if(/^[0-9]*$/.test(state.page_count.val) === false) {
            alert('???????????? ????????? ??????????????????.')
            state.page_count.class = "textbox error";
            this.setState(state)
            return;
        }

        if(!state.title.val) {
            alert('????????? ??????????????????')
            state.title.class = "textbox error";
            this.setState(state)
            return;
        }

        if(!state.content.val) {
            alert('????????? ??????????????????')
            state.content.class = "error";
            this.setState(state)
            return;
        }


        if(!state.bookDescription.val) {
            alert('??? ????????? ??????????????????')
            state.bookDescription.class = "error";
            this.setState(state)
            return;
        }

        if(state.preview.modified && !state.preview.file) {
            alert('???????????? ????????? ?????????????????????.')
            this.setState(state)
            return;
        }

        if(state.book.modified && !state.book.file) {
            alert('????????? ????????? ?????????????????????.')
            this.setState(state)
            return;
        }

        try {
            const data = new FormData()
            data.append("book_id", this.props.bookId)
            data.append("book_detail_id", book_detail_id)

            if(state.book.modified) {
                var book = state.book.file
                var bookblob = book.slice(0, book.size, book.type)
                var newBook = new File([bookblob], state.title.val.slice(0, 10) + ".pdf", {type: book.type})
                data.append("file", newBook)
            }

            if(state.preview.modified) {
                var preview = state.preview.file
                var previewblob = book.slice(0, preview.size, preview.type)
                var newPreview = new File([previewblob], state.title.val.slice(0, 10) + ".pdf", {type: preview.type})
                data.append("preview", newPreview)
            }

            if(state.thumbnail.modified) {
                var img = state.thumbnail.file;
                if(typeof img !== 'string') {
                    var imgblob = img.slice(0, img.size, img.type);
                    var token = img.name.split('.')
                    var fieldName = token[token.length - 1]
                    var newImg = new File([imgblob], state.title.val.slice(0, 10) + "_thumbnail." + fieldName, {type: img.type})
                    data.append("img", newImg)
                }
            }

            data.append("price", state.price.val)
            data.append("page_count", state.page_count.val)
            data.append("content", state.content.val)
            data.append("book_description", state.bookDescription.val)
            data.append("title", state.title.val)

            const res = await API.sendData(URL.api.book.modify, data)
            if(res.status === 200) {
                alert("????????? ?????????????????????");
                window.location.href = URL.service.author + User.getInfo().id;
            }
        }
        catch(err) {
            console.log(err)
        }
    }

    render() {
        var state = this.state

        return (
            <div id="register-book" className="page3">
                <Helmet title={state.title.val + " " + string.modify + string.postfix}/>
                <div className="title-wrap">
                    <h2 className="title">????????? ????????????</h2>
                </div>

                <hr/>
                <div className="content">
                    <div style={{display:"flex"}}>
                        <div className="img-area">
                            <div className="input-box">
                                <h3 className="header">
                                    ?????????
                                    <span className="small"> (jpg, png ????????? ????????? ??????)</span>
                                </h3>
                                <input type="file" id="thumbnail" accept="image/*" onChange={this.handleThumbnailChange}/>
                                <label htmlFor="thumbnail">
                                    <div className="thumbnail-box">
                                        {
                                            state.thumbnail.file ?
                                            <img src={!!state.tmp ? state.tmp : state.thumbnail.file}/>
                                            :
                                            <div className="thumbnail-text">
                                                (????????? ?????????)
                                            </div>
                                        }

                                    </div>
                                </label>
                            </div>
                        </div>
                        <div style={{flex:"1 0 auto"}}>
                            <div className="input-box">
                                <h3 className="header"> ?????? </h3>
                                <div className="input-wrap">
                                    <input type="number" className="textbox" onChange={this.handlePriceChange} value={state.price.val}/>
                                </div>
                            </div>

                            <div className="input-box">
                                <h3 className="header"> ???????????? </h3>
                                <div className="input-wrap">
                                    <input type="number" className="textbox" onChange={this.handlePageCountChange} value={state.page_count.val}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-box">
                        <h3 className="header"> ?????? </h3>
                        <div className="input-wrap">
                            <input type="text" name="title" autoComplete="off" className="textbox" onChange={this.handleTitleChange} value={state.title.val}/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> ?????? </h3>
                        <div>
                            <textarea rows={7} onChange={this.handleContentChange} value={state.content.val}/>
                        </div>
                    </div>

                    <div className="input-box">
                        <h3 className="header"> ??? ?????? </h3>
                        <div>
                            <textarea rows={7} onChange={this.handleBookDescriptionChange} value={state.bookDescription.val}/>
                        </div>
                    </div>

                    <div className="upload-wrap">
                        <div className="upload">
                            <div className="row">
                                <div className="header">???????????? </div>
                                <input type="file" id="preview" onChange={this.handlePreviewFileChange} accept=".pdf"/>
                                <label htmlFor="preview">
                                    <div className="box">
                                        {!!state.preview.name ? state.preview.name : "????????? ?????????????????????."}
                                    </div>
                                    <div className="btn btn-color-2 upload-btn">????????????</div>
                                </label>
                                <span className="upload-text"> ????????????: PDF</span>
                            </div>
                        </div>
                        <div className="upload">
                            <div className="row">
                                <div className="header">???????????? </div>
                                <input type="file" id="book" onChange={this.handleBookFileChange} accept=".pdf"/>
                                <label htmlFor="book">
                                    <div className="box">
                                        {!!state.book.name ? state.book.name : "????????? ?????????????????????."}
                                    </div>
                                    <div className="btn btn-color-2 upload-btn">????????????</div>
                                </label>
                                <span className="upload-text"> ????????????: PDF</span>
                            </div>
                        </div>
                    </div>

                    <div className="btn-wrap">
                        <button className="btn btn-color-2" onClick={() => this.handleModify(state.bookDetail.id)}>
                            ????????????
                        </button>
                        <button className="btn btn-outline" onClick={() => this.handleDelete()}>
                            ????????????
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModifyBook;
