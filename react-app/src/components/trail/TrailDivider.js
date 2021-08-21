import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getTrail, clearTrails } from "../../store/trails";
import { photoQuery, routeQuery, trailQuery, userQuery } from "../../utils/queryObjects";
import { getUser, markTrailComplete, markTrailIncomplete } from "../../store/users";

import SearchBar from "../splash/SearchBar";
import TrailCardList from "../trail-card/TrailCardList";

import "./TrailDivider.css";

export default function TrailDivider({ trail, leftPanelWidth, setLeftPanelWidth, setShowMarkers }) {
    const dispatch = useDispatch();
    const { default: users } = useSelector(state => state["users"]);
    const completedTrails = users ? new Set(Object.values(users)[0]["completed_trails"]) : new Set([]);

    const mouseDown = useRef(false);
    const mouseStart = useRef(null);

    const [active, setActive] = useState(false);
    const openWidth = 22 * 16 / 2;
    const closedWidth = 3 * 16 / 2;
    const width = useRef(active ? openWidth : closedWidth);

    const handleResize = (e) => {
        width.current = active ? closedWidth : openWidth;
        setActive(state => !state);
    };

    const handleMaximizeLeft = (e) => {
        setLeftPanelWidth(null);
    }

    const handleMaximizeRight = (e) => {
        setLeftPanelWidth(0);
    }

    const handleMouseDown = (e) => {
        mouseDown.current = true;
        mouseStart.current = e.clientX;
    };

    const handleShowMarkers = (e) => {
        setShowMarkers(state => !state);
    }

    const handleMouseMove = (e) => {
        if (!mouseDown.current ||
            Math.abs(mouseStart.current - e.clientX) < 3
        )
            return;

        mouseStart.current = Infinity;

        setLeftPanelWidth(Math.max(0, e.clientX - width.current));
    };

    const handleMouseUp = (e) => {
        mouseDown.current = false;
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.getElementById("trailDivider")
            .addEventListener("transitionend", () => {
                window.dispatchEvent(new Event('resize'));
        });
    }, []);

    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [leftPanelWidth]);

    return (
        <div
            id="trailDivider"
            className={`trailDivider ${active ? "active" : ""}`}
        >
            <div className="trailDivider__nav">

                <div className="trailDivider__nav-btns trailDivider__nav-start">
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        title="Expand Sidebar"
                        onClick={handleResize}
                    >
                        <i className="fas fa-expand" />
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        title="Collapse Left"
                        onClick={handleMaximizeRight}
                    >
                        <i className="fas fa-angle-double-left" />
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        title="Collapse Right"
                        onClick={handleMaximizeLeft}
                    >
                        <i className="fas fa-angle-double-right" />
                    </button>
                </div>

                <div className="trailDivider__drag">
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn trailDivider__drag-handle"
                        title="Drag Sidebar"
                        onMouseDown={handleMouseDown}
                    >
                        <i className="fas fa-grip-vertical" />
                    </button>
                </div>

                <div className="trailDivider__nav-btns trailDivider__nav-end">
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                        title="Show Markers"
                        onClick={handleShowMarkers}
                    >
                        <i className="fas fa-map-marker-alt" />
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                    >
                        <i className="fas fa-filter" />
                    </button>
                    <button
                        className="jaunts__btn jaunts__btn-1 trailDivider__nav-btn"
                    >
                        <i className="fas fa-cubes" />
                    </button>
                </div>

            </div>

            <div className={`trailDivider__container ${active ? "active" : ""}`}>

                <div className="trailDivider__container-search">
                    <SearchBar tiny={true} />
                </div>

                <div className="trailDivider__container-title">
                    Nearby Trails
                </div>

                {trail && <TrailCardList trail={trail} tag={"nearby"} trailLimit={10} completedTrails={completedTrails} />}

            </div>

        </div>
    )
}
