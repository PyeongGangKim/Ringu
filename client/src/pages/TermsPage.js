import React, { Component, Fragment } from 'react';

import Terms from '../components/terms/Terms';
import Header from '../components/common/Header';
import GuideButton from '../components/home/guide/GuideButton'

import Helmet from 'react-helmet';
import string from '../config/str';

class TermsPage extends Component {
    constructor(props) {
        super(props);        
    }

    render() {
        //const display = this.props.location.pathname == "/favorite/book" ? true : false;

        return (
            <Fragment>
                <Helmet title={string.notification + string.postfix}/>
                <Header></Header>
                <Terms title = {this.props.match.params.type}></Terms>
                <GuideButton/>
            </Fragment>
        )
    }
}

export default TermsPage;
