import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { clearLists, getListById } from "../../store/lists";
import { clearTrails, getTrails } from "../../store/trails";
import { clearJaunts, getJaunts } from "../../store/jaunts";
import { listQuery, trailQuery, jauntQuery } from "../../utils/queryObjects";

import "./ListPage.css";

export default function ListPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { id } = useParams();
    const { default: lists } = useSelector(state => state.lists);
    const { default: trails } = useSelector(state => state.trails);
    const { default: jaunts } = useSelector(state => state.jaunts);
    const list = lists ? lists[0] : null;

    useEffect(() => {
        if (!user) return;

        const _listQuery = listQuery({
            fromUserId: user.id
        });

        const _trailQuery = trailQuery({
            fromListId: id
        });

        const _jauntQuery = jauntQuery({
            fromListId: id
        });

        dispatch(getListById(id, _listQuery));
        dispatch(getTrails(_trailQuery));
        dispatch(getJaunts(_jauntQuery));

        return () => {
            dispatch(clearLists());
            dispatch(clearTrails());
            dispatch(clearJaunts());
        }
    }, [id, user, dispatch]);


    return (
        <div>
            <div>
                {list && list.blurb}
            </div>
            <div>
                {jaunts && Object.values(jaunts).map(jaunt => {
                    return (
                        <div>
                            <div>
                                Rating {jaunt.rating}
                            </div>
                            <div>
                                Blurb {jaunt.blurb}
                            </div>
                            <div>
                                Date {jaunt.date}
                            </div>
                            <br />
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
