import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_REVIEWS = "reviews/STORE_REVIEWS";
const STORE_REVIEW = "reviews/STORE_REVIEW";
const REMOVE_REVIEWS = "reviews/REMOVE_REVIEWS";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";

const storeReviews = payload => ({
    type: STORE_REVIEWS,
    payload
});

const storeReview = payload => ({
    type: STORE_REVIEW,
    payload
});

const removeReviews = () => ({
    type: REMOVE_REVIEWS
});

const removeReview = payload => ({
    type: REMOVE_REVIEW,
    payload
});

export const getReviews = (query) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/reviews`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeReviews(data));
    }
};

export const createReview = (query, payload) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/reviews`);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeReview(data));
        return {};
    }
    return data;
};

export const editReview = (id, query, payload) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/reviews/${id}`);
    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeReview(data));
        return {};
    }
    return data;
};

export const deleteReview = (id) => async (dispatch) => {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
        dispatch(removeReview(id));
        return {};
    }
    return data;
};

export const clearReviews = () => async (dispatch) => {
    dispatch(removeReviews());
};

const initialState = {};

export default function reducer(state=initialState, { type, payload }) {
    const newState = { ...state };
    switch (type) {
        case STORE_REVIEW:
            newState[payload.id] = payload;
            return newState;
        case STORE_REVIEWS:
            for (let review of payload.reviews)
                newState[review.id] = review;
            return newState;
        case REMOVE_REVIEWS:
            return initialState;
        case REMOVE_REVIEW:
            delete newState[payload];
            return newState;
        default:
            return state;
    }
}
