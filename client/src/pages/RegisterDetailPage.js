import React, { Component, Fragment } from 'react';

import RegisterBookSelect from '../components/register/RegisterBookSelect';
import RegisterBook from '../components/register/RegisterBook';


import Header from '../components/common/Header';

class RegisterDetailPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var bookType = "bookType" in this.props.match.params ? parseInt(this.props.match.params.bookType) : null;

        return (
            <Fragment>
                <Header history={this.props.history}></Header>
                <div id="wrap">
                    {
                        <RegisterBook location={this.props.location}/>
                    }
                </div>
            </Fragment>
        )
    }
}

export default RegisterDetailPage;
