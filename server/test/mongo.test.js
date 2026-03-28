import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  expect,
  test,
} from "vitest";
const dotenv = require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const User = require("../models/user-model");
const Playlist = require("../models/playlist-model");
const Song = require("../models/song-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECT).catch((e) => {
    console.error("Connection error", e.message);
  });
});

beforeEach(() => {});

afterEach(() => {});

afterAll(() => {});

/**
 * Vitest test to see if the Database Manager can read a User.
 */
test("Test #1) Reading a User from the Database", async () => {
  const testUserData = {
    userName: "readUser",
    email: "read@User.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const expectedUser = await User.create(testUserData);

  const actualUser = await User.findById(expectedUser._id);

  expect(expectedUser.userName, actualUser.userName);
  expect(expectedUser.email, actualUser.email);

  await User.findByIdAndDelete(expectedUser._id);
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test("Test #2) Creating a User in the Database", async () => {
  const testUserData = {
    userName: "createUser",
    email: "create@User.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const expectedUser = await User.create(testUserData);

  const actualUser = await User.findById(expectedUser._id);

  expect(expectedUser.userName, actualUser.userName);
  expect(expectedUser.email, actualUser.email);

  await User.findByIdAndDelete(expectedUser._id);
});

/**
 * Vitest test to see if the Database Manager can update a User
 */
test("Test #3) Updating a User in the Database", async () => {
  const testUserData = {
    userName: "updateUser",
    email: "update@User.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const expectedUser = await User.create(testUserData);
  const newUserName = "testUserUpdated";
  const newEmail = "user@updated.com";

  const updatedUser = await User.findByIdAndUpdate(
    expectedUser._id,
    {
      userName: newUserName,
      email: newEmail,
    },
    { new: true }
  );

  expect(updatedUser.userName).toBe(newUserName);
  expect(updatedUser.email).toBe(newEmail);

  await User.findByIdAndDelete(expectedUser._id);
});

/**
 * Vitest test to see if the Database Manager can delete a User
 */
test("Test #4) Deleting a User in the Database", async () => {
  const testUserData = {
    userName: "deleteUser",
    email: "delete@User.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const userToDelete = await User.create(testUserData);

  const userId = userToDelete._id;

  await User.findByIdAndDelete(userId);

  const actualUser = await User.findById(userId);

  expect(actualUser).toBeNull();
});
/**
 * Vitest test to see if the Database Manager can create a Playlist
 */
test("Test #5) Creating a Playlist in the Database", async () => {
  const playlistOwnerData = {
    userName: "createPlaylist",
    email: "create@Playlist.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const playlistOwner = await User.create(playlistOwnerData);
  const testPlaylistData = {
    name: "Test Playlist",
    songs: [
      {
        songId: new mongoose.Types.ObjectId(),
        title: "Test Song",
        artist: "Test Artist",
        year: 2020,
        youTubeId: "12345678",
      },
    ],
    ownerEmail: playlistOwner.email,
    userName: playlistOwner.userName,
    listenersCount: 0,
  };

  const playlist = await Playlist.create(testPlaylistData);
  expect(playlist.songs[0].title).toBe("Test Song");
  expect(playlist.songs[0].artist).toBe("Test Artist");
  expect(playlist.songs[0].year).toBe(2020);
  expect(playlist.songs[0].youTubeId).toBe("12345678");
  await Playlist.findByIdAndDelete(playlist._id);
  await User.findByIdAndDelete(playlistOwner._id);
});

/**
 * Vitest test to see if the Database Manager can read a Playlist
 */
test("Test #6) Reading a Playlist from the Database", async () => {
  const playlistOwnerData = {
    userName: "readPlaylist",
    email: "read@Playlist.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const playlistOwner = await User.create(playlistOwnerData);
  const testPlaylistData = {
    name: "Test Playlist",
    songs: [
      {
        songId: new mongoose.Types.ObjectId(),
        title: "Test Song",
        artist: "Test Artist",
        year: 2020,
        youTubeId: "12345678",
      },
    ],
    ownerEmail: playlistOwner.email,
    userName: playlistOwner.userName,
    listenersCount: 0,
  };

  const playlist = await Playlist.create(testPlaylistData);
  const actualPlaylist = await Playlist.findById(playlist._id);

  expect(actualPlaylist.songs[0].title).toBe("Test Song");
  expect(actualPlaylist.songs[0].artist).toBe("Test Artist");
  expect(actualPlaylist.songs[0].year).toBe(2020);
  expect(actualPlaylist.songs[0].youTubeId).toBe("12345678");
  await Playlist.findByIdAndDelete(playlist._id);
  await User.findByIdAndDelete(playlistOwner._id);
});

/**
 * Vitest test to see if the Database Manager can update a Playlist
 */
test("Test #7) Updating a Playlist from the Database", async () => {
  const playlistOwnerData = {
    userName: "updatePlaylist",
    email: "update@playlist.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const playlistOwner = await User.create(playlistOwnerData);
  const testPlaylistData = {
    name: "Initial Playlist",
    songs: [
      {
        songId: new mongoose.Types.ObjectId(),
        title: "Initial Title",
        artist: "Initial Artist",
        year: 2020,
        youTubeId: "12345678",
      },
    ],
    ownerEmail: playlistOwner.email,
    userName: playlistOwner.userName,
    listenersCount: 0,
  };

  const playlist = await Playlist.create(testPlaylistData);

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlist._id,
    {
      name: "Updated Playlist",
      songs: [
        {
          songId: new mongoose.Types.ObjectId(),
          title: "Updated Title",
          artist: "Updated Artist",
          year: 2020,
          youTubeId: "12345678",
        },
      ],
      ownerEmail: playlistOwner.email,
      userName: playlistOwner.userName,
      listenersCount: 0,
    },
    { new: true }
  );

  const actualUpdatedPlaylist = await Playlist.findById(playlist._id);

  expect(actualUpdatedPlaylist.name).toBe("Updated Playlist");
  expect(actualUpdatedPlaylist.songs[0].title).toBe("Updated Title");
  expect(actualUpdatedPlaylist.songs[0].artist).toBe("Updated Artist");
  expect(actualUpdatedPlaylist.songs[0].year).toBe(2020);
  expect(actualUpdatedPlaylist.songs[0].youTubeId).toBe("12345678");

  await Playlist.findByIdAndDelete(playlist._id);
  await User.findByIdAndDelete(playlistOwner._id);
});

/**
 * Vitest test to see if the Database Manager can delete a Playlist
 */
test("Test #8) Deleting a Playlist from the Database", async () => {
  const playlistOwnerData = {
    userName: "deletePlaylist",
    email: "delete@playlist.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const playlistOwner = await User.create(playlistOwnerData);
  const testPlaylistData = {
    name: "Test Delete Playlist",
    songs: [],
    ownerEmail: playlistOwner.email,
    userName: playlistOwner.userName,
    listenersCount: 0,
  };

  const playlist = await Playlist.create(testPlaylistData);

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlist._id);

  const actualPlaylist = await Playlist.findById(playlist._id);

  expect(actualPlaylist).toBeNull();
  await User.findByIdAndDelete(playlistOwner._id);
});

/**
 * Vitest test to see if the Database Manager can create a song
 */
test("Test #9) Creating a Song in the Database", async () => {
  const songOwnerData = {
    userName: "createSong",
    email: "create@song.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const songOwner = await User.create(songOwnerData);
  const testSongData = {
    title: "Test Song Title",
    artist: "Test Artist Name",
    year: 2023,
    youTubeId: "12345678",
    playlistCount: 1,
    listensCount: 500,
    ownerId: songOwner._id,
  };

  const song = await Song.create(testSongData);
  expect(song.title).toBe("Test Song Title");
  expect(song.artist).toBe("Test Artist Name");
  expect(song.year).toBe(2023);
  expect(song.youTubeId).toBe("12345678");

  await Song.findByIdAndDelete(song._id);
  await User.findByIdAndDelete(songOwner._id);
});
/**
 * Vitest test to see if the Database Manager can read a song
 */
test("Test #10) Reading a Song from the Database", async () => {
  const songOwnerData = {
    userName: "SongReader",
    email: "readr@Song.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const songOwner = await User.create(songOwnerData);
  const testSongData = {
    title: "Test Song Title",
    artist: "Test Artist Name",
    year: 2023,
    youTubeId: "12345678",
    playlistCount: 1,
    listensCount: 500,
    ownerId: songOwner._id,
  };

  const song = await Song.create(testSongData);
  const actualSong = await Song.findById(song._id);
  expect(actualSong.title).toBe("Test Song Title");
  expect(actualSong.artist).toBe("Test Artist Name");
  expect(actualSong.year).toBe(2023);
  expect(actualSong.youTubeId).toBe("12345678");

  await Song.findByIdAndDelete(song._id);
  await User.findByIdAndDelete(songOwner._id);
});

/**
 * Vitest test to see if the Database Manager can update a song
 */
test("Test #11) Updating a Song from the Database", async () => {
  const songOwnerData = {
    userName: "updateSong",
    email: "update@Song.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const songOwner = await User.create(songOwnerData);
  const testSongData = {
    title: "Initial Song Title",
    artist: "Initial Artist Name",
    year: 2023,
    youTubeId: "12345678",
    playlistCount: 1,
    listensCount: 500,
    ownerId: songOwner._id,
  };

  const song = await Song.create(testSongData);

  const updatedSong = await Song.findByIdAndUpdate(
    song._id,
    {
      title: "New Title",
      artist: "New Name",
      year: 2023,
      youTubeId: "12345678",
    },
    { new: true }
  );

  const actualSong = await Song.findById(song._id);
  expect(actualSong.title).toBe("New Title");
  expect(actualSong.artist).toBe("New Name");
  expect(actualSong.year).toBe(2023);
  expect(actualSong.youTubeId).toBe("12345678");

  await Song.findByIdAndDelete(song._id);
  await User.findByIdAndDelete(songOwner._id);
});

/**
 * Vitest test to see if the Database Manager can remove a song
 */
test("Test #12) Removing a Song from the Database", async () => {
  const songOwnerData = {
    userName: "removeSong",
    email: "remove@Song.com",
    passwordHash: "$2a$10$HASHEDPASSWORD12345",
    playlists: [],
  };

  const songOwner = await User.create(songOwnerData);
  const testSongData1 = {
    songId: new mongoose.Types.ObjectId(),
    title: "Test Song Title",
    artist: "Test Artist Name",
    year: 2023,
    youTubeId: "12345678",
  };

  const testSongData2 = {
    songId: new mongoose.Types.ObjectId(),
    title: "Test Song Title2",
    artist: "Test Artist Name2",
    year: 2023,
    youTubeId: "12345678",
  };

  const testPlaylistData = {
    name: "Test Playlist",
    songs: [testSongData1, testSongData2],
    ownerEmail: songOwner.email,
    userName: songOwner.userName,
    listenersCount: 0,
  };

  const playlist = await Playlist.create(testPlaylistData);
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlist._id,
    {
      $pull: {
        songs: {
          songId: testSongData1.songId,
        },
      },
    },
    { new: true }
  );

  const actualPlaylist = await Playlist.findById(playlist._id);
  expect(actualPlaylist.songs.length).toBe(1);

  await Playlist.findByIdAndDelete(playlist._id);
  await User.findByIdAndDelete(songOwner._id);
});
