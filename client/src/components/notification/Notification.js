import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import User from '../../utils/user';
import NormalNotification from "./NormalNotification";
import BookNotification from "./BookNotification";
import WithdrawalNotification from "./WithdrawalNotification";
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';


class Notification extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            selectedNotification : 1, // 1: 작품, 2: 출금, 3: 공지사항
            data: {
                bookNotification: {
                    unread_count : 0,
                },
                withdrawalNotification: {
                    unread_count : 0,
                },
                normalNotification: {
                    unread_count : 0,
                }
            }
        }
    }

    async componentDidMount() {
        let state = this.state;
        const book_res = await API.sendGet(URL.api.notification.getBookNewNotiCount);
        const withdrawawl_res = await API.sendGet(URL.api.notification.getWithdrawalNewNotiCount);
        const normal_res = await API.sendGet(URL.api.notification.getNormalNewNotiCount);
        
        if(book_res.status == 200){
            let newBookNotificationCount = book_res.data.unread_count;
            state.data.bookNotification.unread_count = newBookNotificationCount;
            this.setState(state);
        }
        if(withdrawawl_res.status == 200){
            let newWithdrawalNotificationCount = withdrawawl_res.data.unread_count;
            state.data.withdrawalNotification.unread_count = newWithdrawalNotificationCount;
            this.setState(state);
        }
        if(normal_res.status == 200){
            let newNormalNotificationCount = normal_res.data.unread_count;
            state.data.normalNotification.unread_count = newNormalNotificationCount;
            this.setState(state);
        }
        console.log(state);
    }
    handleSelectedPage(pageNum){
        let state = this.state;
        state.selectedNotification = pageNum;
        this.setState({
            selectedNotification : pageNum,
            ...this.state.data
        });
        //console.log(this.state);

    }
  
    handleRead(){
        console.log("hehe");
        let state = this.state;
        switch(state.selectedNotification){
            case 1: 
                state.data.bookNotification.unread_count--;
                break;
            case 2: 
                state.data.withdrawalNotification.unread_count--;
                break;
            case 3: 
                state.data.normalNotification.unread_count--;
                break;
        }
        this.setState(state);
    }

    render(){
        const body = () => {
            switch(this.state.selectedNotification){
                case 1: 
                    return <BookNotification />;
                case 2: 
                    return <WithdrawalNotification />;
                case 3: 
                    return <NormalNotification />;
            }
            
        }
        return(
            <div id="notificationpage">
                <div>
                    <button onClick={() => this.handleSelectedPage(1)} decreaseUnReadCnt = {this.handleRead.bind(this)}>작품알림</button>
                    {
                        (this.state.data.bookNotification.unread_count != 0) &&  <span>{this.state.data.bookNotification.unread_count}</span>
                    }
                    <button onClick={() => this.handleSelectedPage(2)} decreaseUnReadCnt = {this.handleRead.bind(this)}>출금알림</button>
                    {
                        (this.state.data.withdrawalNotification.unread_count != 0) &&  <span>{this.state.data.withdrawalNotification.unread_count}</span>
                    }
                    <button onClick={() => this.handleSelectedPage(3)} decreaseUnReadCnt = {this.handleRead.bind(this)}>공지사항</button>
                    {
                        (this.state.data.normalNotification.unread_count != 0) &&  <span>{this.state.data.normalNotification.unread_count}</span>
                    }
                </div>
                <div>
                   {
                       body()
                   }
                </div>
            </div>

        );
        
    }
}

export default Notification;