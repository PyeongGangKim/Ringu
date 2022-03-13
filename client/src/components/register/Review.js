import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/review.scss';

import User from '../../utils/user';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import Modal from '../../components/modal/Modal';

class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            book: {},
            book_detail: this.props.book_detail,
            isSuccess: false,
            score: 0,
            description: '',
            modal: false,
        }
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.book_detail.get + state.book_detail)
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

    handleBack = (evt) => {

        window.location.href=URL.service.mypage.purchases
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
            member_id: User.getInfo().id,
            book_id: state.book.book_id,
            author_id: state.book.author_id,
            book_detail_id: state.book_detail,
            score: state.score,
            description: state.description
        }

        try {
            const duplicate = await API.sendGet(URL.api.review.duplicate, {book_detail_id: state.book_detail})

            if(duplicate.status === 200) {
                if(duplicate.data.message === 'OK') {
                    const res = await API.sendPost(URL.api.review.register, params)
                    if(res.status === 201) {
                        state.modal = true;
                        this.setState(state);
                    }
                }
                else if(duplicate.data.message === 'duplicate') {
                    alert("이미 리뷰를 작성하셨습니다.")
                    window.location.href = URL.service.mypage.purchases
                }
            }
        }
        catch(e) {
            var error = e.response;
            alert("리뷰를 등록하지 못하였습니다.")
        }
    }

    render() {
        var state = this.state

        return (
            state.isSuccess &&
            <div id="review" className="page3">
                {
                    state.modal === true &&
                    <Modal
                        onClose={this.handleCloseClick}
                        overlay={true}
                    >
                        <div className="modal review">                            
                            <div className="header">
                                리뷰를 써주셔서 감사합니다.
                            </div>
                            <div className="content">
                                RINGU는 고객님들의 생생한 리뷰를 모아 신뢰할 수 있는 리뷰 서비스를 제공하기 위해 노력하겠습니다.
                            </div>

                            <Link to={URL.service.mypage.purchases}>
                                <button className="btn btn-block btn-color-2">
                                    확인
                                </button>
                            </Link>

                            <button className="btn btn-block btn-transparent">
                                리뷰 보러가기
                            </button>

                        </div>
                    </Modal>

                }
                <div>
                    <div className="review-box">
                        <div className="thumbnail-box">
                            <img src={!!state.book.img ? state.book.img : "/ringu_thumbnail.png"}/>
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
                        <button className="btn btn-rounded btn-outline back" onClick={this.handleBack}> &lt; &nbsp;뒤로</button>
                        <button className="btn btn-color-2 register" onClick={this.handleSubmit}> 등록</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Review;
