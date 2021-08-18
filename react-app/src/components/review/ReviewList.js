import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearReviews, getReviews } from "../../store/reviews";
import { reviewQuery } from "../../utils/queryObjects";

import Review from "./Review";
import StarRating from "../random/StarRating";

import "./ReviewList.css";

export default function ReviewList({ trail, open }) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state["reviews"]);
    const { user } = useSelector(state => state["session"]);

    useEffect(() => {
        const query = reviewQuery({
            fromTrailId: trail.id,
            getUser: 1
        });
        dispatch(getReviews(query));
        return () => dispatch(clearReviews());
    }, [dispatch]);

    return (
        <div className="reviewList">

            <div className="reviewList__header">

                <div className="reviewList__header-info">
                    <div className="reviewList__header-rating">
                        {trail.default_rating}
                    </div>
                    <div className="reviewList__header-stars">
                        {trail && <StarRating rating={trail.default_rating} fixed={true} />}
                    </div>
                    <div className="reviewList__header-count">
                        {trail && `\(${trail.default_weighting}\)`} Ratings
                    </div>
                </div>

                <div className="reviewList__header-section-2">
                    {trail && user &&
                    <button
                        className={"jaunts__btn jaunts__btn-1 reviewList__header-btn"}
                        onClick={() => open()}
                    >
                        Write Review
                    </button>}
                </div>

            </div>

            <div className="reviewList__container">
                {reviews && Object.keys(reviews).reverse().map(key => {
                    return (
                        <Review review={reviews[key]} open={open} key={`Review-${key}`}/>
                    )
                })}
            </div>

        </div>
    )
}
