import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_LISTS = "lists/STORE_LISTS";
const STORE_LIST = "lists/STORE_LIST";
const REMOVE_LIST = "lists/REMOVE_LIST";
const CLEAR_LISTS = "lists/CLEAR_LISTS";

const storeLists = (payload, key) => ({
    type: STORE_LISTS,
    payload,
    key
})

const storeList = (payload, key) => ({
    type: STORE_LIST,
    payload,
    key
})

const _clearLists = (key) => ({
    type: CLEAR_LISTS,
    key
})

const _removeList = (payload, key) => ({
    type: REMOVE_LIST,
    payload,
    key
})

export const addTrailToList = (query={}, payload) => async (dispatch) => {
    let url = `/api/lists/${payload.listId}?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        dispatch(storeList(data, "owned"));
    }
    else {
        console.log("Errors:", res, data);
    }
}

export const deleteTrailFromList = (query={}, listId, trailId) => async (dispatch) => {
    let url = `/api/lists/${listId}/trails/${trailId}?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url, { method: "DELETE" });

    const data = await res.json();

    if (res.ok) {
        dispatch(storeList(data, "owned"));
    }
    else {
        console.log("Errors:", res, data);
    }
}

export const getLists = (query={}, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/lists`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeLists(data, key));
    }
}

export const getListById = (id, query={}, key) => async (dispatch) => {
    let url = `/api/lists/${id}?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeList(data, key));
    }
}

export const createList = (query, payload, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/lists`);
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok)
        dispatch(storeList(data, key));
    return data;
}

export const updateList = (id, query, payload, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/lists/${id}`);
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        console.log(data,key)
        dispatch(storeList(data, key));
        return {};
    }
    else
        return data;
}

export const removeList = (id, key) => async (dispatch) => {
    const res = await fetch(`/api/lists/${id}`, { method: 'DELETE' });

    const data = await res.json();

    if (res.ok) {
        dispatch(_removeList(id, key));
        return {};
    }
    else
        return data;
}

export const clearLists = (key) => async (dispatch) => {
    dispatch(_clearLists(key));
}

const initialState = {};

export default function reducer(state=initialState, { type, payload, key }) {
    const newState = { ...state };
    switch (type) {
        case STORE_LISTS:
            newState[key] = {};
            for (let list of payload.lists)
                newState[key][list.id] = list;
            return newState;
        case STORE_LIST:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload.id] = payload;
            return newState;
        case REMOVE_LIST:
            delete newState[key][payload];
            return newState;
        case CLEAR_LISTS:
            delete newState[key];
            return newState;
        default:
            return state;
    }
}
