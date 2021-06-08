export function trailQuery(args={}) {
    const query = {
        searchTerm: "",
        searchTags: [],
        limit: 10,
        getUser: "",
        getTags: "",
    }
    for (let key in args)
        query[key] = args[key]
    return query;
}
