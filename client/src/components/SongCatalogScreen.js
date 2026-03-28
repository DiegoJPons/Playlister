import { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store/index.js";
import AuthContext from "../auth/index.js";
import SongCard from "./SongCard.js";
import MUIRemoveSongModal from "./MUIRemoveSongModal.js";
import MUIEditSongModal from "./MUIEditSongModal.js";
import MUICreateSongModal from "./MUICreateSongModal.js";

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
import YouTubePlayer from "./YoutubePlayer.js";

const SongCatalogScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [searchData, setSearchData] = useState({
    title: "",
    artist: "",
    year: "",
  });

  const isGuest = auth.user?.isGuest;

  const [sortText, setSortText] = useState("Listens (Hi-Lo)");
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    store.loadSongCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount; `store` identity changes after every fetch and would loop
  }, []);

  const sortOptions = [
    "Listens (Hi-Lo)",
    "Listens (Lo-Hi)",
    "Playlist (Hi-Lo)",
    "Playlist (Lo-Hi)",
    "Title (A-Z)",
    "Title (Z-A)",
    "Artist (A-Z)",
    "Artist (Z-A)",
    "Year (Hi-Lo)",
    "Year (Lo-Hi)",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchData({ ...searchData, [name]: value });
  };
  function handleCreateNewSong() {
    store.showCreateSongModal();
  }

  const handleSearch = (e) => {
    e.preventDefault();
    store.searchSongCatalog(searchData);
  };

  const handleClear = (field) => {
    if (field) {
      const newSearchData = { ...searchData, [field]: "" };
      setSearchData(newSearchData);

      const allFieldsEmpty = Object.values(newSearchData).every(
        (value) => value === ""
      );
      if (allFieldsEmpty) {
        store.loadSongCatalog();
      } else {
        store.searchSongCatalog(newSearchData);
      }
    } else {
      const allCleared = {
        title: "",
        artist: "",
        year: "",
      };
      setSearchData(allCleared);
      store.loadSongCatalog();
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
    store.sortSongCatalog(optionDisplay);
  };

  let songCard = "";
  if (store.songCatalog && Array.isArray(store.songCatalog)) {
    songCard = (
      <List sx={{ width: "100%", mb: "20px" }}>
        {store.songCatalog.map((song, index) => (
          <SongCard key={song._id} song={song} index={index} />
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
          pt: 2,
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: "1000", color: "rgb(0, 127, 255)" }}
        >
          Songs Catalog
        </Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ width: "100%" }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="title"
                fullWidth
                id="title"
                label="by Title"
                variant="filled"
                onChange={handleChange}
                value={searchData.title}
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
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="artist"
                fullWidth
                id="artist"
                label="by Artist"
                variant="filled"
                onChange={handleChange}
                value={searchData.artist}
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
            <Grid item xs={10} sx={{ position: "relative", mb: 3 }}>
              <TextField
                name="year"
                fullWidth
                id="year"
                label="by Year"
                variant="filled"
                onChange={handleChange}
                value={searchData.year}
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
          </Grid>
          <Box
            sx={{
              position: "absolute",
              bottom: 340,
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
                fontSize: "20px",
                width: "30%",
                padding: 3,
                bgcolor: "rgba(31, 155, 192, 1)",
                borderRadius: 5,
              }}
              onClick={handleSearch}
            >
              <SearchIcon sx={{ pr: 1 }} />
              Search
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{
                fontSize: "20px",
                width: "30%",
                padding: 3,
                bgcolor: "rgba(31, 155, 192, 1)",
                borderRadius: 5,
              }}
              onClick={() => handleClear()}
            >
              Clear
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 565,
            left: 70,
            width: "600px",
            height: "600px",
          }}
        >
          <YouTubePlayer
            youtubeId={store.currentSongToPlay?.youTubeId || null}
          />
        </Box>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: "rgba(0, 0, 0, 0.2)",
        }}
      />

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
            {store.songCatalog?.length} Songs
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
            mb: 23,
          }}
        >
          {songCard}
        </Box>

        {!isGuest && (
          <Button
            type="button"
            variant="contained"
            sx={{
              fontSize: "20px",
              position: "absolute",
              bottom: 42,
              right: 620,
              padding: 3,
              bgcolor: "rgba(31, 155, 192, 1)",
              borderRadius: 5,
            }}
            onClick={handleCreateNewSong}
          >
            <AddCircleOutlineIcon sx={{ pr: 1 }} />
            New Song
          </Button>
        )}
      </Box>
      <MUIRemoveSongModal />
      <MUIEditSongModal />
      <MUICreateSongModal />
    </Box>
  );
};

export default SongCatalogScreen;
