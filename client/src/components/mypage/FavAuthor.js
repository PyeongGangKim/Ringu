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

        try {
            const res = await API.sendGet(URL.api.favorite.author.list)
            if(res.status === 200) {
                var favoriteList = res.data.favoriteAuthorList
                this.setState({favoriteList: favoriteList})
            }
        } catch(e) {
            console.error(e)
        }
    }

    handleDelete = async(id) => {
        var state = this.state
        const res = await API.sendDelete(URL.api.favorite.author.delete + id)
        if(res.status === 200) {
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

                {
                    favoriteList.length > 0 ?
                    <div className="container">
                        <div id="favauthor-area">
                            {
                                favoriteList.map(item => {
                                    console.log(item)
                                    return (
                                        <div key={item.id} className="fa-box">
                                            <div className="profile">
                                                <div>
                                                    <img src={item.profile ? item.profile : "/assets/img/blank.jpg"}/>
                                                </div>

                                                <span className="author-name">{item.author_nickname}</span>
                                                &nbsp;작가
                                            </div>

                                            <div className="details">
                                                <div className="stat-area">
                                                    <span className="stat">
                                                        <em className="heart"/>
                                                        {(!!item.favorite_count) ? parse.numberWithCommas(item.favorite_count) : 0}
                                                    </span>
                                                    |
                                                    <span  className="stat">
                                                        <em className="star"/>
                                                        {(item.review_score && item.review_count) ? (item.review_score / item.review_count).toFixed(1) : "0.0"}
                                                    </span>
                                                    |
                                                    <span  className="stat">
                                                        <em className="review"/>
                                                        {item.review_count ? item.review_count : 0}개
                                                    </span>
                                                </div>

                                                {/*<div className="tip-area">
                                                    <span className="tip">#생활/취미</span>
                                                    <span className="tip">#글쓰기</span>
                                                    <span className="tip">#자기계발</span>
                                                </div>*/}
                                                <p className="description">
                                                    {item.author_description}
                                                </p>
                                            </div>

                                            <div className="favorite">
                                                <button onClick={() => this.handleDelete(item.id)} className="favorite-icon">
                                                    <img src="/assets/img/heart.png"/>
                                                </button>
                                            </div>

                                            <Link to={URL.service.author + item.author_id}>
                                                <div className="detail">
                                                    <em className="right_arrow"/>
                                                </div>
                                            </Link>
                                        </div>

                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <div className="container">
                        <div className="no-content">
                            찜한 작가가 없습니다.
                        </div>
                    </div>
                }
            </div>

        )
    }
}

export default FavAuthor;
