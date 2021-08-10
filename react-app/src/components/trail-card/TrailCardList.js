import React, { useEffect, useState } from "react";
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
    const [childrenCount, setChildrenCount] = useState(trailsArr.length);
    const tmp = new Array(childrenCount).fill(false);
    const [activeChildren, setActiveChildren] = useState(tmp);
    const [loadedChildren, setLoadedChildren] = useState(0);

    useEffect(() => {
        const query = trailQuery({
            searchRegion: trail.region,
            limit: 10,
            getPhotos: 1,
        });
        dispatch(getTrails(query, "nearby"));

        return () => dispatch(clearTrails("nearby"));
    }, [dispatch]);

    useEffect(() => {
        if (!trails) return;
        setChildrenCount(trailsArr.length);
    }, [trails]);

    useEffect(() => {
        let interval;
        let count = 0;
        let limit = childrenCount;
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
        <div className="card-list">
            <div className="card-list__container">
                {trails && trailsArr.map((trail, i) => {
                    return (
                        <TrailCard
                            trail={trail}
                            tag={"nearby"}
                            active={activeChildren[i]}
                            key={`TrailCard__nearby-${trail.id}`}
                            completed={completedTrails.has(trail.id) ? true : false}
                            setLoadedChildren={setLoadedChildren}
                        />
                    )
                })}
            </div>
        </div>
    )
}
