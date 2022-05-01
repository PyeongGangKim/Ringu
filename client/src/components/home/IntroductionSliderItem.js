import React from 'react';

function IntroductionSliderItem({
    order,
    text,
    background,
    handleRegisterClick
}) {
    return (
        <div className="slider-wrap">
            <div className="introduction">
                <div className="content" style={background}>
                    <span className="intro-text">
                        {text}
                    </span>
                    <button 
                        className="btn-outline-1 btn regi-button"
                        onClick={handleRegisterClick}
                    >
                        <span>작가등록하기</span>
                        <div style={{"flex":"1"}}></div>
                        <em/>
                    </button>
                    <img src={require(`../../assets/img/${order}.png`).default}/>
                </div>
            </div>
        </div>
    )
}

export default IntroductionSliderItem;