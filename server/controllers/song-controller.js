const Playlist = require("../models/playlist-model");

function addSong(req, res) {
    Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            res.status(400).json({ success: false, err: err });
        } else {
            list.songs.push(req.body);
            list.save().then(() => {
                res.status(201).json({
                    success: true,
                    playlist: list,
                });
            });
        }
    });
}

function editSong(req, res) {
    Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            res.status(400).json({ success: false, err: err });
        } else {
            list.songs[req.params.ind] = req.body;
            list.save().then(() => {
                res.status(201).json({
                    success: true,
                    playlist: list,
                });
            });
        }
    });
}

function deleteSong(req, res) {
    Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            res.status(400).json({ success: false, err: err });
        } else {
            list.songs.splice(req.params.ind, 1);
            list.save().then(() => {
                res.status(200).json({
                    success: true,
                    playlist: list,
                });
            });
        }
    });
}

// let fs = require("fs");
// let debugfile = fs.openSync("../debug.json", "a+");
// let debug = (x) => {
//     fs.appendFileSync(debugfile, JSON.stringify(x));
// };
// fs.writeFileSync(fs.openSync("../debug.json", "w+"), "");

function dragSong(req, res) {
    let { id, dstart, dend } = req.params;

    Playlist.findOne({ _id: id }, (err, plist) => {
        if (err) {
            res.status(400).json({ success: false, err: err });
        } else {
            let t = plist.songs.splice(dstart, 1)[0];

            plist.songs.splice(dend, 0, t);

            console.log(plist);

            plist.save().then(() => {
                res.status(201).json({
                    success: true,
                    playlist: plist,
                    src: "DRAG_SONG",
                });
            });
        }
    });
}

module.exports = {
    addSong,
    editSong,
    deleteSong,
    dragSong,
};
