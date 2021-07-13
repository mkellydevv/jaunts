
const GET_TRAILS = "trails/GET_TRAILS";
const GET_TRAIL = "trails/GET_TRAIL";
const CLEAR_TRAILS = "trails/CLEAR_TRAILS";

const _getTrails = (payload, key='default') => ({
    type: GET_TRAILS,
    payload,
    key
})

const _getTrail = (payload, key="default") => ({
    type: GET_TRAIL,
    payload,
    key
})

const _clearTrails = (key='default') => ({
    type: CLEAR_TRAILS,
    key
})

export const getTrails = (query={}, key) => async (dispatch) => {
    let url = `/api/trails?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_getTrails(data, key));
    }
}

export const getTrailById = (id, query={}, key="current") => async (dispatch) => {
    let url = `/api/trails/${id}?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_getTrail(data, key));
    }
}

export const clearTrails = (key) => async (dispatch) => {
    dispatch(_clearTrails(key));
}

const initialState = {};
const STATE_KEYS = new Set(["search", "nearby", "trailPhoto"])

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case GET_TRAILS:
            // Clear old data if action.key in STATE_KEYS
            if (newState[action.key] === undefined || STATE_KEYS.has(action.key))
                newState[action.key] = {};
            for (let trail of action.payload.trails)
                newState[action.key][trail.id] = trail;
            return newState;
        case GET_TRAIL:
            if (newState[action.key] === undefined)
                newState[action.key] = {};
            newState[action.key][action.payload.id] = action.payload;
            return newState;
        case CLEAR_TRAILS:
            delete newState[action.key];
            return newState;
        default:
            return state;
    }
}
