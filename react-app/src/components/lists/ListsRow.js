import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { deleteList } from "../../store/lists";
import { clearJaunts, getJaunts } from "../../store/jaunts";
import { clearTrails, getTrails } from "../../store/trails";
import { trailQuery, jauntQuery } from "../../utils/queryObjects";

import "./ListsRow.css"

export default function ListsRow({ list, open }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector(state => state.session);
    const key = `list-${list.id}`;
    const jaunts = useSelector(state => state.jaunts[key]);
    const jauntsArr = jaunts ? Object.values(jaunts) : [];
    const trails = useSelector(state => state.trails[key]);
    const trailsArr = trails ? Object.values(trails) : [];
    const [imgSrc, setImgSrc] = useState("https://cdn-assets.alltrails.com/assets/placeholder/list_placeholder.svg");
    const [errors, setErrors] = useState("");

    const handleClick = () => {
        history.push(`/lists/${list.id}`);
    }

    const handleEdit = () => {
        open(list);
    }

    const handleDelete = async (e) => {
        const data = await dispatch(deleteList(list.id));

        if (data.errors) {
            setErrors(data.errors);
            console.log("Errors:", data.errors)
        }
    }

    useEffect(() => {
        const _jauntQuery = jauntQuery({
            fromListId: list.id
        });

        const _trailQuery = trailQuery({
            fromListId: list.id,
            getPhotos: 1,
            limit: 1
        });

        dispatch(getJaunts(_jauntQuery, `list-${list.id}`));
        dispatch(getTrails(_trailQuery, `list-${list.id}`));

        return () => {
            dispatch(clearJaunts(`list-${list.id}`));
            dispatch(clearTrails(`list-${list.id}`));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!trails || trailsArr.length === 0) return;
        setImgSrc(Object.values(trailsArr[0].photos)[0].url.replace("extra_", ""));
    }, [trails])

    return (
        <div className="listsRow">

            <div className="listsRow__container">

                <div
                    className="listsRow__img-container"
                    onClick={handleClick}
                >
                    <img src={imgSrc} />
                </div>

                <div
                    className="listsRow__info"
                    onClick={handleClick}
                >
                    <div className="listsRow__name">{list.name}</div>
                    <div>{user && user.username}</div>
                    <div className="listsRow__blurb">{list.blurb}</div>
                </div>

                <div>
                    <div className="listsRow__stats">Stats:</div>
                    <div>Trails: {jauntsArr.length}</div>
                </div>

                <div className="listsRow__buttons">
                    <button
                        className="listsRow__edit jaunts__btn jaunts__btn-1"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="listsRow__delete jaunts__btn jaunts__btn-3"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>

            </div>

        </div>
    )
}
