import React, { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import StarRating from "../random/StarRating";

import "./TrailCard.css";

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function TrailCard({ trail, completed=false, active=false }) {
    const history = useHistory();
    const [loaded, setLoaded] = useState(false);

    const handleTransitionEnd = () => {
        const el = document.getElementById(`TrailCard__${trail.id}`);
        el.classList.remove("animating");
    }

    const navigateToTrail = () => {
        history.push({
            pathname: `/trails/${trail.id}`,
            options: {}
        });
    }

    return (
        <div
            id={`TrailCard__${trail.id}`}
            className={`trailCard ${loaded ? "loaded": ""} ${active ? "active": ""}`}
            onClick={navigateToTrail}
            onLoad={() => setLoaded(true)}
            onTransitionEnd={handleTransitionEnd}
        >

            {completed &&
            <div className="trail-completed">
                <i className="fas fa-check" />Completed
            </div>}

            <div className="trailCard__img-container">
                <img className="trailCard__img" src={Object.values(trail.photos)[0].url.replace("extra_", "")} />
            </div>

            <div className="trailCard__content">

                <div className="trailCard__name ">
                    {trail.name}
                </div>

                <div className=".trailCard__region">
                    {trail.region}
                </div>

                <div className="trailCard__info">
                    <span className={`trailCard__difficulty difficulty-${map[trail.difficulty]}`}>
                        {trail.difficulty}
                    </span>
                    <span className="trailCard__rating">
                        <StarRating rating={trail.default_rating} fixed={true} />
                    </span>
                    <span className="trailCard__count">
                        {`(${trail.default_weighting})`}
                    </span>
                </div>

                <div className="trailCard__length">
                    <span>Length: {trail.length} mi</span>
                    <span> &#8226; </span>
                    <span>Est. {trail.duration_hours} h {trail.duration_minutes} m</span>
                </div>

            </div>

        </div>
    )
}
