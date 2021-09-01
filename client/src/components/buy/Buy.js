import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import User from '../../utils/user';
import '../../scss/buy/buy.scss';
import '../../scss/common/button.scss';

class Buy extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        this.state = {
            buyList: [],
            pay_method: 'card',
            amount: 1,
            agree: false,
        }
    }

    async componentDidMount() {
        var state = this.state;
        const res = await API.sendGet(URL.api.cart.list)

        if(res.status === 200) {
            var buyList = res.data.cartList
            state.buyList = buyList
        }

        if (state.buyList)
            this.sum(state.buyList);

        this.setState(state)
    }

    sum = (list) => {
        var state = this.state
        var sum = 0;
        for(var i=0; i < list.length; i++) {
            sum += list[i].price
        }

        state.price = sum;

        this.setState(state)
    }

    handleAgree = evt => {
        var state = this.state;
        state.agree = evt.target.checked;

        this.setState(state)
    }

    onPayment = () => {
        if(this.state.agree === false) {
            alert("동의해주세요.")
            return;
        }
        const { IMP } = window;
        IMP.init("imp50068849")
        let userInfo = User.getInfo();
        if(!userInfo) {
            alert("로그인 후 구매하여 주세요.");
            window.location.href = URL.service.accounts.login;
        }

        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: '결제 테스트',
            amount: 1,
            buyer_email: 'trop100@naver.com',
            buyer_name: '임유빈',
            buyer_tel: '01020618506',
            buyer_addr: '서울특별시 관악구 관악로 1',
            buyer_postcode: '08826',
        },
            function (rsp) {
                console.log( "rsp", rsp );
                var msg
                if (rsp.success) {
                    let params = rsp;
                    console.log('22222222')
                    API.sendPost(URL.api.payments, params).then((res) => {

                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    msg = '결제가 취소되었습니다.';
                    var return_url = "";
                    alert( rsp.error_msg );
                    //window.location.href = return_url;

                }
            }
        )
    }

    render() {
        var state = this.state;
        console.log(state)
        return (
            <div id="buy" className="page1">
                <div id="cartlist-area">
                    <h3 className="header">구매하기({2}건)</h3>
                    {
                        state.buyList.map(item => {
                            return (
                                <div key={item.id} className="product-box">
                                    <div className="img-box">
                                        <img src={item.img}/>
                                    </div>
                                    <div className="details">
                                        <strong className="title">(책 제목:{item.title})</strong>
                                        <p>저자:{item.author_name}</p>
                                        <p>출간방식:{item.type === 2 ? "단행본" : "연재본"}</p>
                                        {item.type === 1 ? <p>연재주기:{"목,금(1개월)"}</p> : null}
                                        <p>파일형식:{"PDF"}</p>
                                    </div>
                                    <span className="price"> {item.price}</span>
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

                        <hr/>

                        <h3 className="header"> 결제 방법  </h3>
                        <div className="content">
                            <div className="payment-group">
                                <input type="radio" id="CARD"/>
                                <label for="CARD" className="btn btn-outline btn-rounded">
                                    <em id="payment-card"/>
                                    신용카드
                                </label>

                                <input type="radio" id="ACCOUNT"/>
                                <label for="ACCOUNT" className="btn btn-outline btn-rounded">
                                    <em id="payment-account"/>
                                    실시간 계좌이체
                                </label>

                                <input type="radio" id="PHONE"/>
                                <label for="PHONE" className="btn btn-outline btn-rounded">
                                    <em id="payment-phone"/>
                                    휴대폰
                                </label>
                            </div>
                        </div>

                    </div>
                    <div id="sum-box" className="buy-detail-box">
                        <div className="detail-price">
                            <dl >
                                <dt>총 금액</dt>
                                <dd>{state.price} 원</dd>
                            </dl>
                            <dl>
                                <dt>쿠폰 및 적립금 할인</dt>
                                <dd>0 원</dd>
                            </dl>

                            <dl className="total">
                                <dt>결제금액</dt>
                                <dd>{state.price} 원</dd>
                            </dl>
                        </div>

                        <hr/>

                        <div className="agree-txt">
                            <input type="checkbox" checked={state.agree} onClick={this.handleAgree}/>
                            주문 내용을 확인하였으며 결제에 동의합니다 (필수)
                        </div>

                        <button className="payment-btn btn btn-block btn-color-2" onClick={this.onPayment}>결제하기</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Buy);
