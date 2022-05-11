import React, {useState} from 'react';

import { GuideContext } from '../../../contexts/guideContext';
import Modal from '../../modal/Modal';
import Guide from './Guide';
import data from './data';

import '../../../scss/main/guide.scss';

function GuideModal() {    
    const [menu, setMenu] = useState();
    var { guide, closeGuide } = React.useContext(GuideContext);

    var content;
    if (typeof menu === 'undefined') {
        content = 
        <div className="menu-wrap">
            <button className="menu" onClick={() => setMenu(0)}>글을 쓰시는 분들께</button>
            <button className="menu" onClick={() => setMenu(1)}>글을 읽으시는 분들께</button>
        </div>
    } else if (menu === 0) {
        content = <Guide toMenu={() => setMenu()} data={data['author']} close={closeGuide}/>
    } else {
        content = <Guide toMenu={() => setMenu()} data={data['reader']} close={closeGuide}/>
    }
    
    if(guide) {
        return (
            <Modal
                overlay={true}
                fixed={true}
            >
                <div id="guide-modal">
                    <div className="button-wrap">
                        <button className="button" onClick={() => {localStorage.setItem("guide", 1); closeGuide();}}>다시보지않기</button>
                        <button className="button" onClick={closeGuide}>건너뛰기</button>
                    </div>
                    {content}
                </div>
            </Modal>
        )
    } else return null;
}

export default GuideModal;