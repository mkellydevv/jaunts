import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listQuery } from "../../utils/queryObjects";
import { addTrailToList, getLists, clearLists, deleteTrailFromList } from "../../store/lists";

import "./ListsModal.css";

export default function ListsModal({ trail }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { owned: lists } = useSelector(state => state.lists);

    const handleClick = (list) => {
        if (!user) return;

        const query = listQuery({
            fromUserId: user.id,
            getUser: true,
            getListsTrails: 100,
            getTrails: 100,
        });

        if (list.trails[trail.id] === undefined) {
            dispatch(addTrailToList(query, { trailId: trail.id, listId: list.id }));
        }
        else {
            dispatch(deleteTrailFromList(query, list.id, trail.id));
        }
    }

    useEffect(() => {
        if (!user) return;
        const query = listQuery({
            fromUserId: user.id,
            getUser: true,
            getListsTrails: 100,
            getTrails: 100,
        });
        dispatch(getLists(query, "owned"));

        return () => {
            dispatch(clearLists("owned"));
        }
    }, [user, dispatch]);

    return (
        <div className="lists-modal" >
            <div className="lists-modal__header">
                Save to List
            </div>
            <div className="lists-modal__content">
                {lists && Object.values(lists).map(list => {
                    return (
                        <div className="lists-modal__row">
                            <div className="lists-modal__details">
                                <div className="lists-row__name">{list.name}</div>
                                <div>Trails: {list.lists_trails.length}</div>
                            </div>
                            <div className="lists-modal__star-container">
                                <i
                                    className={`${list.trails[trail.id] !== undefined ? "fas" : "far"} fa-star`}
                                    onClick={() => handleClick(list)}
                                />
                            </div>
                        </div>
                    )})
                }
            </div>
        </div>
    )
}
