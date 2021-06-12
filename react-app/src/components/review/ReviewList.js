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
            <h2>Review List</h2>
            <div className="review-list__container">
                {reviews && Object.keys(reviews).map(key => {
                    return (
                        <Review review={reviews[key]} open={open} key={`Review-${key}`}/>
                    )
                })}
            </div>
        </div>
    )
}
