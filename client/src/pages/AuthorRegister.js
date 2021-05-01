import React, { Component, Fragment } from 'react';

import Approval from '../components/register/Approval';
import Authentication from '../components/register/Authentication';
import AuthorInfo from '../components/register/AuthorInfo';
import Header from '../components/common/Header';

class AuthorRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: 0,
        }

        this.moveNext = this.moveNext.bind(this)
    }

    moveNext() {
        console.log('move')
        var state = this.state;
        state.display += 1;
        this.setState(state);
    }

    render() {
        const display = this.props.location.pathname == "/auth" ? true : false;
        let state = this.state
        console.log(this.state)

        return (
            <Fragment>
                <Header></Header>
                <div id="wrap">
                    <Approval display={state.display} moveNext={this.moveNext}/>
                    <Authentication display={state.display} moveNext={this.moveNext}/>
                    <AuthorInfo display={state.display} moveNext={this.moveNext}/>
                </div>
            </Fragment>
        )
    }
}

export default AuthorRegister;
