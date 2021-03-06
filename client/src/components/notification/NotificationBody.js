import React, { Component, Fragment } from 'react';

import Moment from 'react-moment';


import '../../scss/common/button.scss';
import '../../scss/notification/notification.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';


class NotificationBody extends Component {
    constructor(props){
        super(props)

        this.state = {
            totalCount: 0,
            type : 1,
            curPage : 1,
            countPerPage: 10,
            spanNotiList: -1,
            curPageCount : 10,
            data: {
                allCheck : false,
                notificationList : [],
                selectedNotiList : [],
            },
            prevButton : "<",
            nextButton : ">",
        }

    }
    async getData(state){
        const noti_res = await API.sendGet(URL.api.notification.getNotification, {type: state.type, offset: (state.curPage - 1) * state.countPerPage,});
        const noti_count = await API.sendGet(URL.api.notification.getAllNotiCount, {type: state.type});
        if(noti_res.status === 200 && noti_count.status === 200){
            state.data.notificationList = noti_res.data.notification_list;
            state.data.selectedNotiList = Array(state.data.notificationList.length).fill(false);
            state.totalCount = noti_count.data.all_count;
            state.curPageCount = state.data.notificationList.length;
            this.setState(state);
        }
    }
    async componentDidMount(){
        let state = this.state;
        state.type = this.props.type;
        await this.getData(state);

    }

     handlePrevPageChange = async () => {
        let state = this.state;
        if(state.curPage !== 1){
            state.curPage--;
            await this.getData(state);
        }
    }
    handleNextPageChange = async () => {
        // 만약 setPage + 1
        let state = this.state;
        if(state.curPage * state.countPerPage < state.totalCount){
            state.curPage++;
            await this.getData(state);
        }
    }
    handleAllCheckBox = () => {

        let state = this.state;
        if(!state.data.allCheck){
            state.data.allCheck = true;
            for(let i = 0 ; i < state.curPageCount ; i++){
                state.data.selectedNotiList[i] = true;
            }
        }
        else{
            state.data.allCheck = false;
            for(let i = 0 ; i < state.curPageCount ; i++){
                state.data.selectedNotiList[i] = false;
            }
        }
        this.setState(state);

    }

    handleCheckBox = (idx) => {
        let state = this.state;
        state.data.selectedNotiList[idx] = !state.data.selectedNotiList[idx];
        this.setState(state);
    }

    parentFunction(){
        this.props.handleRead();
    }

    handleSpanList = async (itemId,idx) => {
        let state = this.state;

        if(state.spanNotiList === itemId) {
            state.spanNotiList = -1;
            this.setState({
                state
            });
        }
        else{
            state.spanNotiList = itemId;
            if(state.data.notificationList[idx].is_read === 0){
                state.data.notificationList[idx].is_read = 1;
                this.parentFunction();
            }

            this.setState({
                state
            });

            //params로 read 한거 보내기
            const res = await API.sendPut(URL.api.notification.putReadNotification + state.data.notificationList[idx].id);
            if(res.status === 200){
                console.log("OK");
            }
            else{
                console.log("error");
            }
        }
    }
     handleDeleteButton = async () => {
        let state = this.state
        let params = {
            notificationIds : [],
        }
        for(let i = 0 ; i < state.data.selectedNotiList.length ; i++){
            if(state.data.selectedNotiList[i]){
                params.notificationIds.push(state.data.notificationList[i].id);
                if(state.data.notificationList[i].is_read === 0){
                    this.parentFunction();
                }
            }
        }
        const res = await API.sendPost(URL.api.notification.deleteNotification, params);
        if(res.status === 200){
            state.data.allCheck = false;
            await this.getData(state);
        }

    }




    render(){
        let notificationList = this.state.data.notificationList;
        let totalCount = this.state.totalCount;
        let spanNoti = this.state.spanNotiList;
        let startItem = (this.state.curPage - 1) * this.state.countPerPage + 1;
        let endItem = (this.state.curPage * this.state.countPerPage > this.state.totalCount) ? this.state.totalCount : this.state.curPage * this.state.countPerPage
        return(
            <div>
                <div className = "top-buttons">
                    <label className = "select-all-label" for = "select-all">
                        <input id = "select-all" type="checkbox" onClick={() => this.handleAllCheckBox()} checked = {this.state.data.allCheck}/>
                        <span className= "word">전체선택</span>
                    </label>
                    <div className= "erase">
                        <label className = "select-erase" for = "select-erase">
                            <button id = "select-erase" className= "trash-button" onClick = {() => this.handleDeleteButton() }>
                                <img src="/trashcan.png" padding-right= "15px" width="17px" height="22px" />
                            </button>
                            <span className= "erase-span" >삭제</span>
                        </label>
                    </div>
                </div>
                <hr className = "main-line"/>
                <div>
                {
                    notificationList.slice(0,totalCount).map((item,idx) => {
                        return(
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <div className={ "accordion-header " + (item.id === spanNoti ? "" : "collapsed")} id={item.id}>
                                    <input type="checkbox" onClick={() => this.handleCheckBox(idx)} checked = {this.state.data.selectedNotiList[idx]}/>
                                    <button className={"accordion-button " } type="button" onClick = {() => this.handleSpanList(item.id,idx)}>
                                        <div className="title-outside">
                                            {
                                            (item.is_read === 0)  && <span className="span-new"> New </span>
                                            }

                                            <div className = {"title-noti " + (item.is_read === 0 ? "new" : "")}>{item.title}</div>
                                        </div>
                                        <Moment className = "date" format="MM월 DD일 HH:MM">{item.date}</Moment>
                                    </button>
                                    </div>
                                    {
                                        (item.id === spanNoti) &&
                                        <div className = "body-div">
                                            {item.content}
                                        </div>
                                    }
                                    {
                                        (item.id === spanNoti) &&
                                        <hr size = "5"/>
                                    }
                                    {
                                        (item.id !== spanNoti) &&
                                        <hr className = "hr-not-span"/>
                                    }
                                </div>
                                   
                            </div>
                        );
                    })
                }
                </div>
                <div className= "bottom-navigator">
                    <span className = "bottom-count">{this.state.totalCount}개 중 {startItem}-{endItem} </span>
                    <button onClick = {this.handlePrevPageChange}>
                        <img src="/prev_arrow.png" width="27px" height="32px" />
                     </button>
                    <button onClick = {this.handleNextPageChange}>
                        <img className = "next-arrow" src="/next_arrow.png" width="27px" height="32px" />
                    </button>
                </div>
            </div>
        );




    }
}

export default NotificationBody;
