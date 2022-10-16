import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalStoreContext } from "../store";
import Modal from "./Modal";
/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { idNamePair, selected } = props;
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState(idNamePair.name);
    const [delModalUp, setDelModalUp] = useState(false);
    store.history = useHistory();

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf("list-card-text-") >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.listNameActive || !store.activeButtons[0]) {
        cardStatus = true;
    }
    let cardElement = (
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            onClick={handleLoadList}
            className={"list-card " + selectClass}
        >
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text"
            >
                {idNamePair.name}
            </span>
            <input
                disabled={cardStatus}
                type="button"
                id={"delete-list-" + idNamePair._id}
                className="list-card-button"
                onClick={(e) => {
                    e.stopPropagation();
                    setDelModalUp(true);
                    store.disableAll();
                }}
                value={"\u2715"}
            />
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-list-" + idNamePair._id}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"}
            />
        </div>
    );

    if (editActive) {
        return (
            <input
                id={"list-" + idNamePair._id}
                className="list-card"
                type="text"
                onKeyPress={handleKeyPress}
                onChange={(e) => setText(e.target.value)}
                defaultValue={idNamePair.name}
            />
        );
    }
    if (delModalUp) {
        return (
            <>
                {cardElement}
                <Modal
                    title="Delete Song?"
                    cancel={(e) => {
                        setDelModalUp(false);
                        store.reenable(true);
                    }}
                    confirm={(e) => {
                        store.deleteList(idNamePair._id);
                        setDelModalUp(false);
                    }}
                >
                    Are you sure you want to delete the list{" "}
                    <span>{idNamePair.name}</span>?
                </Modal>
            </>
        );
    } else {
        return cardElement;
    }
}

export default ListCard;
