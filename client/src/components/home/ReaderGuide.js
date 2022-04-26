import React, {useState} from 'react';

import PGBar from '../../components/home/PGBar';

function ReaderGuide({
    toMenu,
}) {
    const [step, setStep] = useState(1);
    
    var header;
    var text;
    var img;
    if(step === 1) {
        header = '카테고리 혹은 검색창 선택';
        text = "메인화면에서 관심있는 카테고리를\n선택하거나 직접 검색할 수 있어요!"
        img = require('../../assets/img/author_guide_1.png').default
    } else if(step === 2) {
        header = '원하는 전자책 선택'
        text = '다양한 전자책 중에 읽고싶은 책을\n선택해주세요!'
        img = require('../../assets/img/author_guide_2.png').default
    } else if(step === 3) {
        header = '미리보기 후 구매가능해요!'
        text = '모든 전자책은 무료로\n미리보기가 가능해요!'
        img = require('../../assets/img/author_guide_3.png').default
    } else {
        header = '세상의 모든 이야기가 모여있는 공간!'
        text = ''
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

export default ReaderGuide;