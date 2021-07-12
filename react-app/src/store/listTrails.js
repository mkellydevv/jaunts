import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_LIST_TRAILS = "listTrails/STORE_LIST_TRAILS";
const STORE_LIST_TRAIL = "listTrails/STORE_LIST_TRAIL";
const REMOVE_LIST_TRAILS = "listTrails/REMOVE_LIST_TRAILS";
const REMOVE_LIST_TRAIL = "listTrails/REMOVE_LIST_TRAIL";

const storeListTrails = (payload, key, keyId) => ({
    type: STORE_LIST_TRAILS,
    payload,
    key,
    keyId
});

const storeListTrail = (payload, key, keyId) => ({
    type: STORE_LIST_TRAIL,
    payload,
    key,
    keyId
});

const removeListTrails = (key) => ({
    type: REMOVE_LIST_TRAILS,
    key
});

const removeListTrail = (payload, key, keyId) => ({
    type: REMOVE_LIST_TRAIL,
    payload,
    key,
    keyId
});

export const getListTrails = (query={}, key, keyId) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/listTrails`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeListTrails(data, key, keyId));
    }
}

export const getListTrail = (id, query={}, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/listTrails/${id}`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeListTrail(data, key));
    }
}

export const createListTrail = (payload, query={}, key, keyId) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/listTrails`);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeListTrail(data, key, keyId));
    }
    else {
        return data;
    }
}

export const deleteListTrail = (id, key, keyId) => async (dispatch) => {
    const res = await fetch(`/api/listTrails/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
        dispatch(removeListTrail(data, key, keyId));
    }
    else {
        return data;
    }
};

export const clearListTrails = (key) => async (dispatch) => {
    dispatch(removeListTrails(key));
};

const initialState = {};

export default function reducer(state=initialState, {type, payload, key, keyId="id"}) {
    const newState = { ...state };
    switch (type) {
        case STORE_LIST_TRAILS:
            newState[key] = {};
            for (let item of payload.list_trails)
                newState[key][item[keyId]] = item;
            return newState;
        case STORE_LIST_TRAIL:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload[keyId]] = payload;
            return newState;
        case REMOVE_LIST_TRAILS:
            if (key === undefined)
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_LIST_TRAIL:
            delete newState[key][payload[keyId]];
            return newState;
        default:
            return state;
    }
}
