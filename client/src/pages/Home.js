import React, { Component, Fragment } from 'react';
import Main from '../components/home/Main';
import Header from '../components/common/Header';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header visible={false}></Header>
                <Main history={this.props.history}></Main>
            </Fragment>
        )
    }
}

export default Home;
