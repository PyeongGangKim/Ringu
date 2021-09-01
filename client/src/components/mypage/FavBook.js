import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/favorite.scss';
import '../../scss/common/button.scss';
import '../../scss/common/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class FavBook extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        this.state = {
            ui: {

            },
            data: {
                favoriteList:[],
            },
            msg: {

            }
        };
    }

    async componentDidMount() {
        var state = this.state;

        const res = await API.sendGet(URL.api.favorite.book.list)

        if(res.status === 200) {
            var favoriteList = res.data.favoriteBookList
            state.data.favoriteList = favoriteList

            this.setState(state)
        }


    }

    handleDelete = async(id) => {
        var state = this.state
        const res = await API.sendDelete(URL.api.favorite.book.delete + id)

        if(res.data.status === "ok") {
            var filteredArray = this.state.data.favoriteList.filter(item => item.id !== id)
            var data = {...state.data, favoriteList: filteredArray}
            this.setState({data: data})
            alert("즐겨찾기가 취소되었습니다.")
        }
    }

    render() {
        var favoriteList = this.state.data.favoriteList
        var state = this.state;

        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">컨텐츠 찜</h2>
                </div>

                <hr/>

                <div className="container">
                    <div id="favbooklist-area" className="booklist-area">
                        <ul>
                            {
                                favoriteList.map(item => {
                                    return (
                                        <li key={item.id} className="book-box">
                                            <Link  to={URL.service.book + item.book_id}>
                                                <div className="thumbnail-box">
                                                    <div className="img-area">
                                                        <img src={item.img}/>
                                                    </div>
                                                    <button onClick={() => this.handleDelete(item.id)} className="favorite-icon on"/>

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
        )
    }
}

export default FavBook;
