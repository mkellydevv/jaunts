import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listQuery, listTrailQuery } from "../../utils/queryObjects";
import { getLists, clearLists } from "../../store/lists";
import { getListTrails, createListTrail, deleteListTrail, clearListTrails } from "../../store/listTrails";

import "./ListsModal.css";

export default function ListsModal({ trail }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { owned: lists } = useSelector(state => state.lists);
    const listTrails = useSelector(state => state.listTrails);

    const handleClick = (list) => {
        if (!user) return;

        const query = listTrailQuery({
            fromListId: list.id
        });

        if (listTrails[list.id][trail.id] === undefined) {
            dispatch(createListTrail(
                { trailId: trail.id, listId: list.id }, query, list.id, "trail_id"
            ));
        }
        else {
            dispatch(deleteListTrail(listTrails[list.id][trail.id].id, list.id, "trail_id"));
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
            dispatch(clearListTrails());
        };
    }, [user, dispatch]);

    useEffect(() => {
        if (!lists) return;
        for (let list of Object.values(lists)) {
            const _listTrailQuery = listTrailQuery({
                fromListId: list.id
            });

            dispatch(getListTrails(_listTrailQuery, list.id, "trail_id"));
        }
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
                            <div className="lists-modal__details">
                                <div className="lists-row__name">{list.name}</div>
                                {listTrails && listTrails[list.id] && <div>Trails: {Object.values(listTrails[list.id]).length}</div>}
                            </div>
                            <div className="lists-modal__star-container">
                                {listTrails && listTrails[list.id] && <i
                                    className={`${listTrails[list.id][trail.id] !== undefined ? "fas" : "far"} fa-star`}
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
