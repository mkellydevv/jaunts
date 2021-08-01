import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPhoto } from "../../store/photos";
import { photoQuery } from "../../utils/queryObjects";

import "./PhotoUpload.css";

export default function PhotoUpload({ trail, jaunt }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const [photo, setPhoto] = useState(null);
    const [_private, setPrivate] = useState(false);
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            "list_id": jaunt.list_id,
            "trail_id": trail.id,
            "user_id": user.id,
            "private": _private,
            "photo": photo
        };

        const query = photoQuery({
            fromTrailId: trail.id
        });

        // TODO: Key should be passed to this component
        const data = await dispatch(uploadPhoto(query, payload, `all-trail-${trail.id}`));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }

        setPhoto(null);
    }

    return (
        <form className="photo-upload" onSubmit={handleSubmit}>
            {!photo && <label
                for={`photo-upload__input-${jaunt.id}`}
                className="photo-upload__label jaunts__btn-1"
            >
                <i class="fa fa-cloud-upload" />
                Upload
            </label>}
            {photo && <label
                for={`photo-upload__input-${jaunt.id}`}
                className="photo-upload__label jaunts__btn-1"
            >
                {photo.name.length > 8 ? "..." + photo.name.slice(-8) : photo.name}
            </label>}
            <input
                id={`photo-upload__input-${jaunt.id}`}
                className="photo-upload__input jaunts__btn-1"
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files[0])}
            />

            {photo && <button className="jaunts__btn-1" type="submit">Submit</button>}
        </form>
    )
}
