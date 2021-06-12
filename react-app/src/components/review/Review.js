import React from 'react'
import StarRating from '../random/StarRating'

import "./Review.css"

export default function Review({ review }) {

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
            <div>Edit | Delete</div>
        </div>
    )
}
