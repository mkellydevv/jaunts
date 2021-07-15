const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const appendQueryArgs = (query, url) => {
    url += "?";
    for (let key in query)
        url += `${key}=${query[key]}&`;
    return url;
}

export const getDateString = (date) => {
    const d = new Date(date);
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
