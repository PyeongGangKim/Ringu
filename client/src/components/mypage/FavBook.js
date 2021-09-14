import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import Book from '../../components/book/Book'
import '../../scss/mypage/favorite.scss';
import '../../scss/common/button.scss';
import '../../scss/common/book.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class FavBook extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();

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
        var state = this.state;

        return (
            <div id="mypage" className="page2">
                <div className="title-wrap">
                    <h2 className="title">컨텐츠 찜</h2>
                </div>

                <hr/>

                {
                    favoriteList.length > 0 ?
                    <div className="container">
                        <div id="favbooklist-area" className="booklist-area">
                            <ul>
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
                                            <Book
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
                            </ul>
                        </div>
                    </div>
                    :
                    <div className="container">
                        <div className="no-content">
                            찜한 작품이 없습니다.
                        </div>
                    </div>
                }


            </div>
        )
    }
}

export default FavBook;
