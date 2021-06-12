import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import StarRating from "../random/StarRating";
import { createJaunt } from "../../store/jaunts";

import "./ReviewModal.css"

export default function ReviewModal({ trail, close }) {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [date, setDate] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        const jaunt = {
            trail_id: trail.id,
            list_id: 1,
            completed: true,
            review: "bungus",
            rating,
            start_date:date
        }
        const data = await dispatch(createJaunt(jaunt));
        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
        else
            close();
    }

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
                    onChange={e => setDate(e.target.value)}
                />
            </div>
            <div>
                <button
                    className="review-modal__submit"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    )
}
