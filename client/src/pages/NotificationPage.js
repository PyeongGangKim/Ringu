import React, { Component, Fragment } from 'react';

import Notification from '../components/notification/Notification';
import Header from '../components/common/Header';

class NotificationPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //const display = this.props.location.pathname == "/favorite/book" ? true : false;

        return (
            <Fragment>
                <Header></Header>
                <Notification></Notification>
            </Fragment>
        )
    }
}

export default NotificationPage;
