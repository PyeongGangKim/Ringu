import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import helper_url from '../../helper/helper_url';
import User from '../../utils/user';
import '../../scss/buy/buy.scss';
import '../../scss/common/button.scss';

class Buy extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        return (
            <div id="buy" className="page1">
                <div id="cartlist-area">
                    <h3 className="header">구매하기({2}건)</h3>

                    <div className="product-box">
                        <div className="img-box">
                            <img src="/travel.jpg"/>
                        </div>
                        <div className="details">
                            <strong className="title">(책 제목:{"알면 알수록 도움되는 주식투자 노하우"})</strong>
                            <p>저자:{"공대생A"}</p>
                            <p>출간방식:{"연재"}</p>
                            <p>연재주기:{"목,금(1개월)"}</p>
                            <p>파일형식:{"PDF"}</p>
                        </div>
                        <span className="price"> 15,000</span>
                    </div>

                    <hr />

                    <div className="product-box">
                        <div className="img-box">
                            <img src="/travel.jpg"/>
                        </div>
                        <div className="details">
                            <strong className="title">(책 제목:{"알면 알수록 도움되는 주식투자 노하우"})</strong>
                            <p>저자:{"공대생A"}</p>
                            <p>출간방식:{"연재"}</p>
                            <p>연재주기:{"목,금(1개월)"}</p>
                            <p>파일형식:{"PDF"}</p>
                        </div>
                        <span className="price"> 15,000</span>
                    </div>
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
                                <dd>30,000 원</dd>
                            </dl>
                            <dl>
                                <dt>쿠폰 및 적립금 할인</dt>
                                <dd>0 원</dd>
                            </dl>

                            <dl className="total">
                                <dt>결제금액</dt>
                                <dd>30,000 원</dd>
                            </dl>
                        </div>

                        <hr/>

                        <div className="agree-txt">
                            <em/>
                            주문 내용을 확인하였으며 결제에 동의합니다 (필수)
                        </div>

                        <button className="payment-btn btn btn-block btn-color-2">결제하기</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Buy;
