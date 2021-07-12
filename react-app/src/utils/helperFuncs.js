export const appendQueryArgs = (query, url) => {
    url += "?";
    for (let key in query)
        url += `${key}=${query[key]}&`;
    return url;
}
