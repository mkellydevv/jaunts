import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createList, updateList } from "../../store/lists";
import { listQuery } from "../../utils/queryObjects";

import "./AddListModal.css";

export default function ListModal({ list, close }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const [name, setName] = useState(list ? list.name : "");
    const [blurb, setBlurb] = useState(list ? list.blurb : "");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        const payload = { name, blurb };

        const query = listQuery({
            getUser: true,
            getTrails: 100
        });
        let data;
        if (list) {
            data = await dispatch(updateList(list.id, query, payload));
        }
        else {
            payload["user_id"] = user.id;
            data = await dispatch(createList(query, payload));
        }

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
            <div>
                <button
                    className="list-modal__submit"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    )
}
