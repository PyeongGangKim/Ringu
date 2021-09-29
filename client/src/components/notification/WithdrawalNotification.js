import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import NotificationBody from "./NotificationBody";
import User from '../../utils/user';
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';
import '../../scss/notification/notification.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';


class WithdrawalNotification extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            type: 1, 
        }
        
    }
    handleRead(){
        this.props.handleRead();
    }
   



    render(){
        return (
            <NotificationBody type = "2" handleRead = {this.handleRead.bind(this)}/>
        );
        
    }
}

export default WithdrawalNotification;