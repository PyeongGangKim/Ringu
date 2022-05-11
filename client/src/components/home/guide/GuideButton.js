import React from 'react';

import { GuideContext } from '../../../contexts/guideContext';

import '../../../scss/main/guide.scss'

function GuideButton() {
    var { openGuide } = React.useContext(GuideContext);

    return (
        <div className="guide-btn" onClick={openGuide}>
            <span>?</span>
        </div>
    )
}

export default GuideButton;