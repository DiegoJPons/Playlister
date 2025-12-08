import { useContext, useState, useEffect, useRef } from "react";
import GlobalStoreContext from "../store";
import { useHistory } from "react-router-dom";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

export default function MUIEditPlaylistModal() {
  const { store } = useContext(GlobalStoreContext);
  const [listName, setListName] = useState(
    store.listMarkedForEdit ? store.listMarkedForEdit.name : ""
  );

  const history = useHistory();

  const textFieldRef = useRef(null);

  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
  }

  function handleKeyDown(event) {
    if (event.code === "Enter") {
      store.changeListName(store.listMarkedForEdit._id, listName.trim());

      if (textFieldRef.current) {
        textFieldRef.current.blur();
      }
    }
  }

  const handleNameChange = (event) => {
    setListName(event.target.value);
  };

  const handleClear = () => {
    setListName("");
  };

  useEffect(() => {
    if (store.listMarkedForEdit) {
      setListName(store.listMarkedForEdit.name);
    }
  }, [store.listMarkedForEdit]);

  const handleCloseModal = (event) => {
    if (event) event.stopPropagation();
    store.closeCurrentList();
    store.loadIdNamePairs();
  };

  // DRAG AND DROP
  function handleDragStart(event, index) {
    event.dataTransfer.setData("song", index);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.preventDefault();
  }

  function handleDrop(event, targetIndex) {
    event.preventDefault();
    let sourceIndex = Number(event.dataTransfer.getData("song"));
    if (sourceIndex !== targetIndex) {
      store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
  }

  function handleRemoveSong(event, index) {
    event.preventDefault();
    store.addRemoveSongTransaction(store.listMarkedForEdit.songs[index], index);
  }

  function handleCopySong(event, index) {
    event.stopPropagation();
    store.addDuplicateSongTransaction(index);
  }

  function handleAddSong(event) {
    event.stopPropagation();
    history.push("/song-catalog/");
    store.hideModals();
  }

  return (
    <Modal
      open={store.currentModal === "EDIT_LIST"}
      slotProps={{
        backdrop: {
          style: { backgroundColor: "transparent" },
        },
      }}
    >
      <Box sx={style1}>
        {/* Banner */}
        <Box
          sx={{
            bgcolor: "#0E8503",
            p: 2,
            width: "full",
            color: "white",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h2">
            Edit Playlist
          </Typography>
        </Box>

        {/* List Name and Add Button */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "10%",
            gap: 10,
            margin: 2,
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "full",
              bgcolor: "#E6E0E9",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              value={listName}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              inputRef={textFieldRef}
              sx={{
                ml: 1,
                mr: 1,
                height: "100%",
                "& .MuiInputBase-root": {
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                },
                "& .MuiInputBase-input": {
                  marginBottom: "25px",
                  paddingLeft: "25px",
                },
              }}
              InputProps={{
                style: { fontSize: 40, fontWeight: "bold" },
              }}
            />
          </Box>
          <HighlightOffIcon
            sx={{
              fontSize: "40px",
              position: "absolute",
              right: 330,
              top: "14%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => handleClear()}
          />

          <Box
            sx={{
              width: "10%",
            }}
          >
            <Button
              sx={{
                width: "100%",
                padding: 4,
                ml: 2,
                bgcolor: "#6750A4",
                borderRadius: 13,
                color: "white",
                "&:hover": { bgcolor: "#513b8eff" },
              }}
              onClick={handleAddSong}
            >
              <AddIcon fontSize="large" />
              <MusicNoteIcon fontSize="large" />
            </Button>
          </Box>
        </Box>

        {/* Song List */}
        <Box
          sx={{
            height: "65%",
            bgcolor: "white",
            mt: 1,
            ml: 2,
            mr: 2,
            borderRadius: 4,
            border: "1px solid #545353ff",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              pb: 2,
              mt: 1,
              height: "95%",
            }}
          >
            {store.listMarkedForEdit?.songs.length > 0 ? (
              store.listMarkedForEdit.songs.map((song, index) => (
                <Box
                  key={index}
                  id={"song-" + index + "-card"}
                  draggable="true"
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(event) => handleDrop(event, index)}
                  sx={{
                    ml: 2,
                    mt: 1,
                    width: "95%",
                    borderRadius: 4,
                    border: "1px solid black",
                    bgcolor: "#FFF7B2",
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                      maxWidth: "80%",
                    }}
                  >
                    {`${index + 1}. ${song.title} by ${song.artist} (${
                      song.year
                    })`}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 0,
                      mr: 1,
                    }}
                  >
                    <Button
                      sx={{
                        color: "black",
                        p: 1,
                        "&:hover": { bgcolor: "#FFF7B2" },
                      }}
                      onClick={(event) => handleCopySong(event, index)}
                    >
                      <ContentCopyIcon sx={{ fontSize: 35 }} />
                    </Button>
                    <Button
                      sx={{
                        color: "black",
                        p: 1,
                        "&:hover": { bgcolor: "#FFF7B2" },
                      }}
                      onClick={(event) => handleRemoveSong(event, index)}
                    >
                      <CloseIcon sx={{ fontSize: 35 }} />
                    </Button>
                  </Box>
                </Box>
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

        {/* Footer Buttons */}
        <Box
          sx={{
            height: "10%",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
            ml: 2,
            mr: 2,
          }}
        >
          <Button
            sx={{
              textTransform: "none",
              fontSize: "25px",
              mt: 2,
              height: "70%",
              width: "10%",
              bgcolor: "#6750A4",
              borderRadius: 10,
              color: "white",
              "&:hover": { bgcolor: "#513b8eff" },
            }}
            onClick={handleUndo}
          >
            <UndoIcon sx={{ mr: 2 }} /> Undo
          </Button>
          <Button
            sx={{
              fontSize: "25px",
              textTransform: "none",
              mt: 2,
              ml: 2,
              height: "70%",
              width: "10%",
              bgcolor: "#6750A4",
              borderRadius: 10,
              color: "white",
              "&:hover": { bgcolor: "#513b8eff" },
            }}
            onClick={handleRedo}
          >
            <RedoIcon sx={{ mr: 2 }} /> Redo
          </Button>

          <Button
            sx={{
              fontSize: "25px",
              textTransform: "none",
              mt: 2,
              ml: 135,
              height: "70%",
              width: "10%",
              bgcolor: "rgba(33, 150, 83, 1)",
              borderRadius: 10,
              color: "white",
              "&:hover": { bgcolor: "rgba(21, 112, 60, 1)" },
            }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
