import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import StarRating from "../random/StarRating";

import "./TrailCard.css";

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function TrailCard({ trail, completed=false }) {
    const history = useHistory();


    const navigateToTrail = () => {
        history.push(`/trails/${trail.id}`);
        console.log(`history`, history)
    }

    return (
        <div
            className="trail-card"
            onClick={navigateToTrail}
        >

            {completed &&
            <div className="trail-completed">
                <i className="fas fa-check" />Completed
            </div>}

            <div className="trail-card__img-container">
                <img className="trail-card__img" src={Object.values(trail.photos)[0].url.replace("extra_", "")} />
            </div>

            <div className="trail-card__content">

                <div className="trail-card__name ">
                    {trail.name}
                </div>

                <div className=".trail-card__region">
                    {trail.region}
                </div>

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

                <div className="trail-card__length">
                    <span>Length: {trail.length} mi</span>
                    <span> &#8226; </span>
                    <span>Est. {trail.duration_hours} h {trail.duration_minutes} m</span>
                </div>

            </div>

        </div>
    )
}
