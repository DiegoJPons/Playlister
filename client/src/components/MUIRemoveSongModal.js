import { useContext } from "react";
import GlobalStoreContext from "../store";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  height: "60%",
  bgcolor: "#B0FFB5",
  border: "3px solid #000",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export default function MUIRemoveSongModal() {
  const { store } = useContext(GlobalStoreContext);
  function handleRemoveSong(event) {
    event.stopPropagation();
    store.removeSongFromCatalog();
  }
  function handleCloseModal(event) {
    store.hideModals();
  }

  return (
    <Modal
      open={store.currentModal === "REMOVE_SONG_FROM_CATALOG"}
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
          <Typography sx={{ fontWeight: "1000" }} variant="h4" component="h2">
            Remove Song?
          </Typography>
        </Box>

        {/* Content */}
        <Box
          sx={{
            background: "rgb(172,79,198,0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40%",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{ color: "rgba(73, 69, 79, 1)", m: 13, textAlign: "center" }}
          >
            Are you sure you want to remove the song from the catalog?
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{ textAlign: "center", color: "rgba(73, 69, 79, 1)" }}
        >
          Doing so will remove it from all of your playlists.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
            gap: 5,
          }}
        >
          <Button
            sx={{
              textTransform: "none",
              color: "white",
              backgroundColor: "black",
              fontSize: 30,
              fontWeight: "bold",
              p: "5px",
              mt: "95px",
              ml: "95px",
              borderRadius: 6,
              pt: 1,
              pb: 1,
              pl: 6,
              pr: 6,
              "&:hover": {
                backgroundColor: "#464545ff",
              },
            }}
            onClick={handleRemoveSong}
          >
            Remove Song
          </Button>
          <Button
            sx={{
              textTransform: "none",
              color: "white",
              backgroundColor: "black",
              fontSize: 30,
              fontWeight: "bold",
              p: "5px",
              mt: "95px",
              mr: "95px",
              borderRadius: 6,
              pt: 1,
              pb: 1,
              pl: 15,
              pr: 15,
              "&:hover": {
                backgroundColor: "#464545ff",
              },
            }}
            onClick={handleCloseModal}
          >
            {" "}
            Cancel{" "}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
