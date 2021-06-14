import React from "react";
import { useHistory } from "react-router-dom";

import StarRating from "../random/StarRating";

import "./TrailCard.css";

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function TrailCard({ trail }) {
    const history = useHistory();

    return (
        <div className="trail-card" onClick={() => {
            history.push(`/trails/${trail.id}`);
        }}>
            <div className="trail-card__img-container">
                <img className="trail-card__img" src={trail.photos[0].url.replace("extra_", "")} />
            </div>
            <div className="trail-card__content">
                <div className="trail-card__name trail-card__font">{trail.name}</div>
                <div className=".trail-card__font">{trail.region}</div>
                <div className="trail-card__info">
                    <span className={`trail-card__difficulty difficulty-${map[trail.difficulty]}`}>
                        {trail.difficulty}
                    </span>
                    <span className="trail-card__rating">
                        <StarRating rating={trail.default_rating} fixed={true} />
                    </span>
                    <span className="trail-card__count">
                        {`(${trail.default_weighting})`}
                    </span>
                </div>
                <div>
                    <span>Length: {trail.length} mi</span>
                    <span> &#8226; </span>
                    <span>Est. {trail.duration_hours} h {trail.duration_minutes} m</span>
                </div>
            </div>
        </div>
    )
}
