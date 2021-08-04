import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import "./HeroCarousel.css";

const heroImages = [
    "https://cdn.discordapp.com/attachments/872289655310139403/872311624357249044/hero-1.jpg",
    "https://cdn.discordapp.com/attachments/872289655310139403/872311663418818610/hero-2.jpg",
    "https://cdn.discordapp.com/attachments/872289655310139403/872313036059344996/hero-3.jpg"
]

export default function HeroCarousel() {
    const idx = useRef(0);
    const [heroUrl, setHeroUrl] = useState(heroImages[idx.current]);
    const { user } = useSelector(state => state.session);

    useEffect(() => {
        const rotateInterval = setInterval(() => {
            idx.current++;
            if (idx.current > 2)
                idx.current = 0;
            setHeroUrl(heroImages[idx.current]);
        }, 10*1000);

        return (() => {
            clearInterval(rotateInterval);
        })
    }, [heroUrl]);

    return (
        <div className="hero-carousel">
            <img className="hero-carousel__img" src={heroUrl} />
            <h1>Welcome{user && `, ${user.username}`}</h1>
        </div>
    )
}

// export default function HeroCarousel() {
//     const url = "https://cdn-assets.alltrails.com/assets/images/homepage/hero-images/us/logged-in-";
//     const idx = useRef(1);
//     const [heroUrl, setHeroUrl] = useState(url + idx.current + '.jpg');
//     const { user } = useSelector(state => state.session);

//     useEffect(() => {
//         const rotateInterval = setInterval(() => {
//             idx.current++;
//             if (idx.current > 4)
//                 idx.current = 1;
//             setHeroUrl(url + idx.current + `.jpg`)
//         }, 10*1000)

//         return (() => {
//             clearInterval(rotateInterval);
//         })
//     }, [heroUrl]);

//     return (
//         <div className="hero-carousel">
//             <img className="hero-carousel__img" src={heroUrl} />
//             <h1>Welcome{user && `, ${user.username}`}</h1>
//         </div>
//     )
// }
