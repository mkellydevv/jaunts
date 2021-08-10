import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getPhotos, clearPhotos } from "../../store/photos";
import { getTrail, clearTrails } from "../../store/trails";
import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";
import { photoQuery, trailQuery, userQuery } from "../../utils/queryObjects";

import ReviewList from "../review/ReviewList";
import TrailCardList from "../trail-card/TrailCardList";
import Modal from "../Modal";
import ReviewModal from "../review/ReviewModal";
import StarRating from "../random/StarRating";
import PhotoGrid from "../photos/PhotoGrid";
import ViewPhotoModal from "../photos/ViewPhotoModal";
import ListsModal from "../lists/ListsModal";

import "./TrailPage.css"

const map = {
    Easy: "easy",
    Moderate: "moderate",
    Hard: "hard"
}

export default function TrailPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    const { user } = useSelector(state => state["session"]);
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);

    const { default: trails } = useSelector(state => state.trails);
    const trailsArr = trails ? Object.values(trails) : [];
    const trail = trailsArr.length ? trailsArr[0] : null;
    const { default: photos } = useSelector(state => state.photos);
    if (photos) delete photos['totalCount'];
    const photosArr = photos ? Object.values(photos) : [];

    const [review, setReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [photoId, setPhotoId] = useState(null);
    const [showViewPhotoModal, setShowViewPhotoModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [activeInfoTab, setActiveInfoTab] = useState("Description");
    const [activeFeedTab, setActiveFeedTab] = useState("Reviews");

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

    const handleMarkComplete = () => {
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

    useEffect(() => {
        const _photoQuery = photoQuery({
            fromTrailId: id,
        });

        const _trailQuery = trailQuery({
            getTags: 25,
        });

        dispatch(getPhotos(_photoQuery));
        dispatch(getTrail(id, _trailQuery));

        return () => {
            dispatch(clearPhotos());
            dispatch(clearTrails());
        }
    }, [dispatch, history.location])

    useEffect(() => {
        if (!user) return;
        const query = userQuery({ getCompletedTrails: 1000 });
        dispatch(getUser(user.id, query));
        return () => {};
    }, [user]);

    return (
    <>
        <div className="trail-page">
            <div className="dummy-nav" />
            <div className="trail-page__content">
                <section className="trail-section">

                    {trail && completedTrails.has(trail.id) &&
                    <div className="trail-completed">
                        <i className="fas fa-check" />Completed
                    </div>}

                    <div className="trail-section__header">
                        {trail && <>
                            {photos && <img
                                className="trail-section__header-img"
                                src={photosArr[0].url}
                            />}
                            <div className="trail-section__header-container">
                                <div className="trail-section__header-name">
                                    {trail.name}
                                </div>
                                <div className="trail-section__header-info">
                                    <span className={`trail-card__difficulty difficulty-${map[trail.difficulty]}`}>
                                        {trail.difficulty}
                                    </span>
                                    <span className="trail-card__rating">
                                        <StarRating rating={trail.default_rating} fixed={true} />
                                    </span>
                                    <span className="trail-card__count">
                                        {`(${trail.default_weighting})`}
                                    </span>
                                </div>
                                <div className=".trail-section__header-region">{trail.region}</div>
                            </div>
                        </>}
                    </div>

                    <div className="trail-section__action-bar">
                        <div className="trail-section__action-tab" onClick={openListModal}>
                            <div className="trail-section__action-btn">
                                <i className="fas fa-star" />
                            </div>
                            <div className="trail-section__action-name">
                                Add to List
                            </div>
                        </div>
                        <div className="trail-section__action-tab" onClick={handleMarkComplete}>
                            <div className="trail-section__action-btn">
                                <i className="fas fa-check" />
                            </div>
                            <div className="trail-section__action-name">
                                {trail && completedTrails.has(trail.id) ? "Mark Incomplete" : "Mark Complete"}
                            </div>
                        </div>
                    </div>

                    <div className="trail-section__overview trail-section__spacing">
                        {trail && trail.overview}
                    </div>

                    <div className="trail-section__details trail-section__spacing">
                        <div>
                            <div>Length</div>
                            <div>{trail && trail.length} mi</div>
                        </div>
                        <div>
                            <div>Elevation Gain</div>
                            <div>{trail && trail.elevation_gain} ft</div>
                        </div>
                        <div>
                            <div>Route type</div>
                            <div>{trail && trail.route_type}</div>
                        </div>
                    </div>

                    <div className="trail-section__tags trail-section__spacing">
                        {trail && trail.tags !== undefined && Object.values(trail.tags).map(tag => {
                            return (
                                <div
                                    className="trail-section__tag"
                                    key={`Tag-${tag.id}`}>
                                    {tag.name}
                                </div>
                            )
                        })}
                    </div>

                    {/* Section: Info */}
                    <div className="trail-page__info">
                        <div className="tab-navigation">
                            {["Description", "Tips", "Getting There"].map(tabName => {
                                return (
                                    <div
                                        className={`tab ${checkActive(tabName, activeInfoTab)}`}
                                        onClick={() => setActiveInfoTab(tabName)}
                                        key={`${tabName}`}
                                    >
                                        {tabName}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="tab-content">
                            { trail && activeInfoTab === "Description" && trail.description }
                            { trail && activeInfoTab === "Tips" && trail.tips }
                            { trail && activeInfoTab === "Getting There" && trail.getting_there }
                        </div>
                    </div>

                    {/* Section: Feeds */}
                    <div className="trail-page__feeds">
                        <div className="tab-navigation">
                            {["Reviews", "Photos"].map(tabName => {
                                return (
                                    <div
                                        className={`tab ${checkActive(tabName, activeFeedTab)}`}
                                        onClick={() => setActiveFeedTab(tabName)}
                                        key={`${tabName}`}
                                    >
                                        {tabName}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="tab-content">
                            {trail && activeFeedTab === "Reviews" &&
                                <ReviewList trail={trail} open={openReviewModal} />
                            }
                            {trail && activeFeedTab === "Photos" &&
                                <PhotoGrid photosArr={photosArr} open={openViewPhotoModal} />
                            }
                        </div>
                    </div>
                </section>

                <div className="trail-page__extra">
                    <h2>Nearby Trails</h2>
                    {trail && <TrailCardList trail={trail} tag={"nearby"} trailLimit={10} completedTrails={completedTrails} />}
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
    </>
    )
}
