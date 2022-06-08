import React, { Component, Fragment } from 'react';

import Review from '../components/register/Review';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';

class ReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book_detail: this.props.match.params.book_detail,
        }
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.review + string.postfix}/>
                <Header></Header>
                <div id="wrap">
                    <Review book_detail={this.state.book_detail}/>
                </div>
            </Fragment>
        )
    }
}

export default ReviewPage;
