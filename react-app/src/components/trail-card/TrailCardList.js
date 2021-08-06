import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import TrailCard from "./TrailCard";

import "./TrailCardList.css";

export default function TrailCardList({ trail, completedTrails }) {
    const dispatch = useDispatch();
    const trails = useSelector(state => state["trails"]["nearby"]);
    if (trails) delete trails[trail.id];
    const trailsArr = trails ? Object.values(trails) : [];

    useEffect(() => {
        const query = trailQuery({
            searchRegion: trail.region,
            limit: 10,
            getPhotos: 1,
        });
        dispatch(getTrails(query, "nearby"));

        return () => dispatch(clearTrails("nearby"));
    }, [dispatch]);

    return (
        <div className="card-list">
            <div className="card-list__container">
                {trails && trailsArr.map(trail => {
                    return (
                        <TrailCard
                            trail={trail}
                            key={`TrailCard__nearby-${trail.id}`}
                            completed={completedTrails.has(trail.id) ? true : false}
                        />
                    )
                })}
            </div>
        </div>
    )
}
