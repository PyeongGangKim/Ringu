import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Slider from "react-slick";

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/slick.scss'

import Book from '../../components/book/Book'

import User from '../../utils/user';
import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Main extends Component {
    user = User.getInfo();
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            keyword: "",
            bookList: [],
            latestBookList: [],
            recommend: null,
            searchClear: false,
        };
    }

    async componentDidMount() {
        let state = this.state;
        let params = {
            member_id: User.getInfo() ? User.getInfo().id : null,
            is_picked: 1,
        }
        let latestBookParams = {
            member_id: User.getInfo() ? User.getInfo().id : null,
            is_approved: 1,
        }

        try {
            const res = await API.sendGet(URL.api.book.list, params);
            const latestRes = await API.sendGet(URL.api.book.list, latestBookParams);

            if(res.status === 200) state.bookList = res.data.bookList;
            if(latestRes.status === 200)state.latestBookList = latestRes.data.bookList;
            if(res.status === 200 || latestRes.status === 200) this.setState(state);

        } catch(e) {
            console.error(e)
        }

        try {
            const res = await API.sendGet(URL.api.book.recommend)
            if(res.status === 200) {
                state.recommend = res.data.recommend;
                this.setState(state);
            }
        } catch(e) {
            console.error(e)
        }
    }

    handleKeywordChange = (evt) => {
        var state = this.state; 
        state.keyword = evt.target.value;
        
        this.setState(state);
    }

    handleSearchClick = () => {
        var state = this.state;
        if(!state.searchClear) {
            this.props.history.push(URL.service.search + "?keyword=" + state.recommend.recommending_phrase)
            return;
        }

        if(!state.keyword) {
            alert("검색어를 입력해주세요.")
            return;
        }

        this.props.history.push(URL.service.search + "?keyword=" + state.keyword)
    }

    handleSearchClear = () => {
        var state = this.state;
        if(state.searchClear === false) {
            state.searchClear = true;
            this.setState(state)
        }
    }

    handleRegisterClick = () => {
        var state = this.state;

        if(this.user === null) {
            alert("로그인이 필요합니다.")
            window.location.href = URL.service.accounts.login
            return;
        }

        if(this.user.type === 1) {
            alert("이미 작가로 등록하였습니다.")            
            return;
        }

        window.location.href = URL.service.register.author;
    }

    next = (slider) => {
        slider.slickNext();
    }

    previous = (slider) => {
        slider.slickPrev();
    }

    render() {
        /*const StyledSlider = styled(Slider)`
            .slick-list, .slick-track, .slick-slide div {
                height: 100%;
            }
            .slick-dots {
                bottom: 20px;
            }
        `;*/

        const StyledBookSlider = styled(Slider)`
            .slick-list {
                margin-right: -15px;
                padding-left: 1px;
            }
            .slick-track {
                margin-top: 20px;
                margin-bottom: 10px;
            }
        `;

        var state = this.state;
        const settings = {
            arrows: false,
            dots: false,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 1,
            swipe: false,
        };

        const settingsMain = {
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipe: false,
            autoplay: true,            
            speed: 500,
            autoplaySpeed: 10000,
            cssEase: "linear"
        };

        return (
            <div id="wrap">
                <div id="home-header">
                    <Slider {...settingsMain}>
                        <div className="home-header-content main2">
                            <div className="search-area">
                                <strong>당신의 이야기가 세상에 알려지는 순간!</strong>
                                <p>전자책만 따라해도 나도 고수!<br/>
                                지금 바로 당신의 책을 만들어줍니다.</p>
                                <form onSubmit={this.handleSearchClick}>
                                    <div className="search">
                                        <input type="text" style={state.searchClear === false ? {color:"#888888"} : {}} autoComplete="off" value={state.searchClear === false && !!state.recommend ? state.recommend.recommending_phrase : state.keyword} onChange={this.handleKeywordChange} onMouseDown={this.handleSearchClear}/>
                                        <button type="submit">
                                            검색
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div onClick={this.handleRegisterClick} className="btn-wrapper">
                                <button className="btn btn-rounded register btn-color-1"> 작가등록하기
                                </button>
                            </div>
                        </div>
                        <div className="home-header-content main1">
                            <div className="search-area">
                                <strong>당신이 찾는 모든 것들의 공간</strong>
                                <p>당신이 찾는 모든 것들의 공간</p>
                                <form onSubmit={this.handleSearchClick}>
                                    <div className="search">
                                        <input type="text" style={state.searchClear === false ? {color:"#888888"} : {}} autoComplete="off" value={state.searchClear === false && !!state.recommend ? state.recommend.recommending_phrase : state.keyword} onChange={this.handleKeywordChange} onMouseDown={this.handleSearchClear}/>
                                        <button type="submit">
                                            검색
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Slider>
                </div>


                <div id="home" className="page1">
                    <div className="title-wrap">
                        <h2> NEW </h2>
                        {
                            state.latestBookList.length > 5 &&
                            <div className="slick--arrow">
                                <div className="slick-arrow-wrapper">
                                    <a className="slick-arrow arrow-left" onClick={() => this.previous(this.newSlider)}>
                                        <em/>
                                    </a>
                                    <a className="slick-arrow arrow-right" onClick={() => this.next(this.newSlider)}>
                                        <em/>
                                    </a>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="book-area slick-slider-wrapper">
                        <StyledBookSlider ref={c => (this.newSlider = c)} {...settings} infinite={state.latestBookList.length > 5 ? true: false}>
                            {
                                state.latestBookList.map(item => {
                                    var status = '';
                                    if(item.type === 2) {
                                        status  = 'pub'
                                    } else {
                                        status  = 'ser'
                                    }
                                    return (
                                        <Book
                                            key={item.id}
                                            book={item}
                                            status={status}
                                            favorite
                                        />
                                    )
                                })
                            }
                        </StyledBookSlider>
                    </div>

                    <div className="title-wrap">
                        <h2> MD{`'`}s Pick </h2>
                        {
                            state.bookList.length > 5 &&
                            <div className="slick--arrow">
                                <div className="slick-arrow-wrapper">
                                    <a className="slick-arrow arrow-left" onClick={() => this.previous(this.recSlider)}>
                                        <em/>
                                    </a>
                                    <a className="slick-arrow arrow-right" onClick={() => this.next(this.recSlider)}>
                                        <em/>
                                    </a>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="book-area slick-slider-wrapper">
                        <StyledBookSlider ref={c => (this.recSlider = c)} {...settings} infinite={state.bookList.length > 5 ? true: false}>
                            {
                                state.bookList.map(item => {
                                    var status = '';
                                    if(item.type === 2) {
                                        status  = 'pub'
                                    } else {
                                        status  = 'ser'
                                    }
                                    return (
                                        <div>
                                            <Book
                                                key={item.id}
                                                book={item}
                                                status={status}
                                                favorite
                                            />
                                        </div>
                                    )
                                })
                            }
                        </StyledBookSlider>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
