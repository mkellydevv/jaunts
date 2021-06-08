import React from "react";

export default function TrailCard({ trail }) {
    console.log(`trail`, trail)

    return (
        <div>
            <div>Trail Card</div>
            <div>
                <div>{trail.name}</div>
                <div>{trail.region}</div>
                <div>{trail.difficulty}</div>
                <div>{trail.default_rating}</div>
                <div>{trail.default_weighting}</div>
                <div>
                    <span>Length: {trail.distance} mi</span>
                    <span> &#8226; </span>
                    <span>Est. {trail.duration_hours} h {trail.duration_minutes} m</span>
                </div>
            </div>
        </div>
    )
}
