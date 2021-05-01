import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/button.scss'


class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        };
    }

    render() {

        return (
            <div id="wrap">
                <div id="home-header">
                    <div id="home-header-content">
                        <div className="search-area">
                            <strong>당신이 찾는 모든 것들의 공간</strong>
                            <p>당신이 찾는 모든 것들의 공간</p>
                            <div className="search">
                                <input type="text" maxLength="15" autocomplete="off"/>
                                <button type="submit"> 검색 </button>
                            </div>
                        </div>
                        
                    </div>
                </div>


                <div id="home" className="page1">
                    <div className="title-wrap">
                        <h2> 인기있는 주제 </h2>
                    </div>

                    <div id="categorylist-area" className="list-area">

                        <div className="category-list">
                            <div className="category-item">
                                <div className="category-content">
                                    <img src="/icon-cook.png"/>
                                    <span className="category-sub">요리</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="title-wrap">
                        <h2> 여행 </h2>
                        <span> 더보기 </span>
                    </div>

                    <div className="booklist-area">
                        <ul>
                            <li className="book-box">
                                <div className="thumbnail-box">
                                    <div className="img-area">
                                        <img src="/travel.jpg"/>
                                    </div>

                                    <h3 className="title">책 제목입니다</h3>
                                </div>

                                <div className="book-info">
                                    <span className="price">{"9,000"}원</span>
                                    <div className="details">
                                        <div className="author-info">
                                            <span className="author-label"> 작가 </span>
                                            <span> 홍이 </span>
                                        </div>
                                        <div className="review-info">
                                            <span className="star"> ★ </span>
                                            <span> 5.0 </span>
                                        </div>

                                    </div>

                                </div>
                            </li>

                            <li className="book-box">
                                <div className="thumbnail-box">
                                    <div className="img-area">
                                        <img src="/travel.jpg"/>
                                    </div>

                                    <h3 className="title">책 제목입니다</h3>
                                </div>

                                <div className="book-info">
                                    <span className="price">{"9,000"}원</span>
                                    <div className="details">
                                        <div className="author-info">
                                            <span className="author-label"> 작가 </span>
                                            <span> 홍이 </span>
                                        </div>
                                        <div className="review-info">
                                            <span className="star"> ★ </span>
                                            <span> 5.0 </span>
                                        </div>

                                    </div>

                                </div>
                            </li>

                            <li className="book-box">
                                <div className="thumbnail-box">
                                    <div className="img-area">
                                        <img src="/travel.jpg"/>
                                    </div>

                                    <h3 className="title">책 제목입니다</h3>
                                </div>

                                <div className="book-info">
                                    <span className="price">{"9,000"}원</span>
                                    <div className="details">
                                        <div className="author-info">
                                            <span className="author-label"> 작가 </span>
                                            <span> 홍이 </span>
                                        </div>
                                        <div className="review-info">
                                            <span className="star"> ★ </span>
                                            <span> 5.0 </span>
                                        </div>

                                    </div>

                                </div>
                            </li>

                            <li className="book-box">
                                <div className="thumbnail-box">
                                    <div className="img-area">
                                        <img src="/travel.jpg"/>
                                    </div>

                                    <h3 className="title">책 제목입니다</h3>
                                </div>

                                <div className="book-info">
                                    <span className="price">{"9,000"}원</span>
                                    <div className="details">
                                        <div className="author-info">
                                            <span className="author-label"> 작가 </span>
                                            <span> 홍이 </span>
                                        </div>
                                        <div className="review-info">
                                            <span className="star"> ★ </span>
                                            <span> 5.0 </span>
                                        </div>

                                    </div>

                                </div>
                            </li>

                            <li className="book-box">
                                <div className="thumbnail-box">
                                    <div className="img-area">
                                        <img src="/travel.jpg"/>
                                    </div>

                                    <h3 className="title">책 제목입니다</h3>
                                </div>

                                <div className="book-info">
                                    <span className="price">{"9,000"}원</span>
                                    <div className="details">
                                        <div className="author-info">
                                            <span className="author-label"> 작가 </span>
                                            <span> 홍이 </span>
                                        </div>
                                        <div className="review-info">
                                            <span className="star"> ★ </span>
                                            <span> 5.0 </span>
                                        </div>

                                    </div>

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
