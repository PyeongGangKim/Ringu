import React, { Component, Fragment } from 'react';
import SignupDetail from '../components/accounts/SignupDetail';
import SignupDetailSNS from '../components/accounts/SignupDetailSNS';
import SignupHeader from '../components/common/SignupHeader';

class SignupDetailPage extends Component {
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
                            {
                                this.props.location.search !== '' ?
                                <SignupDetailSNS history={this.props.history} location={this.props.location} />
                                :
                                <SignupDetail history={this.props.history} location={this.props.location} />
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default SignupDetailPage;
