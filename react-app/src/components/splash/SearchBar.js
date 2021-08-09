import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

import { getTrails, clearTrails } from "../../store/trails";
import { trailQuery } from "../../utils/queryObjects";

import SearchBarResult from './SearchBarResult';

import "./SearchBar.css";

export default function SearchBar() {
    const dispatch = useDispatch();
    const history = useHistory();
    const currSearch = useRef("");
    const prevSearch = useRef("");
    const nameResults = useSelector(state => state["trails"]["searchByName"]);
    const nameResultsArr = nameResults ? Object.values(nameResults) : [];
    const regionResults = useSelector(state => state["trails"]["searchByRegion"]);
    const regionResultsArr = regionResults ? Object.values(regionResults) : [];
    const tagResults = useSelector(state => state["trails"]["searchByTag"]);
    const tagResultsArr = tagResults ? Object.values(tagResults) : [];
    const [inputFocus, setInputFocus] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [showResults, setShowResults] = useState(false);
    const tabs = ["All", "Trails", "Regions", "Tags"];
    const allSet = new Set(nameResultsArr);
    for (let el of regionResultsArr) allSet.add(el);
    for (let el of tagResultsArr) allSet.add(el);
    const tabMap = {
        "All": [...allSet],
        "Trails": nameResultsArr,
        "Regions": regionResultsArr,
        "Tags": tagResultsArr,
    };

    const handleSubmit = () => {
        let id = null;
        if (nameResultsArr.length)
            id = nameResultsArr[0]["id"];
        else if (regionResultsArr.length)
            id = regionResultsArr[0]["id"];
        else if (tagResultsArr.length)
            id = tagResultsArr[0]["id"];

        if (id !== null)
            history.push(`/trails/${id}`);
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
                const searchNameQuery = trailQuery({ searchName: currSearch.current });
                const searchRegionQuery = trailQuery({ searchRegion: currSearch.current });
                const searchTagQuery = trailQuery({ searchTags: [currSearch.current] });
                dispatch(getTrails(searchNameQuery, "searchByName"));
                dispatch(getTrails(searchRegionQuery, "searchByRegion"));
                dispatch(getTrails(searchTagQuery, "searchByTag"));
            }
            prevSearch.current = currSearch.current;
        }, 1000);

        return () => {
            clearInterval(searchInterval);
            dispatch(clearTrails("searchByName"));
            dispatch(clearTrails("searchByRegion"));
            dispatch(clearTrails("searchByTag"));
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
                    placeholder="Search by name, region, or tag"
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
                    {tabs.map(tabName => {
                        return (
                            <div
                                className={`search-bar__results-tab ${checkActive(tabName)}`}
                                onClick={() => setActiveTab(tabName)}
                                key={`${tabName}`}
                            >
                                {tabName} {tabMap[tabName] && `(${tabMap[tabName].length})`}
                            </div>
                        )
                    })}
                </div>

                <div className="search-bar__results-content">
                    {tabs.map(tabName => (
                        <div className={`search-bar__results-list ${checkActive(tabName)}`}>
                            {tabMap[tabName] && tabMap[tabName].map(trail => (
                                <SearchBarResult trail={trail} />
                            ))}
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}
