import React, { useState, useEffect } from "react";

const Timer = ({ mm, ss, timeout, reset = false, active = false, setTimeout}) => {
    const m = mm;
    const s = ss;

    // 시간초과
    const [min, setMin] = useState(m);
    const [sec, setSec] = useState(s);
    var interval = null;


    const resetTimer = () => {
        setMin(m);
        setSec(s);
    };

    useEffect(() => {
        resetTimer();
    }, [reset]);

    useEffect(() => {
        if (active) {
            interval = setInterval(() => {
                console.log(1)
                if (sec === 0) {
                    if (min === 0) {
                        clearInterval(interval)
                    }
                    else {
                        setSec(59);
                        setMin(min - 1);
                    }
                }
                else if (sec === 1 && min === 0) {
                    setSec(sec - 1);
                    setTimeout(true);
                    clearInterval(interval)
                }
                else {
                    setSec(sec - 1);
                }
            }, 1000);
        } else if (!active) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [active, sec]);



    return (
        <span className="timer">
            {`${min} : ${sec < 10 ? `0`+sec:sec}`}
        </span>
        );
};

export default(Timer);
