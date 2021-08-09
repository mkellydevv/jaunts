import React from 'react';
import { useHistory } from "react-router-dom";

import "./SearchBarResult.css";

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function SearchBar({ trail }) {
    const history = useHistory();

    const navigateToTrail = () => {
        history.push(`/trails/${trail.id}`);
    }

    return (
        <div
            className="search-bar-result"
            onClick={navigateToTrail}
        >

            <div className="search-bar-result__icon">
                <i className="fas fa-tree" />
            </div>

            <div className="search-bar-result__info">
                <div className="search-bar-result__name">
                    {trail.name}
                </div>
                <div className="search-bar-result__region">
                    {trail.region}
                </div>
            </div>

            <div className="search-bar-result__description">
                <div className={`trail-card__difficulty difficulty-${map[trail.difficulty]}`}>
                    {trail.difficulty}
                </div>
                <div>
                    Length: {trail.length} mi
                </div>
                <div>
                    E. Gain: {trail.elevation_gain} ft
                </div>
            </div>

        </div>
    )
}
