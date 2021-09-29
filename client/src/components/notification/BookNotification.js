import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import User from '../../utils/user';
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';
import '../../scss/notification/notification.scss';
import NotificationBody from "./NotificationBody";
import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';


class BookNotification extends Component {
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
            <NotificationBody type = "1" handleRead = {this.handleRead.bind(this)}/>
        );
        
    }
}

export default BookNotification;