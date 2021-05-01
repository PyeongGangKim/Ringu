import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/favorite.scss';
import '../../scss/common/button.scss';
import '../../scss/common/book.scss';

class FavBook extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">컨텐츠 찜</h2>
                </div>

                <hr/>

                <div className="container">
                    <div id="favbooklist-area" className="booklist-area">
                        <ul>
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
        )
    }
}

export default FavBook;
