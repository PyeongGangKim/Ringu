import React, { Component, Fragment } from 'react';

import Notification from '../components/notification/Notification';
import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';
class NotificationPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //const display = this.props.location.pathname == "/favorite/book" ? true : false;

        return (
            <Fragment>
                <Helmet title={string.notification + string.postfix}/>
                <Header></Header>
                <Notification></Notification>
            </Fragment>
        )
    }
}

export default NotificationPage;
