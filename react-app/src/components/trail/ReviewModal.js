import React, { useState, useEffect, useRef } from "react";

import StarRating from "../random/StarRating";

import "./ReviewModal.css"

export default function ReviewModal({ trail }) {
    const [rating, setRating] = useState(3);

    return (
        <>
            <div className="review-modal__name">{trail.name}</div>
            <div>
                <StarRating fixed={false} setRating={setRating} rating={rating}/>
            </div>
            <div>
                <input
                    className="review-modal__review"
                    type="textarea"
                    placeholder="Share your thoughts about the trail so others know what to expect."
                />
            </div>
            <div>
                <span>Date</span>
                <input
                    type="date"
                    placeholder="Start Date"
                />
            </div>
            <div>
                <button className="review-modal__submit">Submit</button>
            </div>
        </>
    )
}
