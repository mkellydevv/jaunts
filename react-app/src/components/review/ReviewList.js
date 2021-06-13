import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearReviews, getReviewsByTrailId } from "../../store/reviews";
import { reviewQuery } from "../../utils/queryObjects";
import Review from "./Review";

import "./ReviewList.css";

export default function ReviewList({ trail, open }) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state["reviews"]);

    useEffect(() => {
        const query = reviewQuery({
            fromTrailId: trail.id,
            getUser: true
        });
        dispatch(getReviewsByTrailId(query));

        return () => {
            dispatch(clearReviews());
        }
    }, [dispatch]);

    return (
        <div className="review-list">
            <div>
                <span className="review-list__rating">
                    {trail && trail.default_rating}
                </span>
                <span className="review-list__count">
                    {trail && `\(${trail.default_weighting}\)`}
                </span>
                <span>
                    {trail && <button onClick={() => open()}>
                        Write Review
                    </button>}
                </span>
            </div>
            <div className="review-list__container">
                {reviews && Object.keys(reviews).reverse().map(key => {
                    return (
                        <Review review={reviews[key]} open={open} key={`Review-${key}`}/>
                    )
                })}
            </div>
        </div>
    )
}
