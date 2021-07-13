import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_TRAILS = "trails/STORE_TRAILS";
const STORE_TRAIL = "trails/STORE_TRAIL";
const REMOVE_TRAILS = "trails/REMOVE_TRAILS";
const REMOVE_TRAIL = "trails/REMOVE_TRAIL";

const storeTrails = (payload, key) => ({
    type: STORE_TRAILS,
    payload,
    key
});

const storeTrail = (payload, key) => ({
    type: STORE_TRAIL,
    payload,
    key
});

const removeTrails = (key) => ({
    type: REMOVE_TRAILS,
    key
});

const removeTrail = (payload, key) => ({
    type: REMOVE_TRAILS,
    payload,
    key
});

export const getTrails = (query={}, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/trails`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeTrails(data, key));
    }
};

export const getTrail = (id, query={}, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/trails/${id}`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeTrail(data, key));
    }
};

export const clearTrails = (key) => async (dispatch) => {
    dispatch(removeTrails(key));
};

const initialState = {};

export default function reducer(state=initialState, { type, payload, key="default" }) {
    const newState = { ...state };
    switch (type) {
        case STORE_TRAILS:
            newState[key] = {};
            for (let item of payload.trails)
                newState[key][item.id] = item;
            return newState;
        case STORE_TRAIL:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload.id] = payload;
            return newState;
        case REMOVE_TRAILS:
            if (key === "default")
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_TRAIL:
            delete newState[key][payload.id];
            return newState;
        default:
            return state;
    }
}
