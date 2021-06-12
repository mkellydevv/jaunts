
const ADD_JAUNT = "jaunts/ADD_JAUNT";

const _addJaunt = payload => ({
    type: ADD_JAUNT,
    payload
})

export const createJaunt = payload => async (dispatch) => {
    const res = await fetch(`/api/jaunts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok)
        dispatch(_addJaunt(data));
    return data;
}

const initialState = {};

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case ADD_JAUNT:
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return state;
    }
}
