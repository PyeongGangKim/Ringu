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

        try {
            const res = await API.sendGet(URL.api.purchase.list)

            if(res.status === 200) {
                var purchaseList = res.data.purchaseList
                state.data.purchaseList = purchaseList
                this.setState(state)
            }
        } catch(e) {
            alert("구매 내역을 불러오지 못 했습니다")
        }
        
    }
    async downloadAction(book_detail_id){
        try {
            const res = await API.sendGet(URL.api.book.download+ "/" + book_detail_id + "?type=" + "file");
            let downloadUrl = res.data.url;
            window.location.assign(downloadUrl);
        } catch(e) {
            alert("다운로드에 실패하였습니다")
        }
        
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
                        {/*<div className="filter">
                            최신순
                            <em/>
                        </div>*/}

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
                                                        <h3 className="subtitle">{item.subtitle}</h3>
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
