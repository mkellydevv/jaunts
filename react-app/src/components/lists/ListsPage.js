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
    const { default: lists } = useSelector(state => state.lists);
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
            fromUserId: user.id
        });
        dispatch(getLists(query));

        return () => dispatch(clearLists());
    }, [user, dispatch])

    return (
        <>
            <div className="dummy-nav" />

            <div className="listsPage">

                <div className="listsPage__container">

                    <div className="listsPage__create-list">
                        {user &&
                            <button
                                className="jaunts__btn jaunts__btn-1"
                                onClick={() => openListModal()}
                            >
                                Create List
                            </button>
                        }
                    </div>

                    { lists && Object.values(lists).map(lst => {
                        return (
                            <ListsRow
                                list={lst}
                                open={openListModal}
                                key={`List-Row-${lst.id}`}
                            />
                        )
                    })}

                </div>

            </div>
            {showListModal &&
                <Modal close={closeListModal}>
                    <AddListModal list={list} close={closeListModal} />
                </Modal>
            }
        </>
    )
}
