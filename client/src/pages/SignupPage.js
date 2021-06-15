import React, { Component, Fragment } from 'react';
import Signup from '../components/accounts/Signup';
import SignupHeader from '../components/common/SignupHeader';

class SignupPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <SignupHeader></SignupHeader>
                <div id="wrap">
                    <Signup location={this.props.location}/>
                </div>
            </Fragment>
        )
    }
}

export default SignupPage;
