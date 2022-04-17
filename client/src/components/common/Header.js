import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';

import '../../scss/common/common.scss'
import '../../scss/common/header.scss';
import '../../scss/common/input.scss';

import Chip from '../../components/common/Chip'

import URL from '../../helper/helper_url';
import User from '../../utils/user';
import API from '../../utils/apiutils';

class Header extends Component {
    userInfo = User.getInfo();

    constructor(props) {
        super(props);

        var userInfo = this.userInfo;

        this.search = props.search

        if (props.mypage && !userInfo) {
            alert("로그인이 필요합니다.")
            window.location.href = URL.service.home
        }

        var params = {
            display: false,
            keyword: (!!this.search && this.search.has('keyword')) ? this.search.get('keyword') : "",
            isCategorySearch: !!this.search && !this.search.has('keyword') && this.search.has('category') ? true : false,
        }

        if (!!userInfo) {
            this.state = {
                ...params,
                login : 'Y',
                id : userInfo.id,
                type: userInfo.type,
                categories: [],
                popup: false,
            }
        } else {
            this.state = {
                ...params,
                login: 'N',
                id: '',
                categories: [],
                popup: false,
            }
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            const res = await API.sendGet(URL.api.category.list)
            if(res.status === 200) {
                state.categories = res.data.categoryList;
                this.setState(state);
            }
        } catch(e) {
            console.error(e)
        }
    }

    handleKeywordChange = (evt) => {var state = this.state; state.keyword = evt.target.value; this.setState(state);}
    handleKeyPress = (evt) => {
        if(evt.key === 'Enter') {
            this.handleSearch()
        }
    }
    handleDisplay = (evt) =>{var state = this.state;state.display = !state.display;this.setState(state);}
    handleSearchClick = () => {
        if(!!this.state.isCategorySearch) {
            return;
        }
        this.handleSearch()
    }

    handleSearch = () => {
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

            window.location = URL.service.home;
        } else {
            return false;
        }
    };

    toggleSearchPopup = (e, value) => {
        if(value === false && !e.currentTarget.contains(e.relatedTarget) || value === true)
            this.setState({popup: value})
    }

    removeChip = () => {
        this.setState({isCategorySearch: false});
    }

    render() {
        var state = this.state;
        const displayClass = state.display ? "display" : "";

        return (
            <header>
                <div id="header-wrap" className={this.props.searchVisible ? "bottom-line" : ""}>
                    <h1 id="logo">
                        <Link to={URL.service.home}>
                            <img src="/logo.png" width="220px" height="70px"/>
                        </Link>
                    </h1>
                    <div style={{"flexGrow":1}}></div>
                    {
                        this.props.searchVisible !== false &&
                        <div id="search-area" tabIndex={0} onFocus={(e) => this.toggleSearchPopup(e, true)} onBlur={(e) => this.toggleSearchPopup(e, false)}>
                            <div className="search">
                                {
                                    state.isCategorySearch && state.categories.length > 0
                                    ?
                                    <Chip label={state.categories.filter(x => x.id === parseInt(this.search.get('category')))[0].name} onRemove={this.removeChip}/>
                                    :
                                    <input type="text" autoComplete="off" value={state.keyword} onChange={this.handleKeywordChange} onKeyPress={this.handleKeyPress}/>
                                }
                                
                                <button type="submit" onClick={this.handleSearchClick}> 검색 </button>
                            </div>
                            {
                                state.popup &&
                                <div className="search-popup" tabindex={0}>
                                    {/*<hr/>*/}
                                    <div className="category-wrap">
                                        <span>카테고리</span>
                                        <div className="category-list">
                                            {
                                                state.categories.map(category => {
                                                    return (
                                                        <a href={URL.service.search + "?category=" + category.id}>
                                                            <span className="category">
                                                                {category.name}
                                                            </span>
                                                        </a>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }                    

                    <div id="user-area">
                        {
                            state.login == 'Y'
                            ?
                            <div id="user-menu">
                                <Link 
                                    id="notification-page" 
                                    className="menu-item"
                                    to={URL.service.notification} 
                                >
                                    <img src="/notification.png" />
                                    <span>알림</span>
                                </Link>
                                {
                                    state.type === 1 ?
                                    <Link 
                                        id="author-page" 
                                        className={!!this.props.isHost ? "menu-item active" : "menu-item"}
                                        to={URL.service.author + this.state.id} 
                                        onClick={() => {window.location.href=URL.service.author + this.state.id}}
                                    >
                                        {
                                            !!this.props.isHost === true ?
                                            <img src="/author_clicked.png"/>
                                            :
                                            <img src="/author.png"/>
                                        }

                                        <span>작가 공간</span>
                                    </Link>
                                    :
                                    <Link 
                                        id="author-page" 
                                        className={!!this.props.author ? "menu-item active" : "menu-item"}
                                        to={URL.service.register.author} 
                                    >
                                        {
                                            !!this.props.author === true ?
                                            <img src="/author_clicked.png"/>
                                            :
                                            <img src="/author.png"/>
                                        }

                                        <span>작가 등록</span>
                                    </Link>
                                }


                                <div id="user-nb" 
                                    className={!!this.state.display || !!this.props.mypage ? "menu-item active" : "menu-item" }
                                    onClick={this.handleDisplay}
                                >
                                    {
                                        !!this.state.display || !!this.props.mypage ?
                                        <div className="box">
                                            <img src="/mypage-active.png" alt="마이페이지"/>
                                        </div>
                                        :
                                        <div className="box">
                                            <img src="/mypage.png" alt="마이페이지"/>
                                        </div>
                                    }


                                    <span>마이페이지</span>
                                    <ul className={"nb-menu " + displayClass}>
                                        <li className="nb-item"><Link to={URL.service.mypage.info}>계정관리</Link></li>
                                        <li className="nb-item"><Link to={URL.service.mypage.carts}>장바구니</Link></li>
                                        <li className="nb-item"><Link to={URL.service.mypage.fav_book}>찜한목록</Link></li>
                                        <li className="nb-item"><Link to={URL.service.mypage.purchases}>구매내역</Link></li>
                                        <li className="nb-item"><div onClick={this.logOut}>로그아웃</div></li>
                                    </ul>
                                </div>
                            </div>
                            :
                            <div id="account-menu">
                                <Link to={URL.service.accounts.login} id="login">
                                    <span className="">로그인</span>
                                </Link>
                                
                                <Link to={URL.service.accounts.signup} id="register">
                                    <button className="btn btn-rounded btn-color-2">회원가입</button>
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
