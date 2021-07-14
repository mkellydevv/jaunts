import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import TrailCard from "./TrailCard";

import "./TrailCardQuad.css";

export default function TrailCardQuad({ tag }) {
    const dispatch = useDispatch();
    const trails = useSelector(state => state["trails"][tag]);

    useEffect(() => {
        const query = trailQuery({
            searchTags: [tag],
            limit: 4,
            getPhotos: 1,
        });
        dispatch(getTrails(trailQuery(query), tag));
        return () => dispatch(clearTrails(tag));
    }, [dispatch]);

    return (
        <div className="card-quad">
            <h2>Explore {tag[0].toUpperCase() + tag.slice(1)} Trails</h2>
            <div className="card-quad__container">
                {trails && Object.keys(trails).map(key => {
                    return (
                        <TrailCard trail={trails[key]} key={`TrailCard__${tag}-${key}`}/>
                    )
                })}
            </div>
        </div>
    )
}
