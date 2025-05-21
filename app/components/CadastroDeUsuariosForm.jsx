"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function CadastroDeUsuariosForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", form);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Nome de usuário
        </Typography>
        <TextField
          fullWidth
          name="username"
          value={form.username}
          onChange={handleChange}
          variant="filled"
          placeholder="Digite seu usuário"
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Senha
        </Typography>
        <TextField
          fullWidth
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          variant="filled"
          placeholder="Digite sua senha"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        <Button
          variant="outlined"
          fullWidth
          onClick={handleSubmit}
          sx={{ textTransform: "none" }}
        >
          Cadastrar
        </Button>
      </Paper>
    </Box>
  );
}