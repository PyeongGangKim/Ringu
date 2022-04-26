import React, {useState} from 'react';

import PGBar from '../../components/home/PGBar';

function AuthorGuide({
    toMenu,
}) {
    const [step, setStep] = useState(1);
    
    var header;
    var text;
    var img;
    if(step === 1) {
        header = '작가등록';
        text = "배너 또는 왼쪽상단 작가등록 버튼을\n클릭하여 작가로서 등록해주세요!"
        img = require('../../assets/img/author_guide_1.png').default
    } else if(step === 2) {
        header = '심플한 양식 제공!'
        text = '링구에서 제공하는 양식을 사용하여 자신만의 책을 만들어보세요!'
        img = require('../../assets/img/author_guide_2.png').default
    } else if(step === 3) {
        header = '업로드'
        text = '가격을 정하여 업로드 버튼을 눌러주면 업로드 완료!'
        img = require('../../assets/img/author_guide_3.png').default
    } else {
        header = '당신의 이야기가 세상에 알려지는 순간!'
        text = '링구를 통해 당신의 이야기를\n더 많은 사람들에게 들려주세요.'
        img = require('../../assets/img/author_guide_4.png').default
    }

    return (
        <>        
            <div className="guide-wrap">
                <div className="guide">
                    <div className="text-box">
                        <div className="header">
                            {header}
                        </div>
                        <div className="text">
                            {text}
                        </div>
                    </div>

                    <div className="image-box">
                        <img src={img}/>
                    </div>
                </div>

                {
                    step === 4 ?
                    <>
                        <button className="btn btn-dark start">
                            시작하기
                        </button>
                        <span className="back" onClick={toMenu}> 처음으로 돌아가기</span>
                    </>
                    :
                    <PGBar
                        step={step}
                    />
                }
            </div>

            <div className="nav-wrap">
                {
                    step !== 4 &&
                    <>
                        <div className="prev">
                            <button onClick={step > 1 ? () => setStep(step-1) : toMenu}>
                                <em/>
                                <span>이전</span>
                            </button>
                        </div>

                        <div className="next">
                            <button onClick={() => setStep(step+1)}>
                                <span>다음</span>
                                <em/>
                            </button>
                        </div>
                    </>

                }
                
            </div>
        </>
    )
}

export default AuthorGuide;