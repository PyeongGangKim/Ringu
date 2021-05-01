import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/mypage/purchase.scss';
import '../../scss/common/button.scss';

class Purchase extends Component {
  constructor(props) {
    super(props)
    let userInfo = User.getInfo();
  }

  render() {
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

                <div id="purchaselist-area">
                    <div className="purchase-box">
                        <div className="book-info">
                            <div className="title-wrap">
                                <h3 className="title">책제목입니다</h3>
                                <span className="review-point"><em>star</em>5.0</span>
                            </div>
                            <div className="info">
                                <span className="label">작가</span>
                                <strong className="value">작가1</strong>

                                <span className="label">출간방식</span>
                                <strong className="value">월간연재</strong>
                            </div>
                        </div>

                        <table className="details">
                            <tr>
                                <th className="label">다운로드</th>
                                <th className="label">구매가격</th>
                                <th className="label">구매일</th>
                                <td rowspan="2">
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
                                <td className="value">8,000원</td>
                                <td className="value">20. 12. 20. 월</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Purchase;
