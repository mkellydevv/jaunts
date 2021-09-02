import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import TrailCard from "./TrailCard";

import "./TrailCardList.css";

export default function TrailCardList({ trail=null, completedTrails }) {
    const trails = useSelector(state => state["trails"]["trailHeads"]);

    const populateTrailCards = () => {
        const trailsArr = Object.values(trails);
        const jsxArr = [];

        for (const currTrail of trailsArr) {
            const jsx = <TrailCard
                trail={currTrail}
                key={`TrailCard__${currTrail.id}`}
                completed={completedTrails.has(currTrail.id) ? true : false}
                active={trail && trail.id === currTrail.id ? true : false}
            />;

            if (trail && trail.id === currTrail.id)
                jsxArr.unshift(jsx);
            else
                jsxArr.push(jsx);
        }

        return jsxArr;
    }

    return (
        <div className="cardList">
            <div className="cardList__container">
                {trails && populateTrailCards()}
            </div>
        </div>
    )
}
