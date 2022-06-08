import React, { Component, Fragment } from 'react';

import RegisterBookSelect from '../components/register/RegisterBookSelect';
import RegisterBook from '../components/register/RegisterBook';

import Header from '../components/common/Header';
import Helmet from 'react-helmet';
import string from '../config/str';
import Footer from '../components/common/Footer';

class RegisterPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var bookType = "bookType" in this.props.match.params ? parseInt(this.props.match.params.bookType) : null;

        return (
            <Fragment>
                <Helmet title={string.register + string.postfix}/>
                <Header></Header>
                <div id="wrap">
                    {
                        <RegisterBookSelect history={this.props.history}/>
                    }
                </div>
            </Fragment>
        )
    }
}

export default RegisterPage;
