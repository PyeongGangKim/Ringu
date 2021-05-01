import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';

class Cart extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">장바구니</h2>
                </div>

                <hr/>

                <div className="container">
                    <div className="del-btn">
                        <em> s</em>
                        선택작품 삭제

                    </div>
                </div>

                <div id="cartlist-area">
                    <div className="cart-box">
                        <input type="checkbox" id="cb1"/>
                        <img src="/travel.jpg"/>
                        <div className="details">
                            <h3 className="title">책 제목입니다</h3>
                            <p className="type">출간 방식 : 주간연재</p>
                        </div>
                        <strong className="price"> 10,000원</strong>
                        <div className="del">X</div>
                    </div>

                    <div className="cart-box">
                        <input type="checkbox" id="cb1"/>
                        <img src="/travel.jpg"/>
                        <div className="details">
                            <h3 className="title">책 제목입니다</h3>
                            <p className="type">출간 방식 : 주간연재</p>
                        </div>
                        <strong className="price"> 10,000원</strong>
                        <div className="del">X</div>
                    </div>

                    <div className="summary">
                        <div className="sum">
                            <strong className="label"> 구매액: </strong>
                            <span> 20,000 원</span>
                        </div>
                        <div className="discount">
                            <strong className="label"> 할인액: </strong>
                            <span> 0 원</span>
                        </div>
                        <div className="total">
                            <strong className="label"> 총금액: </strong>
                            <span> 1,000,000 원</span>
                        </div>
                    </div>

                    <button className="cont-btn btn btn-rounded">
                        &#60; &nbsp; 책 계속 둘러보기
                    </button>
                </div>
            </div>
        )
    }
}

export default Cart;
