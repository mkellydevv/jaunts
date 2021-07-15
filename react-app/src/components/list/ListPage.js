import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { clearLists, getList } from "../../store/lists";
import { clearTrails, getTrails } from "../../store/trails";
import { clearJaunts, getJaunts } from "../../store/jaunts";
import { listQuery, trailQuery, jauntQuery } from "../../utils/queryObjects";

import TrailCard from "../trail-card/TrailCard";
import JauntRow from "../jaunts/JauntRow";

import "./ListPage.css";

export default function ListPage() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { user } = useSelector(state => state.session);
    const { default: jaunts } = useSelector(state => state.jaunts);
    const { default: lists } = useSelector(state => state.lists);
    const list = lists ? lists[0] : null;
    const { default: trails } = useSelector(state => state.trails);

    useEffect(() => {
        if (!user) return;

        const _jauntQuery = jauntQuery({
            fromListId: id
        });

        const _listQuery = listQuery({
            fromUserId: user.id
        });

        const _trailQuery = trailQuery({
            fromListId: id,
            getPhotos: 1,
        });

        dispatch(getJaunts(_jauntQuery));
        dispatch(getList(id, _listQuery));
        dispatch(getTrails(_trailQuery));

        return () => {
            console.log(`CLEAREDDDDDDDDDDDDDDDDDDDDD`)
            dispatch(clearLists());
            dispatch(clearTrails());
            dispatch(clearJaunts());
        }
    }, [user, dispatch]);

    return (
        <div className="page-content">
            <div className="list-page">
                <div>
                    {list && list.blurb}
                </div>
                <div className="list-page__jaunt-rows">
                    {jaunts && trails && user && Object.values(jaunts).map(jaunt => {
                        return (
                            <JauntRow
                                key={jaunt.id}
                                jaunt={jaunt}
                                trail={trails[jaunt.trail_id]}
                                user={user}
                            />
                        )
                    })}
                </div>
            </div>
            {/* <div className="list-page__extra">
                <h2>Trail Info</h2>
                <div className="card-list">
                    <div className="card-list__container">
                        {trails && Object.keys(trails).map(key => {
                            return (
                                <TrailCard trail={trails[key]} key={`TrailCard__nearby-${key}`}/>
                            )
                        })}
                    </div>
                </div>
            </div> */}
        </div>
    );
}
