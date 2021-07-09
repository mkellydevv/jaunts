import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listQuery } from "../../utils/queryObjects";
import { getLists, clearLists } from "../../store/lists";

import "./ListsModal.css";

export default function ListsModal() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { owned: lists } = useSelector(state => state.lists);

    useEffect(() => {
        if (!user) return;
        const query = listQuery({
            fromUserId: user.id,
            getUser: true,
            getTrails: 100
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
                                <div>Trails: {list.trails.length}</div>
                            </div>
                            <div className="lists-modal__star-container">
                                <i className="far fa-star" />
                            </div>
                        </div>
                    )})
                }
            </div>
        </div>
    )
}
