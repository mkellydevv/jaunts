
const ADD_REVIEW = "reviews/ADD_REVIEW";

const _addReview = payload => ({
    type: ADD_REVIEW,
    payload
})

export const createReview = payload => async (dispatch) => {
    const res = await fetch(`/api/reviews`, {
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

const initialState = {};

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case ADD_REVIEW:
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return state;
    }
}
