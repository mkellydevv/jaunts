import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getLists, clearLists } from "../../store/lists";
import { listQuery } from "../../utils/queryObjects";

import ListsRow from "./ListsRow";

export default function ListsPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { lists } = useSelector(state => state);

    useEffect(() => {
        if (!user) return;
        const query = listQuery({
            fromUserId: user.id,
            getUser: true,
            getTrails: 100
        });
        dispatch(getLists(query));

        return () => {
            dispatch(clearLists());
        }
    }, [user, dispatch])

    return (
        <>
            <div className="lists-page">
                { lists && Object.values(lists).map(list => {
                    return (
                        <ListsRow list={list} key={`List-Row-${list.id}`} />
                    )
                })}
            </div>
        </>
    )
}
