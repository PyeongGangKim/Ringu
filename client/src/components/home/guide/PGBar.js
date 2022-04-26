import React, {useEffect} from 'react';

function PGBar({
    step
}) {
    return (
        <div className="pgbar">
            <ul>
                <li className={step > 0 ? step === 1 ? "last" : "active" : ""}></li>
                <li className={step > 1 ? step === 2 ? "last" : "active" : ""}></li>
                <li className={step > 2 ? step === 3 ? "last" : "active" : ""}></li>
                <li></li>
            </ul>
        </div>
    )
}

export default PGBar;