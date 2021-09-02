import React, { Component, Fragment } from 'react';

import User from '../utils/user';

import SideMemberInfo from '../components/common/SideMemberInfo';
import Author from '../components/author/Author';
import Header from '../components/common/Header';

class AuthorPage extends Component {
    constructor(props) {
        super(props);

        let userInfo = User.getInfo();

        if(userInfo !== null && parseInt(userInfo.id) === parseInt(props.match.params.author_id) && userInfo.type !== 1) {
            alert("작가 인증이 필요합니다.")
            window.location.href = "/mypage";
            return false;
        }

        this.state = {
            authorId: this.props.match.params.author_id,
            isAuthor: (userInfo !== null && parseInt(userInfo.id) === parseInt(props.match.params.author_id) && parseInt(userInfo.type) === 1) ? true : false,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        var state = this.state
        state.hash = this.props.location.hash
        this.setState(state);
    }

    render() {
        const display = this.props.location.pathname == "/mypage" ? true : false;
        var state = this.state

        return (
            <Fragment>
                <Header author history={this.props.history}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author={true} authorId={this.props.match.params.author_id}/>
                    </div>
                    <Author authorId={state.authorId} isAuthor={state.isAuthor}/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorPage;
