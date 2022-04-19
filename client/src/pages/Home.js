import React, { Component, Fragment } from 'react';
import Main from '../components/home/Main';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Helmet from 'react-helmet';
import string from '../config/str';
class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.base}/>
                <Header searchVisible={false} history={this.props.history}></Header>
                <Main history={this.props.history}></Main>
            </Fragment>
        )
    }
}

export default Home;
