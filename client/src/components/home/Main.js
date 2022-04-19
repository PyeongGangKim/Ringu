import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";

import '../../scss/common/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/slick.scss'

import BookSlider from '../../components/home/BookSlider'

import User from '../../utils/user';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Main extends Component {
    user = User.getInfo();
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            keyword: "",
            recommendBookList: [],
            latestBookList: [],
            categories: [],
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
            const res = await API.sendGet(URL.api.category.list)
            if(res.status === 200) {
                state.categories = res.data.categoryList;
                this.setState(state);
            }
        } catch(e) {
            console.error(e)
        }

        try {
            const res = await API.sendGet(URL.api.book.list, params);
            const latestRes = await API.sendGet(URL.api.book.list, latestBookParams);

            if(res.status === 200) state.recommendBookList = res.data.bookList;
            if(latestRes.status === 200) state.latestBookList = latestRes.data.bookList;
            if(res.status === 200 || latestRes.status === 200) this.setState(state);

        } catch(e) {
            console.error(e)
        }
    }

    handleKeywordChange = (evt) => {
        var state = this.state; 
        state.keyword = evt.target.value;
        
        this.setState(state);
    }

    handleRegisterClick = () => {
        var state = this.state;

        if(this.user === null) {
            if(window.confirm("로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) {
                window.location.href = URL.service.accounts.login
            }

            return;
        }

        if(this.user.type === 1) {
            alert("이미 작가로 등록하였습니다.")            
            return;
        }

        window.location.href = URL.service.register.author;
    }

    render() {
        var state = this.state;

        const settingsMain = {
            arrows: false,
            dots: true,
            dotsClass: "slick-dots-wide",
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipe: false,
            autoplay: true,          
            speed: 500,
            autoplaySpeed: 10000,
            cssEase: "linear",
            customPaging: function(i) {
                return (
                    <button>{i}</button>
                );
            },
        };

        return (
            <div id="wrap">
                <div id="home-header">
                    <Slider {...settingsMain}>
                        <div className="slider-wrap main1">
                            <img src={require("../../assets/img/main.png").default}/>
                            <div className="introduction">
                                <span className="intro-text">
                                    {"전자책만 따라해도 나도 고수!\n지금 바로 당신의 책을 만들어드립니다"}
                                </span>
                                <button 
                                    className="btn-outline-1 btn regi-button"
                                    onClick={this.handleRegisterClick}
                                >
                                    <span>작가등록하기</span>
                                    <div style={{"flex":"1"}}></div>
                                    <em></em>
                                </button>
                            </div>
                        </div>
                        <div className="slider-wrap main2">
                            <img src={require("../../assets/img/main2.png").default}/>
                            <div className="introduction">
                            <span className="intro-text">
                                    {"당신이 찾는 모든 것들의 공간"}
                                </span>
                                <button 
                                    className="btn-outline-1 btn regi-button"
                                    onClick={this.handleRegisterClick}
                                >
                                    <span>작가등록하기</span>
                                    <div style={{"flex":"1"}}></div>
                                    <em></em>
                                </button>
                            </div>
                        </div>
                    </Slider>
                </div>
                

                <div id="home" className="page1">
                    <div className="category-wrap">
                        {
                            state.categories.map((category, idx) => {
                                return(
                                    <Link to={URL.service.search + `?category=${category.id}`}>
                                        <div class="category" tabIndex={idx} onMouseOver={this.handle}>
                                            <div class="category-box">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className="icon">
                                                                    <img src={require("../../assets/img/" + category.img).default}/>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span>
                                                                    {category.name}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                            </div>
                                        </div>
                                    </Link>

                                    
                                )
                            })
                        }
                    </div>
                    {
                        state.latestBookList.length > 0 &&
                        <BookSlider
                            title = {"NEW"}
                            bookList = {state.latestBookList}
                        />
                    }

                    {
                        state.recommendBookList.length > 0 &&
                        <BookSlider
                            title = {"MD's Pick"}
                            bookList = {state.recommendBookList}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Main;
