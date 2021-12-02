import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import User from '../../utils/user';
import iamport from '../../config/iamport';

import '../../scss/buy/buy.scss';
import '../../scss/common/button.scss';

class Buy extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        this.state = {
            purchaseList: props.location.state.purchaseList,
            pay_method: 'card',
            amount: 0,
            agree: false,
            user: {}
        }
    }

    async componentDidMount() {
        var state = this.state;

        if (state.purchaseList)
            this.sum(state.purchaseList);

        const res = await API.sendGet(URL.api.member.get)

        if (res.status === 200) {
            state.user = res.data.user
        }

        this.setState(state)
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

    handleAgree = evt => {
        var state = this.state;
        state.agree = evt.target.checked;

        this.setState(state)
    }

    onPayment = () => {
        var state = this.state
        if(state.agree === false) {
            alert("동의해주세요.")
            return;
        }
        let userInfo = User.getInfo();
        if(!userInfo) {
            alert("로그인 후 구매하여 주세요.");
            window.location.href = URL.service.accounts.login;
        }

        const { IMP } = window;
        IMP.init(iamport.IMP_PAYMENT_CODE)

        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: state.purchaseList[0].book_title + (state.purchaseList.length > 1 ? `외 ${state.purchaseList.length-1} 건` : ''),
            amount: state.amount,
            buyer_email: state.user.email,
            buyer_name: state.user.nickname,
            buyer_tel: !!state.user.tel ? state.user.tel : null,
            buyer_addr: '',
            buyer_postcode: '',
        },
            async(rsp) => {
                var msg
                if (rsp.success) {
                    msg = "결제가 완료되었습니다."

                    let params = rsp;
                    params.purchaseList = state.purchaseList;
                    const res = await API.sendPost(URL.api.payment.create, params)
                    if(res.status === 200) {
                        this.props.history.push({
                            pathname : URL.service.buy.complete,
                            state: {
                                card: params.card_name,
                                amount: state.amount,
                                user: state.user,
                                //purchaseList: state.purchaseList
                            }
                        })
                    }
                    /*).catch((err) => {
                        console.log(err);
                        alert(err);
                    });*/
                } else {
                    var return_url = "";
                    alert( rsp.error_msg );
                }
            }
        )
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
                                        <strong className="title">{item.book_title}</strong>
                                        {
                                            item.type === 1 &&
                                            <span className="subtitle">{item.title}</span>
                                        }
                                        <div className="detail">
                                            <p>저자:{item.type === 2 ? item.author_nickname : item.author}</p>
                                            <p>출간방식:{item.type === 2 ? "단행본" : "연재본"} {item.type === 1 ? null : <span>연재주기:{"목,금"}</span>}</p>
                                            <p>파일형식:{ext.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <span className="price"> {parse.numberWithCommas(item.price)} 원</span>
                                </div>
                            )
                        })
                    }
                </div>

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
                                                <input type="text"/>
                                                <span className="input-txt">원</span>
                                            </div>
                                        </td>
                                        <td><button className="btn btn-color-2">쿠폰선택</button></td>
                                    </tr>
                                    <tr>
                                        <th>사용 가능한 적립금</th>
                                        <td>
                                            <div className="input-discount">
                                                <input type="text"/>
                                                <span className="input-txt">원</span>
                                            </div>
                                        </td>
                                        <td><button className="btn btn-color-2">전액사용</button></td>
                                    </tr>
                                </tbody>
                            </table>
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
                                <dt>결제금액</dt>
                                <dd>{parse.numberWithCommas(state.amount)} 원</dd>
                            </dl>
                        </div>

                        <hr/>

                        <div className="agree-txt">
                            <input type="checkbox" id="agree-payment" checked={state.agree} onClick={this.handleAgree}/>
                            <label htmlFor="agree-payment">주문 내용을 확인하였으며 결제에 동의합니다 (필수)</label>
                        </div>

                        <button className="payment-btn btn btn-block btn-color-2" onClick={this.onPayment}>결제하기</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Buy);
