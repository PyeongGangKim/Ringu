// 단행본
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

// 단행본
class BookType2 extends Component {
    constructor(props) {
        super(props)
        this.introRef = React.createRef();
        this.authorRef = React.createRef();
        this.contentRef = React.createRef();
        this.reviewRef = React.createRef();

        this.state = {
            book: props.book,
            reviewList: [],
            tab: 'intro',
            tabChange: false,
            dock: false,
            isFavorite: false,
        }
    }

    handlePurchaseClick = async() => {
        try {
            var params = {
                member_id: User.getInfo().id,
                book_detail_id: this.state.book.book_details[0].id,
            }

            const res = await API.sendGet(URL.api.purchase.duplicate, params)
            if(res.status === 200) {
                if(window.confirm(`${this.state.book.title}을/를 구매하시겠습니까?\n확인을 누르면 구매 페이지로 이동합니다.`)) {
                    var book = this.state.book;
                    var purchase = {
                        author: book.author_nickname,
                        book_description: book.description,
                        book_detail_id: book.book_details[0].id,
                        book_id: book.id,
                        book_title: book.title,
                        img: book.img,
                        price: book.price,
                        serailization_day: book.serailization_day,
                        title: book.book_details[0].title,
                        type: book.type,
                    }
                    this.props.history.push({
                        pathname: URL.service.buy.buy,
                        state: {
                            purchaseList: [purchase]
                        }
                    })
                }
            }
        } catch(e) {
            if(e.response.status === 409) {
                if(window.confirm("이미 구매한 작품입니다. 구매 내역으로 이동하시겠습니까?")) {
                    this.props.history.push(URL.service.mypage.purchases)
                }
            } else {
                alert("에러가 발생했습니다.")
            }
        }
    }

    handleCartClick = async() => {
        var state = this.state;
        var params = {
            member_id: User.getInfo().id,
            book_detail_id: state.book.book_details[0].id,
        }

        try {
            const res = await API.sendGet(URL.api.purchase.duplicate, params)
            if(res.status === 200) {
                try {
                    var params = {
                        book_detail_id: state.book.book_details[0].id,
                    }

                    const duplicate = await API.sendGet(URL.api.cart.duplicate, params)

                    if(duplicate.status === 200) {
                        const res = await API.sendPost(URL.api.cart.create, params)

                        if(res.status === 201) {
                            if(window.confirm(`${this.state.book.title}을/를 장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?`)) {
                                this.props.history.push(URL.service.mypage.carts)
                            }
                        }
                    }
                } catch(err){
                    var error = err.response;
                    if(error.status === 409) {
                        if(window.confirm("이미 장바구니에 담긴 물품입니다.\n장바구니로 이동하시겠습니까?")) {
                            this.props.history.push(URL.service.mypage.carts)
                        }
                    }
                    else {
                        alert("장바구니에 담지 못하였습니다.")
                    }
                }

            }
        } catch(e) {
            console.error(e.response)
            if(e.response.status === 409) {
                if(window.confirm("이미 구매한 작품입니다. 구매 내역으로 이동하시겠습니까?")) {
                    this.props.history.push(URL.service.mypage.purchases)
                }
            }
            else {
                alert("장바구니에 담지 못하였습니다.")
            }
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
                    console.log("no content")
                }
            } catch(e) {
                console.log(e)
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

    downloadAction = async() => {
        var detail = this.state.book.book_details[0]
        const res = await API.sendGet(URL.api.book.download+ "/" + detail.id + "?type=preview");
        if(res.status === 200) {
            let downloadUrl = res.data.url;
            window.location.assign(downloadUrl);
        }
        else {
            alert("오류가 발생했습니다.")
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            const duplicate = await API.sendGet(URL.api.favorite.book.duplicate, {book_id: state.book.id})
            if(duplicate.status === 200) {
                state.isFavorite = false;
                this.setState(state)
            }
        }
        catch(e) {
            var error = e.response
            if(error.status === 409) {
                state.isFavorite = true;
                this.setState(state)
            }
        }

        try {
            const res = await API.sendGet(URL.api.review.getReivewList, {title : false, book_id: state.book.id})
            if(res.status === 200) {
                state.reviewList = res.data.reviewList
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
            var error = e.response
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
        } else if (value === 'content'){
            window.scrollTo({
                top: this.contentRef.current.offsetTop - tabHeight,
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
        else if (scrollTop >= this.contentRef.current.offsetTop - tabHeight) {
            state.tab = 'content';
        }
        else if (scrollTop >= this.authorRef.current.offsetTop - tabHeight) {
            state.tab = 'author';
        }
        else {
            state.tab = 'intro';
        }

        this.setState(state);
    }

    render() {
        var state = this.state;
        var book = state.book;

        return (
            <div id="book" className="page3" >
                <div className="merchant-bar">
                    <div className="merchant-box">
                        <span className="title">{book.title}</span>
                        <div className="payment-wrap">
                            <span className="price">{parse.numberWithCommas(book.price)}원</span>
                            <button className="btn btn-color-4" onClick={this.handleCartClick}> 장바구니 </button>
                            <button className="btn btn-color-2" onClick={this.handlePurchaseClick}> 구매하기 </button>
                        </div>
                    </div>

                </div>
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
                            <span className="book-detail">총 {book.page_number}페이지</span>
                        </div>

                        <h3 className="book-title">{book.title}</h3>
                    </div>

                    <div className={state.dock === true ? "tab-wrap tab-dock-top" : "tab-wrap"}>
                        <ul className="tab-nav">
                            <li className={"tab-btn " + (state.tab === "intro" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'intro')}>책소개</li>
                            <li className={"tab-btn " + (state.tab === "content" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'content')}>목차</li>
                            <li className={"tab-btn " + (state.tab === "author" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'author')}>작가소개</li>
                            <li className={"tab-btn " + (state.tab === "review" ? "active" : "")} onClick={(e) => this.handleTabChange(e, 'review')}>리뷰</li>
                        </ul>
                        <div className="tab-inner">
                            <div id="intro-area" className="inner-box" ref={this.introRef}>
                                <div className="inner-header"> 책소개</div>
                                <div className="inner-content">
                                    {book.description}
                                </div>
                            </div>

                            <div id="content-area" className="inner-box" ref={this.contentRef}>
                                <div className="inner-header"> 목차</div>
                                <div className="inner-content">
                                    <div className="preview">
                                        <div className="preview-mark" onClick={() => this.downloadAction()}>무료 미리보기</div>
                                    </div>
                                    {book.content}
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
                                <div className="inner-content review">
                                    <div className="review-header">
                                        <div className="review-score">
                                            {book.review_score ? (book.review_score).toFixed(1) : 0.0}
                                        </div>
                                        <div className="review-star">
                                            <em className={book.review_score >= 1 ? "on" : "off"}/>
                                            <em className={book.review_score >= 2 ? "on" : "off"}/>
                                            <em className={book.review_score >= 3 ? "on" : "off"}/>
                                            <em className={book.review_score >= 4 ? "on" : "off"}/>
                                            <em className={book.review_score >= 5 ? "on" : "off"}/>
                                            <div className="review-cnt">{book.review_count ? book.review_count : 0} 개의 후기</div>
                                        </div>

                                    </div>
                                    <div className="review-box">
                                        {
                                            state.reviewList.map(item => {
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
                                        state.reviewList.length === 4 &&
                                        <div className="btn-box" >
                                            <button>+ 더보기</button>
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

export default BookType2;
