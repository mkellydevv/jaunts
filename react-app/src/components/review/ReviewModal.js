import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import StarRating from "../random/StarRating";
import { createReview, editReview } from "../../store/reviews";
import { reviewQuery } from "../../utils/queryObjects";

import "./ReviewModal.css"

export default function ReviewModal({ trail, review, close }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const [rating, setRating] = useState(review ? review.rating : 0);
    const [blurb, setBlurb] = useState(review ? review.blurb : "");
    const [date, setDate] = useState(review ? new Date(review.date).toISOString().split('T')[0] : "");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        const payload = { rating, blurb, date };

        const query = reviewQuery({ getUser: true });
        let data;
        if (review) {
            data = await dispatch(editReview(review.id, query, payload));
        }
        else {
            payload["trail_id"] = trail.id;
            payload["user_id"] = user.id;
            data = await dispatch(createReview(query, payload));
        }

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
        else
            close();
    }

    return (
        <>
            <div className="review-modal__name">
                {trail.name}
            </div>

            <div>
                <StarRating fixed={false} setRating={setRating} rating={rating}/>
            </div>

            <div>
                <textarea
                    className="review-modal__blurb"
                    cols={40}
                    rows={10}
                    placeholder="Share your thoughts about the trail so others know what to expect."
                    value={blurb}
                    onChange={e => setBlurb(e.target.value)}
                />
            </div>

            <div>
                <span>Date</span>
                <input
                    type="date"
                    placeholder="Start Date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
            </div>

            <div className="review-modal__submit">
                <button
                    className="jaunts__btn jaunts__btn-1"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    )
}
