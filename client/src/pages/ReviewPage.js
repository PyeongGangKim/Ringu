import React, { Component, Fragment } from 'react';

import Review from '../components/register/Review';
import Header from '../components/common/Header';

class ReviewPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <Review/>
                </div>
            </Fragment>
        )
    }
}

export default ReviewPage;
