// 단행본
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/book/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

// 단행본
class BookType2 extends Component {
    constructor(props) {
        super(props)
        this.introRef = React.createRef();
        this.authorRef = React.createRef();
        this.contentRef = React.createRef();
        this.reviewRef = React.createRef();

        this.state = {
            book: props.book,
            reviewList: [],
            tab: 'intro',
            tabChange: false,
            dock: false,
        }
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.review.getReivewList, {title : false, book_id: state.book.id})

        if(res.status === 200) {
            state.reviewList = res.data.reviewList
            this.setState(state)
        }

        window.addEventListener('scroll', this.handleScroll)

        if (window.scrollY > 650) {
            state.dock = true;
        } else {
            state.dock = false;
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
        const tabHeight = 60;

        this.setState({tab: value, tabChange: true})
        window.removeEventListener('scroll', this.handleScroll)

        if (value === 'intro') {
            window.scrollTo({
                top: this.introRef.current.offsetTop - tabHeight,
            })
        } else if (value === 'author') {
            window.scrollTo({
                top: this.authorRef.current.offsetTop - tabHeight,
            })
        } else if (value === 'content'){
            window.scrollTo({
                top: this.contentRef.current.offsetTop - tabHeight,
            })
        }
        else {
            window.scrollTo({
                top: this.reviewRef.current.offsetTop - tabHeight,
            })
        }
    }

    handleScroll = (event) => {
        const tabHeight = 60;
        var state = this.state;

        const scrollTop = ('scroll', event.srcElement.scrollingElement.scrollTop);
        if (scrollTop > 650) {
            state.dock = true;
        } else {
            state.dock = false;
        }

        if(state.tabChange === true) {
            state.tabChange = false
            this.setState(state);
            return;
        }

        if (scrollTop >= this.reviewRef.current.offsetTop - tabHeight) {
            state.tab = 'review';
        }
        else if (scrollTop >= this.contentRef.current.offsetTop - tabHeight) {
            state.tab = 'content';
        }
        else if (scrollTop >= this.authorRef.current.offsetTop - tabHeight) {
            state.tab = 'author';
        }
        else {
            state.tab = 'intro';
        }

        this.setState(state);
    }

    render() {
        var state = this.state;
        var book = state.book;

        return (
            <div id="book" className="page3" >
                <div className="book-content">
                    <div className="book-info">
                        <div className="book-thumbnail-box">
                            <img src={!!state.book.img ? state.book.img : "/ringu_thumbnail.png" } />
                        </div>

                        <div className="book-detail-box">
                            <span className="book-detail">저자 : {book.author_nickname}</span>
                            <span className="book-detail">페이지수 : {book.page_number}페이지</span>
                        </div>

                        <h3 className="book-title">{book.title}</h3>
                    </div>

                    <div className={state.dock === true ? "tab-wrap tab-dock-top" : "tab-wrap"}>
                        <ul className="tab-nav">
                            <li className={"tab-btn " + (state.tab === "intro" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'intro')}>책소개</li>
                            <li className={"tab-btn " + (state.tab === "content" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'content')}>목차</li>
                            <li className={"tab-btn " + (state.tab === "author" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'author')}>작가소개</li>
                            <li className={"tab-btn " + (state.tab === "review" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'review')}>리뷰</li>
                        </ul>
                        <div className="tab-inner">
                            <div id="intro-area" className="inner-box" ref={this.introRef}>
                                <div className="inner-header"> 책소개</div>
                                <div className="inner-content">
                                    {book.description}
                                </div>
                            </div>

                            <div id="content-area" className="inner-box" ref={this.contentRef}>
                                <div className="inner-header"> 목차</div>
                                <div className="inner-content">

                                </div>
                            </div>

                            <div id="author-area" className="inner-box" ref={this.authorRef}>
                                <div className="inner-header"> 작가소개</div>
                                <div className="inner-content">
                                    <div className="author-box">
                                        <div className="author-profile">
                                            <Link to={URL.service.author + book.author_id}>
                                                <div className="author-thumbnail-box">
                                                    <img src="/blank.jpg" style={{width:"100px", height:"100px", textAlign:"center", borderRadius:"50%"}}/>
                                                </div>

                                                <div className="btn btn-block btn-color-2 btn-rounded">작가 공간</div>
                                            </Link>
                                        </div>

                                        <div className="author-description">
                                            {book.author_description}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="review-area" className="inner-box" ref={this.reviewRef}>
                                <div className="inner-header"> 리뷰</div>
                                <div className="inner-content review">
                                    <div className="review-header">
                                        <div className="review-score">
                                            {book.review_score ? (book.review_score).toFixed(1) : 0.0}
                                        </div>
                                        <div className="review-star">
                                            <em className={book.review_score >= 1 ? "on" : "off"}/>
                                            <em className={book.review_score >= 2 ? "on" : "off"}/>
                                            <em className={book.review_score >= 3 ? "on" : "off"}/>
                                            <em className={book.review_score >= 4 ? "on" : "off"}/>
                                            <em className={book.review_score >= 5 ? "on" : "off"}/>
                                            <div style={{fontSize: "12px"}}>{book.review_count ? book.review_count : 0} 개의 후기</div>
                                        </div>

                                    </div>
                                    <div className="review-box" style={{marginLeft:"10px"}}>
                                        {
                                            state.reviewList.map(item => {
                                                return (
                                                    <div className="review-item" >
                                                        <div style={{marginBottom: "15px"}}>
                                                            <span style={{fontSize:"12px"}}> {item.author} </span>
                                                            <span style={{fontSize:"12px", color:"#ccc", margin: "0 10px"}}> | </span>
                                                            <em className={item.score >= 1 ? "on" : "off"}/>
                                                            <em className={item.score >= 2 ? "on" : "off"}/>
                                                            <em className={item.score >= 3 ? "on" : "off"}/>
                                                            <em className={item.score >= 4 ? "on" : "off"}/>
                                                            <em className={item.score >= 5 ? "on" : "off"}/>
                                                        </div>
                                                        <span>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        state.reviewList.length === 4 &&
                                        <div className="btn-box" >
                                            <button>+ 더보기</button>
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

export default BookType2;
