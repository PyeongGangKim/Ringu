import React, { Component, Fragment } from 'react';

import User from '../../utils/user';
import Book from '../../components/book/Book'
import Paging from '../../components/common/Paging'
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/common/common.scss';
import '../../scss/common/input.scss';
import '../../scss/common/tab.scss';
import '../../scss/author/author.scss';
import '../../scss/book/book.scss';

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
            modifyDetail: -1,
            modifyDetailId: -1,
            upload: false,

            oldIdx: -1,
            oldTitle: '',
            detailPage: 1,

            modalPos:{},
            host: false,
            book: {title:"", filename:"선택 파일 없음", file:null},
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
                console.log(bookList)
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

                if(waitingList.length !== 0 && state.user.id === parseInt(this.props.authorId)) {
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
            if (window.scrollY > 100) {
                this.state.dock = true;
            } else {
                this.state.dock = false;
            }

            this.setState(this.state)
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

    handleDisplayClick = async(e, book, idx) => {
        var x = e.pageX - 100;
        var y = e.pageY + 50;
        var state = this.state;
        var display = true

        var params = {
            member_id : this.props.authorId,
            limit: 5,
            offset: 0,
        }

        const res = await API.sendGet(URL.api.book.getDetailList + book.id, params)
        if(res.status === 200) {
            var detailList = res.data.detailList
            state.detailList = detailList
            state.detailTotal = res.data.total.count
            state.modifyDetail = -1;
            state.modifyDetailId = -1;
            state.oldIdx = -1;
            state.oldTitle = '';
            this.setState(state)
        }

        state.selectedBook = book;

        //var modalRoot = document.getElementById('modal-root')
        //modalRoot.style.cssText = `top:${coordY}px; left:${coordX}px;`

        state.modalPos = {x: x, y: y}

        state.display = true
        state.detailPage = 1;
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
        state.upload = false;
        this.setState(state)
    }

    handleFinishClick = async(book_id) => {
        var state = this.state;
        var book = state.selectedBook;
        var params = {
            is_finished_serialization: 1,
            book_id: book_id
        }

        if(window.confirm('연재를 종료하시겠습니까?')) {
            try {
                const res = await API.sendPut(URL.api.book.put, params, 'application/json')
                if(res.status === 200) {
                    state.display = false;
                    if(typeof state.bookList['ser-ed'] === 'undefined') {
                        state.bookList['ser-ed'] = [book]
                    } else {
                        state.bookList['ser-ed'].push(book)
                    }

                    var newArray = state.bookList['ser'].filter(item => item.id !== book.id)
                    state.bookList['ser'] = newArray
                    state.display = false
                    this.setState(state)
                }
            } catch(e) {
                console.error(e)
                alert("작업을 완료하지 못 했습니다. 잠시 후에 다시 시도해주세요.")
            }
        }
    }

    handleModifyDetailClick = (idx, detail_id) => {
        var state = this.state;
        if(state.oldIdx >= 0) {
            state.detailList[state.oldIdx].title = state.oldTitle;
        }
        state.upload = false;
        state.modifyDetail = idx;
        state.modifyDetailId = detail_id;
        state.oldIdx = idx;
        state.oldTitle = state.detailList[idx].title;
        state.book = {title:"", name:"선택 파일 없음", file:null};

        this.setState(state);
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

    handleModifyClick = () => {
        var state = this.state;
        state.modify = true;

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

    handleModifyFileClick = async(evt, idx) => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            state.book.filename = '선택 파일 없음';
            state.book.file = null;
            this.setState(state);
            return;
        }

        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF 파일만 업로드 해주세요.')
            return;
        }

        state.book.filename = file.name;
        state.book.file = file;

        this.setState(state);
    }

    handleBookFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            state.book.filename = "선택 파일 없음"
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

        state.book.filename = file.name
        state.book.file = file

        this.setState(state)
    }

    handleUploadClick = (value) => {
        var state = this.state
        state.upload = value
        if(value === false) {
            if(state.oldIdx >= 0) {
                state.detailList[state.oldIdx].title = state.oldTitle;
            }
            state.modifyDetail = -1;
            state.modifyDetailId = -1;
            state.oldIdx = -1;
            state.oldTitle = '';
            state.book = {title:"", name:"선택 파일 없음", file:null}
        }
        this.setState(state)
    }

    handleTitleChange = (evt, idx) => {
        var state = this.state;
        if(idx < 0) {
            state.book.title = evt.target.value;
        } else {
            state.detailList[idx].title = evt.target.value;
        }

        this.setState(state);
    }

    handleRegister = async() => {
        var state = this.state;
        if(state.upload) {
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
            var newFile = new File([blob], state.selectedBook.title + "_" +(state.detailTotal+1) + ".pdf", {type: file.type})

            data.append("page_number", null)
            data.append("file", newFile)
            data.append("book_id", state.selectedBook.id)
            data.append("title", state.book.title)
            data.append("round", state.detailTotal+1)

            try {
                const res = await API.sendData(URL.api.register.bookDetail, data)
                if(res.status === 201) {
                    var detail = res.data.detail
                    state.book = {title:"", name:"선택 파일 없음", file:null}
                    state.detailTotal = state.detailTotal + 1
                    state.upload = false;
                    this.handlePageChange(1);
                    alert("작품을 등록하였습니다!")
                    this.setState(state);
                }
            } catch(e) {
                alert("등록 실패하였습니다.")
            }
        }
        else {
            var idx = state.modifyDetail;
            var detail_id = state.modifyDetailId;
            var selectedDetail = state.detailList[idx]

            if(state.book.file === null && state.oldTitle === selectedDetail.title) {
                state.modifyDetail = -1;
                state.modifyDetailId = -1;
                state.oldIdx = -1;
                state.oldTitle = '';
                this.setState(state);
                return;
            }

            if(selectedDetail.title === "") {
                alert("제목을 입력해주세요")
                return;
            }

            const data = new FormData()
            data.append("id", state.modifyDetailId)

            if(state.book.file !== null) {
                var file = state.book.file;
                var blob = file.slice(0, file.size, file.type);
                var newFile = new File([blob], state.selectedBook.title + "_" + (selectedDetail.round) + "." + ".pdf", {type: file.type})
                data.append("file", newFile)
            }

            if(state.oldTitle !== selectedDetail.title) {
                data.append("title", selectedDetail.title)
            }

            try {
                const res = await API.sendPut(URL.api.book_detail.modify, data, 'multipart/form-data')
                if(res.status === 200) {
                    state.modifyDetail = -1;
                    state.modifyDetailId = -1;
                    state.oldIdx = -1;
                    state.oldTitle = '';
                    alert("수정을 완료하였습니다!")

                    this.setState(state);
                }
            } catch(e) {
                console.error(e)
                alert("수정을 완료하지 못했습니다. 잠시 후에 다시 시도해주세요.")
            }
        }
    }

    downloadAction = async(book_detail_id) => {
        const res = await API.sendGet(URL.api.book.download+ "/" + book_detail_id + "?type=" + "file");
        let downloadUrl = res.data.url;
        window.open(downloadUrl);
    }

    handlePageChange = async(page) => {
        var state = this.state;
        var params = {
            member_id : this.props.authorId,
            offset: (page - 1) * 5,
            limit: 5,
        }

        try {
            const res = await API.sendGet(URL.api.book.getDetailList + state.selectedBook.id, params)
            if(res.status === 200) {
                var detailList = res.data.detailList
                state.detailList = detailList
                state.modifyDetail = -1;
                state.modifyDetailId = -1;
                state.oldIdx = -1;
                state.oldTitle = '';
                state.detailPage = page;
                this.setState(state)
            }
        } catch(e) {
            console.error(e)
            alert("오류가 발생했습니다. 잠시 후에 다시 시도해주세요.");
        }
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

                            <div className="table-wrap">
                                <table className="book-detail-table">
                                    <tbody>
                                        {
                                            state.detailList.map((detail, idx) => {
                                                return (
                                                    <tr key={idx} className="book-detail">
                                                        <td className="book-detail-idx"> <span> {detail.round}회차. </span> </td>
                                                        {
                                                            state.modifyDetail === idx ?
                                                            <td colSpan={3}>
                                                                <div className="upload-info">
                                                                    <input className="title box" value={detail.title} onChange={(evt) => this.handleTitleChange(evt, idx)} placeholder={"제목을 입력해주세요"}/>

                                                                    <input type="file" id={"book" + idx} onChange={(evt) => this.handleModifyFileClick(evt, idx)} accept=".pdf"/>
                                                                    <label htmlFor={"book" + idx}>
                                                                        <div className="file-upload box">
                                                                            {state.modifyDetail === idx && state.book.file !== null ? state.book.filename : detail.file}
                                                                        </div>
                                                                        <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                            :
                                                            <td className="book-detail-title"> <span> {detail.title} </span></td>
                                                        }
                                                        {
                                                            parseInt(this.props.authorId) === state.user.id && state.modifyDetail !== idx &&
                                                            <td className="icon">
                                                                <em className="modify" onClick={() => this.handleModifyDetailClick(idx, detail.id)}/>
                                                            </td>
                                                        }
                                                        {
                                                            state.modifyDetail !== idx && (
                                                                parseInt(this.props.authorId) === state.user.id ?
                                                                <td className="icon">
                                                                    <em className="download"  onClick={() => this.downloadAction(detail.id)}/>
                                                                </td>
                                                                :
                                                                !!detail.purchased_id ?
                                                                <td className="icon"> <em className="download"/> </td>
                                                                :
                                                                <td className="icon"> <em className="lock"/> </td>
                                                            )
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <Paging
                                    count={state.detailTotal}
                                    page={state.detailPage}
                                    perPage={5}
                                    onChange={this.handlePageChange}
                                />
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
                                        <input className="title box" value={state.book.title} onChange={(evt) => this.handleTitleChange(evt, -1)} placeholder={"제목을 입력해주세요"}/>

                                        <input type="file" id="book" onChange={this.handleBookFileChange} accept=".pdf"/>
                                        <label htmlFor="book">
                                            <div className="file-upload box">
                                                {state.book.filename}
                                            </div>
                                            <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                        </label>
                                    </div>
                                </div>
                            }
                            {
                                state.selectedBook.is_finished_serialization === 0 &&
                                (state.upload === true || state.modifyDetail >= 0 ?
                                    <div className="btn-wrap">
                                        <button className="btn btn-color-2" onClick={this.handleRegister}>
                                            완료
                                            </button>
                                            <button className="btn" onClick={() => this.handleUploadClick(false)}>
                                            취소
                                            </button>
                                    </div>
                                    :
                                    <div className="btn-wrap">
                                        {
                                            state.selectedBook.is_finished_serialization === 0 &&
                                            <button className="btn end-btn" onClick={() => this.handleFinishClick(state.selectedBook.id)}>연재완료</button>
                                        }
                                        <button className="btn btn-block btn-bottom" onClick={() => this.handleUploadClick(true)}>
                                            + 새로운 회차 등록하기
                                        </button>
                                    </div>
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
                                    this.props.isHost === true && (state.modify === true) ?
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
                                    {
                                        state.user.id === parseInt(this.props.authorId) &&
                                        <div className={this.state.active === 'wait' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('wait')}> 미승인 </div>
                                    }
                                    
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
                                            <div key={n} className="book-area">
                                                <div className="container">
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
                                                </div>
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