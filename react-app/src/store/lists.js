import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_LISTS = "lists/STORE_LISTS";
const STORE_LIST = "lists/STORE_LIST";
const REMOVE_LISTS = "lists/REMOVE_LISTS";
const REMOVE_LIST = "lists/REMOVE_LIST";

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

const removeLists = (key) => ({
    type: REMOVE_LISTS,
    key
})

const removeList = (payload, key) => ({
    type: REMOVE_LIST,
    payload,
    key
})

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

export const editList = (id, query, payload, key) => async (dispatch) => {
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

export const deleteList = (id, key) => async (dispatch) => {
    const res = await fetch(`/api/lists/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
        dispatch(removeList(id, key));
        return {};
    }
    else
        return data;
}

export const clearLists = (key) => async (dispatch) => {
    dispatch(removeLists(key));
}

const initialState = {};

export default function reducer(state=initialState, { type, payload, key="default" }) {
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
        case REMOVE_LISTS:
            if (key === undefined)
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_LIST:
            delete newState[key][payload];
            return newState;
        default:
            return state;
    }
}
