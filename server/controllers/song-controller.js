const Song = require("../models/song-model");
const auth = require("../auth");

async function getSongCatalog(req, res) {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("getSongCatalog");
  try {
    const songs = await Song.find({ ownerId: req.userId }).sort({ title: 1 });
    return res.status(200).json({
      success: true,
      songCatalog: songs,
    });
  } catch (error) {
    console.error("Error getting song catalog:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get the song catalog.",
    });
  }
}

module.exports = {
  getSongCatalog,
};
