import React, { useState, useEffect, useRef } from "react";

import "./StarRating.css";

export default function StarRating({ fixed, rating, setRating, handleEdit}) {
    const [hover, setHover] = useState(0);
    const dynamic = fixed ? "" : "dynamic";

    const highlight = (val) => {
        if (!fixed && hover > 0) {
            if (val <= hover)
                return "highlight";
        }
        else if (val <= rating)
            return "highlight";
        return "";
    }

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, i) => {
                const val = i + 1;

                return (
                    <div className="star-rating__star" key={`Star-${val}`}>
                        <i
                            value={val}
                            className={`fas fa-star ${dynamic} ${highlight(val)}`}
                            onClick={() => {
                                if (fixed) return;
                                setRating(val);
                                if (handleEdit)
                                    handleEdit(val);
                            }}
                            onMouseEnter={() => setHover(val)}
                            onMouseLeave={() => setHover(0)}
                        />
                    </div>
                )
            })}
        </div>
    )
}
