const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
const auth = require("../auth");

createPlaylist = (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  const body = req.body;
  console.log("createPlaylist body: " + JSON.stringify(body));
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Playlist",
    });
  }

  const playlist = new Playlist(body);
  console.log("playlist: " + playlist.toString());
  if (!playlist) {
    return res.status(400).json({ success: false, error: err });
  }

  User.findOne({ _id: req.userId }, (err, user) => {
    console.log("user found: " + JSON.stringify(user));
    user.playlists.push(playlist._id);
    user.save().then(() => {
      playlist
        .save()
        .then(() => {
          return res.status(201).json({
            playlist: playlist,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            errorMessage: "Playlist Not Created!",
          });
        });
    });
  });
};
deletePlaylist = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ errorMessage: "Playlist not found!" });
    }
    const user = await User.findOne({ email: playlist.ownerEmail });
    if (!user) {
      return res.status(400).json({ errorMessage: "Owner not found" });
    }
    if (String(user._id) !== String(req.userId)) {
      return res.status(400).json({ errorMessage: "authentication error" });
    }
    await Playlist.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (err) {
    console.error("deletePlaylist", err);
    return res.status(500).json({ errorMessage: "Server error" });
  }
};
getPlaylistById = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  try {
    const list = await Playlist.findById(req.params.id);
    if (!list) {
      return res
        .status(404)
        .json({ success: false, error: "Playlist not found" });
    }
    const user = await User.findOne({ email: list.ownerEmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Playlist owner not found" });
    }
    return res.status(200).json({
      success: true,
      playlist: list,
      userName: user.userName,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("getPlaylistById", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

copyPlaylist = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("copyPlaylist");
  const { id } = req.params;

  try {
    const playlist = await Playlist.findById(id);
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({ success: false, error: "user not found." });
    }

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, error: "playlist not found." });
    }

    const originalData = playlist.toObject();
    delete originalData._id;

    const newPlaylist = new Playlist(originalData);
    newPlaylist.name = playlist.name + "(Copy)";
    newPlaylist.ownerEmail = user.email;
    newPlaylist.userName = user.userName;
    newPlaylist.listenersCount = 0;
    await newPlaylist.save();

    return res.status(200).json({ success: true, playlist: newPlaylist });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Couldnt copy playlist" });
  }
};
incrementListenersCount = (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("incrementListenersCount");

  Playlist.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { listenersCount: 1 } },
    (err, list) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res.status(200).json({ success: true, playlist: list });
    }
  );
};
getPlaylistPairs = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("getPlaylistPairs");
  await User.findOne({ _id: req.userId }, (err, user) => {
    console.log("find user with id " + req.userId);
    async function asyncFindList(email) {
      console.log("find all Playlists owned by " + email);
      await Playlist.find({ ownerEmail: email }, (err, playlists) => {
        console.log("found Playlists: " + JSON.stringify(playlists));
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        if (!playlists) {
          console.log("!playlists.length");
          return res
            .status(404)
            .json({ success: false, error: "Playlists not found" });
        } else {
          console.log("Send the Playlist pairs");
          // PUT ALL THE LISTS INTO ID, NAME PAIRS
          let pairs = [];
          for (let key in playlists) {
            let list = playlists[key];
            let pair = {
              _id: list._id,
              ownerId: user._id,
              name: list.name,
              userName: user.userName,
              avatar: user.avatar,
              listenersCount: list.listenersCount,
            };
            pairs.push(pair);
          }
          return res.status(200).json({ success: true, idNamePairs: pairs });
        }
      }).catch((err) => console.log(err));
    }
    asyncFindList(user.email);
  }).catch((err) => console.log(err));
};

getPlaylistSearch = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }

  const { playlistName, userName, songTitle, songArtist, songYear } = req.query;

  const partialMatch = (target, query) => {
    if (!query) return true;
    return target && target.toLowerCase().includes(query.toLowerCase());
  };

  try {
    const playlists = await Playlist.find({});

    if (!playlists || playlists.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    let searchResults = playlists.filter((p) => {
      let matches = true;
      if (playlistName && !partialMatch(p.name, playlistName)) {
        matches = false;
        return false;
      }
      if (userName && !partialMatch(p.userName, userName)) {
        matches = false;
        return false;
      }

      const hasSongCriteria = songTitle || songArtist || songYear;
      if (hasSongCriteria) {
        const songMatches = p.songs.some((song) => {
          let songPasses = true;
          if (songTitle && !partialMatch(song.title, songTitle)) {
            songPasses = false;
          }
          if (songArtist && !partialMatch(song.artist, songArtist)) {
            songPasses = false;
          }
          if (songYear) {
            const yearInt = parseInt(songYear);
            if (song.year !== yearInt) {
              songPasses = false;
            }
          }
          return songPasses;
        });
        if (!songMatches) {
          matches = false;
          return false;
        }
      }
      return matches;
    });

    const listOwners = searchResults.map(async (p) => {
      const owner = await User.findOne(
        { email: p.ownerEmail },
        "avatar"
      ).exec();
      return {
        _id: p._id,
        name: p.name,
        ownerId: owner ? owner._id : null,
        userName: p.userName,
        avatar: owner ? owner.avatar : null,
        listenersCount: p.listenersCount,
      };
    });

    const results = await Promise.all(listOwners);

    return res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Error during playlist search." });
  }
};

updatePlaylist = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  const body = req.body;
  if (!body || !body.playlist) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found!" });
    }
    const user = await User.findOne({ email: playlist.ownerEmail });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, description: "Owner not found" });
    }
    if (String(user._id) !== String(req.userId)) {
      return res
        .status(400)
        .json({ success: false, description: "authentication error" });
    }
    playlist.name = body.playlist.name;
    playlist.songs = body.playlist.songs;
    await playlist.save();
    return res.status(200).json({
      success: true,
      id: playlist._id,
      message: "Playlist updated!",
    });
  } catch (error) {
    console.error("updatePlaylist", error);
    return res.status(500).json({
      success: false,
      message: "Playlist not updated!",
    });
  }
};
module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylistPairs,
  getPlaylistSearch,
  updatePlaylist,
  copyPlaylist,
  incrementListenersCount,
};
