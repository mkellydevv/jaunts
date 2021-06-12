import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getTrailById, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import ReviewList from "../review/ReviewList";
import TrailCardList from "../trail-card/TrailCardList";
import Modal from "../Modal";
import ReviewModal from "./ReviewModal";

import "./TrailPage.css"

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function SplashPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const trail = useSelector(state => state["trails"]["current"]);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        dispatch(getTrailById(id, trailQuery({
            getReviews: true,
            getPhotos: true,
            getTags: true,
        })))

        return () => {
            dispatch(clearTrails("current"));
        }
      }, [dispatch])

    return (
    <>
        <div className="trail-page">
            <div className="trail-page__content">
                <div className="trail-page__info">
                    <h2>Main Info</h2>
                    <div className="trail-page__overview">
                        {trail && trail.overview}
                    </div>
                    <div className="trail-page__details">
                        <span>Length: {trail && trail.length} mi</span>
                        <span>Elevation Gain: {trail && trail.elevation_gain} ft</span>
                        <span>Route type: {trail && trail.route_type} </span>
                    </div>
                    <div className="trail-page__tags">
                        Tags
                    </div>
                    <div className="trail-page__description">
                        {trail && trail.description}
                    </div>
                    <div>
                        <span className="trail-card__rating">
                            {trail && trail.default_rating}
                        </span>
                        <span className="trail-card__count">
                            {trail && `\(${trail.default_weighting}\)`}
                        </span>
                        <span>
                            {trail && <button onClick={() => setShowReview(true)}>
                                Write Review
                            </button>}
                        </span>
                    </div>
                    <div className="trail-page__reviews">
                        {trail && <ReviewList trail={trail} />}
                    </div>
                </div>

                <div className="trail-page__extra">
                    <h2>Nearby Trails</h2>
                    {trail && <TrailCardList trail={trail} />}
                </div>
            </div>
        </div>
        {showReview && trail &&
            <Modal close={()=>setShowReview(false)}>
                <ReviewModal trail={trail} close={()=>setShowReview(false)} />
            </Modal>
        }
    </>
    )
}
