export function listQuery(args={}) {
    const query ={
        fromUserId: "",
        offset: 0,
        limit: 25,
        getJaunts: "",
        getPhotos: "",
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
        limit: 25,
        getJaunts: "",
        getLists: "",
        getPhotos: "",
        getReviews: "",
        getTags: "",
        getUser: "",
    };
    for (let key in args)
        query[key] = args[key];
    return query;
}

export function jauntQuery(args={}) {
    const query = {
        fromListId: "",
        fromTrailId: "",
        offset: 0,
        limit: 25,
        getList: "",
        getTrail: "",
    }
    for (let key in args)
        query[key] = args[key];
    return query;
}

export function reviewQuery(args={}) {
    const query = {
        fromTrailId: null,
        offset: 0,
        limit: 25,
        getUser: "",
    }
    for (let key in args)
        query[key] = args[key];
    return query;
}
