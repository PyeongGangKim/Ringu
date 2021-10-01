// 연재본
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/book/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

// 연재본
class BookType1 extends Component {
    constructor(props) {
        super(props)
        this.introRef = React.createRef();
        this.authorRef = React.createRef();
        this.seriesRef = React.createRef();
        this.reviewRef = React.createRef();

        this.state = {
            book: props.book,
            reviewList: [],
            detailList: [],
            tab: 'intro',
            tabChange: false,
            dock: false,
            selected: {},
            author: false,
            isFavorite: false,
        }
    }

    onFavoriteClick = async(book) => {
        var state = this.state

        // 즐찾 삭제
        if(state.isFavorite) {
            try {
                const res = await API.sendGet(URL.api.favorite.book.get + book.id)
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
                    book_id: book.id,
                }
                const duplicate = await API.sendGet(URL.api.favorite.book.duplicate, params)
                if(duplicate.status === 200) {
                    const res = await API.sendPost(URL.api.favorite.book.create, params)
                    if(res.status === 201) {
                        state.isFavorite = true;
                        this.setState(state);
                    }
                }
            } catch(e) {
                var error = e.response;
                if(error.status === 409) {
                    alert("이미 찜한 작품입니다.")
                }
                else if(error.status === 403) {
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

    async componentDidMount() {
        var state = this.state;

        try {
            const duplicate = await API.sendGet(URL.api.favorite.book.duplicate, {book_id: state.book.id})
            if(duplicate.status === 200) {
                state.isFavorite = false;
            }
            else {
                state.isFavorite = true;
            }

            let userInfo = User.getInfo();
            if (userInfo.id === state.book.author_id) {
                state.author = true;
            }
            const res1 = await API.sendGet(URL.api.review.getReivewList, {title : false, book_id: state.book.id})

            if(res1.status === 200) {
                state.reviewList = res1.data.reviewList
            }

            var params = {
                member_id : userInfo !== null ? userInfo.id : null
            }

            const res2 = await API.sendGet(URL.api.book.getDetailList + state.book.id, params)
            if(res2.status === 200) {
                state.detailList = res2.data.detailList
            }

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

    handlePurchase = (type) => {
        var state = this.state
        var purchaseList = []
        if(type === 0) {
            purchaseList = Object.values(state.selected)
        }
        else {
            purchaseList = state.detailList
        }

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

    downloadAction = async(book_detail_id) => {

        const res = await API.sendGet(URL.api.book.download+ "/" + book_detail_id + "?type=file");
        if(res.status === 200) {
            let downloadUrl = res.data.url;
            window.location.assign(downloadUrl);
        }
        else {
            alert("오류가 발생했습니다.")
        }
    }

    render() {
        var state = this.state;
        var book = state.book;

        return (
            <div id="book" className="page3" >
                <div className="book-content">
                    <div className="book-info">
                        <div className="book-thumbnail-box">
                            <img src={!!state.book.img ? state.book.img : "/assets/img/ringu_thumbnail.png" } />

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
                                                            <td>{(item.purchases.length === 0 && state.author === false) &&
                                                                <input type="checkbox" checked={(!!state.selected[item.id]) ? true : false} onChange={this.handleSelect} value={i} />}</td>
                                                            <td>{i+1}회차.</td>
                                                            {
                                                                i === 0 ?
                                                                <td>
                                                                    {item.title}
                                                                    <div className="preview-mark" onClick={() => this.downloadAction()}>무료 미리보기</div>
                                                                </td>
                                                                :
                                                                <td>
                                                                    {item.title}
                                                                </td>
                                                            }
                                                            {
                                                                !state.author &&
                                                                <td>
                                                                    {
                                                                        item.purchases.length || i === 0 ?
                                                                        <em className="download" onClick={() => this.downloadAction(item.id)} />
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
                                        !state.author &&
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
                                                    <img src={!!state.book.author_profile ? state.book.author_profile : "/assets/img/blank.jpg"}/>
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
                                    <div className="review-box" style={{marginLeft:"10px"}}>
                                        {
                                            state.reviewList.map((item, review_idx) => {
                                                return (
                                                    <div className="review-item" key={item.id}>
                                                        <div className="info">
                                                            <span> {item.nickname} </span>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BookType1;
