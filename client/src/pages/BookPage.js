import React, { Component, Fragment } from 'react';

import BookType1 from '../components/book/BookType1';
import BookType2 from '../components/book/BookType2';
import Header from '../components/common/Header';

import date from '../helper/date';
import parse from '../helper/parse';
import URL from '../helper/helper_url';
import API from '../utils/apiutils';

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
        const res = await API.sendGet(URL.api.book.get + state.book)
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
                <Header home={true}></Header>
                <div id="wrap" style={{display: "flex"}}>
                    {
                        this.state.book.type === 1 ?
                        <BookType1 book={state.book}/>
                        :
                        <BookType2 book={state.book}/>
                    }

                </div>
            </Fragment>
            : null
        )
    }
}

export default BookPage;
