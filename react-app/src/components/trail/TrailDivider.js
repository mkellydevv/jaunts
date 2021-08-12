import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getTrail, clearTrails } from "../../store/trails";
import { photoQuery, routeQuery, trailQuery, userQuery } from "../../utils/queryObjects";
import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";

import TrailCardList from "../trail-card/TrailCardList";

import "./TrailDivider.css";

export default function TrailDivider({ trail, setLeftPanelWidth }) {
    const dispatch = useDispatch();
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);

    const mouseDown = useRef(false);
    const mouseStart = useRef(null);

    const [active, setActive] = useState(false);
    const width = useRef(24);

    const handleResize = (e) => {
        const el = document.getElementsByClassName("trailMap")[0];

        if (!active)
            width.current = 22 * 16 / 2;
        else
            width.current = 24;
        setActive(state => !state);
    };

    const handleMaximizeLeft = (e) => {
        e.stopPropagation();
        setLeftPanelWidth(null);
    }

    const handleMaximizeRight = (e) => {
        e.stopPropagation();
        setLeftPanelWidth(0);
    }

    const handleMouseDown = (e) => {
        mouseDown.current = true;
        mouseStart.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        if (
            !mouseDown.current ||
            Math.abs(mouseStart.current - e.clientX) < 3
        )
            return;

        mouseStart.current = Infinity;

        setLeftPanelWidth(Math.max(0, e.clientX - width.current));
    };

    const handleMouseUp = (e) => {
        mouseDown.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return (
        <div
            className={`trailDivider ${active ? "active" : ""}`}
        >
            <div className="trailDivider__nav">

                <div className="trailDivider__nav-btns">
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        onClick={handleResize}
                    >
                        <i className="fas fa-expand" />
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        onClick={handleMaximizeRight}
                    >
                        <i className="fas fa-angle-double-left" />
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        onClick={handleMaximizeLeft}
                    >
                        <i className="fas fa-angle-double-right" />
                    </button>
                </div>

                <div className="trailDivider__drag">
                    <div
                        className="trailDivider__drag-handle"
                        onMouseDown={handleMouseDown}
                    >
                        <i className="fas fa-grip-lines-vertical" />
                    </div>
                </div>

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
