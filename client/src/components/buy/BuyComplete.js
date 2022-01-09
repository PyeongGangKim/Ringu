import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import URL from '../../helper/helper_url';
import parse from '../../helper/parse';
import User from '../../utils/user';
import '../../scss/buy/buy.scss';
import '../../scss/common/button.scss';

class BuyComplete extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        var propsState = this.props.history.location.state;

        this.state = {
            //purchaseList: 'purchaseList' in propsState && typeof propsState['purchaseList'] !== 'undefined' ? propsState.purchaseList : [],
            user: 'user' in propsState && typeof propsState['user'] !== 'undefined' ? propsState.user : userInfo,
            amount: 'amount' in propsState && typeof propsState['amount'] !== 'undefined' ? propsState.amount : 0,
            card: 'card' in propsState && typeof propsState['card'] !== 'undefined' ? propsState.card : '',
        }
    }

    render() {
        var state = this.state;

        return (
            <div className="page1">
                <div className="complete-container">
                    <h3 className="header">결제/주문완료</h3>
                    <div className="complete-box">
                        <div className="content">
                            <span className="nickname">{state.user.nickname}</span>님, 주문하신 상품의 결제가 완료되었습니다.
                            <br/>
                            지금 바로 책을 펴보실 수 있어요!

                            <div className="img-box">
                                <img src="/buy-complete.png"/>
                            </div>

                            <Link to={URL.service.home}>
                                <div className="btn btn-outline">
                                    계속 둘러보기
                                </div>
                            </Link>

                            <div className="txt">
                                <span> <Link to={URL.service.mypage.purchases}>구매내역</Link>에서 결제하신 상품을 다운로드 받으실 수 있습니다 </span>
                            </div>
                        </div>

                    </div>

                    {/*<h3 className="header">구매정보 ({state.purchaseList.length}건)</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>이미지</th>
                                <th>상품정보</th>
                                <th>판매가</th>
                                <th>적립금</th>
                                <th>다운로드</th>
                            </tr>
                            {
                                state.purchaseList.map((item, idx) => {
                                    return(
                                        <tr key={item.id}>
                                            <td className="img">
                                                <div className="img-box">
                                                    <img src={item.img}/>
                                                </div>
                                            </td>
                                            <td className="info">
                                                <div>
                                                    <span className="book_title">{item.book_title} </span><br/>
                                                    {item.type === 1 && <span className="book_detail_title">{item.title}<br/> </span>}
                                                    저자: {item.author_nickname} <br/>
                                                    연재형식: {item.type === 1 ? "연재본" : "단행본"}<br/>
                                                    {item.type === 2 && <span>페이지수: {item.page_count} <br/></span>}
                                                </div>
                                            </td>
                                            <td className="price"><strong>{parse.numberWithCommas(item.price)}</strong> 원</td>
                                            <td className="mileage"><strong>0</strong> 원</td>
                                            {
                                                idx === 0 &&
                                                <td className="download" rowSpan={state.purchaseList.length}>
                                                    <Link to={URL.service.mypage.purchases}>
                                                        <button className="btn btn-color-2">
                                                            다운로드 하러가기
                                                        </button>
                                                    </Link>
                                                </td>
                                            }

                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                    </table>*/}

                    <h3 className="header">결제정보</h3>
                    <table className="summary">
                        <tbody>
                            <tr>
                                <td>결제금액</td>
                                <td><span className="total">{parse.numberWithCommas(state.amount)}</span> 원</td>
                            </tr>
                            <tr>
                                <td>결제수단</td>
                                <td>
                                    <div>
                                        {state.card}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>

        )
    }
}

export default BuyComplete;
