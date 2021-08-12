import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getTrail, clearTrails } from "../../store/trails";
import { photoQuery, routeQuery, trailQuery, userQuery } from "../../utils/queryObjects";
import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";

import TrailCardList from "../trail-card/TrailCardList";

import "./TrailDivider.css";

export default function TrailDivider({ trail, leftPanelWidth, setLeftPanelWidth, setRightPanelWidth }) {
    const dispatch = useDispatch();
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);

    const mouseDown = useRef(false);
    const mousePos = useRef(null);

    const [active, setActive] = useState(true);


    const handleMouseDown = (e) => {
        mouseDown.current = true;
        mousePos.current = e.clientX;
    }

    const handleMouseMove = (e) => {
        if (!mouseDown.current) return;

        setLeftPanelWidth(state => Math.max(state + e.clientX - mousePos.current, 0));

        // setRightPanelWidth(window.innerWidth - leftPanelWidth - 48);

        mousePos.current = e.clientX;
    }

    const handleMouseUp = (e) => {
        mouseDown.current = false;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return (
        <div
            className={`divider ${active ? "active" : ""}`}
            onMouseDown={handleMouseDown}
        >
            <div className="divider__nav">
                <button
                    className="jaunts__btn jaunts__btn-1 divider__nav-btn"
                    onClick={() => setActive(state => !state)}
                >
                    <i className="fas fa-expand" />
                </button>
                <button
                    className="jaunts__btn jaunts__btn-1 divider__nav-btn"
                    onClick={() => setActive(state => !state)}
                >
                    <i className="fas fa-expand" />
                </button>
            </div>
            {active &&
            <>
                <h2>Nearby Trails</h2>
                {trail && <TrailCardList trail={trail} tag={"nearby"} trailLimit={10} completedTrails={completedTrails} />}
            </>
            }
        </div>
    )
}
