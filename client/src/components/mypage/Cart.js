import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import User from '../../utils/user';
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';

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
                selectedList:{},
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


        if(res.status === 200) {
            var cartList = res.data.cartList
            state.data.cartList = cartList
        }

        if (cartList)
            this.sum(cartList);


        this.setState(state)
    }

    handlePurchase = (type) => {
        var state = this.state;

        if(type === 0 && Object.keys(state.data.selectedList).length === 0) {
            alert("선택된 작품이 없습니다.")
            return;
        }

        var purchaseList = (type === 1) ? state.data.cartList : Object.values(state.data.selectedList);

        this.props.history.push({
            pathname : URL.service.buy.buy,
            state: {
                purchaseList: purchaseList
            }
        })
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

        try {
            const res = await API.sendDelete(URL.api.cart.delete, {id: id})
            if(res.status === 200) {
                var filteredArray = this.state.data.cartList.filter(item => item.id !== id)
                var data = {...state.data, cartList: filteredArray}
                this.setState({data: data})
                this.sum(filteredArray);
                alert("장바구니에서 삭제되었습니다.")
            }
        } catch(e) {
            console.error(e)
            alert("장바구니에서 삭제하지 못하였습니다.")
        }
    }

    handleSelect = evt => {
        var state = this.state;
        var cartList = state.data.cartList;
        var selectedList = state.data.selectedList;
        var value = parseInt(evt.target.value)
        var id = cartList[value]["id"]

        if(evt.target.checked === true) {
            selectedList[id] = cartList[value]
        } else {
            delete selectedList[id]
        }

        state.data.selectedList = selectedList;
        this.setState(state);
    }

    handleDeleteSelected = async() => {
        var state = this.state;
        var cartList = state.data.cartList;

        if(Object.keys(cartList).length === 0) {
            alert("장바구니에 등록된 작품이 없습니다.")
            return;
        }

        if(window.confirm("선택한 작품을 정말 삭제하시겠습니까?")) {
            var selectedList = state.data.selectedList;
            var deleteIds = [];

            for(var key in selectedList) {
                deleteIds.push(parseInt(key))
            }
            var params = {
                id: deleteIds,
            }

            const res = await API.sendDelete(URL.api.cart.delete, params)
            if(res.status === 200) {
                for(var i=0; i < cartList.length; i++) {
                    if(deleteIds.includes(cartList[i].id)) {
                        cartList.splice(i, 1);
                        i--;
                    }
                }

                state.data.cartList = cartList;
                state.data.selectedList = [];
                this.setState(state);
            }
        }
    }

    isSelectedEmpty = evt => {
        if(this.state.selectedList.length === 0) {
            alert("선택된 상품이 없습니다.")
            evt.preventDefault();
            return false;
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

                {
                    cartList.length > 0 ?
                    <div className="container">
                        <button className="del-select-btn" onClick={this.handleDeleteSelected}>
                            <em> </em>
                            선택작품 삭제
                        </button>

                        <div id="cartlist-area">
                            {
                                cartList.map((item,i) => {
                                    return (
                                        <div key={item.id} className="cart-box">
                                            <label className="cb-container" >
                                                <input type="checkbox" checked={(!!state.data.selectedList[item.id]) ? true : false} onChange={this.handleSelect} value={i}/>
                                                <span className="checkmark"/>
                                            </label>
                                            
                                            <Link to={URL.service.book.book + item.book_id} title="상세 페이지로 이동합니다">
                                                <img src={item.img}/>
                                            </Link>
                                            <div className="details">
                                                <Link to={URL.service.book.book + item.book_id}  title="상세 페이지로 이동합니다">
                                                    <h3 className="title">{item.book_title}</h3>
                                                </Link>
                                                <p className="type">출간 방식 : {item.type === 1 ? "연재" : "단행본"}</p>
                                            </div>
                                            <strong className="price"> {parse.numberWithCommas(item.price)} 원</strong>
                                            <button className="del-btn" onClick={() => this.handleDelete(item.id)}><em className="del"/></button>
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
                            <div className="button-wrap">
                                {/*<button className="cont-btn btn btn-rounded" onClick={this.handleReturn}>
                                    <em className="left_arrow"/> 책 계속 둘러보기
                                </button>*/}

                                <div className="buy-btn">
                                    <button className="btn selected" onClick={() => this.handlePurchase(0)}>
                                        선택 상품 구매
                                    </button>

                                    <button className="btn all" onClick={() => this.handlePurchase(1)}>
                                        전체 상품 구매
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="container">
                        <div className="no-content">
                            장바구니에 담긴 작품이 없습니다.
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Cart;
