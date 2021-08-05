import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getTrails, clearTrails } from "../../store/trails";
import { getUser } from "../../store/users";
import { trailQuery, userQuery } from "../../utils/queryObjects";

import HeroCarousel from "./HeroCarousel";
import TrailCardQuad from "../trail-card/TrailCardQuad";

import "./SplashPage.css";

export default function SplashPage() {
    const currSearch = useRef("");
    const prevSearch = useRef("");
    const dispatch = useDispatch();
    const history = useHistory();
    const searchResults = useSelector(state => state["trails"]["search"]);
    const { user } = useSelector(state => state["session"]);
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);
    const [inputFocus, setInputFocus] = useState(false);

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

        return () => {
            clearInterval(searchInterval);
            dispatch(clearTrails("search"));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!user) return;
        const query = userQuery({ getCompletedTrails: 1000 });
        dispatch(getUser(user.id, query));
        return () => {};
    }, [user]);

    return (
        <div className="splash-page">
            <HeroCarousel />

            <div className="search-bar">
                <div className="search-bar__icon">
                    <i className={`fas fa-search ${inputFocus ? "active": ""}`} />
                </div>
                <input
                    className="search-bar__input"
                    placeholder="Search by region, state, or trail name"
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
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

            <TrailCardQuad tag={"camping"} completedTrails={completedTrails} />

            <TrailCardQuad tag={"waterfall"} completedTrails={completedTrails} />

            <div className="splash-page__activities">

                <div className="splash-page__activities-title">
                    Browse by activity type
                </div>

                <div className="splash-page__tags">
                    <div className="spash-page__tag-cell">
                        <div className="splash-page__tag-img">
                            <img src="https://cdn-assets.alltrails.com/assets/images/activities/square/hiking@2x.png" />
                        </div>
                        <div>
                            Hiking
                        </div>
                    </div>
                    <div className="spash-page__tag-cell">
                        <div className="splash-page__tag-img">
                            <img src="https://cdn-assets.alltrails.com/assets/images/activities/square/mountain-biking@2x.png" />
                        </div>
                        <div>
                            Mountain Biking
                        </div>
                    </div>
                    <div className="spash-page__tag-cell">
                        <div className="splash-page__tag-img">
                            <img src="https://cdn-assets.alltrails.com/assets/images/activities/square/trail-running@2x.png" />
                        </div>
                        <div>
                            Trail Running
                        </div>
                    </div>
                    <div className="spash-page__tag-cell">
                        <div className="splash-page__tag-img">
                            <img src="https://cdn-assets.alltrails.com/assets/images/activities/square/backpacking@2x.png" />
                        </div>
                        <div>
                            Backpacking
                        </div>
                    </div>
                    <div className="spash-page__tag-cell">
                        <div className="splash-page__tag-img">
                            <img src="https://cdn-assets.alltrails.com/assets/images/activities/square/walking@2x.png" />
                        </div>
                        <div>
                            Walking
                        </div>
                    </div>
                </div>
            </div>

            <div className={`splash-page__promo`}>
                <img
                    // src="https://cdn-assets.alltrails.com/assets/images/homepage/pro_upsell/bg_desktop_en.jpg"
                    src="https://cdn.discordapp.com/attachments/415362732561399809/872649311677186048/promo-3.jpg"
                />
                <div className="splash-page__promo-text">
                    <div className="splash-page__promo-title">
                        Explore trails before ever leaving home
                    </div>
                    <div className="splash-page__promo-content">
                        <div>
                            Explore the world of trails in 3D. This map viewer utilizes the Mapbox API to
                            fetch global elevation data as raster images and renders the data as voxels using
                            the Three.js graphics library.
                        </div>
                        <div className="splash-page__promo-btn">
                            <button className="jaunts__btn jaunts__btn-2">
                                Explore
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <TrailCardQuad tag={"rocky"} completedTrails={completedTrails} />

            <TrailCardQuad tag={"views"} completedTrails={completedTrails} />

            <div className="splash-page__info">

            </div>

            <div className="splash-page__footer">
                <a href="https://github.com/mkellydevv" target="_blank">
                    <i className="fab fa-github" /> Github
                </a>
            </div>

        </div>
    )
}
