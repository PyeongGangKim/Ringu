import React, { Component, Fragment } from 'react';

import NotificationBody from "./NotificationBody";
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';
import '../../scss/notification/notification.scss';

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