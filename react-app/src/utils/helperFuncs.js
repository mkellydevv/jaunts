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

export const unpackCoordinates = (route) => {
    const coordinates = new Array(route.coordinates.length / 3);
    for (let i = 0; i < route.coordinates.length; i += 3) {
        coordinates[i / 3] = [route.coordinates[i + 1], route.coordinates[i]];
    }
    return coordinates;
}

export const unpackTrailHeads = (trailHeads) => {
    const features = [];
    for (let key in trailHeads) {
        const t = trailHeads[key];
        features.push({
            type: 'Feature',
            properties: {
                "id": t.id,
                "title": t.name,
            },
            geometry: {
                type: 'Point',
                coordinates: [t.lng, t.lat]
            }
        });
    }
    return features;
}
