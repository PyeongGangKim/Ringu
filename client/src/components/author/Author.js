import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import Book from '../../components/book/Book'
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/common/common.scss';
import '../../scss/common/tab.scss';
import '../../scss/author/author.scss';
import '../../scss/book/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import Modal from '../../components/modal/Modal';

import Helmet from 'react-helmet';
import string from '../../config/str';

const tabHeight = 60;

class Author extends Component {
    constructor(props) {
        super(props)

        this.introRef = React.createRef();
        this.bookRef = React.createRef();
        this.reviewRef = React.createRef();

        this.state = {
            tab: 'intro',
            tabChange: false,
            detailList: [],
            detailTotal: 0,
            bookList: {},
            selectedBook: {},

            user: {
                id: -1,
                description: '',
            },
            active: 'a',
            activeReview: 0,
            dock: false,
            reviewList: [],
            reviewTitleList: [],

            //
            display:false,
            modify: false,
            modifyList: [],
            upload: false,

            modalPos:{},
            host: false,
            book: {title:"", name:"선택 파일 없음", file:null},
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            var params = {
                author_id: this.props.authorId,
            }

            const res = await API.sendGet(URL.api.book.list, params = params)
            if(res.status === 200) {
                var bookList = res.data.bookList
                if(User.getInfo() !== null && this.props.authorId === User.getInfo().id) {
                    state.host = true
                }

                var waitingList = bookList.filter(book => {
                    return book.is_approved === 0
                })

                bookList = bookList.filter(book => {
                    return book.is_approved === 1
                })

                var serialList = bookList.filter(book => {
                    return book.type === 1
                })

                var serList = serialList.filter(book => {
                    return book.is_finished_serialization === 0
                })

                if(serList.length !== 0) {
                    state.bookList['ser'] = serList
                }

                var seredList = serialList.filter(book => {
                    return book.is_finished_serialization === 1
                })

                if(seredList.length !== 0) {
                    state.bookList['ser-ed'] = seredList
                }

                var pubList = bookList.filter(book => {
                    return book.type === 2
                })

                if(pubList.length !== 0) {
                    state.bookList['pub'] = pubList
                }

                if(waitingList.length !== 0) {
                    state.bookList['wait'] = waitingList
                }

                this.setState(state)
            }

            const reviewRes = await API.sendGet(URL.api.review.getReivewList, params = {title: true, author_id: this.props.authorId})

            if(reviewRes.status === 200) {
                var reviewData = reviewRes.data

                state.reviewList = reviewData.reviewList
                state.reviewTitleList = reviewData.reviewTitleList
                this.setState(state)
            }

            const userRes = await API.sendGet(URL.api.member.getById + this.props.authorId)
            if(userRes.status === 200) {
                var user = userRes.data.user

                state.user = user
                this.setState(state)
            }

            window.addEventListener('scroll', this.handleScroll)

            if (window.scrollY > 100) {
                state.dock = true;
            } else {
                state.dock = false;
            }

            this.setState(state)

        } catch (e) {
            console.log(e)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.tab !== this.state.tab || prevState.tabChange !== this.state.tabChange) {
            window.addEventListener('scroll', this.handleScroll)
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleTabChange = (event, value) => {
        this.setState({tab: value, tabChange: true})
        window.removeEventListener('scroll', this.handleScroll)

        if (value === 'intro') {
            window.scrollTo({
                top: this.introRef.current.offsetTop - tabHeight,
            })
        } else if (value === 'book') {
            window.scrollTo({
                top: this.bookRef.current.offsetTop - tabHeight,
            })
        } else {
            window.scrollTo({
                top: this.reviewRef.current.offsetTop - tabHeight,
            })
        }
    }

    handleScroll = (event) => {
        var state = this.state;

        const scrollTop = ('scroll', event.srcElement.scrollingElement.scrollTop);
        if (scrollTop > 100) {
            state.dock = true;
        } else {
            state.dock = false;
        }

        if(state.tabChange === true) {
            state.tabChange = false
            return;
        }

        if (scrollTop >= this.reviewRef.current.offsetTop - tabHeight) {
            state.tab = 'review';
        }
        else if (scrollTop >= this.bookRef.current.offsetTop - tabHeight) {
            state.tab = 'book';
        } else {
            state.tab = 'intro';
        }

        this.setState(state);
    }

    handleSubClick = (value) => {
        var state = this.state;
        state.active = value
        this.setState(state)
    }

    handleDisplayClick = async(e, book) => {
        var x = e.pageX - 100;
        var y = e.pageY + 50;
        var state = this.state;
        var display = true

        var params = {
            member_id : this.props.authorId
        }

        const res = await API.sendGet(URL.api.book.getDetailList + book.id, params)
        if(res.status === 200) {
            var detailList = res.data.detailList
            state.detailList = detailList
            state.detailTotal = res.data.total.count
            state.modifyList = new Array(detailList.length).fill(false);
            this.setState(state)
        }

        state.selectedBook = book;

        //var modalRoot = document.getElementById('modal-root')
        //modalRoot.style.cssText = `top:${coordY}px; left:${coordX}px;`

        state.modalPos = {x: x, y: y}

        state.display = true
        this.setState(state)
    }

    handleReviewTitleClick = async(title, book_id) => {
        var state = this.state;
        state.activeReview = title;
        this.setState(state)

        var params = {
            title: false,
        }
        if(book_id !== null) {
            params['book_id'] = book_id;
        } else {
            params['author_id'] = this.props.authorId;
        }

        const reviewRes = await API.sendGet(URL.api.review.getReivewList, params = params)
        if(reviewRes.status === 200){
            var reviewData = reviewRes.data

            state.reviewList = reviewData.reviewList
            this.setState(state)
        }
    }

    handleCloseClick = () => {
        var state = this.state;

        state.selectedBook = {};
        state.book = {title:"", name:"선택 파일 없음", file:null};
        state.detailList = [];
        state.detailTotal = 0;
        state.display = false;
        this.setState(state)
    }

    handleFinishClick = async(book_id) => {
        var params = {
            is_finished_serialization: 1,
            book_id: book_id
        }

        try {
            const res = await API.sendPut(URL.api.book.put, params, 'application/json')
            if(res.status === 200) {

            }
        } catch(e) {
            console.error(e)
            alert("작업을 완료하지 못 했습니다. 잠시 후에 다시 시도해주세요.")
        }

    }

    handleModifyFileClick = async(evt, idx) => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            return;
        }
        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF 파일만 업로드 해주세요.')
            return;
        }

        const data = new FormData()
        var blob = file.slice(0, file.size, file.type)
        var newFile = new File([blob], state.selectedBook.title + "." + fieldName, {type: file.type})
        data.append("file", newFile)
        data.append("id", state.selectedBook.id)

        try {
            const res = await API.sendPut(URL.api.book_detail.modify, data, 'multipart/form-data')
            if(res.status === 200) {
                alert("파일을 수정하였습니다!")
            }
        } catch(e) {
            console.error(e)
            alert("파일을 수정하지 못했습니다. 잠시 후에 다시 시도해주세요.")
        }
    }

    handleModifyClick = () => {
        var state = this.state;
        state.modify = true;

        this.setState(state)
    }

    handleModifyTitleClick = (idx, isModifying) => {
        var state = this.state;
        state.modifyList[idx] = isModifying;

        this.setState(state);
    }

    handleDetailTitleChange = (evt, idx) => {
        var state = this.state;
        state.detailList[idx].title = evt.target.value;

        this.setState(state);
    }

    handleConfirmClick = async(idx, detail_id) => {
        var state = this.state;

        try {
            const res = await API.sendPut(URL.api.book_detail.modify, {title: state.detailList[idx].title, id:detail_id}, 'application/json')
            console.log(res)
            if(res.status === 200) {
                state.modifyList[idx] = false;
                this.setState(state);
            }
        } catch(e) {
            alert("제목을 수정하지 못하였습니다. 잠시 후에 다시 시도하여 주세요.")
        }
    }

    handleCompleteClick = async() => {
        var state = this.state;
        state.modify = false;

        const res = await API.sendPut(URL.api.member.update, {description: state.user.description})
        if(res.status === 200){
            alert("변경되었습니다.")
        } else {
            alert("변경에 실패하였습니다.")
        }

        this.setState(state)
    }

    handleDescriptionChange = (evt) => {
        var state = this.state;
        state.user.description = evt.target.value;
        this.setState(state)
    }

    handleUpdate = (book) => {
        var state = this.state;
        var newArray = state.bookList[book.status].filter(item => item.id !== book.id)
        state.bookList[book.status] = newArray
        this.setState(state)
    }

    handleDetailDelete = async(detail) => {
        var state = this.state;

        if(window.confirm(`${detail.title}을 삭제하시겠습니까?`)) {
            const res = await API.sendDelete(URL.api.book_detail.delete + detail.id)
            if(res.status === 200) {
                state.detailList = state.detailList.filter(item => {
                    return item.id !== detail.id
                })
                this.setState(state)
            } else {
                alert("삭제하지 못 했습니다.")
            }
        }
    }

    handleBookFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            state.book.name = "선택 파일 없음"
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
        //var newFile = new File([blob], state.selected.title + "_" +(state.detailList.length+1) + "." + fieldName, {type: file.type})

        state.book.name = file.name
        state.book.file = file
        state.modifyList.push(false)

        this.setState(state)
    }

    handleUploadClick = (value) => {
        var state = this.state
        state.upload = value
        if(value === false) {
            state.book = {title:"", name:"선택 파일 없음", file:null}
        }
        this.setState(state)
    }

    handleTitleChange = (evt) => {
        var state = this.state;
        state.book.title = evt.target.value;
        this.setState(state);
    }

    handleRegister = async() => {
        var state = this.state
        if(state.book.title === "") {
            alert("제목을 입력해주세요")
            return;
        }

        if(state.book.file === null) {
            alert("등록할 파일을 선택해주세요")
            return;
        }

        const data = new FormData()

        var file = state.book.file
        var blob = file.slice(0, file.size, file.type)
        var newFile = new File([blob], state.selectedBook.title + "_" +(state.detailList.length+1) + ".pdf", {type: file.type})

        data.append("page_number", null)
        data.append("file", newFile)
        data.append("book_id", state.selectedBook.id)
        data.append("title", state.book.title)
        data.append("round", state.detailTotal+1)

        try {
            const res = await API.sendData(URL.api.register.bookDetail, data)
            if(res.status === 201) {
                var detail = res.data.detail
                state.detailList.push({file:detail.file, round:detail.round, title:detail.title, id: detail.id})
                state.book = {title:"", name:"선택 파일 없음", file:null}
                this.setState(state);
                alert("작품을 등록하였습니다!")
            }
        } catch(e) {
            alert("등록 실패하였습니다.")
        }
    }

    downloadAction = async(book_detail_id) => {
        const res = await API.sendGet(URL.api.book.download+ "/" + book_detail_id + "?type=" + "file");
        let downloadUrl = res.data.url;
        window.open(downloadUrl);
    }

    render() {
        var state = this.state;
        var bookList = state.bookList;
        var selectedBook = state.selectedBook;

        return (
            <div id="author-page" className="page2">
                <Helmet title={`${state.user.nickname} `+ string.author + string.postfix}/>
                {
                    (this.props.isHost === true && state.display === true) &&
                    <Modal
                        onClose={this.handleCloseClick}
                        pos={state.modalPos}
                    >
                        <div className="book-detail-modal">
                            <div className="book-detail-header">
                                <h3>{state.selectedBook.title}</h3>
                            </div>

                            <em className="close" onClick={this.handleCloseClick}> &times; </em>
                            {
                                state.selectedBook.is_finished_serialization === 0 &&
                                <button className="btn end-btn" onClick={() => this.handleFinishClick(state.selectedBook.id)}>연재완료</button>
                            }

                            <div className="table-wrap">
                                <table className="book-detail-table">
                                    <tbody>
                                        {
                                            state.detailList.map((detail, idx) => {
                                                return (
                                                    <tr key={idx} className="book-detail">
                                                        <td className="book-detail-idx"> <span> {detail.round}회차. </span> </td>
                                                        {
                                                            state.modifyList[idx] === true ?
                                                            <td className="book-detail-title">
                                                                <input className="box" value={detail.title} onChange={(evt) => this.handleDetailTitleChange(evt, idx)} placeholder={"제목을 입력해주세요"}/>
                                                            </td>
                                                            :
                                                            <td className="book-detail-title"> <span> {detail.title} </span></td>
                                                        }
                                                        {
                                                            parseInt(this.props.authorId) === state.user.id &&
                                                            <td className="icon">
                                                                {
                                                                    state.modifyList[idx] === false ?
                                                                    <em className="modify" onClick={() => this.handleModifyTitleClick(idx, true)}/>
                                                                    :
                                                                    <em className="confirm" onClick={() => this.handleConfirmClick(idx, detail.id)}/>
                                                                }
                                                            </td>
                                                        }
                                                        {
                                                            parseInt(this.props.authorId) === state.user.id &&
                                                            <td className="icon">
                                                                <input type="file" id={"book" + idx} onChange={(evt) => this.handleModifyFileClick(evt, idx)} accept=".pdf"/>
                                                                <label htmlFor={"book" + idx}>
                                                                    <em className="up"/>
                                                                </label>
                                                            </td>
                                                        }
                                                        {
                                                            parseInt(this.props.authorId) === state.user.id ?
                                                            <td className="icon">
                                                                <em className="download"  onClick={() => this.downloadAction(detail.id)}/>
                                                            </td>
                                                            :
                                                            !!detail.purchases.length ?
                                                            <td className="icon"> <em className="download"/> </td>
                                                            :
                                                            <td className="icon"> <em className="lock"/> </td>
                                                        }
                                                        {/*
                                                            parseInt(this.props.authorId) === state.user.id &&
                                                            <td className="icon">
                                                                <em className="x" onClick={() => this.handleDetailDelete(detail)}/>
                                                            </td>
                                                        */}
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {
                                state.selectedBook.is_finished_serialization === 0 && state.upload &&
                                <div className="upload">
                                    <div className="header">
                                        <h2>업로드</h2>
                                    </div>

                                    <span>
                                        {state.detailTotal+1}회차.
                                    </span>
                                    <div className="upload-info">
                                        <input className="title box" value={state.book.title} onChange={this.handleTitleChange} placeholder={"제목을 입력해주세요"}/>

                                        <div className="file-upload box">
                                            {state.book.name}
                                        </div>
                                        <input type="file" id="book" onChange={this.handleBookFileChange} accept=".pdf"/>
                                        <label htmlFor="book">
                                            <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                        </label>
                                    </div>
                                </div>
                            }
                            {
                                state.selectedBook.is_finished_serialization === 0 &&
                                (state.upload === true ?
                                    <div className="btn-wrap">
                                        <button className="btn btn-color-2" onClick={this.handleRegister}>
                                            완료
                                            </button>
                                            <button className="btn" onClick={() => this.handleUploadClick(false)}>
                                            취소
                                            </button>
                                    </div>
                                    :
                                    <button className="btn btn-block btn-bottom" onClick={() => this.handleUploadClick(true)}>
                                        + 새로운 회차 등록하기
                                    </button>
                                )
                            }

                        </div>
                    </Modal>
                }

                <div className={state.dock === true ? "tab-wrap tab-dock-top" : "tab-wrap"}>
                    <ul className="tab-nav">
                        <li className={"tab-btn " + (state.tab === "intro" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'intro')}>소개</li>
                        <li className={"tab-btn " + (state.tab === "book" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'book')}>작품</li>
                        <li className={"tab-btn " + (state.tab === "review" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'review')}>리뷰</li>
                    </ul>
                    <div className="tab-inner">
                        <div id="intro-area" className="inner-box" ref={this.introRef}>
                            <div className="inner-header">
                                소개
                                {
                                    (this.props.isHost === true) ?
                                    state.modify === true ?
                                    <span className="small" onClick={this.handleCompleteClick}>
                                        <em/>완료
                                    </span>
                                    :
                                    <span className="small" onClick={this.handleModifyClick}>
                                        <em/>수정
                                    </span>
                                    :
                                    null
                                }

                            </div>
                            <div className="inner-content">
                                {
                                    this.props.isHost === true ?
                                    <textarea className="intro" value={state.user.description === null ? '' : state.user.description} onChange={this.handleDescriptionChange} disabled={!state.modify}/>
                                    :
                                    <div className="intro"> {state.user.description === null ? '' : state.user.description} </div>
                                }
                            </div>
                        </div>

                        <div id="book-area" className="inner-box" ref={this.bookRef}>
                            <div className="inner-header">
                                <span> 작품 </span>
                                <div className="inner-subheader-wrap">
                                    <div className={this.state.active === 'a' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('a')}> 전체 </div>
                                    <div className={this.state.active === 'ser' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('ser')}> 연재중 </div>
                                    <div className={this.state.active === 'ser-ed' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('ser-ed')}> 연재완료 </div>
                                    <div className={this.state.active === 'pub' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('pub')}> 단행본</div>
                                    <div className={this.state.active === 'wait' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('wait')}> 미승인 </div>
                                </div>
                            </div>
                            <div className="inner-content">
                                {
                                    Object.keys(bookList).length === 0 || (state.active !== 'a' && !(state.active in bookList)) ?
                                    <div className="no-content">
                                        등록된 작품이 없습니다.
                                    </div>
                                    :
                                    Object.keys(bookList).map((status, n) => {
                                        return (
                                            (bookList[status].length !== 0 && (state.active === 'a' || state.active === status)) &&
                                            <div key={n} className="booklist-area">
                                                <ul>
                                                    {
                                                        bookList[status].map((item, idx) => {
                                                            item['status'] = status

                                                            return (
                                                                <Book
                                                                    key={item.id}
                                                                    book = {item}
                                                                    status = {status}
                                                                    isHost = {this.props.isHost}
                                                                    handleDisplayClick = {status !== "wait" ? this.handleDisplayClick : undefined}
                                                                    handleUpdate = {status !== "wait" ? this.handleUpdate : undefined}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {
                            <div id="review-area" className="inner-box" ref={this.reviewRef}>
                                <div className="inner-header">
                                    <span> 리뷰 </span>
                                    {
                                        this.state.reviewTitleList.length === 0 ?
                                        null
                                        :
                                        <div className="inner-subheader-wrap">
                                            <div className={"book-title " + (this.state.activeReview === 0 ? "active" : "")} onClick={() => this.handleReviewTitleClick(0, null)}> 전체 </div>
                                            {
                                                this.state.reviewTitleList.map((item, title_idx) => {
                                                    return (
                                                        <div key={item.book_id} className={"book-title " + (this.state.activeReview === (title_idx+1) ? "active" : "")} onClick={() => this.handleReviewTitleClick(title_idx+1, item.book_id)}> {item.book_title} </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                                <div className="inner-content">
                                    {
                                        this.state.reviewList.length === 0 ?
                                        <div className="no-content">
                                            작성된 리뷰가 없습니다.
                                        </div>
                                        :
                                        <div className="review-area">
                                            {
                                                this.state.reviewList.map((item, review_idx) => {
                                                    return (
                                                        <div key={item.id} className="review-box">
                                                            <div className="review-details">
                                                                <strong className="title"> {item.book_title}</strong>
                                                                <span className="user"> {item.nickname} </span>
                                                                <span className="sep">  | </span>
                                                                <span className="stars">
                                                                    {"★".repeat(item.score)}
                                                                </span>

                                                                <span className="score"> {item.score ? parseFloat(item.score).toFixed(1) : parseFloat(0).toFixed(1)} </span>
                                                            </div>
                                                            {
                                                                item.book_type === 1 &&
                                                                <div className="review-subtitle">
                                                                    {item.subtitle}
                                                                </div>
                                                            }

                                                            <div className="review-content">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                            {
                                                this.state.reviewList.length >= 5 &&
                                                <div className="add-btn">
                                                    <button className="add-btn btn btn-transparent"> + 더보기 </button>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Author;
