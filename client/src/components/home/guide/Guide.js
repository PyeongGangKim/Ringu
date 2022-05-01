import React, {useState} from 'react';

import PGBar from './PGBar';

function Guide({
    toMenu,
    data,
    close
}) {
    const [step, setStep] = useState(1);
    
    return (
        <>        
            <div className="guide-wrap">
                <div className="guide">
                    <div className="text-box">
                        <div className="header">
                            {data[step]['header']}
                        </div>
                        <div className="text">
                            {data[step]['text']}
                        </div>
                    </div>

                    <div className="image-box">
                        <img src={data[step]['img']}/>
                    </div>
                </div>
            </div>

            <div className="nav-wrap">
                {
                    step !== 4 ?
                    <>
                        <div className="prev">
                            <button onClick={step > 1 ? () => setStep(step-1) : toMenu}>
                                <em/>
                            </button>
                        </div>

                        <PGBar
                            step={step}
                        />

                        <div className="next">
                            <button onClick={() => setStep(step+1)}>
                                <em/>
                            </button>
                        </div>
                    </>
                    :
                    <div>
                        <button className="btn btn-dark start" onClick={close}>
                            시작하기
                        </button>
                        <span className="back" onClick={toMenu}> 처음으로 돌아가기</span>
                    </div>
                }
            </div>
        </>
    )
}

export default Guide;