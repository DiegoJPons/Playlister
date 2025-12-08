import { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store/index.js";
import AuthContext from "../auth/index.js";
import PlaylistCard from "./PlaylistCard.js";
import MUIDeleteModal from "./MUIDeleteModal.js";
import MUIPlayPlaylistModal from "./MUIPlayPlaylistModal";
import MUIEditPlaylistModal from "./MUIEditPlaylistModal";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const PlaylistsScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [searchData, setSearchData] = useState({
    playlistName: "",
    userName: "",
    songTitle: "",
    songArtist: "",
    songYear: "",
  });

  const isGuest = auth.user.isGuest;
  const [sortText, setSortText] = useState("Listeners (Hi-Lo)");
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  const sortOptions = [
    "Listeners (Hi-Lo)",
    "Listeners (Lo-Hi)",
    "Playlist Name (A-Z)",
    "Playlist Name (Z-A)",
    "User Name (A-Z)",
    "User Name (Z-A)",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchData({ ...searchData, [name]: value });
  };
  function handleCreateNewList(id) {
    store.createNewList();
  }

  const handleSearch = (e) => {
    e.preventDefault();
    store.searchPlaylists(searchData);
  };

  const handleClear = (field) => {
    if (field) {
      const newSearchData = { ...searchData, [field]: "" };
      setSearchData(newSearchData);

      const allFieldsEmpty = Object.values(newSearchData).every(
        (value) => value === ""
      );
      if (allFieldsEmpty) {
        store.loadIdNamePairs();
      } else {
        store.searchPlaylists(newSearchData);
      }
    } else {
      const allCleared = {
        playlistName: "",
        userName: "",
        songTitle: "",
        songArtist: "",
        songYear: "",
      };
      setSearchData(allCleared);
      store.loadIdNamePairs();
    }
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (optionDisplay) => {
    setSortText(optionDisplay);
    handleSortClose();
    store.sortIdNamePairs(optionDisplay);
  };

  let listCard = "";
  if (store) {
    listCard = (
      <List sx={{ width: "100%", mb: "20px" }}>
        {store.idNamePairs.map((pair) => (
          <PlaylistCard key={pair._id} idNamePair={pair} selected={false} />
        ))}
      </List>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        p: 3,
        flexGrow: 1,
        height: "80vh",
      }}
    >
      <Box
        sx={{
          width: "50%",
          pr: 3,
          pt: 4,
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: "1000", color: "rgb(0, 127, 255)" }}
        >
          Playlists
        </Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ width: "100%" }}>
          <Grid container spacing={4} sx={{ mt: 5 }}>
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="playlistName"
                fullWidth
                id="playlistName"
                label="by Playlist Name"
                variant="filled"
                onChange={handleChange}
                value={searchData.playlistName}
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
                onClick={() => handleClear("playlistName")}
              />
            </Grid>
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="userName"
                fullWidth
                id="userName"
                label="by User Name"
                variant="filled"
                onChange={handleChange}
                value={searchData.userName}
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
                onClick={() => handleClear("userName")}
              />
            </Grid>
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="songTitle"
                fullWidth
                id="songTitle"
                label="by Song Title"
                variant="filled"
                onChange={handleChange}
                value={searchData.songTitle}
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
                onClick={() => handleClear("songTitle")}
              />
            </Grid>
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="songArtist"
                fullWidth
                id="songArtist"
                label="by Song Artist"
                variant="filled"
                onChange={handleChange}
                value={searchData.songArtist}
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
                onClick={() => handleClear("songArtist")}
              />
            </Grid>
            <Grid item xs={10} sx={{ position: "relative" }}>
              <TextField
                name="songYear"
                fullWidth
                id="songYear"
                label="by Song Year"
                variant="filled"
                onChange={handleChange}
                value={searchData.songYear}
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
                onClick={() => handleClear("songYear")}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "90%",
              display: "flex",
              gap: 20,
              mt: 4,
              mb: 1,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: "25px",
                width: "30%",
                padding: 2,
                bgcolor: "rgba(31, 155, 192, 1)",
                borderRadius: 5,
              }}
              onClick={handleSearch}
            >
              <SearchIcon sx={{ fontSize: 30, pr: 1 }} />
              Search
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: "25px",
                width: "30%",
                padding: 2,
                bgcolor: "rgba(31, 155, 192, 1)",
                borderRadius: 5,
              }}
              onClick={() => handleClear()}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: "rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Right Side */}
      <Box
        sx={{
          width: "50%",
          pl: 3,
          pt: 6,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", color: "black", mr: 1 }}
          >
            Sort:
          </Typography>
          <Link
            component="button"
            variant="h4"
            underline="hover"
            onClick={handleSortClick}
            id="sort-menu-button"
            aria-controls={isMenuOpen ? "sort-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
            sx={{
              fontWeight: "500",
              color: "rgb(0, 127, 255)",
              display: "flex",
              alignItems: "center",
              p: 0,
              m: 0,
              lineHeight: 1.5,
            }}
          >
            {sortText}
            <ArrowDropDownIcon sx={{ fontSize: 30 }} />
          </Link>

          <Typography
            variant="h4"
            sx={{ fontWeight: "600", color: "black", ml: "auto" }}
          >
            {store.idNamePairs.length} Playlists
          </Typography>
        </Box>

        <Menu
          id="sort-menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleSortClose}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleSortSelect(option)}
              selected={option === sortText}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "scroll",
            mb: 11,
          }}
        >
          {listCard}
        </Box>
        <MUIDeleteModal />
        <MUIPlayPlaylistModal />
        <MUIEditPlaylistModal />
        {!isGuest && (
          <Button
            type="button"
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "25px",
              position: "absolute",
              bottom: 10,
              right: 600,
              padding: 2,
              bgcolor: "rgba(31, 155, 192, 1)",
              borderRadius: 5,
            }}
            onClick={handleCreateNewList}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 30, pr: 1 }} />
            New Playlist
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PlaylistsScreen;
