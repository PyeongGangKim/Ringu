import React, { Component, Fragment } from 'react';
import Search from '../components/search/Search';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';

import URL from '../helper/helper_url';
import parse from '../helper/parse';
import Footer from '../components/common/Footer';

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.search = new URLSearchParams(props.location.search)
        if (!(this.search.has('keyword') && !!this.search.get('keyword'))) {
            alert("검색어를 입력해주세요.")
            props.history.goBack();
        }
    }

    render() {
        return (
            <Fragment>
                <Helmet title={`"${this.search.get('keyword')}"` + string.search + string.postfix}/>
                <Header search={this.search}></Header>
                <Search search={this.search} history={this.props.history}/>
                <Footer></Footer>
            </Fragment>
        )
    }
}

export default SearchPage;
