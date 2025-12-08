import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import AuthContext from "../auth";

export default function WelcomeScreen() {
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  const handleGuest = () => auth.loginGuest();
  const handleLogin = () => history.push("/login");
  const handleRegister = () => history.push("/register");

  return (
    <Box
      sx={{
        width: "100%",
        height: "95%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: "5%",
        bgcolor: "#ffffe4",
      }}
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{ mb: 7, color: "rgba(0, 0, 0, 0.75)" }}
      >
        The Playlister
      </Typography>

      <QueueMusicIcon sx={{ fontSize: 300, mb: 7, color: "black" }} />

      <Box sx={{ display: "flex", gap: 3 }}>
        <Button
          variant="contained"
          onClick={handleGuest}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#222" } }}
        >
          Continue as Guest
        </Button>
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#222" } }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          onClick={handleRegister}
          sx={{ bgcolor: "black", "&:hover": { bgcolor: "#222" } }}
        >
          Create Account
        </Button>
      </Box>
    </Box>
  );
}
