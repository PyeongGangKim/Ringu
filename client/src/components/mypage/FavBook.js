import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

import BookCard from '../book/BookCard'
import '../../scss/mypage/favorite.scss';
import '../../scss/common/button.scss';
import '../../scss/common/book.scss';

import string from '../../config/str';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class FavBook extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ui: {

            },
            data: {
                favoriteList:[],
            },
            msg: {

            }
        };
    }

    async componentDidMount() {
        var state = this.state;

        const res = await API.sendGet(URL.api.favorite.book.list)


        if(res.status === 200) {
            var favoriteList = res.data.favoriteBookList
            state.data.favoriteList = favoriteList

            this.setState(state)
        }
    }

    handleDelete = async(book) => {
        var state = this.state;
        var filteredArray = state.data.favoriteList.filter(item => item.id !== book.id)
        var data = {...state.data, favoriteList: filteredArray}
        this.setState({data: data})
        alert("즐겨찾기가 취소되었습니다.")
    }

    render() {
        var favoriteList = this.state.data.favoriteList

        return (
            <>
                <Helmet title={string.favorite + string.postfix}/>
                <div className="title-wrap">
                    <h2 className="title">컨텐츠 찜</h2>
                </div>

                <hr/>

                {
                    favoriteList.length > 0 ?
                    <div className="container">
                        <div id="favbooklist-area" className="book-area">
                            <div className="container">
                                {
                                    favoriteList.map(item => {
                                        var status = ""
                                        if (item.type === 2) {
                                            status = "pub"
                                        }
                                        else if (item.is_finished) {
                                            status = "ser-ed"
                                        }
                                        else {
                                            status = "ser"
                                        }
                                        return (
                                            <BookCard
                                                key={item.id}
                                                book = {item}
                                                status = {status}
                                                handleUpdate = {this.handleDelete}
                                                favorite
                                                isFavorite
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="container">
                        <div className="no-content">
                            찜한 작품이 없습니다.
                        </div>
                    </div>
                }


            </>
        )
    }
}

export default FavBook;
