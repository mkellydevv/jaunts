import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearTrails, getTrailById } from "../../store/trails";
import { removeList } from "../../store/lists";
import { trailQuery } from "../../utils/queryObjects";

import "./ListsRow.css"

export default function ListsRow({ list, open }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const sampleTrailId =  list.trails.length ? list.trails[0].id : "";
    const sampleTrail = useSelector(state => state.trails[`ListsRow-${sampleTrailId}`]);
    const [imgSrc, setImgSrc] = useState("https://cdn-assets.alltrails.com/assets/placeholder/list_placeholder.svg");
    const [errors, setErrors] = useState("");

    const handleDelete = async (e) => {
        const data = await dispatch(removeList(list.id));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    useEffect(() => {
        if (list.trails.length > 0) {
            dispatch(getTrailById(
                sampleTrailId,
                trailQuery({ getPhotos: true }),
                `ListsRow-${sampleTrailId}`
            ));
        }
        return () => {
            dispatch(clearTrails(`ListsRow-${sampleTrailId}`));
        }
    }, [dispatch])

    useEffect(() => {
        if (!sampleTrail) return;
        setImgSrc(sampleTrail.photos[0].url.replace("extra_", ""));
    }, [sampleTrail])

    return (
        <div className="lists-row">
            <div className="lists-row__img-container">
                <img src={imgSrc} />
            </div>
            <div>
                <div className="lists-row__name">{list.name}</div>
                <div>{user && user.username}</div>
                <div className="lists-row__blurb">{list.blurb}</div>
            </div>
            <div>
                <div className="lists-row__stats">Stats:</div>
                <div>Trails: {list.trails.length}</div>
                <div>Photos: 0</div>
            </div>
            <div>
                <button onClick={() => open(list)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}
