import React from 'react';

import "./PhotoCard.css";

export default function PhotoCard({ photo, open }) {

    return (
        <div className="photo__container" onClick={() => open(photo.id)}>
            <img className="photo__img" src={photo.url.replace("extra_", "")} />
        </div>
    )
}
