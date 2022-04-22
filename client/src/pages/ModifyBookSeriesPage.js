import React, { Component, Fragment } from 'react';

import ModifyBookSeries from '../components/book/ModifyBookSeries';
import Header from '../components/common/Header';

import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';

class ModifyBookPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header history={this.props.history}></Header>
                <div id="wrap">
                    <ModifyBookSeries bookId={this.props.match.params.bookId}/>
                </div>
            </Fragment>
        )
    }
}

export default ModifyBookPage;
