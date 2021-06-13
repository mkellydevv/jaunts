
const ADD_LIST = "lists/ADD_LIST";
const CLEAR_LISTS = "lists/CLEAR_LISTS";

const _addList = (payload) => ({
    type: ADD_LIST,
    payload
})

const _clearLists = () => ({
    type: CLEAR_LISTS
})

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

export const clearLists = () => async (dispatch) => {
    dispatch(_clearLists());
}

const initialState = {};

export default function reducer(state=initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case ADD_LIST:
            newState[action.payload.id] = action.payload;
            return newState;
        case CLEAR_LISTS:
            return initialState;
        default:
            return state;
    }
}
