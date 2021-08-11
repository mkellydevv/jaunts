import { appendQueryArgs } from "../utils/helperFuncs";

const STORE_ROUTES = "routes/STORE_ROUTES";
const STORE_ROUTE = "routes/STORE_ROUTE";
const REMOVE_ROUTES = "routes/REMOVE_ROUTES";
const REMOVE_ROUTE = "routes/REMOVE_ROUTE";

const storeRoutes = (payload, key) => ({
    type: STORE_ROUTES,
    payload,
    key
});

const storeRoute = (payload, key) => ({
    type: STORE_ROUTE,
    payload,
    key
});

const removeRoutes = (key) => ({
    type: REMOVE_ROUTES,
    key
});

const removeRoute = (payload, key) => ({
    type: REMOVE_ROUTE,
    payload,
    key
});

export const getRoutes = (query={}, key) => async (dispatch) => {
    const url = appendQueryArgs(query, `/api/routes`);
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        dispatch(storeRoutes(data, key));
    }
};

export const clearRoutes = (key) => async (dispatch) => {
    dispatch(removeRoutes(key));
};

const initialState = {};

export default function reducer(state=initialState, { type, payload, key="default" }) {
    const newState = { ...state };
    switch (type) {
        case STORE_ROUTES:
            newState[key] = {};
            for (let item of payload.routes)
                newState[key][item.id] = item;
            return newState;
        case STORE_ROUTE:
            if (newState[key] === undefined)
                newState[key] = {};
            newState[key][payload.id] = payload;
            return newState;
        case REMOVE_ROUTES:
            if (key === "default")
                return initialState;
            delete newState[key];
            return newState;
        case REMOVE_ROUTE:
            delete newState[key][payload.id];
            return newState;
        default:
            return state;
    }
}
