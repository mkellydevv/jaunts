
const GET_TRAILS = "trails/GET_TRAILS"

const _getTrails = payload => ({
    type: GET_TRAILS,
    payload
})

export const getTrails = (query={}) => async (dispatch) => {
    let url = `/api/trails?`;

    for (let key in query) {
        url += `${key}=${query[key]}&`
    }

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();

        dispatch(_getTrails(data));
    }
}

const initialState = {}

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case GET_TRAILS:
            const obj = {}
            for (let trail of action.payload["trails"])
                obj[trail.id] = trail
            return obj;
        default:
            return state;
    }
}
