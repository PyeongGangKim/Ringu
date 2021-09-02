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
            }
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.notificationList !== prevProps.notificationList){
            let state = this.state;
            state.data.notificationList = this.props.notificationList;
            console.log(state);
            this.setState({
                state
            });
        }
    }



    render(){
        let notificationList = this.state.data.notificationList;
        //console.log(this.props.notificationList);
        return(
            <div id="notificationpage">
                <div>
                    <ul>
                        {
                            notificationList.map(item => {
                                return(
                                    <li key = {item.id}>
                                        {item.title}
                                        <Moment format="MM월 DD일 HH:MM">{item.date}</Moment>
                                    </li>
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