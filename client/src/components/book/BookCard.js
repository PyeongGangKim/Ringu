import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import '../../scss/common/book.scss';

import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class BookCard extends Component {
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
                const duplicate = await API.sendGet(URL.api.favorite.book.duplicate, params)
                if(duplicate.status === 200) {
                    if(duplicate.data.message === 'OK') {
                        const res = await API.sendPost(URL.api.favorite.book.create, params)
                        if(res.status === 201) {
                            state.isFavorite = true;
                            this.setState(state);
                        }
                    }
                    else if(duplicate.data.message === 'duplicate') {
                        alert("이미 찜한 작품입니다.")
                    }
                }
            } catch(e) {
                var error = e.response
                if(error.status === 401) {
                    if(window.confirm("로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?")) {
                        window.location.href = URL.service.accounts.login;
                    }
                }
                else {
                    alert("찜하기에 실패하였습니다.")
                }
            }
        }

        if("handleUpdate" in this.props && typeof this.props.handleUpdate !== 'undefined'){
            this.handleUpdate(book)
        }
    }

    onDeleteClick = async(book) => {
        var state = this.state

        try {
            if(window.confirm("선택한 작품을 삭제하시겠습니까?")) {
                const res = await API.sendDelete(URL.api.book.delete + book.id)
                if(res.status === 200) {
                    alert("작품이 삭제되었습니다")
                }
                else {
                    alert("작품을 삭제하지 못했습니다. 잠시 후 시도해주세요")
                    return;
                }
            } else {
                return;
            }
        } catch(e) {
            console.log(e)
            alert("작품을 삭제하지 못했습니다. 잠시 후 시도해주세요")
            return;
        }

        if("handleUpdate" in this.props && typeof this.props.handleUpdate !== 'undefined'){
            this.handleUpdate(book)
        }
    }

    handleModify = (book_id, type) => {
        if(window.confirm("선택한 작품을 수정하시겠습니까?")) {
            if(type === 1) {
                window.location.href = URL.service.book.modify_series + book_id
            } else {
                window.location.href = URL.service.book.modify + book_id
            }
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
            <div className={"book-box " + status}>
                <div className="book-type-wrap">
                    <span> {mark[status]} </span>
                </div>

                {
                    status === 'wait' ?
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
                    :
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
                }

                <div className="book-info-box">
                    {
                        status === 'wait' ?
                        <div className="wait">
                            승인 대기중
                        </div>
                        :
                        <div className="book-info">
                            <span className="price">{parse.numberWithCommas(book.price)}원</span>
                            <div className="details">
                                <div className="author-info">
                                    <span className="author-label"> 작가 </span>
                                    <span> {book.author_nickname} </span>
                                </div>
                                <div className="review-info">
                                    <span className="star"> ★ </span>
                                    <span> {book.score ? parseFloat(book.score).toFixed(1) : parseFloat(0).toFixed(1)} </span>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        isHost === true &&
                        <div className="btn-wrap">
                            <button className="btn" onClick={() => this.onDeleteClick(book)}> 삭제 </button>
                            <button className="btn" onClick={() => {book.type === 1 ? this.handleModify(book.id, 1) : this.handleModify(book.id, 2)}}> 수정 </button>
                            {
                                status.includes('ser') && <button className="btn" onClick={(e) => this.handleDisplayClick(e, book)}> 회차 </button>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default BookCard;