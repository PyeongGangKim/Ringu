import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import User from '../../utils/user';
import '../../scss/common/sideinfo.scss';
import '../../scss/skeleton/skeleton.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import FormatDownloadModal from '../../components/author/FormatDownloadModal';

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
            reviewTotal: 0,
            reviewCount: 0,
            isFavorite: false,
            isLoading: true,
        }
    }

    async componentDidMount() {
        try {
            var state = this.state;
            var favoriteBookList = []
            var favoriteAuthorList = []
            var purchaseList = []
            var cartList = []
            var reviewStats = {};
            var user = {};

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
            } else {
                var params = {
                    group: "author_id",
                    id: this.props.authorId,
                }
                const res = await API.sendGet(URL.api.review.stats, params)
                if(res.status === 200) {
                    reviewStats = res.data.stats[0]
                }
            }

            var id;
            // ?????? ???????????? ??? ????????? ????????? ????????? ????????????
            if("authorId" in this.props && this.props.authorId !== undefined) {
                id = this.props.authorId
            }
            // mypage??? ???
            else {
                id = state.user.id
            }

            if (this.props.isHost === false && state.user !== null) {
                const res = await API.sendGet(URL.api.favorite.author.get + this.props.authorId)
                if(res.status === 200) {
                    //var fa = res.data.favoriteAuthor;
                    state.isFavorite = true;
                }
            }

            const userRes = await API.sendGet(URL.api.member.getById + id)
            if(userRes.status === 200) {
                user = userRes.data.user
            }

            state.favorites = favoriteBookList.length + favoriteAuthorList.length;
            state.purchases = purchaseList.length;
            state.carts = cartList.length;
            state.host = user;
            state.total = parseInt(reviewStats.total);
            state.count = parseInt(reviewStats.count);
            state.isLoading = false;
        } catch(e) {
            state.isLoading = false;
            console.error(e)
        }

        this.setState(state)
    }

    handleProfileChange = async(e) => {
        var state = this.state
        var file = e.target.files[0]
        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        var blob = file.slice(0, file.size, file.type)
        var newFile = new File([blob], state.user.nickname + "." + fieldName, {type: file.type})

        const data = new FormData()
        data.append('img', newFile)

        try {
            const res = await API.sendData(URL.api.member.upload_profile, data)
            if (res.status === 200) {
                const profileRes = await API.sendGet(URL.api.member.profile + state.host.id)
                state.host.profile = profileRes.data.url;

                this.setState(state)
                alert("????????? ????????? ?????????????????????.")
            } else {
                alert("????????? ????????? ???????????? ???????????????.")
            }
        }
        catch(e) {
            alert("????????? ????????? ???????????? ???????????????.")
        }

    }

    handleFavoriteClick = async() => {
        var state = this.state;

        if(state.isFavorite) {
            try {
                const res = await API.sendGet(URL.api.favorite.author.get + this.props.authorId)
                if(res.status === 200) {
                    var fa = res.data.favoriteAuthor;

                    const res2 = await API.sendDelete(URL.api.favorite.author.delete + fa.id)
                    if(res2.status === 200) {
                        state.isFavorite = false;
                        this.setState(state);
                    }
                }
            } catch(e) {
                alert("???????????? ???????????? ???????????????.")
            }
        }
        // ?????? ??????
        else {
            try {
                var params = {
                    author_id: this.props.authorId,
                }
                const duplicate = await API.sendGet(URL.api.favorite.author.duplicate, params)

                if(duplicate.status === 200) {
                    if(duplicate.data.message === 'OK') {
                        const res = await API.sendPost(URL.api.favorite.author.create, params)
                        if(res.status === 201) {
                            state.isFavorite = true;
                            this.setState(state);
                        }
                    }
                    else if(duplicate.data.message === 'duplicate') {
                        alert("?????? ?????? ???????????????.")
                    }
                }
            } catch(e) {
                var error = e.response;
                if(error.status === 401) {
                    if(window.confirm("???????????? ????????? ???????????????. ????????? ???????????? ?????????????????????????")) {
                        window.location.href = URL.service.accounts.login;
                    }
                }
                else {
                    alert("???????????? ?????????????????????.")
                }
            }
        }
    }

    handleModalClick = () => {
        var state = this.state;

        state.modal = true;
        this.setState(state)
    }

    handleCloseClick = () => {
        var state = this.state;
        
        state.modal = false;
        this.setState(state)
    }

    render() {
        var state = this.state

        return (
            !!state.isLoading ?
            <div className="side-info">
                <div className="skeleton-wrapper">
                    <div className="skeleton-profile">
                        <div className="skeleton avatar"/>
                        <div className="skeleton title"/>
                        {
                            this.props.isAuthor === true ?
                            <div>
                                <div className="skeleton button"/>
                                <div className="skeleton button"/>
                                <div className="skeleton button"/>
                            </div>
                            :
                            <table>
                                <tr>
                                    <td><div className="skeleton text"/></td>
                                    <td><div className="skeleton text"/></td>
                                    <td><div className="skeleton text"/></td>
                                </tr>
                                <tr>
                                    <td><div className="skeleton text"/></td>
                                    <td><div className="skeleton text"/></td>
                                    <td><div className="skeleton text"/></td>
                                </tr>
                            </table>
                        }
                    </div>
                </div>
            </div>
            :
            <div className="side-info">
                {
                    state.modal === true &&
                    <FormatDownloadModal
                        handleCloseClick={this.handleCloseClick}
                    />
                }
                {
                    this.props.isHost === false &&
                    <div className="favorite-box">
                        <button className="favorite-btn" onClick={this.handleFavoriteClick}>
                            <em className={"favorite " + (state.isFavorite ? "on" : "")}/>
                        </button>
                    </div>
                }

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

                <strong className="nickname"> {"nickname" in this.props && this.props.nickname !== null ? this.props.nickname : state.host.nickname} </strong>

                {
                    this.props.isAuthor === true ?
                    <div className="info-area">
                        <div className="author-box">
                            <div className="author-details">
                                <span className="stars">
                                    ???
                                </span>
                                <span className="score"> {(state.total/state.count) ? parseFloat((state.total/state.count)).toFixed(1) : parseFloat(0).toFixed(1)} </span>
                            </div>


                            <div className="profit-menu">

                            </div>

                            {
                                this.props.isHost &&
                                <div className="btn-wrap-vert">
                                    <Link to={URL.service.payment}>
                                        <button className="btn btn-color-1 btn-block">
                                            ?????? ??????
                                        </button>
                                    </Link>

                                    <Link to={URL.service.register.book}>
                                        <button className="btn btn-color-2 btn-block">
                                            ??? ?????? ????????????
                                        </button>
                                    </Link>

                                    <button className="btn btn-outline btn-block" onClick={this.handleModalClick}>
                                        ??? ?????? ????????????
                                    </button>
                                </div>
                            }
                        </div>

                    </div>
                    :
                    <div className="info-area">
                        <div className="info-box">
                            <div><span className="info-header">?????????</span></div>
                            <div><span className="info-value">{state.favorites}</span></div>
                        </div>

                        <hr width="1" size="50" style={{margin:"auto 15px"}}/>

                        <div className="info-box">
                            <div><span className="info-header">????????????</span></div>
                            <div><span className="info-value">{state.purchases}</span></div>
                        </div>

                        <hr width="1" size="50" style={{margin:"auto 15px"}}/>

                        <div className="info-box">
                            <div><span className="info-header">????????????</span></div>
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
