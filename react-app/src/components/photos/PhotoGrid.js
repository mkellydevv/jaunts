import React, { useEffect } from "react";

import PhotoCard from "./PhotoCard";

import "./PhotoGrid.css"

export default function PhotoGrid({ trail, open }) {

    return (
        <div className="photo-grid">
            {Object.values(trail.photos).map(photo => {
                return (
                    <PhotoCard photo={photo} open={open} keyname={`PhotoCard-${photo.id}`} />
                )
            })}
        </div>
    )
}
