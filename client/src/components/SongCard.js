import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";

import Modal from "./Modal";

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editModalUp, setEditModalUp] = useState(false);
    const [delModalUp, setDelModalUp] = useState(false);

    const { song, index } = props;
    const [titleIn, setTitleIn] = useState("");
    const [artistIn, setArtistIn] = useState("");
    const [ytIdIn, setYtIdIn] = useState("");

    let cardClass = "list-card unselected-list-card";
    let card = (
        <div
            key={index}
            id={"song-" + index + "-card"}
            className={cardClass}
            onDoubleClick={(e) => {
                setEditModalUp(true);
                store.disableAll();
            }}
            draggable="true"
            onDragEnd={(e) => {
                props.dragEnder();
            }}
            onDragOver={(e) => {
                props.dragUpdater(index);
            }}
            onDragStart={() => {
                props.dragStarter(index);
            }}
        >
            {index + 1}.
            <a
                id={"song-" + index + "-link"}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}
            >
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={(e) => {
                    setDelModalUp(true);
                    store.disableAll();
                }}
                disabled={!store.activeButtons[1]}
            />
        </div>
    );
    if (editModalUp) {
        return (
            <>
                {card}

                <Modal
                    title="Edit Song"
                    confirm={() => {
                        store.editSong(
                            index,
                            {
                                title: song.title,
                                artist: song.artist,
                                youTubeId: song.youTubeId,
                            },
                            {
                                title: titleIn ? titleIn : "Untitled",
                                artist: artistIn ? artistIn : "Unknown",
                                youTubeId: ytIdIn ? ytIdIn : "dQw4w9WgXcQ",
                            }
                        );
                        setEditModalUp(false);
                    }}
                    cancel={() => {
                        store.reenable();
                        setEditModalUp(false);
                    }}
                >
                    <div className="edit-modal-grid">
                        <text style={{ gridRow: "1/2", gridColumn: "1/2" }}>
                            Title:
                        </text>
                        <input
                            type="text"
                            onChange={(e) => setTitleIn(e.target.value)}
                            style={{ gridRow: "1/2", gridColumn: "2/3" }}
                            placeholder="Untitled"
                            // value={titleIn ? titleIn : song.title}
                            defaultValue={song.title}
                        />
                        <text style={{ gridRow: "2/3", gridColumn: "1/2" }}>
                            Artist:
                        </text>
                        <input
                            type="text"
                            onChange={(e) => setArtistIn(e.target.value)}
                            style={{ gridRow: "2/3", gridColumn: "2/3" }}
                            placeholder="Unknown"
                            // value={artistIn ? artistIn : song.artist}
                            defaultValue={song.artist}
                        />
                        <text style={{ gridRow: "3/4", gridColumn: "1/2" }}>
                            You Tube Id:
                        </text>
                        <input
                            type="text"
                            onChange={(e) => setYtIdIn(e.target.value)}
                            style={{ gridRow: "3/4", gridColumn: "2/3" }}
                            placeholder="dQw4w9WgXcQ"
                            // value={ytIdIn ? ytIdIn : song.youTubeId}
                            defaultValue={song.youTubeId}
                        />
                    </div>
                </Modal>
            </>
        );
    } else if (delModalUp) {
        return (
            <>
                {card}
                <Modal
                    title="Delete Song"
                    confirm={() => {
                        store.deleteSong(index, {
                            title: song.title,
                            artist: song.artist,
                            youTubeId: song.youTubeId,
                        });

                        setDelModalUp(false);
                    }}
                    cancel={() => {
                        store.reenable();
                        setDelModalUp(false);
                    }}
                >
                    Are you sure you want to permanently delete{" "}
                    <span>{song.title}</span>?
                </Modal>
            </>
        );
    } else {
        return <>{card}</>;
    }
}

export default SongCard;
