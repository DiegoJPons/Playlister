import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function SongCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { song, index } = props;

  function handleRemoveSong(event) {
    store.addRemoveSongTransaction(song, index);
  }
  function handleClick(event) {
    // DOUBLE CLICK IS FOR SONG EDITING
    if (event.detail === 2) {
      console.log("double clicked");
      store.showEditSongModal(index, song);
    }
  }
  const style1 = {
    bgcolor: "rgba(255, 247, 178, 1)",
    border: "3px solid rgb(255, 102, 102)",
    borderRadius: "10px",
    padding: "15px 20px 10px 20px",
    marginBottom: "12px",
    cursor: "pointer",
    "&:hover": {
      bgcolor: "rgba(255, 212, 102, 1)",
    },
  };

  return (
    <Box
      key={song._id || index}
      id={"song-" + index + "-card"}
      sx={style1}
      onClick={handleClick}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "600", flexGrow: 1 }}
        >
          {song.title} by {song.artist} ({song.year})
        </Typography>

        <IconButton size="small" onClick={handleRemoveSong} sx={{ p: 0 }}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "1.0rem", color: "text.secondary" }}
        >
          Listens: {song.listens ? song.listens.toLocaleString() : "None"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "1.0rem", color: "text.secondary" }}
        >
          Playlists: {song.playlists ? song.playlists.toLocaleString() : "None"}
        </Typography>
      </Box>
    </Box>
  );
}

export default SongCard;
