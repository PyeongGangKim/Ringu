import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';

import '../../scss/common/common.scss'
import '../../scss/common/header.scss';
import '../../scss/common/input.scss';

import helper_url from '../../helper/helper_url';

class SignupHeader extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <header>
                <div id="signup-header" className={this.props.visible && "bottom-line"}>
                    <h1 id="signup-logo">
                        <Link to="/home">
                            <img src="logo.png" height="70px"/>
                        </Link>
                    </h1>
                </div>
            </header>
        );
    }
}

export default SignupHeader;
