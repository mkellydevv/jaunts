import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import TrailCard from "./TrailCard";

import "./TrailCardQuad.css";

export default function TrailCardQuad({ trailLimit, tag, completedTrails }) {
    const dispatch = useDispatch();
    const trails = useSelector(state => state["trails"][tag]);
    const trailsArr = trails ? Object.values(trails) : [];
    const [loadedChildren, setLoadedChildren] = useState(0);
    const tmp = new Array(trailLimit).fill(false);
    const [activeChildren, setActiveChildren] = useState(tmp);

    useEffect(() => {
        const query = trailQuery({
            searchTags: [tag],
            limit: trailLimit,
            getPhotos: 1,
        });
        dispatch(getTrails(trailQuery(query), tag));
        return () => dispatch(clearTrails(tag));
    }, [dispatch]);


    useEffect(() => {
        let interval;
        let count = 0;
        let limit = trailLimit;
        if (loadedChildren === 4) {
            interval = setInterval(() => {
                if (count !== limit){
                    setActiveChildren(state => {
                        state[count] = true;
                        return state;
                    });
                    setLoadedChildren(state => state + 1);
                    count++;
                }
                else
                    clearInterval(interval);
            }, 250);
        }
    }, [loadedChildren]);

    return (
        <div
            className="card-quad"
        >
            <h2>Explore {tag[0].toUpperCase() + tag.slice(1)} Trails</h2>
            <div className="card-quad__container">
                {trails && trailsArr.map((trail,i) => {
                    return (
                        <TrailCard
                            trail={trail}
                            tag={tag}
                            active={activeChildren[i]}
                            key={`TrailCard__${tag}-${trail.id}`}
                            completed={completedTrails.has(trail.id) ? true : false}
                            setLoadedChildren={setLoadedChildren}
                        />
                    )
                })}
            </div>
        </div>
    )
}
