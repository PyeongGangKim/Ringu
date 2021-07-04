import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/review.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            book: {},
            book_detail: this.props.book_detail,
            isSuccess: false,
            score: 0,
            description: '',
        }
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.book.getByDetail + state.book_detail)
        if(res.status === 200)
        {
            var book = res.data.book
            state.book = book
            state.isSuccess = true
            this.setState(state)
        }
    }

    handleScoreChange = (idx) => {
        var state = this.state
        state.score = idx;
        this.setState(state)
    }

    handleDescriptionChange = (evt) => {
        var state = this.state
        state.description = evt.target.value
        this.setState(state)
    }

    handleSubmit = async() => {
        var state = this.state;

        if(state.score === 0) {
            alert("별점을 입력해주세요.");
            return;
        }

        if(state.description === '') {
            alert("리뷰를 입력해주세요.");
            return;
        }

        if(state.description.length < 0) {
            alert("리뷰를 10자 이상 입력해주세요.");
            return;
        }

        var params = {
            book_detail_id: state.book_detail,
            score: state.score,
            description: state.description
        }

        const res = await API.sendPost(URL.api.review.register, params)
        if(res.status === 200) {
            alert("작성하신 리뷰가 등록되었습니다.")
            window.location.href = URL.service.mypage.purchases;
        } else if(res.status === 409){
            alert("이미 리뷰를 작성하셨습니다.")
            window.location.href = URL.service.mypage.purchases;
        } else {
            alert("리뷰를 등록하지 못하였습니다.")
        }
    }

    render() {
        var state = this.state

        return (
            state.isSuccess &&
            <div id="review" className="page3">
                <div>
                    <div className="review-box">
                        <div className="thumbnail-box">
                            <img src="/travel.jpg"/>
                        </div>
                        <div className="book-info">
                            <div>
                                <h3 className="title">{state.book.title}</h3>
                                <h4 className="subtitle">{state.book.subtitle}</h4>

                                <div className="info">
                                    <span className="label">작가</span>
                                    <strong className="value">{state.book.author}</strong>

                                    <span className="label">출간방식</span>
                                    <strong className="value">{state.book.type === 1 ? "연재" : "단행본"}</strong>
                                </div>
                            </div>
                            <div className="price">
                                {parse.numberWithCommas(state.book.price)} 원
                            </div>
                        </div>
                    </div>

                    <div className="rate row">
                        <h3>별점</h3>
                        <em className={state.score >= 1 ? "on" :"off"} onClick={() => this.handleScoreChange(1)}/>
                        <em className={state.score >= 2 ? "on" :"off"} onClick={() => this.handleScoreChange(2)}/>
                        <em className={state.score >= 3 ? "on" :"off"} onClick={() => this.handleScoreChange(3)}/>
                        <em className={state.score >= 4 ? "on" :"off"} onClick={() => this.handleScoreChange(4)}/>
                        <em className={state.score >= 5 ? "on" :"off"} onClick={() => this.handleScoreChange(5)}/>

                        <span className="score"> {state.score} / 5 </span>
                    </div>

                    <div className="row">
                        <h3>리뷰</h3>
                        <textarea rows={7} placeholder="책에 대한 간단한 리뷰를 작성해주세요." onChange={this.handleDescriptionChange} value={state.description}/>
                    </div>

                    <div className="row buttons">
                        <button className="btn btn-rounded btn-outline back"> &lt; &nbsp;뒤로</button>
                        <button className="btn btn-color-2 register" onClick={this.handleSubmit}> 등록</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Review;
