import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';


import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import User from '../../utils/user';

import PG from '../../config/pg';

import '../../scss/buy/buy.scss';
import '../../scss/common/button.scss';

class Buy extends Component {
    userInfo = User.getInfo();
    
    constructor(props) {
        super(props)

        this.state = {
            purchaseList: props.location.state.purchaseList,
            amount: 0,
            agreeAgree: false,
            agreeRefund: false,
            payMethod: 'CARD',
            user: {}
        }           
    }

    async componentDidMount() {
        var state = this.state;

        if (state.purchaseList)
            this.sum(state.purchaseList);

        try {
            const res = await API.sendGet(URL.api.member.get)

            if (res.status === 200) {
                state.user = res.data.user
            }

            this.setState(state)
        } catch(err) {

        }
    }
    
    sum = (list) => {
        var state = this.state
        var sum = 0;
        for(var i=0; i < list.length; i++) {
            sum += list[i].price
        }

        state.amount = sum;

        this.setState(state)
    }

    handleAgreePayment = evt => {
        var state = this.state;
        state.agreePayment = evt.target.checked;

        this.setState(state)
    }

    handleAgreeRefund = evt => {
        var state = this.state;
        state.agreeRefund = evt.target.checked;

        this.setState(state)
    }

    onPayment = async(e) => {
        var state = this.state
        e.preventDefault();
        if(state.agreePayment === false || state.agreeRefund === false) {
            alert("동의해주세요.")
            return;
        }

        if(!this.userInfo) {
            alert("로그인 후 구매하여 주세요.");
            window.location.href = URL.service.accounts.login;
        }

        const { IMP, innopay } = window;
        var purchaseList = state.purchaseList.map(x => x.id)
        var params = {
            member_id: state.user.id,
            book_detail_ids: purchaseList,
        }

        try {
            const res = await API.sendGet(URL.api.purchase.duplicate_many, params)
            if(res.status === 200) {
                if(res.data.message === "duplicate") {
                    alert("이미 결제된 상품입니다. 구매 내역 페이지로 이동합니다.")
                    window.location.href = URL.service.mypage.purchase;
                    return;
                }
            }
        } 
        catch(e) {
            alert("결제를 진행할 수 없습니다")
            return;
        }
        
        innopay.goPay({
            PayMethod: state.payMethod,
            MID: pg.mid[process.env.REACT_APP_ENV],
            MerchantKey: pg.mid[process.env.REACT_APP_ENV],
            GoodsName: state.purchaseList[0].book_title + (state.purchaseList.length > 1 ? `외 ${state.purchaseList.length-1} 건` : ''),
            Amt: state.amount + '',
            BuyerName: state.user.nickname,
            BuyerTel: !!state.user.tel ? state.user.tel : '0',
            BuyerEmail: state.user.email,
            ResultYN: 'Y',
            Moid: 111111,
            ReturnURL: URL.base_url[process.env.REACT_APP_ENV] + URL.service.buy.callback + "?ids=" + purchaseList.toString(),
        })
    }

    handleMethodChange = (e) => {
        var state = this.state;
        state.payMethod = e.target.value

        this.setState(state)

    }

    handleCouponSelect = () => {
        window.alert("현재 준비중입니다")
    }

    handleTotalMileage = () => {
        window.alert("현재 준비중입니다")
    }

    render() {
        var state = this.state;
        return (            
            <div id="buy" className="page1">
                <div id="cartlist-area">
                    <h3 className="header">구매하기({state.purchaseList.length} 건)</h3>
                    {
                        state.purchaseList.map(item => {

                            var tokens = item.file.split('.')
                            var ext = tokens[tokens.length-1]

                            return (
                                <div key={item.type === 2 ? item.book_detail_id : item.id} className="product-box">
                                    <div className="img-box">
                                        <img src={!!item.img ? item.img : "ringu_thumbnail.png"}/>
                                    </div>
                                    <div className="product">
                                        <strong className="title">
                                            {
                                                item.type === 1 && `[${item.round}회차] `
                                            }
                                            {item.book_title} 
                                        </strong>
                                        <br/>
                                        {
                                            item.type === 1 &&
                                            <span className="subtitle">{item.title}</span>
                                        }
                                        <div className="detail">
                                            <p>저자:{item.type === 2 ? item.author_nickname : item.author}</p>
                                            <p>출간방식:{item.type === 2 ? "단행본" : "연재본"} {item.type === 2 ? null : <span>연재주기:{item.serialization_day.split('').join(',')}</span>}</p>
                                            <p>파일형식:{ext.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <span className="price"> {parse.numberWithCommas(item.price)} 원</span>
                                </div>
                            )
                        })
                    }
                </div>
                
                <form onSubmit={this.onPayment}>
                    <div id="buy-detail-area">                    
                        <div id="detail-box" className="buy-detail-box">
                            <h3 className="header"> 쿠폰/적립금  </h3>
                            <div className="content">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>사용 가능한 쿠폰 </th>
                                            <td>
                                                <div className="input-discount">
                                                    <input type="text" disabled/>
                                                    <span className="input-txt">원</span>
                                                </div>
                                            </td>
                                            <td><div className="btn btn-color-2" onClick={this.handleCouponSelect}>쿠폰선택</div></td>
                                        </tr>
                                        <tr>
                                            <th>사용 가능한 적립금</th>
                                            <td>
                                                <div className="input-discount">
                                                    <input type="text" disabled/>
                                                    <span className="input-txt">원</span>
                                                </div>
                                            </td>
                                            <td><div className="btn btn-color-2" onClick={this.handleTotalMileage}>전액사용</div></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="header"> 결제 방법  </h3>
                            <div className="content">
                                <label for="card">
                                    <input 
                                        type="radio" 
                                        id="card" 
                                        name="paymethod" 
                                        value="CARD"
                                        checked={state.payMethod === 'CARD'}
                                        onChange={this.handleMethodChange}
                                    />
                                    신용카드
                                </label>
                                
                                <label for="bank">
                                    <input 
                                        type="radio" 
                                        id="bank" 
                                        name="paymethod"
                                        value="BANK"
                                        checked={state.payMethod === 'BANK'}
                                        onChange={this.handleMethodChange}
                                    />
                                    계좌 이체
                                </label>

                                <label for="epay">
                                    <input 
                                        type="radio" 
                                        id="epay" 
                                        name="paymethod" 
                                        value="EPAY"
                                        checked={state.payMethod === 'EPAY'}
                                        onChange={this.handleMethodChange}
                                    />
                                    간편 결제
                                </label>
                                

                                
                                
                            </div>
                        </div>
                        <div id="sum-box" className="buy-detail-box">
                            <div className="detail-price">
                                <dl >
                                    <dt>총 금액</dt>
                                    <dd>{parse.numberWithCommas(state.amount)} 원</dd>
                                </dl>
                                <dl>
                                    <dt>쿠폰 및 적립금 할인</dt>
                                    <dd>0 원</dd>
                                </dl>

                                <dl className="total">
                                    <dt>총 결제 금액</dt>
                                    <dd>{parse.numberWithCommas(state.amount)} 원</dd>
                                </dl>
                            </div>

                            <hr/>

                            <div className="agree-txt">
                                <div className="checkbox-wrap">
                                    <label htmlFor="agree-payment" className="cb-container" >
                                    <input type="checkbox" id="agree-payment" checked={state.agreePayment} onChange={this.handleAgreePayment}/>
                                        <span className="checkmark"/>
                                        <div className="checkbox-text">
                                            상품, 결제, 주문정보를 확인하였으며 결제에 동의합니다. (필수)
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="agree-txt">
                                <div className="checkbox-wrap">
                                    <label htmlFor="agree-refund" className="cb-container" >
                                    <input type="checkbox" id="agree-refund" checked={state.agreeRefund} onChange={this.handleAgreeRefund}/>
                                        <span className="checkmark"/>
                                        <div className="checkbox-text">
                                            e-book 제품 특성상 환불 및 교환이 어렵다는 사실을 확인하였으며 결제에 동의합니다. (필수)
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button className="payment-btn btn btn-block btn-color-2">결제하기</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(Buy);
