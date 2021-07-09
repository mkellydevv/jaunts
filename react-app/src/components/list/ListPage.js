import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { getListById } from "../../store/trails";
import { listQuery } from "../../utils/queryObjects";


export default function ListPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);

    useEffect(() => {
        const query = listQuery({
            fromUserId: user.id,
            getListsTrails: 100,
            getTrails: 100,
        });
        dispatch(getListById(query, "current"));
    }, [dispatch]);

    return (
        <div>
            <h1>List Page</h1>
        </div>
    );
}
