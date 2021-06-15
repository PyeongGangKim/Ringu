import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import User from '../../utils/user';
import '../../scss/mypage/purchase.scss';
import '../../scss/common/button.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Purchase extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

        this.state = {
            ui: {

            },
            data: {
                purchaseList:[],

            },
            msg: {

            }
        };
    }

    async componentDidMount() {
        var state = this.state;


        const res = await API.sendGet(URL.api.purchase.list)
        var purchaseListRes = res.data.result

        for(var i=0; i<purchaseListRes.length; i++) {
            purchaseListRes[i].book = {}

            var book;

            if(purchaseListRes[i].type === 1) {
                book = await API.sendGet(URL.api.book.serialization + purchaseListRes[i].serialization_book_id)
                purchaseListRes[i].book = book.data.serializationBook;
            } else {
                book = await API.sendGet(URL.api.book.singlePublished + purchaseListRes[i].single_published_book_id)
                purchaseListRes[i].book = book.data.singlePublishedBook;
            }

            const author = await API.sendGet(URL.api.author.get + purchaseListRes[i].book.author_id)
            purchaseListRes[i].author = author.data.result;
        }

        state.data.purchaseList = purchaseListRes
        this.setState(state)
    }

    render() {
        var purchaseList = this.state.data.purchaseList
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">구매 내역</h2>
                </div>

                <hr/>

                <div className="container">
                    <div className="filter">
                        최신순
                        <em/>
                    </div>

                    {
                        purchaseList.map(item => {
                            return (
                                <div id="purchaselist-area" key={item.id}>
                                    <div className="purchase-box">
                                        <div className="book-info">
                                            <div className="title-wrap">
                                                <h3 className="title">{item.title}</h3>
                                                <span className="review-point"><em>star</em>{item.book.review_score ? item.book.review_score : 0}</span>
                                            </div>
                                            <div className="info">
                                                <span className="label">작가</span>
                                                <strong className="value">{item.author.name}</strong>

                                                <span className="label">출간방식</span>
                                                <strong className="value">{item.type === 1 ? "연재본" : "단행본"}</strong>
                                            </div>
                                        </div>

                                        <table className="details">
                                            <tr>
                                                <th className="label">다운로드</th>
                                                <th className="label">구매가격</th>
                                                <th className="label">구매일</th>
                                                <td rowSpan="2">
                                                    <button className="btn btn-rounded btn-color-2">
                                                        리뷰쓰기
                                                    </button>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <button>
                                                        <img src="download.png"/>
                                                    </button>
                                                </td>
                                                <td className="value">{parse.numberWithCommas(item.book.price)} 원</td>
                                                <td className="value">{date.format(item.created_date_time)}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Purchase;
