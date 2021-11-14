import React, { Component, Fragment } from 'react';

import ModifyBookSeries from '../components/book/ModifyBookSeries';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
class ModifyBookPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.modify + string.postfix}/>
                <Header history={this.props.history}></Header>
                <div id="wrap">
                    <ModifyBookSeries bookId={this.props.match.params.bookId}/>
                </div>
            </Fragment>
        )
    }
}

export default ModifyBookPage;