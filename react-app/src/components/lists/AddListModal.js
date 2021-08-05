import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createList, editList } from "../../store/lists";
import { listQuery } from "../../utils/queryObjects";

import "./AddListModal.css";

export default function ListModal({ list, close }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const [name, setName] = useState(list ? list.name : "");
    const [blurb, setBlurb] = useState(list ? list.blurb : "");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        const payload = { name, blurb, "user_id": user.id };

        const query = listQuery({
            fromUserId: user.id,
            getJaunts: 100,
            getTrails: 100,
            getUser: 1,
        });
        let data;
        if (list)
            data = await dispatch(editList(list.id, query, payload));
        else
            data = await dispatch(createList(query, payload));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
        else
            close();
    }

    return (
        <>
            <div>
                <input
                    className="list-modal__name"
                    type="text"
                    placeholder="List Name"
                    defaultValue={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <textarea
                    className="list-modal__blurb"
                    cols={40}
                    rows={10}
                    placeholder="Enter a description for this list"
                    defaultValue={blurb}
                    onChange={e => setBlurb(e.target.value)}
                />
            </div>
            <div className="list-modal__submit">
                <button
                    className="jaunts__btn jaunts__btn-1"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    )
}
