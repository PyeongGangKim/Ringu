import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/search/search.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'


class Search extends Component {
    constructor(props) {
        super(props);

    }
    render() {

        return (
            <div id="wrap">
                <div id="search" className="page1">
                    <div className="title-wrap">
                        <h2 className="title">{"'여행'"} 검색 결과</h2>
                    </div>

                    <div className="filter-area">
                        <div className="filter">
                            <span> 카테고리</span>
                            <img src="/arrow_down.png" style={{width: "15px", height: "10px", marginLeft: "10px"}}/>
                        </div>
                        <div className="filter">
                            <span> 정렬</span>
                            <img src="/arrow_down.png" style={{width: "15px", height: "10px", verticalAlign: "middle", marginLeft: "10px"}}/>
                        </div>
                    </div>

                    <div id="search-list" className="booklist-area">
                        <ul>
                            <li className="book-box">
                                <div className="thumbnail-box">
                                    <div className="img-area">
                                        <img src="/travel.jpg"/>
                                    </div>
                                    <div className="favorite-icon"/>

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
                                    <div className="favorite-icon on"/>

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
                                    <div className="favorite-icon on"/>

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
                                    <div className="favorite-icon on"/>

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
                                    <div className="favorite-icon on"/>

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
                                    <div className="favorite-icon on"/>

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

export default Search;
