import React, { useState, useEffect } from "react";

const Timer = ({ mm, ss, active = false, reset = true }) => {
    const m = mm;
    const s = ss;
    const [timeout, setTimeout] = useState(timeout);
    // 시간초과
    const [min, setMin] = useState(m);
    const [sec, setSec] = useState(s);


    const resetTimer = () => {
        console.log('reset')
        setMin(m);
        setSec(s);

        console.log(reset)
    };

    useEffect(() => {
        resetTimer();
    }, [reset]);

    useEffect(() => {
        let interval = null;
        if (active) {
            interval = setInterval(() => {
                if (sec === 0) {
                    if (min === 0) {
                        // timeout
                        setTimeout(true);
                    } else {
                        setSec(59);
                        setMin(min - 1);
                    }
                } else {
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
