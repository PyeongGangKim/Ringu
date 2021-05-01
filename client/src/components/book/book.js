import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/book/book.scss';

class Book extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        var state = this.state;

        return (
            <div className="container">

            </div>
        )
    }
}

export default Book;
