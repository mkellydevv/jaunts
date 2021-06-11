
const GET_TRAILS = "trails/GET_TRAILS"
const GET_TRAIL = "trails/GET_TRAIL"

const _getTrails = (payload, stateKey='default') => ({
    type: GET_TRAILS,
    payload,
    stateKey
})

const _getTrail = (payload) => ({
    type: GET_TRAIL,
    payload
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

const initialState = {};

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case GET_TRAILS:
            if (newState[action.stateKey] === undefined || action.stateKey === "search")
                newState[action.stateKey] = {};
            for (let trail of action.payload["trails"])
                newState[action.stateKey][trail.id] = trail;
            return newState;
        case GET_TRAIL:
            newState["current"] = action.payload;
            return newState;
        default:
            return state;
    }
}
