import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import string from '../config/str';
import SignupSelect from '../components/accounts/SignupSelect';
import SignupHeader from '../components/common/SignupHeader';
import Footer from '../components/common/Footer';

class SignupPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.signup + string.postfix}/>
                <SignupHeader></SignupHeader>
                <div id="wrap">
                    <div id="signup">
                        <div className="signup-box">
                            <SignupSelect/>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </Fragment>
        )
    }
}

export default SignupPage;
