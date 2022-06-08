import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

import string from '../config/str';

import Main from '../components/home/Main';
import Header from '../components/common/Header';
import GuideButton from '../components/home/guide/GuideButton'

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.base}/>
                <Header></Header>
                <Main></Main>
                <GuideButton/>
            </Fragment>
        )
    }
}

export default Home;
