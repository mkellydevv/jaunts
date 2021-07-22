import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_JAUNTS = "jaunts/STORE_JAUNTS";
const STORE_JAUNT = "jaunts/STORE_JAUNT";
const REMOVE_JAUNTS = "jaunts/REMOVE_JAUNTS";
const REMOVE_JAUNT = "jaunts/REMOVE_JAUNT";

const storeJaunts = (payload, key, keyId) => ({
    type: STORE_JAUNTS,
    payload,
    key,
    keyId
});

const storeJaunt = (payload, key, keyId) => ({
    type: STORE_JAUNT,
    payload,
    key,
    keyId
});

const removeJaunts = (key) => ({
    type: REMOVE_JAUNTS,
    key
});

const removeJaunt = (payload, key, keyId) => ({
    type: REMOVE_JAUNT,
    payload,
    key,
    keyId
});

export const getJaunts = (query={}, key, keyId) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/jaunts`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeJaunts(data, key, keyId));
    }
};

export const getJaunt = (id, query={}, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/jaunts/${id}`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeJaunt(data, key));
    }
};

export const createJaunt = (payload, query={}, key, keyId) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/jaunts`);
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeJaunt(data, key, keyId));
        return {};
    }
    return data;
};

export const editJaunt = (id, query={}, payload, key, keyId) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/jaunts/${id}`);
    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        for (let jaunt of data['jaunts'])
            dispatch(storeJaunt(jaunt, key, keyId));
        return {};
    }
    return data;
}

export const deleteJaunt = (id, key, keyId) => async (dispatch) => {
    const res = await fetch(`/api/jaunts/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
        dispatch(removeJaunt(data, key, keyId));
        return {};
    }
    return data;
};

export const clearJaunts = (key) => async (dispatch) => {
    dispatch(removeJaunts(key));
};

const initialState = {};

export default function reducer(state=initialState, {type, payload, key="default", keyId="id"}) {
    const newState = { ...state };
    switch (type) {
        case STORE_JAUNTS:
            newState[key] = {};
            for (let item of payload.jaunts)
                newState[key][item[keyId]] = item;
            return newState;
        case STORE_JAUNT:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload[keyId]] = payload;
            return newState;
        case REMOVE_JAUNTS:
            if (key === "default")
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_JAUNT:
            delete newState[key][payload[keyId]];
            return newState;
        default:
            return state;
    }
}
