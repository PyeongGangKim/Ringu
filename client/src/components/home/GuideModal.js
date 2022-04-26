import React, {useState} from 'react';

import Modal from '../../components/modal/Modal';
import AuthorGuide from '../../components/home/AuthorGuide';
import ReaderGuide from '../../components/home/ReaderGuide';

import '../../scss/main/guide.scss';

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
            <button className="menu" onClick={() => setMenu(0)}>작가님들에게</button>
            <button className="menu fill" onClick={() => setMenu(1)}>책을 보시는 분들께</button>
        </div>
    } else if (menu === 0) {
        content = <AuthorGuide toMenu={() => setMenu()}/>
    } else {
        content = <ReaderGuide toMenu={() => setMenu()}/>
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