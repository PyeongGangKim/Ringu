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

var axios = require('axios');

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

        if(res.status === 200) {
            var purchaseList = res.data.purchaseList
            state.data.purchaseList = purchaseList
            this.setState(state)
        }


        /*for(var i=0; i<purchaseList.length; i++) {
            purchaseList[i].book = {}

            var book;

            if(purchaseList[i].type === 1) {
                book = await API.sendGet(URL.api.book.serialization + purchaseList[i].serialization_book_id)
                purchaseList[i].book = book.data.serializationBook;
            } else {
                book = await API.sendGet(URL.api.book.singlePublished + purchaseList[i].single_published_book_id)
                purchaseList[i].book = book.data.singlePublishedBook;
            }

            const author = await API.sendGet(URL.api.author.get + purchaseList[i].book.author_id)
            purchaseList[i].author = author.data.result;

        }*/
    }
    async downloadAction(book_detail_id){
        const res = await API.sendGet(URL.api.book.download+ "/" + book_detail_id + "?type=" + "file");
        let downloadUrl = res.data.url;
        window.open(downloadUrl);
    }
    render() {
        var purchaseList = this.state.data.purchaseList
        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">구매 내역</h2>
                </div>

                <hr/>

                {
                    purchaseList.length > 0 ?
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
                                                    <span className="review-point"><em>star</em>{item.review_score ? parseFloat(item.review_score).toFixed(1) : 0}</span>
                                                </div>
                                                {
                                                    (item.type === 1) &&
                                                    <div className="title-wrap">
                                                        <h3 className="subtitle">{item.title}</h3>
                                                    </div>
                                                }

                                                <div className="info">
                                                    <span className="label">작가</span>
                                                    <strong className="value">{item.author}</strong>

                                                    <span className="label">출간방식</span>
                                                    <strong className="value">{item.type === 1 ? "연재본" : "단행본"}</strong>
                                                </div>
                                            </div>

                                            <table className="details">
                                                <tbody>
                                                    <tr>
                                                        <td className="label">다운로드</td>
                                                        <td className="label">구매가격</td>
                                                        <td className="label">구매일</td>
                                                        <td rowSpan="2">

                                                            {
                                                                item.review ?
                                                                <button disabled className="btn btn-rounded btn-color-2">
                                                                    리뷰완료
                                                                </button>
                                                                :
                                                                <Link to={URL.service.review + item.book_detail_id}>
                                                                    <button className="btn btn-rounded btn-color-2">
                                                                        리뷰쓰기
                                                                    </button>
                                                                </Link>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <em className="download" onClick={() => this.downloadAction(item.book_detail_id)}/>
                                                        </td>
                                                        <td className="value">{parse.numberWithCommas(item.price)} 원</td>
                                                        <td className="value">{date.format(item.created_date_time)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="container">
                        <div className="no-content">
                            구매 내역이 없습니다.
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Purchase;
