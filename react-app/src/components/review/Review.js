import React, { useState} from "react"
import { useSelector, useDispatch } from "react-redux";

import StarRating from "../random/StarRating";
import { deleteReview } from "../../store/reviews";

import "./Review.css"

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
            <div className="review__user-container">
                <div className="review__user-img">
                    <img src="https://d185jh8djxl1sd.cloudfront.net/assets/placeholder/person_placeholder.png" />
                </div>
                <div>
                    <div>{review.user.username}</div>
                    <div>
                        <span>
                            <StarRating fixed={true} rating={review.rating} />
                        </span>
                        <span>{review.date}</span>
                    </div>
                </div>
            </div>
            <div className="review__blurb">
                {review.blurb}
            </div>
            {user && user.id === review.user_id && <div>
                <button onClick={() => open(review)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>}
        </div>
    )
}
