import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import SignupHeader from '../components/common/SignupHeader';
import URL from '../helper/helper_url';


class WelcomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <SignupHeader></SignupHeader>
                <div id="wrap">
                    <div id="signup">
                        <div className="signup-box">
                            <div className="welcome-wrap">
                                <div className="welcome-text">
                                    {this.props.location.state.nickname} 님!<br/>
                                    회원 가입을 환영합니다.
                                </div>
                                <div className="content-wrap">
                                    {/*<button className="btn btn-block btn-transparent btn-full content-btn">나의 관심사</button>*/}
                                    <Link to={URL.service.home}>
                                        <button className="btn btn-block btn-color-1 btn-full content-btn">지금 바로 보러가기</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default WelcomePage;
