import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";
import TrailCard from "./TrailCard";

import "./TrailCardQuad.css";

export default function TrailCardQuad({ tag }) {
    const dispatch = useDispatch();
    const trails = useSelector(state => state["trails"][tag]);

    useEffect(() => {
        dispatch((getTrails(trailQuery({searchTags: [tag], limit: 4, getPhotos: true}), tag)));
    }, [dispatch]);

    return (
        <div className="quad">
            <h2>{tag} Quad</h2>
            <div className="quad__card-container">
                {trails && Object.keys(trails).map(key => {
                    return (
                        <TrailCard trail={trails[key]} key={`TrailCard__${tag}-${key}`}/>
                    )
                })}
            </div>
        </div>
    )
}

// {taggedTrails && <div>{tag} Trail Card Quad</div>}
