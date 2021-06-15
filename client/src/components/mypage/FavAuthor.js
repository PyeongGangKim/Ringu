import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/favorite.scss';
import '../../scss/common/button.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class FavAuthor extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        this.state = {
            favoriteList:[],
        };
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.favorite.author.list)

        var favoriteList = res.data.result

        for(var i=0; i<favoriteList.length; i++) {
            const author = await API.sendGet(URL.api.author.get + favoriteList[i].author_id)
            favoriteList[i].author = author.data.result;
        }

        this.setState({favoriteList: favoriteList})
    }

    handleDelete = async(id) => {
        var state = this.state
        console.log(URL.api.favorite.author.delete + id)
        const res = await API.sendDelete(URL.api.favorite.author.delete + id)

        if(res.data.status === "ok") {
            var filteredArray = this.state.favoriteList.filter(item => item.id !== id)

            this.setState({favoriteList: filteredArray})
            alert("즐겨찾기가 취소되었습니다.")
        }
    }

    render() {
        var favoriteList = this.state.favoriteList
        var state = this.state;

        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">작가 찜</h2>
                </div>

                <hr/>

                <div className="container">
                    <div id="favauthor-area">
                        {
                            favoriteList.map(item => {
                                return (
                                    <div key={item.id} className="fa-box">
                                        <div className="profile">
                                            <div>
                                                <img src="/blank.jpg"/>
                                            </div>

                                            <span className="author-name">{item.author.name}</span>
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
                                                {item.author.description}
                                            </p>
                                        </div>

                                        <div className="favorite">
                                            <button onClick={() => this.handleDelete(item.id)} className="favorite-icon">
                                                <img src="/heart.png"/>
                                            </button>
                                        </div>

                                        <div className="detail">
                                        >
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default FavAuthor;
