import React from 'react';

function IntroductionSliderItem({
    order,
    text,
    handleRegisterClick
}) {
    return (
        <div className={"slider-wrap main" + order}>
            <img src={require(`../../assets/img/main${order}.png`).default}/>
            <div className="introduction">
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
            </div>
        </div>
    )
}

export default IntroductionSliderItem;