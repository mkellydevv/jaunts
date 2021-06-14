
const ADD_LISTS = "reviews/ADD_LISTS";
const ADD_LIST = "lists/ADD_LIST";
const REMOVE_LIST = "trails/REMOVE_LIST";
const CLEAR_LISTS = "lists/CLEAR_LISTS";

const _addList = (payload) => ({
    type: ADD_LIST,
    payload
})

const _addLists = (payload) => ({
    type: ADD_LISTS,
    payload
})

const _clearLists = () => ({
    type: CLEAR_LISTS
})

const _removeList = payload => ({
    type: REMOVE_LIST,
    payload
})

export const getLists = (query={}) => async (dispatch) => {
    let url = `/api/lists?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_addLists(data));
    }
}

export const getListById = (id, query={}) => async (dispatch) => {
    let url = `/api/lists/${id}?`;

    for (let key in query)
        url += `${key}=${query[key]}&`;

    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(_addList(data));
    }
}

export const removeList = (id) => async (dispatch) => {
    const res = await fetch(`/api/lists/${id}`, { method: 'DELETE' });

    const data = await res.json();

    if (res.ok)
        dispatch(_removeList(id));
    return data;
}

export const clearLists = () => async (dispatch) => {
    dispatch(_clearLists());
}

const initialState = {};

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case ADD_LISTS:
            for (let list of action.payload.lists)
                newState[list.id] = list;
            return newState;
        case ADD_LIST:
            newState[action.payload.id] = action.payload;
            return newState;
        case REMOVE_LIST:
            delete newState[action.payload];
            return newState;
        case CLEAR_LISTS:
            return initialState;
        default:
            return state;
    }
}
