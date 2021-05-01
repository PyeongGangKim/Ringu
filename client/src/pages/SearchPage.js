import React, { Component, Fragment } from 'react';
import Search from '../components/search/Search';
import Header from '../components/common/Header';

class SearchPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header></Header>
                <Search></Search>
            </Fragment>
        )
    }
}

export default SearchPage;
