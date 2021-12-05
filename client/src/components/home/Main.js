import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/button.scss'

import Book from '../../components/book/Book'

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
            latestBookList: [],
        };
    }

    async componentDidMount() {
        let state = this.state;
        let params = {
            member_id: User.getInfo() ? User.getInfo().id : null,
            is_picked: 1,
        }
        let latestBookParams = {
            member_id: User.getInfo() ? User.getInfo().id : null,
            is_approved: 1,
        }
        

        try {
            const res = await API.sendGet(URL.api.book.list, params);
            const latestRes = await API.sendGet(URL.api.book.list, latestBookParams);
            console.log(latestRes);
            console.log(res.status);
            if(res.status === 200) state.bookList = res.data.bookList;
            if(latestRes.status === 200)state.latestBookList = latestRes.data.bookList;
            if(res.status === 200 || latestRes.status === 200) this.setState(state);
            
        } catch(e) {
            console.error(e)
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
                            <form onSubmit={this.handleSearchClick}>
                                <div className="search">
                                    <input type="text" autoComplete="off" value={this.state.keyword} onChange={this.handleKeywordChange}/>
                                    <button type="submit">
                                        검색
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


                <div id="home" className="page1">
                    {/*<div className="title-wrap">
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
                    </div>*/}
                    <div className="title-wrap">
                        <h2> NEW </h2>
                        {/*<span> 더보기 </span>*/}
                    </div>

                    <div className="booklist-area">
                        <ul>
                            {
                                this.state.latestBookList.slice(0,5).map(item => {
                                    var status = '';
                                    if(item.type === 2) {
                                        status  = 'pub'
                                    } else {
                                        status  = 'ser'
                                    }
                                    return (
                                        <Book
                                            key={item.id}
                                            book={item}
                                            status={status}
                                            favorite
                                        />
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div className="title-wrap">
                        <h2> MD{`'`}s Pick </h2>
                        {/*<span> 더보기 </span>*/}
                    </div>

                    <div className="booklist-area">
                        <ul>
                            {
                                this.state.bookList.slice(0,5).map(item => {
                                    var status = '';
                                    if(item.type === 2) {
                                        status  = 'pub'
                                    } else {
                                        status  = 'ser'
                                    }
                                    return (
                                        <Book
                                            key={item.id}
                                            book={item}
                                            status={status}
                                            favorite
                                        />
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
