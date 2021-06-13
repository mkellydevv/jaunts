import React, { useState} from "react"
import { useSelector, useDispatch } from "react-redux";

import StarRating from "../random/StarRating";
import { removeReview } from "../../store/reviews";

import "./Review.css"

export default function Review({ review, open }) {
    const { user } = useSelector(state => state.session);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState("");

    const handleDelete = async (e) => {
        const data = await dispatch(removeReview(review.id));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    return (
        <div className="review">
            <div className="review__user-container">
                <div>Img</div>
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
            <div>
                {review.blurb}
            </div>
            {user && user.id === review.user_id && <div>
                <button onClick={() => open(review)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>}
        </div>
    )
}
