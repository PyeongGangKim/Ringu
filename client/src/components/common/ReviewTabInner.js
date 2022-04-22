import React, { Component } from 'react';
import {Oval} from 'react-loader-spinner'

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

var limit = 5;
class ReviewTabInner extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reviews: [],
            activeReviewIdx: 0,
            activeReviewBookId: -1,
            reviewTitles: [],
            loading: true,
            noReview: false,
            page: 1,
        }
    }

    async componentDidMount() {
        this.updateReviewList(true, 
                        this.props.isAuthorReview ? 'author_id' : 'book_id', 
                        this.props.isAuthorReview ? this.props.authorId : this.props.bookId, 
                        1,
                        true);
    }

    handleReviewTitleClick = async(active_idx, book_id) => {
        var state = this.state;
        state.activeReviewIdx = active_idx;
        state.activeReviewBookId = book_id
        state.page = 1;
        state.noReview = false;
        state.loading = true;

        this.setState(state);

        this.updateReviewList(false, 
                        active_idx === 0 ? 'author_id' : 'book_id', 
                        active_idx === 0 ? this.props.authorId : book_id,
                        1,
                        true)
    }

    updateReviewList = async(title, idType, idValue, page, init) => {
        var state = this.state;

        if(init) {
            state.reviews = []
        }

        try {
            const res = await API.sendGet(URL.api.review.getReviewList, {title: title, [idType]: parseInt(idValue), page: page})
            if(res.status === 200) {
                var newReviewList = res.data.reviewList;
                state.reviews = state.reviews.concat(newReviewList);
                state.page += 1;
                
                if(newReviewList.length < limit) {
                    state.noReview = true;
                }
                if(title) {
                    var reviewTitles = res.data.reviewTitleList;
                    state.reviewTitles = reviewTitles;
                }
            } else if(res.status === 204) {
                state.noReview = true;
            }
            state.loading = false;
        } catch(e) {
            state.loading = false;
            alert("리뷰를 불러오지 못 했습니다.")
        }

        this.setState(state);
    }

    handleLoadReviews = () => {
        var state = this.state;
        this.setState({loading: true})
        
        this.updateReviewList(false, 
            this.props.isAuthorReview && state.activeReviewIdx === 0 ? 'author_id' : 'book_id', 
            this.props.isAuthorReview ? (state.activeReviewIdx === 0 ? this.props.authorId : state.activeReviewBookId) : this.props.bookId, 
            state.page,
            false)
    }

    render() {
        var state = this.state;

        return (        
            <div id={this.props.id} className="inner-box">
                <div className="inner-header">
                    <span>리뷰</span>
                    {
                        state.reviewTitles.length === 0 || this.props.isAuthorReview === false ? 
                        null
                        :
                        <div className="inner-subheader-wrap">
                            <div className={"book-title " + (state.activeReviewIdx === 0 ? "active" : "")} onClick={() => this.handleReviewTitleClick(0, null)}> 전체 </div>
                            {
                                state.reviewTitles.map((item, title_idx) => {
                                    return (
                                        <div key={item.book_id} className={"book-title " + (state.activeReviewIdx === (title_idx+1) ? "active" : "")} onClick={() => this.handleReviewTitleClick(title_idx+1, item.book_id)}> {item.book_title} </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                <div className="inner-content">
                    {
                        state.loading === false && state.reviews.length === 0 ?
                        <div className="no-content">
                            작성된 리뷰가 없습니다.
                        </div>
                        :
                        <div className="review">
                            {
                                state.reviews.map((item, review_idx) => {
                                    return (
                                        <div key={item.id} className="review-box">
                                            <div className="review-details">
                                                <strong className="title"> {item.book_title}</strong>
                                                <span className="user"> {item.nickname} </span>
                                                <span className="sep">  | </span>
                                                <span className="stars">
                                                    {"★".repeat(item.score)}
                                                </span>
    
                                                <span className="score"> {item.score ? parseFloat(item.score).toFixed(1) : parseFloat(0).toFixed(1)} </span>
                                            </div>
                                            {
                                                item.book_type === 1 &&
                                                <div className="review-subtitle">
                                                    {item.subtitle}
                                                </div>
                                            }
    
                                            <div className="review-content">
                                                {item.description}
                                            </div>
                                        </div>
                                    )
                                })
                            }
    
                            {
                                state.loading === true ?
                                <div className="loading-container" style={{'height': '200px'}}>
                                    <Oval
                                        ariaLabel="loading-indicator"
                                        width={50}
                                        height={50}
                                        strokeWidth={2}
                                        color="#c2c2c2"
                                        secondaryColor="#d5d5d5"
                                    />
                                </div>
                                :
                                state.reviews.length >= limit && state.noReview === false ?
                                <div className="add-btn">
                                    <button className="add-btn btn btn-transparent" onClick={this.handleLoadReviews}> + 더보기 </button>
                                </div>
                                :
                                null
                            }
                        </div>
                    }
                </div>
            </div>
            
        )
    }
}



    

    

    

export default ReviewTabInner;