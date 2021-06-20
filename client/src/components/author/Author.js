import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/author/author.scss';
import '../../scss/book/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Author extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
        console.log(userInfo)

        this.state = {
            hash: props.hash.substring(1, props.hash.length),
            bookList:[],
            user: {},
        }
    }

    async componentDidMount() {
        var state = this.state;

        var params = {
            author_id: User.getInfo().id,
        }

        const res = await API.sendGet(URL.api.book.list, params = params)
        var bookList = res.data.bookList

        const userRes = await API.sendGet(URL.api.member.get, params = {id: User.getInfo().id})
        var user = userRes.data.user

        /*for(var i=0; i<favoriteList.length; i++) {
            favoriteList[i].book = {}

            var book;

            if(favoriteList[i].type === 1) {
                book = await API.sendGet(URL.api.book.serialization + favoriteList[i].serialization_book_id)
                favoriteList[i].book = book.data.serializationBook;
            } else {
                book = await API.sendGet(URL.api.book.singlePublished + favoriteList[i].single_published_book_id)
                favoriteList[i].book = book.data.singlePublishedBook;
            }



            const author = await API.sendGet(URL.api.author.get + favoriteList[i].book.author_id)
            favoriteList[i].author = author.data.result;
        }*/

        state.bookList = bookList
        state.user = user

        this.setState(state)
    }

    render() {
        var bookList = this.state.bookList
        var state = this.state;

        return (
            <div id="author-page" className="page2">
                <div className="tab-wrap">
                    <div className="tab-nav">
                        <a href="#intro" className={"tab-btn " + (state.hash == "intro" ? "active" : "")}>소개</a>
                        <a href="#book" className={"tab-btn " + (state.hash == "book" ? "active" : "")}>작품</a>
                        <a href="#review" className={"tab-btn " + (state.hash == "review" ? "active" : "")}>리뷰</a>
                    </div>
                </div>

                <div className="tab-inner">
                    <div id="intro-area" className="inner-box ">
                        <div className="inner-header"> 소개</div>
                        <div className="inner-content">
                            <div className="intro">
                                {state.user.description ? state.user.description : "" }
                            </div>
                        </div>

                    </div>

                    <div id="book-area" className="inner-box">
                        <div className="inner-header"> 작품</div>
                        <div className="inner-content">
                            <div className="booklist-area">
                                <ul>
                                    {
                                        bookList.map(item => {
                                            return (
                                                <li className="book-box">
                                                    <div className="thumbnail-box">
                                                        <div className="img-area">
                                                            <img src="/travel.jpg"/>
                                                        </div>

                                                        <h3 className="title">{item.title}</h3>
                                                    </div>

                                                    <div className="book-info">
                                                        <span className="price">{parse.numberWithCommas(item.price)}원</span>
                                                        <div className="details">
                                                            <div className="author-info">
                                                                <span className="author-label"> 작가 </span>
                                                                <span> {item.author_nickname} </span>
                                                            </div>
                                                            <div className="review-info">
                                                                <span className="star"> ★ </span>
                                                                <span> 5.0 </span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>

                        </div>
                    </div>


                    <div id="review-area" className="inner-box" >
                        <div className="inner-header">
                            <span> 리뷰 </span>
                            <div className="review-book-list">
                                <div className="book-title active"> 전체 </div>
                                <div className="book-title"> 파워블로그 만들기 </div>
                                <div className="book-title"> 대학원 진학 준비 과정 노하우</div>
                            </div>
                        </div>
                        <div className="inner-content final">
                            <div className="review-area">
                                <div className="review-box">
                                    <div className="review-details">
                                        <strong className="title"> 파워블로그 만들기</strong>
                                        <span className="user"> jih* </span>
                                        <span className="sep">  | </span>
                                        <span className="stars"> ★ ★ ★ ★ ★ </span>
                                        <span className="score"> 5.0 </span>
                                    </div>
                                    <div className="review-content">
                                        리뷰 입니다
                                    </div>
                                </div>

                                <div className="review-box">
                                    <div className="review-details">
                                        <strong className="title"> 파워블로그 만들기</strong>
                                        <span className="user"> jih* </span>
                                        <span className="sep">  | </span>
                                        <span className="stars"> ★ ★ ★ ★ ★ </span>
                                        <span className="score"> 5.0 </span>
                                    </div>
                                    <div className="review-content">
                                        리뷰 입니다
                                    </div>
                                </div>

                                <div className="add-btn">
                                    <button className="add-btn btn btn-transparent"> + 더보기 </button>
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
