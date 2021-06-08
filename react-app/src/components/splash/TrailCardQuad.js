import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";
import TrailCard from "../TrailCard";

export default function TrailCardQuad({ tag }) {
    const dispatch = useDispatch();
    const trails = useSelector(state => state["trails"][tag]);

    useEffect(() => {
        dispatch((getTrails(trailQuery({searchTags: [tag], limit: 4}), tag)));
    }, [dispatch]);

    return (
        <>
            <div>{tag} Quad</div>
            {trails && Object.keys(trails).map(key => {
                return (
                    <TrailCard trail={trails[key]} key={`TrailCard__${tag}-${key}`}/>
                )
            })}
        </>
    )
}

// {taggedTrails && <div>{tag} Trail Card Quad</div>}
