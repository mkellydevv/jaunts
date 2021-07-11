export function listQuery(args={}) {
    const query ={
        fromUserId: "",
        offset: 0,
        limit: 10,
        getListsTrails: "",
        getTrails: "",
        getUser: ""
    }
    for (let key in args)
        query[key] = args[key];
    return query;
}

export function trailQuery(args={}) {
    const query = {
        fromListId: "",
        searchTerm: "",
        searchCategories: ["name"],
        searchTags: [],
        offset: 0,
        limit: 10,
        getReviews: "",
        getPhotos: "",
        getTags: "",
        getUser: "",
    };
    for (let key in args)
        query[key] = args[key];
    return query;
}


export function reviewQuery(args={}) {
    const query = {
        fromTrailId: null,
        offset: 0,
        limit: 10,
        getUser: "",
    }
    for (let key in args)
        query[key] = args[key];
    return query;
}
