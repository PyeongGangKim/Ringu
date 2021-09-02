import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import User from '../../utils/user';
import NotificationBody from "./NotificationBody";
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
                    notification: [],
                    selectedList: [],
                    unreadCount : 0,
                },
                withdrawalNotification: {
                    notification: [],
                    selectedList: [],
                    unreadCount : 0,
                },
                normalNotification: {
                    notification: [],
                    selectedList: [],
                    unreadCount : 0,
                }
            }
        }
    }

    async componentDidMount() {
        let state = this.state;
        const book_res = await API.sendGet(URL.api.notification.getBookNotification);
        
        const withdrawawl_res = await API.sendGet(URL.api.notification.getWithdrawalNotification);
        const normal_res = await API.sendGet(URL.api.notification.getNormalNotification);
        if(book_res.status == 200){
            let bookNotificationList = book_res.data.book_notification_list;
            let newBookNotificationCount = book_res.data.unread_count;
            state.data.bookNotification.notification = bookNotificationList
            state.data.bookNotification.unread_count = newBookNotificationCount;
            this.setState(state);
        }
        if(withdrawawl_res.status == 200){
            let withdrawalNotificationList = withdrawawl_res.data.withdrawal_notification_list;
            let newWithdrawalNotificationCount = withdrawawl_res.data.unread_count;
            state.data.withdrawalNotification.notification = withdrawalNotificationList
            state.data.withdrawalNotification.unread_count = newWithdrawalNotificationCount;
            this.setState(state);
        }
        if(normal_res.status == 200){
            let normalNotificationList = normal_res.data.normal_notification_list;
            let newNormalNotificationCount = normal_res.data.unread_count;
            state.data.normalNotification.notification = normalNotificationList
            state.data.normalNotification.unread_count = newNormalNotificationCount;
            this.setState(state);
        }
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
    notiRead(notiList, notiCount){
        
    }
    async handleRead(noti){
        //현재가 어떤 공지가 체크되었는지 보기
        let state =this.state
        let notiList;
        let notiCount;
        if(state.selectedNotification == 1){
            notiList = state.data.bookNotification.notification;
            notiCount = state.data.bookNotification.unreadCount;
        }
        else if(state.selectedNotification == 2){
            notiList = state.data.withdrawalNotification.notification;
            notiCount = state.data.bookNotification.unreadCount;
        }
        else{
            notiList = state.data.normalNotification.notification;
            notiCount = state.data.bookNotification.unreadCount;
        }
        //notiList에서 현재 noti와 동일한거 찾고, is_read 체크해주고 count도 -1, 서버로도 is_read해주기
        notiList.filter(async (val) => {
            if(val.id == noti.id){
                val.is_read = 1;
                notiCount -= 1;
                this.setState(state);
                await API.sendPut(URL.api.notification.putReadNotification+noti.id);
            }
        });
        
    }

    render(){
        const body = () => {
            switch(this.state.selectedNotification){
                case 1: 
                    console.log(this.state.selectedNotification);
                    return <NotificationBody notificationList={this.state.data.bookNotification.notification}/>;
                    break;
                case 2: 
                    console.log(this.state.selectedNotification);
                    return <NotificationBody notificationList={this.state.data.withdrawalNotification.notification}/>;
                    break;
                case 3: 
                    console.log(this.state.selectedNotification);
                    return <NotificationBody notificationList={this.state.data.normalNotification.notification}/>;
                    break;
            }
            
        }
        return(
            <div id="notificationpage">
                <div>
                    <button onClick={() => this.handleSelectedPage(1)}>
                        작품알림
                    </button>
                    <button onClick={() => this.handleSelectedPage(2)}>
                        출금알림
                    </button>
                    <button onClick={() => this.handleSelectedPage(3)}>
                        공지사항
                    </button>
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