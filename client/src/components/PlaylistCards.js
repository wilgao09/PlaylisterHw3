import { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import SongCard from "./SongCard.js";
import { GlobalStoreContext } from "../store";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    const [dragStart, setDragStart] = useState(-1);
    const [dropInd, setDropInd] = useState(-1);

    let dropCardHandler = () => {
        if (dragStart === -1 || dropInd == -1) return;
        if (dropInd === dragStart) {
            setDragStart(-1);
            return;
        }
        store.dragSong(dragStart, dropInd);
    };
    const { id } = useParams();
    if (store.currentList == null) {
        store.setCurrentList(id);
        // alert("maybe " + window.location.pathname.split("/")[2]);
        // store.setCurrentList(window.location.pathname.split("/")[2]);
        return (
            <div style={{ fontSize: "40pt", color: "red" }}>
                <p> 404 RESOURCE NOT FOUND </p>
                <p>Failed to find playlist with id {id}</p>
            </div>
        );
    } else {
        return (
            <div
                id="playlist-cards"
                tabIndex={-1}
                onKeyDown={(e) => {
                    console.log("pressed");
                    if (store.activeButtons[1] && e.ctrlKey) {
                        if (e.code == "KeyY") store.redo();
                        if (e.code == "KeyZ") store.undo();
                    }
                }}
            >
                {store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={"playlist-song-" + index}
                        key={"playlist-song-" + index}
                        index={index}
                        song={song}
                        dragStarter={setDragStart}
                        dragEnder={dropCardHandler}
                        dragUpdater={setDropInd}
                    />
                ))}
            </div>
        );
    }
}

export default PlaylistCards;
