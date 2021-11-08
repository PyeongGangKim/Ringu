import React, { Component, Fragment } from 'react';

import ModifyBook from '../components/book/ModifyBook';
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
                    <ModifyBook bookId={this.props.match.params.bookId}/>
                </div>
            </Fragment>
        )
    }
}

export default ModifyBookPage;
