import React, { Component, Fragment } from 'react';

import Book from '../components/book/Book';
import Header from '../components/common/Header';

class BookPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hash: this.props.location.hash
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        var state = this.state
        state.hash = this.props.location.hash
        this.setState(state);
    }

    render() {
        var state = this.state

        return (
            <Fragment>
                <Header home={true}></Header>
                <div className="content" style={{"textAlign": "center"}}>
                  <Book/>
                </div>
            </Fragment>
        )
    }
}

export default BookPage;
