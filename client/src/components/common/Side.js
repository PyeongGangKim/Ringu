import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import SideMemberInfo from './SideMemberInfo';
import SideNav from './SideNav';

class Side extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="side">
                <SideMemberInfo
                    isAuthor={this.props.isAuthor}
                    isHost={this.props.isHost}
                    authorId={this.props.authorId}
                    nickname={this.props.nickname}
                />
                <SideNav 
                    display1={this.props.display1}
                    display2={this.props.display2}
                    path={this.props.path}
                />
            </div>
        )
    }
}

export default Side;
