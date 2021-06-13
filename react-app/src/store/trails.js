
const GET_TRAILS = "trails/GET_TRAILS";
const GET_TRAIL = "trails/GET_TRAIL";
const CLEAR_TRAILS = "trails/CLEAR_TRAILS";

const _getTrails = (payload, stateKey='default') => ({
    type: GET_TRAILS,
    payload,
    stateKey
})

const _getTrail = (payload) => ({
    type: GET_TRAIL,
    payload
})

const _clearTrails = (stateKey='default') => ({
    type: CLEAR_TRAILS,
    stateKey
})

export const getTrails = (query={}, stateKey) => async (dispatch) => {
    let url = `/api/trails?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_getTrails(data, stateKey));
    }
}

export const getTrailById = (id, query={}) => async (dispatch) => {
    let url = `/api/trails/${id}?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_getTrail(data));
    }
}

export const clearTrails = (stateKey) => async (dispatch) => {
    dispatch(_clearTrails(stateKey));
}

const initialState = {};
const STATE_KEYS = new Set(["search", "nearby"])

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case GET_TRAILS:
            // Clear old data if action.stateKey in STATE_KEYS
            if (newState[action.stateKey] === undefined || STATE_KEYS.has(action.stateKey))
                newState[action.stateKey] = {};
            for (let trail of action.payload.trails)
                newState[action.stateKey][trail.id] = trail;
            return newState;
        case GET_TRAIL:
            newState["current"] = action.payload;
            return newState;
        case CLEAR_TRAILS:
            delete newState[action.stateKey];
            return newState;
        default:
            return state;
    }
}
