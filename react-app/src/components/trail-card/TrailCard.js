import React from "react";

import "./TrailCard.css";

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function TrailCard({ trail }) {

    return (
        <div className="trail-card">
            <div>Trail Card</div>
            <div className="trail-card__content">
                <div className="trail-card__name trail-card__font">{trail.name}</div>
                <div className=".trail-card__font">{trail.region}</div>
                <div className="trail-card__info">
                    <span className={`trail-card__difficulty difficulty-${map[trail.difficulty]}`}>
                        {trail.difficulty}
                    </span>
                    <span className="trail-card__rating">
                        {trail.default_rating}
                    </span>
                    <span className="trail-card__count">
                        {trail.default_weighting}
                    </span>
                </div>
                <div>
                    <span>Length: {trail.distance} mi</span>
                    <span> &#8226; </span>
                    <span>Est. {trail.duration_hours} h {trail.duration_minutes} m</span>
                </div>
            </div>
        </div>
    )
}
