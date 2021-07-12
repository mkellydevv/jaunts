import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { clearLists, getListById } from "../../store/lists";
import { clearTrails, getTrails } from "../../store/trails";
import { listQuery, trailQuery } from "../../utils/queryObjects";


export default function ListPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { id } = useParams();
    const list = useSelector(state => state.lists.current ? Object.values(state.lists.current)[0] : null);

    useEffect(() => {
        if (!user) return;

        const _listQuery = listQuery({
            fromUserId: user.id,
            getJaunts: 100,
        });

        const _trailQuery = trailQuery({
            fromListId: id,
            limit: 100
        });

        dispatch(getListById(id, _listQuery, "current"));
        dispatch(getTrails(_trailQuery, "current"));

        return () => {
            dispatch(clearLists("current"));
            dispatch(clearTrails("current"));
        }
    }, [id, user, dispatch]);

    return (
        <div>
            <div>
                {list && list.blurb}
            </div>
            <div>
                {list && list.jaunts.map(jaunt => {
                    return (
                        <>
                            <div>
                                Rating {jaunt.rating}
                            </div>
                            <div>
                                Blurb {jaunt.blurb}
                            </div>
                            <div>
                                Date {jaunt.date}
                            </div>
                        </>
                    )
                })}
            </div>
        </div>
    );
}
