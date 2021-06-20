import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Cart extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        this.state = {
            ui: {

            },
            data: {
                cartList:[],
                price: 0,
                discount: 0,
                total: 0,
            },
            msg: {

            }
        };
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.cart.list)
        console.log(res)
        var cartList = res.data.cartList

        /*for(var i=0; i<cartList.length; i++) {
            cartList[i].book = {}

            var book;

            if(cartList[i].type === 1) {
                book = await API.sendGet(URL.api.book.serialization + cartList[i].serialization_book_id)
                cartList[i].book = book.data.serializationBook;
            } else {
                book = await API.sendGet(URL.api.book.singlePublished + cartList[i].single_published_book_id)
                cartList[i].book = book.data.singlePublishedBook;
            }

            const author = await API.sendGet(URL.api.author.get + cartList[i].book.author_id)
            cartList[i].author = author.data.result;
        }*/



        state.data.cartList = cartList
        console.log(cartList)
        this.sum(cartList);


        this.setState(state)
    }

    sum = (list) => {
        var state = this.state
        var sum = 0;
        for(var i=0; i < list.length; i++) {
            sum += list[i].price
        }

        state.data.price = sum;
        state.data.total = sum - state.data.discount;

        this.setState(state)
    }

    handleDelete = async(id) => {
        var state = this.state

        const res = await API.sendDelete(URL.api.cart.delete + id)
        if(res.data.status === "ok") {
            var filteredArray = this.state.data.cartList.filter(item => item.id !== id)
            var data = {...state.data, cartList: filteredArray}
            this.setState({data: data})
            this.sum(filteredArray);
            alert("물품이 삭제되었습니다.")
        }
    }

    render() {
        var cartList = this.state.data.cartList
        var state = this.state;

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
                    {
                        cartList.map(item => {
                            console.log(item)
                            return (
                                <div key={item.id} className="cart-box">
                                    <input type="checkbox" id="cb1"/>
                                    <img src="/travel.jpg"/>
                                    <div className="details">
                                        <h3 className="title">{item.book_detail_title}</h3>
                                        <p className="type">출간 방식 : {item.type === 1 ? "연재" : "단행본"}</p>
                                    </div>
                                    <strong className="price"> {parse.numberWithCommas(item.price)} 원</strong>
                                    <div className="del" onClick={() => this.handleDelete(item.id)}>X</div>
                                </div>
                            )
                        })
                    }

                    <div className="summary">
                        <div className="sum">
                            <strong className="label"> 구매액: </strong>
                            <span> {parse.numberWithCommas(state.data.price)} 원</span>
                        </div>
                        <div className="discount">
                            <strong className="label"> 할인액: </strong>
                            <span> {parse.numberWithCommas(state.data.discount)} 원</span>
                        </div>
                        <div className="total">
                            <strong className="label"> 총금액: </strong>
                            <span> {parse.numberWithCommas(state.data.total)} 원</span>
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
