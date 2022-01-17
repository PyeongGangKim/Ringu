import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom'

class Portal extends Component {
    constructor(props) {
        super(props)        
        this.element = document.getElementById(this.props.elementId);
    }

    render() {
        return createPortal(
            this.props.children,
            this.element
        );
    }
}

export default Portal;
