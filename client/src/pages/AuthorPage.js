import React, { Component, Fragment } from 'react';

import User from '../utils/user';

import SideMemberInfo from '../components/common/SideMemberInfo';
import Author from '../components/author/Author';
import Header from '../components/common/Header';

class AuthorPage extends Component {
    valid = true;
    isHost = false;
    constructor(props) {
        super(props);

        var hostId = props.match.params.author_id
        var visitor = User.getInfo();

        if(visitor !== null && parseInt(visitor.id) === parseInt(hostId))
        {
            this.isHost = true;
        }

        if(this.isHost)
        {
            if(visitor.type !== 1) // 작가 여부 확인
            {
                this.valid = false
                alert("작가 인증이 필요합니다.")
                window.location.href = "/mypage";
            }
        }

        this.state = {
            authorId: hostId,
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
            this.valid &&
            <Fragment>
                <Header author history={this.props.history} isHost={this.isHost}></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo isAuthor={true} authorId={this.props.match.params.author_id} isHost={this.isHost}/>
                    </div>
                    <Author authorId={state.authorId} isHost={this.isHost}/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorPage;
