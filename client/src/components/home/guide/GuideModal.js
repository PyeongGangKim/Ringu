import React, {useState} from 'react';

import Modal from '../../modal/Modal';
import Guide from './Guide';
import data from './data';

import '../../../scss/main/guide.scss';

function GuideModal({
    
}) {
    const [menu, setMenu] = useState();
    const [alive, setAlive] = useState(true);

    const checkNoGuide = () => {
        localStorage.setItem("guide", 1);
        setAlive(false);
    }

    const close = () => {
        setAlive(false);
    }

    var content;
    if (typeof menu === 'undefined') {
        content = 
        <div className="menu-wrap">
            <button className="menu" onClick={() => setMenu(0)}>글을 쓰시는 분들께</button>
            <button className="menu" onClick={() => setMenu(1)}>글을 읽으시는 분들께</button>
        </div>
    } else if (menu === 0) {
        content = <Guide toMenu={() => setMenu()} data={data['author']} close={() => setAlive(false)}/>
    } else {
        content = <Guide toMenu={() => setMenu()} data={data['reader']} close={() => setAlive(false)}/>
    }

    return (
        alive &&
        <Modal
            overlay={true}
            fixed={true}
        >
            <div id="guide-modal">
                <div className="button-wrap">
                    <button className="button" onClick={checkNoGuide}>다시보지않기</button>
                    <button className="button" onClick={close}>건너뛰기</button>
                </div>
                {content}
            </div>
        </Modal>
    )
}

export default GuideModal;