import React from 'react';
import { useHistory } from "react-router-dom";

import "./SearchResult.css";

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function SearchResult({ trail, tiny }) {
    const history = useHistory();

    const navigateToTrail = () => {
        history.push({
            pathname: `/trails/${trail.id}`,
            options: {}
        });
    }

    return (
        <div
            className={`searchResult ${tiny ? "tiny" : ""}`}
            onClick={navigateToTrail}
        >

            <div className="searchResult__icon">
                <i className="fas fa-tree" />
            </div>

            <div className="searchResult__info">
                <div className="searchResult__name">
                    <div className="searchResult__name-inner">
                        {trail.name}
                    </div>
                </div>
                <div className="searchResult__region">
                    {trail.region}
                </div>
            </div>

            {!tiny &&
            <div className={`searchResult__description`}>
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
            }

        </div>
    )
}
