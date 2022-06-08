import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Paging from '../../components/common/Paging'
import '../../scss/mypage/purchase.scss';
import '../../scss/common/button.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Purchase extends Component {
    limit = 5;
    constructor(props) {
        console.log(props)
        super(props)
        var years = [2021]

        for(var i=new Date().getFullYear(); i>2021; i--) {
            years.unshift(i)
        }

        var searchParams = new URLSearchParams(props.location.search)

        this.state = {
            ui: {

            },
            data: {
                purchaseList:[],
                years: years,
                selectedYear: (searchParams.has('period') && !!searchParams.get('period')) ? parseInt(searchParams.get('period')) : 1,
                total: 0,
                page: 1,
            },
            msg: {

            }
        };
    }

    async componentDidMount() {
        var state
        this.getPurchaseList(true);
    }

    getPurchaseList = async(init=false) => {
        var state = this.state;
        var year = state.data.selectedYear;
        var params = {
            year: year,
            offset: (state.data.page - 1) * this.limit,
            limit: this.limit,
        }
        
        try {
            const res = await API.sendGet(URL.api.purchase.list, params)
            if(res.status === 200) {
                var purchaseList = res.data.purchaseList
                var count = res.data.count;

                state.data.purchaseList = purchaseList
                state.data.total = count
                this.setState(state)

                if(!init) {
                    this.props.history.replace(URL.service.mypage.purchase + (year === 0 ? '' : `?period=${year}`))
                }
            } else if(res.status === 204) {
                state.data.purchaseList = []
                state.data.total = 0
                this.setState(state)

                if(!init) {
                    this.props.history.replace(URL.service.mypage.purchase + (year === 0 ? '' : `?period=${year}`))
                }
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

    handlePageChange = async(page) => {
        var state = this.state;
        state.data.page = page
        this.setState(state)

        this.getPurchaseList()
    }

    handleYearClick = async(y) => {
        var state = this.state;
        state.data.selectedYear = y; 
        this.setState(state); 
        this.getPurchaseList()
    }

    render() {
        var state = this.state;
        
        return (
            <>
                <div className="title-wrap">
                    <h2 className="title">구매 내역</h2>
                </div>

                <hr/>

                <div className="years">
                    <div className={"year " + (state.data.selectedYear === 1 ? "active" : "")} onClick={() => this.handleYearClick(1)}>1개월</div>
                    <div className={"year " + (state.data.selectedYear === 3 ? "active" : "")} onClick={() => this.handleYearClick(3)}>3개월</div>
                    <div className={"year " + (state.data.selectedYear === 6 ? "active" : "")} onClick={() => this.handleYearClick(6)}>6개월</div>
                    {
                        state.data.years.map((year, idx) => {
                            return (
                                <div key={idx} className={"year " + (state.data.selectedYear === year ? "active" : "")} onClick={() => this.handleYearClick(year)}>{year}</div>
                            )
                        })
                    }
                </div>

                {
                    state.data.purchaseList.length > 0 ?
                    <div className="container">
                        {/*<div className="filter">
                            최신순
                            <em/>
                        </div>*/}

                        {
                            state.data.purchaseList.map(item => {
                                return (
                                    <div id="purchaselist-area" key={item.id}>
                                        <div className="purchase-box">
                                            <div className="book-info">
                                                <div className="title-wrap">
                                                    <h3 className="title">
                                                        {
                                                            item.type === 1 && `[${item.round}회차] `
                                                        }
                                                        {item.title}
                                                    </h3>
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
                        <Paging
                            count={state.data.total}
                            page={state.data.page}
                            perPage={this.limit}
                            onChange={this.handlePageChange}
                        />
                    </div>
                    :
                    <div className="container">
                        <div className="no-content">
                            {state.data.selectedYear < 10 ? `최근 ${state.data.selectedYear}개월 동안 ` : `${state.data.selectedYear}년 `}구매 내역이 없습니다.
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default withRouter(Purchase);
