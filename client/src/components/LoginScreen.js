import { useContext } from "react";
import AuthContext from "../auth";
import MUIErrorModal from "./MUIErrorModal";
import Copyright from "./Copyright";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    auth.loginUser(formData.get("email"), formData.get("password"));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClear = (field) => {
    setFormData({ ...formData, [field]: "" });
  };

  let modalJSX = "";
  console.log(auth);
  if (auth.errorMessage !== null) {
    modalJSX = <MUIErrorModal />;
  }
  console.log(modalJSX);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 50, mb: 2 }} />
        <Typography component="h1" variant="h4">
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 6 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
                value={formData.email}
                variant="filled"
                sx={{ bgcolor: "rgb(216, 240, 247)" }}
              />
              <HighlightOffIcon
                sx={{
                  position: "absolute",
                  right: 5,
                  top: "60%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => handleClear("email")}
              />
            </Grid>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={formData.password}
                variant="filled"
                sx={{ bgcolor: "rgb(216, 240, 247)" }}
              />
              <HighlightOffIcon
                sx={{
                  position: "absolute",
                  right: 5,
                  top: "60%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => handleClear("password")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "black" }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register/" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Box>

      {modalJSX}
    </Container>
  );
}
