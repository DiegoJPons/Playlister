const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
const auth = require("../auth");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
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
  console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
  console.log("delete " + req.params.id);
  Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        errorMessage: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          Playlist.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({});
          }).catch((err) => console.log(err));
        } else {
          console.log("incorrect user!");
          return res.status(400).json({
            errorMessage: "authentication error",
          });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
getPlaylistById = async (req, res) => {
  if (auth.verifyUser(req) === null) {
    return res.status(400).json({
      errorMessage: "UNAUTHORIZED",
    });
  }
  console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

  await Playlist.findById({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    console.log("Found list: " + JSON.stringify(list));

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);

        return res.status(200).json({
          success: true,
          playlist: list,
          userName: user.userName,
          avatar: user.avatar,
        });
      });
    }
    asyncFindUser(list);
  }).catch((err) => console.log(err));
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
      return res
        .status(404)
        .json({ success: false, error: `Playlists not found` });
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
        ownerId: owner._id,
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
  console.log("updatePlaylist: " + JSON.stringify(body));
  console.log("req.body.name: " + req.body.name);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        err,
        message: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          console.log("req.body.name: " + req.body.name);

          list.name = body.playlist.name;
          list.songs = body.playlist.songs;
          list
            .save()
            .then(() => {
              console.log("SUCCESS!!!");
              return res.status(200).json({
                success: true,
                id: list._id,
                message: "Playlist updated!",
              });
            })
            .catch((error) => {
              console.log("FAILURE: " + JSON.stringify(error));
              return res.status(404).json({
                error,
                message: "Playlist not updated!",
              });
            });
        } else {
          console.log("incorrect user in line 300!");
          return res
            .status(400)
            .json({ success: false, description: "authentication error" });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylistPairs,
  getPlaylistSearch,
  updatePlaylist,
};
