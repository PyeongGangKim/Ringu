import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import string from '../config/str';
import SignupDetail from '../components/accounts/SignupDetail';
import SignupDetailSNS from '../components/accounts/SignupDetailSNS';
import SignupHeader from '../components/common/SignupHeader';
import Footer from '../components/common/Footer';

class SignupDetailPage extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
        return (
            <Fragment>
                <Helmet title={string.signup + string.postfix}/>
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
