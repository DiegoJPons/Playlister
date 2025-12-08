import { useContext, useState } from "react";
import GlobalStoreContext from "../store";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import Grid from "@mui/material/Grid";

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "70%",
  bgcolor: "#B0FFB5",
  border: "3px solid #000",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export default function MUICreateSongModal() {
  const { store } = useContext(GlobalStoreContext);
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    year: "",
  });

  function canComplete() {
    const { title, artist, year, youTubeId } = songData;
    return (
      title &&
      title.trim() !== "" &&
      artist &&
      artist.trim() !== "" &&
      year &&
      year.trim() !== "" &&
      youTubeId &&
      youTubeId.trim() !== ""
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSongData({ ...songData, [name]: value });
  };

  const handleComplete = (e) => {
    e.preventDefault();
    store.createNewSong(songData);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    store.hideModals();
  };

  const handleClear = (field) => {
    if (field) {
      const newSearchData = { ...songData, [field]: "" };
      setSongData(newSearchData);
    }
  };

  return (
    <Modal
      open={store.currentModal === "SHOW_CREATE_SONG_MODAL"}
      slotProps={{
        backdrop: {
          style: { backgroundColor: "transparent" },
        },
      }}
    >
      <Box sx={style1}>
        <Box
          sx={{
            bgcolor: "#0E8503",
            p: 2,
            width: "100%",
            color: "white",
          }}
        >
          <Typography sx={{ fontWeight: "1000" }} variant="h4" component="h2">
            Create New Song
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            overflowY: "auto",
            width: "80%",
            mx: "auto",
          }}
        >
          <Grid container spacing={2} sx={{ mt: 1, justifyContent: "center" }}>
            <Grid item xs={12} sm={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="title"
                fullWidth
                id="title"
                label="Title"
                variant="filled"
                onChange={handleChange}
                value={songData.title}
                sx={{
                  bgcolor: "rgb(216, 240, 247)",
                  "& .MuiFilledInput-root": {
                    width: "full",
                    height: "75px",
                  },
                  "& .MuiInputLabel-root": {
                    top: 10,
                    color: "black",
                    fontSize: "20px",
                  },
                }}
              />
              <HighlightOffIcon
                sx={{
                  fontSize: "40px",
                  position: "absolute",
                  right: 5,
                  top: "60%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => handleClear("title")}
              />
            </Grid>
            <Grid item xs={12} sm={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="artist"
                fullWidth
                id="artist"
                label="Artist"
                variant="filled"
                onChange={handleChange}
                value={songData.artist}
                sx={{
                  bgcolor: "rgb(216, 240, 247)",
                  "& .MuiFilledInput-root": {
                    width: "full",
                    height: "75px",
                  },
                  "& .MuiInputLabel-root": {
                    top: 10,
                    color: "black",
                    fontSize: "20px",
                  },
                }}
              />
              <HighlightOffIcon
                sx={{
                  fontSize: "40px",
                  position: "absolute",
                  right: 5,
                  top: "60%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => handleClear("artist")}
              />
            </Grid>
            <Grid item xs={12} sm={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="year"
                fullWidth
                id="year"
                label="Year"
                variant="filled"
                onChange={handleChange}
                value={songData.year}
                sx={{
                  bgcolor: "rgb(216, 240, 247)",
                  "& .MuiFilledInput-root": {
                    width: "full",
                    height: "75px",
                  },
                  "& .MuiInputLabel-root": {
                    top: 10,
                    color: "black",
                    fontSize: "20px",
                  },
                }}
              />
              <HighlightOffIcon
                sx={{
                  fontSize: "40px",
                  position: "absolute",
                  right: 5,
                  top: "60%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => handleClear("year")}
              />
            </Grid>
            <Grid item xs={12} sm={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="youTubeId"
                fullWidth
                id="youTubeId"
                label="YouTubeId"
                variant="filled"
                onChange={handleChange}
                value={songData.youTubeId}
                sx={{
                  bgcolor: "rgb(216, 240, 247)",
                  "& .MuiFilledInput-root": {
                    width: "full",
                    height: "75px",
                  },
                  "& .MuiInputLabel-root": {
                    top: 10,
                    color: "black",
                    fontSize: "20px",
                  },
                }}
              />
              <HighlightOffIcon
                sx={{
                  fontSize: "40px",
                  position: "absolute",
                  right: 5,
                  top: "60%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => handleClear("youTubeId")}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              mt: 4,
              mb: 5,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                fontSize: "20px",
                width: "30%",
                padding: 3,
                bgcolor: "black",
                borderRadius: 5,
              }}
              onClick={handleComplete}
              disabled={!canComplete()}
            >
              Complete
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{
                fontSize: "20px",
                width: "30%",
                padding: 3,
                bgcolor: "black",
                borderRadius: 5,
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
