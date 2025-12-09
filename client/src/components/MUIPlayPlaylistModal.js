import { useContext, useState, useEffect, useCallback } from "react";
import GlobalStoreContext from "../store";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Avatar from "@mui/material/Avatar";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PauseIcon from "@mui/icons-material/Pause";
import YouTubePlayer from "./YoutubePlayer";

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "85%",
  bgcolor: "#B0FFB5",
  border: "3px solid #000",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const YOUTUBE_PLACEHOLDER_ID = "dQw4w9WgXcQ";

export default function MUIPlayPlaylistModal(props) {
  const { reloadView } = props;
  const { store } = useContext(GlobalStoreContext);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  let name = "";
  let owner = "The McKilla Gorilla";

  if (store.listMarkedForPlay) {
    name = store.listMarkedForPlay.name;
    owner = store.userName;
  }

  function handleCloseModal(event) {
    store.listMarkedForPlay = null;
    store.listIdMarkedForPlay = null;
    setCurrentSongId(null);
    store.hideModals();
    reloadView();
  }

  // For YouTube Player

  const youTubeIdList =
    store.listMarkedForPlay?.songs.map((song) => song.youTubeId) || [];

  useEffect(() => {
    if (store.listMarkedForPlay?.songs.length > 0 && currentSongId === null) {
      setCurrentSongId(store.listMarkedForPlay.songs[0]._id);
    }
  }, [store.listMarkedForPlay, currentSongId]);

  const handleAutoplayNextSong = useCallback(
    (nextYouTubeId) => {
      const nextSong = store.listMarkedForPlay?.songs.find(
        (song) => song.youTubeId === nextYouTubeId
      );
      if (nextSong) {
        setCurrentSongId(nextSong._id);
        setIsPlaying(true);
      }
    },
    [store.listMarkedForPlay?.songs]
  );

  const handlePlayerStatusChange = useCallback(
    (playerStatus) => {
      if (playerStatus === 1) {
        setIsPlaying(true);

        if (currentSongId) {
          store.incrementListensCount(currentSong.songId);
        }
      } else if (playerStatus === 2) {
        setIsPlaying(false);
      }
    },
    [currentSongId, store]
  );

  const currentSong = store.listMarkedForPlay?.songs.find(
    (song) => song._id === currentSongId
  );
  const youTubeIdToPlay = currentSong?.youTubeId || YOUTUBE_PLACEHOLDER_ID;

  function handleSongClick(songId) {
    setCurrentSongId(songId);
    setIsPlaying(true);
  }
  function handlePrevious(event) {
    event.stopPropagation();
    const playlistSongs = store.listMarkedForPlay?.songs;
    if (playlistSongs.length === 0) {
      return;
    }

    const currentSongIndex = playlistSongs.findIndex(
      (song) => song._id === currentSongId
    );

    let newIndex;
    if (currentSongIndex <= 0) {
      newIndex = playlistSongs.length - 1;
    } else {
      newIndex = currentSongIndex - 1;
    }
    const newSongId = playlistSongs[newIndex]._id;

    setCurrentSongId(newSongId);
    setIsPlaying(true);
  }
  function handlePlayPause(event) {
    event.stopPropagation();
    if (window.togglePlayPause) {
      window.togglePlayPause(isPlaying);
    }
    setIsPlaying(!isPlaying);
  }
  function handleNext(event) {
    event.stopPropagation();
    const playlistSongs = store.listMarkedForPlay?.songs || [];
    if (playlistSongs.length === 0) {
      return;
    }
    const currentSongIndex = playlistSongs.findIndex(
      (song) => song._id === currentSongId
    );

    let newIndex;
    if (currentSongIndex >= playlistSongs.length - 1) {
      newIndex = 0;
    } else {
      newIndex = currentSongIndex + 1;
    }

    const newSongId = playlistSongs[newIndex]._id;
    setCurrentSongId(newSongId);
    setIsPlaying(true);
  }

  return (
    <Modal
      open={store.currentModal === "PLAY_LIST"}
      slotProps={{
        backdrop: {
          style: { backgroundColor: "transparent" },
        },
      }}
    >
      <Box sx={style1}>
        {/* Dark Green Banner */}
        <Box
          sx={{
            bgcolor: "#0E8503",
            p: 2,
            width: "full",
            color: "white",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h2">
            Play Playlist
          </Typography>
        </Box>

        {/* Left Side White Box */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            p: 2,
            gap: "16px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              mt: 2,
              ml: 2,
              width: "50%",
              height: "94%",
              pr: 3,
              pt: 4,
              position: "relative",
              bgcolor: "white",
              borderRadius: 3,
            }}
          >
            {/* Avatar Icon, Playlist Name, and Owner user name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",

                alignItems: "flex-start",
              }}
            >
              <Avatar
                src={store.avatar}
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  ml: 2,
                }}
              />
              <Box>
                <Typography
                  sx={{ fontWeight: "bold", lineHeight: 1.2, fontSize: 20 }}
                  variant="h6"
                  component="h2"
                >
                  {name}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 0.5,
                    color: "black",
                    lineHeight: 1.2,
                    fontSize: 18,
                  }}
                >
                  {owner}
                </Typography>
              </Box>
            </Box>

            {/* List of Songs*/}

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "scroll",
                pb: 2,
                mt: 1,
                height: "88%",
              }}
            >
              {store.listMarkedForPlay?.songs.length > 0 ? (
                store.listMarkedForPlay.songs.map((song, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSongClick(song._id)}
                    sx={{
                      ml: 2,
                      mt: 1,
                      width: "95%",
                      bgcolor:
                        song._id === currentSongId ? "#FFD700" : "#FFF7B2",
                      borderRadius: 4,
                      border: "1px solid black",
                      p: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      textTransform: "none",
                      color: "black",
                      "&:hover": {
                        bgcolor: "#FFD700",
                      },
                    }}
                  >
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{
                        ml: 2,
                        pt: 1,
                        pb: 1,
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {`${index + 1}. ${song.title} by ${song.artist} (${
                        song.year
                      })`}
                    </Typography>
                  </Button>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ padding: 2, fontSize: 30, color: "text.secondary" }}
                >
                  This playlist has no songs.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Right Side Youtube Player */}
          <Box
            sx={{
              mt: 2,
              ml: 2,
              width: "50%",
              height: "94%",
              pr: 3,
              pt: 4,
              position: "relative",
            }}
          >
            <YouTubePlayer
              youtubeId={youTubeIdToPlay}
              playlist={youTubeIdList}
              onStatusChange={handlePlayerStatusChange}
              onNextSong={handleAutoplayNextSong}
            />
            <Box
              sx={{
                display: "flex",
                position: "absolute",
                top: 500,
                left: 300,
                width: "30%",
                height: "10%",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                onClick={handlePrevious}
                sx={{
                  bgcolor: "#D9D9D9",
                  color: "black",
                  minWidth: 80,
                  height: 60,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#c2c1c1ff",
                  },
                }}
              >
                <FastRewindIcon sx={{ fontSize: 40 }} />
              </Button>
              <Button
                variant="contained"
                onClick={handlePlayPause}
                sx={{
                  bgcolor: "#D9D9D9",
                  color: "black",
                  minWidth: 80,
                  height: 60,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#c2c1c1ff",
                  },
                }}
              >
                {isPlaying ? (
                  <PauseIcon sx={{ fontSize: 40 }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 40 }} />
                )}
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: "#D9D9D9",
                  color: "black",
                  minWidth: 80,
                  height: 60,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#c2c1c1ff",
                  },
                }}
              >
                <FastForwardIcon sx={{ fontSize: 40 }} />
              </Button>
            </Box>

            <Button
              type="button"
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: "20px",
                width: 160,
                position: "absolute",
                bottom: 30,
                right: 20,
                padding: 3,
                bgcolor: "#219653",
                borderRadius: 12,
                "&:hover": {
                  bgcolor: "#0E8503",
                },
              }}
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
