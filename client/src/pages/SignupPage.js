import React, { Component, Fragment } from 'react';
import Signup from '../components/accounts/Signup';
import SignupHeader from '../components/common/SignupHeader';

class SignupPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const signup = this.props.location.pathname === '/signup';
        const welcome = this.props.location.pathname === '/welcome';

        return (
            <Fragment>
                <SignupHeader></SignupHeader>
                <div id="wrap">
                    <Signup signup={signup} welcome={welcome}/>
                </div>
            </Fragment>
        )
    }
}

export default SignupPage;
