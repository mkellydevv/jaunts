
const ADD_REVIEW = "reviews/ADD_REVIEW";
const ADD_REVIEWS = "reviews/ADD_REVIEWS";
const CLEAR_REVIEWS = "trails/CLEAR_REVIEWS";

const _addReview = payload => ({
    type: ADD_REVIEW,
    payload
})

const _addReviews = payload => ({
    type: ADD_REVIEWS,
    payload
})

const _clearReviews = () => ({
    type: CLEAR_REVIEWS
})

export const createReview = (query, payload) => async (dispatch) => {
    let url = `/api/reviews?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok)
        dispatch(_addReview(data));
    return data;
}

export const updateReview = (id, query, payload) => async (dispatch) => {
    let url = `/api/reviews/${id}?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok)
        dispatch(_addReview(data));
    return data;
}

export const getReviewsByTrailId = query => async (dispatch) => {
    let url = `/api/reviews?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_addReviews(data));
    }
}

export const clearReviews = () => async (dispatch) => {
    dispatch(_clearReviews());
}

const initialState = {};

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case ADD_REVIEW:
            newState[action.payload.id] = action.payload;
            return newState;
        case ADD_REVIEWS:
            for (let review of action.payload.reviews)
                newState[review.id] = review;
            return newState;
        case CLEAR_REVIEWS:
            return initialState;
        default:
            return state;
    }
}
