import React, { useEffect, useState } from 'react'


import "./ViewPhotoModal.css"

export default function ViewPhotoModal({ photos, photoId, close }) {
    const photosArr = Object.values(photos);
    const [idx, setIdx] = useState(null);

    const decrementIdx = e => {
        e.stopPropagation();
        if (idx > 0)
            setIdx(prev => Number(prev) - 1);
    };

    const incrementIdx = e => {
        e.stopPropagation();
        if (idx < photosArr.length - 1)
            setIdx(prev => Number(prev) + 1);
    };

    useEffect(() => {
        for (let i in photosArr) {
            if (photosArr[i].id === photoId)
                setIdx(Number(i));
        }
    }, []);

    return (
        <div className="modal">
            <div className="modal__overlay" />
            <div className="view-photo-modal__container" onClick={close}>
                <div className="view-photo-modal__content">
                    <button className="view-photo-modal__btn" onClick={decrementIdx}>
                        <i className="fas fa-angle-left" />
                    </button>
                    <div className="view-photo-modal__details">
                        {photosArr.length > 0 && idx !== null &&
                            <img className="view-photo-modal__img" src={photosArr[idx].url} />
                        }
                    </div>
                    <button className="view-photo-modal__btn" onClick={incrementIdx}>
                        <i className="fas fa-angle-right" />
                    </button>
                </div>
            </div>
        </div>
    )
}
