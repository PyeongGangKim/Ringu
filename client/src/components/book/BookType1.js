// 연재본
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import Paging from '../../components/common/Paging'
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/book/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

// 연재본
class BookType1 extends Component {
    userInfo = User.getInfo();
    constructor(props) {
        super(props)
        this.introRef = React.createRef();
        this.authorRef = React.createRef();
        this.seriesRef = React.createRef();
        this.reviewRef = React.createRef();
        this.perPage = 10;

        this.state = {
            book: props.book,
            reviewList: [],
            detailList: [],
            detailTotal: 0,
            detailPage: 1,
            tab: 'intro',
            tabChange: false,
            dock: false,
            selected: {},
            isAuthor: false,
            isFavorite: false,
        }
    }

    async componentDidMount() {
        var state = this.state;

        if(User.getInfo() !== null) {
            try {
                const duplicate = await API.sendGet(URL.api.favorite.book.duplicate, {book_id: state.book.book_id})
                if(duplicate.status === 200) {
                    if(duplicate.data.message === 'OK') {
                        state.isFavorite = false;
                        this.setState(state)
                    }
                    if(duplicate.data.message === 'duplicate') {
                        state.isFavorite = true;
                        this.setState(state)
                    }
                }
            }
            catch(e) {
                var error = e.response
            }
        }

        try {
            if (this.userInfo !== null && typeof this.userInfo !== "undefined" && this.userInfo.id === state.book.author_id) {
                state.isAuthor = true;
            }
            const res = await API.sendGet(URL.api.review.getReivewList, {title : false, book_id: state.book.book_id})

            if(res.status === 200) {
                state.reviewList = res.data.reviewList
            }

            this.getDetailList();

            window.addEventListener('scroll', this.handleScroll)

            if (window.scrollY > 650) {
                state.dock = true;
            } else {
                state.dock = false;
            }

            this.setState(state)
        }
        catch(e) {
            console.error(e)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.tab !== this.state.tab || prevState.tabChange !== this.state.tabChange) {
            window.addEventListener('scroll', this.handleScroll)
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    getDetailList = async(page = 1, order = 'ASC') => {
        var state = this.state;
        var params = {
            member_id : this.userInfo !== null ? this.userInfo.id : null,
            offset: (page - 1) * this.perPage,
            limit: this.perPage,
            order: order,
        }

        try {
            const res = await API.sendGet(URL.api.book.getDetailList + state.book.book_id, params)
            if(res.status === 200) {
                state.detailList = res.data.detailList
                state.detailTotal = res.data.total.count;
                state.detailPage = page;
                this.setState(state);
            }
        } catch(err) {
            alert("회차 목록을 불러오지 못했습니다")
        }
    }

    onFavoriteClick = async(book) => {
        var state = this.state

        // 즐찾 삭제
        if(state.isFavorite) {
            try {
                const res = await API.sendGet(URL.api.favorite.book.get + book.book_id)
                if(res.status === 200) {
                    var fb = res.data.favoriteBook;

                    const res2 = await API.sendDelete(URL.api.favorite.book.delete + fb.id)
                    if(res2.status === 200) {
                        state.isFavorite = false;
                        this.setState(state);
                    }
                }
                else if(res.status === 204) {
                    alert("이미 삭제되었습니다.")
                }
            } catch(e) {
                console.error(e)
            }
        }
        // 즐찾 추가
        else {
            try {
                var params = {
                    book_id: book.book_id,
                }
                const duplicate = await API.sendGet(URL.api.favorite.book.duplicate, params)
                if(duplicate.status === 200) {
                    if(duplicate.data.message === 'OK') {
                        const res = await API.sendPost(URL.api.favorite.book.create, params)
                        if(res.status === 201) {
                            state.isFavorite = true;
                            this.setState(state);
                        }
                    } else if(duplicate.data.message === 'duplicate') {
                        alert("이미 찜한 작품입니다.")
                    }
                }
            } catch(e) {
                var error = e.response;
                if(error.status === 403) {
                    if(window.confirm("로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
                        window.location.href = URL.service.accounts.login;
                    }
                }
                else {
                    alert("즐겨찾기에 추가하지 못하였습니다. 잠시 후 다시 시도해주세요.")
                }
            }
        }
    }

    handlePurchase = (type) => {
        if(User.getInfo() === null) {
            if(window.confirm("로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
                window.location.href = URL.service.accounts.login;
            }
            return;
        }

        var state = this.state
        var purchaseList = []
        if(type === 0) {
            purchaseList = Object.values(state.selected)
            if(purchaseList.length === 0) {
                alert('회차를 선택해주세요')
                return;
            }

            if(!window.confirm('선택한 작품을 모두 구매하시겠습니까?\n확인을 누르면 구매 페이지로 이동합니다.')) {
                return;
            }
        }
        else {
            if(!window.confirm('구매 가능한 작품을 모두 구매하시겠습니까?\n확인을 누르면 구매 페이지로 이동합니다.')) {
                return;
            }
            purchaseList = state.detailList.filter(detail => detail.purchases.length === 0 && detail.round !== 1)
        }
        
        purchaseList.map(detail => detail['type'] = 1)
        
        this.props.history.push({
            pathname: URL.service.buy.buy,
            state: {
                purchaseList: purchaseList
            }
        })
    }

    handleTabChange = (event, value) => {
        const tabHeight = 60;

        this.setState({tab: value, tabChange: true})
        window.removeEventListener('scroll', this.handleScroll)

        if (value === 'intro') {
            window.scrollTo({
                top: this.introRef.current.offsetTop - tabHeight,
            })
        } else if (value === 'author') {
            window.scrollTo({
                top: this.authorRef.current.offsetTop - tabHeight,
            })
        } else if (value === 'series'){
            window.scrollTo({
                top: this.seriesRef.current.offsetTop - tabHeight,
            })
        }
        else {
            window.scrollTo({
                top: this.reviewRef.current.offsetTop - tabHeight,
            })
        }
    }

    handleScroll = (event) => {
        const tabHeight = 60;
        var state = this.state;

        const scrollTop = ('scroll', event.srcElement.scrollingElement.scrollTop);
        if (scrollTop > 650) {
            state.dock = true;
        } else {
            state.dock = false;
        }

        if(state.tabChange === true) {
            state.tabChange = false
            this.setState(state);
            return;
        }

        if (scrollTop >= this.reviewRef.current.offsetTop - tabHeight) {
            state.tab = 'review';
        }
        else if (scrollTop >= this.seriesRef.current.offsetTop - tabHeight) {
            state.tab = 'series';
        }
        else if (scrollTop >= this.authorRef.current.offsetTop - tabHeight) {
            state.tab = 'author';
        }
        else {
            state.tab = 'intro';
        }

        this.setState(state);
    }

    handleSelect = evt => {
        var state = this.state;
        var detailList = state.detailList;
        var selected = state.selected;
        var value = parseInt(evt.target.value)
        var id = detailList[value]["id"]

        if(evt.target.checked === true) {
            selected[id] = detailList[value]
        } else {
            delete selected[id]
        }

        state.selected = selected;
        this.setState(state);
    }

    downloadAction = async(book_detail_id, free=false) => {
        var apiUrl = free ? URL.api.book.downloadFree + "/" + book_detail_id + "?type=file" : URL.api.book.download+ "/" + book_detail_id + "?type=file"

        try { 
            const res = await API.sendGet(apiUrl);
            if(res.status === 200) {
                let downloadUrl = res.data.url;
                window.location.assign(downloadUrl);
            }
        } catch(err) {
            console.log(err)
            alert("다운로드 할 수 없습니다")
        }
    }

    handlePageChange = async(page, order = 'ASC') => {
        var state = this.state;
        var params = {
            member_id : this.props.authorId,
            offset: (page - 1) * 5,
            limit: 5,
            order: order
        }

        state.detailPage = page;

        this.getDetailList(page, order);
    }

    render() {
        var state = this.state;
        var book = state.book;

        return (
            <div id="book" className="page3" >
                <div className="book-content">
                    <div className="book-info">
                        <div className="book-thumbnail-box">
                            <img src={!!state.book.img ? state.book.img : "/ringu_thumbnail.png" } />

                            <div className="favorite-box">
                                <button className="favorite-btn">
                                    <em onClick={() => this.onFavoriteClick(state.book)} className={"favorite " + (state.isFavorite ? "on" : "")}/>
                                </button>
                            </div>
                        </div>

                        <div className="book-detail-box">
                            <span className="book-detail">{book.author_nickname}</span>
                        </div>

                        <h3 className="book-title">{book.book_title}</h3>
                    </div>

                    <div className={state.dock === true ? "tab-wrap tab-dock-top" : "tab-wrap"}>
                        <ul className="tab-nav">
                            <li className={"tab-btn " + (state.tab === "intro" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'intro')}>책소개</li>
                            <li className={"tab-btn " + (state.tab === "series" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'series')}>회차</li>
                            <li className={"tab-btn " + (state.tab === "author" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'author')}>작가소개</li>
                            <li className={"tab-btn " + (state.tab === "review" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'review')}>리뷰</li>
                        </ul>
                        <div className="tab-inner">
                            <div id="intro-area" className="inner-box" ref={this.introRef}>
                                <div className="inner-header"> 책소개</div>
                                <div className="inner-content">
                                    {book.book_description}
                                </div>
                            </div>

                            <div id="series-area" className="inner-box" ref={this.seriesRef}>
                                <div className="inner-header"> 회차</div>
                                <div className="inner-content">
                                    <table>
                                        <tbody>
                                            {
                                                state.detailList.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                                {
                                                                    (state.isAuthor === false && item.purchases.length === 0 && item.round !== 1) ?
                                                                    <label className="cb-container">
                                                                        <input type="checkbox" checked={!!state.selected[item.id]} onChange={this.handleSelect} value={i} />
                                                                        <span className="checkmark"/>
                                                                    </label>
                                                                    :
                                                                    <label className="cb-container" disabled>
                                                                        <input type="checkbox" checked={true} value={i} disabled />
                                                                        <span className="checkmark"/>
                                                                    </label>
                                                                }

                                                            </td>
                                                            <td>{item.round}회차.</td>
                                                            {
                                                                item.round === 1 ?
                                                                <td>
                                                                    {item.title}
                                                                    <div className="preview-mark" onClick={() => this.downloadAction(item.id, true)}>무료 미리보기</div>
                                                                </td>
                                                                :
                                                                <td>
                                                                    {item.title}
                                                                </td>
                                                            }
                                                            {
                                                                !state.isAuthor &&
                                                                <td>
                                                                    {
                                                                        !!item.purchases.length || item.round === 1 ?
                                                                        <em className="download" onClick={() => this.downloadAction(item.id, item.round === 1 ? true : false)} />
                                                                        :
                                                                        <em className="lock"/>
                                                                    }
                                                                </td>
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        state.detailTotal > this.perPage &&
                                        <Paging
                                            count={state.detailTotal}
                                            page={state.detailPage}
                                            perPage={this.perPage}
                                            onChange={this.handlePageChange}
                                        />
                                    }

                                    {
                                        !state.isAuthor && state.detailList.length !== 1 &&
                                        <div className="buttons">
                                            <button className="btn btn-outline" onClick={() => this.handlePurchase(0)}> 선택 구매 </button>
                                            <button className="btn btn-color-2" onClick={() => this.handlePurchase(1)}> 전체 구매 </button>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div id="author-area" className="inner-box" ref={this.authorRef}>
                                <div className="inner-header"> 작가소개</div>
                                <div className="inner-content">
                                    <div className="author-box">
                                        <div className="author-profile">
                                            <Link to={URL.service.author + book.author_id}>
                                                <div className="author-thumbnail-box">
                                                    <img src={!!state.book.author_profile ? state.book.author_profile : "/blank.jpg"}/>
                                                </div>

                                                <div className="btn btn-block btn-color-2 btn-rounded">작가 공간</div>
                                            </Link>
                                        </div>

                                        <div className="author-description">
                                            {book.author_description}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="review-area" className="inner-box" ref={this.reviewRef}>
                                <div className="inner-header"> 리뷰</div>
                                {
                                    state.reviewList.length === 0 ?
                                    <div className="no-content">
                                        등록된 리뷰가 없습니다.
                                    </div>
                                    :
                                    <div className="inner-content review">
                                        <div className="review-header">
                                            <div className="review-score">
                                                {book.review_score ? (book.review_score).toFixed(1) : (0).toFixed(1)}
                                            </div>
                                            <div className="review-star">
                                                <em className={book.review_score >= 1 ? "on" : "off"}/>
                                                <em className={book.review_score >= 2 ? "on" : "off"}/>
                                                <em className={book.review_score >= 3 ? "on" : "off"}/>
                                                <em className={book.review_score >= 4 ? "on" : "off"}/>
                                                <em className={book.review_score >= 5 ? "on" : "off"}/>
                                                <div style={{fontSize: "12px"}}>{book.review_count ? book.review_count : 0} 개의 후기</div>
                                            </div>

                                        </div>
                                        <div className="review-box">
                                            {
                                                state.reviewList.map((item, review_idx) => {
                                                    return (
                                                        <div className="review-item" key={item.id}>
                                                            <div className="info">
                                                                <span> {item.nickname} </span>
                                                                <span className="sep"> | </span>
                                                                <span> {item.round}회차 </span>
                                                                <span className="sep"> | </span>
                                                                <em className={item.score >= 1 ? "on" : "off"}/>
                                                                <em className={item.score >= 2 ? "on" : "off"}/>
                                                                <em className={item.score >= 3 ? "on" : "off"}/>
                                                                <em className={item.score >= 4 ? "on" : "off"}/>
                                                                <em className={item.score >= 5 ? "on" : "off"}/>

                                                            </div>
                                                            <span className="review">
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        {
                                            this.state.reviewList.length >= 5 &&
                                            <div className="add-btn">
                                                <button className="add-btn btn btn-transparent"> + 더보기 </button>
                                            </div>
                                        }

                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookType1;
