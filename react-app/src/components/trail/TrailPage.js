import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getPhotos, clearPhotos } from "../../store/photos";
import { getRoutes, clearRoutes } from "../../store/routes";
import { getTrail, clearTrails } from "../../store/trails";
import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";
import { photoQuery, routeQuery, trailQuery, userQuery } from "../../utils/queryObjects";

import TrailInfo from "./TrailInfo";
import TrailDivider from "./TrailDivider";
import TrailMap from "./TrailMap";

import "./TrailPage.css";

export default function TrailPage() {
    const history = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { id } = useParams();

    const { user } = useSelector(state => state["session"]);

    const { default: trails } = useSelector(state => state.trails);
    const trailsArr = trails ? Object.values(trails) : [];
    const trail = trailsArr.length ? trailsArr[0] : null;

    // Divider
    const [leftPanelWidth, setLeftPanelWidth] = useState(state ? 0 : null);
    const [showMarkers, setShowMarkers] = useState(true);


    useEffect(() => {
        const _photoQuery = photoQuery({
            fromTrailId: id,
        });

        const _routeQuery = routeQuery({
            fromTrailId: id,
            getCoordinates: 1,
        });

        const _trailQuery = trailQuery({
            getTags: 25,
        });

        dispatch(getPhotos(_photoQuery));
        dispatch(getRoutes(_routeQuery));
        dispatch(getTrail(id, _trailQuery));

        return () => {
            dispatch(clearPhotos());
            dispatch(clearTrails());
            dispatch(clearRoutes());
        }
    }, [dispatch, history.location])

    useEffect(() => {
        if (!user) return;
        const query = userQuery({ getCompletedTrails: 1000 });
        dispatch(getUser(user.id, query));
        return () => {};
    }, [user]);

    return (
        <div className="trailPage">

            <div className="dummy-nav" />

            <div className="trailPage__content">

                <TrailInfo
                    trail={trail}
                    leftPanelWidth={leftPanelWidth}
                />

                <TrailDivider
                    trail={trail}
                    leftPanelWidth={leftPanelWidth}
                    setLeftPanelWidth={setLeftPanelWidth}
                    setShowMarkers={setShowMarkers}
                />

                <TrailMap
                    trail={trail}
                    showMarkers={showMarkers}
                />

            </div>

        </div>
    )
}
