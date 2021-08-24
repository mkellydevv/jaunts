import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from 'react-router-dom';

import { getUser } from "../../store/users";
import { trailQuery, userQuery } from "../../utils/queryObjects";

import HeroCarousel from "./HeroCarousel";
import TrailCardQuad from "../trail-card/TrailCardQuad";
import SearchBar from "./SearchBar";

import "./SplashPage.css";

const activityTags = [
    "Hiking",
    "Mountain Biking",
    "Trail Running",
    "Backpacking",
    "Walking",
];

const activityUrls = [
    "https://cdn-assets.alltrails.com/assets/images/activities/square/hiking@2x.png",
    "https://cdn-assets.alltrails.com/assets/images/activities/square/mountain-biking@2x.png",
    "https://cdn-assets.alltrails.com/assets/images/activities/square/trail-running@2x.png",
    "https://cdn-assets.alltrails.com/assets/images/activities/square/backpacking@2x.png",
    "https://cdn-assets.alltrails.com/assets/images/activities/square/walking@2x.png"
];

export default function SplashPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector(state => state["session"]);
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);
    const trailLimit = 4;

    const handleExplore = () => {
        history.push({
            pathname: `/trails`,
            query: trailQuery({ }),
            options: {}
        });
    }

    const handleActivity = (activityTag) => {

    }

    useEffect(() => {
        if (!user) return;
        const query = userQuery({ getCompletedTrails: 1000 });
        dispatch(getUser(user.id, query));
        return () => {};
    }, [user]);

    return (
        <div className="splashPage">
            <HeroCarousel />

            <div className="splashPage__search">
                <SearchBar />
            </div>

            <TrailCardQuad trailLimit={trailLimit} tag={"camping"} completedTrails={completedTrails} />

            <TrailCardQuad trailLimit={trailLimit} tag={"waterfall"} completedTrails={completedTrails} />

            <div className="splashPage__activities">

                <div className="splashPage__activities-title">
                    Browse by activity type
                </div>

                <div className="splashPage__tags">
                    {activityTags.map((tag, i) => {
                        return (
                            <div
                                className="splashPage__tag-cell"
                                key={`splashPage__tag-cell-${i}`}
                            >
                                <div className="splashPage__tag-img">
                                    <img src={activityUrls[i]} />
                                </div>
                                <div>
                                    {tag}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>

            <div className={`splashPage__promo`}>

                <img
                    src="https://cdn.discordapp.com/attachments/415362732561399809/872649311677186048/promo-3.jpg"
                />

                <div className="splashPage__promo-text">

                    <div className="splashPage__promo-title">
                        Explore trails in 3D before ever leaving home
                    </div>

                    <div className="splashPage__promo-content">

                        <div>
                            Find out exactly what you are in for on a trail by viewing
                            it in 3D. This map viewer utilizes the Mapbox API to
                            fetch global elevation data as raster images. These height maps
                            are decoded and applied to the map mesh to produce a real
                            representation of the terrain.
                        </div>

                        <div className="splashPage__promo-btn">
                            <button
                                className="jaunts__btn jaunts__btn-2"
                                onClick={handleExplore}
                            >
                                Explore
                            </button>
                        </div>

                    </div>

                </div>

            </div>

            <TrailCardQuad trailLimit={trailLimit} tag={"rocky"} completedTrails={completedTrails} />

            <TrailCardQuad trailLimit={trailLimit} tag={"views"} completedTrails={completedTrails} />

            <div className="splashPage__info">

                <div>
                    <div className="splashPage__info-icon">
                        <i className="fas fa-mountain" />
                    </div>
                    <div className="splashPage__info-header">
                        Find trails
                    </div>
                    <div className="splashPage__info-text">
                        Find the right trail for you through an extensive search feature.
                    </div>
                </div>

                <div>
                    <div className="splashPage__info-icon">
                        <i className="fas fa-map" />
                    </div>
                    <div className="splashPage__info-header">
                        Plan a trip
                    </div>
                    <div className="splashPage__info-text">
                        Keep track of which trails you've visited or plan to visit.
                    </div>
                </div>

                <div>
                    <div className="splashPage__info-icon">
                        <i className="fas fa-share-square" />
                    </div>
                    <div className="splashPage__info-header">
                        Share your experience
                    </div>
                    <div className="splashPage__info-text">
                        Leave reviews and upload photos of your experience.
                    </div>
                </div>

            </div>

            <div className="splashPage__footer">

            </div>

        </div>
    )
}
