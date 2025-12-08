const express = require("express");
const StoreController = require("../controllers/store-controller");
const SongController = require("../controllers/song-controller");
const router = express.Router();
const auth = require("../auth");

router.post("/playlist", auth.verify, StoreController.createPlaylist);
router.delete("/playlist/:id", auth.verify, StoreController.deletePlaylist);
router.get(
  "/playlist/search-result",
  auth.verify,
  StoreController.getPlaylistSearch
);
router.get("/playlist/:id", auth.verify, StoreController.getPlaylistById);
router.get("/playlistpairs", auth.verify, StoreController.getPlaylistPairs);
router.put("/playlist/:id", auth.verify, StoreController.updatePlaylist);
// Songs
router.get(
  "/songs/search-result",
  auth.verify,
  SongController.getSongCatalogSearch
);
router.get("/songs/catalog", auth.verify, SongController.getSongCatalog);
router.delete("/song/:id", auth.verify, SongController.removeSongFromCatalog);
router.post("/song/", auth.verify, SongController.createSong);
router.put("/song/:id", auth.verify, SongController.updateSong);
router.put("/playlist/:id/song", auth.verify, SongController.addSongToPlaylist);

module.exports = router;
