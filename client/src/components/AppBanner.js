import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const location = useLocation();

  const history = useHistory();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    auth.logoutUser();
  };

  const handleHouseClick = () => {
    store.closeCurrentList();
  };

  const handleLogin = () => {
    handleMenuClose();
    history.push("/login");
  };

  const menuId = "primary-search-account-menu";
  const loggedOutMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          "&:hover": {
            bgcolor: "rgb(216, 240, 247)",
          },
        }}
      >
        <Link
          to="/login/"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
            width: "100%",
          }}
        >
          Login
        </Link>
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          "&:hover": {
            bgcolor: "rgb(216, 240, 247)",
          },
        }}
      >
        <Link
          to="/register/"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
            width: "100%",
          }}
        >
          Create New Account
        </Link>
      </MenuItem>
    </Menu>
  );
  const loggedInMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={auth.user?.isGuest ? handleLogin : handleLogout}
        sx={{
          "&:hover": {
            bgcolor: "rgb(216, 240, 247)",
          },
        }}
      >
        {auth.user?.isGuest ? "Login" : "Logout"}
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          "&:hover": {
            bgcolor: "rgb(216, 240, 247)",
          },
        }}
      >
        <Link
          to={auth.user?.isGuest ? "/register" : "/edit-account/"}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
            width: "100%",
          }}
        >
          {auth.user?.isGuest ? "Create Account" : "Edit Account"}
        </Link>
      </MenuItem>
    </Menu>
  );

  let centerContent = "";
  let menu = loggedOutMenu;

  if (auth.loggedIn) {
    menu = loggedInMenu;
    if (location.pathname === "/" || location.pathname === "/song-catalog/") {
      centerContent = (
        <Box
          sx={{ display: "flex", alignItems: "center", height: "100%", mx: 2 }}
        >
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{
              p: 1,
              px: 2,
              mr: 2,
              bgcolor: "black",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(80, 80, 80, 1)",
              },
            }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                width: "100%",
              }}
            >
              Playlists
            </Link>
          </Button>
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{
              p: 1,
              px: 2,
              bgcolor: "#3A64C4",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            <Link
              to="/song-catalog/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                width: "100%",
              }}
            >
              Song Catalog
            </Link>
          </Button>
          <Typography
            variant="h3"
            component="div"
            ml={-25}
            sx={{
              textAlign: "center",
              width: "100%",
            }}
          >
            The Playlister
          </Typography>
        </Box>
      );
    }
  }

  function getAccountMenu(loggedIn) {
    if (loggedIn)
      return (
        <Avatar
          src={auth.user.avatar}
          sx={{
            bgcolor: "white",
            color: "#3A64C4",
            fontSize: 32,
            width: 60,
            height: 60,
            fontWeight: "bold",
          }}
        />
      );
    else return <Avatar sx={{ fontSize: 80, color: "white" }} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ height: "90px", display: { xs: "none", sm: "block" } }}
          >
            <Link
              to={"/"}
              onClick={auth.user?.isGuest ? handleLogout : handleHouseClick}
              style={{ textDecoration: "none" }}
            >
              <IconButton
                sx={{
                  mt: 2,
                  backgroundColor: "white",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <HomeIcon
                  sx={{
                    fontSize: 36,
                    color: "white",
                    stroke: "black",
                    strokeWidth: 2,
                  }}
                />
              </IconButton>
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }}>{centerContent}</Box>
          <Box
            sx={{
              alignItems: "center",
              display: { xs: "none", md: "flex", padding: 0 },
            }}
          >
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              sx={{ padding: 0 }}
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {getAccountMenu(auth.loggedIn)}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menu}
    </Box>
  );
}
