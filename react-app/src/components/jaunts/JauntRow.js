import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteJaunt, editJaunt } from "../../store/jaunts";
import { clearPhotos, getPhotos, getPhoto } from "../../store/photos";
import { clearTrails } from "../../store/trails";
import { getDateString } from "../../utils/helperFuncs";
import { jauntQuery, photoQuery } from "../../utils/queryObjects";
import PhotoUpload from "../photos/PhotoUpload";

import StarRating from "../random/StarRating";

import "./JauntRow.css";

export default function JauntRow({ list, jaunt, jauntsLength, trail, user }) {
    const dispatch = useDispatch();
    const history = useHistory();

    const { photos: photoData } = useSelector(state => state);
    const [photos, setPhotos] = useState(null);
    const [photosTotalCount, setPhotosTotalCount] = useState(0);
    const [photosArr, setPhotosArr] = useState([]);
    const [photosKey, setPhotosKey] = useState("all"); // all, user
    const [mainPhoto, setMainPhoto] = useState(null);
    const [errors, setErrors] = useState("");

    const [rating, setRating] = useState(jaunt.rating);
    const [date, setDate] = useState(jaunt.date ? new Date(jaunt.date).toISOString().split('T')[0] : "");
    const [showDateInput, setShowDateInput] = useState(false);
    const blurbDefault = "Enter a description for this trail.";
    const [blurb, setBlurb] = useState(jaunt.blurb ? jaunt.blurb : blurbDefault);
    const [showBlurbInput, setShowBlurbInput] = useState(blurb ? false : true);

    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [scrollInterval, setScrollInterval] = useState(null);
    const [headerImgLoaded, setHeaderImgLoaded] = useState(false);

    const handlePhotosTabClick = (val) => {
        if (photosKey === val) return;
        setPhotosKey(val);
        setOffset(0);
    }

    const handleEditBlurb = (val) => {
        const query = jauntQuery({
            fromListId: jaunt.list_id
        });
        dispatch(editJaunt(jaunt.id, query, { blurb: val }));
    }

    const handleEditDate = (val) => {
        const query = jauntQuery({
            fromListId: jaunt.list_id
        });
        dispatch(editJaunt(jaunt.id, query, { date: val }));
    }

    const handleEditRating = (val) => {
        const query = jauntQuery({
            fromListId: jaunt.list_id
        });
        dispatch(editJaunt(jaunt.id, query, { rating: val }));
    }

    const handleDelete = async (e) => {
        const data = await dispatch(deleteJaunt(jaunt.id));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    const handleImageClick = (photoId=null) => {
        if (mainPhoto["id"] === photoId) return;
        setMainPhoto(photos[photoId]);
        setHeaderImgLoaded(false);
    };

    const handleTrailLinkClick = () => {
        dispatch(clearTrails());
        history.push(`/trails/${trail.id}`);
    }

    // Jaunt order handlers
    const handleUpClick = () => {
        const query = jauntQuery({
            fromListId: jaunt.list_id
        });
        dispatch(editJaunt(jaunt.id, query, { order: jaunt.order - 1 }));
    }

    const handleDownClick = () => {
        const query = jauntQuery({
            fromListId: jaunt.list_id
        });
        dispatch(editJaunt(jaunt.id, query, { order: jaunt.order + 1 }));
    }

    // Slider handlers
    const handleSliderImagesLeftClick = () => {
        if (offset === 0) return;

        const query = photoQuery({
            fromTrailId: trail.id,
            limit: limit,
            offset: offset - 1
        });
        setOffset(state => state - 1);
        setHeaderImgLoaded(false);
        dispatch(getPhotos(query, `trail-${trail.id}`));
    }

    const handleSliderImagesRightClick = () => {
        if ((offset + 1) * limit >= photosTotalCount) return;

        const query = photoQuery({
            fromTrailId: trail.id,
            limit: limit,
            offset: offset + 1
        });
        setOffset(state => state + 1);
        setHeaderImgLoaded(false);
        dispatch(getPhotos(query, `trail-${trail.id}`));
    }

    const handleSliderImagesHover = (dir, doScroll) => {
        const container = document.getElementById(`jaunt-row__slider-images-${jaunt.id}`);
        if (doScroll) {
            if (dir === "right") {
                setScrollInterval(setInterval(() => {
                    container.scrollLeft += 1;
                }, 1000 / 240));
            }
            else {
                setScrollInterval(setInterval(() => {
                    container.scrollLeft -= 1;
                }, 1000 / 240));
            }
        }
        else
            clearInterval(scrollInterval);
    }

    useEffect(() => {
        let query;
        if (photosKey === "all") {
            query = photoQuery({
                fromTrailId: trail.id,
                limit: limit,
            });
        }
        else if (photosKey === "user") {
            query = photoQuery({
                fromListId: list.id,
                fromTrailId: trail.id,
                fromUserId: user.id,
                limit: limit,
            });
        }

        dispatch(getPhotos(query, `trail-${trail.id}`));

        return () => dispatch(clearPhotos());
    }, [dispatch, photosKey]);

    useEffect(() => {
        if (photoData[`trail-${trail.id}`] === undefined) return;

        const container = document.getElementById(`jaunt-row__slider-images-container-${jaunt.id}`);
        const tmpPhotos = photoData[`trail-${trail.id}`];
        let tmpPhotosArr = [];

        setPhotos(tmpPhotos);
        if (tmpPhotos['totalCount'] !== undefined) {
            setPhotosTotalCount(tmpPhotos['totalCount']);
            delete tmpPhotos["totalCount"];
        }
        tmpPhotosArr = Object.values(tmpPhotos);
        setPhotosArr(tmpPhotosArr);
        setMainPhoto(tmpPhotosArr[0]);
        container.style.setProperty('--num', tmpPhotosArr.length);

        return () => {};
    }, [photoData]);

    useEffect(() => {
        const el = document.getElementById(`jaunt-row__slider-header-img-${jaunt.id}`);
        if (!el) return;
        if (headerImgLoaded)
            el.classList.remove('preload');
        else
            el.classList.add('preload');
    }, [headerImgLoaded]);

    return (
        <div className="jaunt-row">

            <div className="jaunt-row__info">
                <div className="jaunt-row__name" onClick={handleTrailLinkClick}>
                    {trail.name}
                </div>
            </div>

            <div className="jaunt-row__slider">

                <div className="jaunts-row__slider-tabs">
                    <button
                        className={`jaunts-row__slider-tab-all jaunts__btn jaunts__btn-1 ${photosKey === "all" ? "active" : ""}`}
                        onClick={() => handlePhotosTabClick("all")}
                    >
                        All
                    </button>
                    <button
                        className={`jaunts-row__slider-tab-user jaunts__btn jaunts__btn-1 ${photosKey === "user" ? "active" : ""}`}
                        onClick={() => handlePhotosTabClick("user")}
                    >
                        User
                    </button>
                </div>

                <div className="jaunt-row__slider-header">
                    {mainPhoto &&
                    <img
                        id={`jaunt-row__slider-header-img-${jaunt.id}`}
                        className={`jaunt-row__slider-header-img preload`}
                        src={mainPhoto.url}
                        alt="Main Photo"
                        onLoad={() => setHeaderImgLoaded(true)}
                    />}
                    {photosKey === "user" && photosTotalCount === 0 && "No photos uploaded :("}
                </div>

                <div className="jaunt-row__slider-body">

                    <div
                        id={`jaunt-row__slider-images-${jaunt.id}`}
                        className="jaunt-row__slider-images"
                    >

                        <div
                            id={`jaunt-row__slider-images-container-${jaunt.id}`}
                            className="jaunt-row__slider-images-container"
                        >
                            {photosArr.length && photosArr.map(photo => {
                                return (
                                    <div
                                        className={`jaunt-row__slider-img-container ${mainPhoto.id === photo.id ?'active':''}`}
                                        key={`jaunt-row__slider-img-container-${photo.id}`}
                                    >
                                        <img
                                            src={photo.url.replace("extra_", "")}
                                            alt={`photo`}
                                            key={photo.id}
                                            onClick={() => handleImageClick(photo.id)}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    <div
                        className="jaunt-row__slider-images-left"
                        onMouseEnter={()=>handleSliderImagesHover('left', true)}
                        onMouseLeave={()=>handleSliderImagesHover('left', false)}
                    >
                        <i className="fas fa-chevron-left" onClick={handleSliderImagesLeftClick} />
                    </div>

                    <div
                        className="jaunt-row__slider-images-right"
                        onMouseEnter={()=>handleSliderImagesHover('right', true)}
                        onMouseLeave={()=>handleSliderImagesHover('right', false)}
                    >
                        <i className="fas fa-chevron-right" onClick={handleSliderImagesRightClick} />
                    </div>

                </div>

            </div>

            <div className="jaunt-row__content">

                <div className="jaunt-row__reorder">
                    {jaunt.order > 0 && <div className="jaunt-row__arrow" onClick={handleUpClick}>
                        <i className="fas fa-arrow-up" />
                    </div>}
                    <div>
                        {jaunt.order + 1}
                    </div>
                    {jaunt.order !== jauntsLength - 1 && <div className="jaunt-row__arrow" onClick={handleDownClick}>
                        <i className="fas fa-arrow-down" />
                    </div>}
                </div>

                <div className="jaunt-row__overview">

                    <div className="jaunt-row__overview-info">
                        <div>
                            <StarRating
                                fixed={false}
                                rating={rating}
                                setRating={setRating}
                                handleEdit={handleEditRating}
                            />
                        </div>

                        <div>
                            {!showDateInput && <>
                                <div className="jaunt-row__date">
                                    {date ? getDateString(date) : "Enter date visited."}
                                </div>
                                <div className="jaunt-row__edit-date" onClick={()=>setShowDateInput(true)}>
                                    <i className="fas fa-edit" />
                                </div>
                            </>}
                            {showDateInput && <input
                                className="jaunt-row__edit-date-input"
                                type="date"
                                value={date}
                                onChange={e => {
                                    setDate(e.target.value);
                                    setShowDateInput(false);
                                    handleEditDate(e.target.value);
                                }}
                            />}
                        </div>

                        <div>
                            {!showBlurbInput && <>
                                <div className="jaunt-row__blurb">
                                    {blurb}
                                </div>
                                <div className="jaunt-row__edit-blurb" onClick={()=>setShowBlurbInput(true)}>
                                    <i className="fas fa-edit" />
                                </div>
                            </>}
                            {showBlurbInput && <textarea
                                className="jaunt-row__edit-blurb-input"
                                value={blurb === blurbDefault ? "" : blurb}
                                onChange={e => {
                                    setBlurb(e.target.value);
                                }}
                                onKeyPress={e => {
                                    if (e.key === "Enter") {
                                        setShowBlurbInput(false);
                                        handleEditBlurb(blurb);
                                    }
                                }}
                            />}
                        </div>
                    </div>

                    <div className={'jaunt-row__buttons'}>
                        <button className="jaunt-row__delete jaunts__btn jaunts__btn-3" onClick={handleDelete}>
                            Delete
                        </button>

                        <PhotoUpload photosKey={photosKey} trail={trail} jaunt={jaunt} setPhotosTotalCount={setPhotosTotalCount}/>

                        {/* <button onClick={() => {
                            let query = photoQuery({fromTrailId: trail.id});
                            dispatch(getPhoto(1008, query, `trail-${trail.id}`));
                            setPhotosTotalCount(state => state + 1);
                        }}>Test GetPhoto</button> */}
                    </div>
                </div>

            </div>

        </div>
    )
}
