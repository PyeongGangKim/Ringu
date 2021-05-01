import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/favorite.scss';
import '../../scss/common/button.scss';

class FavBook extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">작가 찜</h2>
                </div>

                <hr/>

                <div className="container">
                    <div id="favauthor-area">
                        <div className="fa-box">
                            <div className="profile">
                                <div>
                                    <img src="/blank.jpg"/>
                                </div>

                                <span className="author-name">김은희</span>
                                &nbsp;작가
                            </div>

                            <div className="details">
                                <div className="stat-area">
                                    <span className="stat">
                                        <em className="heart"/>
                                        42,785
                                    </span>
                                    |
                                    <span  className="stat">
                                        <em className="star"/>
                                        4.9
                                    </span>
                                    |
                                    <span  className="stat">
                                        <em className="review"/>
                                        11개
                                    </span>
                                </div>

                                <div className="tip-area">
                                    <span className="tip">#생활/취미</span>
                                    <span className="tip">#글쓰기</span>
                                    <span className="tip">#자기계발</span>
                                </div>
                                <p className="description">
                                    드라마 대본으로 돈 버는 법 알려드립니다. 도깨비, 미스터 선샤인 다수의 히트작으로
                                    유명해진 프로페셔널한 대본쓰는 법 A부터 Z까지 전수해드립니다.
                                </p>
                            </div>

                            <div className="favorite">
                                <div className="favorite-icon">
                                    <img src="/heart.png"/>
                                </div>
                            </div>

                            <div className="detail">
                            >
                            </div>
                        </div>

                        <div className="fa-box">
                            <div className="profile">
                                <div>
                                    <img src="/blank.jpg"/>
                                </div>

                                <span className="author-name">김은희</span>
                                &nbsp;작가
                            </div>

                            <div className="details">
                                <div className="stat-area">
                                    <span className="stat">
                                        <em className="heart"/>
                                        42,785
                                    </span>
                                    |
                                    <span  className="stat">
                                        <em className="star"/>
                                        4.9
                                    </span>
                                    |
                                    <span  className="stat">
                                        <em className="review"/>
                                        11개
                                    </span>
                                </div>

                                <div className="tip-area">
                                    <span className="tip">#생활/취미</span>
                                    <span className="tip">#글쓰기</span>
                                    <span className="tip">#자기계발</span>
                                </div>
                                <p className="description">
                                    드라마 대본으로 돈 버는 법 알려드립니다. 도깨비, 미스터 선샤인 다수의 히트작으로
                                    유명해진 프로페셔널한 대본쓰는 법 A부터 Z까지 전수해드립니다.
                                </p>
                            </div>

                            <div className="favorite">
                                <div className="favorite-icon">
                                    <img src="/heart.png"/>
                                </div>
                            </div>

                            <div className="detail">
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default FavBook;
