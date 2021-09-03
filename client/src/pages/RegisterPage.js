import React, { Component, Fragment } from 'react';

import RegisterBookSelect from '../components/register/RegisterBookSelect';
import RegisterBook1 from '../components/register/RegisterBook1';
import RegisterBook2 from '../components/register/RegisterBook2';

import Header from '../components/common/Header';

class RegisterPage extends Component {
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
                        !bookType ?
                        <RegisterBookSelect history={this.props.history}/>
                        :
                        (
                            bookType === 2 ?
                            <RegisterBook2/>
                            :
                            <RegisterBook1/>
                        )
                    }
                </div>
            </Fragment>
        )
    }
}

export default RegisterPage;
