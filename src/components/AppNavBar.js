import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";

import { useAuth } from "../contexts/AppProvider";

const publicPages = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/sign-up" },
];

const privatePages = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Messages", href: "/messages" },
];

export const AppNavBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setUser, setIsLoggedIn } = useAuth();

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser();
    setIsLoggedIn(false);
    handleCloseDrawer();

    navigate("/login", { replace: true });
  };

  const renderNavLinks = (pages) =>
    pages.map(({ label, href }) => (
      <Button
        key={label}
        onClick={() => {
          handleCloseDrawer();
          navigate(href, { replace: true });
        }}
        sx={{ color: "white", display: "block" }}
      >
        {label}
      </Button>
    ));

  const renderLogout = () => (
    <Button
      variant="outlined"
      onClick={handleLogout}
      sx={{
        my: 2,
        color: "white",
        display: "block",
        marginLeft: "auto",
      }}
    >
      Logout
    </Button>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0A1929" }}>
      <Container maxWidth="xl">
        <Drawer anchor="top" open={openDrawer} onClose={handleCloseDrawer}>
          {!isLoggedIn && (
            <Stack
              spacing={3}
              alignItems="center"
              justifyContent="center"
              sx={{ py: 3, backgroundColor: "#0A1929" }}
            >
              {renderNavLinks(publicPages)}
            </Stack>
          )}
          {isLoggedIn && (
            <Stack
              spacing={3}
              alignItems="center"
              justifyContent="center"
              sx={{ py: 3, backgroundColor: "#0A1929" }}
            >
              {renderNavLinks(privatePages)}
              {renderLogout()}
            </Stack>
          )}
        </Drawer>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenDrawer}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {!isLoggedIn && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {renderNavLinks(publicPages)}
            </Box>
          )}
          {isLoggedIn && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {renderNavLinks(privatePages)}
              {renderLogout()}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
