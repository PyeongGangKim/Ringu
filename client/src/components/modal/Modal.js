import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';

import Portal from './Portal'

import '../../scss/common/modal.scss';

function Modal({
    onClose,
    maskClosable,
    overlay,
    children,
    pos,
    fixed,
}) {

    useEffect(() => {
        if(fixed) {
            document.body.style.overflow = 'hidden';
            return ()=> document.body.style.overflow = 'auto';
        }
    }, []);

    const onMaskClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(e)
        }
    }

    const close = (e) => {
        if (onClose) {
            onClose(e)
        }
    }

    return (
        <Portal elementId="modal-root">
            {
                overlay && <div className="modal-overlay"/>
            }

            <div className={"modal-wrapper " + (fixed === true ? "fixed" : "absolute")}
                tabIndex={-1}
                style={typeof pos !== 'undefined' ? {top: `${pos['y']}px`, left: `${pos['x']}px`, transform: `${Object.keys(pos).length !== 0 && "none" }`} : null}
            >
                <div className="modal-inner" tabIndex={0}
                    onClick={maskClosable ? onMaskClick : null}
                >
                    {children}
                </div>
            </div>
        </Portal>
    )

}

Modal.defaultProps = {
    overlay: false,
    maskClosable: false,
}

export default Modal;
