import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import User from '../../utils/user';
import '../../scss/common/sideinfo.scss';

import URL from '../../helper/helper_url';

class SideNav extends Component {    
    constructor(props) {
        super(props)

        var path = this.props.location.pathname

        this.state = {
            display1: (path === '/mypage/leave' || 
                    path === '/mypage/info' || 
                    path === '/mypage/notification/update' || 
                    path === '/mypage/password/update'),
            display2: (path === '/mypage/favorite/author' || 
                    path === '/mypage/favorite/book')
        }
    }

    handleDisplay1 = () =>{
        var state = this.state;
        state.display1 = !state.display1;
        this.setState(state);
    }

    handleDisplay2 = () =>{
        var state = this.state;
        state.display2 = !state.display2;
        this.setState(state);
    }

    render() {
        const path = this.props.location.pathname;
        const display1Class = this.state.display1 ? "display" : "";
        const display2Class = this.state.display2 ? "display" : "";

        return (
            <div className="lnb">
                <ul className="menu">
                    <li className="dropdown">
                        <div className={"lnb-item" + (path === "/mypage/info" || 
                                                    path === "/mypage/password/update" || 
                                                    path === "/mypage/leave" ? " on" : "")} onClick={this.handleDisplay1}>
                            <div id="account-icon" className="lnb-icon"/>
                                계정관리
                        </div>
                        <ul className={display1Class}>
                            <li className={path === "/mypage/info" ? "on" : ""}><Link to={URL.service.mypage.info}>나의 정보</Link></li>
                            {/*<li className={path === "/mypage/notification/update" ? "on" : ""}><Link to={URL.service.mypage.notification_change}>알림 설정 변경</Link></li>*/}
                            <li className={path === "/mypage/password/update" ? "on" : ""}><Link to={URL.service.mypage.password_change}>비밀번호 변경</Link></li>
                            <li className={path === "/mypage/leave" ? "on" : ""}><Link to={URL.service.mypage.leave}>회원 탈퇴</Link></li>
                        </ul>
                    </li>

                    <li>
                        <Link to={URL.service.mypage.purchase}  className={"lnb-item" + (path.includes("purchase") ? " on" : "")}>
                            <div id="purchase-icon" className="lnb-icon"/>
                                구매내역
                        </Link>
                    </li>

                    <li>
                        <Link to={URL.service.mypage.cart} className={"lnb-item" + (path === "/mypage/cart" ? " on" : "")}>
                            <div id="cart-icon" className="lnb-icon"/>
                                장바구니
                        </Link>
                    </li>

                    <li className="dropdown">
                        <div className={"lnb-item" + (path === "/mypage/favorite/book" || path === "/mypage/favorite/author" ? " on" : "")} onClick={this.handleDisplay2}>
                            <div id="favorite-icon" className="lnb-icon"/>
                                찜한목록
                        </div>

                        <ul className={display2Class}>
                            <li className={path === "/mypage/favorite/book" ? "on" : ""}><Link to={URL.service.mypage.fav_book}>컨텐츠 찜</Link></li>
                            <li className={path === "/mypage/favorite/author" ? "on" : ""}><Link to={URL.service.mypage.fav_author}>찜한 작가</Link></li>
                        </ul>
                    </li>
                </ul>

            </div>
        )
    }
}

export default withRouter(SideNav);
