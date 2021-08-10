import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "../../store/users";
import { userQuery } from "../../utils/queryObjects";

import HeroCarousel from "./HeroCarousel";
import TrailCardQuad from "../trail-card/TrailCardQuad";
import SearchBar from "./SearchBar";

import "./SplashPage.css";

export default function SplashPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state["session"]);
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);
    const trailLimit = 4;

    useEffect(() => {
        if (!user) return;
        const query = userQuery({ getCompletedTrails: 1000 });
        dispatch(getUser(user.id, query));
        return () => {};
    }, [user]);

    return (
        <div className="splash-page">
            <HeroCarousel />

            <SearchBar />

            <TrailCardQuad trailLimit={trailLimit} tag={"camping"} completedTrails={completedTrails} />

            <TrailCardQuad trailLimit={trailLimit} tag={"waterfall"} completedTrails={completedTrails} />

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
                        Explore trails in 3D before ever leaving home
                    </div>
                    <div className="splash-page__promo-content">
                        <div>
                            Find out exactly what you are in for on a trail by viewing
                            it in 3D. This map viewer utilizes the Mapbox API to
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

            <TrailCardQuad trailLimit={trailLimit} tag={"rocky"} completedTrails={completedTrails} />

            <TrailCardQuad trailLimit={trailLimit} tag={"views"} completedTrails={completedTrails} />

            <div className="splash-page__info">
                <div>
                    <div className="splash-page__info-icon">
                        <i className="fas fa-mountain" />
                    </div>
                    <div className="splash-page__info-header">
                        Find trails
                    </div>
                    <div className="splash-page__info-text">
                        Find the right trail for you through an extensive search feature.
                    </div>
                </div>
                <div>
                    <div className="splash-page__info-icon">
                        <i className="fas fa-map" />
                    </div>
                    <div className="splash-page__info-header">
                        Plan a trip
                    </div>
                    <div className="splash-page__info-text">
                        Keep track of which trails you've visited or plan to visit.
                    </div>
                </div>
                <div>
                    <div className="splash-page__info-icon">
                        <i className="fas fa-share-square" />
                    </div>
                    <div className="splash-page__info-header">
                        Share your experience
                    </div>
                    <div className="splash-page__info-text">
                        Leave reviews and upload photos of your experience.
                    </div>
                </div>
            </div>

            <div className="splash-page__footer">
                <a href="https://github.com/mkellydevv" target="_blank">
                    <i className="fab fa-github" /> Github
                </a>
            </div>

        </div>
    )
}
