import React, { useState} from "react"
import { useSelector, useDispatch } from "react-redux";

import { deleteReview } from "../../store/reviews";
import { getDateString } from "../../utils/helperFuncs";

import StarRating from "../random/StarRating";

import "./Review.css";

export default function Review({ review, open }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const [errors, setErrors] = useState("");

    const handleDelete = async (e) => {
        const data = await dispatch(deleteReview(review.id));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    return (
        <div className="review">

            <div className="review__container">

                <div className="review__user">

                    <div className="review__user-avatar">
                        <img
                            className="review__user-img"
                            src="https://d185jh8djxl1sd.cloudfront.net/assets/placeholder/person_placeholder.png"
                        />
                    </div>

                    <div className="review__user-info">
                        <div>
                            {review.user.username}
                        </div>
                        <div>
                            <span>
                                <StarRating fixed={true} rating={review.rating} />
                            </span>
                            <span>
                                {getDateString(review.date)}
                            </span>
                        </div>
                    </div>

                </div>

                {user && user.id === review.user_id &&
                <div className="review__btns">
                    <button
                        className="jaunts__btn jaunts__btn-1"
                        onClick={() => open(review)}
                    >
                        Edit
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-3"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>}

            </div>

            <div className="review__blurb">
                {review.blurb}
            </div>

        </div>
    )
}
