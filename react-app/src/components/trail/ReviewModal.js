import React, { useState, useEffect, useRef } from "react";

import "./ReviewModal.css"

export default function ReviewModal({ trail }) {

    return (
        <>
            <div className="review-modal__name">{trail.name}</div>
            <div>Stars</div>
            <div>

                <input
                    className="review-modal__review"
                    type="textarea"
                    placeholder="Share your thoughts about the trail so others know what to expect."
                />
            </div>
            <div>
                <button className="review-modal__next">Next</button>
            </div>

        </>
    )
}
