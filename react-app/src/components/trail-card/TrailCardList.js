import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import TrailCard from "./TrailCard";

import "./TrailCardList.css";

export default function TrailCardList({ trail }) {
    const dispatch = useDispatch();
    const trails = useSelector(state => state["trails"]["nearby"])

    useEffect(() => {
        const query = trailQuery({
            searchTerm: trail.region,
            searchCategories: ["region"],
            limit: 10,
            getPhotos: true,
        });
        dispatch(getTrails(query, "nearby"));

        return () => {
            dispatch(clearTrails("nearby"))
        }
    }, [dispatch]);

    return (
        <div className="card-list">
            <h2>Trail List</h2>
            <div className="card-list__container">
                {trails && Object.keys(trails).map(key => {
                    return (
                        <TrailCard trail={trails[key]} key={`TrailCard__nearby-${key}`}/>
                    )
                })}
            </div>
        </div>
    )
}
