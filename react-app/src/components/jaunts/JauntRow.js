import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPhotos, getPhotos } from "../../store/photos";
import { photoQuery } from "../../utils/queryObjects";

import "./JauntRow.css";

export default function JauntRow({ jaunt, trail, user }) {
    const dispatch = useDispatch();
    const { user: userPhotos } = useSelector(state => state.photos);
    const userPhotosArr = userPhotos ? Object.values(userPhotos) : [];
    const { trail: trailPhotos } = useSelector(state => state.photos);
    const trailPhotosArr = trailPhotos ? Object.values(trailPhotos) : [];
    const [photos, setPhotos] = useState(null);
    const [photosKey, setPhotosKey] = useState("");
    const [photosArr, setPhotosArr] = useState([]);
    const [mainPhoto, setMainPhoto] = useState(null);

    const handleImageClick = (photoId=null) => {
        setMainPhoto(photos[photoId]);
    };

    useEffect(() => {
        const userPhotoQuery = photoQuery({
            fromTrailId: trail.id,
            fromUserId: user.id,
        });
        const trailPhotoQuery = photoQuery({
            fromTrailId: trail.id,
            limit: 5
        });

        dispatch(getPhotos(userPhotoQuery, "user"));
        dispatch(getPhotos(trailPhotoQuery, "trail"));

        return () => dispatch(clearPhotos());
    }, [dispatch]);

    useEffect(() => {
        if (trailPhotosArr.length) {
            setPhotos(trailPhotos);
            setPhotosArr(trailPhotosArr);
            setPhotosKey("trail");
        }
        else if (userPhotosArr.length) {
            setPhotos(userPhotos);
            setPhotosKey("user");
            setPhotosArr(userPhotosArr);
        }
        setMainPhoto(photosArr[0]);
        return () => {};
    }, [userPhotos, trailPhotos]);

    return (
        <div className="jaunt-row">
            <div className="jaunt-row__gallery">
                <div className="jaunt-row__gallery-main">
                    {mainPhoto && <img src={mainPhoto.url} alt="Main Photo" />}
                </div>
                <div className="jaunt-row__gallery-imgages" >
                    {photosArr.length && photosArr.map(photo => {
                        return (
                            <div className="jaunt-row__gallery-img-container">
                                <img
                                    src={photo.url.replace("extra_", "")}
                                    alt={` photo`}
                                    key={photo.id}
                                    onClick={() => handleImageClick(photo.id)}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div>
                <div>
                    Rating {jaunt.rating}
                </div>
                <div>
                    Blurb {jaunt.blurb}
                </div>
                <div>
                    Date {jaunt.date}
                </div>
                <br />
            </div>
        </div>
    )
}
