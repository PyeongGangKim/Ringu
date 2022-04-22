import React, { Component, Fragment } from 'react';

import BookType1 from '../components/book/BookType1';
import BookType2 from '../components/book/BookType2';
import Header from '../components/common/Header';

import URL from '../helper/helper_url';
import API from '../utils/apiutils';
import User from '../utils/user';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
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
                <Header home={true} history={this.props.history}></Header>
                <div id="wrap" style={{display: "flex"}}>
                    {
                        this.state.book.type === 1 ?
                        <BookType1 book={state.book}  history={this.props.history}/>
                        :
                        <BookType2 book={state.book} history={this.props.history}/>
                    }

                </div>
            </Fragment>
            : null
        )
    }
}

export default BookPage;
