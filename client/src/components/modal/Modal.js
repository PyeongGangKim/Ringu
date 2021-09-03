import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import Portal from './Portal'

import '../../scss/common/modal.scss';

function Modal({
    onClose,
    maskClosable,
    overlay,
    children,
    pos,
}) {

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

            <div className="modal-wrapper"
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
/*class Modal extends Component {
    constructor(props) {
        super(props)
        this.onClose = this.props.onClose
        this.maskClosable = this.props.maskClosable
        this.overlay = this.props.overlay
        this.children = this.props.children
        this.pos = this.props.pos

        this.state = {
            pos: "pos" in this.props && typeof this.props.pos !== 'undefined' ? this.props.pos : {},
        }
    }

    componentDidUpdate() {

    }

    onMaskClick = (e) => {
        if (e.target === e.currentTarget) {
            this.onClose(e)
        }
    }

    close = (e) => {
        if (this.onClose) {
            this.onClose(e)
        }
    }

    render() {
        console.log(this.children)
        return (
            <Portal elementId="modal-root">
                {
                    this.overlay && <div className="modal-overlay"/>
                }

                <div className="modal-wrapper"
                    tabIndex={-1}
                    style={{top: `${this.state.pos['y']}px`, left: `${this.state.pos['x']}px`, transform: `${Object.keys(this.state.pos).length !== 0 && "none" }`}}
                >
                    <div className="modal-inner" tabIndex={0}
                        onClick={this.maskClosable ? this.onMaskClick : null}
                    >
                        {this.children}
                    </div>
                </div>
            </Portal>
        )
    }
}*/

Modal.defaultProps = {
    overlay: false,
    maskClosable: true,
}

export default Modal;
