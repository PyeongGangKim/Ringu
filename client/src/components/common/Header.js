import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';

import '../../scss/common/common.scss'
import '../../scss/common/header.scss';
import '../../scss/common/input.scss';

import URL from '../../helper/helper_url';
import parse from '../../helper/parse';
import Api from '../../utils/apiutils';
import User from '../../utils/user';

class Header extends Component {
    userInfo = User.getInfo();

    constructor(props) {
        super(props);

        var userInfo = this.userInfo;

        if (props.mypage && !userInfo) {
            alert("로그인이 필요합니다.")
            window.location.href = "/home"
        }

        var search = props.search ? parse.searchToDict(props.search) : {}
        var searchParams = new URLSearchParams(props.search)

        var params = {
            display: false,
            keyword: (searchParams.has('keyword')) ? searchParams.get('keyword') : "",
        }

        if (!!userInfo) {
            this.state = {
                ...params,
                login : 'Y',
                id : userInfo.id,
                type: userInfo.type,
            }
        } else {
            this.state = {
                ...params,
                login: 'N',
                id: '',
            }
        }
    }

    componentDidMount() {

    }

    handleKeywordChange = (evt) => {var state = this.state; state.keyword = evt.target.value; this.setState(state);}
    handleDisplay = (evt) =>{var state = this.state;state.display = !state.display;this.setState(state);}
    handleSearchClick = () => {
        if(!this.state.keyword) {
            alert("검색어를 입력해주세요.")
            return;
        }

        window.location = URL.service.search + '?' + encodeURIComponent('keyword') + '=' + encodeURIComponent(this.state.keyword)
    }

    logOut = () => {
        const q_logout =  window.confirm("로그아웃 하시겠습니까?");
        if( q_logout === true ) {
            this.setState({
                login : 'N'
            })
            Cookies.remove('RINGU_JWT');
            Cookies.remove('RINGU_JWT', { path: '/'});
            Cookies.remove('RINGU_JWT', { path: '/detail' });

            window.location = "/home";
        } else {
            return false;
        }
    };

    render() {
        var state = this.state;
        const displayClass = state.display ? "display" : "";

        return (
            <header>
                <div id="header" className={this.props.searchVisible ? "bottom-line" : ""}>
                    <h1 id="logo">
                        <Link to="/home">
                            <img src="logo.png" width="220px" height="70px"/>
                        </Link>
                    </h1>
                    <div id="search-area">
                        {
                            this.props.searchVisible !== false &&
                            <div className="search">
                                <input type="text" maxLength="15" autoComplete="off" value={state.keyword} onChange={this.handleKeywordChange}/>
                                <button type="submit" onClick={this.handleSearchClick}> 검색 </button>
                            </div>
                        }
                    </div>

                    <div id="user-area">
                        {
                            state.login == 'Y'
                            ?
                            <div id="user-page">
                                <Link to={URL.service.notification} id="notification-page">
                                    <img src="/notification.png" />
                                    <span>알림</span>
                                </Link>
                                {
                                    state.type === 1 ?
                                    <Link to={URL.service.author + this.state.id} id="author-page">
                                        {
                                            this.props.author === true ?
                                            <img src="/author_clicked.png"/>
                                            :
                                            <img src="/author.png"/>
                                        }

                                        <span>작가 공간</span>
                                    </Link>
                                    :
                                    <Link to={URL.service.register.author} id="author-page">
                                        {
                                            this.props.author === true ?
                                            <img src="/author_clicked.png"/>
                                            :
                                            <img src="/author.png"/>
                                        }

                                        <span>작가 등록</span>
                                    </Link>
                                }


                                <div id="user-nb" onClick={this.handleDisplay}>
                                    {
                                        this.state.display || this.props.mypage ?
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
                                        <li><Link to={URL.service.mypage.info}>계정관리</Link></li>
                                        <li><Link to={URL.service.mypage.carts}>장바구니</Link></li>
                                        <li><Link to={URL.service.mypage.fav_book}>찜한목록</Link></li>
                                        <li><Link to={URL.service.mypage.purchases}>구매내역</Link></li>
                                        <li><button onClick={this.logOut}>로그아웃</button></li>
                                    </ul>
                                </div>
                            </div>
                            :
                            <div id="accounts">
                                <Link to={URL.service.accounts.login} className="btn-login">
                                    로그인
                                </Link>
                                <Link to={URL.service.accounts.signup} className="btn-signup">
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
