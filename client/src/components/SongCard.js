import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function SongCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { song, index } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const isSubMenuOpen = Boolean(subMenuAnchorEl);

  // Elipses menu functions
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleEditSong = (event) => {
    event.stopPropagation();
    handleMenuClose(null);
    store.showEditSongModal(song);
  };

  const handleRemoveFromCatalog = (event) => {
    event.stopPropagation();
    handleMenuClose(null);
    store.showRemoveSongModal(song);
  };

  const handleAddToPlaylist = (event) => {
    event.stopPropagation();
    store.loadIdNamePairs();
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchorEl(null);
  };

  const handleSelectPlaylist = (event, playlistId) => {
    event.stopPropagation();
    handleSubMenuClose();
    handleMenuClose(null);
    store.addSongToPlaylist(playlistId, song);
  };

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  function handleClick(event) {
    console.log("song card clicked, setting current song to " + song.title);
    event.stopPropagation();
    store.setCurrentPlayingSong(song);
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
    ...(store.currentSongToPlay &&
      store.currentSongToPlay._id === song._id && {
        bgcolor: "rgba(255, 212, 102, 1)",
      }),
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

        <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "1.0rem", color: "text.secondary" }}
        >
          Listens: {song.listensCount != null ? song.listensCount : "None"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "1.0rem", color: "text.secondary" }}
        >
          Playlists: {song.playlistCount != null ? song.playlistCount : "None"}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{
          sx: { padding: 0 },
        }}
      >
        <MenuItem
          sx={{
            "&:hover": {
              bgcolor: "rgba(200, 171, 255, 1)",
            },
          }}
          onClick={handleAddToPlaylist}
        >
          Add to Playlist
        </MenuItem>
        <MenuItem
          sx={{
            "&:hover": {
              bgcolor: "rgba(200, 171, 255, 1)",
            },
          }}
          onClick={handleEditSong}
        >
          Edit Song
        </MenuItem>
        <MenuItem
          sx={{
            "&:hover": {
              bgcolor: "rgba(200, 171, 255, 1)",
            },
          }}
          onClick={handleRemoveFromCatalog}
        >
          Remove from Catalog
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={subMenuAnchorEl}
        open={isSubMenuOpen}
        onClose={handleSubMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            maxHeight: 109,
            overflowY: "scroll",
          },
        }}
        MenuListProps={{
          sx: { padding: 0 },
        }}
      >
        {store.idNamePairs &&
          store.idNamePairs.map((playlist) => (
            <MenuItem
              key={playlist._id}
              onClick={(event) => handleSelectPlaylist(event, playlist._id)}
              sx={{
                bgcolor: "rgba(252, 206, 206, 1)",
                "&:hover": { bgcolor: "rgba(255, 136, 136, 1)" },
              }}
            >
              {playlist.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}

export default SongCard;
