import React, { Component, Fragment } from 'react';

import SideMemberInfo from '../components/common/SideMemberInfo';
import Author from '../components/author/Author';
import Header from '../components/common/Header';

class AuthorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hash: this.props.location.hash
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
                <Header></Header>
                <div id="wrap" style={{display:"flex"}}>
                    <div className="side">
                        <SideMemberInfo author={true}/>
                    </div>
                    <Author hash={state.hash}/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorPage;
