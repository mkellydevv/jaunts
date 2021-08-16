import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { getRoutes } from "../../store/routes";
import { unpackCoordinates } from "../../utils/helperFuncs";
import { routeQuery } from "../../utils/queryObjects";

import "./TrailMap.css";

mapboxgl.accessToken = 'pk.eyJ1IjoibWtlbGx5ZGV2diIsImEiOiJja3BmcXZuY3YwNzg0MnFtd3Rra3M3amI4In0.h8HRrZ2xGNP-aq7EwO0YVA';

const unpackTrailHeads = (trailHeads) => {
    const features = [];
    for (let key in trailHeads) {
        const t = trailHeads[key];
        features.push({
            type: 'Feature',
            properties: {
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

export default function TrailMap({ trail, rightPanelWidth }) {
    const dispatch = useDispatch();
    const { default: routes } = useSelector(state => state.routes);
    const route = routes ? Object.values(routes)[0] : null;
    const coordinates = route ? unpackCoordinates(route) : [];
    const { trailHeads } = useSelector(state => state.routes);
    const markers = useRef({
        type: 'geojson',
        data: {
            type: "FeatureCollection",
            features: []
        }
    });

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [lng, setLng] = useState(-78.2875100);
    const [lat, setLat] = useState(38.57103000);
    const [zoom, setZoom] = useState(13);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [lng, lat],
            zoom: zoom,
        });

        map.current.addControl(new mapboxgl.NavigationControl(),'top-right');

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        map.current.on('load', () => {
            // setLoaded(true);
            map.current.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                (err, image) => {
                    if (err) return console.error(err);
                    map.current.addImage('custom-marker', image);
                    setLoaded(true);
                    map.current.addSource('markers', markers.current);
                    map.current.addLayer({
                        'id': 'markers',
                        'type': 'symbol',
                        'source': 'markers',
                        'layout': {
                            'icon-image': 'custom-marker',
                            // get the title name from the source's "title" property
                            'text-field': ['get', 'title'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        }
                    });
                }
            )
        });

        map.current.on("mouseup", () => {
            const bounds = map.current.getBounds();
            const nw = bounds.getNorthWest();
            const se = bounds.getSouthEast();

            const query = routeQuery({
                nw: [nw.lat, nw.lng],
                se: [se.lat, se.lng],
            });
            dispatch(getRoutes(query, "trailHeads"));
        })
    }, []);

    useEffect(() => {
        if (!loaded) return;

        if (map.current.getLayer("route"))
            map.current.removeLayer("route");
        if (map.current.getSource("route"))
            map.current.removeSource("route");

        map.current.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            }
        });

        map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#ff0000',
                'line-width': 5
            }
        });

        map.current.easeTo({
            center: coordinates[0],
            zoom: zoom,
            duration: 1500
        });

    }, [loaded, routes]);

    useEffect(() => {
        if (!loaded) return;
        console.log(`trailHeads`, trailHeads)
        markers.current.data.features = unpackTrailHeads(trailHeads);

        map.current.getSource("markers")
            .setData(markers.current.data);

    }, [trailHeads]);

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
