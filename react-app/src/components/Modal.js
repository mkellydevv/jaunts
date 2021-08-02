import React, { useState, useEffect, useRef } from "react";

import "./Modal.css"

export default function Modal(props) {

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={props.close} />
            <div className="modal__content">
                <button
                    className="modal__close-btn jaunts__btn-2"
                    onClick={props.close}
                >
                    <i className="fas fa-times"></i>
                </button>

                {props.children}
            </div>
        </div>
    )
}
