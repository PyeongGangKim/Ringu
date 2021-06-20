import React, { Component, Fragment } from 'react';
import Search from '../components/search/Search';
import Header from '../components/common/Header';

class SearchPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search:props.location.search,
        };
    }

    render() {
        return (
            <Fragment>
                <Header search={this.state.search} history={this.props.history}></Header>
                <Search search={this.state.search}></Search>
            </Fragment>
        )
    }
}

export default SearchPage;
