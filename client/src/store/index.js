import { createContext, useState } from "react";
import jsTPS from "../common/jsTPS";
import api from "../api";
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    DELETE_LIST: "DELETE_LIST",
    SONG: {
        DELETE: "SONG_DELETE",
        EDIT: "SONG_EDIT",
        ADD: "SONG_ADD",
        DRAG: "SONG_DRAG",
    },
    MODAL_UP: "MODAL_UP",
    MODAL_DOWN: "MODAL_DOWN",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        activeButtons: [true, false, false, false, false],
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    activeButtons: [true, false, false, false, false],
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    activeButtons: [true, false, false, false, false],
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    activeButtons: [false, true, false, false, true],
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    activeButtons: [true, false, false, false, false],
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    activeButtons: store.activeButtons, //TODO:
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    activeButtons: [false, true, false, false, true],
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    activeButtons: [false, false, false, false, false],
                });
            }
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    activeButtons: [true, false, false, false, false],
                });
            }
            case GlobalStoreActionType.SONG.ADD:
            case GlobalStoreActionType.SONG.EDIT:
            case GlobalStoreActionType.SONG.DELETE:
            case GlobalStoreActionType.SONG.DRAG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive, //TODO: what does this do?
                    activeButtons: [
                        false,
                        true,
                        tps.hasTransactionToUndo(),
                        tps.hasTransactionToRedo(),
                        true,
                    ],
                });
            }
            case GlobalStoreActionType.MODAL_UP:
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    activeButtons: [false, false, false, false, false],
                });
            case GlobalStoreActionType.MODAL_DOWN:
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    activeButtons: payload
                        ? [true, false, false, false, false]
                        : [
                              false,
                              true,
                              tps.hasTransactionToUndo(),
                              tps.hasTransactionToRedo(),
                              true,
                          ],
                });
            default:
                return store;
        }
    };
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let res = await api.updatePlaylistNameById(id, newName);
        if (res.data.success) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: res.data.idNamePairs,
            });
        }
    };

    store.createNewList = function (
        dat = { name: `Untitled${store.newListCounter}`, songs: [] }
    ) {
        async function x() {
            let res = await api.createPlaylist(dat);
            if (res.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: res.data.playlist,
                });

                store.history.push("/playlist/" + res.data.playlist._id);
            }
        }

        x();
    };

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {},
        });
    };

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        tps.clearAllTransactions();
        async function asyncLoadIdNamePairs() {
            api.getPlaylistPairs()
                .then((response) => {
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray,
                        });
                    } else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                })
                .catch((err) => {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: [],
                    });
                });
        }
        asyncLoadIdNamePairs();
    };

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);

            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist,
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    };
    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    };
    store.undo = function () {
        tps.undoTransaction();
    };
    store.redo = function () {
        tps.doTransaction();
    };

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null,
        });
    };

    store.deleteList = function (id) {
        (async function () {
            api.deletePlaylistById(id)
                .then((res) => {
                    if (res.data.success) {
                        let ndata = res.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.DELETE_LIST,
                            payload: ndata,
                        });
                    }
                })
                .catch((err) => {
                    storeReducer({
                        type: GlobalStoreActionType.DELETE_LIST,
                        payload: [],
                    });
                });
        })();
    };

    store.addSongAux = function (ind, dat, cb = () => {}) {
        if (!store.currentList) return;
        (async function () {
            let res = await api.addSong(store.currentList._id, ind, dat);
            console.log("res is");
            console.log(res);
            if (res.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SONG.ADD,
                    payload: res.data.playlist,
                });
            } else {
                cb();
            }
        })();
    };

    store.editSongAux = function (ind, dat, cb = () => {}) {
        if (!store.currentList) return;
        (async function () {
            let res = await api.editSong(store.currentList._id, ind, dat);
            if (res.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SONG.EDIT,
                    payload: res.data.playlist,
                });
            } else {
                cb();
            }
        })();
    };

    store.dragSongAux = function (start, end, cb = () => {}) {
        if (!store.currentList) return;
        (async function () {
            let res = await api.dragSong(store.currentList._id, start, end);

            if (res.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SONG.DRAG,
                    payload: res.data.playlist,
                });
            } else {
                cb();
            }
        })();
    };

    // invariant: this is called only called by a doTransaction()
    store.deleteSongAux = function (ind, cb = () => {}) {
        if (!store.currentList) return;
        (async function () {
            let res = await api.deleteSong(store.currentList._id, ind);
            if (res.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SONG.DELETE,
                    payload: res.data.playlist,
                });
            } else {
                cb();
            }
        })();
    };

    store.addSong = function (
        ind = -1,
        dat = { title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ" }
    ) {
        if (ind == -1) ind = store.currentList.songs.length;
        tps.addTransaction({
            doTransaction: async () => {
                store.addSongAux(ind, dat, () => {
                    alert("Failed to do: Add Song");
                    tps.mostRecentTransaction--;
                });
            },
            undoTransaction: async () => {
                store.deleteSongAux(ind, () => {
                    alert("Failed to do: Undo Add Song");
                    tps.mostRecentTransaction++;
                });
            },
        });
    };

    store.editSong = function (ind, odata, ndata) {
        tps.addTransaction({
            doTransaction: () => {
                store.editSongAux(ind, ndata, () => {
                    alert("Failed to do: Edit Song");
                    tps.mostRecentTransaction--;
                });
            },
            undoTransaction: () => {
                store.editSongAux(ind, odata, () => {
                    alert("Failed to do: Undo Edit Song");
                    tps.mostRecentTransaction++;
                });
            },
        });
    };

    store.dragSong = function (start, end) {
        tps.addTransaction({
            doTransaction: () => {
                store.dragSongAux(start, end, () => {
                    alert("Failed to do: Drag Song");
                    tps.mostRecentTransaction--;
                });
            },
            undoTransaction: () => {
                store.dragSongAux(end, start, () => {
                    alert("Failed to do: Undo Drag Song");
                    tps.mostRecentTransaction++;
                });
            },
        });
    };

    store.deleteSong = function (ind, dat) {
        tps.addTransaction({
            doTransaction: async () => {
                store.deleteSongAux(ind, () => {
                    alert("Failed to do: Delete Song");
                    tps.mostRecentTransaction--;
                });
            },
            undoTransaction: async () => {
                store.addSongAux(ind, dat, () => {
                    alert("Failed to do: Undo Delete Song");
                    tps.mostRecentTransaction++;
                });
            },
        });
    };

    store.disableAll = function () {
        storeReducer({
            type: GlobalStoreActionType.MODAL_UP,
            payload: null,
        });
    };
    store.reenable = function (isFromMain = false) {
        storeReducer({
            type: GlobalStoreActionType.MODAL_DOWN,
            payload: isFromMain,
        });
    };

    store.hasUndo = () => tps.hasTransactionToUndo();
    store.hadRedo = () => tps.hasTransactionToRedo();

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
};
