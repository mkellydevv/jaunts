import React, { useState, useEffect, useRef } from "react";

import "./Modal.css"

export default function Modal(props) {

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={props.close} />
            <div className="modal__content">
                <div className="modal__close-btn">
                    <button onClick={props.close}>X</button>
                </div>
                {props.children}
            </div>
        </div>
    )
}
