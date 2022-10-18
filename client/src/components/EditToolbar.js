import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";
    let disabledButtonClass = "playlister-button-disabled";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id="add-song-button"
                disabled={!store.activeButtons[1]}
                value="+"
                className={
                    store.activeButtons[1]
                        ? enabledButtonClass
                        : disabledButtonClass
                }
                onClick={(e) => {
                    store.addSong();
                }}
            />
            <input
                type="button"
                id="undo-button"
                disabled={!store.activeButtons[2]}
                value="⟲"
                className={
                    store.activeButtons[2]
                        ? enabledButtonClass
                        : disabledButtonClass
                }
                onClick={handleUndo}
            />
            <input
                type="button"
                id="redo-button"
                disabled={!store.activeButtons[3]}
                value="⟳"
                className={
                    store.activeButtons[3]
                        ? enabledButtonClass
                        : disabledButtonClass
                }
                onClick={handleRedo}
            />
            <input
                type="button"
                id="close-button"
                disabled={!store.activeButtons[4]}
                value="&#x2715;"
                className={
                    store.activeButtons[4]
                        ? enabledButtonClass
                        : disabledButtonClass
                }
                onClick={handleClose}
            />
        </span>
    );
}

export default EditToolbar;
