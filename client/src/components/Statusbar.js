import { useContext } from "react";
import { GlobalStoreContext } from "../store";
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    let text = "";
    if (store.currentList) text = store.currentList.name;
    return (
        <div
            id="playlister-statusbar"
            tabIndex={-1}
            onKeyDown={(e) => {
                console.log("pressed");
                console.log(store.activeButtons);
                if (store.activeButtons[1] && e.ctrlKey) {
                    console.log("activeable");
                    if (e.code == "KeyY") store.redo();
                    if (e.code == "KeyZ") store.undo();
                }
            }}
        >
            {text}
        </div>
    );
}

export default Statusbar;
