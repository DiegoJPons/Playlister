const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SongSchema = require("./song-model");

const playlistSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    userName: { type: String, required: true },
    listenersCount: { type: Number, required: true, default: 0 },
    songs: {
      type: [
        {
          title: String,
          artist: String,
          year: Number,
          youTubeId: String,
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
