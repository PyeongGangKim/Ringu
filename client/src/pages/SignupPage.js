import React, { Component, Fragment } from 'react';
import SignupSelect from '../components/accounts/SignupSelect';
import SignupHeader from '../components/common/SignupHeader';

class SignupPage extends Component {
    constructor(props) {
        super(props);

        console.log(props)
    }

    render() {
        return (
            <Fragment>
                <SignupHeader></SignupHeader>
                <div id="wrap">
                    <div id="signup">
                        <div className="signup-box">
                            <SignupSelect/>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default SignupPage;
