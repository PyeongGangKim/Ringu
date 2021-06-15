import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import User from '../../utils/user';
import '../../scss/common/sideinfo.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class SideMemberInfo extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        console.log(userInfo)

        this.state = {
            favorites: 0,
            purchases: 0,
            carts: 0,
        }
    }

    async componentDidMount() {
        var state = this.state;
        const fav1 = await API.sendGet(URL.api.favorite.book.list)
        const fav2 = await API.sendGet(URL.api.favorite.author.list)
        const purchases = await API.sendGet(URL.api.purchase.list)
        const carts = await API.sendGet(URL.api.cart.list)

        this.setState({
            favorites: fav1.data.result.length + fav2.data.result.length,
            purchases: purchases.data.result.length,
            carts: carts.data.result.length,
        })
    }

    render() {
        return (
            <div className="side-info">
                <div className="img-area">
                    <img src="/blank.jpg"/>
                </div>

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
                                <button className="btn btn-color-2 btn-block">
                                    새 작품 등록하기
                                </button>

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
