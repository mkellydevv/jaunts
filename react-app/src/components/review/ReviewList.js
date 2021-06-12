import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Review from "./Review";

import "./ReviewList.css";

export default function ReviewList({ trail }) {
    const dispatch = useDispatch();
    const reviews = useSelector(state => state["jaunts"]);

    // useEffect(() => {
    //     const query = trailQuery({
    //         searchTerm: trail.region,
    //         searchCategories: ["region"],
    //         limit: 10,
    //         getPhotos: true,
    //     });
    //     dispatch(getTrails(query, "nearby"));

    //     return () => {
    //         dispatch(clearTrails("nearby"))
    //     }
    // }, [dispatch]);

    return (
        <div className="review-list">
            <h2>Review List</h2>
            <div className="review-list__container">
                {reviews && Object.keys(reviews).map(key => {
                    return (
                        <Review review={reviews[key]} key={`Review-${key}`}/>
                    )
                })}
            </div>
        </div>
    )
}
