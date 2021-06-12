import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import HeroCarousel from "./HeroCarousel";
import TrailCardQuad from "../trail-card/TrailCardQuad";

import "./SplashPage.css"

export default function SplashPage() {
    const currSearch = useRef("")
    const prevSearch = useRef("")
    const dispatch = useDispatch();
    const history = useHistory();
    const searchResults = useSelector(state => state["trails"]["search"]);

    const submit = () => {
        history.push(`/trails/${Object.values(searchResults)[0]["id"]}`);
    }

    useEffect(() => {
        const searchInterval = setInterval(() => {
            if (currSearch.current.length && prevSearch.current !== currSearch.current) {
                const query = trailQuery({
                    searchTerm: currSearch.current,
                    limit: 1
                });
                dispatch(getTrails(query, "search"));
            }
            prevSearch.current = currSearch.current;
        }, 1000);

        return (() => {
            clearInterval(searchInterval);
        })
    }, [dispatch]);

    return (
        <div className="splash-page">
            <HeroCarousel />
            <div className="search-bar">
                <i className="fas fa-search" />
                <input
                    className="search-bar__input"
                    placeholder="Search by region, state, or trail name"
                    onChange={e => {
                        currSearch.current = e.target.value;
                    }}
                    onKeyPress={e => {
                        if (e.key === "Enter" && prevSearch.current === currSearch.current)
                            submit()
                    }}
                />
                <button className="search-bar__submit" onClick={submit}>
                    <i className="fas fa-arrow-right" />
                </button>
            </div>
            <TrailCardQuad tag={"camping"} />
            <TrailCardQuad tag={"waterfall"} />
            <TrailCardQuad tag={"rocky"} />
        </div>
    )
}
