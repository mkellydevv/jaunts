import { appendQueryArgs } from "../utils/helperFuncs";

const GET_LISTS = "lists/GET_LISTS";
const GET_LIST = "lists/GET_LIST";
const REMOVE_LIST = "lists/REMOVE_LIST";
const CLEAR_LISTS = "lists/CLEAR_LISTS";

const _getLists = (payload, key="default") => ({
    type: GET_LISTS,
    payload,
    key
})

const _getList = (payload, key="default") => ({
    type: GET_LIST,
    payload,
    key
})

const _clearLists = (key="default") => ({
    type: CLEAR_LISTS,
    key
})

const _removeList = (payload, key="default") => ({
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
        dispatch(_getList(data, "owned"));
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
        dispatch(_getList(data, "owned"));
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
        dispatch(_getLists(data, key));
    }
}

export const getListById = (id, query={}, key) => async (dispatch) => {
    let url = `/api/lists/${id}?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_getList(data, key));
    }
}

export const createList = (query, payload, key="default") => async (dispatch) => {
    let url = `/api/lists?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok)
        dispatch(_getList(data, key));
    return data;
}

export const updateList = (id, query, payload, key) => async (dispatch) => {
    let url = `/api/lists/${id}?`;

    for (let prop in query)
        url += `${prop}=${query[prop]}&`;

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok)
        dispatch(_getList(data, key));
    return data;
}

export const removeList = (id, key) => async (dispatch) => {
    const res = await fetch(`/api/lists/${id}`, { method: 'DELETE' });

    const data = await res.json();

    if (res.ok)
        dispatch(_removeList(id, key));
    return data;
}

export const clearLists = (key) => async (dispatch) => {
    dispatch(_clearLists(key));
}

const initialState = {};
const KEYS = new Set(["current", "owned"]);

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case GET_LISTS:
            if (newState[action.key] === undefined || KEYS.has(action.key))
                newState[action.key] = {};
            for (let list of action.payload.lists)
                newState[action.key][list.id] = list;
            return newState;
        case GET_LIST:
            if (newState[action.key] === undefined)
                newState[action.key] = {};
            newState[action.key][action.payload.id] = action.payload;
            return newState;
        case REMOVE_LIST:
            delete newState[action.key][action.payload];
            return newState;
        case CLEAR_LISTS:
            delete newState[action.key];
            return newState;
        default:
            return state;
    }
}
