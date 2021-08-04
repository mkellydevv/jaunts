import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_USERS = "users/STORE_USERS";
const STORE_USER = "users/STORE_USER";
const REMOVE_USERS = "users/REMOVE_USERS";
const REMOVE_USER = "users/REMOVE_USER";

const storeUsers = (payload, key) => ({
    type: STORE_USERS,
    payload,
    key
});

const storeUser = (payload, key) => ({
    type: STORE_USER,
    payload,
    key
});

const removeUsers = (key) => ({
    type: REMOVE_USERS,
    key
});

const removeUser = (payload, key) => ({
    type: REMOVE_USER,
    payload,
    key
});

export const getUser = (id, query, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/users/${id}`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeUser(data, key));
    }
}

export const markTrailComplete = (userId, query, payload, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/users/${userId}/trails`);
    const res = await fetch(url, {
        method: 'POST',
        body: payload
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeUser(data, key));
        return {};
    }
    return data;
}

export const markTrailIncomplete = (userId, trailId, query, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/users/${userId}/trails/${trailId}`);
    const res = await fetch(url, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeUser(data, key));
        return {};
    }
    return data;
}

const initialState = {};

export default function reducer(state=initialState, { type, payload, key="default" }) {
    const newState = { ...state };
    switch (type) {
        case STORE_USERS:
            newState[key] = {};
            for (let item of payload.users)
                newState[key][item.id] = item;
            return newState;
        case STORE_USER:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload.id] = payload;
            return newState;
        case REMOVE_USERS:
            if (key === "default")
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_USER:
            delete newState[key][payload];
            return newState;
        default:
            return state;
    }
}
