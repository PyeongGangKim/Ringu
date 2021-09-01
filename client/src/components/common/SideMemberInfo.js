import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import User from '../../utils/user';
import '../../scss/common/sideinfo.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import axios from 'axios';

class SideMemberInfo extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();        

        this.state = {
            favorites: 0,
            purchases: 0,
            carts: 0,
            profile: userInfo.profile ? userInfo.profile : "",
        }
    }

    async componentDidMount() {
        var state = this.state;
        var favoriteBookList = []
        var favoriteAuthorList = []
        var purchaseList = []
        var cartList = []

        const fav1 = await API.sendGet(URL.api.favorite.book.list)
        if(fav1.status === 200) {
            favoriteBookList = fav1.data.favoriteBookList
        }

        const fav2 = await API.sendGet(URL.api.favorite.author.list)
        if(fav2.status === 200) {
            favoriteAuthorList = fav2.data.favoriteAuthorList
        }

        const purchases = await API.sendGet(URL.api.purchase.list)
        if(purchases.status === 200) {
            purchaseList = purchases.data.purchaseList
        }

        const carts = await API.sendGet(URL.api.cart.list)
        if(carts.status === 200) {
            cartList = carts.data.cartList
        }

        const res = await API.sendGet(URL.api.member.profile + User.getInfo().id)

        this.setState({
            favorites: favoriteBookList.length + favoriteAuthorList.length,
            purchases: purchaseList.length,
            carts: cartList.length,
            profile: res.data.url,
        })
    }

    handleProfileChange = async(e) => {
        var state = this.state
        const data = new FormData()
        data.append('img', e.target.files[0])

        const res = await API.sendData(URL.api.member.upload_profile, data)

        const res2 = await API.sendGet(URL.api.member.profile+User.getInfo().id)
        state.profile = res2.data.url;

        this.setState(state)

    }

    render() {
        var state = this.state
        return (
            <div className="side-info">
                <form>
                    <div className="img-area">
                        <input type="file" id="profile" onChange={this.handleProfileChange} accept="image/*"/>
                        <label for="profile">
                            {
                                state.profile ?
                                <img src={state.profile}/>
                                :
                                <img src="/blank.jpg"/>

                            }

                        </label>
                    </div>
                </form>

                <strong className="name">임유빈</strong>

                {
                    this.props.author === true ?
                    <div className="info-area">
                        <div className="author-box">
                            <div className="author-details">
                                <span className="stars"> ★ ★ ★ ★ ★ </span>
                                <span className="score"> 5.0 </span>
                            </div>


                            <div className="profit-menu">

                            </div>

                            <div className="btn-wrap-vert">
                                <Link to={URL.service.register.book}>
                                    <button className="btn btn-color-2 btn-block">
                                        새 작품 등록하기
                                    </button>
                                </Link>

                                <button className="btn btn-outline btn-block">
                                    책 양식 다운로드
                                </button>
                            </div>

                        </div>

                    </div>
                    :
                    <div className="info-area">
                        <div className="info-box">
                            <div><span className="info-header">찜목록</span></div>
                            <div><span className="info-value">{this.state.favorites}</span></div>
                        </div>

                        <hr width="1" size="50" style={{margin:"auto 15px"}}/>

                        <div className="info-box">
                            <div><span className="info-header">구매건수</span></div>
                            <div><span className="info-value">{this.state.purchases}</span></div>
                        </div>

                        <hr width="1" size="50" style={{margin:"auto 15px"}}/>

                        <div className="info-box">
                            <div><span className="info-header">장바구니</span></div>
                            <div><span className="info-value">{this.state.carts}</span></div>
                        </div>
                    </div>

                }

            </div>

        )
    }
}

export default SideMemberInfo;
