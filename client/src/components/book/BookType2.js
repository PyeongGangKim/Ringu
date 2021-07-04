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

class BookType2 extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
        this.state = {
            book: props.book,
            reviewList: [],
        }
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.review.getByBook + state.book.id)
        console.log(state.book)

        if(res.status === 200) {
            state.reviewList = res.data.reviewList
            this.setState(state)
        }
    }

    render() {
        var state = this.state;
        var book = state.book;

        return (
            <div id="book" className="page3" >
                <div className="book-content">
                    <div className="book-info">
                        <div className="book-thumbnail-box">
                            <img src="/travel.jpg" />
                        </div>

                        <div className="book-detail-box">
                            <span className="book-detail">저자 : {book.author_nickname}</span>
                            <span className="book-detail">페이지수 60페이지</span>
                        </div>

                        <h3 className="book-title">{book.title}</h3>

                    </div>

                    <div className="book-nav">
                        <div className="navlist">
                            <a href="#book" className="navitem">책소개</a>
                            <a href="#contents" className="navitem">목차</a>
                            <a href="#author" className="navitem">작가소개</a>
                            <a href="#review" className="navitem">리뷰</a>
                        </div>
                    </div>

                    <div className="book-content">
                        <a name="book">
                            <div className="content-box" >
                                <div className="content-header"> 책소개</div>
                                <div className="content-value book">
                                    {book.description}
                                </div>
                            </div>
                        </a>

                        <a name="contents">
                            <div className="content-box" >
                                <div className="content-header"> 목차</div>
                                <div className="content-value contents">
                                    {book.content}
                                </div>
                            </div>
                        </a>

                        <a name="author">
                            <div className="content-box" >
                                <div className="content-header"> 작가 소개</div>
                                <div className="content-value author">
                                    <div className="author-box">
                                        <div className="author-profile">
                                            <div className="author-thumbnail-box">
                                                <img src="/blank.jpg" style={{width:"100px", height:"100px", textAlign:"center", borderRadius:"50%"}}/>
                                            </div>
                                            <Link to={URL.service.author + book.author_id}>
                                                <div className="btn btn-block btn-color-2 btn-rounded">작가 공간</div>
                                            </Link>
                                        </div>

                                        <div className="author-description">
                                            {book.author_description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>

                        <a name="review">
                            <div className="content-box">
                                <div className="content-header">
                                    <span> 리뷰 </span>
                                </div>

                                <div className="content-value review">
                                    <div className="review-header">
                                        <div className="review-score">
                                            {(book.review_score).toFixed(1)}
                                        </div>
                                        <div className="review-star">
                                            <em className={book.review_score >= 1 ? "on" : "off"}/>
                                            <em className={book.review_score >= 2 ? "on" : "off"}/>
                                            <em className={book.review_score >= 3 ? "on" : "off"}/>
                                            <em className={book.review_score >= 4 ? "on" : "off"}/>
                                            <em className={book.review_score >= 5 ? "on" : "off"}/>
                                            <div style={{fontSize: "12px"}}>{book.review_count} 개의 후기</div>
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
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookType2;
