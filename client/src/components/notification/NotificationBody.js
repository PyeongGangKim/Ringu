import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import User from '../../utils/user';
import '../../scss/mypage/cart.scss';
import '../../scss/common/button.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';


class NotificationBody extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            data: {
                notificationList : [],
                selectedNotiList : [],
                spanNotiList: -1,
            }
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.notificationList !== prevProps.notificationList){
            let state = this.state;
            state.data.notificationList = this.props.notificationList;
            console.log(state.data.notificationList);
            this.setState({
                state
            });
        }
    }

    handleSpanList(itemId){
        let state = this.state;
        if(state.data.spanNotiList == itemId) {
            state.data.spanNotiList = -1;
            this.setState({
                state
            });
        }
        else{
            state.data.spanNotiList = itemId;
            this.setState({
                state
            });
        }
        console.log(state);
    }



    render(){
        let notificationList = this.state.data.notificationList;
        const spanContent = (item) => {
            if(this.state.spanNotiList == item.id){
                console.log(item);
                return <span>{item.content}</span>
            }
        }
        return(
            <div id="notificationpage">
                <div>
                    <ul>
                        {
                            notificationList.map(item => {
                                return(
                                    <div>
                                        <li key = {item.id}>
                                            <button onClick = {()=> this.handleSpanList(item.id)}> {item.title} </button>
                                            <Moment format="MM월 DD일 HH:MM">{item.date}</Moment>
                                        </li>
                                       <div>
                                           {
                                               spanContent(item)
                                           }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>

        );
        
    }
}

export default NotificationBody;