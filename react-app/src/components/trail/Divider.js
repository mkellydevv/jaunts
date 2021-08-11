import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getTrail, clearTrails } from "../../store/trails";
import { photoQuery, routeQuery, trailQuery, userQuery } from "../../utils/queryObjects";
import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";

import TrailCardList from "../trail-card/TrailCardList";

import "./Divider.css";

export default function Divider({ trail, completedTrails, setLeftPanelWidth }) {
    const dispatch = useDispatch();

    const mouseDown = useRef(false);
    const mousePos = useRef(null);

    const handleMouseDown = (e) => {
        mouseDown.current = true;
        mousePos.current = e.clientX;
    }

    const handleMouseMove = (e) => {
        if (!mouseDown.current) return;

        setLeftPanelWidth(state => state + e.clientX - mousePos.current);

        mousePos.current = e.clientX;
    }

    const handleMouseUp = (e) => {
        mouseDown.current = false;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return (
        <div
            className="divider"
            onMouseDown={handleMouseDown}
        >
            <h2>Nearby Trails</h2>
            {trail && <TrailCardList trail={trail} tag={"nearby"} trailLimit={10} completedTrails={completedTrails} />}
        </div>
    )
}
