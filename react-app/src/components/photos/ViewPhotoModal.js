import React, { useEffect, useState } from 'react'


import "./ViewPhotoModal.css"

export default function ViewPhotoModal({ photos, photoId, close }) {
    const photosArr = Object.values(photos);
    const [idx, setIdx] = useState(null);

    const decrementIdx = () => {
        if (idx > 0)
            setIdx(prev => Number(prev) - 1);
    };

    const incrementIdx = () => {
        if (idx < photosArr.length - 1)
            setIdx(prev => {
                return Number(prev) + 1
            });
    };

    useEffect(() => {
        for (let i in photosArr) {
            if (photosArr[i].id === photoId)
                setIdx(Number(i));
        }
    }, []);

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={close} />
            <div className="view-photo-modal__content">
                {photosArr.length > 0 && idx !== null &&
                    <>
                        <button className="" onClick={decrementIdx}>
                            <i className="fas fa-arrow-left" />
                        </button>
                        <img className="view-photo-modal__img" src={photosArr[idx].url} />
                        <button className="" onClick={incrementIdx}>
                            <i className="fas fa-arrow-right" />
                        </button>
                    </>
                }
            </div>
        </div>
    )
}
