
const GET_TRAILS = "trails/GET_TRAILS"

const _getTrails = (payload, stateKey='default') => ({
    type: GET_TRAILS,
    payload,
    stateKey
})

export const getTrails = (query={}, stateKey) => async (dispatch) => {
    let url = `/api/trails?`;

    for (let key in query)
        url += `${key}=${query[key]}&`

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_getTrails(data, stateKey));
    }
}

const initialState = {};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case GET_TRAILS:
            const newState = { ...state };
            if (newState[action.stateKey] === undefined || action.stateKey === "search")
                newState[action.stateKey] = {};
            for (let trail of action.payload["trails"])
                newState[action.stateKey][trail.id] = trail;
            return newState;
        default:
            return state;
    }
}
