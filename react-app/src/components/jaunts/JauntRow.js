import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { editJaunt } from "../../store/jaunts";
import { clearPhotos, getPhotos } from "../../store/photos";
import { clearTrails } from "../../store/trails";
import { getDateString } from "../../utils/helperFuncs";
import { jauntQuery, photoQuery } from "../../utils/queryObjects";

import StarRating from "../random/StarRating";

import "./JauntRow.css";

export default function JauntRow({ jaunt, jauntsLength, trail, user }) {
    const dispatch = useDispatch();
    const history = useHistory();

    const userPhotos = useSelector(state => state.photos[`user-trail-${trail.id}`]);
    const userPhotosTotalCount = userPhotos ? userPhotos["totalCount"] : 0;
    if (userPhotos) delete userPhotos["totalCount"];
    const userPhotosArr = userPhotos ? Object.values(userPhotos) : [];

    const allPhotos = useSelector(state => state.photos[`all-trail-${trail.id}`]);
    const allPhotosTotalCount = allPhotos ? allPhotos["totalCount"] : 0;
    if (allPhotos) delete allPhotos["totalCount"];
    const allPhotosArr = allPhotos ? Object.values(allPhotos) : [];

    const [photos, setPhotos] = useState(null);
    const [photosKey, setPhotosKey] = useState("");
    const [photosArr, setPhotosArr] = useState([]);
    const [mainPhoto, setMainPhoto] = useState(null);
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

    const handleImageClick = (photoId=null) => {
        if (mainPhoto["id"] === photoId) return;
        setMainPhoto(photos[photoId]);
        setHeaderImgLoaded(false);
    };

    const handleTrailLinkClick = () => {
        dispatch(clearTrails());
        history.push(`/trails/${trail.id}`);
    }

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

    const handleSliderImagesLeftClick = () => {
        if (offset === 0) return;
        if (photosKey === "all") {
            const allPhotoQuery = photoQuery({
                fromTrailId: trail.id,
                limit: limit,
                offset: offset - 1
            });
            setOffset(state => state - 1);
            dispatch(getPhotos(allPhotoQuery, `all-trail-${trail.id}`));
        }
    }

    const handleSliderImagesRightClick = () => {
        if (photosKey === "all") {
            if ((offset + 1) * limit >= allPhotosTotalCount) return;
            const allPhotoQuery = photoQuery({
                fromTrailId: trail.id,
                limit: limit,
                offset: offset + 1
            });
            setOffset(state => state + 1);
            dispatch(getPhotos(allPhotoQuery, `all-trail-${trail.id}`));
        }
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
        const userPhotoQuery = photoQuery({
            fromTrailId: trail.id,
            fromUserId: user.id,
        });
        const allPhotoQuery = photoQuery({
            fromTrailId: trail.id,
            limit: limit,
        });

        dispatch(getPhotos(userPhotoQuery, `user-trail-${trail.id}`));
        dispatch(getPhotos(allPhotoQuery, `all-trail-${trail.id}`));

        return () => dispatch(clearPhotos());
    }, [dispatch]);

    useEffect(() => {
        if (!allPhotos && !userPhotos) return;
        const container = document.getElementById(`jaunt-row__slider-images-container-${jaunt.id}`);
        if (allPhotosArr.length) {
            setPhotos(allPhotos);
            setPhotosArr(allPhotosArr);
            setPhotosKey("all");
            setMainPhoto(allPhotosArr[0]);
            setHeaderImgLoaded(false);
            container.style.setProperty('--num', allPhotosArr.length);
        }
        else if (userPhotosArr.length) {
            setPhotos(userPhotos);
            setPhotosArr(userPhotosArr);
            setPhotosKey("user");
            setMainPhoto(userPhotosArr[0]);
            setHeaderImgLoaded(false);
            container.style.setProperty('--num', userPhotosArr.length);
        }
        return () => {};
    }, [userPhotos, allPhotos]);

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

                <div className="jaunt-row__slider-header">
                    {mainPhoto &&
                    <img
                        id={`jaunt-row__slider-header-img-${jaunt.id}`}
                        className={`jaunt-row__slider-header-img preload`}
                        src={mainPhoto.url}
                        alt="Main Photo"
                        onLoad={() => setHeaderImgLoaded(true)}
                    />}
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
                                    <div className={`jaunt-row__slider-img-container ${mainPhoto.id === photo.id ?'active':''}`}>
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

            </div>

        </div>
    )
}
