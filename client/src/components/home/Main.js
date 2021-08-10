import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/button.scss'

import User from '../../utils/user';
import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            keyword: "",
            bookList: [],
        };
    }

    async componentDidMount() {
        var state = this.state;
        var params = {
            member_id: User.getInfo().id,
        }

        const res = await API.sendGet(URL.api.book.main, params)
        if(res.status === 200) {
            state.bookList = res.data.bookList
            this.setState(state)
        }
    }

    handleKeywordChange = (evt) => {var state = this.state; state.keyword = evt.target.value; this.setState(state);}
    handleSearchClick = () => {
        if(!this.state.keyword) {
            alert("검색어를 입력해주세요.")
            return;
        }

        this.props.history.push(URL.service.search + "?keyword=" + this.state.keyword)
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
                                <input type="text" maxLength="15" autocomplete="off" value={this.state.keyword} onChange={this.handleKeywordChange}/>
                                <button type="submit" onClick={this.handleSearchClick}>
                                    검색
                                </button>
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
                            {
                                this.state.bookList.slice(0,5).map(item => {
                                    return (
                                        <li key={item.id} className="book-box">
                                            <Link  to={URL.service.book + item.id}>
                                                <div className="thumbnail-box">
                                                    <div className="img-area">
                                                        <img src={item.img}/>
                                                    </div>

                                                    <h3 className="title">{item.title}</h3>
                                                </div>
                                            </Link>

                                            <div className="book-info">
                                                <span className="price">{parse.numberWithCommas(item.price)} 원</span>
                                                <div className="details">
                                                    <div className="author-info">
                                                        <span className="author-label"> 작가 </span>
                                                        <span> {item.author_nickname} </span>
                                                    </div>
                                                    <div className="review-info">
                                                        <span className="star"> ★ </span>
                                                        <span> {item.review_score ? parseFloat(item.review_score).toFixed(1) : "0.0"} </span>
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
        );
    }
}

export default Main;
