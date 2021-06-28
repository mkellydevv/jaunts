import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getTrailById, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

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

export default function SplashPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const trail = useSelector(state => state.trails.current);
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

    useEffect(() => {
        dispatch(getTrailById(id, trailQuery({
            getPhotos: true,
            getTags: true,
        })))

        return () => {
            dispatch(clearTrails("current"));
        }
    }, [id, dispatch])

    return (
    <>
        <div className="trail-page">
            <div className="trail-page__content">
                <section className="trail-section">
                    <div className="trail-section__header">
                        {trail && <>
                            <img
                                className="trail-section__header-img"
                                src={trail.photos[0].url}
                            />
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
                        <div className="trail-section__action-tab" >
                            <div className="trail-section__action-btn">
                                <i className="fas fa-check" />
                            </div>
                            <div className="trail-section__action-name">
                                Mark Complete
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
                        {trail && trail.tags.map(tag => {
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
                            {["Description", "Waypoints", "Tips", "Getting There"].map(tabName => {
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
                            { trail && activeInfoTab === "Waypoints" && <div>Waypoints</div> }
                            { trail && activeInfoTab === "Tips" && <div>Tips</div> }
                            { trail && activeInfoTab === "Getting There" && <div>Getting There</div> }
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
                                <PhotoGrid trail={trail} open={openViewPhotoModal} />
                            }
                        </div>
                    </div>
                </section>

                <div className="trail-page__extra">
                    <h2>Nearby Trails</h2>
                    {trail && <TrailCardList trail={trail} />}
                </div>
            </div>
        </div>
        {showReviewModal && trail &&
            <Modal close={closeReviewModal}>
                <ReviewModal trail={trail} review={review} close={closeReviewModal} />
            </Modal>
        }
        {showViewPhotoModal && trail &&
            <ViewPhotoModal photos={trail.photos} photoId={photoId} close={closeViewPhotoModal} />
        }
        {showListModal && trail &&
            <Modal close={closeListModal}>
                <ListsModal />
            </Modal>
        }
    </>
    )
}
