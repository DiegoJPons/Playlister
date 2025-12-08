const Song = require("../models/song-model");
const Playlist = require("../models/playlist-model");
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

async function removeSongFromCatalog(req, res) {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { id } = req.params;

  try {
    const removedSong = await Song.findOneAndDelete({
      _id: id,
      ownerId: req.userId,
    });

    if (!removedSong) {
      return res.status(404).json({
        success: false,
        error: "Song not found.",
      });
    }

    await Playlist.updateMany(
      { "songs.songId": id },
      { $pull: { songs: { songId: id } } }
    );
    return res.status(200).json({
      success: true,
      song: removedSong,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to remove song",
    });
  }
}

async function createSong(req, res) {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
    });
  }

  const newSong = new Song(body);
  newSong.ownerId = req.userId;

  try {
    await newSong.save();

    return res.status(201).json({
      success: true,
      song: newSong,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to create song.",
    });
  }
}

async function updateSong(req, res) {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { id } = req.params;
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
    });
  }

  try {
    const songToUpdate = await Song.findOne({ _id: id, ownerId: req.userId });

    if (!songToUpdate) {
      return res.status(404).json({
        success: false,
      });
    }

    songToUpdate.title = body.title || songToUpdate.title;
    songToUpdate.artist = body.artist || songToUpdate.artist;
    songToUpdate.year = body.year || songToUpdate.year;
    songToUpdate.youTubeId = body.youTubeId || songToUpdate.youTubeId;

    await songToUpdate.save();

    return res.status(200).json({
      success: true,
      song: songToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
}

getSongCatalogSearch = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  const { title, artist, year } = req.query;
  const partialMatch = (target, query) => {
    if (!query) return true;
    return target && target.toLowerCase().includes(query.toLowerCase());
  };

  try {
    const songs = await Song.find({});

    if (!songs || songs.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: `Song catalog not found` });
    }

    let searchResults = songs.filter((song) => {
      if (title && !partialMatch(song.title, title)) {
        return false;
      }
      if (artist && !partialMatch(song.artist, artist)) {
        return false;
      }
      if (year) {
        const yearInt = parseInt(year);
        if (song.year !== yearInt) {
          return false;
        }
      }
      return true;
    });

    return res.status(200).json({ success: true, data: searchResults });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Error during song catalog search." });
  }
};

async function addSongToPlaylist(req, res) {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { id } = req.params;
  const { song } = req.body;

  if (!song) {
    return res.status(400).json({
      success: false,
      error: "Missing data.",
    });
  }

  try {
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: "Playlist not found.",
      });
    }

    playlist.songs.push(song);
    await playlist.save();

    return res.status(200).json({
      success: true,
      playlist: playlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error adding song to playlist.",
    });
  }
}

module.exports = {
  getSongCatalog,
  getSongCatalogSearch,
  removeSongFromCatalog,
  createSong,
  updateSong,
  addSongToPlaylist,
};
