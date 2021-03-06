import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';

import '../../scss/common/common.scss'
import '../../scss/common/header.scss';
import '../../scss/common/input.scss';

import URL from '../../helper/helper_url';

class SignupHeader extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div id="signup-header" className="bottom-line">
                <h1 id="signup-logo">
                    <Link to={URL.service.home}>
                        <img src="/logo.png" height="60px"/>
                    </Link>
                </h1>
            </div>
        );
    }
}

export default SignupHeader;
