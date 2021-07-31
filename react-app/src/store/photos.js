import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_PHOTOS = "photos/STORE_PHOTOS";
const STORE_PHOTO = "photos/STORE_PHOTO";
const REMOVE_PHOTOS = "photos/REMOVE_PHOTOS";
const REMOVE_PHOTO = "photos/REMOVE_PHOTO";

const storePhotos = (payload, key) => ({
    type: STORE_PHOTOS,
    payload,
    key
});

const storePhoto = (payload, key) => ({
    type: STORE_PHOTO,
    payload,
    key
});

const removePhotos = (key) => ({
    type: REMOVE_PHOTOS,
    key
});

const removePhoto = (payload, key) => ({
    type: REMOVE_PHOTOS,
    payload,
    key
});

export const getPhotos = (query, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/photos`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storePhotos(data, key));
    }
};

export const uploadPhoto = (photo, query, payload) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/photos`);
    const formData = new FormData();
    formData.append("photo", photo);
    for (let key in payload) {
        formData.append(key, payload[key]);
    }

    const res = await fetch(url, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    if (res.ok) {
        console.log("OKAY");
        return {};
    }
    return data;
};

export const clearPhotos = (key) => async (dispatch) => {
    dispatch(removePhotos(key));
};

const initialState = {};

export default function reducer(state=initialState, { type, payload, key="default" }) {
    const newState = { ...state };
    switch (type) {
        case STORE_PHOTOS:
            newState[key] = {};
            for (let item of payload.photos)
                newState[key][item.id] = item;
            // Note: The photo reducer would have to be rewritten to handle storing
            // more than just photos. This is a quick fix.
            newState[key]['totalCount'] = payload.totalCount;
            return newState;
        case STORE_PHOTO:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload.id] = payload;
            return newState;
        case REMOVE_PHOTOS:
            if (key === "default")
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_PHOTO:
            delete newState[key][payload.id];
            return newState;
        default:
            return state;
    }
}
