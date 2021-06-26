import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/search/search.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: parse.searchToDict(props.search),
            searchList: [],
        };

    }

    async componentDidMount() {
        var state = this.state;
        console.log(state)
        this.handleSearch(state.search['keyword'])
    }

    handleSearch = async(keyword) => {
        var state = this.state;

        var params = {
            keyword: keyword,
        }

        const res = await API.sendGet(URL.api.book.list, params = params)        
        if(res.status === 200) {
            var searchList = res.data.bookList

            state.searchList = searchList
            this.setState(state)
        }

    }

    render() {
        var searchList = this.state.searchList
        var state = this.state;

        return (
            <div id="wrap">
                <div id="search" className="page1">
                    <div className="title-wrap">
                        <h2 className="title">{`'${state.search['keyword']}'`} 검색 결과</h2>
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
                            {
                                searchList.map(item => {
                                    return (
                                        <li className="book-box">
                                            <div className="thumbnail-box">
                                                <div className="img-area">
                                                    <img src="/travel.jpg"/>
                                                </div>
                                                <div className="favorite-icon"/>

                                                <h3 className="title">{item.title}</h3>
                                            </div>

                                            <div className="book-info">
                                                <span className="price">{parse.numberWithCommas(item.price)}원</span>
                                                <div className="details">
                                                    <div className="author-info">
                                                        <span className="author-label"> 작가 </span>
                                                        <span> {item.author_nickname} </span>
                                                    </div>
                                                    <div className="review-info">
                                                        <span className="star"> ★ </span>
                                                        <span> 5.0 </span>
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

export default Search;
