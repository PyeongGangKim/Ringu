import React from 'react';

import '../../../scss/main/guide.scss'

function GuideButton(toggle) {
    console.log(toggle)
    return (
        <div className="guide-btn" onClick={toggle}>
            <span>?</span>
        </div>
    )
}

export default GuideButton;