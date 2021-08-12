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
    const dispatch = useDispatch();
    const { id } = useParams();

    const { user } = useSelector(state => state["session"]);

    const { default: trails } = useSelector(state => state.trails);
    const trailsArr = trails ? Object.values(trails) : [];
    const trail = trailsArr.length ? trailsArr[0] : null;

    // Divider
    const [leftPanelWidth, setLeftPanelWidth] = useState(872);
    const [rightPanelWidth, setRightPanelWidth] = useState(109);

    useEffect(() => {
        const _photoQuery = photoQuery({
            fromTrailId: id,
        });

        const _routeQuery = routeQuery({
            fromTrailId: id,
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
        <div className="trail-page">

            <div className="dummy-nav" />

            <div className="trail-page__content">

                <TrailInfo
                    trail={trail}
                    leftPanelWidth={leftPanelWidth}
                />


                <TrailDivider
                    trail={trail}
                    leftPanelWidth={leftPanelWidth}
                    setLeftPanelWidth={setLeftPanelWidth}
                    setRightPanelWidth={setRightPanelWidth}
                />

                <TrailMap
                    trail={trail}
                    rightPanelWidth={rightPanelWidth}
                />

            </div>

        </div>
    )
}
