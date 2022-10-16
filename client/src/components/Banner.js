import EditToolbar from "./EditToolbar";
import { useContext } from "react";
import { GlobalStoreContext } from "../store";
/*
    Our Application's Banner, note we are using function-style
    React. Our banner just has a left-aligned heading and a
    right-aligned toolbar for undo/redo and close list buttons.
    
    @author McKilla Gorilla
*/
function Banner(props) {
    const { store } = useContext(GlobalStoreContext);
    return (
        <div
            id="playlister-banner"
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
            Playlister
            <EditToolbar />
        </div>
    );
}

export default Banner;
