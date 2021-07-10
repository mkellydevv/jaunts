import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { clearLists, getListById } from "../../store/lists";
import { listQuery } from "../../utils/queryObjects";


export default function ListPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { id } = useParams();
    const list = useSelector(state => state.lists.current ? Object.values(state.lists.current)[0] : null);

    useEffect(() => {
        if (!user) return;
        const query = listQuery({
            fromUserId: user.id,
            getListsTrails: 100,
            getTrails: 100,
        });
        dispatch(getListById(id, query, "current"));

        return () => {
            dispatch(clearLists("current"));
        }
    }, [id, user, dispatch]);

    return (
        <div>
            <div>
                {list && list.blurb}
            </div>
            <div>
                {list && list.lists_trails.map(listTrail => {
                    return (
                        <>
                            <div>
                                Rating {listTrail.rating}
                            </div>
                            <div>
                                Blurb {listTrail.blurb}
                            </div>
                            <div>
                                Date {listTrail.date}
                            </div>
                        </>
                    )
                })}
            </div>
        </div>
    );
}
