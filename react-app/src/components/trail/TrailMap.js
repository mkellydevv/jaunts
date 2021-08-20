import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { getRoutes } from "../../store/routes";
import { unpackCoordinates, unpackTrailHeads } from "../../utils/helperFuncs";
import { routeQuery } from "../../utils/queryObjects";

import markerImg from "../../assets/green-2.png";
import "./TrailMap.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function TrailMap({ trail, showMarkers }) {
    const dispatch = useDispatch();
    const history = useHistory();
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

    const markersLayer = {
        'id': 'markersLayer',
        'type': 'symbol',
        'source': 'markersSource',
        'layout': {
            'icon-allow-overlap': true,
            'icon-anchor': "bottom",
            'icon-image': 'custom-marker',
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

    // Mapbox specific
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [zoom, setZoom] = useState(13);

    const getTrailHeads = (e) => {
        if (e && e.type === "moveend" && !e.eased) return;

        const bounds = map.current.getBounds();
        const nw = bounds.getNorthWest();
        const se = bounds.getSouthEast();
        const query = routeQuery({
            nw: [nw.lat, nw.lng],
            se: [se.lat, se.lng],
        });
        dispatch(getRoutes(query, "trailHeads"));
    }

    useEffect(() => {
        if (map.current || !route) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [route.lng, route.lat],
            zoom: zoom,
        });

        map.current.addControl(new mapboxgl.NavigationControl(),'top-right');

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        map.current.on("mouseup", getTrailHeads);
        map.current.on("moveend", getTrailHeads);
        map.current.on("zoomend", getTrailHeads);

        map.current.on('load', () => {
            getTrailHeads();
            setLoaded(true);

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
                history.push(`/trails/${e.features[0].properties.id}`);
            });

            map.current.loadImage(
                markerImg,
                (err, image) => {
                    if (err) return console.error(err);
                    map.current.addImage('custom-marker', image);

                    map.current.addLayer(markersLayer);
                }
            );
        });
    }, [route]);

    useEffect(() => {
        if (!loaded || !route) return;

        routeSource.current.data.geometry.coordinates = unpackCoordinates(route);

        const src = map.current.getSource("routeSource");
        if (src)
            src.setData(routeSource.current.data);

        setZoom(13);

        map.current.easeTo({
            center: routeSource.current.data.geometry.coordinates[0],
            zoom: 13,
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
            <div className="trailMap__options">



            </div>

            <div className="trailMap__container">

                    <div className="trailMap__info">
                        <div>
                            Latitude: {lat}
                        </div>
                        <div>
                            Longitude: {lng}
                        </div>
                        <div>
                            Zoom: {zoom}
                        </div>
                    </div>

                    <div
                        ref={mapContainer}
                        className="trailMap__map"
                    />

            </div>
        </div>
    )
}
