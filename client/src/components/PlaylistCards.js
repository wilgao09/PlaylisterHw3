import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
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
        console.log(`card dragged from ${dragStart} and ended at ${dropInd}`);
        console.log(store);
        console.log("^^ store here? ^^");
        store.dragSong(store.currentList._id, dragStart, dropInd);
    };

    return (
        <div id="playlist-cards">
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

export default PlaylistCards;
