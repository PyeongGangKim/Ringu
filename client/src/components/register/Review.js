import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/review.scss';

class Review extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        let state = this.state

        return (
            <div id="review-area" className="page3">
                <div>
                    <div className="review-box">
                        <div className="thumbnail-box">
                            <img src="/travel.jpg"/>
                        </div>
                        <div className="book-info">
                            <div>
                                <h3 className="title">책제목입니다</h3>

                                <div className="info">
                                    <span className="label">작가</span>
                                    <strong className="value">작가1</strong>

                                    <span className="label">출간방식</span>
                                    <strong className="value">월간연재</strong>
                                </div>
                            </div>
                            <div className="price">
                                8,000 원
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <h3>별점</h3>
                        <img src="star.png"/>
                        <img src="star.png"/>
                        <img src="star.png"/>
                        <img src="star.png"/>
                        <img src="star.png"/>
                    </div>

                    <div className="row">
                        <h3>리뷰</h3>
                        <textarea rows={7} placeholder="책에 대한 간단한 리뷰를 작성해주세요."/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Review;
