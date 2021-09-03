import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { getRoutes } from "../../store/routes";
import { getTrails } from "../../store/trails";
import { unpackCoordinates, unpackTrailHeads } from "../../utils/helperFuncs";
import { routeQuery, trailQuery } from "../../utils/queryObjects";

import markerImgGreen from "../../assets/green-2.png";
import markerImgBlue from "../../assets/blue-2.png";
import "./TrailMap.css";

mapboxgl.accessToken = 'pk.eyJ1IjoibWtlbGx5ZGV2diIsImEiOiJja3BmcXZuY3YwNzg0MnFtd3Rra3M3amI4In0.h8HRrZ2xGNP-aq7EwO0YVA';

export default function TrailMap({ trailId, showMarkers, options }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const debug = true;
    const { default: routes } = useSelector(state => state.routes);
    const route = routes ? Object.values(routes)[0] : null;
    const routeSource = useRef({
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }
    });
    const { trailHeads } = useSelector(state => state.routes);
    const markers = useRef({
        type: 'geojson',
        data: {
            type: "FeatureCollection",
            features: []
        }
    });
    const interval = useRef(null);

    // Mapbox specific
    const mapContainer = useRef(null);
    const map = useRef(null);
    const defaultPitch = 25;
    const defaultZoomRoute = 13;
    const defaultZoomMap = 6.5;
    const [loaded, setLoaded] = useState(false);
    const [lng, setLng] = useState(-78.5);
    const [lat, setLat] = useState(37);
    const [pitch, setPitch] = useState(defaultPitch);
    const [zoom, setZoom] = useState(trailId ? defaultZoomRoute : defaultZoomMap);

    const markersLayer = {
        'id': 'markersLayer',
        'type': 'symbol',
        'source': 'markersSource',
        'layout': {
            'icon-allow-overlap': true,
            'icon-anchor': "bottom",
            'icon-image': 'marker-green',
            'icon-size': .075,
            'text-field': ['get', 'title'],
            'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 1.25],
            'text-optional': true,
        }
    }

    const dispatchGetRoutes = (e) => {
        if (e && e.type === "moveend" && !e.eased) return;

        try {
            const bounds = map.current.getBounds();
            const nw = bounds.getNorthWest();
            const se = bounds.getSouthEast();
            const _routeQuery = routeQuery({
                nw: [nw.lat, nw.lng],
                se: [se.lat, se.lng],
                limit: 100,
            });
            dispatch(getRoutes(_routeQuery, "trailHeads"));
        }
        catch (e) {

        }
    }

    const dispatchGetTrails = (e) => {
        if (e && e.type === "moveend" && !e.eased) return;

        const bounds = map.current.getBounds();
        const nw = bounds.getNorthWest();
        const se = bounds.getSouthEast();

        const _trailQuery = trailQuery({
            nw: [nw.lat, nw.lng],
            se: [se.lat, se.lng],
            difficulty: ["moderate", "hard"],
            limit: 100,
            getPhotos: 1,
        });
        dispatch(getTrails(_trailQuery, "trailHeads"));
    }

    const dispatchGetRoutesTrails = (e) => {
        dispatchGetRoutes(e);
        dispatchGetTrails(e);
    }

    const handleInterval = (e) => {
        if (interval.current) return;
        interval.current = setInterval(dispatchGetRoutes, 500);
    }

    const handleIntervalEnd = (e) => {
        if (!interval.current) return;
        clearInterval(interval.current);
        interval.current = null;
    }

    const handleCurrentLocation = () => {
        map.current.easeTo({
            center: routeSource.current.data.geometry.coordinates[0],
            zoom: defaultZoomRoute,
            duration: 1500
        }, {"eased": true});
    }

    const handleZoomIn = () => {
        map.current.zoomIn({ duration: 1500 });
    }

    const handleZoomOut = () => {
        map.current.zoomOut({ duration: 1500 });
    }

    const handleResetCompass = () => {
        map.current.resetNorthPitch({ duration: 1500 });
    }

    useEffect(() => {
        if (map.current) return;

        if (route) {
            setLng(route.lng);
            setLat(route.lat);
        }

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            // style: 'mapbox://styles/mapbox/dark-v10',
            // style: 'mapbox://styles/mapbox/satellite-v9',
            center: [lng, lat],
            pitch: pitch,
            zoom: zoom,
        });

        const optionsEle = document.getElementsByClassName("trailMap__options")[0]
        optionsEle.addEventListener("wheel", (e) => {
            e.preventDefault();
            optionsEle.scrollLeft += e.deltaY;
        });

        map.current.on('load', (e) => {
            setLoaded(true);
            dispatchGetRoutesTrails(e);

            map.current.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            });
            map.current.setTerrain({
                'source': 'mapbox-dem',
                'exaggeration': 1.75,
            });
            map.current.addLayer({
                'id': 'sky',
                'type': 'sky',
                'paint': {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });

            map.current.on('move', () => {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setPitch(map.current.getPitch().toFixed(1));
                setZoom(map.current.getZoom().toFixed(2));
            });
            map.current.on("moveend", dispatchGetRoutesTrails);
            map.current.on("mouseup", dispatchGetRoutesTrails);
            map.current.on("zoomend", dispatchGetRoutesTrails);
            map.current.on("drag", handleInterval);
            map.current.on("dragend", handleIntervalEnd);
            map.current.on("pitch", handleInterval);
            map.current.on("pitchend", handleIntervalEnd);

            map.current.addSource('markersSource', markers.current);
            map.current.addSource('routeSource', routeSource.current);

            map.current.addLayer({
                id: 'routeLayer',
                type: 'line',
                source: 'routeSource',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#ee2222',
                    'line-width': 5
                }
            });

            map.current.on("click", "markersLayer", (e) => {
                history.push({
                    pathname: `/trails/${e.features[0].properties.id}`,
                    options: {}
                });
            });

            map.current.loadImage(
                markerImgGreen,
                (err, image) => {
                    if (err) return console.error(err);
                    map.current.addImage('marker-green', image);

                    map.current.addLayer(markersLayer);
                }
            );

            map.current.loadImage(
                markerImgBlue,
                (err, image) => {
                    if (err) return console.error(err);
                    map.current.addImage('marker-blue', image);

                    map.current.addLayer(markersLayer);
                }
            );
        });

        return () => {
            if (interval.current)
                clearInterval(interval.current);
        }
    }, [route]);

    useEffect(() => {
        if (!loaded || !route) return;

        routeSource.current.data.geometry.coordinates = unpackCoordinates(route);

        const src = map.current.getSource("routeSource");
        if (src)
            src.setData(routeSource.current.data);

        setZoom(defaultZoomRoute);

        map.current.easeTo({
            center: routeSource.current.data.geometry.coordinates[0],
            zoom: defaultZoomRoute,
            duration: 1500
        }, {"eased": true});

        return () => {};
    }, [loaded, route]);

    useEffect(() => {
        if (!loaded || !trailHeads) return;

        markers.current.data.features = unpackTrailHeads(trailHeads);

        const src = map.current.getSource("markersSource");
        if (src)
            src.setData(markers.current.data);

        return () => {};
    }, [trailHeads]);

    useEffect(() => {
        if (!loaded) return;
        if (showMarkers)
            map.current.addLayer(markersLayer);
        else
            map.current.removeLayer("markersLayer");
    }, [showMarkers]);

    return (
        <div
            className="trailMap"
        >
            <div className="trailMap__nav">

                <div className="trailMap__options">

                    <div className="trailMap__option">
                        <button className="jaunts__btn jaunts__btn-3">
                            Difficulty
                        </button>
                        <div className="trailMap__option-popup">
                            Hello
                        </div>
                    </div>

                    <button className="jaunts__btn jaunts__btn-3">
                        Length
                    </button>

                    <button className="jaunts__btn jaunts__btn-3">
                        E. Gain
                    </button>

                    <button className="jaunts__btn jaunts__btn-3">
                        Route Type
                    </button>

                    <button className="jaunts__btn jaunts__btn-3">
                        Rating
                    </button>

                    <button className="jaunts__btn jaunts__btn-3">
                        Completed
                    </button>

                </div>

                <div className="trailMap__help">
                    <button
                        className="jaunts__btn jaunts__btn-3 trailMap__button"
                        title={`Map Controls:\nLeft Mouse - Drag Map \nRight Mouse - Pitch / Bearing \nScroll Wheel - Zoom In / Out \n`}
                    >
                        <i className="fas fa-question" />
                    </button>
                </div>
            </div>

            <div className="trailMap__container">


                    {debug &&
                    <div className="trailMap__info">
                        <div>
                            Latitude: {lat}
                        </div>
                        <div>
                            Longitude: {lng}
                        </div>
                        <div>
                            Pitch: {pitch}
                        </div>
                        <div>
                            Zoom: {zoom}
                        </div>
                    </div>}

                    {loaded &&
                    <div className="trailMap__buttons">
                        <button
                            className="jaunts__btn jaunts__btn-1 trailMap__button"
                            title="Current Location"
                            onClick={handleCurrentLocation}
                        >
                            <i className="fas fa-location-arrow" />
                        </button>
                        <button
                            className="jaunts__btn jaunts__btn-1 trailMap__button"
                            title="Zoom In"
                            onClick={handleZoomIn}
                        >
                            <i className="fas fa-plus" />
                        </button>
                        <button
                            className="jaunts__btn jaunts__btn-1 trailMap__button"
                            title="Zoom Out"
                            onClick={handleZoomOut}
                        >
                            <i className="fas fa-minus" />
                        </button>
                        <button
                            className="jaunts__btn jaunts__btn-1 trailMap__button"
                            title="Reset Compass"
                            onClick={handleResetCompass}
                        >
                            <i className="fas fa-compass" />
                        </button>
                    </div>}

                    <div
                        ref={mapContainer}
                        className="trailMap__map"
                    />

            </div>
        </div>
    )
}
