import React, { Component, Fragment } from 'react';
import Search from '../components/search/Search';
import Header from '../components/common/Header';

import URL from '../helper/helper_url';
import parse from '../helper/parse';

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search:props.location.search,
        };

        var search = parse.searchToDict(props.location.search)

        console.log(search)

        if (!("keyword" in search && !!search.keyword)) {
            alert("검색어를 입력해주세요.")
            window.location.href = URL.service.home;
        }
    }

    render() {
        return (
            <Fragment>
                <Header search={this.state.search} history={this.props.history}></Header>
                <Search search={this.state.search} history={this.props.history}></Search>
            </Fragment>
        )
    }
}

export default SearchPage;
