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
  Alert,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = `http://209.159.155.110:8000/sign?user=${form.username}&pwd=${form.password}&operacao=in`;

    try {
      const response = await fetch(url);
      const data = await response.json();
console.log("response", response)
console.log("data", data)
      if (response.ok && data.success === true) {
        setSuccess(true);
        localStorage.setItem("user", form.username);
        // Optionally redirect or trigger global state
        console.log("Login success");
      } else {
        setError(data.message || "Falha no login");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleSubmit}>
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

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Login realizado com sucesso!
            </Alert>
          )}

          <Button
            type="submit"
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            {loading ? <CircularProgress size={24} /> : "Entrar"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
