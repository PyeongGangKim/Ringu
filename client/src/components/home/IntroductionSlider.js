import React from 'react';
import Slider from "react-slick";

import IntroductionSliderItem from './IntroductionSliderItem'

import URL from '../../helper/helper_url';

const settings = {
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

function IntroductionSlider({
    user
}) {
    const handleRegisterClick = () => {
        if(user === null) {
            if(window.confirm("로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) {
                window.location.href = URL.service.accounts.login
            }
    
            return;
        }
    
        if(user.type === 1) {
            alert("이미 작가로 등록하였습니다.")            
            return;
        }
    
        window.location.href = URL.service.register.author;
    }
    return (
        <div id="home-introduction">
            <Slider {...settings}>
                <IntroductionSliderItem
                    order = {1}
                    text = {"전자책만 따라해도 나도 고수!\n지금 바로 당신의 책을 만들어드립니다"}
                    handleRegisterClick = {handleRegisterClick}
                />
                <IntroductionSliderItem
                    order = {2}
                    text = {"당신이 찾는 모든 것들의 공간"}
                    handleRegisterClick = {handleRegisterClick}
                />
            </Slider>
        </div>
    )
}

export default IntroductionSlider;