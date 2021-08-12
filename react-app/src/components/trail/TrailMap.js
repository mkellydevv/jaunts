import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { unpackCoordinates } from "../../utils/helperFuncs";

import "./TrailMap.css";

mapboxgl.accessToken = 'pk.eyJ1IjoibWtlbGx5ZGV2diIsImEiOiJja3BmcXZuY3YwNzg0MnFtd3Rra3M3amI4In0.h8HRrZ2xGNP-aq7EwO0YVA';

export default function TrailMap({ trail, rightPanelWidth }) {
    const { default: routes } = useSelector(state => state.routes);
    const route = routes ? Object.values(routes)[0] : null;
    const coordinates = route ? unpackCoordinates(route) : [];

    // const mapContainer = useRef(null);
    // const map = useRef(null);
    // const [lng, setLng] = useState(-78.2875100);
    // const [lat, setLat] = useState(38.57103000);
    // const [zoom, setZoom] = useState(13);

    // useEffect(() => {
    //     if (map.current) return; // initialize map only once
    //     map.current = new mapboxgl.Map({
    //         container: mapContainer.current,
    //         style: 'mapbox://styles/mapbox/outdoors-v11',
    //         center: [lng, lat],
    //         zoom: zoom
    //     });
    //     map.current.addControl(new mapboxgl.NavigationControl());

    // });

    // useEffect(() => {
    //     if (!routes) return;
    //     map.current.on('load', () => {
    //         map.current.addSource('route', {
    //             type: 'geojson',
    //             data: {
    //                 type: 'Feature',
    //                 properties: {},
    //                 geometry: {
    //                     type: 'LineString',
    //                     coordinates: coordinates
    //                 }
    //             }
    //         });
    //         map.current.addLayer({
    //             id: 'route',
    //             type: 'line',
    //             source: 'route',
    //             layout: {
    //                 'line-join': 'round',
    //                 'line-cap': 'round'
    //             },
    //             paint: {
    //                 'line-color': '#ff0000',
    //                 'line-width': 5
    //             }
    //         });
    //     });
    // }, [routes]);

    // useEffect(() => {
    //     if (!map.current) return; // wait for map to initialize
    //     map.current.on('move', () => {
    //         setLng(map.current.getCenter().lng.toFixed(4));
    //         setLat(map.current.getCenter().lat.toFixed(4));
    //         setZoom(map.current.getZoom().toFixed(2));
    //     });
    // });

    return (
        <div
            className="trailMap"
            style={{width:rightPanelWidth}}
        >
            <div className="trailMap__container">
                Test Map Panel
                Jones Run Falls Trail is a 4.5 mile heavily trafficked out and back trail located near Crozet, Virginia that features a waterfall and is rated as moderate. The trail is primarily used for hiking and walking and is best used from March until November. Dogs are also able to use this trail but must be kept on leash.
            </div>
            {/* <div className="trail-section__mapbox">
                    <div className="map-sidebar">
                        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                    </div>
                    <div ref={mapContainer} className="map-container" />
                </div> */}
        </div>
    )
}
