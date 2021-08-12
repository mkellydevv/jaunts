import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";
import { photoQuery, routeQuery, trailQuery, userQuery } from "../../utils/queryObjects";

import Modal from "../Modal";
import ReviewModal from "../review/ReviewModal";
import ViewPhotoModal from "../photos/ViewPhotoModal";
import ListsModal from "../lists/ListsModal";
import PhotoGrid from "../photos/PhotoGrid";
import ReviewList from "../review/ReviewList";
import StarRating from "../random/StarRating";

import "./TrailInfo.css";

const difficultyMap = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function TrailInfo({ trail, leftPanelWidth }) {
    const dispatch = useDispatch();

    const { user } = useSelector(state => state["session"]);
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);
    const { default: photos } = useSelector(state => state.photos);
    if (photos) delete photos['totalCount'];
    const photosArr = photos ? Object.values(photos) : [];

    const [activeInfoTab, setActiveInfoTab] = useState("Description");
    const [activeFeedTab, setActiveFeedTab] = useState("Reviews");

    const [review, setReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [photoId, setPhotoId] = useState(null);
    const [showViewPhotoModal, setShowViewPhotoModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);

    const checkActive = (tabName, activeTab) => {
        return tabName === activeTab ? "active" : "";
    }

    const openReviewModal = (review=null) => {
        setReview(review);
        setShowReviewModal(true);
    }

    const closeReviewModal = () => {
        setReview(null);
        setShowReviewModal(false);
    }

    const openViewPhotoModal = (photoId=null) => {
        setPhotoId(photoId);
        setShowViewPhotoModal(true);
    }

    const closeViewPhotoModal = () => {
        setPhotoId(null);
        setShowViewPhotoModal(false);
    }

    const openListModal = (review=null) => {
        //setReview(review);
        setShowListModal(true);
    }

    const closeListModal = () => {
        //setReview(null);
        setShowListModal(false);
    }

    const handleAddToList = () => {
        if (!user) return;
        openListModal();
    }

    const handleMarkComplete = () => {
        if (!user) return;
        const query = userQuery({ getCompletedTrails: 1000 });
        if (completedTrails.has(trail.id)) {
            dispatch(markTrailIncomplete(user.id, trail.id, query));
        }
        else {
            const formData = new FormData();
            formData.append("trail_id", trail.id);
            formData.append("user_id", user.id);
            dispatch(markTrailComplete(user.id, query, formData));
        }
    }

    return (<>
        <div className="trailInfo" style={{width: `${leftPanelWidth}%`}}>
            <div className="trailInfo__container">

                {trail && completedTrails.has(trail.id) &&
                <div className="trail-completed">
                    <i className="fas fa-check" />Completed
                </div>}

                <div className="trailInfo__header">
                    {trail && <>
                        {photos && <img
                            className="trailInfo__header-img"
                            src={photosArr[0].url}
                        />}
                        <div className="trailInfo__header-container">
                            <div className="trailInfo__header-name">
                                {trail.name}
                            </div>
                            <div className="trailInfo__header-info">
                                <span className={`trail-card__difficulty difficulty-${difficultyMap[trail.difficulty]}`}>
                                    {trail.difficulty}
                                </span>
                                <span className="trail-card__rating">
                                    <StarRating rating={trail.default_rating} fixed={true} />
                                </span>
                                <span className="trail-card__count">
                                    {`(${trail.default_weighting})`}
                                </span>
                            </div>
                            <div className="trailInfo__header-region">
                                {trail.region}
                            </div>
                        </div>
                    </>}
                </div>

                <div className="trailInfo__btnBar">
                    <div className="trailInfo__btnBar-tab" onClick={handleAddToList}>
                        <div className="trailInfo__btnBar-btn">
                            <i className="fas fa-star" />
                        </div>
                        <div className="trailInfo__btnBar-name">
                            Add to List
                        </div>
                    </div>
                    <div className="trailInfo__btnBar-tab" onClick={handleMarkComplete}>
                        <div className="trailInfo__btnBar-btn">
                            <i className="fas fa-check" />
                        </div>
                        <div className="trailInfo__btnBar-name">
                            {trail && completedTrails.has(trail.id) ? "Mark Incomplete" : "Mark Complete"}
                        </div>
                    </div>
                </div>

                <div className="trailInfo__overview">
                    {trail && trail.overview}
                </div>

                <div className="trailInfo__details">
                    <div>
                        <div className="trailInfo__details-category">Length</div>
                        <div className="trailInfo__details-data">{trail && trail.length} mi</div>
                    </div>
                    <div>
                        <div className="trailInfo__details-category">Elevation Gain</div>
                        <div className="trailInfo__details-data">{trail && trail.elevation_gain} ft</div>
                    </div>
                    <div>
                        <div className="trailInfo__details-category">Route type</div>
                        <div className="trailInfo__details-data">{trail && trail.route_type}</div>
                    </div>
                </div>

                <div className="trailInfo__tags">
                    {trail && trail.tags !== undefined && Object.values(trail.tags).map(tag => {
                        return (
                            <div
                                className="trailInfo__tags-tag"
                                key={`Tag-${tag.id}`}
                            >
                                {tag.name}
                            </div>
                        )
                    })}
                </div>

                {/* Section: Info */}
                <div className="trailInfo__info">
                    <div className="trailInfo__info-tabs">
                        {["Description", "Tips", "Getting There"].map(tabName => {
                            return (
                                <div
                                    className={`trailInfo__info-tab ${checkActive(tabName, activeInfoTab)}`}
                                    onClick={() => setActiveInfoTab(tabName)}
                                    key={`${tabName}`}
                                >
                                    {tabName}
                                </div>
                            )
                        })}
                    </div>
                    <div className="trailInfo__info-content">
                        { trail && activeInfoTab === "Description" && trail.description }
                        { trail && activeInfoTab === "Tips" && trail.tips }
                        { trail && activeInfoTab === "Getting There" && trail.getting_there }
                    </div>
                </div>

                {/* Section: Feeds */}
                <div className="trail-page__feeds">
                    <div className="trailInfo__info-tabs">
                        {["Reviews", "Photos"].map(tabName => {
                            return (
                                <div
                                    className={`trailInfo__info-tab ${checkActive(tabName, activeFeedTab)}`}
                                    onClick={() => setActiveFeedTab(tabName)}
                                    key={`${tabName}`}
                                >
                                    {tabName}
                                </div>
                            )
                        })}
                    </div>
                    <div className="trailInfo__info-content">
                        {trail && activeFeedTab === "Reviews" &&
                            <ReviewList trail={trail} open={openReviewModal} />
                        }
                        {trail && activeFeedTab === "Photos" &&
                            <PhotoGrid photosArr={photosArr} open={openViewPhotoModal} />
                        }
                    </div>
                </div>
            </div>
        </div>

        {showReviewModal && trail &&
            <Modal close={closeReviewModal}>
                <ReviewModal trail={trail} review={review} close={closeReviewModal} />
            </Modal>
        }

        {showViewPhotoModal && photos &&
            <ViewPhotoModal photosArr={photosArr} photoId={photoId} close={closeViewPhotoModal} />
        }

        {showListModal && trail &&
            <Modal close={closeListModal}>
                <ListsModal trail={trail} />
            </Modal>
        }
    </>)
}
