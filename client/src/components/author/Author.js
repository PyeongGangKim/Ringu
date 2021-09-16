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
            bookList: {},
            selected: {},

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

            modalPos:{},
            host: false,
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
            this.setState(state)
        }

        state.selected = book;

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
        var reviewData = reviewRes.data

        state.reviewList = reviewData.reviewList
        this.setState(state)
    }

    handleCloseClick = () => {
        var state = this.state;

        state.selected = {};
        state.detailList = [];
        state.display = false;
        this.setState(state)
    }

    handleModifyClick = () => {
        var state = this.state;
        state.modify = true;

        this.setState(state)
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

    handleDetailDelete = async(id) => {
        var state = this.state;

        const res = await API.sendDelete(URL.api.book_detail.delete + id)
        if(res.status === 200) {
            state.detailList = state.detailList.filter(item => {
                return item.id !== id
            })
            this.setState(state)
        } else {
            alert("삭제하지 못 했습니다.")
        }
    }

    downloadAction = async(book_detail_id) => {
        const res = await API.sendGet(URL.api.book.dowload+ "/" + book_detail_id + "?type=" + "file");
        let downloadUrl = res.data.url;
        window.open(downloadUrl);
    }

    render() {
        var state = this.state;
        var bookList = state.bookList;
        var selected = state.selected;

        return (
            <div id="author-page" className="page2">
                {
                    (this.props.isHost === true && state.display === true) &&
                    <Modal
                        onClose={this.handleCloseClick}
                        pos={state.modalPos}
                    >
                        <div className="book-detail-modal">
                            <div className="book-detail-header">
                                <h3>{state.selected.title}</h3>
                            </div>

                            <em className="close" onClick={this.handleCloseClick}> &times; </em>

                            <table className="book-details">
                                <tbody>
                                    {
                                        state.detailList.map((detail, idx) => {
                                            return (
                                                <tr key={idx} className="book-detail">
                                                    <td className="book-detail-idx"> <span> {idx+1}회차. </span> </td>
                                                    <td className="book-detail-title"> <span> {detail.title} </span></td>
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
                                                    {
                                                        parseInt(this.props.authorId) === state.user.id &&
                                                        <td className="icon">
                                                            <em className="modify"/>
                                                        </td>
                                                    }
                                                    {
                                                        parseInt(this.props.authorId) === state.user.id &&
                                                        <td className="icon">
                                                            <em className="x" onClick={() => this.handleDetailDelete(detail.id)}/>
                                                        </td>
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <button className="btn btn-block btn-bottom">
                                + 새로운 회차 등록하기
                            </button>
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
                                    <div className={this.state.active === 'wait' ? "inner-subheader active" : "inner-subheader"} onClick={()=>this.handleSubClick('wait')}> 승인 대기 중</div>
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


                        <div id="review-area" className="inner-box" ref={this.reviewRef}>
                            <div className="inner-header">
                                <span> 리뷰 </span>
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
                            </div>
                            <div className="inner-content">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Author;
