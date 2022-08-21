import React, { Component, Fragment } from 'react';
import ChangePassword from '../components/accounts/ChangePassword';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Helmet from 'react-helmet';
import string from '../config/str';

import API from '../utils/apiutils';
import URL from '../helper/helper_url';

class ChangePasswordPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading : true,
            token : null,
        }
    }

    async componentDidMount() {
        var searchParams = new URLSearchParams(this.props.location.search)
        try {
            var token = searchParams.get('token')
            
            var params = {
                token: token,
            }
            
            const res = await API.sendPost(URL.api.auth.validate_token, params)
            if(res.status === 401) {
                alert("유효하지 않은 토큰입니다")
                window.location.href = "/";
                return;
            }
            
            this.state.token = token;
            this.state.isLoading = false;
            this.setState(this.state);
        }
        catch(e) {
            alert("잘못된 접근입니다")
            window.location.href = "/";
            return;
        }
    }

    render() {
        var state = this.state;

        return (
            !state.isLoading &&
            <Fragment>
                <Helmet title={string.base}/>
                <Header searchVisible={false}></Header>
                <ChangePassword token={this.state.token}/>
            </Fragment>
        )
    }
}

export default ChangePasswordPage;
