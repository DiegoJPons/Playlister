const dotenv = require("dotenv").config({ path: __dirname + "/../../../.env" });
const mongoose = require("mongoose");

async function clearCollection(collection, collectionName) {
  try {
    await collection.deleteMany({});
    console.log(`${collectionName} cleared`);
  } catch (err) {
    console.error(`Error clearing ${collectionName}:`, err);
  }
}

function getRandom() {
  return Math.floor(Math.random() * 101);
}

function getRandomUser(users) {
  return users[Math.floor(Math.random() * users.length)];
}

async function resetMongo() {
  const Playlist = require("../../../models/playlist-model");
  const User = require("../../../models/user-model");
  const Song = require("../../../models/song-model");
  const testData = require("../PlaylisterData.json");

  console.log("Resetting the Mongo DB");

  await clearCollection(Playlist, "Playlist");
  await clearCollection(User, "User");
  await clearCollection(Song, "Song");

  const transformedUsers = testData.users.map((user) => ({
    userName: user.name,
    email: user.email,
    passwordHash:
      "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu",
    playlists: [],
  }));
  const insertedUsers = await User.insertMany(transformedUsers);
  console.log("User filled");
  const userMap = new Map();
  insertedUsers.forEach((user) => {
    userMap.set(user.email, user.userName);
  });

  const uniqueSongsMap = new Map();

  testData.playlists.forEach((playlist) => {
    playlist.songs.forEach((songData) => {
      const youTubeId = songData.youTubeId;
      const title = songData.title;
      const artist = songData.artist;
      const year = songData.year ? String(songData.year) : "";
      const combined = `${title}${artist}${year}`;

      if (combined) {
        if (!uniqueSongsMap.has(combined)) {
          uniqueSongsMap.set(combined, {
            title: songData.title,
            artist: songData.artist,
            year: songData.year,
            youTubeId: youTubeId,
            playlistCount: 1,
            listensCount: getRandom(),
            ownerId: getRandomUser(insertedUsers)._id,
          });
        } else {
          uniqueSongsMap.get(combined).playlistCount++;
        }
      }
    });
  });

  const songsToInsert = Array.from(uniqueSongsMap.values());
  const insertedSongs = await Song.insertMany(songsToInsert);
  console.log("Song filled");

  const songIdMap = new Map();
  insertedSongs.forEach((song) => {
    const year = song.year ? String(song.year) : "";
    const combined = `${song.title}${song.artist}${year}`;
    songIdMap.set(combined, song._id);
  });

  const strcturedLists = testData.playlists.map((playlist) => {
    const songsArray = playlist.songs
      .filter((song) => song && song.title && song.artist)
      .map((songData) => {
        const title = songData.title;
        const artist = songData.artist;
        const year = songData.year ? String(songData.year) : "";
        const combined = `${title}${artist}${year}`;
        const actualSongId = songIdMap.get(combined);
        return {
          songId: actualSongId,
          title: songData.title,
          artist: songData.artist,
          year: songData.year,
          youTubeId: songData.youTubeId,
        };
      });

    const ownerUserName = userMap.get(playlist.ownerEmail);

    return {
      ...playlist,
      songs: songsArray,
      listenersCount: getRandom(),
      userName: ownerUserName,
    };
  });

  const insertedPlaylists = await Playlist.insertMany(strcturedLists);
  console.log("Playlist filled");

  for (const user of insertedUsers) {
    const userPlaylists = insertedPlaylists.filter(
      (p) => p.ownerEmail === user.email
    );
    const playlistIds = userPlaylists.map((p) => p._id);
    await User.updateOne(
      { _id: user._id },
      { $set: { playlists: playlistIds } }
    );
  }
}

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    resetMongo();
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });
