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

class BookType1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            book: props.book,
            reviewList: [],
            detailList: [],
        }
    }

    async componentDidMount() {
        var state = this.state;
        let userInfo = User.getInfo();
        const res1 = await API.sendGet(URL.api.review.getByBook + state.book.id)

        if(res1.status === 200) {
            state.reviewList = res1.data.reviewList
            this.setState(state)
        }

        var params = {
            member_id : userInfo.id
        }
        const res2 = await API.sendGet(URL.api.book.getDetailList + state.book.id, params)
        if(res2.status === 200) {
            state.detailList = res2.data.detailList
            this.setState(state)
        }

        console.log(res2)
    }

    render() {
        var state = this.state;
        var book = state.book;

        return (
            <div id="book" className="page3" >
                <div className="book-content">
                    <div className="book-info">
                        <div className="book-thumbnail-box">
                            <img src={state.book.img} />
                        </div>

                        <div className="book-detail-box">
                            <span className="book-detail">저자 : {book.author_nickname}</span>
                            <span className="book-detail">페이지수 : {book.page_number}</span>
                        </div>

                        <h3 className="book-title">{book.title}</h3>

                    </div>

                    <div className="book-nav">
                        <div className="navlist">
                            <a href="#book" className="navitem">책소개</a>
                            <a href="#contents" className="navitem">회차</a>
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
                                <div className="content-header"> 회차</div>
                                <table className="content-value">
                                    {
                                        state.detailList.map((item, i) => {
                                            return (
                                                <tr>
                                                    <td>{i+1}회차.</td>
                                                    <td>{item.title}</td>
                                                    <td><em className={item.purchases.length ? "download" : "lock"}/></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </table>
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
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookType1;
