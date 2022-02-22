import React, { Component, Fragment } from 'react';

import NormalNotification from "./NormalNotification";
import BookNotification from "./BookNotification";
import WithdrawalNotification from "./WithdrawalNotification";
import '../../scss/mypage/cart.scss';
import '../../scss/common/tab.scss';
import '../../scss/common/page.scss';
import '../../scss/notification/notification.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';



class Notification extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            tab: "book",
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
        const book_res = await API.sendGet(URL.api.notification.getNewNotiCount, {type: "1"});
        const withdrawawl_res = await API.sendGet(URL.api.notification.getNewNotiCount, {type: "2"});
        const normal_res = await API.sendGet(URL.api.notification.getNewNotiCount, {type: "3"});
        
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
    }
    handleSelectedPage(pageNum, selectedtab){
        let state = this.state;
        state.selectedNotification = pageNum;
        state.tab = selectedtab
        this.setState({
            state
        });
    }
  
    handleRead(){
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
        const state = this.state;
        const body = () => {
            switch(this.state.selectedNotification){
                case 1: 
                    return <BookNotification handleRead = {this.handleRead.bind(this)}/>;
                case 2: 
                    return <WithdrawalNotification handleRead = {this.handleRead.bind(this)}/>;
                case 3:
                    return <NormalNotification handleRead = {this.handleRead.bind(this)}/>;
            }
            
        }
        return(
            <div id="notification" className = "main">
                <div className="tab-nav">
                    <ul >
                        <div className = "merge">
                            <button className={"tab-btn " + (state.tab === "book" ? "active" : "")} onClick={() => this.handleSelectedPage(1,"book")} >작품알림</button>
                            {
                                (this.state.data.bookNotification.unread_count != 0) &&  <span className = "span-new-noti">{this.state.data.bookNotification.unread_count}</span>
                            }
                        </div>
                        <div className = "merge">
                            <button className={"tab-btn " + (state.tab === "withdrawal" ? "active" : "")} onClick={() => this.handleSelectedPage(2,"withdrawal")} >출금알림</button>
                            {
                                (this.state.data.withdrawalNotification.unread_count != 0) &&  <span className = "span-new-noti">{this.state.data.withdrawalNotification.unread_count}</span>
                            }
                        </div>
                        <div className = "merge">
                            <button className={"tab-btn " + (state.tab === "normal" ? "active" : "")} onClick={() => this.handleSelectedPage(3,"normal")}>공지사항</button>
                            {
                                (this.state.data.normalNotification.unread_count != 0) &&  <span className = "span-new-noti">{this.state.data.normalNotification.unread_count}</span>
                            }
                        </div>
                    </ul>
                    
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