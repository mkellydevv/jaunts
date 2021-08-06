import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import "./SearchBar.css";

export default function SearchBar() {
    const dispatch = useDispatch();
    const history = useHistory();
    const currSearch = useRef("");
    const prevSearch = useRef("");
    const searchResults = useSelector(state => state["trails"]["search"]);
    const [inputFocus, setInputFocus] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [showResults, setShowResults] = useState(false);

    const handleSubmit = () => {
        history.push(`/trails/${Object.values(searchResults)[0]["id"]}`);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && prevSearch.current === currSearch.current)
            handleSubmit()
    }

    const checkActive = (tabName) => {
        return tabName === activeTab ? "active" : "";
    }

    useEffect(() => {
        const searchInterval = setInterval(() => {
            if (currSearch.current.length && prevSearch.current !== currSearch.current) {
                const query = trailQuery({
                    searchTerm: currSearch.current,
                    limit: 1
                });
                dispatch(getTrails(query, "search"));
            }
            prevSearch.current = currSearch.current;
        }, 5000);

        return () => {
            clearInterval(searchInterval);
            dispatch(clearTrails("search"));
        }
    }, [dispatch]);

    useEffect(() => {
        if (currSearch.current !== "") {
            setShowResults(true);
        }
        else
            setShowResults(false);
    }, [currSearch.current]);

    return (
        <div className="search-bar">

            <div className="search-bar__input">
                <div className={`search-bar__input-icon ${inputFocus ? "active": ""}`}>
                    <i className='fas fa-search' />
                </div>
                <input
                    className="search-bar__input-inp"
                    placeholder="Search by region, tag, or trail name"
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    onChange={(e) => {
                        currSearch.current = e.target.value;
                        setShowResults(!(e.target.value === ""));
                    }}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-bar__input-submit" onClick={handleSubmit}>
                    <i className="fas fa-arrow-right" />
                </button>
            </div>

            <div className={`search-bar__results ${showResults ? "active" : ""}`}>
                <div className="search-bar__results-tabs">
                    {["All", "Regions", "Tags", "Trails"].map(tabName => {
                        return (
                            <div
                                className={`search-bar__results-tab ${checkActive(tabName)}`}
                                onClick={() => setActiveTab(tabName)}
                                key={`${tabName}`}
                            >
                                {tabName}
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
