/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require("express");
const PlaylistController = require("../controllers/playlist-controller");
const SongController = require("../controllers/song-controller");
const router = express.Router();

router.post("/playlist", PlaylistController.createPlaylist);
router.get("/playlist/:id", PlaylistController.getPlaylistById);
router.get("/playlists", PlaylistController.getPlaylists);
router.get("/playlistpairs", PlaylistController.getPlaylistPairs);

router.delete("/playlist/:id", PlaylistController.deletePlaylistById);

router.put("/playlist/:id/:name", PlaylistController.updatePlaylistNameById);

router.post("/playlist/song/:id/:ind", SongController.addSong);
router.put("/playlist/song/:id/:dstart/:dend", SongController.dragSong);
router.put("/playlist/song/:id/:ind", SongController.editSong);
router.delete("/playlist/song/:id/:ind", SongController.deleteSong);

module.exports = router;
