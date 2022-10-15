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

// function editSong(req, res) {
//     Playlist.findOne({ _id: req.params.id }, (err, list) => {
//         if (err) {
//             res.status(400).json({ success: false, err: err });
//         } else {
//             list.songs[req.params.ind] = req.body;
//             list.save().then(() => {
//                 res.status(201).json({
//                     success: true,
//                     playlist: list,
//                 });
//             });
//         }
//     });
// }

// function deleteSong(req, res) {
//     Playlist.deleteOne({ _id: req.params.id }, (err, list) => {
//         if (err) {
//             res.status(400).json({ success: false, err: err });
//         } else {
//             list.save().then(() => {
//                 res.status(200).json({
//                     success: true,
//                     playlist: list,
//                 });
//             });
//         }
//     });
// }

module.exports = {
    addSong,
    // editSong,
    // deleteSong,
};
