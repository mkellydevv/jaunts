import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


import { getLists, clearLists } from "../../store/lists";
import { getJaunts, createJaunt, deleteJaunt, clearJaunts } from "../../store/jaunts";
import { listQuery, jauntQuery } from "../../utils/queryObjects";

import "./ListsModal.css";

export default function ListsModal({ trail }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector(state => state.session);
    const { default: lists } = useSelector(state => state.lists);
    const jaunts = useSelector(state => state.jaunts);

    const handleClick = (list) => {
        if (!user) return;

        const query = jauntQuery({
            fromListId: list.id
        });

        if (jaunts[list.id][trail.id] === undefined) {
            dispatch(createJaunt(
                { trailId: trail.id, listId: list.id }, query, list.id, "trail_id"
            ));
        }
        else {
            dispatch(deleteJaunt(jaunts[list.id][trail.id].id, list.id, "trail_id"));
        }
    }

    const handleListClick = (id) => {
        dispatch(clearLists());
        dispatch(clearJaunts());
        history.push(`/lists/${id}`);
    }

    useEffect(() => {
        if (!user) return;
        const query = listQuery({
            fromUserId: user.id,
            getUser: true,
            getJaunts: 100,
            getTrails: 100,
        });
        dispatch(getLists(query));
        return () => dispatch(clearLists());
    }, [user, dispatch]);

    useEffect(() => {
        if (!lists) return;
        for (let list of Object.values(lists)) {
            const _jauntQuery = jauntQuery({
                fromListId: list.id
            });

            dispatch(getJaunts(_jauntQuery, list.id, "trail_id"));
        }
        return () => dispatch(clearJaunts());
    }, [lists]);

    return (
        <div className="lists-modal" >

            <div className="lists-modal__header">
                Save to List
            </div>

            <div className="lists-modal__content">
                {lists && Object.values(lists).map(list => {
                    return (
                        <div className="lists-modal__row">

                            <div className="lists-modal__row-details">
                                <div
                                    onClick={() => handleListClick(list.id)}
                                    className="lists-modal__row-name"
                                >
                                    {list.name}
                                </div>
                                {jaunts && jaunts[list.id] &&
                                <div className="lists-modal__row-info">
                                    Trails: {Object.values(jaunts[list.id]).length}
                                </div>}
                            </div>

                            <div className="lists-modal__star-container">
                                {jaunts && jaunts[list.id] && <i
                                    className={`${jaunts[list.id][trail.id] !== undefined ? "fas" : "far"} fa-star`}
                                    onClick={() => handleClick(list)}
                                />}
                            </div>

                        </div>
                    )})
                }
            </div>

        </div>
    )
}
