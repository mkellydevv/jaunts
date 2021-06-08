import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import TrailCardQuad from "./TrailCardQuad";


export default function SplashPage() {
    const currSearch = useRef("")
    const prevSearch = useRef("")
    const dispatch = useDispatch();

    useEffect(() => {
        const searchInterval = setInterval(() => {
            if (currSearch.current.length && prevSearch.current !== currSearch.current) {
                const query = trailQuery({ searchTerm: currSearch.current });
                dispatch(getTrails(query, "search"));
            }
            prevSearch.current = currSearch.current;
        }, 1000);

        return (() => {
            clearInterval(searchInterval);
        })
    }, [dispatch]);

    return (
        <>
            <input
                placeholder="Search by region, state, or trail name"
                onChange={e => {
                    currSearch.current = e.target.value;
                }}
            />
            <TrailCardQuad tag={"views"} />
            <TrailCardQuad tag={"river"} />
            <TrailCardQuad tag={"rocky"} />
        </>
    )
}
