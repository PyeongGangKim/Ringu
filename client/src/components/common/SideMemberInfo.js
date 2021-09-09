import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
            profile: "/blank.jpg",
            user: userInfo,
            host: {},
        }
    }

    async componentDidMount() {
        try {
            var state = this.state;
            var favoriteBookList = []
            var favoriteAuthorList = []
            var purchaseList = []
            var cartList = []

            if (this.props.isAuthor === false) {
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
            }

            var id;

            // 작가 페이지일 때 페이지 주인의 정보를 가져온다
            if("authorId" in this.props && this.props.authorId !== undefined) {
                id = this.props.authorId
            }
            // mypage일 때
            else {
                id = state.user.id
            }

            const userRes = await API.sendGet(URL.api.member.getById + id)
            this.setState({
                favorites: favoriteBookList.length + favoriteAuthorList.length,
                purchases: purchaseList.length,
                carts: cartList.length,
                host: userRes.data.user,
            })
        } catch(e) {
            console.log(e)
        }
    }

    handleProfileChange = async(e) => {
        var state = this.state
        const data = new FormData()
        data.append('img', e.target.files[0])

        const res = await API.sendData(URL.api.member.upload_profile, data)
        if (res.status === 200) {
            const profileRes = await API.sendGet(URL.api.member.profile + state.host.id)
            state.host.profile = profileRes.data.url;

            this.setState(state)
            alert("프로필 사진이 변경되었습니다.")
        }
    }

    render() {
        var state = this.state

        return (
            <div className="side-info">
                <form>
                    <div className="profile">
                    {
                        this.props.isAuthor === true ?
                        <div className="img-area">
                            {
                                state.host.profile === null || !state.host.profile ?
                                <img src="/blank.jpg"/>
                                :
                                <img src={state.host.profile}/>
                            }
                        </div>
                        :
                        <div className="img-area">
                            <input type="file" id="profile" onChange={this.handleProfileChange} accept="image/*"/>
                            {
                                state.host.profile === null || !state.host.profile ?
                                <img src="/blank.jpg"/>
                                :
                                <img src={state.host.profile}/>
                            }
                            <label htmlFor="profile">
                                <em/>
                            </label>
                        </div>
                    }
                    </div>
                </form>

                <strong className="name"> {"nickname" in this.props && this.props.nickname !== null ? this.props.nickname : state.host.nickname} </strong>

                {
                    this.props.isAuthor === true ?
                    <div className="info-area">
                        <div className="author-box">
                            <div className="author-details">
                                <span className="stars"> ★ ★ ★ ★ ★ </span>
                                <span className="score"> 5.0 </span>
                            </div>


                            <div className="profit-menu">

                            </div>

                            {
                                this.props.isHost &&
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
                            }
                        </div>

                    </div>
                    :
                    <div className="info-area">
                        <div className="info-box">
                            <div><span className="info-header">찜목록</span></div>
                            <div><span className="info-value">{state.favorites}</span></div>
                        </div>

                        <hr width="1" size="50" style={{margin:"auto 15px"}}/>

                        <div className="info-box">
                            <div><span className="info-header">구매건수</span></div>
                            <div><span className="info-value">{state.purchases}</span></div>
                        </div>

                        <hr width="1" size="50" style={{margin:"auto 15px"}}/>

                        <div className="info-box">
                            <div><span className="info-header">장바구니</span></div>
                            <div><span className="info-value">{state.carts}</span></div>
                        </div>
                    </div>

                }

            </div>

        )
    }
}

SideMemberInfo.propTypes = {
    isAuthor: PropTypes.bool.isRequired,
}

export default SideMemberInfo;
