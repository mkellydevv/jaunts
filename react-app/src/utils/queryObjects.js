export function trailQuery(args={}) {
    const query = {
        searchTerm: "",
        searchTags: [],
        offset: 0,
        limit: 10,
        getJaunts: "",
        getPhotos: "",
        getTags: "",
        getUser: "",
    }
    for (let key in args)
        query[key] = args[key]
    return query;
}
