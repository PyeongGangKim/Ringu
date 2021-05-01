import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';

import '../../scss/common/common.scss'
import '../../scss/common/header.scss';
import '../../scss/common/input.scss';

import helper_url from '../../helper/helper_url';
import Api from '../../utils/apiutils';
import User from '../../utils/user';

class Header extends Component {

    componentDidMount() {

    }

    constructor(props) {
        super(props);
        let userInfo = User.getInfo();

        if (!!userInfo) {
            this.state = {
                login : 'Y',
                id : userInfo.id,
                type : userInfo.type,
                display: false
            }
        } else {
            this.state = {
                login: 'N',
                id: '',
                type : '',
                display: false
            }
        }
    }

    handleDisplay = (evt) =>{
        var state = this.state;
        state.display = !state.display;
        this.setState(state);
    }

    logOut = () => {
        const q_logout =  window.confirm("로그아웃 하시겠습니까?");
        console.log(q_logout);
        if( q_logout === true ) {
            this.setState({
                login : 'N'
            })
            Cookies.remove('token');
            Cookies.remove('token', { path: '/'});
            Cookies.remove('token', { path: '/detail' });

            window.location = "/home";
        } else {
            return false;
        }
    };

    render() {
        const displayClass = this.state.display ? "display" : "";

        return (
            <header>
                <div id="header" className={this.props.visible && "bottom-line"}>
                    <h1 id="logo">
                        <Link to="/home">
                            <img src="logo.png" width="220px" height="70px"/>
                        </Link>
                    </h1>
                    <div id="search-area">
                        {
                            !this.props.visible &&
                            <div className="search">
                                <input type="text" maxLength="15" autoComplete="off"/>
                                <button type="submit"> 검색 </button>
                            </div>
                        }
                    </div>

                    <div id="user-area">
                        {
                            this.state.login == 'Y'
                            ?
                            <div id="user-page">
                                <Link to="" id="author-page">
                                    <img src="/author.png"/>
                                    <span>작가 공간</span>
                                </Link>

                                <div id="user-nb" onClick={this.handleDisplay}>
                                    {
                                        this.state.display ?
                                        <div id="nb-box">
                                            <img src="/mypage-active.png" alt="마이페이지"/>
                                        </div>
                                        :
                                        <div id="nb-box">
                                            <img src="/mypage.png" alt="마이페이지"/>
                                        </div>
                                    }


                                    <span>마이페이지</span>
                                    <ul className={"nb-menu " + displayClass}>
                                        <li><Link to={helper_url.service.mypage.info}>계정관리</Link></li>
                                        <li><Link to={helper_url.service.mypage.carts}>장바구니</Link></li>
                                        <li><Link to={helper_url.service.mypage.fav_book}>찜한목록</Link></li>
                                        <li><Link to={helper_url.service.mypage.purchases}>구매내역</Link></li>
                                        <li><button onClick={this.logOut}>로그아웃</button></li>
                                    </ul>
                                </div>
                            </div>
                            :
                            <div id="accounts">
                                <Link to={helper_url.service.accounts.login}>
                                    로그인
                                </Link>
                                <Link to={helper_url.service.accounts.signup}>
                                    <div className="btn btn-rounded btn-color-2">회원가입</div>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
