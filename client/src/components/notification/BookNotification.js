import React, { Component, Fragment } from 'react';

import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';
import '../../scss/notification/notification.scss';
import NotificationBody from "./NotificationBody";

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