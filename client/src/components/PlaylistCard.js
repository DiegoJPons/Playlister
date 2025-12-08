import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function PlaylistCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { idNamePair } = props;

  const handleToggleExpand = (event) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
    store.setCurrentList(idNamePair._id);
  };
  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    store.markListForDeletion(id);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }

  function handleEditList(event, id) {
    event.stopPropagation();
    store.markListForEdit(id);
  }
  function handlePlayPlaylist(event, id) {
    event.stopPropagation();
    store.markListForPlay(id);
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }

  const SongListComponent = (
    <Box
      sx={{
        width: "90%",
        p: "10px 20px 20px 0px",
        borderTop: "1px solid #eee",
        "&: hover": {
          bgcolor: "#e9e9e9ff",
        },
      }}
    >
      {store.currentList?.songs?.length > 0 ? (
        store.currentList.songs.map((song, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: 20,
            }}
          >
            {`${index + 1}. ${song.title} by ${song.artist} (${song.year})`}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          This playlist has no songs.
        </Typography>
      )}
    </Box>
  );

  let cardElement = (
    <ListItem
      id={idNamePair._id}
      key={idNamePair._id}
      sx={{
        borderRadius: 5,
        border: "1px solid #b1b0b0ff",
        bgcolor: "white",
        marginTop: "15px",
        display: "flex",
        flexDirection: "column",
        p: 0,
        "&:hover": {
          bgcolor: "#e9e9e9ff",
          cursor: "pointer",
        },
      }}
      onClick={handleToggleExpand}
      style={{ transform: "translate(1%,0%)", width: "98%" }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", width: "100%", p: "10px" }}
      >
        <Avatar
          src={
            idNamePair.avatar ||
            "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
          }
          sx={{ width: 50, height: 50, mr: 2, ml: 2 }}
        />

        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
            {idNamePair.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "gray" }}>
            {idNamePair.userName || "JoeShmo"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "5px",
            "& .MuiButton-root": {
              p: 1,
              minWidth: "auto",
              fontSize: 15,
              "&:hover": { opacity: 1 },
            },
          }}
        >
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteList(event, idNamePair._id);
            }}
            sx={{
              padding: 3,
              textTransform: "none",
              bgcolor: "#D32F2F",
              color: "white",
              borderRadius: 3,
              "&:hover": { bgcolor: "#9e1515ff" },
            }}
          >
            Delete
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleEditList(event, idNamePair._id);
            }}
            aria-label="edit"
            sx={{
              padding: 3,
              textTransform: "none",
              bgcolor: "#3A64C4",
              color: "white",
              borderRadius: 3,
              "&:hover": { bgcolor: "#1e3d8fff" },
            }}
          >
            Edit
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleToggleEdit(event);
            }}
            aria-label="copy"
            sx={{
              padding: 3,
              textTransform: "none",
              bgcolor: "#077836",
              color: "white",
              borderRadius: 3,
              "&:hover": { bgcolor: "#064c23ff" },
            }}
          >
            Copy
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handlePlayPlaylist(event, idNamePair._id);
            }}
            aria-label="play"
            sx={{
              padding: 3,
              textTransform: "none",
              bgcolor: "#DE24BC",
              color: "white",
              borderRadius: 3,
              mr: 2,
              "&:hover": { bgcolor: "#b300b3ff" },
            }}
          >
            Play
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          p: "10px",
          pt: 0,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "#0084ff", fontWeight: "bold", ml: 2 }}
        >
          {idNamePair.listenersCount || "0"} Listeners
        </Typography>

        <Box sx={{ ml: "auto", pb: 0 }}>
          <IconButton size="small" onClick={handleToggleExpand}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      {isExpanded && SongListComponent}
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={"list-" + idNamePair._id}
        label="Playlist Name"
        name="name"
        autoComplete="Playlist Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default PlaylistCard;
