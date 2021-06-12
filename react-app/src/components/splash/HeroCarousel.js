import React, { useEffect, useRef, useState } from "react";

import "./HeroCarousel.css";

export default function HeroCarousel() {
    const url = "https://cdn-assets.alltrails.com/assets/images/homepage/hero-images/us/logged-in-";
    const idx = useRef(1);
    const [heroUrl, setHeroUrl] = useState(url + idx.current + '.jpg');

    useEffect(() => {
        const rotateInterval = setInterval(() => {
            idx.current++;
            if (idx.current > 4)
                idx.current = 1;
            setHeroUrl(url + idx.current + `.jpg`)
        }, 10*1000)

        return (() => {
            clearInterval(rotateInterval);
        })
    }, [heroUrl]);

    return (
        <div className="hero-carousel">
            <img className="hero-carousel__img" src={heroUrl} />
        </div>
    )
}
