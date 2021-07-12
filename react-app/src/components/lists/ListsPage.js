import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getLists, clearLists } from "../../store/lists";
import { listQuery } from "../../utils/queryObjects";

import ListsRow from "./ListsRow";
import Modal from "../Modal";
import AddListModal from "./AddListModal";

import "./ListsPage.css"

export default function ListsPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.session);
    const { owned: lists } = useSelector(state => state.lists);
    const [list, setList] = useState(null);
    const [showListModal, setShowListModal] = useState(false);

    const openListModal = (lst=null) => {
        setList(lst);
        setShowListModal(true);
    }

    const closeListModal = () => {
        setList(null);
        setShowListModal(false);
    }

    useEffect(() => {
        if (!user) return;
        const query = listQuery({
            fromUserId: user.id,
            getJaunts: 100,
            getTrails: 100,
            getUser: 1,
        });
        dispatch(getLists(query, "owned"));

        return () => dispatch(clearLists("owned"));
    }, [user, dispatch])

    return (
        <>
            <div className="lists-page">
                <div className="lists-page__create-list">
                    {user &&
                        <button
                            onClick={() => openListModal()}
                        >
                            Create List
                        </button>
                    }
                </div>
                { lists && Object.values(lists).map(lst => {
                    return (
                        <ListsRow list={lst} open={openListModal} key={`List-Row-${lst.id}`} />
                    )
                })}
            </div>
            {showListModal &&
                <Modal close={closeListModal}>
                    <AddListModal list={list} close={closeListModal} />
                </Modal>
            }
        </>
    )
}
