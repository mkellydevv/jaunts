import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPhoto } from "../../store/photos";
import { photoQuery } from "../../utils/queryObjects";

export default function PhotoUpload({ trail }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const [photo, setPhoto] = useState(null);
    const [_private, setPrivate] = useState(false);
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            "trail_id": trail.id,
            "user_id": user.id,
            "private": _private,
            "photo": photo
        };

        const query = photoQuery({
            fromTrailId: trail.id
        });

        const data = await dispatch(uploadPhoto(photo, query, payload));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files[0])}
            />

            <button type="submit">Submit</button>
        </form>
    )
}
