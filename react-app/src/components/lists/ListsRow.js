import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearTrails, getTrailById } from "../../store/trails";
import { removeList } from "../../store/lists";
import { trailQuery } from "../../utils/queryObjects";

import "./ListsRow.css"

export default function ListsRow({ list, open }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector(state => state.session);
    const jauntsArr = Object.values(list.jaunts);
    const sampleTrailId =  jauntsArr.length ? jauntsArr[0].trail_id : "";
    const sampleTrail = useSelector(state => state.trails[`list-${list.id}`]);
    const [imgSrc, setImgSrc] = useState("https://cdn-assets.alltrails.com/assets/placeholder/list_placeholder.svg");
    const [errors, setErrors] = useState("");

    const handleClick = () => {
        history.push(`/lists/${list.id}`);
    }

    const handleEdit = () => {
        open(list);
    }

    const handleDelete = async (e) => {
        const data = await dispatch(removeList(list.id));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    useEffect(() => {
        if (jauntsArr.length > 0) {
            dispatch(getTrailById(
                sampleTrailId,
                trailQuery({ getPhotos: true }),
                `list-${list.id}`
            ));
        }
        return () => {
            dispatch(clearTrails(`list-${list.id}`));
        }
    }, [dispatch])

    useEffect(() => {
        if (!sampleTrail) return;
        setImgSrc(Object.values(sampleTrail)[0].photos[0].url.replace("extra_", ""));
    }, [sampleTrail])

    return (
        <div className="lists-row">
            <div
                className="lists-row__img-container"
                onClick={handleClick}
            >
                <img src={imgSrc} />
            </div>
            <div
                className="lists-row__info"
                onClick={handleClick}
            >
                <div className="lists-row__name">{list.name}</div>
                <div>{user && user.username}</div>
                <div className="lists-row__blurb">{list.blurb}</div>
            </div>
            <div>
                <div className="lists-row__stats">Stats:</div>
                <div>Trails: {jauntsArr.length}</div>
                <div>Photos: 0</div>
            </div>
            <div>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}
