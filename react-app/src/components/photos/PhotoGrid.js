import React, { useEffect } from "react";

import PhotoCard from "./PhotoCard";

import "./PhotoGrid.css";

export default function PhotoGrid({ photosArr, open }) {

    return (
        <div className="photo-grid">
            {photosArr.map(photo => {
                return (
                    <PhotoCard photo={photo} open={open} keyname={`PhotoCard-${photo.id}`} />
                )
            })}
        </div>
    )
}
