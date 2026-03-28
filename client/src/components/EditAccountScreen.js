import { useContext, useEffect } from "react";
import AuthContext from "../auth";
import MUIErrorModal from "./MUIErrorModal";
import Copyright from "./Copyright";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useHistory } from "react-router-dom";

import { useState } from "react";

export default function EditAccountScreen() {
  const history = useHistory();
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userName: auth.user.userName || "",
    email: auth.user.email || "",
    password: "",
    passwordConfirm: "",
    avatarUrl: auth.user.avatar || "",
  });

  useEffect(() => {
    if (auth.user) {
      setFormData((prev) => ({
        ...prev,
        userName: auth.user.userName || "",
        email: auth.user.email || "",
        avatarUrl: auth.user.avatar || "",
      }));
    }
  }, [auth.user]);

  const handleCancel = () => {
    history.goBack();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await auth.updateUser(
      formData.userName,
      formData.password,
      formData.passwordConfirm,
      formData.avatarUrl
    );

    if (success) {
      history.goBack();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClear = (field) => {
    setFormData({ ...formData, [field]: "" });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const canComplete = () => {
    if (formData.userName.trim() === "") {
      return false;
    }

    const usernameChanged = formData.userName !== auth.user.userName;
    const avatarChanged = formData.avatarUrl !== auth.user.avatar;

    const passwordInput = formData.password.trim();
    const passwordConfirmInput = formData.passwordConfirm.trim();
    const passwordChanged = passwordInput !== "" || passwordConfirmInput !== "";

    if (!usernameChanged && !avatarChanged && !passwordChanged) {
      return false;
    }

    if (passwordInput === "" || passwordConfirmInput === "") {
      return false;
    }
    if (passwordChanged) {
      if (passwordInput === "" || passwordConfirmInput === "") {
        return false;
      }
    }

    return true;
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
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 50 }} />

        <Typography component="h1" variant="h4" sx={{ mt: 3 }}>
          Edit Account
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: 315,
            left: "32%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="User Avatar"
            src={formData.avatarUrl || auth.user.avatar}
            sx={{
              width: 60,
              height: 60,
              mb: 0.5,
            }}
          />
          <Button
            type="button"
            variant="contained"
            sx={{
              bgcolor: "black",
              fontSize: "0.8rem",
              padding: "2px 8px",
            }}
            onClick={() =>
              document.getElementById("avatar-upload-input").click()
            }
          >
            Select
          </Button>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload-input"
            type="file"
            onChange={handleAvatarChange}
          />
        </Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                autoComplete="fname"
                name="userName"
                required
                fullWidth
                id="userName"
                label="User Name"
                onChange={handleChange}
                value={formData.userName}
                autoFocus
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
                onClick={() => handleClear("userName")}
              />
            </Grid>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                variant="filled"
                sx={{ bgcolor: "rgb(216, 240, 247)" }}
              />
            </Grid>
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
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
            <Grid item xs={12} sx={{ position: "relative" }}>
              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="Password Confirm"
                type="password"
                id="passwordConfirm"
                autoComplete="new-password"
                value={formData.passwordConfirm}
                onChange={handleChange}
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
                onClick={() => handleClear("passwordConfirm")}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", gap: 2, mt: 4, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ flex: 1, bgcolor: "black" }}
              onClick={handleSubmit}
              disabled={!canComplete()}
            >
              Complete
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{ flex: 1, bgcolor: "black" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
      <Copyright sx={{ mt: 7 }} />
      {modalJSX}
    </Container>
  );
}
