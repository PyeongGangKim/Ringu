import React, { Component, Fragment } from 'react';

import BookSeries from '../components/book/BookSeries';
import Book from '../components/book/Book';
import Header from '../components/common/Header';

import URL from '../helper/helper_url';
import API from '../utils/apiutils';
import User from '../utils/user';
import Helmet from 'react-helmet';
import string from '../config/str';
import GuideButton from '../components/home/guide/GuideButton'

class BookPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: this.props.match.params.book,
            isSuccess: false,
        }
    }

    async componentDidMount() {
        var state = this.state;
        var params = {}
        if(User.getInfo() !== null) {
            params['member_id'] = User.getInfo().id
        }

        const res = await API.sendGet(URL.api.book.get + state.book, params)

        if(res.status === 200) {
            var book = res.data.book
            state.book = book
            state.book.review_score = state.book.review_score/state.book.review_count
            state.isSuccess = true
            this.setState(state)
        }
    }

    render() {
        var state = this.state

        return (
            this.state.isSuccess ?
            <Fragment>
                <Helmet title={`${state.book.title} ` + string.postfix}/>
                <Header home={true}></Header>
                <div id="wrap" style={{display: "flex"}}>
                    {
                        this.state.book.type === 1 ?
                        <BookSeries book={state.book}/>
                        :
                        <Book book={state.book}/>
                    }

                </div>
                <GuideButton/>
            </Fragment>
            : null
        )
    }
}

export default BookPage;
