import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';



import User from '../../utils/user';

import '../../scss/common/book.scss';


import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Book extends Component {
    constructor(props) {
        super(props)

        this.handleDisplayClick = props.handleDisplayClick;
        this.handleUpdate = props.handleUpdate;

        this.state = {
            isFavorite: ('isFavorite' in props && typeof props.isFavorite !== 'undefined') ? props.isFavorite : !!this.props.book.favorite_book_id,
        }
    }

    onFavoriteClick = async(e, book) => {
        e.preventDefault()
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
                const duplicate = await API.sendPost(URL.api.favorite.book.duplicate, params)

                if(duplicate.status === 200) {
                    const res = await API.sendPost(URL.api.favorite.book.create, params)
                    if(res.status === 201) {
                        state.isFavorite = true;
                        this.setState(state);
                    }
                    else {
                        alert("즐겨찾기에 추가하지 못하였습니다.")
                    }
                } else if(duplicate.status === 403) {
                    if(window.confirm("로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
                        window.location.href = URL.service.accounts.login;
                    }
                }
                else {
                    alert("이미 즐겨찾기되어 있습니다.")
                }
            } catch(e) {
                console.log(e)
            }
        }

        if("handleUpdate" in this.props && typeof this.props.handleUpdate !== 'undefined'){
            this.handleUpdate(book)
        }
    }

    onDeleteClick = async(book) => {
        var state = this.state

        try {
            const res = await API.sendDelete(URL.api.book.delete + book.id)
            if(res.status === 200) {
                alert("작품이 삭제되었습니다")
            }
            else {
                alert("작품을 삭제하지 못했습니다. 잠시 후 시도해주세요")
            }
        } catch(e) {
            console.log(e)
        }

        if("handleUpdate" in this.props && typeof this.props.handleUpdate !== 'undefined'){
            this.handleUpdate(book)
        }
    }

    handleModify = (book_id) => {
        if(window.confirm("선택한 도서를 수정하시겠습니까?")) {
            window.location.href = URL.service.book.modify + book_id
        }
    }

    render() {
        var book = this.props.book;
        var status = this.props.status;
        var isHost = ('isHost' in this.props && !!this.props.isHost) ? true : false;
        var favorite = ('favorite' in this.props && typeof this.props.favorite != 'undefined') ? true : false;
        var isFavorite = this.state.isFavorite;

        const mark = {
            'ser': "연재중",
            'ser-ed': "연재완료",
            'pub': "단행본",
        }

        return (
            <li className={"book-box " + status}>
                <div className="book-type-wrap">
                    <span> {mark[status]} </span>
                </div>
                <Link to={URL.service.book.book + book.id}>
                    <div className="thumbnail-box">
                        <div className="img-area">

                            <img src={!!book.img ? book.img : "/ringu_thumbnail.png"}/>
                        </div>
                        {
                            favorite &&
                            <div className="favorite-box">
                                <button className="favorite-btn">
                                    <em onClick={(e) => this.onFavoriteClick(e, book)} className={"favorite " + (isFavorite ? "on" : "")}/>
                                </button>
                            </div>
                        }

                        <h3 className="title">{book.title}</h3>
                    </div>
                </Link>

                {
                    status === 'wait' ?
                    <div className="book-info-box">
                        <div className="wait">
                            승인 대기중
                        </div>
                    </div>
                    :
                    <div className="book-info-box">
                        <div className="book-info">
                            <span className="price">{parse.numberWithCommas(book.price)}원</span>
                            <div className="details">
                                <div className="author-info">
                                    <span className="author-label"> 작가 </span>
                                    <span> {book.author_nickname} </span>
                                </div>
                                <div className="review-info">
                                    <span className="star"> ★ </span>
                                    <span> {book.mean_score ? parseFloat(book.mean_score).toFixed(1) : parseFloat(0).toFixed(1)} </span>
                                </div>
                            </div>
                        </div>
                        {
                            isHost === true &&
                            <div className="btn-wrap">
                                {
                                    status.includes('ser') && <button className="btn" onClick={(e) => this.handleDisplayClick(e, book)}> 연재정보 </button>
                                }
                                {
                                    status.includes('pub') && <button className="btn" onClick={() => this.handleModify(book.id)}> 수정 </button>
                                }
                                <button className="btn" onClick={() => this.onDeleteClick(book)}> 삭제 </button>
                            </div>
                        }
                    </div>
                }


            </li>
        )
    }
}

export default Book;
