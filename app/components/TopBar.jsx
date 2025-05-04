"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Stack,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Divider,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Image from "next/image";

const TopBar = ({ setIsLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#fff",
        borderBottom: "1px solid #ddd",
        zIndex: 999,
        position: "absolute",
        left: 0,
      }}
    >
      <Toolbar>
        <Stack
          width="100%"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Box
            sx={{
              position: "absolute",
              left: "2%",
              top: "2%",
              textAlign: "center",
              mb: 2,
            }}
          >
            <Image
              src="/assets/inn2Data_logo.jpeg"
              alt="Logo"
              width={130}
              height={60}
            />
          </Box>
          <IconButton onClick={handleMenuOpen}>
            <AccountCircle fontSize="large" sx={{ color: "#333" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Minha conta</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
