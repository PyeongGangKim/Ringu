import React, { Component, Fragment } from 'react';

import ModifyBook from '../components/book/ModifyBook';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';



class ModifyBookPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <ModifyBook bookId={this.props.match.params.bookId}/>
                </div>
            </Fragment>
        )
    }
}

export default ModifyBookPage;
