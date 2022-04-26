import React, {useEffect} from 'react';

function PGBar({
    step
}) {
    return (
        <div className="pgbar">
            <ul>
                <li className={step > 0 ? "active" : ""}></li>
                <li className={step > 1 ? "active" : ""}></li>
                <li className={step > 2 ? "active" : ""}></li>
                <li></li>
            </ul>
        </div>
    )
}

export default PGBar;